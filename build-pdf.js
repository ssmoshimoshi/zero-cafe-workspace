const fs = require('fs');
const puppeteer = require('puppeteer');
const marked = require('marked');

(async () => {
  try {
    console.log('Membaca file Markdown...');
    const mdContent = fs.readFileSync('Panduan_Teknis_Zero_Cafe_v2.md', 'utf8');
    
    console.log('Mengkonversi Markdown ke HTML...');
    let htmlBody = marked.parse(mdContent);
    
    // THE MAGIC: DOM Manipulation for the Cover Page
    // Kita pecah HTML berdasarkan tag <hr> pertama saja
    const parts = htmlBody.split(/<hr[^>]*>/i);
    if (parts.length >= 2) {
      const coverContent = parts[0] + '<hr class="cover-divider">';
      const restContent = parts.slice(1).join('<hr>');
      htmlBody = `
        <div id="cover-page">
          <div class="cover-content">
            ${coverContent}
          </div>
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
        <style>
          /* BASE STYLES */
          body {
            font-family: 'Inter', sans-serif;
            color: #374151;
            line-height: 1.7;
            padding: 0;
            margin: 0;
            font-size: 11pt;
          }
          .container {
            max-width: 100%;
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Outfit', sans-serif;
            color: #171717;
          }

          /* COVER PAGE PITCH DECK STYLE */
          #cover-page {
            height: 90vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            page-break-after: always;
            padding: 0 2rem;
          }
          #cover-page h1 {
            font-size: 4rem;
            font-weight: 800;
            letter-spacing: -0.03em;
            color: #171717 !important;
            border: none;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
          }
          #cover-page h2 {
            font-size: 1.6rem;
            color: #4B5563 !important;
            font-family: 'Inter', sans-serif;
            margin-bottom: 3rem;
            font-weight: 500;
            letter-spacing: normal;
            border: none;
            padding: 0;
            background: none;
            box-shadow: none;
          }
          hr.cover-divider {
            width: 80px;
            border: 3px solid #171717;
            border-radius: 3px;
            margin: 3rem auto;
            background-color: #171717;
          }
          #cover-page p {
            font-size: 1.1rem;
            color: #6B7280;
            line-height: 2;
            max-width: 600px;
            margin: 0 auto;
          }
          #cover-page strong {
            color: #171717;
            font-weight: 700;
          }

          /* CONTENT TYPOGRAPHY & HIERARCHY */
          .content-body h1 {
            font-size: 2.2rem;
            border-bottom: 4px solid #171717;
            padding-bottom: 0.5rem;
            page-break-before: always;
            margin-top: 2rem;
            margin-bottom: 1.5rem;
          }
          
          /* BADGE STYLE FOR H2 (BAB BARU) */
          .content-body h2 {
            background-color: #171717;
            color: #ffffff !important;
            padding: 0.6rem 1.2rem;
            border-radius: 8px;
            display: inline-block;
            margin-top: 3.5rem;
            margin-bottom: 1.5rem;
            page-break-before: auto; /* Membiarkan mengalir natural */
            font-size: 1.5rem;
            letter-spacing: 0.02em;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          /* Force page break on specific major sections if needed, but usually natural flow is better */

          .content-body h3 {
            color: #111827 !important;
            border-bottom: 2px solid #E5E7EB;
            padding-bottom: 0.5rem;
            margin-top: 2.5rem;
            font-size: 1.3rem;
          }

          /* CALLOUT BOXES (BLOCKQUOTE) */
          blockquote {
            border-left: 6px solid #171717;
            color: #1F2937;
            background-color: #F3F4F6;
            padding: 1.2rem 1.5rem;
            margin: 2rem 0;
            page-break-inside: avoid;
            border-radius: 0 12px 12px 0;
            font-weight: 500;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          }
          blockquote strong {
            color: #000;
            font-family: 'Outfit', sans-serif;
            font-size: 1.1em;
            display: block;
            margin-bottom: 0.5rem;
          }

          /* SLEEK TABLES */
          table {
            border-collapse: separate;
            border-spacing: 0;
            width: 100%;
            margin: 2rem 0;
            page-break-inside: avoid;
            font-size: 10pt;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }
          th {
            background-color: #F9FAFB;
            color: #111827;
            font-weight: 700;
            padding: 1rem;
            text-align: left;
            border-bottom: 2px solid #E5E7EB;
          }
          td {
            padding: 1rem;
            border-bottom: 1px solid #E5E7EB;
          }
          tr:last-child td {
            border-bottom: none;
          }
          
          /* IMAGES / MERMAID CHARTS */
          img {
            border-radius: 12px;
            max-width: 100%;
            margin: 2rem auto;
            display: block;
            page-break-inside: avoid;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            border: 1px solid #F3F4F6;
          }
          
          /* CODE BLOCKS */
          code {
            font-family: 'Menlo', 'Monaco', monospace;
            background: #F3F4F6;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            color: #EF4444;
            font-size: 0.9em;
          }
          pre code {
            display: block;
            padding: 1rem;
            color: #1F2937;
            overflow-x: auto;
          }

          /* LISTS */
          ul, ol {
            padding-left: 1.5rem;
            margin-bottom: 1.5rem;
          }
          li {
            margin-bottom: 0.5rem;
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
    
    console.log('Mencetak PDF Premium (Pitch Deck Style)...');
    await page.pdf({
      path: 'Panduan_Teknis_Zero_Cafe_v2.pdf',
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 9px; color: #9CA3AF; width: 100%; text-align: right; padding-right: 2cm; font-family: 'Inter', sans-serif; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;">
          Zero Cafe App — Buku Panduan
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 9px; color: #6B7280; width: 100%; text-align: center; font-family: 'Inter', sans-serif; border-top: 1px solid #E5E7EB; padding-top: 5px; margin-left: 2cm; margin-right: 2cm; font-weight: 600;">
          Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span>
        </div>
      `,
      margin: {
        top: '2cm',
        bottom: '2cm',
        left: '2cm',
        right: '2cm'
      }
    });

    await browser.close();
    console.log('Sukses! PDF Pitch Deck Eksekutif berhasil dibuat.');
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
})();
