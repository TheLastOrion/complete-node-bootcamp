const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// All of the routes with '*' should be declared after the others, as it will reroute ALL the requests, correct or invalid.
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
//This is commented out in Section 9 but I'd rather keep it as it reminds me we have middleware options
app.use((req, res, next) => {
  console.log('Hello from the middleware! 👋🏻');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

module.exports = app;
