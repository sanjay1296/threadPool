const fs = require('fs').promises;
const parse = require('csv-parse/lib/sync');

module.exports = ( function (fileContent) {
    
    return records =  parse(fileContent, {columns: true});
    
});