// Small DOM helpers shared by screens.

export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v;
    else if (k === 'style') Object.assign(node.style, v);
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  node.append(...children.filter((c) => c != null));
  return node;
}

/** Big visual for an item: emoji, color blob or number of dots. */
export function visual(item) {
  if (item.color) {
    return el('div', { class: 'blob', style: { background: item.color } });
  }
  if (item.dots) {
    const dots = el('div', { class: 'dots', 'data-n': item.dots });
    for (let i = 0; i < item.dots; i++) dots.append(el('span', { class: 'dot' }));
    return el('div', { class: 'number' }, el('div', { class: 'digit' }, String(item.dots)), dots);
  }
  return el('div', { class: 'emoji' }, item.emoji);
}

export function card(item, onTap) {
  return el('button', { class: 'card', type: 'button', 'aria-label': item.names.en, onclick: onTap }, visual(item));
}

export function replayAnimation(node, cls) {
  node.classList.remove(cls);
  void node.offsetWidth; // restart CSS animation
  node.classList.add(cls);
}

export function confetti(origin) {
  const layer = el('div', { class: 'confetti' });
  const emojis = ['🎉', '⭐', '✨', '🎈', '💛', '🌈'];
  const rect = origin?.getBoundingClientRect?.() || { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < 22; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 180;
    layer.append(el('span', {
      style: {
        left: `${cx}px`, top: `${cy}px`,
        '--dx': `${Math.cos(angle) * dist}px`, '--dy': `${Math.sin(angle) * dist}px`,
        fontSize: `${22 + Math.random() * 22}px`,
      },
    }, emojis[i % emojis.length]));
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 1400);
}

/** Button that only fires after being held for `ms` (keeps toddlers out of settings). */
export function holdButton(label, ms, onHold, hint) {
  let timer;
  const btn = el('button', { class: 'hold-btn', type: 'button', 'aria-label': hint, title: hint }, label);
  const start = (e) => { e.preventDefault(); btn.classList.add('holding'); timer = setTimeout(() => { btn.classList.remove('holding'); onHold(); }, ms); };
  const stop = () => { clearTimeout(timer); btn.classList.remove('holding'); };
  btn.addEventListener('pointerdown', start);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, stop));
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
  btn.addEventListener('keydown', (e) => { if (e.key === 'Enter') onHold(); });
  return btn;
}
