let rankingChart = null;

function updateRankingChart(variable = "Pobreza_Multidimensional") {
  const sorted = [...municipios].sort((a, b) => {
    if (variable.includes("Pobreza") || variable === "Tasa_Desempleo") return b[variable] - a[variable];
    return a[variable] - b[variable];
  });

  const ctx = document.getElementById("rankingChart");
  if (!ctx) return;
  if (rankingChart) rankingChart.destroy();

  rankingChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: sorted.map(m => m.nombre),
      datasets: [{
        label: variable.replace(/_/g, " "),
        data: sorted.map(m => m[variable]),
        backgroundColor: sorted.map(m => {
          const v = m[variable];
          if (variable.includes("Pobreza") || variable === "Tasa_Desempleo") {
            if (v > 25) return "#d7191c";
            if (v > 20) return "#fdae61";
            if (v > 15) return "#ffffbf";
            return "#1a9641";
          }
          if (v > 5.5) return "#1a9641";
          if (v > 4.5) return "#a6d96a";
          return "#d7191c";
        }),
        borderWidth: 0,
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { 
          grid: { color: "#27272a" },
          ticks: { color: "#a1a1aa" }
        },
        y: { 
          grid: { display: false },
          ticks: { color: "#d4d4d8", font: { size: 11 } }
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => updateRankingChart("Pobreza_Multidimensional"));
