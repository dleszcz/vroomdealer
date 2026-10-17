import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VroomScout Admin',
    short_name: 'VroomLeads',
    description: 'Panel zarządzania leadami VroomScout dla Daniela',
    start_url: '/admin',
    scope: '/admin',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#020617',
    orientation: 'portrait',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
