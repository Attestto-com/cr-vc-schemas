import puppeteer from 'puppeteer';

const htmlPath = process.env.OUTPUT_HTML;
const pdfPath = process.env.OUTPUT_PDF;
const header = process.env.HEADER || 'Attestto Open';

if (!htmlPath || !pdfPath) {
  console.error('Usage: OUTPUT_HTML=<path> OUTPUT_PDF=<path> node html-to-pdf.mjs');
  process.exit(1);
}

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
await page.pdf({
  path: pdfPath,
  format: 'Letter',
  margin: { top: '2.5cm', right: '2cm', bottom: '2.5cm', left: '2cm' },
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: `<div style="font-size:8px;color:#999;width:100%;text-align:center;margin-top:10px;">${header}</div>`,
  footerTemplate: '<div style="font-size:8px;color:#999;width:100%;text-align:center;margin-bottom:10px;">Página <span class="pageNumber"></span> de <span class="totalPages"></span> — Abril 2026</div>',
});
await browser.close();
console.log(`PDF generated: ${pdfPath}`);
