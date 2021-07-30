const express = require('express')
const app = express()
const server = require('http').Server(app)
const socket = require('socket.io')

const port = process.env.PORT || '3000';

app.use(express.static('public'));

const io = socket(server);

io.on('connection', (socket) => {
    socket.on('stream', id => {
        socket.broadcast.emit('new-connection', id)
    })
}) 

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})