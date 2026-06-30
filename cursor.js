const cat = document.getElementById('catCursor');
 
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6FCF', '#B388FF', '#FF9F45', '#2EC4B6'];
 
  const PAW_SVG = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <ellipse cx="12" cy="16" rx="6.5" ry="5"/>
      <ellipse cx="5.5" cy="9" rx="2.6" ry="3.3" transform="rotate(-20 5.5 9)"/>
      <ellipse cx="10" cy="5.5" rx="2.3" ry="3"/>
      <ellipse cx="14" cy="5.5" rx="2.3" ry="3"/>
      <ellipse cx="18.5" cy="9" rx="2.6" ry="3.3" transform="rotate(20 18.5 9)"/>
    </svg>`;
 
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentTilt = 0;
  let targetTilt = 0;
  let lastX = mouseX, lastY = mouseY;
 
  let lastPawX = mouseX, lastPawY = mouseY;
  let pawSide = 1;
  const PAW_SPACING = 26; // distância mínima entre patinhas
 
  function spawnPaw(x, y, angleRad) {
    const wrap = document.createElement('div');
    wrap.className = 'paw';
    const deg = (angleRad * 180 / Math.PI) + 90;
    wrap.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${deg}deg)`;
 
    const inner = document.createElement('div');
    inner.className = 'paw-inner';
    inner.style.color = colors[Math.floor(Math.random() * colors.length)];
    inner.innerHTML = PAW_SVG;
 
    wrap.appendChild(inner);
    document.body.appendChild(wrap);
 
    inner.addEventListener('animationend', () => wrap.remove());
    setTimeout(() => wrap.remove(), 1500); // fallback de segurança
  }
 
  function handleMove(x, y) {
    mouseX = x;
    mouseY = y;
 
    const dx = x - lastX;
    targetTilt = Math.max(-18, Math.min(18, dx * 1.4));
    lastX = x; lastY = y;
 
    const pdx = x - lastPawX;
    const pdy = y - lastPawY;
    const dist = Math.hypot(pdx, pdy);
 
    if (dist > PAW_SPACING) {
      const angle = Math.atan2(pdy, pdx);
      const perp = angle + Math.PI / 2;
      pawSide *= -1;
      const offset = 9;
      const px = x + Math.cos(perp) * offset * pawSide;
      const py = y + Math.sin(perp) * offset * pawSide;
      spawnPaw(px, py, angle);
      lastPawX = x;
      lastPawY = y;
    }
  }
 
  window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length) handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
 
  function render() {
    currentTilt += (targetTilt - currentTilt) * 0.15;
    cat.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) rotate(${currentTilt}deg)`;
    requestAnimationFrame(render);
  }
  render();