//Authors: Sonja Lavin, Flora Zhang
// Contents: Seattle Prenatal Clinic
// Citation for the SETUP, ROUTES, and LISTENER for simple web app:
// Date: 11/09/2023
// Copied from CS340 OSU course:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Citation for reset database function:
//Date: 12/4/2023
// based of off CS340 F23 Group 24
// Source URL: https://edstem.org/us/courses/44903/discussion/3876366


/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
var dbImp   = require('./database/db-import');

// enable express to handle JSON data and form data
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))


PORT = 9201;                 // Set a port number at the top so it's easy to change in the future
 
// Database
var db = require('./database/db-connector');

const fs = require('fs'); // For reseting db

// handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.




// -------------- GET ROUTES --------------
// GET Home
app.get('/', function(req, res) 
    {
        res.render('index');
});

/* db reset based off group 24 */
app.get('/reset-db', function(req, res){  
    console.log("Reset DB route hit"); // Log when the route is accessed

    const Importer = require('mysql-import');
    const importerDB = new Importer(dbImp.dbData);

    console.log("Database connection data:", dbImp.dbData); // Log DB connection data

    importerDB.import('./database/DDL.sql')
        .then(() => {
            console.log("Database import successful");
            res.render('index', { resetMessage: 'The database has been reset' });
        })
        .catch(error => {
            console.error('Database query error:', error);
            return res.status(500).send('Error resetting database: ' + error.message);
        });                                                 
});

//GET Providers
app.get('/providers.html', function(req, res)
{
    
    let query1;
    
    // if there is no search or filter, perform a basic SELECT
    if  (req.query.lastName === undefined && req.query.title == "all" || req.query.lastName === undefined && req.query.title == undefined )
        {
            //query for browse table
            query1 = `SELECT Providers.providerID AS ID, Providers.firstName AS FirstName, Providers.lastName AS LastName, Providers.title AS Title, Providers.phone, Providers.email FROM Providers`;
        }
    //if there is a filter by title, return filtered results
    else if (req.query.title != undefined)
    {
        query1 = `SELECT Providers.providerID AS ID, Providers.firstName AS FirstName, Providers.lastName AS LastName, Providers.title AS Title, Providers.phone, Providers.email FROM Providers WHERE Providers.Title = "${req.query.title}"`;
        }
    // if there is a last name search
    else 
    { 
        // query for searching by last name
        query1 = `SELECT Providers.providerID AS ID, Providers.firstName AS FirstName, Providers.lastName AS LastName, Providers.title AS Title, Providers.phone, Providers.email FROM Providers WHERE Providers.lastName LIKE "${req.query.lastName}%"`;    
    }
    
    // title drop down
    let query2 = "SELECT DISTINCT title FROM Providers ORDER BY title ASC";
    db.pool.query(query1, function(error, rows, fields){
        // Save the providers
        let providers = rows;
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            // Save the titles
            let titles = rows;
            return res.render('providers', {data: providers, titles: titles});
        })
    })
});

