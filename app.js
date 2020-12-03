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

function displayBook() {
  for (i = 0; i < myLibrary.length; i++) {
    const section = document.querySelector(
      `.section[data-name = "${myLibrary[i].status}"]`
    );
    const bookDisplay = document.createElement("div");
    bookDisplay.classList.add("book-display", "drawn-border");
    bookDisplay.style.backgroundColor = `${myLibrary[i].cover}`;

    const bookDisplayTitle = document.createElement("p");
    bookDisplayTitle.classList.add("book-display-title");
    bookDisplayTitle.textContent = myLibrary[i].title;

    const bookDisplayAuthor = document.createElement("p");
    bookDisplayAuthor.classList.add("book-display-author");
    bookDisplayAuthor.textContent = myLibrary[i].author;

    bookDisplay.appendChild(bookDisplayTitle);
    bookDisplay.appendChild(bookDisplayAuthor);
    // bookDisplayTitle.style.cssText = `border-left: 3px solid ${myLibrary[i].accent}`;

    section.appendChild(bookDisplay);
  }
}
const addNewBtn = document.querySelectorAll(".add-new-btn");

addNewBtn.forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    const text = btn.querySelector(".add-new-btn-text");
    const str = text.textContent;
    const strArr = str.split("");
    text.textContent = "";

    for (let i = 0; i < strArr.length; i++) {
      text.innerHTML += `<span>${strArr[i]}</span>`;
    }
    let char = 0;
    let timer = setInterval(onTick, 30);

    function onTick() {
      btn.addEventListener("mouseleave", () => {
        complete();
        return;
      });
      const letter = text.querySelectorAll("span")[char];
      if (!letter) {
        complete();
        return;
      }
      letter.classList.add("fade-in");
      char++;
      text.style.opacity = "1";

      if (char === strArr.length) {
        complete();
        return;
      }
    }

    function complete() {
      clearInterval(timer);
      timer = null;
    }
  });
  btn.addEventListener("mouseleave", () => {
    const text = btn.querySelector(".add-new-btn-text");
    text.textContent = "add new book";
    text.style.opacity = "0";
  });
});

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
