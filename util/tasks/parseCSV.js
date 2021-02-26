const {wrapAsWorker} = require('./../pool');
const parseCSV = require('./../../controllers/parseCSV');

wrapAsWorker(parseCSV);