//GET Employees
app.get('/employees.html', function(req, res)
{  
    let query1;
    // if there is no serarch or filter, perfrom a basic SELECT
    if (req.query.lastName === undefined && req.query.title == "all" || req.query.lastName === undefined && req.query.title == undefined )
    {
        // browse Employees query
        query1 = "SELECT employeeID AS ID, firstName AS FirstName, lastName AS LastName, title AS Title, phone, email FROM NonmedicalEmployees";
    }
    // if there is a filter by title, return filtered results
    else if (req.query.title != undefined)
    { query1 = `SELECT employeeID AS ID, firstName AS FirstName, lastName AS LastName, title AS Title, phone, email FROM NonmedicalEmployees WHERE NonmedicalEmployees.Title = "${req.query.title}"`;
    }
    // if there is a last name search
    else {
        query1 = `SELECT employeeID AS ID, firstName AS FirstName, lastName AS LastName, title AS Title, phone, email FROM NonmedicalEmployees WHERE NonmedicalEmployees.lastName LIKE "${req.query.lastName}%"`;
        
    }


    // title drop down query
    let query2 = "SELECT DISTINCT title FROM NonmedicalEmployees ORDER BY title ASC;";

     db.pool.query(query1, function(error, rows, fields){
        // Save the employees
        let employees = rows;
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            // Save the titles
            let titles = rows;
            // Render the employees.hbs fils and send employees and titles to fill the browse table and titles drop down
            return res.render('employees', {data: employees, titles: titles});
        })
     })
});
 
                                                     
//GET Clients
app.get('/clients.html', function(req, res)
    {
    
    let query1;

    // if there is no search or filter, perform a basic SELECT
    if (req.query.lastName === undefined && req.query.providerID == "all" || req.query.lastName === undefined && req.query.providerID == undefined )
    {// browse clients query
        query1 = "SELECT Clients.clientID AS ID, Clients.firstName AS FirstName, Clients.lastName AS LastName, IFNULL(CONCAT(Providers.firstName, ' ' ,Providers.lastName), 'Null') AS Provider, DATE_FORMAT(Clients.birthday, '%m/%d/%y') AS birthday, Clients.phone, Clients.email FROM Clients LEFT JOIN Providers ON Clients.providerID = Providers.providerID";
    }
    //if there is a search string for last name, return search results
    else if (req.query.lastName != undefined)
    {
        query1 = `SELECT Clients.clientID AS ID, Clients.firstName AS FirstName, Clients.lastName AS LastName, IFNULL(CONCAT(Providers.firstName, ' ' ,Providers.lastName), 'Null') AS Provider, DATE_FORMAT(Clients.birthday, '%m/%d/%y') AS birthday, Clients.phone, Clients.email FROM Clients LEFT JOIN Providers ON Clients.providerID = Providers.providerID WHERE Clients.lastName LIKE "${req.query.lastName}%"`;
        
    }
    // if there is a filter search, return filtered results for null
    else if (req.query.providerID == "null")
        
        {
            query1 = `SELECT Clients.clientID AS ID, Clients.firstName AS FirstName, Clients.lastName AS LastName, IFNULL(CONCAT(Providers.firstName, ' ' ,Providers.lastName), 'Null') AS Provider , DATE_FORMAT(Clients.birthday, '%m/%d/%y') AS birthday, Clients.phone, Clients.email FROM Clients LEFT JOIN Providers ON Clients.providerID = Providers.providerID WHERE Providers.providerID IS NULL`;
        }
    // return filtered results for specific provider
    else {

        query1 = `SELECT Clients.clientID AS ID, Clients.firstName AS FirstName, Clients.lastName AS LastName, IFNULL(CONCAT(Providers.firstName, ' ' ,Providers.lastName), 'Null') AS Provider , DATE_FORMAT(Clients.birthday,'%m/%d/%y') AS birthday, Clients.phone, Clients.email FROM Clients LEFT JOIN Providers ON Clients.providerID = Providers.providerID WHERE Providers.providerID = ${req.query.providerID}`;

        }
    
    // providers drop-down query
    let query2 = "SELECT DISTINCT providerID AS providerID, CONCAT(firstName, ' ' ,lastName) AS Provider FROM Providers ORDER BY Provider ASC";
    
    // run query 1
    db.pool.query(query1, function(error, rows, fields){
        // save the clients
        let clients = rows;
    // run query 2
    db.pool.query(query2, (error, rows, fields) => {
        // Save the providers
        let providers = rows;
        // send providers and clients back to clients.hbs and render file
        return res.render('clients', {data: clients, providers: providers});
        })
    })
});

//GET Services
app.get('/nonmedicalServices.html', function(req, res)
{ 
    let query1;

    // if there is no search, perform a basic SELECT
    if (req.query.name === undefined)
    {
    // browse services query
        query1 = "SELECT serviceID AS ID, name AS Name, description AS Description FROM NonmedicalServices";  
    
    } else {
        query1 = `SELECT serviceID AS ID, name AS Name, description AS Description FROM NonmedicalServices WHERE Name LIKE "${req.query.name}%"`;
    }
    // perform query
        db.pool.query(query1, function(error, rows, fields){ 
            // send services back to nonmedicalServices.hbs and render file  
            res.render('nonmedicalServices', {data: rows});                  
    })  
                                                       
}); 

//GET Appointments
app.get('/perinatalAppointments.html', function(req, res)
    {  
        let query1;

        //if there is no search, perfrom a basic SELECT
        if (req.query.name === undefined)
            {
            // Browse appointments query
            query1 = "SELECT perinatalApptID AS ID, name AS Name, billingCode AS BillingCode, description AS Description FROM PerinatalAppointments";               
            } else {
                query1 = `SELECT perinatalApptID AS ID, name AS Name, billingCode AS BillingCode, description AS Description FROM PerinatalAppointments WHERE Name LIKE "${req.query.name}%"`;
        }
            // perform query
            db.pool.query(query1, function(error, rows, fields){   
            res.render('perinatalAppointments', {data: rows});                  
        })                                                      
    }); 

