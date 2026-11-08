let simChart;
function runSimulation(){
  const edu = parseFloat(document.getElementById("eduSlider").value);
  const povRed = parseFloat(document.getElementById("povSlider").value);
  const vaG = parseFloat(document.getElementById("vaSlider").value)/100;

  const years=[2025,2026,2027,2028,2029,2030];
  const comp=[], pov=[];
  let c=4.47, p=19.7, va=1155;
  years.forEach((_,i)=>{
    if(i>0){
      va*=(1+vaG);
      p=Math.max(8, p-povRed/5);
      c=1.15+0.52*edu-0.07*p+0.12*Math.log(va);
      c=Math.min(7.5,Math.max(3,c));
    }
    comp.push(+c.toFixed(2));
    pov.push(+p.toFixed(1));
  });

  document.getElementById("comp2030").textContent=comp[5].toFixed(2);
  document.getElementById("pov2030").textContent=pov[5].toFixed(1)+"%";

  const ctx=document.getElementById("simChart");
  if(simChart) simChart.destroy();
  simChart=new Chart(ctx,{
    type:"line",
    data:{
      labels:years,
      datasets:[
        {label:"Competitividad",data:comp,borderColor:"#c9a227",backgroundColor:"rgba(201,162,39,0.1)",tension:0.35,fill:true,pointBackgroundColor:"#c9a227"},
        {label:"Pobreza Mult. (%)",data:pov,borderColor:"#ef4444",backgroundColor:"rgba(239,68,68,0.08)",tension:0.35,fill:true,yAxisID:"y1",pointBackgroundColor:"#ef4444"}
      ]
    },
    options:{
      responsive:true,
      interaction:{mode:"index",intersect:false},
      plugins:{legend:{labels:{color:"#a1a1aa",boxWidth:12,font:{size:11}}}},
      scales:{
        x:{grid:{color:"#27272a"},ticks:{color:"#a1a1aa"}},
        y:{grid:{color:"#27272a"},ticks:{color:"#c9a227"},title:{display:true,text:"Competitividad",color:"#c9a227"}},
        y1:{position:"right",grid:{drawOnChartArea:false},ticks:{color:"#ef4444"},title:{display:true,text:"Pobreza %",color:"#ef4444"}}
      }
    }
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  const e=document.getElementById("eduSlider"), p=document.getElementById("povSlider"), v=document.getElementById("vaSlider");
  if(e){
    e.addEventListener("input",()=>document.getElementById("eduVal").textContent=e.value);
    p.addEventListener("input",()=>document.getElementById("povVal").textContent=parseFloat(p.value).toFixed(1));
    v.addEventListener("input",()=>document.getElementById("vaVal").textContent=parseFloat(v.value).toFixed(1)+"%");
  }
  document.getElementById("runSim")?.addEventListener("click",runSimulation);
  setTimeout(runSimulation,400);
});
