
    //************************** GLOBAL FUNCTIONS*********************************//


// FUNCTION TO UPDATE THE TABLE ROW NUMBERS DYNAMICALLY
function updateRowNumbers() {
    // Update the rows in the "groupsTab" table
    const tabRows = document.querySelectorAll('#tab tbody tr');
    tabRows.forEach((row, index) => {
        // Update the first cell (index 0) in each row with the new row number
        row.cells[0].textContent = index + 1;
    });

    // Update the rows in the "groupMembershipsTab" table
    const groupMembershipsRows = document.querySelectorAll('#groupMembershipsTab tbody tr');
    groupMembershipsRows.forEach((row, index) => {
        // Update the first cell (index 0) in each row with the new row number
        row.cells[0].textContent = index + 1;
    });
}
 
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

     // Trigger display of "Permissions" table on page load
    if (lastSelectedTab === '5') {
        $('#groupPermissionsTableContainer').show();
    }
 
  });



        //**************************** NAVBAR FUNCTIONS*************************//


// FUNCTION TO FETCH USER INFORMATION BASED ON THE LOGGED-IN USER'S ID
function fetchUserInfoAndUpdateNavbar() {
    // Retrieve the Bearer token from localStorage
    const bearerToken = localStorage.getItem('edms_token');

    // Check if the token is present in localStorage
    if (!bearerToken) {
        console.error('Unauthorized');
        return;
    }

    // Decode the JWT to extract the user ID
    const decodedToken = parseJwt(bearerToken);
    const userId = decodedToken.sub; // Assuming 'sub' contains the user ID
 
    // Make a GET request to fetch user information based on the user's ID
    fetch(`http://127.0.0.1:8000/api/user/show/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        // Update the user's name in the navigation bar
        updateUserNameInNavbar(data.data.data.name);

         // Update the profile modal
         updateProfileModal(data.data.data);
 
        // Call populateDropdowns once user information is retrieved
        populateDropdowns();
    })
    .catch(error => {
        console.error('Error fetching user information:', error);
    });
}

// FUNCTION TO UPDATE THE USER'S NAME IN THE NAVIGATION BAR
function updateUserNameInNavbar(userName) {
    // Update the user's name in the navigation bar
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.innerText = userName;
    }
}

// FUNCTION TO UPDATE THE PROFILE MODAL
function updateProfileModal(userData) {
  const profileUsernameElement = document.getElementById('profile-username');
  const profileNameElement = document.getElementById('profile-name');
  const profileModalTitleElement = document.getElementById('profileModalLabel');

  if (profileUsernameElement && profileNameElement) {
    profileUsernameElement.innerText = userData.username;
 
    profileNameElement.innerText = userData.name;
  }

    // Update the modal title to include the name
    profileModalTitleElement.innerText = `${userData.name} Profile`;
}

// Function to parse a JWT
function parseJwt(token) {
    const base64Url = token.split('.')[1];
     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
     const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  
    return JSON.parse(jsonPayload);
}

// Call fetchUserInfoAndUpdateNavbar before the document is ready
fetchUserInfoAndUpdateNavbar();

// Call populateDropdowns when the document is ready
populateDropdowns();

 
///////// FUNCTION TO POPULATE THE USERS TABLE WITH FETCHED USER DATA //////////
 async function populateUsersTable(page = 1, itemsPerPage = 5) {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem('edms_token');

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error('Unauthorized');
    return;
  }

  // Fetch users with pagination parameters
  const records = await fetch(`http://127.0.0.1:8000/api/users?page=${page}&itemsPerPage=${itemsPerPage}`, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await records.json();

  const tableBody = $('#usersTbody');
  tableBody.empty();

  // Loop through each user and create a table row
  data.data.data.forEach((user, index) => {
    // Check if the user has a photo
    const photoUrl = user.photo ? user.photo : '../images/no_image.jpg';

    // Check the status and set the corresponding label and color
    const statusLabel = user.status === 'active' ? 'Active' : 'InActive';
    const statusColor = user.status === 'active' ? 'green' : 'red';

    const row = `<tr>
                    <td>${index + 1}</td>
                    <td>${user.username}</td>
                    <td>${user.name}</td>
                    <td><img src="${photoUrl}" alt="User Photo" class="user-photo" style="width: 60px; height: 60px; border-radius: 50%;"  /></td>
                    <td>stamp</td>
                    <td>signature</td>
                    <td style="color: ${statusColor};">${statusLabel}</td>
                    <td>
                      <a href="#" onclick="performUserAction('${user.username}', 'activate')" style="margin-left: 20px;"><i class="fa fa-check" title="Activate" style="color: green; font-size: 24px;"></i></a>
                      <a href="#" onclick="performUserAction('${user.username}', 'deactivate')" style="margin-left: 40px;"><i class="fa fa-ban" title="Deactivate" style="color: red; font-size: 24px; "></i></a>
                    </td>
                  </tr>`;

    tableBody.append(row);
  });

  // Generate pagination links
  const totalPages = Math.ceil(data.data.total / itemsPerPage);
  const paginationElement = $('#usersPagination');
  paginationElement.empty();

  if (totalPages > 1) {
    const prevLink = `<a href="#" onclick="populateUsersTable(${page - 1}, ${itemsPerPage})" class="page-link">«</a>`;
    paginationElement.append(prevLink);

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = `<a href="#" onclick="populateUsersTable(${i}, ${itemsPerPage})" class="page-link ${i === page ? 'active' : ''}">${i}</a>`;
      paginationElement.append(pageLink);
    }

    const nextLink = `<a href="#" onclick="populateUsersTable(${page + 1}, ${itemsPerPage})" class="page-link">»</a>`;
    paginationElement.append(nextLink);
  }
}


