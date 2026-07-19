import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Zero Cafe",
  description: "Buku Panduan Operasional & Teknis Zero Cafe App",
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', href: 'https://cdn-icons-png.flaticon.com/512/3124/3124092.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap', rel: 'stylesheet' }]
  ],
  themeConfig: {
    siteTitle: 'ZERO CAFE',

    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Panduan SPV',
        items: [
          { text: 'Laporan Harian', link: '/spv/laporan-harian' },
          { text: 'Laporan Mingguan', link: '/spv/laporan-mingguan' },
          { text: 'Laporan Bulanan', link: '/spv/laporan-bulanan' },
          { text: 'Pengaturan & Master Data', link: '/spv/pengaturan-master' }
        ]
      },
      {
        text: 'Panduan GM',
        items: [
          { text: 'Keuangan & KPI', link: '/gm/dashboard-keuangan' },
          { text: 'Operasional & QC', link: '/gm/operasional-layanan' },
          { text: 'SDM & Leaderboard', link: '/gm/sdm-evaluasi' }
        ]
      }
    ],

    sidebar: [
      {
        text: 'PENGANTAR',
        collapsed: true,
        items: [
          { text: 'Apa itu Zero Cafe App?', link: '/pengantar/apa-itu-zero-cafe' },
          { text: 'Login & Navigasi', link: '/pengantar/login-navigasi' }
        ]
      },
      {
        text: 'PANDUAN SUPERVISOR',
        collapsed: true,
        items: [
          { text: 'Laporan Harian (9 Tab)', link: '/spv/laporan-harian' },
          { text: 'Laporan Mingguan', link: '/spv/laporan-mingguan' },
          { text: 'Laporan Bulanan', link: '/spv/laporan-bulanan' },
          { text: 'Pengaturan & Master Data', link: '/spv/pengaturan-master' }
        ]
      },
      {
        text: 'PANDUAN GM / OWNER',
        collapsed: true,
        items: [
          { text: 'Keuangan & KPI', link: '/gm/dashboard-keuangan' },
          { text: 'Operasional & QC', link: '/gm/operasional-layanan' },
          { text: 'SDM & Leaderboard', link: '/gm/sdm-evaluasi' }
        ]
      },
      {
        text: 'DI BALIK LAYAR',
        collapsed: true,
        items: [
          { text: 'Mesin Analisis', link: '/arsitektur/mesin-analisis' },
          { text: 'Database & Folder', link: '/arsitektur/database-folder' },
          { text: 'Sistem Keamanan', link: '/arsitektur/sistem-keamanan' }
        ]
      },
      { text: 'BANTUAN & FAQ', link: '/bantuan' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Zero Cafe App — Internal Technical Manual',
      copyright: '© 2026 Acronimous Studio'
    },

    outline: {
      level: [2, 3],
      label: 'Di Halaman Ini'
    },

    docFooter: {
      prev: 'Sebelumnya',
      next: 'Berikutnya'
    },

    returnToTopLabel: 'Kembali ke atas'
  }
})
