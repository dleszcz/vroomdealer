import type { Metadata, Viewport } from 'next';
import { checkAdminSession } from '@/lib/admin-auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'VroomScout Admin • Panel Leadów',
  description: 'Mobilny dashboard zarządzania leadami VroomScout dla Daniela',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'VroomLeads',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#020617',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || '';
  const isLoginPage = pathname.includes('/admin/login');

  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated && !isLoginPage) {
    // If request is not for login page and not authenticated, redirect
    // (Note: in server component, check if we need redirect)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      {children}
    </div>
  );
}
