const connectDB = require('./db/mongoose');
require('dotenv').config(); 

const {  app } = require('./app');

// Wrap the async code in an async function
async function startServer() {
  try {
    await connectDB();
    const port = process.env.PORT || 5000;
    
    app.listen(port, () => {
      console.log('Server is up on port ' + port);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();