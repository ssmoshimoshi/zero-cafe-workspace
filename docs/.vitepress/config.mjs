import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Zero Cafe Tech Manual",
  description: "Buku Panduan Operasional & Teknis Zero Cafe",
  appearance: 'dark', // Default to dark mode to match Zero Vibe
  themeConfig: {
    logo: 'https://cdn-icons-png.flaticon.com/512/3124/3124092.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Panduan SPV', link: '/spv/laporan-harian' },
      { text: 'Panduan GM', link: '/gm/dashboard-keuangan' }
    ],

    sidebar: [
      {
        text: 'Pengantar',
        collapsed: false,
        items: [
          { text: 'Apa itu Zero Cafe App?', link: '/pengantar/apa-itu-zero-cafe' },
          { text: 'Login & Navigasi', link: '/pengantar/login-navigasi' }
        ]
      },
      {
        text: 'Buku Panduan SPV',
        collapsed: false,
        items: [
          { text: 'Laporan Harian (9 Tab)', link: '/spv/laporan-harian' },
          { text: 'Laporan Mingguan', link: '/spv/laporan-mingguan' },
          { text: 'Laporan Bulanan', link: '/spv/laporan-bulanan' },
          { text: 'Pengaturan & Master Data', link: '/spv/pengaturan-master' }
        ]
      },
      {
        text: 'Buku Panduan GM (Owner)',
        collapsed: false,
        items: [
          { text: 'Tab 1: Keuangan & KPI', link: '/gm/dashboard-keuangan' },
          { text: 'Tab 2: Operasional & QC', link: '/gm/operasional-layanan' },
          { text: 'Tab 3: SDM & Leaderboard', link: '/gm/sdm-evaluasi' }
        ]
      },
      {
        text: 'Di Balik Layar',
        collapsed: true,
        items: [
          { text: 'Mesin Analisis (Algoritma)', link: '/arsitektur/mesin-analisis' },
          { text: 'Database & Folder', link: '/arsitektur/database-folder' },
          { text: 'Sistem Keamanan', link: '/arsitektur/sistem-keamanan' }
        ]
      },
      { text: 'Bantuan & FAQ', link: '/bantuan' }
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
