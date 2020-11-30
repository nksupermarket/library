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
    modal.style.display = "none";
  }
};
