import re
with open('JS-App2.html', 'r') as f:
    content = f.read()

new_chart_setup = """
  const cData = AppState.dashboardData.chartData || [];
  const labels = cData.map(d => {
    const parts = d.date.split('-');
    return parts.length >= 3 ? `${parts[2]}/${parts[1]}` : d.date;
  });
  const data = cData.map(d => d.omset);
  
  // Dynamic color based on trend
  const omsetDiff = AppState.dashboardData.omsetTotal - (AppState.dashboardData.omsetBulanLalu || 0);
  const isPositive = omsetDiff >= 0;
  const mainColor = isPositive ? '#34d399' : '#f87171'; // emerald or red
  const gradientColor1 = isPositive ? 'rgba(52, 211, 153, 0.4)' : 'rgba(248, 113, 113, 0.4)';
  const gradientColor2 = isPositive ? 'rgba(52, 211, 153, 0.0)' : 'rgba(248, 113, 113, 0.0)';
  
  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 150);
  gradient.addColorStop(0, gradientColor1);
  gradient.addColorStop(1, gradientColor2);

  gmChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Omset Harian',
        data: data,
        borderColor: mainColor,
        backgroundColor: gradient,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#fff',
        pointBorderColor: mainColor,
        pointBorderWidth: 2,
      }]
    },
"""

# Replace from `const cData` to `    },`
pattern = r"  const cData = AppState\.dashboardData\.chartData \|\| \[\];[\s\S]*?      \]\n    \},"
content = re.sub(pattern, new_chart_setup.strip(), content)

with open('JS-App2.html', 'w') as f:
    f.write(content)
