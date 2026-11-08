let rankingChart = null;

function updateRankingChart(variable = "Pobreza_Multidimensional") {
  const sorted = [...municipios].sort((a, b) => {
    if (variable.includes("Pobreza") || variable === "Tasa_Desempleo") {
      return b[variable] - a[variable]; // mayor primero
    }
    return a[variable] - b[variable]; // menor primero para competitividad/educación
  });

  const labels = sorted.map(m => m.nombre);
  const values = sorted.map(m => m[variable]);

  const ctx = document.getElementById("rankingChart");
  if (!ctx) return;

  if (rankingChart) rankingChart.destroy();

  rankingChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: variable.replace(/_/g, " "),
        data: values,
        backgroundColor: values.map(v => getColor(v, variable)),
        borderWidth: 0
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        x: { beginAtZero: true }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateRankingChart("Pobreza_Multidimensional");
});
