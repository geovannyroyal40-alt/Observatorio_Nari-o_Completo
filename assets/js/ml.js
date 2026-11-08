let simChart = null;

function runSimulation() {
  const edu = parseFloat(document.getElementById("eduSlider").value);
  const povRed = parseFloat(document.getElementById("povSlider").value);
  const vaGrowth = parseFloat(document.getElementById("vaSlider").value) / 100;

  // Modelo simplificado calibrado (coeficientes ilustrativos basados en la correlación observada)
  // Competitividad ≈ 1.2 + 0.55*Educacion - 0.08*Pobreza + 0.15*log(VA)
  const baseComp = 4.47;
  const basePov = 19.7;

  const years = [2025, 2026, 2027, 2028, 2029, 2030];
  const compSeries = [];
  const povSeries = [];

  let currentComp = baseComp;
  let currentPov = basePov;
  let currentVA = 1155;

  years.forEach((y, i) => {
    if (i > 0) {
      currentVA *= (1 + vaGrowth);
      currentPov = Math.max(8, currentPov - (povRed / 5));
      // efecto de educación y reducción de pobreza sobre competitividad
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
          label: "Índice de Competitividad",
          data: compSeries,
          borderColor: "#0f4c81",
          backgroundColor: "rgba(15,76,129,0.1)",
          tension: 0.3,
          fill: true
        },
        {
          label: "Pobreza Multidimensional (%)",
          data: povSeries,
          borderColor: "#d7191c",
          backgroundColor: "rgba(215,25,28,0.1)",
          tension: 0.3,
          fill: true,
          yAxisID: "y1"
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      scales: {
        y: { type: "linear", position: "left", title: { display: true, text: "Competitividad" } },
        y1: { type: "linear", position: "right", title: { display: true, text: "Pobreza %" }, grid: { drawOnChartArea: false } }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const eduSlider = document.getElementById("eduSlider");
  const povSlider = document.getElementById("povSlider");
  const vaSlider = document.getElementById("vaSlider");

  if (eduSlider) {
    eduSlider.addEventListener("input", () => document.getElementById("eduVal").textContent = eduSlider.value);
    povSlider.addEventListener("input", () => document.getElementById("povVal").textContent = parseFloat(povSlider.value).toFixed(1));
    vaSlider.addEventListener("input", () => document.getElementById("vaVal").textContent = parseFloat(vaSlider.value).toFixed(1) + "%");
  }

  const btn = document.getElementById("runSim");
  if (btn) btn.addEventListener("click", runSimulation);

  // Ejecutar una vez al cargar
  setTimeout(runSimulation, 500);
});
