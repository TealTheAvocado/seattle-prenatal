-- Clent Page
-- 1. Browse/Read: Get all Clients: 
-- for each client, list clientID, firstName, lastName, birthday, phone number, email, and Primary Provider 
SELECT Clients.clientID AS ID, 
Clients.firstName AS FirstName, 
Clients.lastName AS LastName, 
IFNULL(CONCAT(Providers.firstName, ' ' ,Providers.lastName), 'Null') AS Provider, 
DATE_FORMAT(Clients.birthday, '%m/%d/%y') AS birthday, 
Clients.phone, 
Clients.email 
FROM Clients
LEFT JOIN Providers ON Clients.providerID = Providers.providerID;

-- if thre is a search by last name, select only clients with last name like input search
SELECT Clients.clientID AS ID, 
Clients.firstName AS FirstName, 
Clients.lastName AS LastName, 
IFNULL(CONCAT(Providers.firstName, ' ' ,Providers.lastName), 'Null') AS Provider, 
DATE_FORMAT(Clients.birthday, '%m/%d/%y') AS birthday, 
Clients.phone, 
Clients.email 
FROM Clients 
LEFT JOIN Providers ON Clients.providerID = Providers.providerID 
WHERE Clients.lastName LIKE ":search_input";

-- if there is a search by provider, requesting only clients with null provider, return only clients those clients
SELECT Clients.clientID AS ID, 
Clients.firstName AS FirstName, 
Clients.lastName AS LastName, 
IFNULL(CONCAT(Providers.firstName, ' ' ,Providers.lastName), 'Null') AS Provider , 
DATE_FORMAT(Clients.birthday, '%m/%d/%y') AS birthday, 
Clients.phone, 
Clients.email 
FROM Clients 
LEFT JOIN Providers ON Clients.providerID = Providers.providerID 
WHERE Providers.providerID IS NULL;

-- if there is a search by provider, requesting all clients of a specific provider, return corresponding clients
SELECT Clients.clientID AS ID, 
Clients.firstName AS FirstName, 
Clients.lastName AS LastName, 
IFNULL(CONCAT(Providers.firstName, ' ' ,Providers.lastName), 'Null') AS Provider , 
DATE_FORMAT(Clients.birthday,'%m/%d/%y') AS birthday, 
Clients.phone, Clients.email 
FROM Clients 
LEFT JOIN Providers ON Clients.providerID = Providers.providerID 
WHERE Providers.providerID = :selected_providerID_from_dropdown;

-- provider drop down used in add update and browse client (filter by provider)
SELECT providerID AS providerID, 
CONCAT(firstName, ' ' ,lastName) AS Provider 
FROM Providers 
ORDER BY Providers ASC;

-- 2. Add/Create a client: 
-- insert client into database
INSERT INTO Clients 
(firstName, lastName, providerID, birthday, phone, email) 
VALUES 
(':fname_input', 'lname_input', :selected_provider_from_dropdown,':birthday_input', 'phone_input', 'email_input');

-- select client to send to client side 
SELECT Clients.clientID AS ID, 
Clients.firstName AS FirstName, 
Clients.lastName AS LastName, 
IFNULL(CONCAT(Providers.firstName, ' ' ,Providers.lastName), 'Null') AS Provider, 
DATE_FORMAT(Clients.birthday, '%m/%d/%y') AS birthday, 
Clients.phone, 
Clients.email 
FROM Clients 
LEFT JOIN Providers ON Clients.providerID = Providers.providerID;

-- 3. Edit/Update a client:  
-- update a client's data based on submission of the Update Client form 
UPDATE Clients SET providerID = :selected_providerID, phone = :phone_input, email = :email_input WHERE clientID = :selected_clientID;

-- Get selected clients data (used to populate edit form and to send back to client side after update)
SELECT Clients.clientID AS ID, 
Clients.firstName, 
Clients.lastName, 
IFNULL(CONCAT(Providers.firstName, ' ', Providers.lastName), 'Null') AS Provider, 
Clients.ProviderID, 
DATE_FORMAT(Clients.birthday, '%m/%d/%y') AS birthday, 
Clients.phone, 
Clients.email FROM Clients 
LEFT JOIN Providers ON Clients.providerID = Providers.providerID 
WHERE clientID = :selected_clientID

