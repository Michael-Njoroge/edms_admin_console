//**************************** NAVBAR FUNCTIONS*************************//

// FUNCTION TO FETCH USER INFORMATION BASED ON THE LOGGED-IN USER'S ID
function fetchUserInfoAndUpdateNavbar() {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    return;
  }

  // Decode the JWT to extract the user ID
  const decodedToken = parseJwt(bearerToken);
  const userId = decodedToken.sub; // Assuming 'sub' contains the user ID

  // Make a GET request to fetch user information based on the user's ID
  fetch(`http://127.0.0.1:8000/api/user/show/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Update the user's name in the navigation bar
      updateUserNameInNavbar(data.data.data.username);

      // Update the profile modal
      updateProfileModal(data.data.data);

      // Call populateDropdowns once user information is retrieved
      populateDropdowns();
    })
    .catch((error) => {
      console.error("Error fetching user information:", error);
    });
}

// FUNCTION TO UPDATE THE USER'S NAME IN THE NAVIGATION BAR
function updateUserNameInNavbar(userName) {
  // Update the user's name in the navigation bar
  const userNameElement = document.getElementById("user-name");
  if (userNameElement) {
    userNameElement.innerText = userName;
  }
}

// FUNCTION TO UPDATE THE PROFILE MODAL
function updateProfileModal(userData) {
  const profileUsernameElement = document.getElementById("profile-username");
  const profileNameElement = document.getElementById("profile-name");
  const profileModalTitleElement = document.getElementById("profileModalLabel");

  if (profileUsernameElement && profileNameElement) {
    profileUsernameElement.innerText = userData.username;

    profileNameElement.innerText = userData.name;
  }

  // Update the modal title to include the name
  profileModalTitleElement.innerText = `${userData.name} Profile`;
}

// Function to parse a JWT
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload);
}

// Call fetchUserInfoAndUpdateNavbar before the document is ready
fetchUserInfoAndUpdateNavbar();

// Call populateDropdowns when the document is ready
populateDropdowns();
