const {wrapAsWorker} = require('./pool');
const csv = require('./parseCSV');

wrapAsWorker(csv);