-- 4. Delete a client:
DELETE FROM Clients 
WHERE clientID = :client_ID_selected_from_browse_client_page;

-- Provider Page 
-- 1. Browse/Read: get all providers
-- for each provider, list ID, first name, last name, title, phone, and email
SELECT Providers.providerID AS ID, 
Providers.firstName AS FirstName, 
Providers.lastName AS LastName, 
Providers.title AS Title, 
Providers.phone, 
Providers.email 
FROM Providers;

-- if there is filter by title, list each provider with selected title
SELECT Providers.providerID AS ID, 
Providers.firstName AS FirstName, 
Providers.lastName AS LastName, 
Providers.title AS Title, 
Providers.phone, 
Providers.email 
FROM Providers 
WHERE Providers.Title = ':title_selected_from_dropdown';

-- if there is a search by last name, return all providers with last name like search input
SELECT Providers.providerID AS ID, 
Providers.firstName AS FirstName, 
Providers.lastName AS LastName, 
Providers.title AS Title, 
Providers.phone, 
Providers.email 
FROM Providers 
WHERE Providers.lastName LIKE ":search_input";

-- create dropdown for title (used in browse and add)
SELECT DISTINCT title 
From Providers 
ORDER BY title ASC; 

-- 2. Add/Create a provider: 
INSERT INTO Providers 
(firstName, lastName, title, phone, email) 
VALUES 
(':fname_input', ':lname_input', ':selected_or_input_title', ':phone_input', ':email_input');

-- select providers to return update provider to client side server
SELECT providerID AS ID, 
firstName AS FirstName, 
lastName AS LastName, 
title AS Title, 
phone, 
email 
FROM Providers

-- 3. Edit/Update up provider.
-- update providers information  
UPDATE Providers SET phone = :phone_input, email = :email_input WHERE providerID = :selected_ProviderID;

-- get a single provider's data for the Update Provider form and to send back to client side with updated data
SELECT Providers.providerID AS ID, 
Providers.firstName AS FirstName, 
Providers.lastName AS LastName, 
Providers.title, 
Providers.phone, 
Providers.email 
FROM Providers 
WHERE providerID = :selected_providerID;

-- 4. Delete a provider:
DELETE FROM Providers 
WHERE providerID = :provider_ID_selected_from_browse_provider_page;

-- Perinatal Appointments Page
-- 1. Browse/Read: get all perinatal Appointments
-- for each appointment, list ID, name, billing code, and description
SELECT perinatalApptID AS ID, 
name AS Name, 
billingCode AS BillingCode, 
description AS Description 
FROM PerinatalAppointments;

-- if there was a search by name, select only appointments with names like search input
SELECT perinatalApptID AS ID, 
name AS Name, 
billingCode AS BillingCode, 
description AS Description 
FROM PerinatalAppointments 
WHERE Name LIKE ":search_input";

-- 2. Add/Create: Create a new perinatal Appointment
-- insert new perinatal appointment 
INSERT INTO PerinatalAppointments 
(name, billingCode, description) 
VALUES 
(':name_input', ':billingCode_input', ':description_input');

-- select appointments to send back to client side 
SELECT perinatalApptID AS ID,
name AS Name, 
billingCode as BillingCode, 
description AS Description 
FROM PerinatalAppointments;

-- 3.Edit/Update: Edit an appointment 
-- update an appointment's data based on submission of the Update Perinatal Appointment form 
UPDATE PerinatalAppointments SET description = ? WHERE perinatalApptID = :appointment_ID_from_the_update_form;

-- get a single appointment's data for the Update Perinatal Appointment form and for sending updated info back to client side
SELECT perinatalApptID AS ID, name, billingCode, description FROM PerinatalAppointments WHERE perinatalApptID = :selectedID;

