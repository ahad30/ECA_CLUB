  const express = require('express')
  require('./db/mongoose')
  const cors = require('cors');
  const http = require('http');
  const socketIo = require('socket.io');


  const authRoutes = require('./routes/auth');
  const commentRoutes = require('./routes/comments');


  const app = express()

  app.use(express.json())
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: ["http://localhost:5173" , "http://localhost:5174"],
      credentials: true,
      optionSuccessStatus: 200,
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });


  // Middleware
  app.use(
    cors({
      origin: ['http://localhost:5173' , 'http://localhost:5174'],
      credentials: true,
      optionSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
  );
  app.use(express.json());
  app.set('io', io);

  //Routes
  app.get('/', (req, res) => {
    res.send('Welcome to the Comment system!');
  });
  app.use('/api',authRoutes)
  app.use('/api',commentRoutes)


  // Socket.io for real-time updates
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('new-comment', (data) => {
      socket.broadcast.emit('comment-added', data);
    });
    
    socket.on('comment-updated', (data) => {
      socket.broadcast.emit('comment-modified', data);
    });
    
    socket.on('comment-deleted', (data) => {
      socket.broadcast.emit('comment-removed', data);
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  module.exports =  {app, io , server};