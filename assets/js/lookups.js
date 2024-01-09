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
      $("#newNodeModal").modal("show"); // Show the modal manually
    });

    // Clear the modal content on modal hidden
    $("#newNodeModal").on("hidden.bs.modal", function () {
      // Clear the input field
      $("#nodeNameInput").val("");
    });
  },
});

// Initialization of treeview
$("#tree1").treed();

// Enable Bootstrap tooltips
$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
});
