# Observatorio Regional de Nariño

Análisis Económico, Territorial y Competitividad Municipal

Plataforma web estática lista para desplegar en **Netlify** o cualquier hosting estático.

## Autores
- **Camila Guerrero** – Desarrolladora • Análisis de Datos
- **Geovanny Betancourt** – Desarrollador • Econometría Espacial

## Características
- Indicadores oficiales (DANE + CPC)
- Mapas interactivos de municipios de Nariño (Leaflet)
- Econometría espacial explicada (Moran + LISA)
- Simulador de escenarios con Machine Learning
- Chatbot temático inteligente
- Diseño profesional, responsivo e intuitivo

## Cómo desplegar en Netlify

1. Sube esta carpeta completa a un repositorio de GitHub
2. Entra a [https://app.netlify.com](https://app.netlify.com)
3. "Add new site" → "Import an existing project"
4. Conecta el repositorio
5. Configuración de build:
   - **Build command**: (dejar vacío)
   - **Publish directory**: `.` (o la raíz)
6. Deploy

La página quedará publicada automáticamente.

## Estructura
```
├── index.html
├── README.md
├── assets/
│   ├── css/styles.css
│   ├── js/
│   │   ├── data.js
│   │   ├── maps.js
│   │   ├── charts.js
│   │   ├── ml.js
│   │   ├── chatbot.js
│   │   └── main.js
│   ├── data/
│   └── img/
└── forms/
```

## Fuentes de datos
- DANE: Pobreza Monetaria y Multidimensional 2024-2025, Valor Agregado Municipal, GEIH
- Consejo Privado de Competitividad – Universidad del Rosario (IDC)
