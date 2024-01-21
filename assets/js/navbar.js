/////////////////////////// FUNCTION TO DISPLAY SELECTED IMAGE IN THE PREVIEW ///////////////////////////
function displaySelectedImage(files) {
  if (files.length > 0) {
    const selectedFile = files[0];

    const imagePreview = document.getElementById("imagePreview");
    const imagePreviewContainer = document.getElementById(
      "imagePreviewContainer"
    );

    // Display the selected image in the preview container
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreviewContainer.style.display = "block";
    };
    reader.readAsDataURL(selectedFile);
  }
}
// Add an event listener to the file input to trigger the preview
document
  .getElementById("photoFile")
  .addEventListener("change", function (event) {
    displaySelectedImage(event.target.files);
  });

// FUNCTION TO HANDLE FILE SELECTION
function handleFileSelect(event) {
  event.preventDefault();

  // Display the selected image in the preview container
  const fileInput = document.getElementById("photoFile");
  const files = fileInput.files;

  if (files.length === 0) {
    // Display an error toast if no file is selected
    toastr.error("Please select a file to upload");
    return;
  }

  displaySelectedImage(files);

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
    const userId = decodedToken.sub;

    const formData = new FormData();
    formData.append("user_profile", selectedFile);

    // Use userId to construct the update URL
    const updateUrl = `${apiBaseUrl}/users/update/${userId}`;

    // Show spinner and disable the upload button during the upload
    const uploadButton = $("#uploadButton");
    const uploadSpinner = $("#uploadSpinner");
    uploadButton
      .prop("disabled", true)
      .html('<i class="fa fa-spinner fa-spin"></i> Uploading...');
    uploadSpinner.removeClass("d-none");

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

        // Close the upload photo modal
        $("#uploadPhotoModal").modal("hide");

        // Update the user information in the navbar and profile modal after a successful upload
        fetchUserInfoAndUpdateNavbar();

        // Destroy the existing DataTable instance
        const usersTable = $("#usersTable").DataTable({
          bDestroy: true,
        });

        // Clear the existing table
        usersTable.clear().draw();

        // Fetch and update table data for the user using DataTables with bDestroy: true
        populateUsersTable();

        // Enable the upload button and revert the text
        uploadButton.prop("disabled", false).html("Upload");
        uploadSpinner.addClass("d-none");

        toastr.success("Photo uploaded successfully");
      })
      .catch((error) => {
        console.error("Error uploading photo:", error);

        // Enable the upload button and revert the text
        uploadButton.prop("disabled", false).html("Upload");
        uploadSpinner.addClass("d-none");
      });
  }
}
// LISTEN FOR THE MODAL HIDDEN EVENT TO RESET THE FORM AND CLEAR THE PREVIEW
$("#uploadPhotoModal").on("hidden.bs.modal", function () {
  // Clear the file input and reset the form
  $("#photoFile").val("");
  $("#uploadPhotoForm")[0].reset();

  // Clear the image preview
  const imagePreview = document.getElementById("imagePreview");
  const imagePreviewContainer = document.getElementById(
    "imagePreviewContainer"
  );
  imagePreview.src = "";
  imagePreviewContainer.style.display = "none";
});

///////////////// FUNCTION TO DISPLAY SELECTED STAMP IMAGE IN THE PREVIEW /////////////////////////
function displaySelectedStamp(files) {
  if (files.length > 0) {
    const selectedFile = files[0];

    const stampPreview = document.getElementById("stampPreview");
    const stampPreviewContainer = document.getElementById(
      "stampPreviewContainer"
    );

    // Display the selected stamp image in the preview container
    const reader = new FileReader();
    reader.onload = function (e) {
      stampPreview.src = e.target.result;
      stampPreviewContainer.style.display = "block";
    };
    reader.readAsDataURL(selectedFile);
  }
}

// Add an event listener to the stamp file input to trigger the preview
document
  .getElementById("stampFile")
  .addEventListener("change", function (event) {
    displaySelectedStamp(event.target.files);
  });

