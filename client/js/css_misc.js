/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function navbarChanger() {
    var x = document.getElementById("mainnavbar");
    if (x.className === "navbar") {
      x.className += " responsive";
    } else {
      x.className = "navbar";
    }
    

    var y = document.getElementById("indexmain");
    if (y.className === "indexMain") {
      y.className += " responsive";
    } else {
      y.className = "indexMain";
    }
  }