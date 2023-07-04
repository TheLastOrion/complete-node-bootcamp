const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`).toString()
);

exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'no price or name on the body!',
    });
  }
  next();
};
exports.getAllTours = (req, res) => {
  // console.log(req.requestTime)

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours, // In ES6 we don't need to provide key value pairs if they have both the same name? tours: tours
    },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1; // small trick to convert a string into a number
  const tour = tours.find((el) => el.id === id);

  //if(id > tours.length)
  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
    // results: tours.length,
    // data: {
    //     tours // In ES6 we don't need to provide key value pairs if they have both the same name? tours: tours
    // }
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );

  console.log(req.body);
};

exports.updateTour = (req, res) => {
  // Not implementing the actual data change.
  if (req.params.id * 1 > tours.length) {
    return res.status(200).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