-- 4. Delete: To preserve patient histories, deletion of appointments is not allowed if it is connected to an appointment history. 
-- check to see if service ID is connected to a service history
SELECT perinatalApptID from AppointmentHistories WHERE perinatalApptID = :SelectedID;
-- delete appointment that is not connected to a history
DELETE FROM PerinatalAppointments WHERE perinatalApptID = :SelectedID;

-- Appointment Histories Page
-- 1. Browse/Read: get all Appointment Histories
-- for each Appointment History, list apptHistoryID, clients first name and last name, perinatal appointment name, providers first and last name concatenated and date
SELECT apptHistoryID AS ID, 
CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, 
PerinatalAppointments.name AS Appointment,
IFNULL(CONCAT(Providers.firstName, ' ', Providers.lastName), 'Null') AS Provider, 
DATE_FORMAT(AppointmentHistories.date, '%m/%d/%y') AS Date 
FROM PerinatalAppointments 
INNER JOIN AppointmentHistories ON PerinatalAppointments.perinatalApptID = AppointmentHistories.perinatalApptID
LEFT JOIN Providers ON AppointmentHistories.providerID = Providers.providerID 
INNER JOIN Clients ON AppointmentHistories.clientID = Clients.clientID 
ORDER BY AppointmentHistories.apptHistoryID ASC;

-- if there is a search by client last name, select only appointment histories with clients with last names like search input
SELECT apptHistoryID AS ID, 
CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, 
PerinatalAppointments.name AS Appointment, 
IFNULL(CONCAT(Providers.firstName, ' ', Providers.lastName), 'Null') AS Provider, 
DATE_FORMAT(AppointmentHistories.date, '%m/%d/%y') AS Date 
FROM PerinatalAppointments 
INNER JOIN AppointmentHistories ON PerinatalAppointments.perinatalApptID = AppointmentHistories.perinatalApptID
LEFT JOIN Providers ON AppointmentHistories.providerID = Providers.providerID 
INNER JOIN Clients ON AppointmentHistories.clientID = Clients.clientID 
WHERE Clients.lastName LIKE ":search_input" 
ORDER BY AppointmentHistories.apptHistoryID ASC;

-- if there is a search by provider, select only appointment hisotires with selected provider
SELECT apptHistoryID AS ID, 
CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, 
PerinatalAppointments.name AS Appointment, 
IFNULL(CONCAT(Providers.firstName, ' ', Providers.lastName), 'Null') AS Provider, 
DATE_FORMAT(AppointmentHistories.date, '%m/%d/%y') AS Date 
FROM PerinatalAppointments 
INNER JOIN AppointmentHistories ON PerinatalAppointments.perinatalApptID = AppointmentHistories.perinatalApptID
LEFT JOIN Providers ON AppointmentHistories.providerID = Providers.providerID 
INNER JOIN Clients ON AppointmentHistories.clientID = Clients.clientID 
WHERE Providers.providerID = :selected_providerID_from_dropdown
ORDER BY AppointmentHistories.apptHistoryID ASC;

-- if there is a search by histories with no provider, return selected histories
SELECT apptHistoryID AS ID, 
CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, 
PerinatalAppointments.name AS Appointment,
IFNULL(CONCAT(Providers.firstName, ' ', Providers.lastName), 'Null') AS Provider, 
DATE_FORMAT(AppointmentHistories.date, '%m/%d/%y') AS Date 
FROM PerinatalAppointments 
INNER JOIN AppointmentHistories ON PerinatalAppointments.perinatalApptID = AppointmentHistories.perinatalApptID
LEFT JOIN Providers ON AppointmentHistories.providerID = Providers.providerID 
INNER JOIN Clients ON AppointmentHistories.clientID = Clients.clientID 
WHERE Providers.providerID IS NULL 
ORDER BY AppointmentHistories.apptHistoryID ASC;

-- clients drop down for add and update
SELECT clientID, CONCAT(Clients.firstName, ' ' ,Clients.lastName) AS Client 
FROM Clients 
ORDER BY Client ASC;

-- appointments drop down for add and update
SELECT perinatalApptID, PerinatalAppointments.name AS Appointment 
FROM PerinatalAppointments 
ORDER BY Appointment ASC;

