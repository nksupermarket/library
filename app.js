let myLibrary = [];

function Book(title, author, pages, status) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
}
const newBookForm = document.querySelector(".new-book");
const submit = document.getElementById("submit-book");
submit.addEventListener("click", addBookToLibrary);
function addBookToLibrary() {
  const bookTitle = newBookForm.getElementById("book-title").value;
  const bookAuthor = newBookForm.getElementById("book-author").value;
  const bookPages = newBookForm.getElementById("book-pages").value;
  const bookStatus = newBookForm.getElementById("book-status").value;
  const newBook = new Book(bookTitle, bookAuthor, bookPages, bookStatus);

  myLibrary.push(newBook);
}

const addNewBtn = document.querySelectorAll(".add-new-btn");

addNewBtn.forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    const text = btn.querySelector(".add-new-btn-text");
    const str = text.textContent;
    const strArr = str.split("");
    text.textContent = "";

    for (i = 0; i < strArr.length; i++) {
      text.innerHTML += `<span>${strArr[i]}</span>`;
    }

    let char = 0;
    let timer = setInterval(onTick, 30);

    function onTick() {
      const letter = text.querySelectorAll("span")[char];
      letter.classList.add("fade-in");
      char++;
      text.style.opacity = "1";
      btn.addEventListener("mouseleave", complete);

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
  const countChecked = 0;
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
