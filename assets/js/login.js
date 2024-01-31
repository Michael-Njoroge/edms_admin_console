$(document).ready(function () {
  // Check if a token exists in localStorage
  var token = localStorage.getItem("edms_token");

  // If the token exists, redirect to the admin page
  if (token) {
    window.location.href = "../pages/admin.html";
  }
  // Handle form submission
  $("#login-form").submit(function (event) {
    event.preventDefault();

    // Show the spinner while fetching data
    $("#spinner").show();

    // Clear previous error messages
    $(".error").text("");

    // Get input values
    var username = $("#username").val();
    var password = $("#password").val();

    // Validate input
    if (!username || !password) {
      // Display an error message
      $("#error-message").text("Username and password are required.");

      // Hide the spinner after displaying the error
      setTimeout(function () {
        $("#spinner").hide();
      }, 1500);

      return;
    }

    // Perform AJAX request to your login endpoint
    $.ajax({
      url: apiBaseUrl + "/auth/login",
      type: "POST",
      dataType: "json",
      data: {
        username: username,
        password: password,
      },
      success: function (response) {
        // Hide the spinner after successful login
        $("#spinner").hide();

        // Save token in localStorage
        localStorage.setItem("edms_token", response.access_token);

        // Redirect to the admin page
        window.location.href = "../pages/admin.html";
      },
      error: function (xhr, status, error) {
        // Hide the spinner after displaying the error
        setTimeout(function () {
          $("#spinner").hide();

          // Handle login failure
          console.error(xhr.responseText);

          // Display error message
          $("#error-message").text("Invalid username or password.");
        }, 1500);
      },
    });
  });
});
