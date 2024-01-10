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
      url: "http://127.0.0.1:8000/api/auth/login",
      type: "POST",
      dataType: "json",
      data: {
        username: username,
        password: password,
      },
      success: function (response) {
        // Hide the spinner after successful login
        $("#spinner").hide();

        // Handle successful login
        console.log(response);

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

  // HANDLE LOGOUT
  $("#navbar").on("click", 'a[href="#logout"]', function (event) {
    event.preventDefault();

    // Perform AJAX request to logout endpoint
    $.ajax({
      url: "http://127.0.0.1:8000/api/auth/logout",
      type: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("edms_token"),
      },
      success: function (response) {
        // Remove token from localStorage
        localStorage.removeItem("edms_token");

        // Redirect to index.html after successful logout
        window.location.href = "index.html";
      },
      error: function (xhr, status, error) {
        // Handle logout failure
        console.error(xhr.responseText);

        // Optionally, display an error message
        // $("#error-message").text("Logout failed. Please try again.");

        // Redirect to index.html even if logout fails (you may adjust this based on your requirements)
        window.location.href = "index.html";
      },
    });
  });
});
