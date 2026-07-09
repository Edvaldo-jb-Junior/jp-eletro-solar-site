// CONFIG - TROQUE SEU WHATSAPP AQUI
const WHATSAPP_NUMBER = '5516999999999';

// Menu mobile
const menuBtn = document.getElementById('menu-btn');
const mobileNav = document.getElementById('mobile-nav');
menuBtn.addEventListener('click', ()=>{mobileNav.classList.toggle('open')});
document.querySelectorAll('#mobile-nav a').forEach(a=>a.addEventListener('click', ()=>mobileNav.classList.remove('open')));

// Ano footer
document.getElementById('year').textContent = new Date().getFullYear();

// Simulador
const billInput = document.getElementById('bill-input');
const billNumber = document.getElementById('bill-number');
const kwhEl = document.getElementById('kwh-est');
const kwpEl = document.getElementById('kwp-est');
const platesEl = document.getElementById('plates-est');
const econMonthEl = document.getElementById('econ-month');
const econYearEl = document.getElementById('econ-year');
const investEl = document.getElementById('invest-est');
const paybackEl = document.getElementById('payback-est');
const waSim = document.getElementById('wa-simulador');
const waFloat = document.getElementById('wa-float');

function fmtBRL(v){return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0})}

function calc(value){
  const tariff=0.95,kwh=Math.round(value/tariff);
  const kwp=kwh/135,placas=Math.max(4,Math.ceil(kwp/0.55)),kwpReal=placas*0.55;
  const economiaMes=value*0.92,economiaAno=economiaMes*12;
  let invest=kwpReal*3200+2600; if(invest<8900) invest=8900;
  const payback=Math.round(invest/economiaMes);
  
  kwhEl.textContent=`~${kwh.toLocaleString('pt-BR')} kWh/mês`;
  kwpEl.textContent=`${kwpReal.toFixed(1).replace('.',',')} kWp`;
  platesEl.textContent=`${placas} placas`;
  econMonthEl.textContent=fmtBRL(Math.round(economiaMes));
  econYearEl.textContent=fmtBRL(Math.round(economiaAno));
  investEl.textContent=fmtBRL(Math.round(invest));
  paybackEl.textContent=`${payback} meses`;
  
  const msg=`Olá! Simulei no site da JP Eletro Solar:%0AConta: R$ ${value}%0AConsumo: ~${kwh} kWh/mês%0ASistema: ${kwpReal.toFixed(1)} kWp com ${placas} placas%0AEconomia: ${fmtBRL(economiaMes)}/mês%0AInvestimento: ${fmtBRL(invest)}%0APayback: ${payback} meses%0A%0AQuero orçamento para Pontal.`;
  const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  if(waSim) waSim.href=url;
  if(waFloat) waFloat.href=url;
  document.querySelectorAll('[data-wa-link]').forEach(a=>{
    const base=a.getAttribute('data-wa-base')||'Olá, gostaria de um orçamento com a JP Eletro Solar';
    a.href=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(base)}`;
  });
}
billInput.addEventListener('input',e=>{billNumber.value=e.target.value;calc(+e.target.value)});
billNumber.addEventListener('input',e=>{let v=+e.target.value;if(!v||v<120)v=120;if(v>5000)v=5000;billInput.value=v;calc(v)});
calc(+billInput.value);

// Form contato
document.getElementById('contact-form').addEventListener('submit',e=>{
  e.preventDefault();
  const nome=document.getElementById('c-nome').value.trim();
  const tel=document.getElementById('c-tel').value.trim();
  const serv=document.getElementById('c-serv').value;
  const msg=document.getElementById('c-msg').value.trim();
  const texto=`Olá JP Eletro Solar! Sou ${nome} (${tel}). Interesse: ${serv}. ${msg}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`,'_blank');
});

// Mascara telefone
document.getElementById('c-tel').addEventListener('input',e=>{
  let v=e.target.value.replace(/\D/g,'').slice(0,11);
  if(v.length>6)e.target.value=`(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  else if(v.length>2)e.target.value=`(${v.slice(0,2)}) ${v.slice(2)}`;
  else e.target.value=v;
});
