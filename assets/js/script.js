$.fn.extend({
  treed: function (o) {
    var openedClass = "glyphicon-minus-sign";
    var closedClass = "glyphicon-plus-sign";

    if (typeof o != "undefined") {
      if (typeof o.openedClass != "undefined") {
        openedClass = o.openedClass;
      }
      if (typeof o.closedClass != "undefined") {
        closedClass = o.closedClass;
      }
    }

    // Initialize each of the top levels
    var tree = $(this);
    tree.addClass("tree");

    // Traverse through each level
    tree.find("ul").each(function () {
      var level = $(this);

      // Add "New" button after each level
      var newButton = $(
        "<li><button class='btn new-node-btn' data-toggle='modal' data-target='#newNodeModal'><i class='glyphicon " +
          closedClass +
          "'></i> New</button></li>"
      );
      level.append(newButton);
    });

    // Handle the rest of the tree initialization
    tree
      .find("li")
      .has("ul")
      .each(function () {
        var branch = $(this); // li with children ul
        branch.prepend(
          "<i class='indicator glyphicon " + closedClass + "'></i>"
        );
        branch.addClass("branch");
        branch.on("click", function (e) {
          if (this == e.target) {
            var icon = $(this).children("i:first");
            icon.toggleClass(openedClass + " " + closedClass);
            $(this).children().children().toggle();
          }
        });
        branch.children().children().toggle();
      });

    // Fire event from the dynamically added icon
    tree.find(".branch .indicator").each(function () {
      $(this).on("click", function () {
        $(this).closest("li").click();
      });
    });

    // Fire event to open branch if the li contains an anchor instead of text
    tree.find(".branch>a").each(function () {
      $(this).on("click", function (e) {
        $(this).closest("li").click();
        e.preventDefault();
      });
    });

    // Fire event to open branch if the li contains a button instead of text
    tree.find(".branch>button").each(function () {
      $(this).on("click", function (e) {
        $(this).closest("li").click();
        e.preventDefault();
      });
    });

    // Handle the "New" button click to show the modal
    tree.find(".new-node-btn").on("click", function (e) {
      e.stopPropagation(); // Prevent the click event from propagating to the parent li
    });
  },
});

// Initialization of treeview
$("#tree1").treed();

// Enable Bootstrap tooltips
$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

// FUNCTION TO UPDATE THE TABLE ROW NUMBERS DYNAMICALLY
function updateRowNumbers() {
  // Update the rows in the "groupsTab" table
  const tabRows = document.querySelectorAll("#tab tbody tr");
  tabRows.forEach((row, index) => {
    // Update the first cell (index 0) in each row with the new row number
    row.cells[0].textContent = index + 1;
  });

  // Update the rows in the "groupMembershipsTab" table
  const groupMembershipsRows = document.querySelectorAll(
    "#groupMembershipsTab tbody tr"
  );
  groupMembershipsRows.forEach((row, index) => {
    // Update the first cell (index 0) in each row with the new row number
    row.cells[0].textContent = index + 1;
  });
}

// FUNCTION TO SHOW THE COUNT IN THE DASHBOARD
async function fetchDataAndPopulateCounts() {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    return;
  }

  try {
    // Fetch data for users from the API endpoint
    const usersResponse = await fetch("http://127.0.0.1:8000/api/users", {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    // Convert the response to JSON format
    const usersData = await usersResponse.json();

    // Update the user count in the first card
    document.getElementById("userCount").innerText = usersData.data.data.length;

    // Fetch data for groups from the API endpoint
    const groupsResponse = await fetch("http://127.0.0.1:8000/api/groups", {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    // Convert the response to JSON format
    const groupsData = await groupsResponse.json();

    // Update the group count in the appropriate card
    document.getElementById("groupCount").innerText =
      groupsData.data.data.length;

    // Fetch data for folders from the API endpoint
    const foldersResponse = await fetch("http://127.0.0.1:8000/api/folders/1", {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    // Convert the response to JSON format
    const foldersData = await foldersResponse.json();

    // Update the folder count in the appropriate card
    document.getElementById("folderCount").innerText =
      foldersData.data.data.length;
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors, e.g., display an error message
    document.getElementById("userCount").innerText = "Error loading data";
    document.getElementById("groupCount").innerText = "Error loading data";
    document.getElementById("folderCount").innerText = "Error loading data";
  }
}

// Call the async function
fetchDataAndPopulateCounts();

$(document).ready(function () {
  // Add new item within a category
  $(".b-list").on("click", ".add-item", function () {
    var parentItem = $(this).closest(".b-list__item_type_parent");
    var newItem =
      '<li class="b-list__item b-list__item_type_child">' +
      '<label class="b-label" for="ch' +
      (parentItem.find(".b-list__item_type_child").length + 1) +
      '">' +
      '<i class="ion-document"></i>' +
      "Child" +
      "</label>" +
      '<input type="checkbox" class="b-checkbox" id="ch' +
      (parentItem.find(".b-list__item_type_child").length + 1) +
      '" />' +
      "</li>";
    parentItem.find(".b-list_type_tree").append(newItem);
  });

  // Add new category
  $(".b-list").on("click", ".add-category", function () {
    var newCategory =
      '<li class="b-list__item b-list__item_type_parent">' +
      '<label class="b-label" for="ch' +
      ($(".b-list_type_tree").length + 1) +
      '">' +
      '<i class="ion-folder"></i>' +
      "Parent" +
      "</label>" +
      '<input type="checkbox" class="b-checkbox" id="ch' +
      ($(".b-list_type_tree").length + 1) +
      '" />' +
      '<ul class="b-list b-list_type_tree">' +
      '<li class="b-list__item b-list__item_type_child">' +
      '<label class="b-label" for="ch' +
      ($(".b-list_type_tree").length + 1) +
      '">' +
      '<i class="ion-document"></i>' +
      "Child" +
      "</label>" +
      '<input type="checkbox" class="b-checkbox" id="ch' +
      ($(".b-list_type_tree").length + 1) +
      '" />' +
      "</li>" +
      "</ul>" +
      "</li>";
    $(".b-list").append(newCategory);
  });
});
