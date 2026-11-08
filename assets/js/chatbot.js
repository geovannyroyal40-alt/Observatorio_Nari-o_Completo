const knowledge = [
  { keywords: ["pobreza multidimensional", "ipm", "pobreza multi"], answer: "La Pobreza Multidimensional en Nariño fue 18.1% en 2024 (DANE), frente a 11.5% nacional. Los municipios del Pacífico (Tumaco, Barbacoas) concentran los valores más altos." },
  { keywords: ["pobreza monetaria"], answer: "Pobreza Monetaria de Nariño: 39.2% en 2024 (DANE). Nacional: 31.8%. Mide insuficiencia de ingresos para una canasta básica." },
  { keywords: ["competitividad", "idc"], answer: "Nariño se ubica alrededor del puesto 20-21 en el IDC (CPC-Universidad del Rosario). Su mayor fortaleza es Educación Básica y Media. Retos: Innovación y Sistema Financiero." },
  { keywords: ["moran", "autocorrelación", "espacial"], answer: "Índice de Moran Global para pobreza multidimensional ≈ 0.31 (p=0.018). Hay autocorrelación espacial positiva: municipios con valores similares tienden a agruparse." },
  { keywords: ["lisa", "clúster", "cluster"], answer: "LISA identifica cuatro tipos de clústeres: HH (Alto-Alto), LL (Bajo-Bajo), HL (Alto-Bajo) y LH (Bajo-Alto). En Nariño los HH de pobreza se concentran hacia el Pacífico." },
  { keywords: ["educación"], answer: "El proxy de educación tiene correlación positiva fuerte con competitividad. Nariño destaca en el pilar de Educación del IDC. Mejorar educación es un canal clave para subir competitividad." },
  { keywords: ["desempleo"], answer: "Tasa de desempleo de Nariño: 6.0% en 2025 (una de las más bajas del país). Nacional ≈ 8.9%. Persisten retos de informalidad y calidad del empleo." },
  { keywords: ["tumaco", "barbacoas", "pacífico"], answer: "Tumaco y Barbacoas (zona Pacífica / PDET) presentan los niveles más altos de pobreza y menor competitividad de la muestra. Requieren políticas diferenciadas." },
  { keywords: ["pasto"], answer: "Pasto tiene el mejor desempeño relativo: pobreza multidimensional 12.8%, mayor valor agregado e índice de competitividad 5.85." },
  { keywords: ["machine learning", "simulación", "proyección"], answer: "La sección de Machine Learning permite simular escenarios a 2030 ajustando educación, reducción de pobreza y crecimiento del valor agregado." },
  { keywords: ["autores", "camila", "geovanny", "desarrolladores"], answer: "Desarrollado por Camila Guerrero (análisis de datos e interfaz) y Geovanny Betancourt (econometría espacial y machine learning)." },
  { keywords: ["hola", "buenos", "buenas", "saludos"], answer: "¡Hola! Soy el asistente del Observatorio Regional de Nariño. Pregúntame sobre pobreza, competitividad, Moran, LISA, municipios o las simulaciones." }
];

function findAnswer(q) {
  const norm = q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const item of knowledge) {
    for (const kw of item.keywords) {
      if (norm.includes(kw.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) return item.answer;
    }
  }
  return "Puedo ayudarte con: pobreza monetaria/multidimensional, competitividad (IDC), Índice de Moran, clústeres LISA, municipios (Pasto, Tumaco…), educación o las simulaciones de Machine Learning. Intenta con alguna de esas palabras.";
}

function addMessage(text, isUser = false) {
  const c = document.getElementById("chatMessages");
  const d = document.createElement("div");
  d.className = "flex gap-3 " + (isUser ? "justify-end" : "");
  if (isUser) {
    d.innerHTML = `<div class="bg-accent text-darkbg rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[85%] font-medium">${text}</div>
                   <div class="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs shrink-0">Tú</div>`;
  } else {
    d.innerHTML = `<div class="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-darkbg text-xs font-bold shrink-0">IA</div>
                   <div class="bg-darkcard border border-darkborder rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-300 max-w-[85%]">${text}</div>`;
  }
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, true);
  input.value = "";
  setTimeout(() => addMessage(findAnswer(text)), 350);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("chatSend")?.addEventListener("click", sendMessage);
  document.getElementById("chatInput")?.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });
});
