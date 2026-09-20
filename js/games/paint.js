import { el, holdButton, confetti, replayAnimation } from '../ui.js';
import { speak } from '../speech.js';
import { settings, saveSettings, t, pick } from '../i18n.js';
import { CATEGORIES } from '../data.js';

// Colouring mode. The child scribbles anywhere; the colour is chosen by the
// region under the pen (so it changes by itself when crossing regions), paint
// never leaves the region, and a region that is scribbled about half way is
// filled in completely. Works with a finger, Apple Pencil or a mouse.

const COLORS = Object.fromEntries(CATEGORIES.find((c) => c.id === 'colors').items.map((i) => [i.id, i]));
const INK = '#3d2c1e';
const BRUSH = 7; // brush width, in drawing units (drawing is 100 x 100)
const LINE = 1.3; // outline width
const ID_RES = 256; // resolution of the hidden "which region is here" map
const GRID = 32; // coverage grid used to decide when a region is done
const AUTOFILL = 0.5; // share of a region to scribble before it is filled
const STEP = 2; // sampling distance along a stroke, in units
const FULL = 'M-10 -10H110V110H-10Z';

function prepare(drawing) {
  return drawing.regions.map((r, i, all) => ({
    color: COLORS[r.c],
    path: new Path2D(r.d),
    // Regions drawn later sit on top: their area is cut out of this one.
    above: all.slice(i + 1).map((o) => new Path2D(FULL + o.d)),
  }));
}

/** Draw only the black outlines, hiding lines that are behind a later region. */
function drawOutlines(canvas, regions) {
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const k = canvas.width / 100;
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.lineWidth = LINE;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = INK;
  for (const r of regions) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill(r.path);
    ctx.restore();
    ctx.stroke(r.path);
  }
}

function sizedCanvas(cssSize) {
  const c = document.createElement('canvas');
  const px = Math.round(cssSize * Math.min(window.devicePixelRatio || 1, 2));
  c.width = c.height = px;
  return c;
}

/** Small preview of a drawing for the chooser screen. */
export function thumbnail(drawing) {
  const c = sizedCanvas(240);
  drawOutlines(c, prepare(drawing));
  c.className = 'thumb';
  return c;
}

