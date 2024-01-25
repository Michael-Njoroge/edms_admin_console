$.fn.extend({
  treed: function (data) {
    var openedClass = "glyphicon-minus-sign";
    var closedClass = "glyphicon-plus-sign";

    function buildTree(data) {
      var ul = $("<ul></ul>");
      $.each(data, function (index, item) {
        var li = $("<li class='branch'></li>")
          .append($("<span class='tree-node'></span>").text(item.name))
          .data("node-id", item.id);

        if (item.children && item.children.length > 0) {
          li.append(buildTree(item.children));
        } else {
          console.log(item.name);

          // Add a "New" button as a child of the node without children
          li.append(
            $("<ul>").append(
              $("<li class='branch'></li>").append(
                $("<span class='new-node'></span>")
                  .append(
                    $(
                      "<i class='indicator glyphicon " + closedClass + "'></i>"
                    ),
                    $("<span class='tree-node'></span>").text("New")
                  )
                  .on("click", function (e) {
                    e.stopPropagation();
                    addNewNode($(this).closest("ul"));
                  })
              )
            )
          );
        }

        ul.append(li);

        // Toggle tree node on click
        li.on("click", function (e) {
          e.stopPropagation();
          var icon = $(this).children("i:first");
          icon.toggleClass(openedClass + " " + closedClass);
          $(this).children().children().toggle();
        });
      });

      // Add a "New" button as the last child of the current level
      ul.append(
        $("<li class='branch'></li>").append(
          $("<span class='new-node'></span>")
            .append(
              $("<i class='indicator glyphicon " + closedClass + "'></i>"),
              $("<span class='tree-node'></span>").text("New")
            )
            .on("click", function (e) {
              e.stopPropagation();
              addNewNode($(this).closest("ul"));
            })
        )
      );

      return ul;
    }

    function addNewNode(parentLi) {
      // Remove existing new nodes to ensure only one is displayed at a time
      parentLi.siblings().find(".new-node").closest("li").remove();

      // Create a new list item with an input field and error message
      var newLi = $("<li class='branch'></li>").append(
        $("<input type='text' class='new-node-input' placeholder='Enter New'>"),
        "&nbsp;&nbsp;&nbsp;",
        $(
          "<button class='btn btn-sm save-node' style='background: none;'>Save</button>"
        ).on("click", function (e) {
          e.stopPropagation();
          saveNewNode($(this).closest("li"));
        }),
        "&nbsp;&nbsp;&nbsp;",
        $(
          "<button class='btn btn-sm cancel-node' style='color: red;'>X</button>"
        ).on("click", function (e) {
          e.stopPropagation();
          cancelNewNode($(this).closest("li"));
        }),
        "&nbsp;&nbsp;&nbsp;",
        $("<span class='error-message'></span>")
          .text("Lookup name is required")
          .hide()
      );

      // Prepend the new node above the "New" button
      parentLi.prepend(newLi);

      // Trigger the input field when "New" button is clicked
      newLi.find(".new-node-input").focus();
    }

    function saveNewNode(newLi) {
      // Get the value from the input field
      var newNodeName = newLi.find(".new-node-input").val();
      var errorMessage = newLi.find(".error-message");

      // Check if the input is not empty
      if (newNodeName.trim() !== "") {
        // Get the parent lookup id from the data attribute of the parent li
        var parentLookupId = newLi.parent().closest("li").data("node-id");

        // If the parent lookup id is undefined, set it to 0
        if (typeof parentLookupId === "undefined") {
          parentLookupId = 0;
        }

        // Prepare the payload for the POST request
        var postData = {
          parent_lookup_id: parentLookupId,
          name: newNodeName,
        };

        // Make an AJAX POST request to save the new node
        $.ajax({
          url: apiBaseUrl + "/lookups/store",
          method: "POST",
          dataType: "json",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
          data: JSON.stringify(postData),
          success: function (response) {
            // Replace the input field with the entered value and add the + icon
            newLi
              .empty()
              .text(newNodeName)
              .data("node-id", response.id)
              .prepend(
                "<i class='indicator glyphicon " + closedClass + "'></i>"
              );
            errorMessage.hide();

            toastr.success("Lookup saved successfully!");
          },
          error: function (error) {
            console.error("Error saving data to the API:", error);
            errorMessage.show().text("Error saving data. Please try again.");
          },
        });
      } else {
        // Display error message and style it
        errorMessage.show().css({
          color: "red",
          marginLeft: "5px",
        });
      }
    }

    function cancelNewNode(newLi) {
      // Remove the input field and buttons
      newLi.remove();
    }

    var tree = buildTree(data.data.data);
    console.log(tree);
    tree.addClass("tree");

    // Append the tree to the specified element
    $(this).append(tree);

    // Initialize the tree
    tree
      .find("li")
      .has("ul")
      .each(function () {
        var branch = $(this);
        branch.prepend(
          "<i class='indicator glyphicon " + closedClass + "'></i>"
        );
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
  },
});

// Retrieve the Bearer token from localStorage
const bearerToken = localStorage.getItem("edms_token");

// Check if the token is present in localStorage
if (!bearerToken) {
  console.error("Unauthorized");
} else {
  // Make an AJAX request to fetch data from the API with the Authorization header
  $.ajax({
    url: apiBaseUrl + "/lookups",
    method: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    success: function (data) {
      // Call the treed function to build and populate the tree
      $("#tree1").treed(data);
    },
    error: function (error) {
      console.error("Error fetching data from the API:", error);
    },
  });
}

// Enable Bootstrap tooltips
$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
});
