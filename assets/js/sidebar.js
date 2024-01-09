$(document).ready(function () {
  // Handle click events for radio buttons
  $('input[name="sidebar_tab1"]').on("change", function () {
    var value = $(this).val();

    // Store the selected tab in localStorage
    localStorage.setItem("lastSelectedTab", value);

    // Hide all tables and cards
    $(".table-container").hide();
    $("#content").hide();
    $("#categories").hide();

    // Show the corresponding table or card based on the selected radio button
    if (value === "3") {
      $("#groupsTableContainer").show();
    } else if (value === "4") {
      $("#groupMembershipsTableContainer").show();
    } else if (value === "5") {
      $("#groupPermissionsTableContainer").show();
    } else if (value === "6") {
      $("#usersTableContainer").show();
    } else if (value === "1") {
      $("#content").show();
    } else if (value === "7") {
      $("#categories").show();
    } else if (value === "8") {
      $("#serializerTableContainer").show();
    }
    // Add more conditions for other radio buttons
  });

  // Retrieve the last selected radio button value from local storage
  var lastSelectedTab = localStorage.getItem("lastSelectedTab");

  // Set the default value if no value is found in local storage
  if (!lastSelectedTab) {
    lastSelectedTab = "1";
  }

  // Set the last selected radio button as checked
  $('input[name="sidebar_tab1"][value="' + lastSelectedTab + '"]').prop(
    "checked",
    true
  );

  // Trigger the change event to display the corresponding table or card
  $('input[name="sidebar_tab1"][value="' + lastSelectedTab + '"]').change();
});
