function mean(arr){ return arr.reduce((a,b)=>a+b,0)/arr.length; }
function std(arr){ const m=mean(arr); return Math.sqrt(arr.reduce((s,x)=>s+(x-m)**2,0)/arr.length); }
function min(arr){ return Math.min(...arr); }
function max(arr){ return Math.max(...arr); }
function corr(x,y){
  const mx=mean(x), my=mean(y);
  let num=0, dx=0, dy=0;
  for(let i=0;i<x.length;i++){ num+=(x[i]-mx)*(y[i]-my); dx+=(x[i]-mx)**2; dy+=(y[i]-my)**2; }
  return num/Math.sqrt(dx*dy);
}

function buildDescriptive(){
  const tbody = document.getElementById("tablaDesc");
  if(!tbody) return;
  vars.forEach(v=>{
    const vals = municipios.map(m=>m[v]);
    const tr = document.createElement("tr");
    tr.className = "hover:bg-white/5";
    tr.innerHTML = `
      <td class="px-4 py-2.5 text-gray-300">${labels[v]}</td>
      <td class="px-4 py-2.5 text-right">${mean(vals).toFixed(1)}</td>
      <td class="px-4 py-2.5 text-right">${std(vals).toFixed(1)}</td>
      <td class="px-4 py-2.5 text-right">${min(vals).toFixed(1)}</td>
      <td class="px-4 py-2.5 text-right">${max(vals).toFixed(1)}</td>`;
    tbody.appendChild(tr);
  });
}

let barChart;
function updateBar(variable="Pobreza_Multidimensional"){
  const sorted = [...municipios].sort((a,b)=>{
    if(variable.includes("Pobreza")||variable==="Tasa_Desempleo") return b[variable]-a[variable];
    return a[variable]-b[variable];
  });
  const ctx = document.getElementById("barChart");
  if(!ctx) return;
  if(barChart) barChart.destroy();
  barChart = new Chart(ctx,{
    type:"bar",
    data:{
      labels: sorted.map(m=>m.nombre),
      datasets:[{
        data: sorted.map(m=>m[variable]),
        backgroundColor: sorted.map(m=>{
          const v=m[variable];
          if(variable.includes("Pobreza")||variable==="Tasa_Desempleo"){
            if(v>25) return "#ef4444"; if(v>20) return "#f59e0b"; if(v>15) return "#eab308"; return "#22c55e";
          }
          if(v>5.5) return "#22c55e"; if(v>4.5) return "#84cc16"; return "#ef4444";
        }),
        borderWidth:0, borderRadius:3
      }]
    },
    options:{
      indexAxis:"y",
      plugins:{legend:{display:false}},
      scales:{
        x:{grid:{color:"#27272a"},ticks:{color:"#a1a1aa",font:{size:10}}},
        y:{grid:{display:false},ticks:{color:"#d4d4d8",font:{size:10}}}
      }
    }
  });
}

function buildPie(){
  const ctx = document.getElementById("pieChart");
  if(!ctx) return;
  const low = municipios.filter(m=>m.Pobreza_Multidimensional<18).length;
  const mid = municipios.filter(m=>m.Pobreza_Multidimensional>=18 && m.Pobreza_Multidimensional<25).length;
  const high = municipios.filter(m=>m.Pobreza_Multidimensional>=25).length;
  new Chart(ctx,{
    type:"doughnut",
    data:{
      labels:["Baja (<18%)","Media (18-25%)","Alta (≥25%)"],
      datasets:[{
        data:[low,mid,high],
        backgroundColor:["#22c55e","#eab308","#ef4444"],
        borderWidth:0
      }]
    },
    options:{
      plugins:{legend:{position:"bottom",labels:{color:"#a1a1aa",boxWidth:12,font:{size:11}}}},
      cutout:"55%"
    }
  });
}

function buildRadar(){
  const ctx = document.getElementById("radarChart");
  if(!ctx) return;
  // Normalizar 0-10 para visualización
  const avg = {
    pobreza: 10 - (mean(municipios.map(m=>m.Pobreza_Multidimensional))/40*10),
    desempleo: 10 - (mean(municipios.map(m=>m.Tasa_Desempleo))/15*10),
    educacion: mean(municipios.map(m=>m.Proxy_Educacion)),
    competitividad: mean(municipios.map(m=>m.Indice_Competitividad)),
    va: Math.min(10, mean(municipios.map(m=>m.Valor_Agregado))/1000)
  };
  new Chart(ctx,{
    type:"radar",
    data:{
      labels:["Baja Pobreza","Bajo Desempleo","Educación","Competitividad","Valor Agregado"],
      datasets:[{
        label:"Promedio Nariño",
        data:[avg.pobreza, avg.desempleo, avg.educacion, avg.competitividad, avg.va],
        borderColor:"#c9a227",
        backgroundColor:"rgba(201,162,39,0.15)",
        pointBackgroundColor:"#c9a227"
      }]
    },
    options:{
      scales:{
        r:{
          min:0, max:10,
          ticks:{display:false},
          grid:{color:"#27272a"},
          pointLabels:{color:"#a1a1aa",font:{size:10}}
        }
      },
      plugins:{legend:{display:false}}
    }
  });
}

