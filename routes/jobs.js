const express = require('express');
const router = express.Router();

const {
  getJobs,
  createJob,
  getJob,
  patchJob,
  deleteJob,
} = require('../controllers/jobs');

router.route('/').post(createJob).get(getJobs);
router.route('/:id').get(getJob).patch(patchJob).delete(deleteJob);

module.exports = router;
