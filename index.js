const WebSocket = require('ws')
const fs = require('fs')

const wss = new WebSocket.Server({port: 8080});

wss.on('connection', (ws)=>{
    ws.on('message', (message)=>{
        fs.writeFile('received_file', message, (err)=>{
            if (err) {
                console.error('Failed to save file', err);
                ws.send('Failed to save file');
            } else {
                console.log('File saved successfully');
                ws.send('File received and saved');
            }
        })
    })

    ws.on('close', () => {
        console.log('Client disconnected');
    });
})

console.log('WebSocket for File server is running on ws://localhost:8080');