function buildCorr(){
  const keys = ["Indice_Competitividad","Proxy_Educacion","Pobreza_Multidimensional","Tasa_Desempleo","Valor_Agregado"];
  const short = {Indice_Competitividad:"Compet.", Proxy_Educacion:"Educ.", Pobreza_Multidimensional:"Pob.Mult.", Tasa_Desempleo:"Desemp.", Valor_Agregado:"Val.Agr."};
  const thead = document.querySelector("#corrTable thead");
  const tbody = document.querySelector("#corrTable tbody");
  if(!thead||!tbody) return;

  let hr = "<tr><th class='px-2 py-2 text-left text-soft'></th>";
  keys.forEach(k=> hr += `<th class="px-2 py-2 text-center text-soft">${short[k]}</th>`);
  hr += "</tr>";
  thead.innerHTML = hr;

  keys.forEach(k1=>{
    let row = `<tr><td class="px-2 py-2 text-soft">${short[k1]}</td>`;
    keys.forEach(k2=>{
      const c = corr(municipios.map(m=>m[k1]), municipios.map(m=>m[k2]));
      const color = k1===k2 ? "text-gray-500" : (c>0.5 ? "text-emerald-400" : (c<-0.5 ? "text-red-400" : "text-gray-300"));
      row += `<td class="px-2 py-2 text-center ${color}">${c.toFixed(2)}</td>`;
    });
    row += "</tr>";
    tbody.innerHTML += row;
  });
}

function buildOLS(){
  // OLS simple con normal equation (matriz)
  // y = Competitividad, X = [1, Educ, Pobreza, Desempleo, log(VA)]
  const n = municipios.length;
  const y = municipios.map(m=>m.Indice_Competitividad);
  const X = municipios.map(m=>[1, m.Proxy_Educacion, m.Pobreza_Multidimensional, m.Tasa_Desempleo, Math.log(m.Valor_Agregado)]);

  // X'X y X'y
  const k = 5;
  const XtX = Array(k).fill(0).map(()=>Array(k).fill(0));
  const Xty = Array(k).fill(0);
  for(let i=0;i<n;i++){
    for(let a=0;a<k;a++){
      Xty[a] += X[i][a]*y[i];
      for(let b=0;b<k;b++) XtX[a][b] += X[i][a]*X[i][b];
    }
  }
  // Inversión gaussiana simple 5x5
  const A = XtX.map((row,i)=>[...row, Xty[i]]);
  for(let col=0;col<k;col++){
    let piv = col;
    for(let r=col+1;r<k;r++) if(Math.abs(A[r][col])>Math.abs(A[piv][col])) piv=r;
    [A[col],A[piv]]=[A[piv],A[col]];
    const div = A[col][col];
    for(let c=col;c<=k;c++) A[col][c]/=div;
    for(let r=0;r<k;r++){
      if(r===col) continue;
      const f = A[r][col];
      for(let c=col;c<=k;c++) A[r][c]-=f*A[col][c];
    }
  }
  const beta = A.map(row=>row[k]);

  // R2
  const yhat = X.map(row => row.reduce((s,x,i)=>s+x*beta[i],0));
  const ymean = mean(y);
  const ssTot = y.reduce((s,yi)=>s+(yi-ymean)**2,0);
  const ssRes = y.reduce((s,yi,i)=>s+(yi-yhat[i])**2,0);
  const r2 = 1 - ssRes/ssTot;

  const box = document.getElementById("olsResults");
  if(!box) return;
  box.innerHTML = `
    <div class="flex justify-between"><span class="text-soft">Constante</span><span>${beta[0].toFixed(3)}</span></div>
    <div class="flex justify-between"><span class="text-soft">Educación</span><span class="text-emerald-400">${beta[1].toFixed(3)}</span></div>
    <div class="flex justify-between"><span class="text-soft">Pobreza Mult.</span><span class="text-red-400">${beta[2].toFixed(3)}</span></div>
    <div class="flex justify-between"><span class="text-soft">Desempleo</span><span>${beta[3].toFixed(3)}</span></div>
    <div class="flex justify-between"><span class="text-soft">log(Valor Agregado)</span><span>${beta[4].toFixed(3)}</span></div>
    <div class="border-t border-line mt-2 pt-2 flex justify-between"><span class="text-soft">R²</span><span class="text-gold">${r2.toFixed(3)}</span></div>
  `;
}

document.addEventListener("DOMContentLoaded", ()=>{
  buildDescriptive();
  updateBar();
  buildPie();
  buildRadar();
  buildCorr();
  buildOLS();
  document.getElementById("rankVar")?.addEventListener("change", e=>updateBar(e.target.value));
});