-- providers drop down for add update and browse
SELECT providerID, CONCAT(Providers.firstName, ' ' ,Providers.lastName) as Provider 
FROM Providers 
ORDER BY Provider ASC;

-- 2. Add/Create: add a new appointment history event
-- insert new appointment history
INSERT INTO AppointmentHistories
(perinatalApptID, clientID, providerID, date) 
VALUES 
(:perinatal_appt_ID_from_dropdownInput, :client_ID_from_dropdownInput, :provider_ID_from_dropdownInput, :dateInput);

-- select appointment histories to send back to client side
SELECT apptHistoryID AS ID, 
CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, 
PerinatalAppointments.name AS Appointment,
IFNULL(CONCAT(Providers.firstName, ' ', Providers.lastName), 'Null') AS Provider, 
DATE_FORMAT(AppointmentHistories.date, '%m/%d/%y') AS Date 
FROM PerinatalAppointments 
INNER JOIN AppointmentHistories ON PerinatalAppointments.perinatalApptID = AppointmentHistories.perinatalApptID
LEFT JOIN Providers ON AppointmentHistories.providerID = Providers.providerID 
INNER JOIN Clients ON AppointmentHistories.clientID = Clients.clientID 
ORDER BY AppointmentHistories.apptHistoryID ASC;

-- 3. Edit/Update:  
-- update appointment history data based on submission of the Update Services History form 
UPDATE AppointmentHistories 
SET 
clientID = :client_ID_selected_from_dropdown, 
perinatalApptID = :perinatalAppt_ID_selected_from_dropdown, 
providerID = :provider_ID_selected_from_dropdown, 
date= :dateInput
WHERE apptHistoryID= :appointment_ID_from_the_update_form;

--  get a single appointment history event's data for the Update Appointment Histories form and to send back updated information
SELECT apptHistoryID, clientID, perinatalApptID, providerID, date 
FROM AppointmentHistories
WHERE apptHistoryID = :appointment_history_ID_selected_from_browse_appointment_history_page;

-- 4. Delete: remove an appointment history event
DELETE FROM AppointmentHistories
WHERE apptHistoryID = :appointment_history_ID_selected_from_browse_appointment_histories_page;


-- Employee Page 
-- 1. Browse/Read: get all employees
-- for each employee, list ID, first name, last name, title, phone and email
 SELECT employeeID AS ID, 
 firstName AS FirstName, 
 lastName AS LastName, 
 title AS Title, 
 phone, 
 email 
 FROM NonmedicalEmployees;

-- if there is a filter by title, display only employees with selected title
SELECT employeeID AS ID, 
firstName AS FirstName, 
lastName AS LastName, 
title AS Title, 
phone, 
email 
FROM NonmedicalEmployees 
WHERE NonmedicalEmployees.Title = ":seletected_title_from_dropdown";

-- if there is a search by last name, display only employees with last name like input search
SELECT employeeID AS ID, 
firstName AS FirstName, 
lastName AS LastName, 
title AS Title, 
phone, 
email 
FROM NonmedicalEmployees 
WHERE NonmedicalEmployees.lastName LIKE ":search_input";

-- title drop down query used for browse (filtered by title) and add 
SELECT DISTINCT title 
From NonmedicalEmployees 
ORDER BY Title ASC; 

-- 2. Add/Create an employee: 
-- add new employee
INSERT INTO NonmedicalEmployees 
(firstName, lastName, title, phone, email) 
VALUES 
(':fnameinput', ':lname_input', ':selected_or_input_title', ':phone_input', ':email_input');

-- select emplyees to return to client side 
SELECT employeeID AS ID, 
firstName AS FirstName, 
lastName AS LastName, 
title AS Title, 
phone, 
email 
FROM NonmedicalEmployees;

-- 3. Edit/Update up employee 
-- Update an employees data based on submission of the updated employee form
UPDATE NonmedicalEmployees SET phone = :phone_input, email = :email_input WHERE employeeID = :selected_employeeID;

