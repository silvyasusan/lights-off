const lamp = document.getElementById('lamp');
const switchEl = document.getElementById('switch');
const darkroom = document.getElementById('darkroom');
const cozyroom = document.getElementById('cozyroom');
const particlesContainer = document.getElementById('particles');

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let isDragging = false;
let velocity = { x: 0, y: 0 };
const damping = 0.1;
const friction = 0.85;

function getPos(e) {
  return e.touches
    ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
    : { x: e.clientX, y: e.clientY };
}

function animateLamp() {
  const dx = targetX - currentX;
  const dy = targetY - currentY;

  velocity.x += dx * damping;
  velocity.y += dy * damping;
  velocity.x *= friction;
  velocity.y *= friction;

  currentX += velocity.x;
  currentY += velocity.y;

  lamp.style.transform = `translate(${currentX}px, ${currentY}px)`;

  if (isDragging) {
    requestAnimationFrame(animateLamp);
    checkNearSwitch();
  }
}

function startDrag(e) {
  isDragging = true;
  const pos = getPos(e);
  targetX = pos.x;
  targetY = pos.y;
  lamp.classList.add('holding');
  animateLamp();
}

function stopDrag() {
  isDragging = false;
  lamp.classList.remove('holding');
}

function updateTarget(e) {
  if (!isDragging) return;
  const pos = getPos(e);
  targetX = pos.x;
  targetY = pos.y;
}

// --- Switch Detection ---
function checkNearSwitch() {
  const lampRect = lamp.getBoundingClientRect();
  const switchRect = switchEl.getBoundingClientRect();
  const dx = lampRect.left - switchRect.left;
  const dy = lampRect.top - switchRect.top;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 100) {
    switchEl.classList.add('reveal');
  } else {
    switchEl.classList.remove('reveal');
  }
}

// --- Light Switch Action ---
switchEl.addEventListener('click', () => {
  darkroom.style.display = 'none';
  cozyroom.style.display = 'block';
  generateParticles();
});

// --- Light Particles That Float and Respond ---
const particles = [];
const NUM_PARTICLES = 50;

function generateParticles() {
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    particlesContainer.appendChild(p);
    particles.push({ el: p, vx: 0, vy: 0 });
  }
}

function updateParticles(mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2) {
  particles.forEach(p => {
    const rect = p.el.getBoundingClientRect();
    const dx = rect.left - mouseX;
    const dy = rect.top - mouseY;
    const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);

    p.vx += dx / dist * -0.3;
    p.vy += dy / dist * -0.3;

    p.vx *= 0.9;
    p.vy *= 0.9;

    const left = parseFloat(p.el.style.left);
    const top = parseFloat(p.el.style.top);
    p.el.style.left = `${left + p.vx}px`;
    p.el.style.top = `${top + p.vy}px`;
  });

  requestAnimationFrame(() => updateParticles(mouseX, mouseY));
}

window.addEventListener('mousemove', e => {
  updateParticles(e.clientX, e.clientY);
});

window.addEventListener('deviceorientation', (e) => {
  const x = (e.gamma || 0) * 10 + window.innerWidth / 2;
  const y = (e.beta || 0) * 10 + window.innerHeight / 2;
  updateParticles(x, y);
});

// --- Events ---
lamp.addEventListener('mousedown', startDrag);
lamp.addEventListener('touchstart', startDrag);
window.addEventListener('mousemove', updateTarget);
window.addEventListener('touchmove', updateTarget);
window.addEventListener('mouseup', stopDrag);
window.addEventListener('touchend', stopDrag);
