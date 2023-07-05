const mongoose = require('mongoose').default;
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
mongoose.connect(process.env.DATABASE_LOCAL).then((con) => {
  console.log(con.connections);
  console.log('DB Connection successful');
});

const port = process.env.port || 3000;

console.log(app.get('env'));
console.log(process.env);
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
