//******************************** SIDEBAR FUNCTIONS *********************************//

// FUNCTION TO HANDLE TABLE DISPLAY BASED ON SELECTED RADIO BUTTON
$(document).ready(function() {

    // Handle click events for radio buttons
    $('input[name="sidebar_tab1"]').on('change', function() {
      var value = $(this).val();

      // Store the selected tab in localStorage
      localStorage.setItem('lastSelectedTab', value);

      // Hide all tables
      $('.table-container').hide();

      // Show the corresponding table based on the selected radio button
      if (value === '3') {
        $('#groupsTableContainer').show();
      } else if (value === '4') {
        $('#groupMembershipsTableContainer').show();
      }else if (value === '5') {
        $('#groupPermissionsTableContainer').show();
      }else if (value === '6') {
        $('#usersTableContainer').show();
      }
      // Add more conditions for other radio buttons  
    });

    // Retrieve the last selected radio button value from local storage
    var lastSelectedTab = localStorage.getItem('lastSelectedTab');

     // Set the default value if no value is found in local storage
     if (!lastSelectedTab) {
      lastSelectedTab = '1';  
    }

     // Set the last selected radio button as checked
     $('input[name="sidebar_tab1"][value="' + lastSelectedTab + '"]').prop('checked', true);

     // Trigger the change event to display the corresponding table
     $('input[name="sidebar_tab1"][value="' + lastSelectedTab + '"]').change();
 
  });