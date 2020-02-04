const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const jquery = require('jquery');

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'broadcast.html'));
});

app.get('/watch', (req, res) => {
    res.sendFile(path.join(__dirname, 'watch.html'));
});

app.get('/watchpc', (req, res) => {
    res.sendFile(path.join(__dirname, 'watchpc.html'));
});

app.get('/socket.io.js', (req, res) => {
    res.sendFile(path.join(__dirname, '/node_modules/socket.io-client/dist/socket.io.js'));
});

app.get('/jquery.min.js', (req, res) => {
    res.sendFile(path.join(__dirname, '/node_modules/jquery/dist/jquery.min.js'));
});

app.get('/exif.js', (req, res) => {
    res.sendFile(path.join(__dirname, '/node_modules/exif-js/exif.js'));
});

io.on('connection', (socket) => {
    socket.on('message', (message) => {
        socket.broadcast.emit('message', message);
    });

    socket.on('image', (dataURL) => {
        socket.broadcast.emit('image', dataURL);
    });
});

server.listen(process.env.PORT || 3000);