//GET Service Histories
app.get('/serviceHistories.html', function(req, res)
    {   
        let query1;
        //if there is no serarch or filter, perform a basic SELECT
        if (req.query.lastName === undefined && req.query.employeeID == "all" || req.query.lastName === undefined && req.query.employeeID == undefined )
        {
            //ServiceHistories query
            query1 = "SELECT serviceHistoryID AS ID, CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, NonmedicalServices.name AS Service, IFNULL(CONCAT(NonmedicalEmployees.firstName, ' ', NonmedicalEmployees.lastName), 'Null') AS Employee, DATE_FORMAT(ServiceHistories.date, '%m/%d/%y') AS Date FROM NonmedicalServices INNER JOIN ServiceHistories ON NonmedicalServices.serviceID = ServiceHistories.serviceID LEFT JOIN NonmedicalEmployees ON ServiceHistories.employeeID = NonmedicalEmployees.employeeID INNER JOIN Clients ON ServiceHistories.clientID = Clients.clientID ORDER BY ServiceHistories.serviceHistoryID ASC";               
        }
        //if there is a search string for the last name, return search results
        else if (req.query.lastName != undefined)
        {
            query1 = `SELECT serviceHistoryID AS ID, CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, NonmedicalServices.name AS Service, IFNULL(CONCAT(NonmedicalEmployees.firstName, ' ', NonmedicalEmployees.lastName), 'Null') AS Employee, DATE_FORMAT(ServiceHistories.date, '%m/%d/%y') AS Date FROM NonmedicalServices INNER JOIN ServiceHistories ON NonmedicalServices.serviceID = ServiceHistories.serviceID LEFT JOIN NonmedicalEmployees ON ServiceHistories.employeeID = NonmedicalEmployees.employeeID INNER JOIN Clients ON ServiceHistories.clientID = Clients.clientID WHERE Clients.lastName LIKE "${req.query.lastName}%" ORDER BY ServiceHistories.serviceHistoryID ASC`;
        }
        // if there is an employee filter, return filtered results for null 
        else if (req.query.employeeID == "null")
        { 
            query1 = `SELECT serviceHistoryID AS ID, CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, NonmedicalServices.name AS Service, IFNULL(CONCAT(NonmedicalEmployees.firstName, ' ', NonmedicalEmployees.lastName), 'Null') AS Employee, DATE_FORMAT(ServiceHistories.date, '%m/%d/%y') AS Date FROM NonmedicalServices INNER JOIN ServiceHistories ON NonmedicalServices.serviceID = ServiceHistories.serviceID LEFT JOIN NonmedicalEmployees ON ServiceHistories.employeeID = NonmedicalEmployees.employeeID INNER JOIN Clients ON ServiceHistories.clientID = Clients.clientID WHERE NonmedicalEmployees.employeeID IS NULL ORDER BY ServiceHistories.serviceHistoryID ASC`;
        }
        // return filtered results for a specific employee
        else{
            query1 = `SELECT serviceHistoryID AS ID, CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, NonmedicalServices.name AS Service, IFNULL(CONCAT(NonmedicalEmployees.firstName, ' ', NonmedicalEmployees.lastName), 'Null') AS Employee, DATE_FORMAT(ServiceHistories.date, '%m/%d/%y') AS Date FROM NonmedicalServices INNER JOIN ServiceHistories ON NonmedicalServices.serviceID = ServiceHistories.serviceID LEFT JOIN NonmedicalEmployees ON ServiceHistories.employeeID = NonmedicalEmployees.employeeID INNER JOIN Clients ON ServiceHistories.clientID = Clients.clientID WHERE NonmedicalEmployees.employeeID = ${req.query.employeeID} ORDER BY ServiceHistories.serviceHistoryID ASC`;

        }
            // query for add and update - clients drop down
        let query2 = "SELECT clientID, CONCAT(Clients.firstName, ' ' ,Clients.lastName) AS Client FROM Clients ORDER BY Client ASC";
        //query for add and update - services drop down
        let query3 = "SELECT serviceID, NonmedicalServices.name AS Service FROM NonmedicalServices ORDER BY Service ASC";
        //query for add and update - employees drop down
        let query4 = "SELECT employeeID, CONCAT(NonmedicalEmployees.firstName, ' ' ,NonmedicalEmployees.lastName) as Employee FROM NonmedicalEmployees ORDER BY Employee ASC";
        db.pool.query(query1, function(error, rows, fields){ 
            // save histories for browse table
            let serviceHistories = rows;
            db.pool.query(query2, (error, rows, fields) => {
                // Save the clients
                let clients = rows;
                db.pool.query(query3, (error, rows, fields) => {
                    // Save the services
                    let services = rows;
                    db.pool.query(query4, (error, rows, fields) => {
                        // Save the employees
                        let employees = rows;
                        //send service histories, clients, services, and employees back to the serviceHistories page and render file
                        res.render('serviceHistories', {data: serviceHistories, clients: clients, services: services, employees: employees});                  
                    })                                                      
                })
            })
        })
    });