// ******************************* GROUPS FUNCTIONS **************************** //
// FUNCTION TO CALL AND DISPLAY GROUP DATA WITH PAGINATION
async function getData(page = 1, itemsPerPage = 5) {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem('edms_token');

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error('Unauthorized');
    return;
  }

  // Fetch groups data from the API
  const records = await fetch('http://127.0.0.1:8000/api/groups', {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    }
  });

  // Parse the JSON response
  const data = await records.json();

  console.log(data);

  // Get the table body element
  const tableBody = document.getElementById('tbody');
  tableBody.innerHTML = '';

  // Calculate start and end indices based on pagination
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, data.data.data.length - 1);

  // Get the data for the current page
  const currentPageData = data.data.data.slice(startIndex, endIndex + 1);

  // Populate the table with data for the current page
  currentPageData.forEach(group => {
    const row = document.createElement('tr');
    const statusLabel = group.status === 'active' ? 'Active' : 'InActive';
    const statusColor = group.status === 'active' ? 'green' : 'red';

    // Populate table cells with group information
    row.innerHTML += `<td>${group.id}</td>`;
    row.innerHTML += `<td>${group.group_name}</td>`;
    row.innerHTML += `<td>${group.admin.name}</td>`;
    const users = group.users.length;
    row.innerHTML += `<td>${users}</td>`;
    row.innerHTML += `<td style="color: ${statusColor};">${statusLabel}</td>`;

    // Add action buttons based on group ID
    if (group.id === 1 || group.id === 2) {
      row.innerHTML += `<td style="font-size:21px; ">
            <center>
                <a href="#" data-toggle="modal" data-target="#editForm" onclick="editGroup(${group.id})" data-groupid="${group.id}" title="edit"><i class="fa fa-edit"></i></a> &nbsp;
                <i class="fa fa-trash" style="color: lightgrey; cursor: not-allowed;" title="Cannot delete this group" aria-disabled="true"></i>
            </center>
        </td>`;
    } else {
      row.innerHTML += `<td style="font-size:21px; ">
            <center>
                <a href="#" data-toggle="modal" data-target="#editForm" onclick="editGroup(${group.id})" data-groupid="${group.id}" title="edit"><i class="fa fa-edit"></i></a> &nbsp;
                <a href="#" data-toggle="modal" data-target="#confirmDeleteModal" onclick="prepareToDeleteGroup(${group.id})" title="delete"><i class="fa fa-trash"></i></a>
            </center>
        </td>`;
    }

    // Append the row to the table body
    tableBody.appendChild(row);
  });

  // Call updateRowNumbers after appending rows to the table body
  updateRowNumbers();

  // Generate pagination links
  const totalPages = Math.ceil(data.data.data.length / itemsPerPage);
  const paginationElement = document.getElementById('pagination');
  paginationElement.innerHTML = '';

  // Add previous page link
  if (totalPages > 1) {
    const prevLink = document.createElement('a');
    prevLink.href = '#';
    prevLink.innerHTML = '«'; // Previous page symbol
    prevLink.classList.add('page-link');
    prevLink.addEventListener('click', () => {
      if (page > 1) {
        getData(page - 1, itemsPerPage);
      }
    });
    paginationElement.appendChild(prevLink);

    // Add page links
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('a');
      pageLink.href = '#';
      pageLink.textContent = i;
      pageLink.classList.add('page-link');
      if (i === page) {
        pageLink.classList.add('active');
      }
      pageLink.addEventListener('click', () => getData(i, itemsPerPage));
      paginationElement.appendChild(pageLink);
    }

    // Add next page link
    const nextLink = document.createElement('a');
    nextLink.href = '#';
    nextLink.innerHTML = '»'; // Next page symbol
    nextLink.classList.add('page-link');
    nextLink.addEventListener('click', () => {
      if (page < totalPages) {
        getData(page + 1, itemsPerPage);
      }
    });
    paginationElement.appendChild(nextLink);
  }
}

 

// FUNCTION TO HANDLE FORM SUBMISSION AND CREATE A NEW GROUP
function createGroup() {
  // Fetch form data
  const groupName = $('#group_name').val();
  const adminId = $('#admin_id').val();

   // Validate form fields
   if (!groupName || !adminId) {
    toastr.error('Please fill out all fields.');
    return;
  }

  // Disable the submit button and show loading text
  const submitButton = $('#submitBtn');
  submitButton.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Loading...');

  // Construct the request payload
  const requestData = {
    group_name: groupName,
    group_admin_id: adminId,
  };

  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem('edms_token');

 
  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error('Unauthorized');
    return;
  }

  // Make a POST request to create a new group
  fetch('http://127.0.0.1:8000/api/groups/store', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
  .then(response => response.json())
  .then(data => {
   

    //close the modal after successful submission
    $('#form').modal('hide');

    // Clear the add group form
    $('#createForm')[0].reset();

    //refresh the data by calling the getData() function
    getData();

    // Update the dropdowns after deleting the group
    populateDropdowns();

    // Enable the submit button and revert the text
    submitButton.prop('disabled', false).html('Submit');

    toastr.success('Group created successfully');
  })
  .catch(error => {
    console.error('Error:', error);

    // Enable the submit button and revert the text
    submitButton.prop('disabled', false).html('Submit');
  });
}

