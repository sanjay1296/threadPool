const CSVFileValidator = require('csv-file-validator');
const fs = require('fs').promises;
const parse = require('csv-parse/lib/sync');
const papaparse = require('papaparse')
// let config = require('./config')
const requiredError = (headerName, rowNumber, columnNumber) => {
    return `${headerName} is required in the ${rowNumber} row ${columnNumber} column`
}
const validateError = (headerName, rowNumber, columnNumber) => {
    return `${headerName} is not valid in the ${rowNumber} row / ${columnNumber} column`
}
const uniqueError = (headerName) => {
    return `${headerName} is not unique`
}
const isEmailValid = function (email) {
    const reqExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/
    return reqExp.test(email)
}
const isPasswordValid = function (password) {
    return password.length >= 4
}
    // const fileContent = await fs.readFile('./userDetailsQAValid.csv','utf8');
    // const records = parse(fileContent, {columns: true});
    const CSVConfig = {
        headers: [
            { name: 'accountType', inputName: 'accountType', required: true, requiredError },
            { name: 'group', inputName: 'group', required: true, requiredError },
            { name: 'description', inputName: 'description', required: true, requiredError },
            { name: 'deviceID', inputName: 'deviceID', required: false },
            { name: 'deviceToken', inputName: 'deviceToken', required: false },
            { name: 'disabled', inputName: 'description', required: true, requiredError },
            { name: 'email', inputName: 'email', required: true, requiredError, unique: false, uniqueError, validate: isEmailValid, validateError },
            { name: 'firstTimeUser', inputName: 'firstTimeUser', required: true, requiredError},
            { name: 'lastSignInTime', inputName: 'lastSignInTime', required: false},
            { name: 'name', inputName: 'name', required: true, requiredError},
            { name: 'osType', inputName: 'osType', required: false, requiredError},
            { name: 'phoneNumber', inputName: 'phoneNumber', required: true,uniqueError, requiredError},
            { name: 'photoURL', inputName: 'photoURL', required: false, requiredError},
            { name: 'profile', inputName: 'profile', required: false, requiredError},
            { name: 'status', inputName: 'status', required: true, requiredError},
            { name: 'tenantId', inputName: 'tenantId', required: true, requiredError}
        ]
    }   

module.exports = ( function (fileContent) { 
        return result = CSVFileValidator(fileContent, CSVConfig)
            .then(csvData => {
                if (csvData.inValidMessages.length === 0) {
                    // console.log("Valid CSV")
                    return "Valid"
                } else 
                return csvData.inValidMessages
            })
            .catch(err => {
                console.log("validatorERR",err)
            })
});
    