//GET Appointment Histories
app.get('/appointmentHistories.html', function(req, res)
    {  
        let query1;
        
        // if thre is no search or filter, perform a basic SELECT
        if (req.query.lastName === undefined && req.query.providerID == "all" || req.query.lastName === undefined && req.query.providerID == undefined )
        {
            // browse histories query
            query1 = "SELECT apptHistoryID AS ID, CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, PerinatalAppointments.name AS Appointment, \
            IFNULL(CONCAT(Providers.firstName, ' ', Providers.lastName), 'Null') AS Provider, DATE_FORMAT(AppointmentHistories.date, '%m/%d/%y') \
            AS Date FROM PerinatalAppointments INNER JOIN AppointmentHistories ON PerinatalAppointments.perinatalApptID = AppointmentHistories.perinatalApptID \
            LEFT JOIN Providers ON AppointmentHistories.providerID = Providers.providerID INNER JOIN Clients ON \
            AppointmentHistories.clientID = Clients.clientID ORDER BY AppointmentHistories.apptHistoryID ASC";               
        }
        //if there is a search string for the last name, return search results
        else if(req.query.lastName != undefined)
        {
            query1 = `SELECT apptHistoryID AS ID, CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, PerinatalAppointments.name AS Appointment, \
            IFNULL(CONCAT(Providers.firstName, ' ', Providers.lastName), 'Null') AS Provider, DATE_FORMAT(AppointmentHistories.date, '%m/%d/%y') \
            AS Date FROM PerinatalAppointments INNER JOIN AppointmentHistories ON PerinatalAppointments.perinatalApptID = AppointmentHistories.perinatalApptID \
            LEFT JOIN Providers ON AppointmentHistories.providerID = Providers.providerID INNER JOIN Clients ON \
            AppointmentHistories.clientID = Clients.clientID WHERE Clients.lastName LIKE "${req.query.lastName}%" ORDER BY AppointmentHistories.apptHistoryID ASC`;  
        }
        // if there is a provider filter, return fitered results for null
        else if (req.query.providerID == "null")
        {
            query1 = `SELECT apptHistoryID AS ID, CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, PerinatalAppointments.name AS Appointment, \
            IFNULL(CONCAT(Providers.firstName, ' ', Providers.lastName), 'Null') AS Provider, DATE_FORMAT(AppointmentHistories.date, '%m/%d/%y') \
            AS Date FROM PerinatalAppointments INNER JOIN AppointmentHistories ON PerinatalAppointments.perinatalApptID = AppointmentHistories.perinatalApptID \
            LEFT JOIN Providers ON AppointmentHistories.providerID = Providers.providerID INNER JOIN Clients ON \
            AppointmentHistories.clientID = Clients.clientID WHERE Providers.providerID IS NULL ORDER BY AppointmentHistories.apptHistoryID ASC`;  
        }
        // return filtered results for specific provider
        else {
            query1 = `SELECT apptHistoryID AS ID, CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, PerinatalAppointments.name AS Appointment, \
        IFNULL(CONCAT(Providers.firstName, ' ', Providers.lastName), 'Null') AS Provider, DATE_FORMAT(AppointmentHistories.date, '%m/%d/%y') \
        AS Date FROM PerinatalAppointments INNER JOIN AppointmentHistories ON PerinatalAppointments.perinatalApptID = AppointmentHistories.perinatalApptID \
        LEFT JOIN Providers ON AppointmentHistories.providerID = Providers.providerID INNER JOIN Clients ON \
        AppointmentHistories.clientID = Clients.clientID WHERE Providers.providerID = ${req.query.providerID} ORDER BY AppointmentHistories.apptHistoryID ASC`;  
    }
    
        // query for add - clients drop down
        let query2 = "SELECT clientID, CONCAT(Clients.firstName, ' ' ,Clients.lastName) AS Client FROM Clients ORDER BY Client ASC";
        //query for add - appointments drop down
        let query3 = "SELECT perinatalApptID, PerinatalAppointments.name AS Appointment FROM PerinatalAppointments ORDER BY Appointment ASC";
        //query for add - providers drop down
        let query4 = "SELECT providerID, CONCAT(Providers.firstName, ' ' ,Providers.lastName) as Provider FROM Providers ORDER BY Provider ASC";
        db.pool.query(query1, function(error, rows, fields){ 
            // save histories
            let appointmentHistories = rows;
            db.pool.query(query2, (error, rows, fields) => {
                // Save the clients
                let clients = rows;
                db.pool.query(query3, (error, rows, fields) => {
                    // Save the clients
                    let appointments = rows;
                    db.pool.query(query4, (error, rows, fields) => {
                        // Save the clients
                        let providers = rows;
                        //send it back
                        res.render('appointmentHistories', {data: appointmentHistories, clients: clients, appointments: appointments, providers: providers});                  
                    })                                                      
                })
            })
        })                                                    
}); 

// ---------------------- POST ROUTES -----------------------------

