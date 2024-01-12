// Add an event listener to the file input
document
  .getElementById("photoFile")
  .addEventListener("change", handleFileSelect);

// Function to handle file selection
function handleFileSelect(event) {
  const fileInput = event.target;
  const files = fileInput.files;

  if (files.length > 0) {
    const selectedFile = files[0];

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

    const formData = new FormData();
    formData.append("user_profile", selectedFile);

    // Use userId to construct the update URL
    const updateUrl = `http://127.0.0.1:8000/api/users/update/${userId}`;

    // Use the Fetch API to send a POST request to the update endpoint with the FormData containing the file
    fetch(updateUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        // Assuming you want to update the user information in the navbar and profile modal after a successful upload
        fetchUserInfoAndUpdateNavbar();
      })
      .catch((error) => console.error("Error uploading photo:", error));
  }
}

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
      // Update the user's photo in the navigation bar
      updatePhotoInNavbar(data.data.data.user_profile);

      // Update the profile modal
      updateProfileModal(data.data.data);

      // Call populateDropdowns once user information is retrieved
      populateDropdowns();
    })
    .catch((error) => {
      console.error("Error fetching user information:", error);
    });
}

// FUNCTION TO UPDATE THE USER'S PHOTO IN THE NAVIGATION BAR
function updatePhotoInNavbar(userPhoto) {
  // Update the user's photo in the navigation bar
  const userImageElement = document.getElementById("user-image");
  if (userImageElement) {
    const photoUrl = userPhoto
      ? `http://127.0.0.1:8000/storage/user_profiles/${userPhoto}`
      : "../images/no_image.jpg";

    // Set the src attribute based on whether the user has a photo or not
    userImageElement.src = photoUrl;

    // Set the width and height of the image
    userImageElement.style.width = "30px";
    userImageElement.style.height = "30px";
    userImageElement.style.borderRadius = "50%";
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
