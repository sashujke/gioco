const playgorund = document.getElementById('playground');
const ctx = playground.getContext("2d");

let W = 0, H = 0; // larghezza ed altezza del canvas
function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    playground.width = W;
    playground.height = H;
}
resize();
window.addEventListener('resize', resize);

let me = {
    x: W/2,
    y: H/2,
    speed: 5,
    character: 'Persona12'
};
let others = []; // TODO riempire con i dati che arrivano dal server

const personW = 40;
const personH = 120;

function draw() {
    // gestione movimento
    if (goingUp) me.y -= me.speed;
    if (goingLeft) me.x -= me.speed;
    if (goingDown) me.y += me.speed;
    if (goingRight) me.x += me.speed;

    // pulisci lo sfondo
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.fillStyle = "#58a515";
    ctx.fill();

    others.forEach(p => drawPerson(p.x, p.y, personW, personH, p.character));
    drawPerson(me.x, me.y, personW, personH, me.character);

    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

function drawPerson(x, y, w, h, style) {
    const drawFunction = characters[style];
    drawFunction(x, y, w, h, style);
}

const socket = new WebSocket(`ws://localhost:4242`);
socket.addEventListener("message", async event => {
    // TODO aggiornare lo stato in base ai messaggi del server
});

// TODO spostare la gestione dei movimenti sul server
let goingUp = false;
let goingLeft = false;
let goingDown = false;
let goingRight = false;

document.addEventListener("keydown", (event) => {
    if (event.code == "KeyW") goingUp = true;
    else if (event.code == "KeyA") goingLeft = true;
    else if (event.code == "KeyS") goingDown = true;
    else if (event.code == "KeyD") goingRight = true;
});
document.addEventListener("keyup", (event) => {
    if (event.code == "KeyW") goingUp = false;
    else if (event.code == "KeyA") goingLeft = false;
    else if (event.code == "KeyS") goingDown = false;
    else if (event.code == "KeyD") goingRight = false;
});

const characters = {
    normalGuy: drawNormalGuy,
    Persona12: drawMarabunta,
}

function drawNormalGuy(x, y, w, h, style = {}) {
    ctx.save();

    // move origin (x=0, y=0) to the person center
    ctx.translate(x, y);
    const startX = -w/2;
    const startY = -h/2;


    // +head
    const headH = h * 0.3;

    ctx.beginPath();
    ctx.fillStyle = style.skinColor || "#eaa66e";
    ctx.rect(startX, startY, w, headH);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#151514";
    ctx.rect(startX, startY, w, headH/4);
    ctx.fill();
    // -head

    // +body
    const bodyStartY = startY + headH;
    const bodyH = h * 0.35;
    const armLen = 0.4 * w;

    ctx.beginPath();
    ctx.fillStyle = "#04097f";
    ctx.rect(startX, bodyStartY, w, bodyH); // body
    ctx.rect(startX - armLen, bodyStartY, armLen, 0.35*bodyH); // left arm
    ctx.rect(startX + w, bodyStartY, armLen, 0.35*bodyH); // left arm
    ctx.fill();
    // -body

    // +legs
    const legH = h - headH - bodyH;
    const legStartY = bodyStartY + bodyH;
    const legW = w * 0.35;

    ctx.beginPath();
    ctx.fillStyle = "#100712";
    ctx.rect(startX, legStartY, w, legH/3); // top
    ctx.rect(startX, legStartY, legW, legH); // left leg
    ctx.rect(startX + w - legW, legStartY, legW, legH); // right leg
    ctx.fill();
    // -legs

    // +bounding box
    ctx.beginPath();
    ctx.rect(startX, startY, w, h);
    ctx.strokeStyle = "#f620ef";
    ctx.stroke();
    /*
    */
    // -bounding box

    ctx.restore();
}

function drawMarabunta(x, y, w, h, style = {}) {
    ctx.save();

    // move origin (x=0, y=0) to the person center
    ctx.translate(x, y);
    const startX = -w/2;
    const startY = -h/2;

    // +head (carnagione scura)
    const headH = h * 0.3;

    ctx.beginPath();
    ctx.fillStyle = style.skinColor || "#5c4033";
    ctx.rect(startX, startY, w, headH);
    ctx.fill();

    // +capelli/bandana verde (Marabunta style)
    ctx.beginPath();
    ctx.fillStyle = "#228B22";
    ctx.rect(startX, startY, w, headH * 0.4);
    ctx.fill();

    // +occhi (scuri, visibili)
    ctx.fillStyle = "#1a1a1a";
    ctx.rect(startX + w * 0.15, startY + headH * 0.25, w * 0.18, headH * 0.2);
    ctx.rect(startX + w * 0.67, startY + headH * 0.25, w * 0.18, headH * 0.2);
    ctx.fill();

    // +baffi/barba nera (stile gang)
    ctx.fillStyle = "#0d0d0d";
    ctx.rect(startX + w * 0.2, startY + headH * 0.65, w * 0.6, headH * 0.15);
    ctx.fill();
    // -head

    // +body - Maglia GUCCI (rosso e oro)
    const bodyStartY = startY + headH;
    const bodyH = h * 0.35;
    const armLen = 0.4 * w;

    // +braccia PRIMA (pelle - visibili bene)
    ctx.beginPath();
    ctx.fillStyle = "#5c4033";
    ctx.rect(startX - armLen, bodyStartY, armLen, 0.4*bodyH); // left arm
    ctx.rect(startX + w, bodyStartY, armLen, 0.4*bodyH); // right arm
    ctx.fill();

    // maglia GUCCI rossa - corpo principale
    ctx.beginPath();
    ctx.fillStyle = "#cc0000";
    ctx.rect(startX, bodyStartY, w, bodyH); // corpo principale
    ctx.fill();

    // +colletto GUCCI (fascia oro/verde)
    ctx.fillStyle = "#FFD700";
    ctx.rect(startX + w * 0.2, bodyStartY, w * 0.6, bodyH * 0.08);
    ctx.fill();

    // +stripe oro TOP (prominente)
    ctx.fillStyle = "#FFD700";
    ctx.rect(startX + w * 0.05, bodyStartY + bodyH * 0.12, w * 0.9, bodyH * 0.1);
    ctx.fill();

    // +stripes verdi GUCCI (laterali - prominenti)
    ctx.fillStyle = "#228B22";
    ctx.rect(startX + w * 0.08, bodyStartY + bodyH * 0.08, w * 0.08, bodyH * 0.25);
    ctx.rect(startX + w * 0.84, bodyStartY + bodyH * 0.08, w * 0.08, bodyH * 0.25);
    ctx.fill();

    // +tasche GUCCI (oro)
    ctx.fillStyle = "#FFD700";
    ctx.rect(startX + w * 0.15, bodyStartY + bodyH * 0.5, w * 0.2, bodyH * 0.15);
    ctx.rect(startX + w * 0.65, bodyStartY + bodyH * 0.5, w * 0.2, bodyH * 0.15);
    ctx.fill();

    // +logo GUCCI doppio G (grande e vistoso - oro)
    ctx.fillStyle = "#FFD700";
    ctx.rect(startX + w * 0.3, bodyStartY + bodyH * 0.35, w * 0.4, bodyH * 0.18);
    ctx.fill();

    // +dettagli lettera G (rosso scuro nel logo)
    ctx.fillStyle = "#990000";
    ctx.rect(startX + w * 0.35, bodyStartY + bodyH * 0.4, w * 0.08, bodyH * 0.08);
    ctx.rect(startX + w * 0.57, bodyStartY + bodyH * 0.4, w * 0.08, bodyH * 0.08);
    ctx.fill();

    // +stripe oro BOTTOM (prominente)
    ctx.fillStyle = "#FFD700";
    ctx.rect(startX + w * 0.05, bodyStartY + bodyH * 0.75, w * 0.9, bodyH * 0.1);
    ctx.fill();

    // +bordo GUCCI finale (stretta linea verde)
    ctx.fillStyle = "#228B22";
    ctx.rect(startX, bodyStartY + bodyH * 0.95, w, bodyH * 0.05);
    ctx.fill();
    // -body

    // +legs (pantaloni NERI - visibili)
    const legH = h - headH - bodyH;
    const legStartY = bodyStartY + bodyH;
    const legW = w * 0.38;

    ctx.beginPath();
    ctx.fillStyle = "#1a1a1a";
    ctx.rect(startX - w * 0.05, legStartY, w * 1.1, legH/3); // cintura
    ctx.rect(startX, legStartY, legW, legH); // left leg
    ctx.rect(startX + w - legW, legStartY, legW, legH); // right leg
    ctx.fill();

    // +scarpe nere (semplici)
    ctx.fillStyle = "#1a1a1a";
    ctx.rect(startX, legStartY + legH * 0.85, legW, legH * 0.15);
    ctx.rect(startX + w - legW, legStartY + legH * 0.85, legW, legH * 0.15);
    ctx.fill();
    // -legs

    // +bounding box
    ctx.beginPath();
    ctx.rect(startX, startY, w, h);
    ctx.strokeStyle = "#0099cc";
    ctx.stroke();
    // -bounding box

    ctx.restore();
}