// POST ADD Provider
app.post('/add-provider-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Providers (firstName, lastName, title, phone, email) VALUES (?, ?, ?, ?, ?)`; 
    db.pool.query(query1, [data.firstName, data.lastName, data.title, data.phone, data.email], function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Providers (this captures null titles). 
            query2 = "SELECT providerID AS ID, firstName AS FirstName, lastName AS LastName, IFNULL(title, 'Null') AS Title, phone, email FROM Providers";
            db.pool.query(query2, function(error, rows, fields){
                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// POST ADD Employee
app.post('/add-employee-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Insert query to add employee to database
    let query1 = `INSERT INTO NonmedicalEmployees (firstName, lastName, title, phone, email) VALUES (?, ?, ?, ?, ?)`; 
    db.pool.query(query1, [data.firstName, data.lastName, data.title, data.phone, data.email], function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on NonmedicalEmployees (this query captures null titles in case the database is changed to allow null)
            query2 = "SELECT employeeID AS ID, firstName AS FirstName, lastName AS LastName, IFNULL(title, 'Null') AS Title, phone, email FROM NonmedicalEmployees";
            db.pool.query(query2, function(error, rows, fields){
                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of query2 back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

//POST Add Client
app.post('/add-client-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let providerID = parseInt(data.provider);


    // Capture NULL values for providers as database allows clients to be entered with no provider
    if (isNaN(providerID))
    {
        providerID = null;
    }

    // Create and run insert query to insert the entry into the database
    let query1 = `INSERT INTO Clients (firstName, lastName, providerID, birthday, phone, email) VALUES (?, ?, ?, ?, ?, ?)`; 
    db.pool.query(query1, [data.firstName, data.lastName, data.provider, data.birthday, data.phone, data.email], function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Clients, this maintains format of browse table, i.e. firstName is converted to FirstName
            query2 = "SELECT Clients.clientID AS ID, Clients.firstName AS FirstName, Clients.lastName AS LastName, IFNULL(CONCAT(Providers.firstName, ' ' ,Providers.lastName), 'Null') AS Provider, DATE_FORMAT(Clients.birthday, '%m/%d/%y') AS birthday, Clients.phone, Clients.email FROM Clients LEFT JOIN Providers ON Clients.providerID = Providers.providerID";
            db.pool.query(query2, function(error, rows, fields){
                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of query2 back.
                else
                {
                    console.log("rows", rows)
                    res.send(rows);
                }
            })
        }
    })
});

//POST Add service
app.post('/add-service-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create and run the query to insert service into database
    query1 = `INSERT INTO NonmedicalServices (name, description) VALUES ('${data.name}', '${data.description}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on NonmedicalServices, maintaining format of browse so, for example, serviceID is sent back as ID 
            query2 = "SELECT serviceID AS ID, name AS Name, description AS Description FROM NonmedicalServices";
            db.pool.query(query2, function(error, rows, fields){
                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of query2 the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

//POST Add appointment
app.post('/add-appointment-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO PerinatalAppointments (name, billingCode, description) VALUES ('${data.name}', '${data.billingCode}', '${data.description}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on PerinatalAppointments
            query2 = "SELECT perinatalApptID AS ID, name AS Name, billingCode as BillingCode, description AS Description FROM PerinatalAppointments";
            db.pool.query(query2, function(error, rows, fields){
                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

//POST Add service History
app.post('/add-serviceHistory-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values for employee ID since the database allows serviceHistories with no Employees
    let employeeID = parseInt(data.Employee);
    if (isNaN(employeeID))
     {
        employeeID = 'NULL'
    }

    // Create the insert query to add a servideHistory to the database and run it 
    query1 = `INSERT INTO ServiceHistories (clientID, serviceID, employeeID, date) VALUES (${data.Client}, ${data.Service}, ${data.Employee}, '${data.Date}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Service Histories 
        let query2 = "SELECT serviceHistoryID AS ID, CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, NonmedicalServices.name AS Service, IFNULL(CONCAT(NonmedicalEmployees.firstName, ' ', NonmedicalEmployees.lastName), 'Null') AS Employee, DATE_FORMAT(ServiceHistories.date, '%m/%d/%y') AS Date FROM NonmedicalServices INNER JOIN ServiceHistories ON NonmedicalServices.serviceID = ServiceHistories.serviceID LEFT JOIN NonmedicalEmployees ON ServiceHistories.employeeID = NonmedicalEmployees.employeeID INNER JOIN Clients ON ServiceHistories.clientID = Clients.clientID ORDER BY ServiceHistories.serviceHistoryID ASC";               
            db.pool.query(query2, function(error, rows, fields){
                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of query2 back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

//POST Add appointment History
app.post('/add-appointmentHistory-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // let clientID = parseInt(data.Client)
    // let serviceID = parseInt(data.Service)

    // Capture NULL values for provider ID
    let providerID = parseInt(data.Provider);
    if (isNaN(providerID))
     {
        providerID = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO AppointmentHistories (clientID, perinatalApptID, providerID, date) VALUES (${data.Client}, ${data.Appointment}, ${data.Provider}, '${data.Date}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Service Histories 
        let query2 = "SELECT apptHistoryID AS ID, CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, PerinatalAppointments.name AS Appointment, \
        IFNULL(CONCAT(Providers.firstName, ' ', Providers.lastName), 'Null') AS Provider, DATE_FORMAT(AppointmentHistories.date, '%m/%d/%y') \
        AS Date FROM PerinatalAppointments INNER JOIN AppointmentHistories ON PerinatalAppointments.perinatalApptID = AppointmentHistories.perinatalApptID \
        LEFT JOIN Providers ON AppointmentHistories.providerID = Providers.providerID INNER JOIN Clients ON \
        AppointmentHistories.clientID = Clients.clientID ORDER BY AppointmentHistories.apptHistoryID ASC";               
            db.pool.query(query2, function(error, rows, fields){
                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// -------------------------- PUT ROUTES --------------------------

//PUT Update a Client
app.put('/update-client-ajax/', function (req, res, next) {
    // capture incoming data;
    let data = req.body;
    let firstName = parseInt(data.firstName);
    let lastName = parseInt(data.lastName);
    let provider = parseInt(data.Provider);
    let clientID = parseInt(data.ID);
    let phone = data.phone;
    let email= data.email

    // Capture NULL values for providers as database allows clients to be entered without a provider
    if (isNaN(provider))
    {
        provider = null;
    }

    // query to update client in database. 
    let queryUpdate = `UPDATE Clients SET providerID = ?, phone = ?, email = ? WHERE clientID = ?`;
    // query to select all from clients
    let query2 = "SELECT Clients.clientID AS ID, Clients.firstName, Clients.lastName, IFNULL(CONCAT(Providers.firstName, ' ', Providers.lastName), 'Null') AS Provider, Clients.ProviderID, DATE_FORMAT(Clients.birthday, '%m/%d/%y') AS birthday, Clients.phone, Clients.email FROM Clients LEFT JOIN Providers ON Clients.providerID = Providers.providerID WHERE clientID = ?";               
    // db.pool.query(query1, [client], function(error, rows, fields){
        // run query to update the database
        db.pool.query(queryUpdate, [provider, phone, email, clientID],function(error, rows, fields){
              if (error) {
                 // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
              }
              else
              {
                // get rows from clients
                db.pool.query(query2,[clientID], function(error, rows, fields){
                //store data
                    let data = rows;
                    console.log("server side row:", rows)
                if (error){
                    console.log(error)
                }
                    else
                    // send the resuls of query2 back
                    { 
                    res.send(data)
                }
            })
         }
        })
    });

//PUT Update a Provider
app.put('/update-provider-ajax/', function (req, res, next) {
    // capture incoming data;
    let data = req.body;
    let firstName = parseInt(data.firstName);
    let lastName = parseInt(data.lastName);
    let providerID = parseInt(data.ID);
    let phone = data.phone;
    let email= data.email

    // query to update Provider in database. 
    let queryUpdate = `UPDATE Providers SET phone = ?, email = ? WHERE providerID = ?`;
    // query to select all from providers
    let query2 = `SELECT Providers.providerID AS ID, Providers.firstName AS FirstName, Providers.lastName AS LastName, Providers.title, Providers.phone, Providers.email FROM Providers WHERE providerID = ?`;
        // run query to update the database
        db.pool.query(queryUpdate, [phone, email, providerID],function(error, rows, fields){
              if (error) {
                 // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
              }
              else
              {
                // get rows from providers
                db.pool.query(query2,[providerID], function(error, rows, fields){
                //store data
                    let data = rows;
                    console.log("server side row:", rows)
                if (error){
                    console.log(error)
                }
                    else
                    // send the resuls of query2 back
                    { 
                    res.send(data)
                }
            })
         }
        })
    });

//PUT Update an Employee
app.put('/update-employee-ajax/', function (req, res, next) {
    // capture incoming data;
    let data = req.body;
    let firstName = parseInt(data.firstName);
    let lastName = parseInt(data.lastName);
    let employeeID = parseInt(data.ID);
    let phone = data.phone;
    let email= data.email

    // query to update Provider in database. 
    let queryUpdate = `UPDATE NonmedicalEmployees SET phone = ?, email = ? WHERE employeeID = ?`;
    // query to select all from providers
    let query2 = `SELECT NonmedicalEmployees.employeeID AS ID, firstName AS FirstName, lastName AS LastName, title, phone, email FROM NonmedicalEmployees WHERE employeeID = ?`;
        // run query to update the database
        db.pool.query(queryUpdate, [phone, email, employeeID],function(error, rows, fields){
              if (error) {
                 // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
              }
              else
              {
                // get rows from providers
                db.pool.query(query2,[employeeID], function(error, rows, fields){
                //store data
                    let data = rows;
                    console.log("server side row:", rows)
                if (error){
                    console.log(error)
                }
                    else
                    // send the resuls of query2 back
                    { 
                    res.send(data)
                }
            })
         }
        })
    });

//PUT Update a Service
app.put('/update-service-ajax/', function (req, res, next) {
    // capture incoming data;
    let data = req.body;
    let description = data.Description;
    let serviceID = parseInt(data.ID);

    // query to update service in database. 
    let queryUpdate = `UPDATE NonmedicalServices SET description = ? WHERE serviceID = ?`;
    // query to select service
    let query2 = "SELECT serviceID AS ID, name, description FROM NonmedicalServices WHERE serviceID = ?";               
        // run query to update the database
        db.pool.query(queryUpdate, [description, serviceID],function(error, rows, fields){
              if (error) {
                 // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
              }
              else
              {
                // get rows from clients
                db.pool.query(query2,[serviceID], function(error, rows, fields){
                //store data
                    let data = rows;
                    console.log("server side row:", rows)
                if (error){
                    console.log(error)
                }
                    else
                    // send the resuls of query2 back
                    { 
                    res.send(data)
                }
            })
         }
        })
    });

//PUT Update an appointment
app.put('/update-appointment-ajax/', function (req, res, next) {
    // capture incoming data;
    let data = req.body;
    let description = data.Description;
    let perinatalApptID = parseInt(data.ID);

    // query to update service in database. 
    let queryUpdate = `UPDATE PerinatalAppointments SET description = ? WHERE perinatalApptID = ?`;
    // query to select appointment
    let query2 = "SELECT perinatalApptID AS ID, name, billingCode, description FROM PerinatalAppointments WHERE perinatalApptID = ?";               
        // run query to update the database
        db.pool.query(queryUpdate, [description, perinatalApptID],function(error, rows, fields){
              if (error) {
                 // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
              }
              else
              {
                // get rows from appointments
                db.pool.query(query2,[perinatalApptID], function(error, rows, fields){
                //store data
                    let data = rows;
                    console.log("server side row:", rows)
                if (error){
                    console.log(error)
                }
                    else
                    // send the resuls of query2 back
                    { 
                    res.send(data)
                }
            })
         }
        })
    });


//PUT Update a Service History
app.put('/update-serviceHistory-ajax/', function (req, res, next) {
    // capture incoming data;
    let data = req.body;
    let date = data.Date;
    let client = parseInt(data.Client);
    let service = parseInt(data.Service);
    let employee = parseInt(data.Employee);
    let serviceHistoryID = parseInt(data.ID);

    // Capture NULL values for employees as database allows histories to be entered with no employee
    if (isNaN(employee))
    {
        employee = null;
    }

    // query to update service History in database. 
    let queryUpdate = `UPDATE ServiceHistories SET clientID = ?, serviceID = ?, employeeID = ?, date = ? WHERE serviceHistoryID = ?`;
    // query to select all from service histories
    let query2 = "SELECT serviceHistoryID AS ID, CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, NonmedicalServices.name AS Service, IFNULL(CONCAT(NonmedicalEmployees.firstName, ' ', NonmedicalEmployees.lastName), 'Null') AS Employee, DATE_FORMAT(ServiceHistories.date, '%m/%d/%y') AS Date FROM NonmedicalServices INNER JOIN ServiceHistories ON NonmedicalServices.serviceID = ServiceHistories.serviceID LEFT JOIN NonmedicalEmployees ON ServiceHistories.employeeID = NonmedicalEmployees.employeeID INNER JOIN Clients ON ServiceHistories.clientID = Clients.clientID WHERE serviceHistoryID = ?";               
    // db.pool.query(query1, [client], function(error, rows, fields){
        // run query to update the database
        db.pool.query(queryUpdate, [client, service, employee, date, serviceHistoryID],function(error, rows, fields){
              if (error) {
                 // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
              }
              else
              {
                // get all rows from service histories
                db.pool.query(query2,[serviceHistoryID], function(error, rows, fields){
                //store data
                    let data = rows;
                    console.log("server side row:", rows)
                if (error){
                    console.log(error)
                }
                    else
                    // send the resuls of query2 back
                    { 
                    res.send(data)
                }
            })
         }
        })
    });

//PUT Update a Appointment History
app.put('/update-appointmentHistory-ajax/', function (req, res, next) {
    // let apptHistoryID = req.params.id;
    let data = req.body;
    let date = data.Date;
    let client = parseInt(data.Client);
    let perinatalApptID = parseInt(data.Appointment);
    let provider = parseInt(data.Provider);
    let apptHistoryID = parseInt(data.ID);

    // Capture NULL values for providers as database allows histories to be entered with no provider
    if (isNaN(provider))
    {
        provider = null;
    }
    // query to get appointment history ID -- shouldn't need this step. 
    // query to update date on specific appointment History 
    let queryUpdate = `UPDATE AppointmentHistories SET clientID = ?, perinatalApptID = ?, providerID = ?, date = ? WHERE apptHistoryID = ?`;
    // query to select all from appointment histories
    let query2 = "SELECT apptHistoryID AS ID, CONCAT(Clients.firstName, ' ' ,Clients.lastName) AS Client, PerinatalAppointments.name AS Appointment, IFNULL(CONCAT(Providers.firstName, ' ' , Providers.lastName), 'Null') AS Provider, DATE_FORMAT(AppointmentHistories.date, '%m/%d/%y') AS Date FROM PerinatalAppointments INNER JOIN AppointmentHistories ON PerinatalAppointments.perinatalApptID = AppointmentHistories.perinatalApptID LEFT JOIN Providers ON AppointmentHistories.providerID = Providers.providerID INNER JOIN Clients ON AppointmentHistories.clientID = Clients.clientID WHERE apptHistoryID = ?";               
        // update the database
        db.pool.query(queryUpdate, [client, perinatalApptID, provider, date, apptHistoryID],function(error, rows, fields){
              if (error) {
                 // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
              }
              else
              {
                // get all rows from appointment histories
                db.pool.query(query2,[apptHistoryID], function(error, rows, fields){
                //store data
                let data = rows;
                console.log("rows", rows)
                if (error){
                    console.log(error)
                }
                    else
                    {
                    res.send(rows)
                }
            })
         }
        })
    });

// ------------------- DELETE ROUTES ----------------------------

// DELETE Provider
app.delete('/delete-provider-ajax/', function(req,res,next){
    let data = req.body;
    let providerID = parseInt(data.ID);
    let deleteProvider = `DELETE FROM Providers WHERE providerID = ?;`;
          // we have on delete set null set up in sql
            db.pool.query(deleteProvider, [providerID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
});

// DELETE Employee
app.delete('/delete-employee-ajax/', function(req,res,next){
    // capture incoming data
    let data = req.body;
    let employeeID = parseInt(data.ID);
    // query to delete employee
    let deleteEmployee = `DELETE FROM NonmedicalEmployees WHERE employeeID = ?;`;
          // we have on delete set null set up in sql
            db.pool.query(deleteEmployee, [employeeID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
            });

// DELETE Client
app.delete('/delete-client-ajax/', function(req,res,next){
    // capture incoming data
    let data = req.body;
    let clientID = parseInt(data.ID);
    // query to delete the client in the database
    let deleteClient = `DELETE FROM Clients WHERE clientID = ?;`;
            // we have on delete cascade in sql
            db.pool.query(deleteClient, [clientID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
            });

// DELETE Service
app.delete('/delete-service-ajax/', function(req,res,next){

        // capture incoming data
        let data = req.body;
        let serviceID = parseInt(data.ID);
        //query to check if the service is in service histories
        let serviceCheck = `SELECT serviceID from ServiceHistories WHERE serviceID = ?;`;
        // query to delete the service in the database
        let deleteService = `DELETE FROM NonmedicalServices WHERE serviceID = ?;`;
        
        //check if service is referenced in service histories
        db.pool.query(serviceCheck, [serviceID], function(error, rows, fields) {
            if (error) {
                //console.error(error);
                console.log("server side error", error)
                res.status(500).json({ error: 'Internal Server Error'});
            } else {
                // if the service is found in the service histories, return an error
                if (rows.length > 0) {
                    res.status(400).json({error: 'Service is connected to a service history and cannot be deleted.' });
                } else {
                    // if the service is not found in the service histories, proceed with delete
                    db.pool.query(deleteService, [serviceID], function(error, rows, fields) {
                        if (error) {
                            console.error(error);
                            res.status(500).json({ error: 'Internal Server Error'});
                        } else {
                            res.sendStatus(204);
                        }
                    });
                }
            }
        });
    });
                     
// DELETE Service History
app.delete('/delete-serviceHistory-ajax/', function(req,res,next){
    // capture incoming data
    let data = req.body;
    let serviceHistoryID = parseInt(data.ID);
    // query to delete the service history from the database
    let deleteServiceHistory = `DELETE FROM ServiceHistories WHERE serviceHistoryID = ?;`;
            // Run the query
            db.pool.query(deleteServiceHistory, [serviceHistoryID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
            });

// DELETE Appointment
app.delete('/delete-appointment-ajax/', function(req,res,next){

    // capture incoming data
    let data = req.body;
    let perinatalApptID = parseInt(data.ID);
    //query to check if the appointment is in appointment histories
    let appointmentCheck = `SELECT perinatalApptID from AppointmentHistories WHERE perinatalApptID = ?;`;
    // query to delete the appointment in the database
    let deleteAppointment = `DELETE FROM PerinatalAppointments WHERE perinatalApptID = ?;`;
    
    //check if appointment is referenced in appointment histories
    db.pool.query(appointmentCheck, [perinatalApptID], function(error, rows, fields) {
        if (error) {
            //console.error(error);
            console.log(error)
            res.status(500).json({ error: 'Internal Server Error'});
        } else {
            // if the appointment is found in the appointment histories, return an error
            if (rows.length > 0) {
                res.status(400).json({error: 'Appointment is connected to an appointment history and cannot be deleted.' });
            } else {
                // if the appointment is not found in the appointment histories, proceed with delete
                db.pool.query(deleteAppointment, [perinatalApptID], function(error, rows, fields) {
                    if (error) {
                        console.error(error);
                        res.status(500).json({ error: 'Internal Server Error'});
                    } else {
                        res.sendStatus(204);
                    }
                });
            }
        }
    });
});

// DELETE Appointment History
app.delete('/delete-appointmentHistory-ajax/', function(req,res,next){
    let data = req.body;
    let apptHistoryID = parseInt(data.ID);
    let deleteAppointmentHistory = `DELETE FROM AppointmentHistories WHERE apptHistoryID = ?;`;
            // Run the query
            db.pool.query(deleteAppointmentHistory, [apptHistoryID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
            });

/*
/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});