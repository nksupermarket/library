let myLibrary = [];

function Book(title, author, pages, status, cover, accent, id) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
  this.cover = cover;
  this.accent = accent;
  this.id = id;
}
const newBookForm = document.querySelector(".new-book");
const submit = document.getElementById("submit-book");
submit.addEventListener("click", () => {
  if (validateForm()) {
    const book = addBookToLibrary();
    displayBook(book);
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

  let id;
  if (myLibrary.length === 0) {
    id = 0;
  } else {
    id = myLibrary[myLibrary.length - 1].id + 1;
  }

  const newBook = new Book(
    bookTitle,
    bookAuthor,
    bookPages,
    bookStatus,
    bookCover,
    bookAccent,
    id
  );

  myLibrary.push(newBook);
  return newBook;
}
for (i = 0; i < myLibrary.length; i++) {
  displayBook(myLibrary[i]);
}
function displayBook(a) {
  const section = document.querySelector(`.section[data-name = "${a.status}"]`);
  const bookContainer = section.querySelector(".book-ctn");
  const bookDisplay = document.createElement("div");

  bookDisplay.classList.add("book-display", "drawn-border");
  bookDisplay.dataset.id = a.id;
  bookDisplay.style.backgroundColor = `${a.cover}`;
  if (a.cover === "#2C514C") bookDisplay.style.color = "white";

  const firstPage = document.createElement("div");
  firstPage.classList.add("first-page");

  const bookDisplayTitle = document.createElement("p");
  bookDisplayTitle.classList.add("book-display-title");
  bookDisplayTitle.textContent = a.title;
  bookDisplayTitle.style.borderLeft = `5px solid ${a.accent}`;

  const bookDisplayAuthor = document.createElement("p");
  bookDisplayAuthor.classList.add("book-display-author");
  bookDisplayAuthor.textContent = a.author;

  firstPage.appendChild(bookDisplayTitle);
  firstPage.appendChild(bookDisplayAuthor);

  const secondPage = document.createElement("div");
  secondPage.classList.add("second-page");
  if (a.cover === "#FFF") {
    secondPage.style.borderLeft = "1px solid var(--main-font)";
  } else {
    secondPage.style.borderLeft = "1px solid white";
  }

  const bookDisplayPages = document.createElement("div");
  bookDisplayPages.classList.add("book-display-pages");
  bookDisplayPages.textContent = `Pages read: `;
  const bookDisplayPagesNum = document.createElement("p");
  bookDisplayPagesNum.classList.add("book-display-pages-num");
  bookDisplayPagesNum.textContent = a.pages;
  bookDisplayPages.appendChild(bookDisplayPagesNum);

  const coverRadio = newBookForm.querySelector("#cover-color");
  const bookDisplayCover = coverRadio.cloneNode(true);
  const bookDisplayCoverText = bookDisplayCover.children[0];
  const bookDisplayCoverLabel = bookDisplayCover.querySelectorAll("label");
  for (i = 0; i < bookDisplayCoverLabel.length; i++) {
    const bookDisplayCoverName = bookDisplayCoverLabel[i].querySelector("span");
    bookDisplayCoverName.style.display = "none";
  }
  const bookDisplayCoverInput = bookDisplayCover.querySelectorAll("input");
  for (i = 0; i < bookDisplayCoverInput.length; i++) {
    if (a.cover === bookDisplayCoverInput[i].value)
      bookDisplayCoverInput[i].checked = true;
    bookDisplayCoverInput[i].name = `cover-color[${a.id}]`;
  }
  bookDisplayCoverText.textContent = "Your cover:";
  bookDisplayCover.classList.add("book-display-cover");

  secondPage.appendChild(bookDisplayPages);
  secondPage.appendChild(bookDisplayCover);

  bookDisplay.addEventListener("click", () => {
    bookDisplay.classList.add("book-display-update");
    bookDisplayTitle.setAttribute("contenteditable", "true");
    bookDisplayAuthor.setAttribute("contenteditable", "true");
    bookDisplayPagesNum.setAttribute("contenteditable", "true");
    secondPage.style.opacity = "1";
  });

  bookDisplay.appendChild(firstPage);
  bookDisplay.appendChild(secondPage);

  bookContainer.appendChild(bookDisplay);
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
