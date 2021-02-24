const express = require('express');
const {WorkerPool} = require('./util/pool');
var fs = require('fs').promises;

const app = express();

// Create a new worker pool to run script ./task.js
const pool = new WorkerPool('./util/task.js', 4);

app.get('/', async (req, res) => 
{ 
    try {
    const fileContent = await fs.readFile(__dirname+'/csvdata/userDetailsQA1000.csv');
    pool.runWithArg(fileContent, (err, enc) => {
        if (err) return console.error(err);
        return res.status(200).send(enc);
    });
    
} catch (fileError) {
    console.error(fileError)
    
}
    
});

app.listen(8081,()=> {
    console.log("listening on port 8081")
});