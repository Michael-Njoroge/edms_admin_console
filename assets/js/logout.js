$(document).ready(function () {
  // HANDLE LOGOUT
  $("#logout").on("click", function (event) {
    event.preventDefault();

    const bearerToken = localStorage.getItem("edms_token");

    // Perform AJAX request to logout endpoint
    $.ajax({
      url: apiBaseUrl + "/auth/logout",
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

        // Redirect to index.html even if logout fails
        window.location.href = "../index.html";
      },
    });
  });
});
