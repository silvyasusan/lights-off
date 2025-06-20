const lamp = document.getElementById('lamp');
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let isDragging = false;

const velocity = { x: 0, y: 0 };
const damping = 0.1;  // Smoothness
const friction = 0.85; // Slow down over time

// Mobile touch support
const getEventPos = (e) => {
  if (e.touches) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  } else {
    return { x: e.clientX, y: e.clientY };
  }
};

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
  const pos = getEventPos(e);
  targetX = pos.x;
  targetY = pos.y;
  animateLamp();
}

function stopDragging() {
  isDragging = false;
}

function updateTarget(e) {
  if (!isDragging) return;
  const pos = getEventPos(e);
  targetX = pos.x;
  targetY = pos.y;
}

// Event Listeners
lamp.addEventListener('mousedown', startDragging);
lamp.addEventListener('touchstart', startDragging);

window.addEventListener('mousemove', updateTarget);
window.addEventListener('touchmove', updateTarget);

window.addEventListener('mouseup', stopDragging);
window.addEventListener('touchend', stopDragging);




const switchEl = document.getElementById('switch');
const celebration = document.getElementById('celebration');

// Enable glow when dragging
lamp.addEventListener('mousedown', () => lamp.classList.add('holding'));
lamp.addEventListener('touchstart', () => lamp.classList.add('holding'));
window.addEventListener('mouseup', () => lamp.classList.remove('holding'));
window.addEventListener('touchend', () => lamp.classList.remove('holding'));

// Show switch when lamp is nearby
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
lamp.addEventListener('mousedown', checkLampNearSwitch);
lamp.addEventListener('touchstart', checkLampNearSwitch);

// Turn on the light!
switchEl.addEventListener('click', () => {
  document.getElementById('room').style.display = 'none';
  celebration.style.display = 'block';
});

