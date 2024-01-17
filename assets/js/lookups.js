$.fn.extend({
  treed: function (data) {
    var openedClass = "glyphicon-minus-sign";
    var closedClass = "glyphicon-plus-sign";

    // Function to build the tree recursively
    function buildTree(data) {
      var ul = $("<ul></ul>");
      $.each(data, function (index, item) {
        var li = $("<li class='branch'></li>").text(item.name);

        if (item.children && item.children.length > 0) {
          console.log("Adding children for:", item.name);
          li.append(buildTree(item.children));
        } else {
          console.log("No children for:", item.name);
        }

        ul.append(li);
      });
      return ul;
    }

    var tree = buildTree(data.data.data);
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
    url: "http://127.0.0.1:8000/api/lookups",
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