export function startPaint(root, drawing) {
  const regions = prepare(drawing);

  // --- hidden map: which region is at a point (region index + 1, 0 = none)
  // Ids are spread over the 0-255 range (not 1, 2, 3...) so that any rounding or
  // colour-management difference between browsers cannot turn one region into another.
  const idStep = Math.max(1, Math.floor(250 / regions.length));
  const idMap = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = ID_RES;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.scale(ID_RES / 100, ID_RES / 100);
    regions.forEach((r, i) => { ctx.fillStyle = `rgb(${(i + 1) * idStep},0,0)`; ctx.fill(r.path); });
    return ctx.getImageData(0, 0, ID_RES, ID_RES).data;
  })();
  const idAt = (x, y) => {
    if (x < 0 || y < 0 || x >= 100 || y >= 100) return 0;
    const i = (Math.floor((y * ID_RES) / 100) * ID_RES + Math.floor((x * ID_RES) / 100)) * 4;
    if (idMap[i + 3] < 128) return 0;
    const id = Math.round(idMap[i] / idStep);
    return id <= regions.length ? id : 0;
  };

  // --- coverage grid, to know when a region is "done"
  const cell = 100 / GRID;
  const cellRegion = new Uint8Array(GRID * GRID);
  const total = regions.map(() => 0);
  for (let gy = 0; gy < GRID; gy++) {
    for (let gx = 0; gx < GRID; gx++) {
      const id = idAt((gx + 0.5) * cell, (gy + 0.5) * cell);
      cellRegion[gy * GRID + gx] = id;
      if (id) total[id - 1]++;
    }
  }

  // --- state
  let ops = []; // everything painted, so it can be replayed after a resize
  let painted = regions.map(() => new Set());
  let done = regions.map(() => false);
  let finished = false;
  let penSeen = false;
  let activeId = null;
  let last = null;
  let lastRegion = -1;
  let lastSpoken = 0;

  // --- DOM
  const paint = document.createElement('canvas');
  const lines = document.createElement('canvas');
  const caption = el('div', { class: 'paint-caption' });
  const wrap = el('div', { class: 'paint-wrap' }, paint, lines, caption);
  // Quick mute for this mode (short hold, so a toddler doesn't toggle it by accident).
  const muteBtn = holdButton(settings.drawSound ? '🔊' : '🔇', 700, () => {
    settings.drawSound = !settings.drawSound;
    saveSettings();
    muteBtn.textContent = settings.drawSound ? '🔊' : '🔇';
    if (!settings.drawSound) window.speechSynthesis?.cancel();
  }, t().drawSound);
  muteBtn.classList.add('sound-toggle');
  root.append(wrap, muteBtn, holdButton('🗑️', 1000, clearAll, t().holdHint));
  const pctx = paint.getContext('2d');

  const withClip = (region, fn) => {
    pctx.save();
    const k = paint.width / 100;
    pctx.setTransform(k, 0, 0, k, 0, 0);
    pctx.clip(region.path);
    for (const p of region.above) pctx.clip(p, 'evenodd');
    fn();
    pctx.restore();
  };

  function draw(op) {
    const region = regions[op.r];
    withClip(region, () => {
      pctx.strokeStyle = pctx.fillStyle = region.color.color;
      if (op.fill) {
        pctx.fillRect(-10, -10, 120, 120);
      } else if (op.ax === op.bx && op.ay === op.by) {
        // a tap without movement: a zero-length line is not drawn reliably, so draw a dot
        pctx.beginPath();
        pctx.arc(op.ax, op.ay, BRUSH / 2, 0, Math.PI * 2);
        pctx.fill();
      } else {
        pctx.lineWidth = BRUSH;
        pctx.lineCap = 'round';
        pctx.beginPath();
        pctx.moveTo(op.ax, op.ay);
        pctx.lineTo(op.bx, op.by);
        pctx.stroke();
      }
    });
  }

  function layout() {
    const size = Math.floor(Math.min(window.innerWidth, window.innerHeight, 1000) - 32);
    const px = Math.round(size * Math.min(window.devicePixelRatio || 1, 2));
    for (const c of [paint, lines]) {
      c.width = c.height = px;
      c.style.width = c.style.height = `${size}px`;
    }
    wrap.style.width = wrap.style.height = `${size}px`;
    drawOutlines(lines, regions);
    ops.forEach(draw);
  }

  function clearAll() {
    ops = [];
    painted = regions.map(() => new Set());
    done = regions.map(() => false);
    finished = false;
    pctx.clearRect(0, 0, paint.width, paint.height);
  }

  const toScreen = (x, y) => {
    const r = lines.getBoundingClientRect();
    return { getBoundingClientRect: () => ({ left: r.left + (x / 100) * r.width, top: r.top + (y / 100) * r.height, width: 0, height: 0 }) };
  };

  function complete(ri, x, y) {
    done[ri] = true;
    const op = { r: ri, fill: true };
    ops.push(op);
    draw(op);
    if (done.every(Boolean) && !finished) {
      finished = true;
      confetti(toScreen(50, 50), 40);
      if (loud()) speak(pick(t().yes));
    } else {
      confetti(toScreen(x, y), 8);
    }
  }

  function markCells(ri, x, y) {
    const rad = BRUSH / 2 + cell / 2;
    for (let gy = Math.max(0, Math.floor((y - rad) / cell)); gy <= Math.min(GRID - 1, Math.floor((y + rad) / cell)); gy++) {
      for (let gx = Math.max(0, Math.floor((x - rad) / cell)); gx <= Math.min(GRID - 1, Math.floor((x + rad) / cell)); gx++) {
        const idx = gy * GRID + gx;
        if (cellRegion[idx] === ri + 1 && Math.hypot((gx + 0.5) * cell - x, (gy + 0.5) * cell - y) <= rad) painted[ri].add(idx);
      }
    }
    if (!done[ri] && (total[ri] === 0 || painted[ri].size >= Math.ceil(total[ri] * AUTOFILL))) complete(ri, x, y);
  }

  const loud = () => settings.sound && settings.drawSound;

  // Silent mode: show the color name as a pill of that color instead of saying it.
  let captionTimer;
  function showCaption(color) {
    caption.textContent = color.names[settings.lang];
    caption.style.background = color.color;
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.color.slice(i, i + 2), 16));
    caption.style.color = r * 0.299 + g * 0.587 + b * 0.114 > 150 ? INK : '#fff';
    replayAnimation(caption, 'pop');
    caption.classList.add('show');
    clearTimeout(captionTimer);
    captionTimer = setTimeout(() => caption.classList.remove('show'), 1400);
  }

  function announce(ri) {
    const color = regions[ri].color;
    if (!loud()) return showCaption(color);
    const now = performance.now();
    if (now - lastSpoken < 1500) return;
    lastSpoken = now;
    speak(color.names[settings.lang], color.id);
  }

  /** Paint from a to b (drawing units) in every region the stroke passes through. */
  function stroke(a, b) {
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / STEP));
    const hit = new Set();
    for (let s = 0; s <= n; s++) {
      const x = a[0] + ((b[0] - a[0]) * s) / n;
      const y = a[1] + ((b[1] - a[1]) * s) / n;
      const id = idAt(x, y);
      if (id) { hit.add(id - 1); markCells(id - 1, x, y); }
    }
    for (const ri of hit) {
      const op = { r: ri, ax: a[0], ay: a[1], bx: b[0], by: b[1] };
      ops.push(op);
      draw(op);
    }
    const end = idAt(b[0], b[1]) - 1;
    if (end >= 0 && end !== lastRegion) announce(end);
    lastRegion = end;
  }

  const point = (e) => {
    const r = lines.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100];
  };

  wrap.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'pen') penSeen = true;
    if (activeId !== null || (e.pointerType === 'touch' && penSeen)) return; // one pointer; palm rejection with a pencil
    activeId = e.pointerId;
    wrap.setPointerCapture(e.pointerId);
    lastRegion = -1;
    last = point(e);
    stroke(last, last);
  });
  wrap.addEventListener('pointermove', (e) => {
    if (e.pointerId !== activeId) return;
    const events = e.getCoalescedEvents?.() || [];
    for (const ev of events.length ? events : [e]) {
      const p = point(ev);
      stroke(last, p);
      last = p;
    }
  });
  const end = (e) => { if (e.pointerId === activeId) activeId = null; };
  wrap.addEventListener('pointerup', end);
  wrap.addEventListener('pointercancel', end);

  layout();
  window.addEventListener('resize', layout);
  return () => { window.removeEventListener('resize', layout); clearTimeout(captionTimer); };
}
