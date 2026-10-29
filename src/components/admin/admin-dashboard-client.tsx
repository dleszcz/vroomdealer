'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  RefreshCw, 
  Search, 
  LogOut, 
  Calendar,
  Layers,
  Inbox,
  Flame,
  ArrowUpDown,
  Car
} from 'lucide-react';
import { logoutAction, updateLeadStatusAction } from '@/app/admin/actions';
import { createClient } from '@supabase/supabase-js';
import { assessMarketPrice, parsePriceAmount } from '@/lib/market-pricing';
import { LeadAdminCard } from './lead-admin-card';
import { PwaInstallPrompt } from './pwa-install-prompt';


interface AdminDashboardClientProps {
  initialLeads: any[];
}

const LOCAL_STATUS_STORAGE_KEY = 'vroom_admin_statuses_v1';

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ initialLeads }) => {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>(() => {
    // Merge localStorage overridden statuses if on client
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STATUS_STORAGE_KEY);
        if (saved) {
          const map = JSON.parse(saved);
          return initialLeads.map((l) => (map[l.id] ? { ...l, status: map[l.id] } : l));
        }
      } catch {
        // ignore
      }
    }
    return initialLeads;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [dealFilter, setDealFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date_desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STATUS_STORAGE_KEY);
      if (saved) {
        const map = JSON.parse(saved);
        setLeads((prev) => prev.map((l) => (map[l.id] ? { ...l, status: map[l.id] } : l)));
      }
    } catch {
      // ignore
    }
  }, []);

  // Real-time updates via Supabase
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const channel = supabase
      .channel('scout-leads-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'scout_leads' },
        (payload) => {
          const newLead = payload.new;
          setLeads((prev) => {
            // Check if already in list
            if (prev.some((l) => l.id === newLead.id)) return prev;
            return [newLead, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'scout_leads' },
        (payload) => {
          const updated = payload.new;
          setLeads((prev) =>
            prev.map((l) => (l.id === updated.id ? { ...l, ...updated } : l))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Background auto-refresh on focus & interval
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  }, [router]);

  useEffect(() => {
    // Auto-refresh when tab gains focus
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleRefresh();
      }
    };
    window.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', handleRefresh);

    // Auto-poll every 30 seconds
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => {
      window.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', handleRefresh);
      clearInterval(interval);
    };
  }, [handleRefresh]);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    // 1. Optimistic UI update
    setLeads((prev) =>
      prev.map((ld) => (ld.id === leadId ? { ...ld, status: newStatus } : ld))
    );

    // 2. Persist in localStorage immediately so it stays across refreshes
    try {
      const saved = localStorage.getItem(LOCAL_STATUS_STORAGE_KEY);
      const map = saved ? JSON.parse(saved) : {};
      map[leadId] = newStatus;
      localStorage.setItem(LOCAL_STATUS_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // ignore
    }

    // 3. Attempt database update
    await updateLeadStatusAction(leadId, newStatus);
  };

  // Filter and Sort leads
  const filteredLeads = leads
    .filter((lead) => {
      // 1. Status Filter
      if (statusFilter !== 'all') {
        const currentSt = lead.status || 'new';
        if (currentSt !== statusFilter) return false;
      }

      // 2. Date Filter
      if (dateFilter !== 'all') {
        const leadDate = new Date(lead.created_at);
        const now = new Date();
        const diffHours = (now.getTime() - leadDate.getTime()) / (1000 * 60 * 60);

        if (dateFilter === 'today') {
          const isSameDay = 
            now.getFullYear() === leadDate.getFullYear() &&
            now.getMonth() === leadDate.getMonth() &&
            now.getDate() === leadDate.getDate();
          if (!isSameDay) return false;
        } else if (dateFilter === 'yesterday') {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const isYesterday = 
            yesterday.getFullYear() === leadDate.getFullYear() &&
            yesterday.getMonth() === leadDate.getMonth() &&
            yesterday.getDate() === leadDate.getDate();
          if (!isYesterday) return false;
        } else if (dateFilter === '24h') {
          if (diffHours > 24) return false;
        } else if (dateFilter === '7d') {
          if (diffHours > 24 * 7) return false;
        } else if (dateFilter === '30d') {
          if (diffHours > 24 * 30) return false;
        }
      }

      // 3. Filtr poziomu okazji (Market Assessment)
      if (dealFilter !== 'all') {
        const numPrice = parsePriceAmount(lead.price_bracket, lead.condition_notes);
        const assessment = assessMarketPrice(lead.make_model, lead.year, numPrice);
        if (assessment.status !== dealFilter) return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (lead.make_model || '').toLowerCase();
        const city = (lead.city || '').toLowerCase();
        const name = (lead.customer_name || '').toLowerCase();
        const phone = (lead.customer_phone || '').replace(/\s+/g, '');

        return (
          title.includes(q) ||
          city.includes(q) ||
          name.includes(q) ||
          phone.includes(q.replace(/\s+/g, ''))
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sortowanie po dacie i godzinie (jako jeden sort)
      if (sortBy === 'date_asc') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      // Sortowanie po cenie
      if (sortBy === 'price_asc') {
        const pA = parsePriceAmount(a.price_bracket, a.condition_notes) ?? 0;
        const pB = parsePriceAmount(b.price_bracket, b.condition_notes) ?? 0;
        if (!pA && !pB) return 0;
        if (!pA) return 1;
        if (!pB) return -1;
        return pA - pB;
      }
      if (sortBy === 'price_desc') {
        const pA = parsePriceAmount(a.price_bracket, a.condition_notes) ?? 0;
        const pB = parsePriceAmount(b.price_bracket, b.condition_notes) ?? 0;
        if (!pA && !pB) return 0;
        if (!pA) return 1;
        if (!pB) return -1;
        return pB - pA;
      }
      // Domyślnie: najnowsze (data + godzina)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const countNew = leads.filter((l) => (l.status || 'new') === 'new').length;
  const countSent = leads.filter((l) => l.status === 'sent_to_buyer').length;
  const countBought = leads.filter((l) => l.status === 'bought').length;
  const countRejected = leads.filter((l) => l.status === 'rejected').length;

  const countDeals = leads.filter((l) => {
    const p = parsePriceAmount(l.price_bracket, l.condition_notes);
    return assessMarketPrice(l.make_model, l.year, p).status === 'deal';
  }).length;
  const countFair = leads.filter((l) => {
    const p = parsePriceAmount(l.price_bracket, l.condition_notes);
    return assessMarketPrice(l.make_model, l.year, p).status === 'fair';
  }).length;
  const countOverpriced = leads.filter((l) => {
    const p = parsePriceAmount(l.price_bracket, l.condition_notes);
    return assessMarketPrice(l.make_model, l.year, p).status === 'overpriced';
  }).length;
  const countUnpriced = leads.filter((l) => {
    const p = parsePriceAmount(l.price_bracket, l.condition_notes);
    return assessMarketPrice(l.make_model, l.year, p).status === 'unpriced';
  }).length;

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-3 sm:py-5 space-y-3 pb-24">
      {/* 1. Sleek Flat Header */}
      <header className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-white leading-tight">
                VroomScout Admin
              </h1>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Na żywo
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {leads.length} {leads.length === 1 ? 'zgłoszenie' : 'zgłoszeń'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/admin/cars"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <Car className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Flota aut</span>
          </Link>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
            title="Odśwież listę leadów"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          <form action={logoutAction}>
            <button
              type="submit"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition-all active:scale-95 cursor-pointer"
              title="Wyloguj"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </header>

      {/* 2. PWA Install & Push Notification Banner */}
      <PwaInstallPrompt />

      {/* 3. Filtry i Sortowanie w zwięzłych polach Select */}
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        {/* Filtr Statusu */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-9 px-2.5 pr-7 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer truncate"
          >
            <option value="all">Wszystkie statusy ({leads.length})</option>
            <option value="new">Nowe ({countNew})</option>
            <option value="sent_to_buyer">Wysłane ({countSent})</option>
            <option value="bought">Kupione ({countBought})</option>
            <option value="rejected">Odrzucone ({countRejected})</option>
          </select>
          <Layers className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filtr Poziomu Okazji */}
        <div className="relative">
          <select
            value={dealFilter}
            onChange={(e) => setDealFilter(e.target.value)}
            className="w-full h-9 px-2.5 pr-7 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer truncate"
          >
            <option value="all">Wszystkie okazje</option>
            <option value="deal">🔥 Okazje ({countDeals})</option>
            <option value="fair">⚖️ Średnia rynkowa ({countFair})</option>
            <option value="overpriced">⚠️ Zawyżona ({countOverpriced})</option>
            <option value="unpriced">Czeka na wycenę ({countUnpriced})</option>
          </select>
          <Flame className="w-3 h-3 text-amber-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filtr Daty / Czasu */}
        <div className="relative">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full h-9 px-2.5 pr-7 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer truncate"
          >
            <option value="all">Wszystkie daty</option>
            <option value="today">Dzisiaj</option>
            <option value="yesterday">Wczoraj</option>
            <option value="24h">Ostatnie 24h</option>
            <option value="7d">Ostatnie 7 dni</option>
            <option value="30d">Ostatnie 30 dni</option>
          </select>
          <Calendar className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sortowanie (Data + godzina, Cena) */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full h-9 px-2.5 pr-7 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer truncate"
          >
            <option value="date_desc">Data: od najnowszych</option>
            <option value="date_asc">Data: od najstarszych</option>
            <option value="price_asc">Cena: od najniższej</option>
            <option value="price_desc">Cena: od najwyższej</option>
          </select>
          <ArrowUpDown className="w-3 h-3 text-blue-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 4. Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Szukaj auta, miasta, klienta..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-8 pr-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
        />
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Licznik wyników wyszukiwania (jeśli filtry lub sortowanie aktywne) */}
      {(searchQuery || statusFilter !== 'all' || dateFilter !== 'all' || dealFilter !== 'all' || sortBy !== 'date_desc') && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
          <span>Znaleziono: <strong>{filteredLeads.length}</strong> z {leads.length}</span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setDateFilter('all');
              setDealFilter('all');
              setSortBy('date_desc');
            }}
            className="text-blue-400 hover:underline cursor-pointer font-semibold"
          >
            Wyczyść filtry i sortowanie
          </button>
        </div>
      )}


      {/* 5. Flat Leads Feed / List (No cards in cards!) */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden divide-y divide-slate-800/80">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <LeadAdminCard
              key={lead.id}
              lead={lead}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <div className="text-center py-10 px-4 space-y-2 text-slate-500">
            <Inbox className="w-6 h-6 mx-auto text-slate-600" />
            <p className="text-xs font-semibold text-slate-400">Brak pasujących leadów</p>
          </div>
        )}
      </div>
    </div>
  );
};