//FUNCTION TO SHOW EDIT MODAL BASED ON GROUP ID

// Store the original values when the edit modal is opened
let originalGroupName, originalGroupAdminId;

function editGroup(groupId) {
  
    // Retrieve the Bearer token from localStorage
    const bearerToken = localStorage.getItem('edms_token');
      // Fetch group data based on the group ID
      fetch(`http://127.0.0.1:8000/api/group/show/${groupId}`, {
          headers: {
              'Authorization': `Bearer ${bearerToken}`,
              'Content-Type': 'application/json',
          },
      })
      .then(response => response.json())
      .then(data => {

        // Store the original values
        originalGroupName = data.data.data.group_name;
        originalGroupAdminId = data.data.data.group_admin_id;


          // Populate the edit form fields
          $('#edit_group_id').val(data.data.data.id);
          $('#edit_group_admin_id').val(data.data.data.group_admin_id);        
          $('#edit_group_name').val(data.data.data.group_name);
  
     
          // Show the modal for editing
          $('#editForm').modal('show');
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }   

// FUNCTION TO SUBMIT THE EDIT FORM
function submitEditForm() {
    // Fetch form data
    const groupId = $('#edit_group_admin_id').val();
    const groupName = $('#edit_group_name').val();
    const group_id = $('#edit_group_id').val();

    console.log('Original Group Name:', originalGroupName);
    console.log('Current Group Name:', groupName);
   
 
     // Check if values have changed
     if (groupName === originalGroupName) {
      toastr.warning('No changes detected.');
      return;
  }

    // Disable the submit button and show loading text
    const submitButton = $('#editSubmitBtn');
    submitButton.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Updating...');

    // Construct the request payload
    const requestData = {
        group_name: groupName,
        group_admin_id: groupId,
     };

    // Retrieve the Bearer token from localStorage
    const bearerToken = localStorage.getItem('edms_token');

    // Check if the token is present in localStorage
    if (!bearerToken) {
      toastr.error('Unauthorized.');
        return;
    }

    // Make a POST request to update the group
    fetch(`http://127.0.0.1:8000/api/groups/update/${group_id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
 
        //close the modal after successful submission
        $('#editForm').modal('hide');
 
        //refresh the data by calling the getData() function
        getData();
        getGroupMembershipsData()

        // Update the dropdowns after editing the group
        populateDropdowns();

        // Enable the submit button and revert the text
        submitButton.prop('disabled', false).html('Submit');

      toastr.success('Group updated successfully');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


// FUNCTION TO PREPARE FOR GROUP DELETION BY SETTING THE GROUP ID TO BE DELETED
function prepareToDeleteGroup(groupId) {
    // Set the group ID to the global variable
    groupToDeleteId = groupId;
  }

// FUNCTION TO HANDLE GROUP DELETION
function deleteGroup() {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem('edms_token');

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error('Unauthorized');
    return;
  }

  // Disable the delete button and show loading text
  const deleteButton = $('#deleteGroupBtn');
  deleteButton.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Deleting...');

  // Make a DELETE request to delete the group
  fetch(`http://127.0.0.1:8000/api/groups/delete/${groupToDeleteId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      // Check the response and handle accordingly
      if (data.success) {
       // Clear the add group form
       $('#createForm')[0].reset();

         // Refresh the data by calling the getData() function
        getData();

        getGroupMembershipsData()

        // Update the dropdowns after deleting the group
        populateDropdowns();

        toastr.success('Group deleted successfully');
      } else {
        console.error('Failed to delete group:', data.message);
      }
    }).finally(() => {
         // Enable the delete button and revert the text
      deleteButton.prop('disabled', false).html('Delete');

      // Hide the confirmation modal
      $('#confirmDeleteModal').modal('hide');
    });
}



// ****************************GROUP MEMBERSHIPS FUNCTIONS************************ //

// FUNCTION TO FETCH AND DISPLAY GROUP MEMBERSHIPS DATA WITH PAGINATION
async function getGroupMembershipsData(page = 1, itemsPerPage = 5) {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem('edms_token');

  // Fetch group memberships
  const membershipsResponse = await fetch('http://127.0.0.1:8000/api/groupmemberships', {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    }
  });

  const membershipsData = await membershipsResponse.json();

  // Get the table body element
  const membershipsTableBody = document.getElementById('groupMembershipsTbody');
  // Clear the existing table rows
  membershipsTableBody.innerHTML = '';

  // Function to fetch user data based on user_id
  const fetchUserData = async (userId) => {
    const userResponse = await fetch(`http://127.0.0.1:8000/api/user/show/${userId}`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });
    const userData = await userResponse.json();
    return userData.data.data.username;
  };

  // Function to fetch group data based on group_id
  const fetchGroupData = async (groupId) => {
    const groupResponse = await fetch(`http://127.0.0.1:8000/api/group/show/${groupId}`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });
    const groupData = await groupResponse.json();
    return groupData.data.data.group_name;
  };

  // Calculate start and end indices based on pagination
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, membershipsData.data.data.length - 1);

  const currentPageData = membershipsData.data.data.slice(startIndex, endIndex + 1);

  // Iterate through the data and append rows to the table
  for (const membership of currentPageData) {
    const row = document.createElement('tr');

    // Group information
    row.innerHTML += `<td>${membership.id}</td>`;

    // Fetch user data based on user_id
    const username = await fetchUserData(membership.user_id);
    // Fetch group data based on group_id
    const groupName = await fetchGroupData(membership.group_id);

    row.innerHTML += `<td>${username}</td>`;
    row.innerHTML += `<td>${groupName}</td>`;

    row.innerHTML += `<td style="font-size:21px; ">
      <center>
         <a href="#" onclick="confirmDeleteGroupMembership(${membership.id})" title="delete"> <i class="fa fa-trash"></i></a>
      </center>
    </td>`;

    membershipsTableBody.appendChild(row);
  }

  // Call updateRowNumbers after appending rows to the table body
  updateRowNumbers();

  // Generate pagination links
  const totalPages = Math.ceil(membershipsData.data.data.length / itemsPerPage);
  const paginationElement = document.getElementById('membershipsPagination');
  paginationElement.innerHTML = '';

  if (totalPages > 1) {
    const prevLink = document.createElement('a');
    prevLink.href = '#';
    prevLink.innerHTML = '«';
    prevLink.classList.add('page-link');
    prevLink.addEventListener('click', () => {
      if (page > 1) {
        getGroupMembershipsData(page - 1, itemsPerPage);
      }
    });
    paginationElement.appendChild(prevLink);

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('a');
      pageLink.href = '#';
      pageLink.textContent = i;
      pageLink.classList.add('page-link');
      if (i === page) {
        pageLink.classList.add('active');
      }
      pageLink.addEventListener('click', () => getGroupMembershipsData(i, itemsPerPage));
      paginationElement.appendChild(pageLink);
    }

    const nextLink = document.createElement('a');
    nextLink.href = '#';
    nextLink.innerHTML = '»';
    nextLink.classList.add('page-link');
    nextLink.addEventListener('click', () => {
      if (page < totalPages) {
        getGroupMembershipsData(page + 1, itemsPerPage);
      }
    });
    paginationElement.appendChild(nextLink);
  }
}




