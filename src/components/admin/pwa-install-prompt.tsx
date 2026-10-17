'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Share, PlusSquare, X, Check, Sparkles } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isRegisteringPush, setIsRegisteringPush] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.log('SW registration note:', err));
    }

    // Check iOS and Standalone status
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIos(isIosDevice);

    const isAppStandalone =
      (window.navigator as any).standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isAppStandalone);

    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Twoja przeglądarka nie wspiera powiadomień. Aby działały na iPhone, zainstaluj aplikację na ekranie początkowym (iOS 16.4+).');
      return;
    }

    try {
      setIsRegisteringPush(true);
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);

      if (perm === 'granted') {
        // Trigger a welcoming notification
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          reg.showNotification('🚀 Powiadomienia VroomScout aktywne!', {
            body: 'Otrzymasz powiadomienie natychmiast, gdy pojawi się nowy lead.',
            icon: '/logo.png',
            tag: 'welcome-notification',
          });
        }
      }
    } catch (err) {
      console.error('Błąd rejestracji powiadomień:', err);
    } finally {
      setIsRegisteringPush(false);
    }
  };

  const handleSendTestNotification = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('🚗 Nowy lead: Ford Kuga (2018)', {
          body: 'Lokalizacja: Tuchola • 35 000 zł • Kliknij, aby otworzyć ofertę dla skupu.',
          icon: '/logo.png',
          data: { url: '/admin' },
          tag: 'test-lead-' + Date.now(),
        });
        setTestNotificationSent(true);
        setTimeout(() => setTestNotificationSent(false), 3000);
      }
    } catch (err) {
      console.error('Błąd testu powiadomienia:', err);
    }
  };

  if (dismissed) return null;

  // 1. If not in standalone mode on iOS: Show install instructions
  if (isIos && !isStandalone) {
    return (
      <div className="rounded-2xl bg-blue-950/70 border border-blue-800/80 p-3.5 sm:p-4 text-xs space-y-2.5 relative">
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 font-bold text-blue-300">
          <PlusSquare className="w-4 h-4 text-blue-400" />
          <span>Zainstaluj jako aplikację na iPhone (PWA)</span>
        </div>

        <p className="text-slate-300 leading-relaxed pr-6">
          Aby otrzymywać powiadomienia Push na iPhone i używać panelu w pełnym oknie:
        </p>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-medium text-slate-200">
          <span>1. Kliknij na dole ikonę <strong>Udostępnij</strong></span>
          <Share className="w-3.5 h-3.5 text-blue-400" />
          <span>➔ 2. Wybierz <strong>„Do ekranu początkowego”</strong></span>
        </div>
      </div>
    );
  }

  // 2. If in standalone mode (or already installed) and notifications not enabled:
  if (notificationPermission !== 'granted') {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/80 to-slate-900 border border-blue-800/80 p-3.5 sm:p-4 text-xs space-y-2 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white">
            <Bell className="w-4 h-4 text-blue-400" />
            <span>Powiadomienia Push o nowych leadach</span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-300 text-[11px] leading-relaxed">
          Włącz powiadomienia, aby Twój telefon wibrował natychmiast, gdy prywatny właściciel zgłosi nowe auto.
        </p>

        <button
          type="button"
          onClick={handleEnableNotifications}
          disabled={isRegisteringPush}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>{isRegisteringPush ? 'Włączanie...' : 'Włącz powiadomienia na telefonie'}</span>
        </button>
      </div>
    );
  }

  // 3. If notifications are granted: Show clean quick-test trigger
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
      <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
        <Check className="w-3.5 h-3.5" />
        <span>Powiadomienia Push aktywne</span>
      </div>
      <button
        type="button"
        onClick={handleSendTestNotification}
        className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
      >
        <Sparkles className="w-3 h-3" />
        <span>{testNotificationSent ? 'Wysłano test!' : 'Test powiadomienia'}</span>
      </button>
    </div>
  );
};
