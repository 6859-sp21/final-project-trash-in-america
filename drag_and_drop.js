const unsorted_region = document.querySelector(".trash-container");

window.addEventListener("dragenter", dragEnter);
window.addEventListener("dragover", dragOver);
window.addEventListener("dragleave", dragLeave);
window.addEventListener("drop", drop);

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  setTimeout(() => {
    e.target.classList.add("hide");
  }, 0);
}

const boxes = document.querySelectorAll(".trash-category");

boxes.forEach((box) => {
  box.addEventListener("dragenter", dragEnter);
  box.addEventListener("dragover", dragOver);
  box.addEventListener("dragleave", dragLeave);
  box.addEventListener("drop", drop);
});

const items = document.querySelectorAll(".trash-item");

const rem = 16;

items.forEach((item) => {
  const minWidthStart = rem;
  const maxWidthEnd = unsorted_region.offsetWidth - rem - item.offsetHeight;
  const width = Math.floor(
    Math.random() * (maxWidthEnd - minWidthStart) + minWidthStart
  );
  const minHeightStart = rem;
  const maxHeightEnd = unsorted_region.offsetHeight - rem - item.offsetHeight;
  const height = Math.floor(
    Math.random() * (maxHeightEnd - minHeightStart) + minHeightStart
  );
  item.addEventListener("dragstart", dragStart);
  //item.style.left = width + "px";
  //item.style.top = height + "px";
});

function dragEnter(e) {
  e.preventDefault();
  const targetClassList = e.target.classList;
  if (targetClassList.contains("trash-category")) {
    e.target.classList.add("drag-over");
  }
}

function dragOver(e) {
  e.preventDefault();
  const targetClassList = e.target.classList;
  if (targetClassList.contains("trash-category")) {
    e.target.classList.add("drag-over");
  }
}

function dragLeave(e) {
  e.target.classList.remove("drag-over");
}

function drop(e) {
  e.target.classList.remove("drag-over");

  // get the draggable element
  const id = e.dataTransfer.getData("text/plain");
  const draggable = document.getElementById(id);
  const targetClassList = e.target.classList;
  const targetParentClassList = e.target.parentElement.classList;
  if (targetClassList.contains("trash-category")) {
    // add it to the drop target
    e.target.appendChild(draggable);
  } else if (targetParentClassList.contains("trash-category")) {
    e.target.parentElement.appendChild(draggable);
  } else {
    //unsorted_region.appendChild(draggable);
    const region = document.getElementById(id + "-container");
    region.appendChild(draggable);
  }

  // display the draggable element
  draggable.classList.remove("hide");
  //draggable.style.left = "0px";
  //draggable.style.top = "0px";
}

const answers = {
  pizza: [
    "compostable",
    "Greasy empty pizza boxes: though cardboard boxes are normally recyclable, the grease/cheese from pizza could contaminate the cardboard - however, cardboard is also compostable!",
  ],
  noodles: [
    "compostable",
    "Chinese takeout box with chopsticks: many paper food containers are compostable, inclusing Chinese takeout boxes - but please make sure to remove any metal wires. Those wooden/bamboo disposable chopsticks belong in the compost too!",
  ],
  "tea-bag": [
    "compostable",
    "Used tea bag: tea bag and tea leaves are compostable, just make sure that there are no metal staples attached to the tea bag.",
  ],
  sauce: [
    "trashable",
    "Empty condiment packet: these small packets are usually contaminated with food, and they are usually too small to be recycled either way.",
  ],
  "shopping-bag": [
    "trashable",
    "Plastic grocery bag: it's plastic, so it must be recyclable - WRONG! The thin plastic easily gets caught in recycling machines, resulting in serious damage to the machines. Please do not throw away recyclables in plastic bags either.",
  ],
  "drinking-straw": [
    "trashable",
    "Used, cleaned drinking straws: they're plastic, but they're too small and flexible to be recycled. Always remove your straw from your cup before throwing the cup into the recycle bin.",
  ],
  can: [
    "recyclable",
    "Empty aluminum soda can: aluminum is one of the most valuable recyclable materials!",
  ],
  eggs: [
    "recyclable",
    "Empty plastic egg carton (without the eggs): it's a clean plastic container - therefore recyclable. If the egg carton were not plastic/paper, throw it into the trash.",
  ],
  fruit: [
    "recyclable",
    "Empty, cleaned ice cream pints: though the inside of ice cream pints might look waxy, as long as they have been cleaned and dried, ice cream pints are recyclable.",
  ],
  "paper-bag": [
    "recyclable",
    "Paper grocery bag: though some may say paper bags are compostable (and they are right), paper bags are preferred to be recycled rather than composted. When possible, pick paper bags over plastic bags at the grocery store for sustainability reasons (or even better, bring your own bag!)",
  ],
};