// FUNCTION TO HANDLE THE CLICK EVENT OF THE DELETE BUTTON IN EACH ROW
function confirmDeleteGroupMembership(membershipId) {

  // Set the membership ID in the hidden input field of the confirmation modal
 document.getElementById('deleteMembershipId').value = membershipId;

   // Show the confirmation modal
   $('#confirmDeleteMmebershipModal').modal('show');
 }

  // Add this function to handle the click event of the delete button in the confirmation modal
  async function deleteGroupMembership() {

    // Retrieve the membership ID from the hidden input field
 const membershipId = document.getElementById('deleteMembershipId').value;

 try {

        // Disable the delete button
        const deleteButton = $('#deleteGroupMembershipBtn');
        deleteButton.prop('disabled', true);
      
      // Retrieve the Bearer token from localStorage
      const bearerToken = localStorage.getItem('edms_token');

       // Perform the API call to delete the group membership
    const apiUrl = `http://127.0.0.1:8000/api/groupmemberships/delete/${membershipId}`;

   const response = await fetch(apiUrl, {
     method: 'GET',
     headers: {
       'Authorization': `Bearer ${bearerToken}`,
       'Content-Type': 'application/json'
     },
   });

   const data = await response.json();

   // Handle the response, update the UI, or show a success message
   console.log('Group membership deleted successfully:', data);

   // Close the confirmation modal
   $('#confirmDeleteMmebershipModal').modal('hide');

   toastr.success('Group Membership Deleted Successfully');

   // Refresh the table or update the UI as needed
   getGroupMembershipsData();

    // Refresh the data by calling the getData() function
    getData();
   
 } catch (error) {
   console.error('Error deleting group membership:', error);

    // Close the confirmation modal
   $('#confirmDeleteMmebershipModal').modal('hide');
   
 }
}


//FUNCTION TO FETCH AND POPULATE DROPDOWNS WITH EXISTING GROUPS AND USERS

async function populateDropdowns() {
    // Retrieve the Bearer token from localStorage
    const bearerToken = localStorage.getItem('edms_token');
   
      // Fetch existing groups
      const groupsResponse = await fetch('http://127.0.0.1:8000/api/groups', {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        }
      });
  
      const groupsData = await groupsResponse.json();
       
      const assignGroupDropdown = $('#assign_group');
      assignGroupDropdown.empty();

      // Add default "Select" option
      assignGroupDropdown.append('<option value="" disabled selected>Select Group</option>');

      groupsData.data.data.forEach(group => {
        assignGroupDropdown.append(`<option value="${group.id}">${group.group_name}</option>`);
      });
  
      // Fetch existing users
      const usersResponse = await fetch('http://127.0.0.1:8000/api/users', {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        }
      });
  
      const usersData = await usersResponse.json();
      const assignUsersDropdown = $('#assign_users');
  
          // Fetch the selected group
      const selectedGroupId = assignGroupDropdown.val();
      
      // Get users in the selected group
      const selectedGroup = groupsData.data.data.find(group => group.id == selectedGroupId);
      const usersInGroup = selectedGroup ? selectedGroup.users.map(user => user.id) : [];
  
      assignUsersDropdown.empty();

      // Add default "Select" option
      assignUsersDropdown.append('<option value="" disabled selected>Select User</option>');

      usersData.data.data.forEach(user => {
        assignUsersDropdown.append(`<option value="${user.id}">${user.username}</option>`);
      });
  }
  
  // Call populateDropdowns when the document is ready
  $(document).ready(function() {
    populateDropdowns();
  });
  
  
