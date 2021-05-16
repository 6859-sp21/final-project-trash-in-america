window.onload = function () {
  setTimeout(function () {
    var button = document.getElementById("next-button");
    button.style.display = "block";
  }, 2000);
  var secondButton = document.getElementById("next-button2");
  var thirdButton = document.getElementById("next-button3");
  var fourthButton = document.getElementById("next-button4");
  var fifthButton = document.getElementById("next-button5");
  var sixthButton = document.getElementById("next-button6");
  var canDumpsterDiv = document.getElementById("can-dumpster");
  var barrelDiv = document.getElementById("barrels");
  var co2 = document.getElementById("co2");
  var monthly = document.getElementById("monthly");
  var monthlyRes = document.getElementById("monthly-results");
  var pieDiv = document.getElementById("pie-chart");
  secondButton.onclick = function changeToCans() {
    pieDiv.style.display = "none";
    canDumpsterDiv.style.display = "block";
    setTimeout(function () {
      thirdButton.style.display = "block";
    }, 2000);
  };

  thirdButton.onclick = function changeToCans() {
    thirdButton.style.display = "none";
    barrelDiv.style.display = "block";
    setTimeout(function () {
      fourthButton.style.display = "block";
    }, 2000);
  };

  fourthButton.onclick = function changeToCans() {
    fourthButton.style.display = "none";
    barrelDiv.style.display = "none";
    co2.style.display = "block";
    setTimeout(function () {
      fifthButton.style.display = "block";
    }, 2000);
  };

  fifthButton.onclick = function changeToCans() {
    canDumpsterDiv.style.display = "none";
    fifthButton.style.display = "none";
    co2.style.display = "none";
    monthly.style.display = "block";
    setTimeout(function () {
      sixthButton.style.display = "block";
    }, 2000);
  };

  sixthButton.onclick = function changeToCans() {
    canDumpsterDiv.style.display = "none";
    sixthButton.style.display = "none";
    monthlyRes.style.display = "block";
  };
};
