$(document).ready(function () {
  // HANDLE LOGOUT
  $("#logout").on("click", function (event) {
    event.preventDefault();
    console.log("Logout button clicked");

    const bearerToken = localStorage.getItem("edms_token");

    // Perform AJAX request to logout endpoint
    $.ajax({
      url: "http://127.0.0.1:8000/api/auth/logout",
      type: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      success: function (response) {
        // Remove token from localStorage
        localStorage.removeItem("edms_token");

        // Redirect to index.html after successful logout
        window.location.href = "../index.html";
      },
      error: function (xhr, status, error) {
        // Handle logout failure
        console.error(xhr.responseText);

        // Optionally, display an error message
        // $("#error-message").text("Logout failed. Please try again.");

        // Redirect to index.html even if logout fails (you may adjust this based on your requirements)
        window.location.href = "../index.html";
      },
    });
  });
});
