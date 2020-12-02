let myLibrary = [];

function Book(title, author, pages, status) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
}

const submit = document.getElementById("submit-book");
submit.addEventListener("click", addBookToLibrary);
function addBookToLibrary() {
  const bookTitle = document.getElementById("book-title").value;
  const bookAuthor = document.getElementById("book-author").value;
  const bookPages = document.getElementById("book-pages").value;
  const bookStatus = document.getElementById("book-status").value;
  const newBook = new Book(bookTitle, bookAuthor, bookPages, bookStatus);

  myLibrary.push(newBook);
}
// for (i=0; i<myLibrary.length; i++) {
//   const book = myLibrary[i]

// }

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
const modalSequence = document.querySelectorAll(".modal-sequence");
const nextModalBtns = document.querySelectorAll(".next-modal");
let n = 0;
nextModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const currentModal = document.querySelectorAll(".modal-sequence")[n];
    if (validateForm() === true) {
      const nextModal = document.querySelectorAll(".modal-sequence")[++n];
      currentModal.classList.toggle("active-modal");
      nextModal.classList.toggle("active-modal");
    } else {
      incompleteFields(currentModal);
    }
  });
});
submit.addEventListener("click", () => {
  if (validateForm() === true) {
    resetModalAndForm();
  } else {
    const activeModal = document.querySelector(".active-modal");
    incompleteFields(activeModal);
  }
});
function validateForm() {
  if (validateRadio() && validateText()) return true;
}
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

function validateRadio() {
  let valid = false;
  const listOfRadio = [];
  const activeModal = document.querySelector(".active-modal");
  const radioBtns = activeModal.querySelectorAll("input[type=radio]");
  for (i = 0; i < radioBtns.length; i++) {
    const radioStatus = {
      name: radioBtns[i].name,
      checked: radioBtns[i].checked,
    };
    listOfRadio.push(radioStatus);
  }

  const countNames = listOfRadio.reduce(
    (total, radio) => {
      if (!total.set[radio.name]) {
        total.set[radio.name] = 1;
        total.count++;
      }
      return total;
    },
    { set: {}, count: 0 }
  ).count;

  const countChecked = listOfRadio.filter((e) => {
    return e.checked === true;
  });

  if (countChecked.length === countNames) valid = true;

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
