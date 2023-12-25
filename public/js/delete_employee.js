//Authors: Sonja Lavin, Flora Zhang
// Contents: Seattle Prenatal Clinic
// Citation for the delete employee javascript using jquery: 
// Date: 11/20/2023
// Copied from CS340 OSU course:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// function to delete employee based on employeeID pulled from employee browse table 
function deleteEmployee(employeeID, employeeName) {

  // ask the user for confirmation before proceeding
  var confirmation = window.confirm("Are you sure you want to delete this employee? ID: " + employeeID + ", Name: " + employeeName);

  if (confirmation) {

    let link = '/delete-employee-ajax/';
    let data = {
       // store data in ID object
      ID: employeeID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(employeeID);
      }
    });
  }
}
  
  //delete row function to update browse table, called above if data is successfully deleted from database
  function deleteRow(employeeID){
      let table = document.getElementById("employee-table");
       // iterate through employee browse table, searching for the employeeID that was selected to delete
      for (let i = 0, row; row = table.rows[i]; i++) {
        // when selected row is found, delete. 
         if (table.rows[i].getAttribute("data-value") == employeeID) {
              table.deleteRow(i);
              break;
         }
      }
  }