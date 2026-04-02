const cursor = document.querySelector(".cursor");
const canvas = document.querySelector(".cursor-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 120;
canvas.height = 120;

// particle positions
let particles = [
  { angle: 0, radius: 20 },
  { angle: 120, radius: 28 },
  { angle: 240, radius: 36 }
];

let mouseX = 0;
let mouseY = 0;
let posX = 0;
let posY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {
  // smooth cursor movement
  posX += (mouseX - posX) * 0.15;
  posY += (mouseY - posY) * 0.15;

  cursor.style.left = posX + "px";
  cursor.style.top = posY + "px";

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let points = [];

  // calculate particle positions
  particles.forEach((p, i) => {
    p.angle += 0.02 + i * 0.01;

    let x = 60 + Math.cos(p.angle) * p.radius;
    let y = 60 + Math.sin(p.angle) * p.radius;

    points.push({ x, y });
  });

  // draw lines between particles
  ctx.strokeStyle = "rgba(0,255,200,0.6)";
  ctx.lineWidth = 1;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[j].x, points[j].y);
      ctx.stroke();
    }
  }

  requestAnimationFrame(animate);
}

animate();





//BACKGROUND NETWORK
const canvasBg = document.getElementById("bg-network");
const ctxBg = canvasBg.getContext("2d");

canvasBg.width = window.innerWidth;
canvasBg.height = window.innerHeight;

let nodes = [];

// create nodes
for (let i = 0; i < 80; i++) {
  nodes.push({
    x: Math.random() * canvasBg.width,
    y: Math.random() * canvasBg.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5
  });
}

let mouse = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function drawNetwork() {
  ctxBg.clearRect(0, 0, canvasBg.width, canvasBg.height);

  // move nodes
nodes.forEach(node => {
  node.x += node.vx;
  node.y += node.vy;

  // 🔥 CURSOR INTERACTION
  let dxMouse = node.x - mouse.x;
  let dyMouse = node.y - mouse.y;
  let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

  if (distMouse < 100) {
    node.x += dxMouse * 0.02;
    node.y += dyMouse * 0.02;
  }

  // bounce
  if (node.x < 0 || node.x > canvasBg.width) node.vx *= -1;
  if (node.y < 0 || node.y > canvasBg.height) node.vy *= -1;
});



  // draw connections
 for (let i = 0; i < nodes.length; i++) {
  for (let j = i + 1; j < nodes.length; j++) {

    let dx = nodes[i].x - nodes[j].x;
    let dy = nodes[i].y - nodes[j].y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 120) {

      // 🔥 DISTANCE TO CURSOR (center of line)
      let midX = (nodes[i].x + nodes[j].x) / 2;
      let midY = (nodes[i].y + nodes[j].y) / 2;

      let dxMouse = midX - mouse.x;
      let dyMouse = midY - mouse.y;
      let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

      // 🎯 GLOW EFFECT
      if (distMouse < 150) {
        let intensity = 1 - distMouse / 150;

        ctxBg.strokeStyle = `rgba(0,255,200,${0.2 + intensity})`;
        ctxBg.lineWidth = 1 + intensity * 2;

        // glow blur
        ctxBg.shadowBlur = 10 * intensity;
        ctxBg.shadowColor = "rgba(0,255,200,0.8)";
      } else {
        ctxBg.strokeStyle = "rgba(0,255,200,0.1)";
        ctxBg.lineWidth = 1;
        ctxBg.shadowBlur = 0;
      }

      ctxBg.beginPath();
      ctxBg.moveTo(nodes[i].x, nodes[i].y);
      ctxBg.lineTo(nodes[j].x, nodes[j].y);
      ctxBg.stroke();
    }
  }
}


  // draw nodes
  nodes.forEach(node => {
    ctxBg.beginPath();
    ctxBg.arc(node.x, node.y, 2, 0, Math.PI * 2);
    ctxBg.fillStyle = "rgba(0,255,200,0.6)";
    ctxBg.fill();
  });

  requestAnimationFrame(drawNetwork);
}

drawNetwork();






// LENIS SMOOTH SCROLL
const lenis = new Lenis({
  duration: 1.2,
  smooth: true,
  direction: 'vertical',
  gestureDirection: 'vertical',
  smoothTouch: false,
});

// animation loop
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
// REGISTER GSAP PLUGIN
gsap.registerPlugin(ScrollTrigger);

// HERO ANIMATION (on load)
gsap.from(".title", {
  y: 80,
  opacity: 0,
  duration: 1.2,
  ease: "power3.out"
});

gsap.from(".subtitle", {
  y: 50,
  opacity: 0,
  duration: 1.2,
  delay: 0.3,
  ease: "power3.out"
});

// CARDS ANIMATION (on scroll)
gsap.from(".card", {
  scrollTrigger: {
    trigger: ".content",
    start: "top 80%",
  },
  y: 100,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
  ease: "power3.out"
});

// SYNC LENIS WITH GSAP
lenis.on('scroll', ScrollTrigger.update);

// PINNED SECTION ANIMATION
gsap.to(".pinned-inner", {
  scrollTrigger: {
    trigger: ".pinned",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: true,
  }
});

// TEXT ANIMATION INSIDE PIN
gsap.from(".pinned-title", {
  scrollTrigger: {
    trigger: ".pinned",
    start: "top center",
    end: "bottom center",
    scrub: true,
  },
  scale: 0.5,
  opacity: 0
});

gsap.from(".pinned-text", {
  scrollTrigger: {
    trigger: ".pinned",
    start: "top center+=100",
    end: "bottom center",
    scrub: true,
  },
  y: 50,
  opacity: 0
});





