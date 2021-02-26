const express = require('express');
const {WorkerPool} = require('./util/pool');
var fs = require('fs').promises;
const CSVFileValidator = require('csv-file-validator');
const app = express();

// Create a new worker pool to run script ./task.js

app.get('/read', async (req, res) => 
{ 
    console.time('exe time')
    try {
      
    const parsePool = new WorkerPool('./util/tasks/parseCSV.js', 4);
    
    const validatePool = new WorkerPool('./util/tasks/validateCSV.js',4);
    // console.log("poolInit",validatePool) 
    const fileContent = await fs.readFile('./csvdata/userDetailsQAValid1000.csv','utf8');
    validatePool.runWithArg(fileContent, (err, validateResult) => {

        if (err) return console.error(err);
        // console.log(validateResult)
        // return enc;
        if (validateResult =="Valid") {
         parsePool.runWithArg(fileContent, (err, parseResult) => {
            if (err) return console.error(err);
            // console.log("Parsing")
            // console.log(parseResult)
            // return enc; 
            res.status(200).send(parseResult);
        });
        } else {
            res.status(200).send(validateResult);
        }       
       
    });    
    
} catch (fileError) {
    console.error(fileError)
    
}
console.timeEnd('exe time')
});

app.post('/upload', async (req, res) => 
{ 
    const pool = new WorkerPool('./controllers/uploadCSV.js', 4);
    try {
    pool.runWithArg(fileContent, (err, enc) => {
        if (err) return console.error(err);
        console.log(enc)
        // return enc;
        res.status(200).send(enc);
    });
    
} catch (fileError) {
    console.error(fileError)
    
}
    
});
app.listen(8081,()=> {
    console.log("listening on port 8081")
});