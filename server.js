const wsLib = require('ws');
const { randomUUID } = require('node:crypto');

const WebSocketServer = wsLib.WebSocketServer || wsLib.Server;

const port = 4242;
const server = new WebSocketServer({ port });

console.log("Server ws in ascolto su ws://localhost:"+port);

const people = new Map();

function randomFill() {
    const hue = Math.random() * 360;
    return `hsl(${hue}, 100%, 67%)`;
}

function broadcastPlayers() {
    const message = JSON.stringify({
        type: "players",
        players: Array.from(people.values())
    });

    server.clients.forEach((client) => {
        if (client.readyState === wsLib.OPEN || client.readyState === 1) {
            client.send(message);
        }
    });
}

server.on("connection", (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log("Nuova connessione da " + clientIp);

    const id = randomUUID();
    people.set(id, {
        id,
        x: 300,
        y: 250,
        fill: randomFill()
    });

    ws.send(JSON.stringify({ type: "me", id }));
    broadcastPlayers();

    ws.on("message", data => {
        let msg;

        try {
            msg = JSON.parse(data.toString());
        } catch {
            return;
        }

        if (msg.type !== "move") return;

        const me = people.get(id);
        if (!me) return;

        if (typeof msg.x === "number") me.x = msg.x;
        if (typeof msg.y === "number") me.y = msg.y;

        people.set(id, me);
        broadcastPlayers();
    });

    ws.on("close", () => {
        console.log("Client disconnesso: " + clientIp);
        people.delete(id);
        broadcastPlayers();
    });
});