// Najil KK portfolio interactions — no framework required.
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

$('#year').textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = $('#menuToggle');
const nav = $('#nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
$$('#nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}));

// Theme switch with local preference
const themeToggle = $('#themeToggle');
if (localStorage.getItem('najil-theme') === 'light') document.body.classList.add('light');
function updateThemeIcon(){ themeToggle.innerHTML = document.body.classList.contains('light') ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>'; }
updateThemeIcon();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('najil-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  updateThemeIcon();
});

// Reading progress
const progress = $('#progress');
function updateProgress(){
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
}
addEventListener('scroll', updateProgress, {passive:true});
updateProgress();

// Scroll reveal
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.12});
$$('.reveal').forEach(el => revealObserver.observe(el));

// Rotating typewriter roles
const roleEl = $('#typedRole');
const roles = ['Linux systems','Docker containers','cloud technologies','hardware solutions','automation workflows'];
let roleIndex=0, charIndex=0, deleting=false;
function typeRole(){
  const word=roles[roleIndex];
  roleEl.textContent=word.slice(0,charIndex);
  if(!deleting && charIndex < word.length){charIndex++;setTimeout(typeRole,75);}
  else if(!deleting){deleting=true;setTimeout(typeRole,1250);}
  else if(charIndex>0){charIndex--;setTimeout(typeRole,35);}
  else{deleting=false;roleIndex=(roleIndex+1)%roles.length;setTimeout(typeRole,300);}
}
if(!matchMedia('(prefers-reduced-motion: reduce)').matches) typeRole();

// Gentle 3D tilt on pointer devices only
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
  $$('.tilt').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${-y*7}deg) rotateY(${x*8}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
  const glow=$('.cursor-glow');
  addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';},{passive:true});
}

// Copy email action
const toast=$('#toast');
let toastTimer;
function showToast(message){
  toast.textContent=message;toast.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2300);
}
$('#copyEmail').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText('najilkk97@gmail.com');showToast('Email address copied!');}
  catch{showToast('Email: najilkk97@gmail.com');}
});

// Contact form: retain normal Formspree submission and show a simple sending state.
$('#contactForm').addEventListener('submit',e=>{
  const form=e.currentTarget;
  if(!form.reportValidity()){e.preventDefault();return;}
  const button=$('.submit-btn',form);
  button.disabled=true;button.innerHTML='Sending… <i class="fa-solid fa-spinner fa-spin"></i>';
  $('#formNote').textContent='Sending your message…';
});

// Lightweight animated background particles; respects reduced-motion preference.
const canvas=$('#particles'), ctx=canvas.getContext('2d');
let particles=[], frame;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
function resizeCanvas(){
  const dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;
  canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  particles=Array.from({length:Math.min(55,Math.floor(innerWidth/24))},()=>({
    x:Math.random()*innerWidth,y:Math.random()*innerHeight,
    vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.5+.4
  }));
}
function drawParticles(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  particles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>innerWidth)p.vx*=-1;
    if(p.y<0||p.y>innerHeight)p.vy*=-1;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle='rgba(115,205,255,.55)';ctx.fill();
  });
  if(!reducedMotion) frame=requestAnimationFrame(drawParticles);
}
resizeCanvas();drawParticles();
addEventListener('resize',()=>{cancelAnimationFrame(frame);resizeCanvas();if(!reducedMotion)drawParticles();},{passive:true});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden)cancelAnimationFrame(frame);
  else if(!reducedMotion)drawParticles();
});
