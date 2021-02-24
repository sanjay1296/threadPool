var fs = require('fs').promises;
var parse = require('csv-parse/lib/sync');
module.exports = ( function (fileContent) {
    
    return records =  parse(fileContent, {columns: true});
    
});