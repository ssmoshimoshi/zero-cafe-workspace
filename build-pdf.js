const fs = require('fs');
const puppeteer = require('puppeteer');
const marked = require('marked');

(async () => {
  try {
    console.log('Membaca file Markdown...');
    const mdContent = fs.readFileSync('Panduan_Teknis_Zero_Cafe_v2.md', 'utf8');
    
    console.log('Mengkonversi Markdown ke HTML...');
    let htmlBody = marked.parse(mdContent);
    
    // THE MAGIC: Membelah Halaman Sampul dan Halaman Isi
    const parts = htmlBody.split(/<hr[^>]*>/i);
    if (parts.length >= 2) {
      const coverContent = `
        <div class="cover-wrapper">
          <p class="brand-eyebrow">INTERNAL USE ONLY</p>
          <div class="cover-titles">
            ${parts[0]}
          </div>
        </div>
      `;
      const restContent = parts.slice(1).join('<hr>');
      htmlBody = `
        <div id="cover-page">
          ${coverContent}
        </div>
        <div class="content-body">
          ${restContent}
        </div>
      `;
    }

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;700;800&display=swap" rel="stylesheet">
        <style>
          /* 1. BASE SWISS MINIMALIST RESET */
          body {
            font-family: 'Inter', sans-serif;
            color: #374151;
            line-height: 1.8;
            padding: 0;
            margin: 0;
            font-size: 10pt;
            background: #ffffff;
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Outfit', sans-serif;
            color: #111827;
            margin: 0;
          }

          /* 2. SOLID BLACK COVER PAGE (THE "PITCH DECK" FRONT) */
          #cover-page {
            background-color: #111827; /* Hitam Pekat */
            color: white;
            height: 94vh;
            box-sizing: border-box;
            padding: 4rem;
            display: flex;
            flex-direction: column;
            page-break-after: always;
          }
          .cover-wrapper {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .brand-eyebrow {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            color: #9CA3AF;
            margin: 0;
          }
          .cover-titles h1 {
            font-size: 4.2rem;
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: -0.04em;
            color: #ffffff !important;
            margin: 0 0 1rem 0;
            text-transform: uppercase;
          }
          .cover-titles h2 {
            font-family: 'Inter', sans-serif;
            font-size: 1.3rem;
            font-weight: 400;
            color: #9CA3AF !important;
            margin: 0 0 4rem 0;
            letter-spacing: -0.01em;
          }
          .cover-titles p {
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            color: #9CA3AF;
            line-height: 1.8;
            border-top: 1px solid #374151;
            padding-top: 2rem;
            max-width: 400px;
          }
          .cover-titles strong {
            color: #ffffff;
            font-weight: 600;
          }

          /* 3. CLEAN WHITE CONTENT PAGES (SWISS TYPOGRAPHY) */
          .content-body {
            padding-top: 2rem;
          }
          .content-body h1 {
            font-size: 2.8rem;
            font-weight: 800;
            letter-spacing: -0.05em;
            color: #111827;
            margin: 4rem 0 2rem 0;
            page-break-before: always;
            line-height: 1.2;
          }
          
          /* H2 WITH TOP BORDER (Just like your reference image!) */
          .content-body h2 {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.03em;
            color: #111827 !important;
            margin: 4rem 0 1.5rem 0;
            border-top: 2px solid #111827; /* Garis horizontal hitam tegas di atas judul */
            padding-top: 1rem;
            page-break-after: avoid;
          }
          .content-body h3 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #111827;
            margin: 2rem 0 1rem 0;
          }

          /* 4. LISTS & TYPOGRAPHY */
          ul, ol {
            padding-left: 1.2rem;
            margin-bottom: 2rem;
          }
          li {
            margin-bottom: 0.5rem;
          }
          li::marker {
            font-weight: 700;
            color: #111827;
          }

          /* 5. TABLES (FLAT, NO SHADOWS, ONLY HORIZONTAL LINES) */
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 3rem 0;
            font-size: 9pt;
            page-break-inside: avoid;
          }
          th {
            text-align: left;
            font-weight: 700;
            color: #111827;
            padding: 1rem 0;
            border-bottom: 2px solid #111827;
          }
          td {
            padding: 1rem 0;
            border-bottom: 1px solid #E5E7EB;
            color: #4B5563;
            vertical-align: top;
          }
          tr:last-child td {
            border-bottom: 2px solid #111827; /* Garis penutup bawah tabel */
          }

          /* 6. CALLOUT BOXES (NO SHADOWS, SHARP BORDERS) */
          blockquote {
            margin: 3rem 0;
            padding: 1.5rem 2rem;
            border-left: 2px solid #111827;
            background-color: #F9FAFB;
            font-style: normal;
            color: #4B5563;
            page-break-inside: avoid;
          }
          blockquote strong {
            color: #111827;
            display: block;
            margin-bottom: 0.5rem;
            font-size: 9.5pt;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          /* 7. IMAGES & CODE (FLAT, NO SHADOWS) */
          img {
            max-width: 100%;
            margin: 3rem 0;
            display: block;
            border: 1px solid #F3F4F6;
          }
          code {
            font-family: 'Menlo', 'Monaco', monospace;
            font-size: 0.85em;
            background-color: #F3F4F6;
            color: #111827;
            padding: 0.2em 0.4em;
          }
          pre code {
            display: block;
            padding: 1.5rem;
            background-color: #F9FAFB;
            border-left: 2px solid #E5E7EB;
            overflow-x: auto;
          }
          hr {
            border: none;
            border-top: 1px solid #E5E7EB;
            margin: 3rem 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${htmlBody}
        </div>
      </body>
      </html>
    `;

    console.log('Menjalankan Puppeteer (Headless Browser)...');
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
    
    console.log('Mencetak PDF High-End Editorial Style...');
    await page.pdf({
      path: 'Panduan_Teknis_Zero_Cafe_v2.pdf',
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 7px; color: #9CA3AF; width: 100%; text-align: left; padding-left: 2cm; padding-right: 2cm; font-family: 'Inter', sans-serif; letter-spacing: 0.15em; text-transform: uppercase;">
          Zero Cafe App — Technical Manual
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 8px; color: #111827; width: 100%; text-align: right; font-family: 'Inter', sans-serif; padding-right: 2cm; padding-left: 2cm; font-weight: 700;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `,
      margin: {
        top: '2.5cm',
        bottom: '2.5cm',
        left: '2cm',
        right: '2cm'
      }
    });

    await browser.close();
    console.log('Sukses! PDF bergaya Swiss Minimalist berhasil dibuat.');
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
})();
