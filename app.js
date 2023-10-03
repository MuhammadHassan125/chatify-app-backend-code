const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const PORT = 5000 || process.env.PORT;
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server);

const users=[{}];


io.on("connection", (socket) => {
  console.log("New Connection");

  socket.on('joined', ({ User }) => {
    users[socket.id]=User;
    console.log(`${User} has joined the chat`);
    socket.broadcast.emit('userJoined',{User:"Admin",message:` ${users[socket.id]} has joined`});
    socket.emit('welcome',({User:"Admin", message:`Welcome to the chat ${users[socket.id]}`}));
    socket.broadcast.emit('message',({User:"Admin", message:`${users[socket.id]} has joinned the chat`}));
  });


  socket.on('message',({message,id})=>{
    io.emit('sendMessage',{User:users[id],message,id});
})


  socket.on('userDisconnect',()=>{
    socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} user has left the chat`});
});

 
});

app.get('/', (req, res) => {
  res.send('Hello World from server!')
});

server.listen(PORT, () => {
  console.log("app is listening on port no 5000");
});
