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
  if (targetClassList.contains("trash-category")) {
    // add it to the drop target
    e.target.appendChild(draggable);
  } else {
    unsorted_region.appendChild(draggable);
  }

  // display the draggable element
  draggable.classList.remove("hide");
  //draggable.style.left = "0px";
  //draggable.style.top = "0px";
}

const answers = {
  "bread-slice": "compostable",
  "hamburger": "compostable",
  "drumstick-bite": "compostable",
  "car":"trashable",
  "bus": "trashable", 
  "ambulance":"trashable",
  "kiwi-bird": "recyclable",
  "cat": "recyclable",
  "horse": "recyclable"
};

document.getElementById("trash-test-submit").onclick = function checkSorting() {
  let score = 0;
  let wrongItemIds = [];
  for (let key in answers) {
    const trashItem = document.getElementById(key);
    const parent = trashItem.parentElement;
    if (parent.id === answers[key]) {
      score += 1;
    } else {
      wrongItemIds.push(key);
    }
  }
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";
  let p1 = document.createElement('p');
  p1.textContent = `You got ${score} out of ${Object.keys(answers).length} items correct`;
  let p2 = document.createElement('p');
  if (score === 9) {
    p2.textContent = "Wow, you sorted everything correctly!";
  } else {
    p2.textContent = "Let's learn how to sort the items you sorted incorrectly";
  }
  answersDiv.appendChild(p1);
  answersDiv.appendChild(p2);
  for (let i = 0; i < wrongItemIds.length; i++) {
    let span = document.createElement('span');
    let img = document.createElement('img');
    img.src = "images/" + wrongItemIds[i] + ".svg";
    img.classList.add("wrong-trash-item");
    span.appendChild(img);
    span.innerHTML += "is&nbsp;";
    let font = document.createElement('font');
    font.innerText = answers[wrongItemIds[i]];
    font.classList.add(answers[wrongItemIds[i]]);
    span.appendChild(font);
    span.classList.add("wrongItem");
    answersDiv.appendChild(span);
  }
  answersDiv.scrollIntoView({behavior: "smooth"});
};

// look at this later https://www.sfweekly.com/news/which-bin-does-it-go-in/