//Authors: Sonja Lavin, Flora Zhang

// Citation for reset database function (file was added for this function):
//Date: 12/4/2023
// based of off CS340 F23 Group 24
// Source URL: https://edstem.org/us/courses/44903/discussion/3876366

let dbData = {
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'username',
    password        : 'password',
    database        : 'database'
}

//Export it for use
module.exports.dbData = dbData;