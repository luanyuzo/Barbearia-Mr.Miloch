const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }));
}
document.querySelector('#year').textContent = new Date().getFullYear();

// Horário local da barbearia (Campinas, SP). Não indica disponibilidade de agenda.
function atualizarFuncionamento(){
  const target=document.querySelector('#open-status');if(!target)return;
  const fmt=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
  const parts=Object.fromEntries(fmt.formatToParts(new Date()).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
  const day=parts.weekday;const mins=Number(parts.hour)*60+Number(parts.minute);
  if(day==='Sun'){target.textContent='Domingo: horário não confirmado. Consulte o agendamento.';return;}
  const start=day==='Sat'?8*60:9*60,end=day==='Sat'?17*60:20*60;
  target.textContent=mins>=start&&mins<end?'Dentro do horário habitual de atendimento':'Fora do horário habitual de atendimento';
}
atualizarFuncionamento();
// Atualiza o aviso de horário enquanto a página permanecer aberta.
setInterval(atualizarFuncionamento, 60 * 1000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) atualizarFuncionamento();
});

// Feed horizontal: exatamente uma fotografia por tela, inclusive em dispositivos móveis.
(()=>{const track=document.querySelector('.gallery-track');if(!track)return;const slides=[...track.querySelectorAll('.gallery-slide')];const counter=document.querySelector('.gallery-counter');let index=0;const update=()=>{index=Math.max(0,Math.min(slides.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));counter.textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0')};const go=delta=>{update();const next=(index+delta+slides.length)%slides.length;track.scrollTo({left:next*track.clientWidth,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})};document.querySelector('.gallery-prev').addEventListener('click',()=>go(-1));document.querySelector('.gallery-next').addEventListener('click',()=>go(1));track.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(1)}if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}});update()})();