-- get a single employee's data for the Update Employee form and to return updated information back to client side
SELECT NonmedicalEmployees.employeeID AS ID, 
firstName AS FirstName, 
lastName AS LastName, 
title, 
phone, 
email 
FROM NonmedicalEmployees 
WHERE employeeID = :selected_employeeID;

-- 4. Delete an employee:
DELETE FROM NonmedicalEmployees
WHERE employeeID = :employee_ID_selected_from_browse_employee_page;

-- Nonmedical Services Page
-- 1. Browse/Read: get all Nonmedical Services
-- for each service, list ID, name, and description
SELECT serviceID AS ID, 
name AS Name, 
description AS Description 
FROM NonmedicalServices;

-- if there is a search by name, select only services with name like search input
SELECT serviceID AS ID, 
name AS Name, 
description AS Description 
FROM NonmedicalServices 
WHERE Name LIKE ":search_input";

-- 2. Add/Create: Create a new Service
-- insert new nonmedical service 
INSERT INTO NonmedicalServices 
(name, description) 
VALUES 
(':name_input', ':description_input');

-- select services to send back to client side
SELECT serviceID AS ID, 
name AS Name, 
description AS Description 
FROM NonmedicalServices;

-- 3.Edit/Update: Edit a service 
-- update a services data based on submission of the Update Nonmedical Services form
UPDATE NonmedicalServices SET description = :inputDescription WHERE serviceID = :selectedID;

-- get a single service's data for the Update Nonmedical Services form and to send back to client side after update
SELECT serviceID AS ID, name, description FROM NonmedicalServices WHERE serviceID = :selectedID;

-- 4. Delete: To preserve patient histories, deletion of nonmedical services is not allowed if it is connected to a service history. 
-- check to see if service ID is connected to a service history
SELECT serviceID from ServiceHistories WHERE serviceID = :SelectedID;
-- delete service that is not connected to a history
DELETE FROM NonmedicalServices WHERE serviceID = :SelectedID;

-- Service Histories Page
-- 1. Browse/Read: get all Service Histories
-- for each Service History, list serviceHistoryID, clients first name and last name, service name, providers first and last name concatenated and date
SELECT serviceHistoryID AS ID, 
CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, 
NonmedicalServices.name AS Service, 
IFNULL(CONCAT(NonmedicalEmployees.firstName, ' ', NonmedicalEmployees.lastName), 'Null') AS Employee, 
DATE_FORMAT(ServiceHistories.date, '%m/%d/%y') AS Date 
FROM NonmedicalServices 
INNER JOIN ServiceHistories ON NonmedicalServices.serviceID = ServiceHistories.serviceID 
LEFT JOIN NonmedicalEmployees ON ServiceHistories.employeeID = NonmedicalEmployees.employeeID 
INNER JOIN Clients ON ServiceHistories.clientID = Clients.clientID 
ORDER BY ServiceHistories.serviceHistoryID ASC;

-- if there was a search by client last name, select only service histories for clients with last name like search input
SELECT serviceHistoryID AS ID, 
CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, 
NonmedicalServices.name AS Service, 
IFNULL(CONCAT(NonmedicalEmployees.firstName, ' ', NonmedicalEmployees.lastName), 'Null') AS Employee, 
DATE_FORMAT(ServiceHistories.date, '%m/%d/%y') AS Date 
FROM NonmedicalServices 
INNER JOIN ServiceHistories ON NonmedicalServices.serviceID = ServiceHistories.serviceID 
LEFT JOIN NonmedicalEmployees ON ServiceHistories.employeeID = NonmedicalEmployees.employeeID 
INNER JOIN Clients ON ServiceHistories.clientID = Clients.clientID 
WHERE Clients.lastName LIKE ":search_input" 
ORDER BY ServiceHistories.serviceHistoryID ASC;

