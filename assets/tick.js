(function () {
  var requestTime = function () {
    var req = new XMLHttpRequest();
    req.open("GET", "/time");
    req.onreadystatechange = function (oEvent) {
      if (req.readyState === 4) {
        if (req.status === 200) {
          document.getElementsByTagName("span")[0].innerText = req.responseText;
        } else {
          document.getElementsByTagName("span")[0].innerText = req.statusText;
        }
        requestTime();
      }
    };
    req.send(null);
  };
  requestTime();

})();