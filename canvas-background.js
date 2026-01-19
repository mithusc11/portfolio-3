
const canvas = document.getElementById('pixel-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const cols = canvas.width / 20;
const ypos = Array(Math.floor(cols)).fill(0);

function matrixRain() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#00ffe5';
  ctx.font = '16pt monospace';

  ypos.forEach((y, index) => {
    const text = String.fromCharCode(Math.random() * 128);
    const x = index * 20;
    ctx.fillText(text, x, y);
    if (y > 100 + Math.random() * 10000) ypos[index] = 0;
    else ypos[index] = y + 20;
  });
}

setInterval(matrixRain, 50);
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
