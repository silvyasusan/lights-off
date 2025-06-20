const lamp = document.getElementById('lamp');
let isDragging = false;
let currentX = 0;
let currentY = 0;
let velocity = { x: 0, y: 0 };
let targetX = 0;
let targetY = 0;
const friction = 0.85;
const damping = 0.1;

// Mobile or Mouse pos
const getEventPos = (e) => (e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY });

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

  if (isDragging) requestAnimationFrame(animateLamp);
}

function startDragging(e) {
  isDragging = true;
  lamp.classList.add('holding');
  const pos = getEventPos(e);
  targetX = pos.x;
  targetY = pos.y;
  animateLamp();
  checkLampNearSwitch();
}

function stopDragging() {
  isDragging = false;
  lamp.classList.remove('holding');
}

function updateTarget(e) {
  if (!isDragging) return;
  const pos = getEventPos(e);
  targetX = pos.x;
  targetY = pos.y;
}

lamp.addEventListener('mousedown', startDragging);
lamp.addEventListener('touchstart', startDragging);
window.addEventListener('mousemove', updateTarget);
window.addEventListener('touchmove', updateTarget);
window.addEventListener('mouseup', stopDragging);
window.addEventListener('touchend', stopDragging);

// === Switch Logic ===
const switchEl = document.getElementById('switch');
const celebration = document.getElementById('celebration');

function checkLampNearSwitch() {
  const lampRect = lamp.getBoundingClientRect();
  const switchRect = switchEl.getBoundingClientRect();
  const dx = lampRect.left - switchRect.left;
  const dy = lampRect.top - switchRect.top;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 100) {
    switchEl.classList.add('reveal');
  } else {
    switchEl.classList.remove('reveal');
  }

  if (isDragging) requestAnimationFrame(checkLampNearSwitch);
}

switchEl.addEventListener('click', () => {
  document.getElementById('room').style.display = 'none';
  celebration.style.display = 'block';
  startFairyCanvas();
});

// === Light Particles ===
function startFairyCanvas() {
  const canvas = document.getElementById('fairyCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: 0,
    vy: 0,
    r: Math.random() * 2 + 1,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Soft return toward center
      const dx = window.innerWidth / 2 - p.x;
      const dy = window.innerHeight / 2 - p.y;
      p.vx += dx * 0.0001;
      p.vy += dy * 0.0001;

      // Dampening
      p.vx *= 0.98;
      p.vy *= 0.98;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  // Tilt device
  window.addEventListener('deviceorientation', (e) => {
    const tiltX = e.gamma / 30;
    const tiltY = e.beta / 30;
    for (let p of particles) {
      p.vx += tiltX;
      p.vy += tiltY;
    }
  });

  // Mouse movement for particles
  window.addEventListener('mousemove', (e) => {
    const mx = e.clientX;
    const my = e.clientY;
    for (let p of particles) {
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = dx * dx + dy * dy;
      if (dist < 10000) {
        p.vx += dx * 0.002;
        p.vy += dy * 0.002;
      }
    }
  });

  draw();
}

