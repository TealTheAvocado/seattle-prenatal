//Authors: Sonja Lavin, Flora Zhang
// Contents: Seattle Prenatal Clinic
// Citation for the delete appt histories javascript using jquery: 
// Date: 11/20/2023
// Copied from CS340 OSU course:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// function to delete appointment history based on appointmentHistoryID pulled from service histories browse table 
function deleteAppointmentHistory(apptHistoryID, client, details) {
   // Ask the user for confirmation before proceeding
   var confirmation = window.confirm("Are you sure you want to delete this history? ID: " + apptHistoryID + ", Client: " + client + ", Details: " + details);

   if (confirmation) {
    let link = '/delete-appointmentHistory-ajax/';
    let data = {
      // store data in ID object
      ID: apptHistoryID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        // call delete row function to update browse table
        deleteRow(apptHistoryID);
      }
    });
  }
}
  
   //delete row function to update browse table
  function deleteRow(apptHistoryID){
      let table = document.getElementById("apptHistories-table");
      // iterate through service histories browse table, searching for the service history ID that was selected to delete
      for (let i = 0, row; row = table.rows[i]; i++) {
        // when selected row is found, delete. 
        if (table.rows[i].getAttribute("data-value") == apptHistoryID) {
          table.deleteRow(i);
          break;
         }
      }
  }