-- if there was a search by employee, select only service histories with that employee
SELECT serviceHistoryID AS ID, 
CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, 
NonmedicalServices.name AS Service, 
IFNULL(CONCAT(NonmedicalEmployees.firstName, ' ', NonmedicalEmployees.lastName), 'Null') AS Employee, 
DATE_FORMAT(ServiceHistories.date, '%m/%d/%y') AS Date 
FROM NonmedicalServices 
INNER JOIN ServiceHistories ON NonmedicalServices.serviceID = ServiceHistories.serviceID 
LEFT JOIN NonmedicalEmployees ON ServiceHistories.employeeID = NonmedicalEmployees.employeeID 
INNER JOIN Clients ON ServiceHistories.clientID = Clients.clientID 
WHERE NonmedicalEmployees.employeeID = :selected_employeeID_from_Dropdown 
ORDER BY ServiceHistories.serviceHistoryID ASC;

-- if there was a search by null employee, select only service histories with no employee
SELECT serviceHistoryID AS ID, 
CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, 
NonmedicalServices.name AS Service, 
IFNULL(CONCAT(NonmedicalEmployees.firstName, ' ', NonmedicalEmployees.lastName), 'Null') AS Employee, 
DATE_FORMAT(ServiceHistories.date, '%m/%d/%y') AS Date 
FROM NonmedicalServices INNER JOIN ServiceHistories ON NonmedicalServices.serviceID = ServiceHistories.serviceID 
LEFT JOIN NonmedicalEmployees ON ServiceHistories.employeeID = NonmedicalEmployees.employeeID 
INNER JOIN Clients ON ServiceHistories.clientID = Clients.clientID 
WHERE NonmedicalEmployees.employeeID IS NULL 
ORDER BY ServiceHistories.serviceHistoryID ASC;

-- Drop down for client (used in add and update service history)
SELECT clientID, CONCAT(Clients.firstName, ' ' ,Clients.lastName) AS Client 
FROM Clients 
ORDER BY Client ASC;

-- drop down for services (used in add and update service history)
SELECT serviceID, NonmedicalServices.name AS Service 
FROM NonmedicalServices 
ORDER BY Service ASC;

-- drop down for employees (used in browse, add, and update service history)
SELECT employeeID, CONCAT(NonmedicalEmployees.firstName, ' ' ,NonmedicalEmployees.lastName) as Employee 
FROM NonmedicalEmployees 
ORDER BY Employee ASC;

-- 2. Add/Create: add a new service history event
-- insert new service history
INSERT INTO ServiceHistories
(clientID, serviceID, employeeID, date) 
VALUES 
(:client_ID_from_dropdownInput, :service_ID_from_dropdownInput, :employee_ID_from_dropdownInput, :dateInput);

-- select service histories to send back to client side 
SELECT serviceHistoryID AS ID, 
CONCAT(Clients.firstName, ' ', Clients.lastName) AS Client, 
NonmedicalServices.name AS Service, IFNULL(CONCAT(NonmedicalEmployees.firstName, ' ', NonmedicalEmployees.lastName), 'Null') AS Employee, 
DATE_FORMAT(ServiceHistories.date, '%m/%d/%y') AS Date 
FROM NonmedicalServices 
INNER JOIN ServiceHistories ON NonmedicalServices.serviceID = ServiceHistories.serviceID 
LEFT JOIN NonmedicalEmployees ON ServiceHistories.employeeID = NonmedicalEmployees.employeeID 
INNER JOIN Clients ON ServiceHistories.clientID = Clients.clientID 
ORDER BY ServiceHistories.serviceHistoryID ASC;

-- 3. Edit/Update: At this time, all details of the service history can be updated 
-- update a service history data based on submission of the Update Services History form 
UPDATE ServiceHistories SET clientID = :client_ID_selected_from_dropdown, serviceID = :service_ID_selected_from_dropdown, employeeID = :employee_ID_selected_from_dropdown, date= :dateInput
WHERE serviceHistoryID= :service_ID_from_the_update_form;

-- get a single service history event's data for the Update Service Histories form
SELECT serviceHistoryID, clientID, serviceID, employeeID, date FROM ServiceHistories
WHERE serviceHistoryID = :service_history_ID_selected_from_browse_history_page;

-- 4. Delete: remove a service history event
DELETE FROM ServiceHistories
WHERE serviceHistoryID = :service_history_ID_selected_from_browse_service_histories_page;
