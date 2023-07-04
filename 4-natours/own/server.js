const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.port || 3000;

console.log(app.get('env'));
console.log(process.env);
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});