// FUNCTION TO HANDLE STAMP FILE SELECTION AND UPLOAD
function handleStampFileSelect(event) {
  event.preventDefault();

  // Display the selected stamp image in the preview container
  const stampFileInput = document.getElementById("stampFile");
  const files = stampFileInput.files;

  if (files.length === 0) {
    // Display an error toast if no stamp image is selected
    toastr.error("Please select a stamp image to upload");
    return;
  }

  displaySelectedStamp(files);

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
  const userId = decodedToken.sub;

  const formData = new FormData();
  formData.append("user_stamp", selectedFile);

  // Use userId to construct the update URL
  const updateUrl = `${apiBaseUrl}/users/update/${userId}`;

  // Show spinner and disable the upload button during the upload
  const uploadStampButton = $("#uploadStampButton");
  const stampUploadSpinner = $("#stampUploadSpinner");
  uploadStampButton
    .prop("disabled", true)
    .html('<i class="fa fa-spinner fa-spin"></i> Uploading...');
  stampUploadSpinner.removeClass("d-none");

  // Use the Fetch API to send a POST request to the update endpoint with the FormData containing the stamp image
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

      // Close the upload stamp modal
      $("#uploadStampModal").modal("hide");

      // Destroy the existing DataTable instance
      const usersTable = $("#usersTable").DataTable({
        bDestroy: true,
      });

      // Clear the existing table
      usersTable.clear().draw();

      // Fetch and update table data for the user using DataTables with bDestroy: true
      populateUsersTable();

      // Enable the upload button and revert the text
      uploadStampButton.prop("disabled", false).html("Upload");
      stampUploadSpinner.addClass("d-none");

      toastr.success("Stamp image uploaded successfully");
    })
    .catch((error) => {
      console.error("Error uploading stamp image:", error);

      // Enable the upload button and revert the text
      uploadStampButton.prop("disabled", false).html("Upload");
      stampUploadSpinner.addClass("d-none");
    });
}
// LISTEN FOR THE STAMP MODAL HIDDEN EVENT TO RESET THE FORM AND CLEAR THE PREVIEW
$("#uploadStampModal").on("hidden.bs.modal", function () {
  // Clear the stamp file input and reset the form
  $("#stampFile").val("");
  $("#uploadStampForm")[0].reset();

  // Clear the stamp image preview
  const stampPreview = document.getElementById("stampPreview");
  const stampPreviewContainer = document.getElementById(
    "stampPreviewContainer"
  );
  stampPreview.src = "";
  stampPreviewContainer.style.display = "none";
});

/////////////////////// FUNCTION TO DISPLAY SELECTED SIGNATURE IMAGE IN THE PREVIEW /////////////////////
function displaySelectedSignature(files) {
  if (files.length > 0) {
    const selectedFile = files[0];

    const signaturePreview = document.getElementById("signaturePreview");
    const signaturePreviewContainer = document.getElementById(
      "signaturePreviewContainer"
    );

    // Display the selected signature image in the preview container
    const reader = new FileReader();
    reader.onload = function (e) {
      signaturePreview.src = e.target.result;
      signaturePreviewContainer.style.display = "block";
    };
    reader.readAsDataURL(selectedFile);
  }
}

// Add an event listener to the signature file input to trigger the preview
document
  .getElementById("signatureFile")
  .addEventListener("change", function (event) {
    displaySelectedSignature(event.target.files);
  });

// FUNCTION TO HANDLE SIGNATURE FILE SELECTION AND UPLOAD
function handleSignatureFileSelect(event) {
  event.preventDefault();

  // Display the selected signature image in the preview container
  const signatureFileInput = document.getElementById("signatureFile");
  const files = signatureFileInput.files;

  if (files.length === 0) {
    // Display an error toast if no signature image is selected
    toastr.error("Please select a signature image to upload");
    return;
  }

  displaySelectedSignature(files);

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
  const userId = decodedToken.sub;

  const formData = new FormData();
  formData.append("user_signature", selectedFile);

  // Use userId to construct the update URL
  const updateUrl = `${apiBaseUrl}/users/update/${userId}`;

  // Show spinner and disable the upload button during the upload
  const uploadSignatureButton = $("#uploadSignatureButton");
  const signatureUploadSpinner = $("#signatureUploadSpinner");
  uploadSignatureButton
    .prop("disabled", true)
    .html('<i class="fa fa-spinner fa-spin"></i> Uploading...');
  signatureUploadSpinner.removeClass("d-none");

  // Use the Fetch API to send a POST request to the update endpoint with the FormData containing the signature image
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

      // Close the upload signature modal
      $("#uploadSignatureModal").modal("hide");

      // Destroy the existing DataTable instance
      const usersTable = $("#usersTable").DataTable({
        bDestroy: true,
      });

      // Clear the existing table
      usersTable.clear().draw();

      // Fetch and update table data for the user using DataTables with bDestroy: true
      populateUsersTable();

      // Enable the upload button and revert the text
      uploadSignatureButton.prop("disabled", false).html("Upload");
      signatureUploadSpinner.addClass("d-none");

      toastr.success("Signature image uploaded successfully");
    })
    .catch((error) => {
      console.error("Error uploading signature image:", error);

      // Enable the upload button and revert the text
      uploadSignatureButton.prop("disabled", false).html("Upload");
      signatureUploadSpinner.addClass("d-none");
    });
}

// LISTEN FOR THE SIGNATURE MODAL HIDDEN EVENT TO RESET THE FORM AND CLEAR THE PREVIEW
$("#uploadSignatureModal").on("hidden.bs.modal", function () {
  // Clear the signature file input and reset the form
  $("#signatureFile").val("");
  $("#uploadSignatureForm")[0].reset();

  // Clear the signature image preview
  const signaturePreview = document.getElementById("signaturePreview");
  const signaturePreviewContainer = document.getElementById(
    "signaturePreviewContainer"
  );
  signaturePreview.src = "";
  signaturePreviewContainer.style.display = "none";
});

/////////////////// FUNCTION TO FETCH USER INFORMATION BASED ON THE LOGGED-IN USER'S ID /////////////////////////
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
  const userId = decodedToken.sub;

  // Make a GET request to fetch user information based on the user's ID
  fetch(`${apiBaseUrl}/user/show/${userId}`, {
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
