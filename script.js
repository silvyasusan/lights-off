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
