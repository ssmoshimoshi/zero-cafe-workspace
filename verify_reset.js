const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const indexHtml = fs.readFileSync('index.html', 'utf8');
const jsApi = fs.readFileSync('JS-API.html', 'utf8');
const jsApp1 = fs.readFileSync('JS-App1.html', 'utf8');
const jsApp2 = fs.readFileSync('JS-App2.html', 'utf8');

let fullHtml = indexHtml
  .replace('<?!= include(\'JS-API\'); ?>', jsApi)
  .replace('<?!= include(\'JS-App1\'); ?>', jsApp1)
  .replace('<?!= include(\'JS-App2\'); ?>', jsApp2);

const dom = new JSDOM(fullHtml, { runScripts: "dangerously" });
const window = dom.window;

setTimeout(() => {
  try {
    const modal = window.document.getElementById('confirmResetModal');
    console.log("Reset Modal exists:", modal !== null);

    if (typeof window.getDailyFormTemplate === 'function') {
      const formHtml = window.getDailyFormTemplate();
      console.log("Reset Button in Daily Form:", formHtml.includes('confirmResetForm()'));
    } else {
      console.log("getDailyFormTemplate is not a function. Syntax error?");
    }
  } catch(e) {
    console.log("Error:", e);
  }
}, 500);
