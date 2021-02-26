const {wrapAsWorkerPromise} = require('./../pool');
const validateCSV = require('./../../controllers/validateCSV');

wrapAsWorkerPromise(validateCSV);

// validateCSV.then(function(data){
//     wrapAsWorker(data);
// })