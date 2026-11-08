const knowledge = [
  {
    keywords: ["pobreza multidimensional", "ipm", "pobreza multi"],
    answer: "La Pobreza Multidimensional en Nariño se ubicó en 18.1% en 2024 según el DANE (frente a 11.5% nacional). Mide privaciones en educación, salud, trabajo y condiciones de la vivienda. Los municipios del Pacífico (Tumaco, Barbacoas) presentan los niveles más altos."
  },
  {
    keywords: ["pobreza monetaria", "pobreza ingreso"],
    answer: "La Pobreza Monetaria en Nariño fue de 39.2% en 2024 (DANE), superior al 31.8% nacional. Indica el porcentaje de personas cuyo ingreso es insuficiente para adquirir una canasta básica de bienes y servicios."
  },
  {
    keywords: ["competitividad", "idc", "índice de competitividad"],
    answer: "Nariño se ubica alrededor del puesto 20-21 en el Índice Departamental de Competitividad (CPC-Universidad del Rosario). Su mayor fortaleza está en Educación Básica y Media. Los principales retos son Innovación y Sistema Financiero."
  },
  {
    keywords: ["moran", "autocorrelación", "espacial", "lisa", "clúster"],
    answer: "El Índice de Moran Global para pobreza multidimensional en la muestra de municipios de Nariño es positivo y significativo (I ≈ 0.31, p < 0.05). Esto indica que municipios con valores similares tienden a agruparse geográficamente. Los clústeres LISA permiten identificar zonas Alto-Alto y Bajo-Bajo."
  },
  {
    keywords: ["educación", "proxy educación"],
    answer: "El proxy de educación muestra una correlación positiva fuerte con el Índice de Competitividad. Nariño destaca en el pilar de Educación Básica y Media del IDC. Mejorar cobertura y calidad educativa es uno de los canales más efectivos para elevar la competitividad municipal."
  },
  {
    keywords: ["desempleo", "empleo", "tasa de desempleo"],
    answer: "La tasa de desempleo de Nariño se ubicó en 6.0% en 2025 (DANE GEIH), una de las más bajas del país (nacional ≈ 8.9%). Sin embargo, persisten desafíos de informalidad y calidad del empleo, especialmente en zonas rurales y del Pacífico."
  },
  {
    keywords: ["tumaco", "barbacoas", "pacífico"],
    answer: "Tumaco y Barbacoas pertenecen a la zona Pacífica y a municipios PDET. Presentan los niveles más altos de pobreza multidimensional y monetaria de la muestra, junto con menor competitividad. Requieren políticas diferenciadas de desarrollo territorial."
  },
  {
    keywords: ["pasto", "capital"],
    answer: "Pasto es el municipio con mejor desempeño relativo: menor pobreza multidimensional (12.8%), mayor valor agregado y el índice de competitividad más alto de la muestra (5.85). Concentra una proporción importante de la actividad económica departamental."
  },
  {
    keywords: ["machine learning", "simulación", "proyección", "modelo"],
    answer: "La sección de Machine Learning permite simular escenarios de largo plazo ajustando inversión en educación, reducción de pobreza y crecimiento del valor agregado. El modelo está calibrado con los datos municipales y proyecta el impacto sobre competitividad y pobreza a 2030."
  },
  {
    keywords: ["autores", "quién", "desarrolladores", "camila", "geovanny"],
    answer: "Este Observatorio fue desarrollado por Camila Guerrero y Geovanny Betancourt. Camila se enfocó en análisis de datos y diseño de indicadores; Geovanny en econometría espacial, machine learning y arquitectura técnica."
  },
  {
    keywords: ["dane", "fuente", "datos"],
    answer: "Las fuentes principales son el DANE (Pobreza Monetaria y Multidimensional 2024-2025, Valor Agregado Municipal, GEIH) y el Consejo Privado de Competitividad – Universidad del Rosario (Índice Departamental de Competitividad)."
  },
  {
    keywords: ["hola", "buenos días", "buenas", "saludos"],
    answer: "¡Hola! Soy el asistente del Observatorio Regional de Nariño. Puedo ayudarte con preguntas sobre pobreza, competitividad, econometría espacial, mapas o las simulaciones de Machine Learning. ¿Qué te interesa saber?"
  }
];

function findAnswer(question) {
  const q = question.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const item of knowledge) {
    for (const kw of item.keywords) {
      const k = kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (q.includes(k)) return item.answer;
    }
  }
  return "Gracias por tu pregunta. Puedo ayudarte con temas de pobreza monetaria y multidimensional, competitividad (IDC), econometría espacial (Moran y LISA), educación, desempleo, municipios específicos (Pasto, Tumaco, etc.) o las simulaciones de Machine Learning. Intenta reformular tu consulta con alguna de estas palabras clave.";
}

function addMessage(text, isUser = false) {
  const container = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = "flex gap-2 " + (isUser ? "justify-end" : "");
  
  if (isUser) {
    div.innerHTML = `
      <div class="bg-primary text-white rounded-xl rounded-tr-none px-4 py-2 shadow-sm text-sm max-w-[85%]">
        ${text}
      </div>
      <div class="bg-slate-300 text-slate-700 rounded-full w-8 h-8 flex items-center justify-center text-sm shrink-0">Tú</div>
    `;
  } else {
    div.innerHTML = `
      <div class="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shrink-0">IA</div>
      <div class="bg-white rounded-xl rounded-tl-none px-4 py-2 shadow-sm text-sm max-w-[85%]">
        ${text}
      </div>
    `;
  }
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, true);
  input.value = "";
  
  setTimeout(() => {
    const answer = findAnswer(text);
    addMessage(answer, false);
  }, 400);
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("chatSend");
  const input = document.getElementById("chatInput");
  if (btn) btn.addEventListener("click", sendMessage);
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }
});
