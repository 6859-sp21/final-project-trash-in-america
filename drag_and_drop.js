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
    console.log("yayay");
    e.target.appendChild(draggable);
  } else {
    console.log("here");
    unsorted_region.appendChild(draggable);
  }

  // display the draggable element
  draggable.classList.remove("hide");
  //draggable.style.left = "0px";
  //draggable.style.top = "0px";
}
