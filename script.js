// JP Eletro Solar - Script Principal
// CONFIG - TROQUE AQUI SEU WHATSAPP
const WHATSAPP_NUMBER = '5516999999999'; // ex: 5516...

/* Menu Mobile */
const menuBtn = document.getElementById('menu-btn');
const mobileNav = document.getElementById('mobile-nav');
const openI = document.getElementById('menu-open');
const closeI = document.getElementById('menu-close');
if(menuBtn){
  menuBtn.addEventListener('click', () => {
      const isOpen = !mobileNav.classList.contains('hidden');
      mobileNav.classList.toggle('hidden');
      if(openI && closeI){
        openI.classList.toggle('hidden', !isOpen);
        closeI.classList.toggle('hidden', isOpen);
      }
  });
  document.querySelectorAll('#mobile-nav a').forEach(a => a.addEventListener('click', () => {
      mobileNav.classList.add('hidden');
      openI.classList.remove('hidden');
      closeI.classList.add('hidden');
  }));
}

// Header sombra ao rolar
const headerInner = document.getElementById('header-inner');
window.addEventListener('scroll', () => {
    if (window.scrollY > 16) {
        headerInner.classList.add('!bg-slate-950/95', 'shadow-lg');
    } else {
        headerInner.classList.remove('!bg-slate-950/95', 'shadow-lg');
    }
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Ano footer
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// ===== SIMULADOR SOLAR =====
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

function fmtBRL(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

function calc(value) {
    const tariff = 0.95;
    const kwh = Math.round(value / tariff);
    const kwh_per_kwp_month = 135;
    const kwp = kwh / kwh_per_kwp_month;
    const placas = Math.max(4, Math.ceil(kwp / 0.55));
    const kwpReal = placas * 0.55;

    const economiaMes = value * 0.92;
    const economiaAno = economiaMes * 12;

    let invest = kwpReal * 3200 + 2600;
    if (invest < 8900) invest = 8900;
    const payback = Math.round(invest / economiaMes);

    if(kwhEl) kwhEl.textContent = `~${kwh.toLocaleString('pt-BR')} kWh/mês`;
    if(kwpEl) kwpEl.textContent = `${kwpReal.toFixed(1).replace('.', ',')} kWp`;
    if(platesEl) platesEl.textContent = `${placas} placas`;
    if(econMonthEl) econMonthEl.textContent = fmtBRL(Math.round(economiaMes));
    if(econYearEl) econYearEl.textContent = fmtBRL(Math.round(economiaAno));
    if(investEl) investEl.textContent = fmtBRL(Math.round(invest));
    if(paybackEl) paybackEl.textContent = `${payback} meses`;

    const msg = `Olá! Simulei no site da JP Eletro Solar:%0AConta atual: R$ ${value}%0AConsumo: ~${kwh} kWh/mês%0ASistema: ${kwpReal.toFixed(1)} kWp com ${placas} placas%0AEconomia: ${fmtBRL(economiaMes)}/mês%0AInvestimento aprox: ${fmtBRL(invest)}%0APayback: ${payback} meses%0A%0AQuero um orçamento detalhado para meu endereço em Pontal.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    if(waSim) waSim.href = url;
    if(waFloat) waFloat.href = url;
    
    // atualiza links fixos
    document.querySelectorAll('[data-wa-link]').forEach(a=>{
      const base = a.getAttribute('data-wa-base') || 'Olá, gostaria de um orçamento com a JP Eletro Solar';
      a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(base)}`;
    });
}

if(billInput && billNumber){
  billInput.addEventListener('input', (e) => {
      billNumber.value = e.target.value;
      calc(Number(e.target.value));
  });
  billNumber.addEventListener('input', (e) => {
      let v = Number(e.target.value);
      if (!v || v < 120) v = 120;
      if (v > 5000) v = 5000;
      billInput.value = v;
      calc(v);
  });
  calc(Number(billInput.value));
}

// Form contato -> whatsapp
const contactForm = document.getElementById('contact-form');
if(contactForm){
  contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('c-nome').value.trim();
      const tel = document.getElementById('c-tel').value.trim();
      const serv = document.getElementById('c-serv').value;
      const msg = document.getElementById('c-msg').value.trim();
      const texto = `Olá JP Eletro Solar! Meu nome é ${nome} (${tel}).%0AInteresse: ${serv}%0A${msg ? `Mensagem: ${msg}` : ''}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`, '_blank');
  });
}

// Mask telefone
const telInput = document.getElementById('c-tel');
if(telInput){
  telInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) e.target.value = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      else if (v.length > 2) e.target.value = `(${v.slice(0,2)}) ${v.slice(2)}`;
      else e.target.value = v;
  });
}
