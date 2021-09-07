const express = require('express');
const app = express();
const server = require('http').Server(app); //서버 생성
const io = require('socket.io')(server);//서버 socket.io에 넘김
const { v4: uuidV4 } = require('uuid');//아이디

app.set('view engine', 'ejs') //
app.use(express.static('public')) // set up static folders,퍼블릭으로

app.get('/', (req, res) => { //create brand new room &
  res.redirect(`/${uuidV4()}`) //랜덤 uuid로 생성된 방에 dynamic 리다이렉
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
}) //get a room

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(3000)