// FUNCTION TO HANDLE FORM SUBMISSION AND ASSIGN USERS TO A GROUP
function assignUsersToGroup() {
    // Fetch form data
    const groupId = $('#assign_group').val();
    const userIds = $('#assign_users').val();

        // Check if both group and user options are selected
    if (!groupId || !userIds || userIds.length === 0) {
        toastr.error('Please select both a group and at least one user.');
        return;
    }

     // Disable the submit button and show loading text
  const submitButton = $('#assignUsersBtn');
  submitButton.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Assigning...');

  
    // Construct the request payload
    const requestData = {
      group_id: groupId,
      user_id: userIds,
    };

    // Retrieve the Bearer token from localStorage
    const bearerToken = localStorage.getItem('edms_token');
  
    // Make a POST request to assign group to a group permissions
    fetch('http://127.0.0.1:8000/api/groupmemberships/store', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
   
      // Close the modal after successful submission
      $('#assignUsersModal').modal('hide');
      $('#assignUsersForm')[0].reset();
  
      toastr.success('User Assigned to Group successfully');
  
      // Refresh the data by calling the getData() function
      getData();
  
      getGroupMembershipsData()
    })
    .catch(error => {
      console.error('Error:', error);
    })
    .finally(() => {
        // Enable the submit button and revert the text
        submitButton.prop('disabled', false).html('Assign Users');
      });
  }




  //********** ASYNC FUNCTION FOR GROUP PERMISSIONS *******************//
  async function fetchData() {

     // Retrieve the Bearer token from localStorage
     const bearerToken = localStorage.getItem('edms_token');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/grouppermissions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();
 
      // Call the function to populate the table with the fetched data
      populateTable(responseData.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
 

  // FUNCTION TO POPULATE THE  GROUP PERMISSION TABLE WITH DATA
  async function populateTable(permissionsData) {
    const permissionsTbody = document.getElementById('permissionsTbody');

    await Promise.all(permissionsData.map(async (permission, index) => {
    const newRow = permissionsTbody.insertRow();

    newRow.insertCell(0).textContent = index + 1;
    newRow.insertCell(1).textContent = permission.group.group_name; 
    newRow.insertCell(2).textContent = await getFolderName(permission.folder_id);
    newRow.insertCell(3).innerHTML = `<input type="checkbox" ${permission.view_users ? 'checked' : ''} disabled>`;
    newRow.insertCell(4).innerHTML = `<input type="checkbox" ${permission.add_user ? 'checked' : ''} disabled>`;
    newRow.insertCell(5).innerHTML = `<input type="checkbox" ${permission.assign_user_group ? 'checked' : ''} disabled>`;
    newRow.insertCell(6).innerHTML = `<input type="checkbox" ${permission.view_user ? 'checked' : ''} disabled>`;
    newRow.insertCell(7).innerHTML = `<input type="checkbox" ${permission.update_user ? 'checked' : ''} disabled>`;
    newRow.insertCell(8).innerHTML = `<input type="checkbox" ${permission.delete_user ? 'checked' : ''} disabled>`;
    newRow.insertCell(9).innerHTML = `<input type="checkbox" ${permission.view_groups ? 'checked' : ''} disabled>`;
    newRow.insertCell(10).innerHTML = `<input type="checkbox" ${permission.add_group ? 'checked' : ''} disabled>`;
    newRow.insertCell(11).innerHTML = `<input type="checkbox" ${permission.view_group ? 'checked' : ''} disabled>`;
    newRow.insertCell(12).innerHTML = `<input type="checkbox" ${permission.update_group ? 'checked' : ''} disabled>`;
    newRow.insertCell(13).innerHTML = `<input type="checkbox" ${permission.delete_group ? 'checked' : ''} disabled>`;
    newRow.insertCell(14).innerHTML = `<input type="checkbox" ${permission.view_group_memberships ? 'checked' : ''} disabled>`;
    newRow.insertCell(15).innerHTML = `<input type="checkbox" ${permission.add_group_membership ? 'checked' : ''} disabled>`;
    newRow.insertCell(16).innerHTML = `<input type="checkbox" ${permission.view_group_membership ? 'checked' : ''} disabled>`;
    newRow.insertCell(17).innerHTML = `<input type="checkbox" ${permission.update_group_membership ? 'checked' : ''} disabled>`;
    newRow.insertCell(18).innerHTML = `<input type="checkbox" ${permission.delete_group_membership ? 'checked' : ''} disabled>`;
    newRow.insertCell(19).innerHTML = `<input type="checkbox" ${permission.view_group_permissions ? 'checked' : ''} disabled>`;
    newRow.insertCell(20).innerHTML = `<input type="checkbox" ${permission.add_group_permission ? 'checked' : ''} disabled>`;
    newRow.insertCell(21).innerHTML = `<input type="checkbox" ${permission.view_group_permission ? 'checked' : ''} disabled>`;
    newRow.insertCell(22).innerHTML = `<input type="checkbox" ${permission.update_group_permission ? 'checked' : ''} disabled>`;
    newRow.insertCell(23).innerHTML = `<input type="checkbox" ${permission.delete_group_permission ? 'checked' : ''} disabled>`;
    newRow.insertCell(24).innerHTML = `<input type="checkbox" ${permission.view_folders ? 'checked' : ''} disabled>`;
    newRow.insertCell(25).innerHTML = `<input type="checkbox" ${permission.create_folder ? 'checked' : ''} disabled>`;
    newRow.insertCell(26).innerHTML = `<input type="checkbox" ${permission.open_folder ? 'checked' : ''} disabled>`;
    newRow.insertCell(27).innerHTML = `<input type="checkbox" ${permission.update_folder ? 'checked' : ''} disabled>`;
    newRow.insertCell(28).innerHTML = `<input type="checkbox" ${permission.delete_folder ? 'checked' : ''} disabled>`;
    newRow.insertCell(29).innerHTML = `<input type="checkbox" ${permission.view_documents ? 'checked' : ''} disabled>`;
    newRow.insertCell(30).innerHTML = `<input type="checkbox" ${permission.add_document ? 'checked' : ''} disabled>`;
    newRow.insertCell(31).innerHTML = `<input type="checkbox" ${permission.view_document ? 'checked' : ''} disabled>`;
    newRow.insertCell(32).innerHTML = `<input type="checkbox" ${permission.update_document ? 'checked' : ''} disabled>`;
    newRow.insertCell(33).innerHTML = `<input type="checkbox" ${permission.delete_document ? 'checked' : ''} disabled>`;
    newRow.insertCell(34).innerHTML = `<input type="checkbox" ${permission.view_fields ? 'checked' : ''} disabled>`;
    newRow.insertCell(35).innerHTML = `<input type="checkbox" ${permission.add_field ? 'checked' : ''} disabled>`;
    newRow.insertCell(36).innerHTML = `<input type="checkbox" ${permission.view_field ? 'checked' : ''} disabled>`;
    newRow.insertCell(37).innerHTML = `<input type="checkbox" ${permission.update_field ? 'checked' : ''} disabled>`;
    newRow.insertCell(38).innerHTML = `<input type="checkbox" ${permission.delete_field ? 'checked' : ''} disabled>`;
    newRow.insertCell(39).innerHTML = `<input type="checkbox" ${permission.view_docfields ? 'checked' : ''} disabled>`;
    newRow.insertCell(40).innerHTML = `<input type="checkbox" ${permission.create_docfield ? 'checked' : ''} disabled>`;
    newRow.insertCell(41).innerHTML = `<input type="checkbox" ${permission.view_docfield ? 'checked' : ''} disabled>`;
    newRow.insertCell(42).innerHTML = `<input type="checkbox" ${permission.update_docfield ? 'checked' : ''} disabled>`;
    newRow.insertCell(43).innerHTML = `<input type="checkbox" ${permission.delete_docfield ? 'checked' : ''} disabled>`;
    newRow.insertCell(44).innerHTML = `<input type="checkbox" ${permission.view_worksteps ? 'checked' : ''} disabled>`;
    newRow.insertCell(45).innerHTML = `<input type="checkbox" ${permission.add_workstep ? 'checked' : ''} disabled>`;
    newRow.insertCell(46).innerHTML = `<input type="checkbox" ${permission.view_workstep ? 'checked' : ''} disabled>`;
    newRow.insertCell(47).innerHTML = `<input type="checkbox" ${permission.update_workstep ? 'checked' : ''} disabled>`;
    newRow.insertCell(48).innerHTML = `<input type="checkbox" ${permission.delete_workstep ? 'checked' : ''} disabled>`;
    newRow.insertCell(49).innerHTML = `<input type="checkbox" ${permission.view_possible_actions ? 'checked' : ''} disabled>`;
    newRow.insertCell(50).innerHTML = `<input type="checkbox" ${permission.add_possible_action ? 'checked' : ''} disabled>`;
    newRow.insertCell(51).innerHTML = `<input type="checkbox" ${permission.view_possible_action ? 'checked' : ''} disabled>`;
    newRow.insertCell(52).innerHTML = `<input type="checkbox" ${permission.update_possible_action ? 'checked' : ''} disabled>`;
    newRow.insertCell(53).innerHTML = `<input type="checkbox" ${permission.delete_possible_action ? 'checked' : ''} disabled>`;
    newRow.insertCell(54).innerHTML = `<input type="checkbox" ${permission.view_workstep_results ? 'checked' : ''} disabled>`;
    newRow.insertCell(55).innerHTML = `<input type="checkbox" ${permission.add_workstep_result ? 'checked' : ''} disabled>`;
    newRow.insertCell(56).innerHTML = `<input type="checkbox" ${permission.view_workstep_result ? 'checked' : ''} disabled>`;
    newRow.insertCell(57).innerHTML = `<input type="checkbox" ${permission.rewind_workstep_result ? 'checked' : ''} disabled>`;
    newRow.insertCell(58).innerHTML = `<input type="checkbox" ${permission.delete_workstep_result ? 'checked' : ''} disabled>`;

      // Add an edit button
      const editCell = newRow.insertCell();
      editCell.innerHTML = `<button type="button" onclick="editPermissions(${permission.id})">Edit</button>`;

      // Add a delete button
    const deleteCell = newRow.insertCell();
    deleteCell.innerHTML = `<button type="button" onclick="confirmDeletePermissionModal(${permission.id})">Delete</button>`;
    }));
     
    // Show the permissions table container
    $('#permissionsTableContainer').show();

    
  }
  
       
  
 // ASYNC FUNCTION TO FETCH THE FOLDER NAME BASED ON FOLDER ID
async function getFolderName(folderId) {
  const bearerToken = localStorage.getItem('edms_token');

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/folder/show/${folderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();
    

    if (response.ok) {
      const folderData = responseData.data.data;
      return folderData.name || 'Unknown Folder';
    } else {
      console.error('Error fetching folder:', responseData.message);
      return 'Unknown Folder';
    }
  } catch (error) {
    console.error('Error fetching folder:', error);
    return 'Unknown Folder';
  }
}

// Function to reset modal state
function resetModalState() {
  const folderSelect = document.getElementById('folderSelect');
  const groupSelect = document.getElementById('groupSelect');
  const checkboxContainer = document.getElementById('checkboxContainer');

  // Reset selected values in dropdowns
  folderSelect.value = '';
  groupSelect.value = '';

  // Hide checkboxes
  checkboxContainer.style.display = 'none';
}

 // FUNCTION TO POPULATE FOLDERS DYNAMICALLY
function populateFolderOptions() {
  const bearerToken = localStorage.getItem('edms_token');

  // Make AJAX requests to fetch folder data 
  $.ajax({
    url: 'http://127.0.0.1:8000/api/folders/1',
    type: 'GET',
    dataType: 'json',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
    success: function (folderData) {

      const folderSelect = document.getElementById('folderSelect');
      folderSelect.innerHTML = '';

       // Add a default option
       const defaultOption = document.createElement('option');
       defaultOption.value = '';
       defaultOption.text = 'Select Folder';
       defaultOption.disabled = true;
       defaultOption.selected = true;
       folderSelect.appendChild(defaultOption);

      // Check if there are folders in the response
      if (folderData.data.data && folderData.data.data.length > 0) {
        // Iterate over the folders and populate the dropdown
        folderData.data.data.forEach(function (folder) {
          const option = document.createElement('option');
          option.value = folder.id;
          option.text = folder.name;
          folderSelect.appendChild(option);
        });
      } else {
        // If no folders are found, you may want to handle this case
        console.error('No folders found.');
      }
    },
    error: function (error) {
      console.error('Error fetching folder data:', error);
    }
  });
}

// FUNCTION TO POPULATE GROUPS DYNAMICALLY
function populateGroupOptions() {
  const bearerToken = localStorage.getItem('edms_token');

  // Make AJAX requests to fetch group data 
  $.ajax({
      url: 'http://127.0.0.1:8000/api/groups',  
      type: 'GET',
      dataType: 'json',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      success: function (groupData) {
          const groupSelect = document.getElementById('groupSelect');
          groupSelect.innerHTML = '';

       // Add a default option
       const defaultOption = document.createElement('option');
       defaultOption.value = '';
       defaultOption.text = 'Select Group';
       defaultOption.disabled = true;
       defaultOption.selected = true;
       groupSelect.appendChild(defaultOption);

          groupData.data.data.forEach(function (group) {
              const option = document.createElement('option');
              option.value = group.id;
              option.text = group.group_name; 
              groupSelect.appendChild(option);
          });
      },
      error: function (error) {
          console.error('Error fetching group data:', error);
      }
  });

}


// FUNCTION TO POPULATE CHECKBOXES DYNAMICALLY
function populateCheckboxOptions() {
  const bearerToken = localStorage.getItem('edms_token');
  const checkboxContainer = document.getElementById('checkboxContainer');
  const folderSelect = document.getElementById('folderSelect');
  const groupSelect = document.getElementById('groupSelect');

  // Make an AJAX request to fetch permission data
  $.ajax({
    url: 'http://127.0.0.1:8000/api/grouppermissions',
    type: 'GET',
    dataType: 'json',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
    success: function (permissionData) {
      checkboxContainer.innerHTML = '';

      // Add a "Check All" checkbox
      const checkAllCheckbox = document.createElement('input');
      checkAllCheckbox.type = 'checkbox';
      checkAllCheckbox.id = 'checkbox_check_all';
      const checkAllLabel = document.createElement('label');
      checkAllLabel.htmlFor = 'checkbox_check_all';
      checkAllLabel.innerHTML = '&nbsp;Select All';
 
      const checkAllDiv = document.createElement('div');
      checkAllDiv.style.cursor = 'pointer'; // Add pointer cursor style
      checkAllDiv.appendChild(checkAllCheckbox);
      checkAllDiv.appendChild(checkAllLabel);
      checkboxContainer.appendChild(checkAllDiv);

      // Take the first permission object assuming the permissions are the same for all
      const permissions = permissionData.data.data[0];

      const heading = document.createElement('h4');
      heading.appendChild(document.createTextNode('Select Permissions:'));
      checkboxContainer.appendChild(heading);

      Object.keys(permissions).forEach(function (key) {
        // Skip certain properties like 'id', 'group', 'group_id', 'folder_id', etc.
        if (key !== 'id' && key !== 'group' && key !== 'group_id' && key !== 'folder_id' && key !== 'created_at' && key !== 'updated_at') {
          
          // Create a checkbox
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = key;
          checkbox.id = `checkbox_${key}`; // Set a unique ID for each checkbox

          // Create a label for the checkbox with a non-breaking space
          const label = document.createElement('label');
          label.htmlFor = `checkbox_${key}`;
          label.innerHTML = `&nbsp;&nbsp;${key}`;
 
          // Create a div to hold the checkbox and label
          const checkboxDiv = document.createElement('div');
          checkboxDiv.appendChild(checkbox);
          checkboxDiv.appendChild(label);

          // Append the checkbox div to the container
          checkboxContainer.appendChild(checkboxDiv);
        }
      });

      // Initially, hide the checkboxes
      checkboxContainer.style.display = 'none';

       // Add event listener for the "Check All" checkbox
       checkAllCheckbox.addEventListener('change', function () {
        const checkboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function (checkbox) {
          checkbox.checked = checkAllCheckbox.checked;
        });
      });
    },
    error: function (error) {
      console.error('Error fetching checkbox data:', error);
    }
  });
}

// Call the function to reset modal state and populate checkboxes when the modal is hidden
$('#createPermissionModal').on('hidden.bs.modal', function () {
  resetModalState();
});

// Call the function to populate folders and groups when the modal is shown
$('#createPermissionModal').on('show.bs.modal', function () {
  populateFolderOptions();
  populateGroupOptions();
  populateCheckboxOptions();
});

// Show checkboxes when both folder and group are selected
$(document).on('change', '#folderSelect, #groupSelect', function () {
  const folderSelect = document.getElementById('folderSelect');
  const groupSelect = document.getElementById('groupSelect');
  const checkboxContainer = document.getElementById('checkboxContainer');

  if (folderSelect.value && groupSelect.value) {
    checkboxContainer.style.display = 'block'; // Display checkboxes
  } else {
    checkboxContainer.style.display = 'none'; // Hide checkboxes if either folder or group is not selected
  }
});

// Call the function to populate checkboxes when the page loads
$(document).ready(function () {
  populateCheckboxOptions();
});



// FUNCTION TO HANDLE THE FORM SUBMISSION AND CREATE GROUP PERMISSIONS
function createPermission() {
  // Get the bearer token from local storage
  const bearerToken = localStorage.getItem('edms_token');

  // Get references to HTML elements
  const folderSelect = document.getElementById('folderSelect');
  const groupSelect = document.getElementById('groupSelect');
  const checkboxContainer = document.getElementById('checkboxContainer');

  // Get selected values from dropdowns
  const folderId = folderSelect.value;
  const groupId = groupSelect.value;

  // Get selected checkboxes
  const selectedCheckboxes = [];
  const checkboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]:checked');
  checkboxes.forEach(function (checkbox) {
    selectedCheckboxes.push(checkbox.value);
  });

  // Select the submit button
  const submitButton = $('#createPermissionModal').find('.modal-footer button');

    // Check if folder and group are selected
    if (!folderId || !groupId) {
      toastr.error('Please select both a folder and a group.');
      return;
    }

      // Check if at least one permission is selected
    if (selectedCheckboxes.length === 0) {
      toastr.error('Please select at least one permission.');
      return;
    }

    // Disable the submit button and show loading text
  submitButton.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Assigning...');

  // Prepare data for the AJAX request
  const requestData = {
    group_id: groupId,
    folder_id: folderId,
    permissions: selectedCheckboxes,
  };

  // Make an AJAX request to store group permissions
  $.ajax({
    url: 'http://127.0.0.1:8000/api/grouppermissions/store',
    type: 'POST',
    dataType: 'json',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(requestData),
    success: function (response) {
 
      // Close the modal after successfully storing permissions
      $('#createPermissionModal').modal('hide');

      toastr.success('Group permissions stored successfully');

      populateTable(response.data.data);

    },
    error: function (error) {
      // Handle error response
      console.error('Error storing group permissions:', error);
      
     },
    complete: function () {
      // Enable the submit button and revert the text
      submitButton.prop('disabled', false).html('Assign Permission');
    }
  });
 // Close the modal
  $('#createPermissionModal').modal('hide');
}



  // FUNCTION TO HANDLE GROUP PERMISSION EDITING
  function editPermissions(permissionId) {
    console.log(`Editing permissions for ID: ${permissionId}`);
  }


  // GLOBAL VARIABLE TO STORE THE PERMISSION ID TO BE DELETED
