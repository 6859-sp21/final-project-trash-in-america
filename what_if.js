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
  var seventhButton = document.getElementById("next-button7");
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
    setTimeout(function () {
      seventhButton.style.display = "block";
    }, 2000);
  };

  seventhButton.onclick = function changeToCans() {
    monthlyRes.style.display = "none";
    seventhButton.style.display = "none";
    secondButton.style.display = "none";
    monthly.style.display = "none";
    pieDiv.style.display = "block";
    changeContentBack();
  };

  var downFromDragDrop = document.getElementById("down-from-drag-drop");
  var upFromWhatIf = document.getElementById("up-from-what-if");
  var downFromWhatIf = document.getElementById("down-from-what-if");
  var upFromReview = document.getElementById("up-from-review");

  var dragDropView = document.getElementById("dragDropView");
  var whatIfView = document.getElementById("whatIfView");
  var reviewView = document.getElementById("reviewView");

  downFromDragDrop.onclick = function goToWhatIf() {
    whatIfView.scrollIntoView({ behavior: "smooth" });
  }

  upFromWhatIf.onclick = function goToWhatIf() {
    dragDropView.scrollIntoView({ behavior: "smooth" });
  }

  downFromWhatIf.onclick = function goToWhatIf() {
    reviewView.scrollIntoView({ behavior: "smooth" });
  }
  upFromReview.onclick = function goToWhatIf() {
    whatIfView.scrollIntoView({ behavior: "smooth" });
  }
};
