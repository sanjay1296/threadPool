const express = require('express');
const {WorkerPool} = require('./util/pool');
// var fs = require('fs').promises;
const CSVFileValidator = require('csv-file-validator');
const app = express();
const fastcsv = require('fast-csv');
var parse = require('csv-parse/lib/sync');

const csv = require('csv-parser');

// Create a new worker pool to run script ./task.js

app.get('/read', async (req, res) => 
{ 
    console.time('exe time')
    try {
    let fs = require('fs').promises;
        
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
app.get('/syncAPI', async (req, res) => 
{   
    let fs = require('fs').promises
    const fileContent = await fs.readFile(__dirname+'/csvdata/userDetailsQA1000.csv');
    const records = parse(fileContent, {columns: true,headers:true});
    res.send(records)
});
app.get('/csvparser', async (req, res) => 
{ 
    const fs = require('fs');
    // console.time('time')
    let csvdata = []
    fs.createReadStream('./csvdata/userDetailsQA1000.csv')
      .pipe(csv())
      .on('data', (row) => {
        // console.log(row);
        csvdata.push(row)
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        res.send(csvdata)
      });
    //   console.timeEnd('time')
});
app.get('/fastcsv', async (req, res) => 
{   
    // console.log("FastCSV");
    let csvDataArr = [];
    fastcsv.parseFile("./csvdata/userDetailsQA1000.csv", {headers: true})
    .on("data", data => {    
     csvDataArr.push(data);
    })
    .on("end", () => {
    console.log("successfully parsed")
    // res.send(csvDataArr)
    let length = csvDataArr.length
    for (let csvindex=0 ; csvindex<length; csvindex++) {
        if (csvDataArr[csvindex].email === "QA1test03@Import.com") {
            console.log("duplicate email")
            res.send(csvDataArr[csvindex].email)
        }
    }
    });
    
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