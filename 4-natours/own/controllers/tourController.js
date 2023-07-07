//const fs = require('fs');
const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

class APIFeatures {
  constructor(query, queryString)
  {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //ADVANCED FILTERING
    // { duration: { $gte: '5' }, difficulty: 'easy', page: '2', limit: '10' } $ is the mongoDB operator
    // { duration: { gte: '5' }, difficulty: 'easy', page: '2', limit: '10' }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
    //let query = Tour.find(JSON.parse(queryStr)); // It's not await async because we want to chain queries
  }

  sort() {
    //SORTING
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      //query = query.sort('-createdAt');
      this.query = this.query.sort('_id');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    //PAGINATION
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // page=3&limit=10 1-10, page 1, 11-20, page 2, 21-30 page3
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`).toString()
// );

// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'invalid ID',
//     });
//   }
//   next();
// };
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'no price or name on the body!',
//     });
//   }
//   next();
// };
exports.getAllTours = async (req, res) => {
  try {
    //console.log(req.query);
    //const tours = await Tour.find();
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });

    // FILTERING
    // Make a copy of the object, in Javascript assign operator is basically a reference so we would be modifying the req object which we don't want
    // BUILD QUERY

    // const queryObj = { ...req.query };
    // console.log(req.query, queryObj);
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);
    //
    // //ADVANCED FILTERING
    // // { duration: { $gte: '5' }, difficulty: 'easy', page: '2', limit: '10' } $ is the mongoDB operator
    // // { duration: { gte: '5' }, difficulty: 'easy', page: '2', limit: '10' }
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr)); // It's not await async because we want to chain queries
    //SORTING
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log(sortBy);
    //   query = req.query.sort(sortBy);
    // } else {
    //   //query = query.sort('-createdAt');
    //   query = req.query.sort('_id');
    // }
    //FIELD LIMITING
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }
    // //PAGINATION
    // const page = req.query.page * 1 || 1;
    // console.log(`req.query.page: ${page}`)
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // // page=3&limit=10 1-10, page 1, 11-20, page 2, 21-30 page3
    // query = query.skip(skip).limit(limit);
    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) {
    //     throw new Error('This page does not exist');
    //   }
    // }
    // REFERENCE
    // const query = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours, // In ES6 we don't need to provide key value pairs if they have both the same name? tours: tours
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Above line is equal to: Tour.findOne({ _id: req.params.id )};
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour, // same as tour, EC6
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      message: 'Tour deleted!',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: ' Problem deleting Tour !',
    });
  }
};
