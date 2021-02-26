const config = {
    headers: [
    {
        name: 'email',
        inputName: 'email',
        unique: true,
        uniqueError: function (headerName) {
            return `${headerName} is not unique`
        },
        validate: function(email) {
            return isEmailValid(email)
        },
        validateError: function (headerName, rowNumber, columnNumber) {
            return `${headerName} is not valid in the ${rowNumber} row / ${columnNumber} column`

        }
    }
    ]
}
