const knowledge=[
  {k:["pobreza multidimensional","ipm"],a:"La pobreza multidimensional de Nariño se ubicó en 18.1% en 2024 (DANE), frente a 11.5% nacional. Los municipios del Pacífico concentran los valores más altos."},
  {k:["pobreza monetaria"],a:"Pobreza monetaria de Nariño: 39.2% (2024). Nacional: 31.8%. Mide insuficiencia de ingresos para una canasta básica."},
  {k:["competitividad","idc"],a:"Nariño se ubica alrededor del puesto 20-21 en el IDC. Su mayor fortaleza es Educación Básica y Media. Los principales retos son Innovación y Sistema Financiero."},
  {k:["educación","educacion"],a:"La educación muestra la correlación positiva más fuerte con el índice de competitividad. Mejorar el desempeño educativo es un canal clave para elevar la competitividad municipal."},
  {k:["correlación","correlacion","ols","regresión","regresion"],a:"El modelo OLS estima que el coeficiente de educación es positivo. Pobreza multidimensional tiene efecto negativo sobre la competitividad, controlando por las demás variables."},
  {k:["desempleo"],a:"La tasa de desempleo de Nariño se ubicó en 6.0% en 2025, una de las más bajas del país (nacional ≈ 8.9%)."},
  {k:["simulación","proyección","modelo","predictivo"],a:"La sección de modelos predictivos permite simular escenarios a 2030 ajustando educación, reducción de pobreza y crecimiento del valor agregado."},
  {k:["autores","camila","geovanny"],a:"El Observatorio fue desarrollado por Camila Guerrero (análisis de datos e interfaz) y Geovanny Betancourt (econometría y modelos predictivos)."},
  {k:["hola","buenos","buenas"],a:"¡Hola! Puedo responder sobre pobreza, competitividad, correlaciones, el modelo OLS, educación o las proyecciones a 2030. ¿Qué te interesa?"}
];

function findAnswer(q){
  const n=q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  for(const item of knowledge){
    for(const kw of item.k){
      if(n.includes(kw.normalize("NFD").replace(/[\u0300-\u036f]/g,""))) return item.a;
    }
  }
  return "Puedo ayudarte con pobreza monetaria/multidimensional, competitividad, correlaciones, modelo OLS, educación o las proyecciones. Intenta con alguna de esas palabras.";
}

function addMsg(text,user=false){
  const c=document.getElementById("chatMessages");
  const d=document.createElement("div");
  d.className="flex gap-3 "+(user?"justify-end":"");
  d.innerHTML=user
    ?`<div class="bg-gold text-ink rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[85%]">${text}</div>`
    :`<div class="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-ink text-[10px] font-bold shrink-0">IA</div>
      <div class="bg-panel border border-line rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-300 max-w-[85%]">${text}</div>`;
  c.appendChild(d);
  c.scrollTop=c.scrollHeight;
}

function send(){
  const i=document.getElementById("chatInput");
  const t=i.value.trim();
  if(!t) return;
  addMsg(t,true); i.value="";
  setTimeout(()=>addMsg(findAnswer(t)),300);
}

document.addEventListener("DOMContentLoaded",()=>{
  addMsg("¡Hola! Soy el asistente del Observatorio. Puedo responder sobre pobreza, competitividad, correlaciones, el modelo OLS o las proyecciones a 2030.");
  document.getElementById("chatSend")?.addEventListener("click",send);
  document.getElementById("chatInput")?.addEventListener("keypress",e=>{if(e.key==="Enter")send();});
});
