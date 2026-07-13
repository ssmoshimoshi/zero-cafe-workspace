const fs = require('fs');
let content = fs.readFileSync('Partial-Dashboard-GM.html', 'utf8');
content = content.replace(/<script>/, '').replace(/<\/script>/, '').trim();

global.window = global;
global.AppState = {
  dashboardData: null,
  activeFilters: { outlet: "Semua", startDate: "", endDate: "" }
};

try {
  eval(content);
  console.log("Template defined successfully.");
  let html = window.getDashboardGMTemplate();
  console.log("Template executed successfully without dashboardData!");
  
  global.AppState.dashboardData = {
     targetOmset: 10000, omsetTotal: 5000, omsetBulanLalu: 4000,
     komplainTotal: 0, omsetYTD: 100, targetYTD: 200, transaksiTotal: 10,
     operasionalData: { kepatuhanSop: 90, totalTelat: 1, totalTeguran: 0, turnoverBarista: 0 }
  };
  let html2 = window.getDashboardGMTemplate();
  console.log("Template executed successfully WITH dashboardData!");
} catch (e) {
  console.error("ERROR:", e.name, e.message);
}
