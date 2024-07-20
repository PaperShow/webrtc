const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map();

wss.on('connection', (ws) => {
    ws.id = uuidv4(); // Generate a unique ID for the connection
    clients.set(ws.id, ws);

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'auth':
                // Handle user authentication
                ws.username = data.username;
                break;

            case 'message':
                // Send message to the target user
                const targetWs = Array.from(clients.values()).find(client => client.username === data.target);
                if (targetWs && targetWs.readyState === WebSocket.OPEN) {
                    targetWs.send(JSON.stringify({
                        type: 'message',
                        from: ws.username,
                        message: data.message,
                    }));
                }
                break;
        }
    });

    ws.on('close', () => {
        clients.delete(ws.id);
    });

    console.log(`Client ${ws.id} connected`);
});

console.log('WebSocket server is running on ws://localhost:8080');
