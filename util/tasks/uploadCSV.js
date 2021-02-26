const {wrapAsWorker} = require('./../pool');
const uploadCSV = require('./../../controllers/uploadCSV');

wrapAsWorker(uploadCSV);

