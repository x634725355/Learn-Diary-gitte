registerPaint('lg-border', class {
  bw = 4;

  paint(ctx, { width: w, height: h }) {
    // console.log(ctx, w, h, this.bw)
    const lg = ctx.createLinearGradient(0, 0, 0, h);
    const { bw } = this;
    const bw2 = bw * 2;
    lg.addColorStop(0, 'red');
    lg.addColorStop(1, 'black');

    const ix = w - bw2, iy = h - bw2, ox = w - bw, oy = h - bw;
    ctx.beginPath();
    ctx.moveTo(ix, iy);
    ctx.arc(ix, iy, bw, 0, Math.PI * 0.5);
    ctx.lineTo(bw2, oy);
    ctx.arc(bw2, iy, bw, Math.PI * 0.5, Math.PI);
    ctx.lineTo(bw, bw2);
    ctx.arc(bw2, bw2, bw, Math.PI, Math.PI * 1.5);
    ctx.lineTo(ix, bw);
    ctx.arc(ix, bw2, bw, Math.PI * 1.5, Math.PI * 2);
    ctx.lineTo(w, bw2);
    ctx.lineTo(w, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, h);
    ctx.lineTo(w, h);
    ctx.lineTo(w, bw2);
    ctx.lineTo(ox, bw2);
    ctx.lineTo(ox, iy);

    ctx.clip();
    
    ctx.fillStyle = lg;
    ctx.fillRect(0, 0, w, h);
  }
});
