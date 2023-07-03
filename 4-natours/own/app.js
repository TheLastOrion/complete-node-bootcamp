const express = require('express');
const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const app = express();

app.use(express.json());

// 1) MIDDLEWARE
app.use(morgan('dev'));




//app.get('/api/v1/tours',getAllTours )
//app.post('/api/v1/tours', createTour)

//app.get('/api/v1/tours/:id', getTour)
//app.patch('/api/v1/tours/:id', updateTour)
//app.delete('/api/v1/tours/:id', deleteTour)

// 3) ROUTES
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.use((req, res, next) =>
{
    console.log('Hello from the middleware! 👋🏻')
    next();
})
app.use((req, res, next)=>
{
    req.requestTime = new Date().toISOString();
    next();
})

module.exports = app;



