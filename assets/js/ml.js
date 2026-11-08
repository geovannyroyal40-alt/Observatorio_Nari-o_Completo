let simChart = null;

function runSimulation() {
  const edu = parseFloat(document.getElementById("eduSlider").value);
  const povRed = parseFloat(document.getElementById("povSlider").value);
  const vaGrowth = parseFloat(document.getElementById("vaSlider").value) / 100;

  const years = [2025, 2026, 2027, 2028, 2029, 2030];
  const compSeries = [];
  const povSeries = [];
  let currentComp = 4.47;
  let currentPov = 19.7;
  let currentVA = 1155;

  years.forEach((y, i) => {
    if (i > 0) {
      currentVA *= (1 + vaGrowth);
      currentPov = Math.max(8, currentPov - (povRed / 5));
      currentComp = 1.15 + 0.52 * edu - 0.07 * currentPov + 0.12 * Math.log(currentVA);
      currentComp = Math.min(7.5, Math.max(3.0, currentComp));
    }
    compSeries.push(Number(currentComp.toFixed(2)));
    povSeries.push(Number(currentPov.toFixed(1)));
  });

  document.getElementById("comp2030").textContent = compSeries[5].toFixed(2);
  document.getElementById("pov2030").textContent = povSeries[5].toFixed(1) + "%";

  const ctx = document.getElementById("simChart");
  if (simChart) simChart.destroy();

  simChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: years,
      datasets: [
        {
          label: "Competitividad",
          data: compSeries,
          borderColor: "#e8b86d",
          backgroundColor: "rgba(232,184,109,0.1)",
          tension: 0.35,
          fill: true,
          pointBackgroundColor: "#e8b86d"
        },
        {
          label: "Pobreza Mult. (%)",
          data: povSeries,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,0.08)",
          tension: 0.35,
          fill: true,
          yAxisID: "y1",
          pointBackgroundColor: "#ef4444"
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: "#a1a1aa", boxWidth: 12 } }
      },
      scales: {
        x: { grid: { color: "#27272a" }, ticks: { color: "#a1a1aa" } },
        y: { 
          type: "linear", position: "left",
          grid: { color: "#27272a" },
          ticks: { color: "#e8b86d" },
          title: { display: true, text: "Competitividad", color: "#e8b86d" }
        },
        y1: { 
          type: "linear", position: "right",
          grid: { drawOnChartArea: false },
          ticks: { color: "#ef4444" },
          title: { display: true, text: "Pobreza %", color: "#ef4444" }
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const edu = document.getElementById("eduSlider");
  const pov = document.getElementById("povSlider");
  const va = document.getElementById("vaSlider");
  if (edu) {
    edu.addEventListener("input", () => document.getElementById("eduVal").textContent = edu.value);
    pov.addEventListener("input", () => document.getElementById("povVal").textContent = parseFloat(pov.value).toFixed(1));
    va.addEventListener("input", () => document.getElementById("vaVal").textContent = parseFloat(va.value).toFixed(1) + "%");
  }
  const btn = document.getElementById("runSim");
  if (btn) btn.addEventListener("click", runSimulation);
  setTimeout(runSimulation, 600);
});
