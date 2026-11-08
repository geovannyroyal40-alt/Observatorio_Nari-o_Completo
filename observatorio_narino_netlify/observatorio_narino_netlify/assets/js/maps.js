let mapNarino = null;
let markersLayer = null;

function getColor(value, variable) {
  // Escalas simples
  if (variable.includes("Pobreza") || variable === "Tasa_Desempleo") {
    // Más alto = más rojo
    if (value > 25) return "#d7191c";
    if (value > 20) return "#fdae61";
    if (value > 15) return "#ffffbf";
    return "#1a9641";
  } else {
    // Competitividad / Educación / VA → más alto = más verde
    if (value > 5.5 || value > 2000) return "#1a9641";
    if (value > 4.5 || value > 800) return "#a6d96a";
    if (value > 4.0 || value > 500) return "#ffffbf";
    return "#d7191c";
  }
}

function initMapNarino() {
  if (mapNarino) {
    mapNarino.remove();
  }
  mapNarino = L.map("mapNarino").setView([1.3, -77.6], 8);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 18
  }).addTo(mapNarino);

  markersLayer = L.layerGroup().addTo(mapNarino);
  updateMapMarkers("Pobreza_Multidimensional");
}

function updateMapMarkers(variable) {
  if (!markersLayer) return;
  markersLayer.clearLayers();

  municipios.forEach(m => {
    const val = m[variable];
    const color = getColor(val, variable);
    const radius = variable === "Valor_Agregado" 
      ? Math.max(8, Math.min(25, val / 400)) 
      : 12;

    const circle = L.circleMarker([m.lat, m.lon], {
      radius: radius,
      fillColor: color,
      color: "#333",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.85
    });

    circle.bindPopup(`
      <strong>${m.nombre}</strong><br>
      ${variable.replace(/_/g, " ")}: <b>${val}</b><br>
      Pobreza Mult.: ${m.Pobreza_Multidimensional}%<br>
      Competitividad: ${m.Indice_Competitividad}<br>
      Valor Agregado: ${m.Valor_Agregado}
    `);

    markersLayer.addLayer(circle);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMapNarino();
  const select = document.getElementById("mapVariable");
  if (select) {
    select.addEventListener("change", (e) => {
      updateMapMarkers(e.target.value);
      if (typeof updateRankingChart === "function") {
        updateRankingChart(e.target.value);
      }
    });
  }
});
