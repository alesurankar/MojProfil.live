function generateStarTexture(size = 2048, starCount = 9000) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = 'rgb(0, 0, 20)';
  ctx.fillRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const maxD = Math.hypot(cx, cy);

  let placed = 0;
  while (placed < starCount) {
    const x = Math.random() * size;
    const y = Math.random() * size;

    // Distance from center (0..1)
    const d = Math.hypot(x - cx, y - cy) / maxD;

    // Density bias: MORE stars near center
    const density = Math.pow(1 - d, 1.2);
    if (Math.random() > density) continue;

    // Size bias: SMALLER stars near center
    const sizeBias = 0.4 + d * 0.8; // center ~0.4, edge ~1.2
    const radius = (Math.random() * 0.8 + 0.2) * sizeBias;

    // Brightness (optional subtle edge boost)
    const alpha = (Math.random() * 0.6 + 0.4) * (0.7 + d * 0.3);

    // Slight color variation
    const tint = Math.random() * 30;

    ctx.beginPath();
    ctx.fillStyle = `rgba(${255 - tint}, ${255 - tint}, 255, ${alpha})`;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    placed++;
  }

  return canvas;
}



const canvas = generateStarTexture(2048, 9000);

const link = document.createElement('a');
link.download = 'nz.png';
link.href = canvas.toDataURL('image/png');
link.click();
