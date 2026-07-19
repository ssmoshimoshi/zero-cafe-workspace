const fs = require('fs');
const puppeteer = require('puppeteer');
const marked = require('marked');

(async () => {
  try {
    console.log('Membaca file Markdown...');
    const mdContent = fs.readFileSync('Panduan_Teknis_Zero_Cafe_v2_Rendered.md', 'utf8');
    
    console.log('Mengkonversi Markdown ke HTML...');
    const htmlBody = marked.parse(mdContent);
    
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            color: #374151;
            line-height: 1.6;
            padding: 0;
            margin: 0;
          }
          .container {
            max-width: 100%;
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Outfit', sans-serif;
            color: #171717;
          }
          h1 {
            border-bottom: 3px solid #171717;
            padding-bottom: 0.5rem;
            page-break-before: always;
            margin-top: 2rem;
          }
          h1:first-of-type {
            page-break-before: auto;
            margin-top: 0;
          }
          h2 {
            border-bottom: 1px solid #E5E7EB;
            padding-bottom: 0.3rem;
            page-break-before: always;
            margin-top: 2rem;
            color: #111827;
          }
          h2:first-of-type {
            page-break-before: auto;
          }
          a {
            color: #171717;
            text-decoration: underline;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 1.5rem 0;
            page-break-inside: avoid;
            font-size: 10pt;
          }
          th {
            background-color: #F9FAFB;
            color: #171717;
            font-weight: 600;
            padding: 0.75rem;
            border: 1px solid #E5E7EB;
            text-align: left;
          }
          td {
            padding: 0.75rem;
            border: 1px solid #E5E7EB;
          }
          img {
            border-radius: 8px;
            max-width: 100%;
            margin: 1rem 0;
            page-break-inside: avoid;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          blockquote {
            border-left: 4px solid #171717;
            color: #4B5563;
            background-color: #F9FAFB;
            padding: 1rem;
            margin: 1rem 0;
            page-break-inside: avoid;
            border-radius: 0 8px 8px 0;
          }
          code {
            font-family: monospace;
            background: #F3F4F6;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            color: #1F2937;
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
    
    console.log('Mencetak PDF Premium...');
    await page.pdf({
      path: 'Panduan_Teknis_Zero_Cafe_v2.pdf',
      format: 'A4',
      printBackground: true,
      margin: {
        top: '2cm',
        bottom: '2cm',
        left: '1.5cm',
        right: '1.5cm'
      }
    });

    await browser.close();
    console.log('Sukses! PDF Premium berhasil dibuat.');
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
})();
