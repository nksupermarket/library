let myLibrary = [];

function Book(title, author, pages, status, cover, accent) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
  this.cover = cover;
  this.accent = accent;
}
const newBookForm = document.querySelector(".new-book");
const submit = document.getElementById("submit-book");
submit.addEventListener("click", () => {
  if (validateForm()) {
    addBookToLibrary();
    displayBook();
  }
});
function addBookToLibrary() {
  const bookTitle = newBookForm.querySelector("input[name = book-title]").value;
  const bookAuthor = newBookForm.querySelector("input[name = author]").value;
  const bookPages = newBookForm.querySelector("input[name = pages-read]").value;
  let bookStatus;
  const readRadio = newBookForm.querySelectorAll("input[name = read]");
  for (i = 0; i < readRadio.length; i++) {
    if (readRadio[i].checked) bookStatus = readRadio[i].value;
  }
  let bookCover;
  const coverRadio = newBookForm.querySelectorAll("input[name = cover-color]");
  for (i = 0; i < coverRadio.length; i++) {
    if (coverRadio[i].checked) bookCover = coverRadio[i].value;
  }
  let bookAccent;
  const accentRadio = newBookForm.querySelectorAll(
    "input[name = accent-color]"
  );
  for (i = 0; i < accentRadio.length; i++) {
    if (accentRadio[i].checked) bookAccent = accentRadio[i].value;
  }

  const newBook = new Book(
    bookTitle,
    bookAuthor,
    bookPages,
    bookStatus,
    bookCover,
    bookAccent
  );

  myLibrary.push(newBook);
}
const lotr = new Book(
  "lord of the rings",
  "jr tolkein",
  null,
  "currently reading",
  "#f5efff",
  "#b1affe"
);
myLibrary.push(lotr);
window.onload = displayBook();
function displayBook() {
  for (i = 0; i < myLibrary.length; i++) {
    const section = document.querySelector(
      `.section[data-name = "${myLibrary[i].status}"]`
    );
    const bookContainer = section.querySelector(".book-ctn");
    const bookDisplay = document.createElement("div");
    bookDisplay.classList.add("book-display", "drawn-border");
    bookDisplay.style.backgroundColor = `${myLibrary[i].cover}`;

    const bookDisplayTitle = document.createElement("p");
    bookDisplayTitle.classList.add("book-display-title");
    bookDisplayTitle.textContent = myLibrary[i].title;
    bookDisplayTitle.style.borderLeft = `3px solid ${myLibrary[i].accent}`;

    const bookDisplayAuthor = document.createElement("p");
    bookDisplayAuthor.classList.add("book-display-author");
    bookDisplayAuthor.textContent = myLibrary[i].author;

    bookDisplay.appendChild(bookDisplayTitle);
    bookDisplay.appendChild(bookDisplayAuthor);

    bookContainer.appendChild(bookDisplay);
  }
}

const addNewBtn = document.querySelectorAll(".add-new-btn");
const modal = document.querySelector(".modal");

addNewBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.style.cssText = "display: grid; place-items: center;";
  });
});
addNewBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const sectionTitle = btn.previousElementSibling;
    const readRadio = newBookForm.querySelectorAll("input[name = read]");
    for (i = 0; i < readRadio.length; i++) {
      if (readRadio[i].value === sectionTitle.textContent)
        return (readRadio[i].checked = true);
    }
  });
});
window.onclick = function (e) {
  if (e.target == modal) {
    resetModalAndForm();
  }
};
function resetModalAndForm() {
  modal.style.display = "none";
  resetModal();
  document.forms["new-book"].reset();
}
const modalSequence = newBookForm.querySelectorAll(".modal-sequence");
const nextModalBtns = newBookForm.querySelectorAll(".next-modal");
let n = 0;
nextModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const currentModal = newBookForm.querySelectorAll(".modal-sequence")[n];
    if (validateForm() === true) {
      if (btn.value === "Submit") {
        resetModalAndForm();
        return;
      }
      const nextModal = newBookForm.querySelectorAll(".modal-sequence")[++n];
      currentModal.classList.remove("active-modal");
      nextModal.classList.add("active-modal");
    } else {
      incompleteFields(currentModal);
    }
  });
});
const backModalBtns = newBookForm.querySelectorAll(".back-modal");
backModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const currentModal = newBookForm.querySelectorAll(".modal-sequence")[n];
    const prevModal = newBookForm.querySelectorAll(".modal-sequence")[--n];

    currentModal.classList.remove("active-modal");
    prevModal.classList.add("active-modal");
  });
});
function incompleteFields(modal) {
  modal.animate(
    [
      { transform: "rotate(0deg)" },
      { transform: "rotate(5deg)" },
      { transform: "rotate(0deg)" },
      { transform: "rotate(-5deg)" },
      { transform: "rotate(0deg)" },
    ],
    {
      duration: 100,
      iterations: 4,
    }
  );
}
function resetModal() {
  const activeModal = document.querySelector(".active-modal");
  activeModal.classList.remove("active-modal");
  const firstModal = document.getElementById("first-modal");
  firstModal.classList.add("active-modal");
  const invalids = activeModal.querySelectorAll(".invalid");
  invalids.forEach((field) => field.classList.remove("invalid"));
  n = 0;
}
function validateForm() {
  if (validateRadio() && validateText()) return true;
}
function validateRadio() {
  let valid = true;
  let countChecked = 0;
  const setNames = new Set();
  const activeModal = document.querySelector(".active-modal");
  const radioBtns = activeModal.querySelectorAll("input[type=radio]");

  for (let i = 0; i < radioBtns.length; i++) {
    setNames.add(radioBtns[i].name);
    if (radioBtns[i].checked) countChecked++;
  }

  if (countChecked != setNames.size) valid = false;
  return valid;
}
function validateText() {
  let valid = true;
  const activeModal = document.querySelector(".active-modal");
  const textInputs = activeModal.querySelectorAll(
    "input[type=text], input[type=number]"
  );
  for (i = 0; i < textInputs.length; i++) {
    if (textInputs[i].hasAttribute("required")) {
      if (textInputs[i].type === "text" && !textInputs[i].value) {
        textInputs[i].classList.add("invalid");
        valid = false;
      }
    }
  }
  return valid;
}
