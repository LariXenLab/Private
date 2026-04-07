
let mouse = {
  x: null,
  y: null,
  radius: 120
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

const cursor = document.querySelector(".cursor");

window.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

document.querySelectorAll("a, button, .stack-card").forEach(el => {
  el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
});

/* =========================
   GSAP SETUP
========================= */
gsap.registerPlugin(ScrollTrigger);


/* =========================
   PROFILE ROTATION
========================= */
gsap.to(".profile-inner", {
  rotateY: 180,
  ease: "none",
  scrollTrigger: {
    trigger: ".profile-layout",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});


/* =========================
   STACK CARDS (SAFE VERSION)
========================= */
const cards = gsap.utils.toArray(".stack-card");

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".stack",
    start: "top 80%",
    end: "bottom 20%",
    scrub: true
  }
});

cards.forEach((card, i) => {
  tl.to(card, {
    y: -60 * i,
    scale: 1 - i * 0.05,
    opacity: 1 - i * 0.15,
    ease: "none"
  }, i * 0.2);
});


/* =========================
   BACKGROUND NETWORK
========================= */
const canvasBg = document.getElementById("bg-network");
const ctx = canvasBg.getContext("2d");

canvasBg.width = window.innerWidth;
canvasBg.height = window.innerHeight;

let nodes = [];

for (let i = 0; i < 80; i++) {
  nodes.push({
    x: Math.random() * canvasBg.width,
    y: Math.random() * canvasBg.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5
  });
}

function drawNetwork() {
  ctx.clearRect(0, 0, canvasBg.width, canvasBg.height);

  // DRAW LINES
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let dx = nodes[i].x - nodes[j].x;
      let dy = nodes[i].y - nodes[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        let opacity = (1 - dist / 120) * 0.2;

// boost near mouse
  if (mouse.x && mouse.y) {
   let mx = (nodes[i].x + nodes[j].x) / 2;
   let my = (nodes[i].y + nodes[j].y) / 2;

   let dmx = mouse.x - mx;
   let dmy = mouse.y - my;
   let mdist = Math.sqrt(dmx * dmx + dmy * dmy);

   if (mdist < 150) {
    opacity += (150 - mdist) / 150 * 0.4;
   }
 }

        ctx.strokeStyle = `rgba(10, 37, 64, ${opacity})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // DRAW NODES
nodes.forEach(node => {

  let size = 2;

  if (mouse.x && mouse.y) {
    let dx = mouse.x - node.x;
    let dy = mouse.y - node.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 120) {
      size = 2 + (120 - dist) / 40;
    }
  }

  ctx.beginPath();   // 🔥 must come first
  ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(10, 37, 64, 0.8)";
  ctx.fill();

  // movement
// =========================
// MAGNETIC EFFECT
// =========================
if (mouse.x && mouse.y) {
  let dx = mouse.x - node.x;
  let dy = mouse.y - node.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < mouse.radius) {
    let force = (mouse.radius - distance) / mouse.radius;

    node.x -= dx * force * 0.04;
    node.y -= dy * force * 0.04;
  }
}

// NORMAL MOVEMENT
node.x += node.vx;
node.y += node.vy;


  if (node.x < 0 || node.x > canvasBg.width) node.vx *= -1;
  if (node.y < 0 || node.y > canvasBg.height) node.vy *= -1;
});


  if (mouse.x && mouse.y) {
  const gradient = ctx.createRadialGradient(
    mouse.x, mouse.y, 0,
    mouse.x, mouse.y, 120
  );

  gradient.addColorStop(0, "rgba(0,120,255,0.15)");
  gradient.addColorStop(1, "rgba(0,120,255,0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
  ctx.fill();
}


  requestAnimationFrame(drawNetwork);
}

drawNetwork();


/* =========================
   RESIZE FIX
========================= */
window.addEventListener("resize", () => {
  canvasBg.width = window.innerWidth;
  canvasBg.height = window.innerHeight;
});


/* =========================
   SMOOTH SCROLL (LENIS)
========================= */
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);