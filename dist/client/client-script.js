(() => {
  let o = null, e = null, c = !1, a = null, r = null, u = null, h = /* @__PURE__ */ new Map();
  async function w(t) {
    if (h.has(t))
      return h.get(t);
    try {
      const n = await fetch("/__vtjump", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: t, getInfo: !0 })
      });
      if (n.ok) {
        const i = await n.json();
        if (i.location)
          return h.set(t, i.location), i.location;
      }
    } catch (n) {
      console.error("Failed to fetch location:", n);
    }
    return null;
  }
  async function y(t, n = null, i = null) {
    const p = t.getAttribute("data-vtjump");
    if (p) {
      if (n !== null && i !== null) {
        const l = document.createElement("div");
        l.style.cssText = `
          position: fixed;
          left: ${n - 6}px;
          top: ${i - 6}px;
          width: 12px;
          height: 12px;
          background: rgba(74, 222, 128, 0.6);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          animation: vtjump-ripple 0.4s ease-out forwards;
        `, document.body.appendChild(l), setTimeout(() => l.remove(), 400);
      }
      const s = document.createElement("div");
      s.className = "vtjump-toast", s.innerHTML = `
        <div class="vtjump-toast-content">
          <span class="vtjump-toast-label">Jumping to file...</span>
        </div>
      `, document.body.appendChild(s), setTimeout(() => s.remove(), 1800);
      try {
        const l = await fetch("/__vtjump", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: p
          })
        });
        if (l.ok) {
          const d = await l.json();
          d.url ? window.location.href = d.url : d.success ? console.log("File opened by server") : d.error && console.error("Failed to open file:", d.error);
        }
      } catch (l) {
        console.error("Failed to execute jump:", l);
      }
    }
  }
  async function g(t) {
    if (!t) return;
    const n = t.getAttribute("data-vtjump");
    if (!n) return;
    o || (o = document.createElement("div"), o.className = "vtjump-overlay", document.body.appendChild(o)), e || (e = document.createElement("div"), e.className = "vtjump-info", document.body.appendChild(e));
    const i = t.getBoundingClientRect(), p = window.scrollX, s = window.scrollY;
    o.style.left = i.left + p + "px", o.style.top = i.top + s + "px", o.style.width = i.width + "px", o.style.height = i.height + "px";
    const l = await w(n);
    if (!l) return;
    const d = l.file.split("/").pop() || l.file, j = `
      <div class="vtjump-info-icon">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2.5A2.5 2.5 0 014.5 0h7A2.5 2.5 0 0114 2.5v11a2.5 2.5 0 01-2.5 2.5h-7A2.5 2.5 0 012 13.5v-11z" fill="#4299e1"/>
          <path d="M6 5h4M6 8h4M6 11h4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
    `;
    e.innerHTML = `
      ${j}
      <div class="vtjump-info-text">
        <span class="vtjump-info-file">${d}</span>
        <span class="vtjump-info-line">Line ${l.startLine}</span>
      </div>
    `;
    const f = e.getBoundingClientRect();
    let m = i.left + p + (i.width - f.width) / 2, v = i.top + s - 8;
    m + f.width > window.innerWidth && (m = window.innerWidth - f.width - 16), m < 16 && (m = 16), v - f.height < 0 ? (v = i.bottom + s + 8, e.style.transform = "none", e.classList.add("vtjump-info-bottom")) : (v = i.top + s - f.height - 8, e.style.transform = "none", e.classList.remove("vtjump-info-bottom")), e.style.left = m + "px", e.style.top = v + "px";
  }
  document.addEventListener("keydown", (t) => {
    t.key === "Control" || t.key === "Meta" && /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? (c = !0, document.body.style.cursor = "crosshair", r && r.getAttribute("data-vtjump") && (a = r, u = r, g(r))) : t.key.toLowerCase() === "x" && u && y(u);
  }), document.addEventListener("keyup", (t) => {
    (t.key === "Control" || t.key === "Meta" && /Mac|iPod|iPhone|iPad/.test(navigator.platform)) && (c = !1, document.body.style.cursor = "", o && (o.remove(), o = null), e && (e.remove(), e = null), a = null);
  }), document.addEventListener("mouseover", (t) => {
    const n = t.target;
    if (r = n, !c) return;
    n.getAttribute("data-vtjump") && (a = n, u = n, g(n));
  }), document.addEventListener("mouseout", (t) => {
    c && t.relatedTarget === null && (o && (o.remove(), o = null), e && (e.remove(), e = null), a = null, r = null);
  }), document.addEventListener("click", (t) => {
    c && a && (t.preventDefault(), t.stopPropagation(), y(a, t.clientX, t.clientY), c = !1, document.body.style.cursor = "", o && (o.remove(), o = null), e && (e.remove(), e = null), a = null, r = null, u = null);
  });
})();
