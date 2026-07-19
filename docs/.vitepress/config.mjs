import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Zero Cafe Tech Manual",
  description: "Buku Panduan Operasional & Teknis Zero Cafe",
  appearance: 'dark', // Default to dark mode to match Zero Vibe
  themeConfig: {
    logo: 'https://cdn-icons-png.flaticon.com/512/3124/3124092.png', // Coffee cup icon
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Panduan SPV', link: '/panduan-spv' },
      { text: 'Panduan GM', link: '/panduan-gm' }
    ],

    sidebar: [
      {
        text: 'Dokumentasi Utama',
        items: [
          { text: '1. Pengantar', link: '/pengantar' },
          { text: '2. Panduan Supervisor (SPV)', link: '/panduan-spv' },
          { text: '3. Panduan General Manager', link: '/panduan-gm' },
          { text: '4. Arsitektur Sistem', link: '/arsitektur-sistem' },
          { text: '5. Bantuan & FAQ', link: '/bantuan' }
        ]
      }
    ],

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ssmoshimoshi/zero-cafe-workspace' }
    ],
    
    footer: {
      message: 'Dikembangkan secara eksklusif untuk Zero Cafe.',
      copyright: 'Copyright © 2026 Acronimous Studio'
    }
  }
})
