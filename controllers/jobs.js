const { StatusCodes } = require('http-status-codes');

const { BadRequestError, NotFoundError } = require('../errors');
const Job = require('../models/Job');

const getJobs = async (req, res, next) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ jobs });
};

const createJob = async (req, res, next) => {
  // First we create a new property in the request, attributing the value of userId (which is the current logged in user)
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
};

const getJob = async (req, res, next) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const patchJob = async (req, res, next) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const company = req.body.company;
  const position = req.body.position;
  // Prevent someone editing and leaving a field empty
  if (company === '' || position === '') {
    throw new BadRequestError('Company or position fields cannot be empty');
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true },
  );
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res, next) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getJobs,
  createJob,
  getJob,
  patchJob,
  deleteJob,
};