document.getElementById("trash-test-submit").onclick = function checkSorting() {
  let allSorted = true;
  for (let key in answers) {
    const trashItem = document.getElementById(key);
    const parent = trashItem.parentElement;
    if (
      parent.id !== "recyclable" &&
      parent.id !== "compostable" &&
      parent.id !== "trashable"
    ) {
      allSorted = false;
      break;
    }
  }
  const warningTxt = document.getElementById("warning-text");
  if (allSorted === true) {
    warningTxt.style.display = "none";
    let score = 0;
    let wrongItemIds = [];
    for (let key in answers) {
      const trashItem = document.getElementById(key);
      const parent = trashItem.parentElement;
      if (parent.id === answers[key][0]) {
        score += 1;
      } else {
        wrongItemIds.push(key);
      }
    }
    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";
    let p1 = document.createElement("p");
    p1.textContent = `You got ${score} out of ${
      Object.keys(answers).length
    } items correct`;
    let p2 = document.createElement("p");
    if (score === Object.keys(answers).length) {
      p2.textContent = "Wow, you sorted everything correctly!";
    } else {
      p2.textContent =
        "Let's learn how to sort the items you sorted incorrectly";
    }
    answersDiv.classList.add("center-explanation");
    answersDiv.appendChild(p1);
    answersDiv.appendChild(p2);
    for (let i = 0; i < wrongItemIds.length; i++) {
      let span = document.createElement("span");
      let img = document.createElement("img");
      img.src = "images/" + wrongItemIds[i] + ".svg";
      img.classList.add("wrong-trash-item");
      let div = document.createElement("div");
      div.appendChild(img);
      div.classList.add("tooltip");
      span.appendChild(div);
      span.innerHTML += "is&nbsp;";
      let font = document.createElement("font");
      font.innerText = answers[wrongItemIds[i]][0];
      font.classList.add(answers[wrongItemIds[i]][0]);
      span.appendChild(font);
      span.classList.add("wrongItem");
      answersDiv.appendChild(span);
      let span3 = document.createElement("span");
      span3.classList.add("explanation2");
      span3.innerText += answers[wrongItemIds[i]][1];
      answersDiv.appendChild(span3);
    }
    answersDiv.scrollIntoView({ behavior: "smooth" });
    const learnDiv = document.getElementById("trash-learn-more");
    learnDiv.style.display = "block";
  } else {
    warningTxt.style.display = "block";
  }
};

// look at this later https://www.sfweekly.com/news/which-bin-does-it-go-in/
// <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
// <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
// https://www.recology.com/recology-san-francisco/your-three-carts/
// https://ecology.wa.gov/recycleright#:~:text=Recycling%20helps%20reduce%20pollution%2C%20contribute,support%20local%20jobs%20and%20businesses.

// Get the modal
var moreInfoModal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("trash-learn-more");

// Get the <span> element that closes the modal
var span = document.getElementById("close");

// When the user clicks on the button, open the modal
btn.onclick = function () {
  moreInfoModal.style.display = "block";
  const learnDiv = document.getElementById("trash-learn-more");
  learnDiv.style.animation = "none";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  moreInfoModal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function (event) {
//   if (event.target == moreInfoModal) {
//     moreInfoModal.style.display = "none";
//   }
// };

// https://www.aluminum.org/industries/production/recycling
// https://www.greenandgrowing.org/what-if-everyone-recycled-tips/
// https://www.aluminum.org/aluminum-can-advantage
// https://www.aluminum.org/sites/default/files/SustainabilityBrochure_0.pdf
// https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator
// https://www.aluminum.org/sites/default/files/USPrimaryProduction062020.pdf

// https://www.eia.gov/tools/faqs/faq.php?id=33&t=6#:~:text=In%202020%2C%20the%20United%20States,6.63%20billion%20barrels%20of%20petroleum. for oil used per day
