  const express = require('express')
  require('./db/mongoose')
  const cors = require('cors');
  const http = require('http');


  const authRoutes = require('./routes/auth');
  const clubRoutes = require('./routes/club');
  const memberRoutes = require('./routes/member');


  const app = express()

  app.use(express.json())
  const server = http.createServer(app);



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

  //Routes
  app.get('/', (req, res) => {
    res.send('Welcome to the Club system!');
  });
  app.use('/api',authRoutes)
  app.use('/api',clubRoutes);
  app.use('/api',memberRoutes);



  module.exports =  {app,  server};