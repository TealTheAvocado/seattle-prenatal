//Authors: Sonja Lavin, Flora Zhang
// Contents: Seattle Prenatal Clinic
// Citation for the delete service histories javascript using jquery: 
// Date: 11/20/2023
// Copied from CS340 OSU course:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// function to delete service history based on serviceHistoryID pulled from service histories browse table 
function deleteServiceHistory(serviceHistoryID, client, details) {
  // Ask the user for confirmation before proceeding
  var confirmation = window.confirm("Are you sure you want to delete this history? ID: " + serviceHistoryID + ", Client: " + client + ", Details: " + details);

  if (confirmation) {
    let link = '/delete-serviceHistory-ajax/';
    let data = {
      // store data in ID object
      ID: serviceHistoryID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        // call delete row function to update browse table
        deleteRow(serviceHistoryID);
      }
    });
  }
}
  
  //delete row function to update browse table
  function deleteRow(serviceHistoryID){
      let table = document.getElementById("serviceHistories-table");
      // iterate through service histories browse table, searching for the service history ID that was selected to delete
      for (let i = 0, row; row = table.rows[i]; i++) {
        // when selected row is found, delete. 
         if (table.rows[i].getAttribute("data-value") == serviceHistoryID) {
              table.deleteRow(i);
              break;
         }
      }
  }