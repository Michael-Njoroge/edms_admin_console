$(document).ready(function () {
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

        // Check user status after successful login
        checkUserStatus(response.access_token);
      },
      error: function (xhr, status, error) {
        // Hide the spinner after displaying the error
        setTimeout(function () {
          $("#spinner").hide();

          // Handle login failure
          console.error(xhr.responseText);

          // Display error message
          $("#error-message").html("Invalid username or password.");
        });
        // Hide the error message
        setTimeout(function () {
          $("#error-message").empty();
        }, 6000);
      },
    });
  });
});

// Function to check user status
function checkUserStatus(bearerToken) {
  // Decode the JWT to extract the user ID
  const decodedToken = parseJwt(bearerToken);
  const userId = decodedToken.sub;

  // Perform AJAX request to check user status
  $.ajax({
    url: apiBaseUrl + "/user/show/" + userId,
    type: "GET",
    dataType: "json",
    headers: { Authorization: "Bearer " + bearerToken },
    success: function (response) {
      if (response.success && response.data.data.is_active === 1) {
        // User is active, redirect to the admin page
        window.location.href = "../pages/admin.html";
      } else {
        // User is not active or response indicates failure, display an error message
        $("#error-message").html("Please contact system Admin if this persist");
      }
    },

    // Display the error message from the server response
    // if (xhr.responseJSON && xhr.responseJSON.message) {
    //   $("#error-message").text(xhr.responseJSON.message);
    // } else {
    //   $("#error-message").text("Failed to fetch user status.");
    // }
    error: function (xhr, status, error) {
      console.error(xhr.responseText);

      // Always show the inactive message if there is an error
      $("#error-message").html(
        "Unable to login, <br/>Please contact system Admin if this persist"
      );
      // Hide the error message
      setTimeout(function () {
        $("#error-message").empty();
      }, 6000);
    },
  });
}

// Function to parse a JWT
function parseJwt(bearerToken) {
  const base64Url = bearerToken.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload);
}
