import React from 'react';
import { checkAdminSession } from '@/lib/admin-auth';
import { enforceDeviceLock } from '@/lib/device-lock';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from '@/components/admin/admin-login-form';
import { Lock, ShieldCheck } from 'lucide-react';

interface AdminLoginPageProps {
  searchParams: Promise<{ pair?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { pair } = await searchParams;
  await enforceDeviceLock(pair);

  const isAuth = await checkAdminSession();
  if (isAuth) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand / Icon */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-1">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            VroomScout Admin
          </h1>
          <p className="text-xs text-slate-400">
            Dostęp autoryzowany tylko dla sparowanego urządzenia
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <AdminLoginForm />
        </div>

        {/* Safe notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Urządzenie sparowane • Sesja 30 dni</span>
        </div>
      </div>
    </div>
  );
}
