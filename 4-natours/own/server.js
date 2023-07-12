const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION! 💥 Shutting Down!');
  console.log(err.name, err.message);
  process.exit(1);
});
mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
  //console.log(con.connections);
  console.log('DB Connection successful');
});
const port = process.env.port || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting Down!');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
