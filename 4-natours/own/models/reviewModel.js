// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Tour = require('../models/tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// A user can only have one review on a tour, this is to ensure that is so
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name photo',
  // }).populate({
  //   path: 'tour',
  //   select: '-guides name',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
    // }).populate({
    //   path: 'tour',
    //   select: '-guides name',
    // })
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  //static method in nodeJs points to the model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5, //defaults
    });
  }
};

// I commented out all these because it proved to be complex and unintuitive.
// I got another solution from the comments
// // findByIdAndUpdate
// // findByIdAndDelete
// // update and delete reviews should calculate average as well, however we can't do
// // things as we had done with creating reviews.
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   // we didn't use const r because we wanted r to be saved to the document
//   // so we could reach it in post in order to calculate average with tourId
//   this.r = await this.findOne();
//   console.log(r);
//   next();
// });
//
// reviewSchema.post(/^findOneAnd/, async function () {
//   //this shit here is the only one I haven't grasped(yet) in 169 lectures done by Jonas so far
//   await this.r.constructor.calcAverageRatings(this.r.tour);
// });
// // we cannot simply put this function under Review in order to access Review.calcAverageRatings
// // because then reviewSchema.pre wouldn't work as it's would be declared later than being used.
// // thus we use this.constructor
reviewSchema.post('save', function (next) {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

//Solution from the comments
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.tour);
  }
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
