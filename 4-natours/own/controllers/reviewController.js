const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('No review with that id found!', 404));
  }
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      review,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  if (!reviews) {
    return next(new AppError('No reviews found!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: review,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('No review with that id found!', 404));
  }
  if (review.user.id !== req.params.id) {
    console.log(
      `review user id: ${review.user.id}    req.params.id: ${req.params.id}`
    );
    return next(new AppError('Cannot change a review belonging to someone else!', 401));
  }
  const updatedReview = Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      review: review,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('No review with that id found!', 404));
  }
  if (!review.user.id === req.params.id) {
    return next(new AppError('Cannot change a review belonging to someone else!', 401));
  }
  const deletedReview = await Review.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    data: null,
  });
});
