"use strict";const h=require("magic-string"),w=require("@vue/compiler-sfc"),y=require("child_process"),j=`@keyframes vtjump-overlay-appear{0%{opacity:0;transform:scale(.98)}to{opacity:1;transform:scale(1)}}@keyframes vtjump-info-appear{0%{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes vtjump-toast-appear{0%{opacity:0;transform:translate(-50%,16px);filter:blur(8px)}15%{opacity:1;transform:translate(-50%);filter:blur(0)}85%{opacity:1;transform:translate(-50%);filter:blur(0)}to{opacity:0;transform:translate(-50%,-16px);filter:blur(4px)}}.vtjump-overlay{position:absolute;background:linear-gradient(135deg,#4299e10a,#3182ce0f);border:1.5px solid rgba(66,153,225,.25);border-radius:4px;pointer-events:none;z-index:9998;box-shadow:0 0 0 1px #4299e114,0 2px 4px #4299e114,inset 0 0 15px #4299e108;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);animation:vtjump-overlay-appear .2s ease-out;transition:all .2s cubic-bezier(.4,0,.2,1)}.vtjump-overlay:before{content:"";position:absolute;top:-1px;right:-1px;bottom:-1px;left:-1px;background:linear-gradient(135deg,rgba(66,153,225,.15),transparent);border-radius:inherit;z-index:-1;opacity:.3}.vtjump-info{position:absolute;display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,#2d3748d9,#1a202cf2);color:#fff;padding:10px 14px;border-radius:8px;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-size:12px;line-height:1.4;white-space:nowrap;z-index:9999;pointer-events:none;box-shadow:0 4px 6px -1px #0000001a,0 2px 4px -1px #0000000f,0 0 0 1px #ffffff14;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);animation:vtjump-info-appear .2s cubic-bezier(.4,0,.2,1);transform-origin:center bottom}.vtjump-info:after{content:"";position:absolute;bottom:-4px;left:50%;transform:translate(-50%);width:8px;height:8px;background:inherit;border-radius:1px;transform-origin:center;rotate:45deg;box-shadow:2px 2px 4px #0000001a}.vtjump-info-icon{display:flex;align-items:center;justify-content:center;width:24px;height:24px;background:#4299e133;border-radius:6px;padding:5px;box-shadow:0 0 0 1px #4299e14d,inset 0 1px 1px #ffffff1a}.vtjump-info-icon svg{width:100%;height:100%;filter:drop-shadow(0 1px 1px rgba(0,0,0,.1))}.vtjump-info-text{display:flex;flex-direction:column;gap:2px}.vtjump-info-file{font-weight:500;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.1);letter-spacing:.01em;position:relative;padding-left:12px}.vtjump-info-file:before{content:"";position:absolute;left:0;top:50%;transform:translateY(-50%);width:6px;height:6px;background:#4299e1;border-radius:50%;box-shadow:0 0 8px #4299e199}.vtjump-info-line{color:#fff9;font-size:11px;font-weight:400;letter-spacing:.02em}.vtjump-info-line span{color:#4299e1;font-weight:500}.vtjump-info:hover{opacity:1}.vtjump-toast{position:fixed;bottom:40px;left:50%;transform:translate(-50%);background:#111827d9;color:#e2e8f0;padding:8px 16px 8px 12px;border-radius:6px;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-size:12px;font-weight:400;line-height:1.5;letter-spacing:.01em;white-space:nowrap;z-index:10000;display:flex;align-items:center;gap:6px;box-shadow:0 0 0 1px #ffffff1a,0 2px 4px #0000001a,0 8px 16px #0000001a;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);animation:vtjump-toast-appear 1.8s cubic-bezier(.16,1,.3,1) forwards;pointer-events:none}.vtjump-toast:before{content:"";width:14px;height:14px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%234ADE80' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M9 6.75 15 12l-6 5.25'/%3E%3C/svg%3E");opacity:.9}.vtjump-toast-content{display:flex;align-items:baseline;gap:4px}.vtjump-toast-label{color:#9ca3af;font-weight:400}.vtjump-toast-file{color:#fff;font-weight:500}.vtjump-toast-line{color:#4ade80;font-weight:500;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}@keyframes vtjump-ripple{0%{transform:scale(.5);opacity:.8}to{transform:scale(2);opacity:0}}
`,k=`(() => {
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
        l.style.cssText = \`
          position: fixed;
          left: \${n - 6}px;
          top: \${i - 6}px;
          width: 12px;
          height: 12px;
          background: rgba(74, 222, 128, 0.6);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          animation: vtjump-ripple 0.4s ease-out forwards;
        \`, document.body.appendChild(l), setTimeout(() => l.remove(), 400);
      }
      const s = document.createElement("div");
      s.className = "vtjump-toast", s.innerHTML = \`
        <div class="vtjump-toast-content">
          <span class="vtjump-toast-label">Jumping to file...</span>
        </div>
      \`, document.body.appendChild(s), setTimeout(() => s.remove(), 1800);
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
    const d = l.file.split("/").pop() || l.file, j = \`
      <div class="vtjump-info-icon">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2.5A2.5 2.5 0 014.5 0h7A2.5 2.5 0 0114 2.5v11a2.5 2.5 0 01-2.5 2.5h-7A2.5 2.5 0 012 13.5v-11z" fill="#4299e1"/>
          <path d="M6 5h4M6 8h4M6 11h4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
    \`;
    e.innerHTML = \`
      \${j}
      <div class="vtjump-info-text">
        <span class="vtjump-info-file">\${d}</span>
        <span class="vtjump-info-line">Line \${l.startLine}</span>
      </div>
    \`;
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
`,b=new Map;let S=0;function M(o,r){const e=`vtj-${++S}`;return b.set(e,{file:o,startLine:r,endLine:r}),e}const C=()=>`
<style>
${j}
</style>
`,$=()=>`
<script>
${k}
<\/script>
`;function L(o){return!/[A-Z]/.test(o)}const T=(o={})=>{let r;return{name:"vite:vtjump",configureServer(e){r=e,r.middlewares.use(async(n,t,s)=>{if(n.url==="/__vtjump"){const f=[];n.on("data",l=>f.push(l)),n.on("end",()=>{const l=JSON.parse(Buffer.concat(f).toString()),{id:g,getInfo:p}=l,c=b.get(g);if(c)if(p)t.setHeader("Content-Type","application/json"),t.end(JSON.stringify({location:c}));else{const i=o.protocol||"vscode",d=`${c.file}:${c.startLine}`;if(o.clientSideOpen)t.setHeader("Content-Type","application/json"),t.end(JSON.stringify({url:`${i}://file/${d}`}));else{const a=`${i}://file/${d}`,v=process.platform==="win32"?`start ${a}`:process.platform==="darwin"?`open "${a}"`:`xdg-open "${a}"`;y.exec(v,u=>{if(u){console.warn("Failed to open URL with system command:",u);const x=`${i} "${d}"`;y.exec(x,m=>{m?(console.error("Failed to open with protocol command:",m),t.statusCode=500,t.end(JSON.stringify({error:"Failed to open file"}))):t.end(JSON.stringify({success:!0}))})}else t.end(JSON.stringify({success:!0}))})}}else t.statusCode=404,t.end(JSON.stringify({error:"Location not found"}))});return}s()})},transform(e,n){if(!n.endsWith(".vue"))return;const{descriptor:t}=w.parse(e);if(!t.template)return;const s=new h(e),f=t.template.content;t.template.loc.start.line;const l=t.template.loc.start.offset,g=/<(\w+)([^>]*)>/g;let p;for(;(p=g.exec(f))!==null;){const[c,i,d]=p;if(!L(i)||d.includes("data-vtjump"))continue;const a=l+p.index,u=e.slice(0,a).split(`
`).length,x=M(n,u),m=a+i.length+1;s.appendLeft(m,` data-vtjump="${x}"`)}return{code:s.toString(),map:s.generateMap()}},transformIndexHtml(e){const n=new h(e),t=e.match(/<\/body>/i);return t&&n.appendLeft(t.index,`${C()}${$()}</body>`),{html:n.toString(),tags:[]}}}};module.exports=T;
