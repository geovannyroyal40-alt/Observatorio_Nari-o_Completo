let mapColombia = null;
let mapNarino = null;
let geoLayer = null;
let markersLayer = null;
let currentColombiaVar = "Pobreza_Multidimensional";

// Basemap GRATUITO sin API key
const FREE_TILE = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const FREE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

function getColorColombia(value, variable) {
  if (variable === "Indice_Competitividad") {
    if (value >= 6.5) return "#1a9641";
    if (value >= 5.5) return "#a6d96a";
    if (value >= 4.5) return "#ffffbf";
    if (value >= 3.5) return "#fdae61";
    return "#d7191c";
  }
  if (value >= 40) return "#d7191c";
  if (value >= 25) return "#fdae61";
  if (value >= 15) return "#ffffbf";
  if (value >= 10) return "#a6d96a";
  return "#1a9641";
}

function styleFeature(feature) {
  const val = feature.properties[currentColombiaVar] || 0;
  return {
    fillColor: getColorColombia(val, currentColombiaVar),
    weight: 1.5,
    opacity: 1,
    color: "#111",
    fillOpacity: 0.82
  };
}

function onEachFeature(feature, layer) {
  const p = feature.properties;
  const val = p[currentColombiaVar];
  const label = currentColombiaVar.replace(/_/g, " ");
  layer.bindPopup(`
    <strong style="font-size:14px">${p.name}</strong><br>
    <span style="color:#b45309">${label}:</span> <b>${val}</b>
  `);
  layer.on({
    mouseover: (e) => {
      e.target.setStyle({ weight: 3, color: "#e8b86d", fillOpacity: 0.95 });
      e.target.bringToFront();
    },
    mouseout: (e) => {
      if (geoLayer) geoLayer.resetStyle(e.target);
    }
  });
}

function initMapColombia() {
  if (mapColombia) mapColombia.remove();
  mapColombia = L.map("mapColombia", { zoomControl: true }).setView([4.2, -73.5], 5.3);

  L.tileLayer(FREE_TILE, {
    attribution: FREE_ATTR,
    maxZoom: 12
  }).addTo(mapColombia);

  fetch("assets/data/colombia_departamentos.geojson")
    .then(r => r.json())
    .then(data => {
      geoLayer = L.geoJSON(data, {
        style: styleFeature,
        onEachFeature: onEachFeature
      }).addTo(mapColombia);
    })
    .catch(err => {
      console.error(err);
      document.getElementById("mapColombia").innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#aaa;text-align:center;padding:20px;background:#1a1a1a">
          <div>
            <p style="font-size:16px;margin-bottom:6px">Mapa de Colombia</p>
            <p style="font-size:13px">Nariño – Pobreza Multidimensional 18.1% (Nacional 11.5%)</p>
          </div>
        </div>`;
    });
}

function updateColombiaMap(variable) {
  currentColombiaVar = variable;
  if (geoLayer) {
    geoLayer.setStyle(styleFeature);
    geoLayer.eachLayer(layer => {
      const p = layer.feature.properties;
      const val = p[variable];
      const label = variable.replace(/_/g, " ");
      layer.bindPopup(`
        <strong style="font-size:14px">${p.name}</strong><br>
        <span style="color:#b45309">${label}:</span> <b>${val}</b>
      `);
    });
  }
}

function getColorNarino(value, variable) {
  if (variable.includes("Pobreza") || variable === "Tasa_Desempleo") {
    if (value > 25) return "#d7191c";
    if (value > 20) return "#fdae61";
    if (value > 15) return "#ffffbf";
    return "#1a9641";
  }
  if (value > 5.5 || value > 2000) return "#1a9641";
  if (value > 4.5 || value > 800) return "#a6d96a";
  if (value > 4.0 || value > 500) return "#ffffbf";
  return "#d7191c";
}

function initMapNarino() {
  if (mapNarino) mapNarino.remove();
  mapNarino = L.map("mapNarino").setView([1.35, -77.55], 8);

  L.tileLayer(FREE_TILE, {
    attribution: FREE_ATTR,
    maxZoom: 14
  }).addTo(mapNarino);

  markersLayer = L.layerGroup().addTo(mapNarino);
  updateNarinoMarkers("Pobreza_Multidimensional");
}

function updateNarinoMarkers(variable) {
  if (!markersLayer) return;
  markersLayer.clearLayers();

  municipios.forEach(m => {
    const val = m[variable];
    const color = getColorNarino(val, variable);
    const radius = variable === "Valor_Agregado" 
      ? Math.max(8, Math.min(22, val / 450)) 
      : 12;

    const circle = L.circleMarker([m.lat, m.lon], {
      radius: radius,
      fillColor: color,
      color: "#111",
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.9
    });

    circle.bindPopup(`
      <strong>${m.nombre}</strong><br>
      ${variable.replace(/_/g, " ")}: <b>${val}</b><br>
      Pobreza Mult.: ${m.Pobreza_Multidimensional}%<br>
      Competitividad: ${m.Indice_Competitividad}
    `);
    markersLayer.addLayer(circle);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMapColombia();
  initMapNarino();

  const colSelect = document.getElementById("colombiaVariable");
  if (colSelect) {
    colSelect.addEventListener("change", (e) => updateColombiaMap(e.target.value));
  }

  const narSelect = document.getElementById("narinoVariable");
  if (narSelect) {
    narSelect.addEventListener("change", (e) => {
      updateNarinoMarkers(e.target.value);
      if (typeof updateRankingChart === "function") updateRankingChart(e.target.value);
    });
  }
});