let permissionToDeleteId;

// FUNCTION TO PREPARE FOR PERMISSION DELETION BY SETTING THE PERMISSION ID
function confirmDeletePermissionModal(permissionId) {
  // Set the permission ID to the global variable
  permissionToDeleteId = permissionId;
  $('#confirmDeletePermissionModal').modal('show');
}

// FUNCTION TO HANDLE PERMISSION DELETION
function deletePermission() {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem('edms_token');

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error('Unauthorized');
    return;
  }

  // Disable the delete button and show loading text
  const deleteButton = $('#deletePermissionBtn');
  deleteButton.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Deleting...');

  // Make a GET request to delete the permission
  fetch(`http://127.0.0.1:8000/api/grouppermissions/delete/${permissionToDeleteId}`, {
    method: 'GET',  
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      // Check the response 
      if (data.success) {
        toastr.success('Permission deleted successfully');
        const tableBody = document.getElementById('permissionsTbody'); 
        tableBody.innerHTML = ''; 

        // Refresh the data by calling the fetchData() function
        fetchData();
      } else {
        console.error('Failed to delete permission:', data.message);
      }
    })
    .finally(() => {
      // Enable the delete button and revert the text
      deleteButton.prop('disabled', false).html('Delete');

      // Hide the confirmation modal
      $('#confirmDeletePermissionModal').modal('hide');
    });
}
