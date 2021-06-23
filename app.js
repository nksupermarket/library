window.onload = function () {
  lsTest();
  if (sessionStorage.getItem("google pending")) {
    displaySigningIn("start", "vet");
    googleOnRedirect();
    sessionStorage.removeItem("google pending");
  } else {
    displaySigningIn("start", "vet");
    userTest().then(() => {
      if (loggedIn) {
        refreshDisplay().then(() => {
          displaySigningIn("end");
          displaySignedIn();
        });
      } else {
        setTimeout(() => displaySigningIn("end"), 1000);
        refreshDisplay();
      }
    });
  }
  searchBar.value = "";
};

let myLibrary = [];
let loggedIn;
let local = true;

function lsTest() {
  var test = "test";
  try {
    localStorage.setItem("test", test);
    localStorage.removeItem(test);
    return (local = true);
  } catch (e) {
    return (local = false);
  }
}
function userTest() {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        resolve((loggedIn = true));
      } else {
        resolve((loggedIn = false));
      }
    });
  });
}

function set(name, item) {
  loggedIn
    ? upToFb(name, item)
    : local
    ? localStorage.setItem(name, JSON.stringify(item))
    : null;
}
function get(name) {
  var item;

  loggedIn
    ? (item = dlFromFb(name))
    : localStorage.name
    ? (item = JSON.parse(localStorage.getItem(name)))
    : (item = null);

  if (!item) {
    name === "library" ? (item = []) : (item = 4);
  }
  return item;
}

function refreshDisplay() {
  if (loggedIn) {
    return new Promise((resolve) => {
      pullItems()
        .then(() => {
          resolve(afterPullItems());
        })
        .catch((error) => {
          console.log(error);
        });

      function pullItems() {
        return new Promise((resolve) => {
          get("library")
            .then((library) => {
              resolve((myLibrary = library));
            })
            .then(() => {
              get("sample counter").then((counter) => {
                sampleCounter.value = counter;
              });
            });
        });
      }
    });
  } else {
    myLibrary = get("library");
    sampleCounter.value = get("sample counter");
    afterPullItems();
  }

  function afterPullItems() {
    removeCurrentLib();
    myLibrary.length === 0
      ? displaySampleBook(sampleCounter.value)
      : displayLibrary();
    checkBookCtn();
  }
}
function removeCurrentLib() {
  document
    .querySelectorAll(".book-wrapper")
    .forEach((book) => book.parentNode.removeChild(book));
}
function displayLibrary() {
  myLibrary.forEach((book) => displayBook(book));
}

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
    checkBookCtn();
  }
});
function addBookToLibrary() {
  const bookTitle = newBookForm.querySelector("input[name = book-title]").value;
  const bookAuthor = newBookForm.querySelector("input[name = author]").value;
  const bookPages = newBookForm.querySelector("input[name = pages-read]").value;

  let bookStatus;
  const readRadio = newBookForm.querySelectorAll("input[name = read]");
  for (i = 0; i < readRadio.length; i++) {
    if (readRadio[i].checked) {
      bookStatus = readRadio[i].value;
      i = readRadio.length;
    }
  }
  let bookCover;
  const coverRadio = newBookForm.querySelectorAll("input[name = cover-color]");
  for (i = 0; i < coverRadio.length; i++) {
    if (coverRadio[i].checked) {
      bookCover = coverRadio[i].value;
      i = coverRadio.length;
    }
  }
  let bookAccent;
  const accentRadio = newBookForm.querySelectorAll(
    "input[name = accent-color]"
  );
  for (i = 0; i < accentRadio.length; i++) {
    if (accentRadio[i].checked) {
      bookAccent = accentRadio[i].value;
      i = accentRadio.length;
    }
  }

  let id;
  if (myLibrary.length === 0) {
    id = 0;
  } else if (typeof myLibrary[myLibrary.length - 1].id != "number") {
    const revLibrary = myLibrary.slice().reverse();
    const lastRealBook = revLibrary.find((book) => {
      if (typeof book.id == "number") return book;
    });
    lastRealBook ? (id = +lastRealBook.id + 1) : (id = 0);
  } else {
    id = +myLibrary[myLibrary.length - 1].id + 1;
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
  set("library", myLibrary);
  return newBook;
}

function displayBook(a) {
  const section = document.querySelector(`.section[data-name = "${a.status}"]`);
  const bookContainer = section.querySelector(".book-ctn");
  const bookWrapper = document.createElement("div");
  const bookDisplay = document.createElement("div");

  bookWrapper.classList.add("book-wrapper");
  bookWrapper.setAttribute("draggable", "true");
  bookWrapper.dataset.status = a.status;
  bookWrapper.id = a.id;
  bookWrapper.addEventListener("dragstart", onDragStart);

  const bulkUpdateCheck = document.createElement("input");
  bulkUpdateCheck.type = "checkbox";
  bulkUpdateCheck.value = a.id;
  bulkUpdateCheck.name = "bulk-update";
  bulkUpdateCheck.classList.add("bulk-update-check", "drawn-border");
  bookWrapper.appendChild(bulkUpdateCheck);

  bookDisplay.classList.add("book-display", "drawn-border");
  bookDisplay.style.backgroundColor = `${a.cover}`;
  if (a.cover === "#2C514C") bookDisplay.style.color = "white";
  bookWrapper.appendChild(bookDisplay);

  const firstPage = document.createElement("div");
  firstPage.classList.add("first-page");

  function displayFirstPage() {
    const bookDisplayTitle = document.createElement("p");
    bookDisplayTitle.classList.add("book-display-title");
    bookDisplayTitle.innerHTML = `<span>${a.title}</span>`;
    if (!a.title) bookDisplayTitle.innerHTML = `<span>&nbsp</span>`;
    bookDisplayTitle.style.borderLeft = `5px solid ${a.accent}`;

    const bookDisplayAuthor = document.createElement("p");
    bookDisplayAuthor.classList.add("book-display-author");
    bookDisplayAuthor.innerHTML = `<span>${a.author}</span>`;
    if (!a.author) bookDisplayAuthor.innerHTML = `<span>&nbsp</span>`;

    return [bookDisplayTitle, bookDisplayAuthor];
  }

  const firstPageContents = displayFirstPage();
  if (firstPageContents[0].textContent.includes("sample bosampleok"))
    bookWrapper.classList.add("sample-book");

  firstPage.appendChild(firstPageContents[0]);
  firstPage.appendChild(firstPageContents[1]);

  function createRemoveBtn() {
    const removeBookBtn = document.createElement("div");
    removeBookBtn.classList.add("remove-book-btn", "drawn-border", "inactive");
    removeBookBtn.textContent = "remove book";
    removeBookBtn.dataset.id = a.id;
    const currentBook = removeBookBtn.dataset.id;

    removeBookBtn.addEventListener("click", () => {
      showPopUp(currentBook);
    });

    return removeBookBtn;
  }
  const removeBookBtn = createRemoveBtn();
  bookWrapper.appendChild(removeBookBtn);

  const secondPage = document.createElement("div");
  secondPage.classList.add("second-page");
  if (a.cover === "#FFF") {
    secondPage.style.borderLeft = "1px solid var(--main-font)";
  } else {
    secondPage.style.borderLeft = "1px solid white";
  }

  function displayPages() {
    const bookDisplayPages = document.createElement("div");
    bookDisplayPages.classList.add("book-display-pages");
    bookDisplayPages.textContent = `Pages read: `;
    const bookDisplayPagesNum = document.createElement("p");
    bookDisplayPagesNum.classList.add("book-display-pages-num");
    bookDisplayPagesNum.innerHTML = `<span>${a.pages}</span>`;
    if (!a.pages) bookDisplayPagesNum.innerHTML = `<span>&nbsp</span>`;
    bookDisplayPages.appendChild(bookDisplayPagesNum);

    return bookDisplayPages;
  }
  const bookDisplayPages = displayPages();

  function displayCoverColor() {
    const coverRadio = newBookForm.querySelector("#cover-color");
    const bookDisplayCover = coverRadio.cloneNode(true);
    const bookDisplayCoverText = bookDisplayCover.children[0];
    const bookDisplayCoverLabel = bookDisplayCover.querySelectorAll("label");
    for (i = 0; i < bookDisplayCoverLabel.length; i++) {
      const bookDisplayCoverName =
        bookDisplayCoverLabel[i].querySelector("span");
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

    return bookDisplayCover;
  }
  const bookDisplayCover = displayCoverColor();

  function displayAccentColor() {
    const accentRadio = newBookForm.querySelector("#accent-color");
    const bookDisplayAccent = accentRadio.cloneNode(true);
    const bookDisplayAccentText = bookDisplayAccent.children[0];
    const bookDisplayAccentLabel = bookDisplayAccent.querySelectorAll("label");
    for (i = 0; i < bookDisplayAccentLabel.length; i++) {
      const bookDisplayAccentName =
        bookDisplayAccentLabel[i].querySelector("span");
      bookDisplayAccentName.style.display = "none";
    }

    const bookDisplayAccentInput = bookDisplayAccent.querySelectorAll("input");
    for (i = 0; i < bookDisplayAccentInput.length; i++) {
      if (a.accent === bookDisplayAccentInput[i].value)
        bookDisplayAccentInput[i].checked = true;
      bookDisplayAccentInput[i].name = `accent-color[${a.id}]`;
    }

    bookDisplayAccentText.textContent = "Your accent:";
    bookDisplayAccent.classList.add("book-display-accent");

    return bookDisplayAccent;
  }

  const bookDisplayAccent = displayAccentColor();

  secondPage.appendChild(bookDisplayPages);
  secondPage.appendChild(bookDisplayCover);
  secondPage.appendChild(bookDisplayAccent);

  (function changeColor() {
    const coverDisplayRadio = secondPage.querySelectorAll(
      `input[name="cover-color[${a.id}]"]`
    );
    coverDisplayRadio.forEach((radio) =>
      radio.addEventListener("change", (e) => {
        bookDisplay.style.backgroundColor = e.target.value;
        if (e.target.value === "#2C514C") {
          secondPage.style.borderLeft = "1px solid white";
          bookDisplay.style.color = "white";
        } else {
          secondPage.style.borderLeft = "1px solid var(--main-font)";
          bookDisplay.style.color = "#2C514C";
        }
      })
    );

    const accentDisplayRadio = secondPage.querySelectorAll(
      `input[name="accent-color[${a.id}]"]`
    );
    accentDisplayRadio.forEach((radio) =>
      radio.addEventListener("change", (e) => {
        const bookDisplayTitle = firstPage.querySelector(".book-display-title");
        bookDisplayTitle.style.borderLeft = `5px solid ${e.target.value}`;
      })
    );
  })();

  (function editBookColor() {
    const radioBtns = secondPage.querySelectorAll("input[type=radio]");
    radioBtns.forEach((btn) =>
      btn.addEventListener("change", (e) => {
        e.target.name.includes("accent")
          ? (myLibrary[whereIsBook(a.id)].accent = e.target.value)
          : (myLibrary[whereIsBook(a.id)].cover = e.target.value);
        set("library", myLibrary);
      })
    );
  })();

  (function openBookDisplay() {
    firstPage.addEventListener("click", () => {
      if (!bookDisplay.classList.contains("book-display-update")) {
        bookWrapper.style.transform = "translateY(-1rem)";
        bookWrapper.setAttribute("draggable", "false");
        bookDisplay.classList.add("book-display-update");
        firstPageContents[0].setAttribute("contenteditable", "true");
        firstPageContents[1].setAttribute("contenteditable", "true");
        bookDisplayPages.firstElementChild.setAttribute(
          "contenteditable",
          "true"
        );
        secondPage.style.opacity = "1";
        exitBtn.classList.remove("inactive");
        removeBookBtn.classList.remove("inactive");

        editBookText();

        bookDisplay.ontransitionend = checkOverflow;

        // setTimeout(checkOverflow, 200);
      }
    });
  })();

  function editBookText() {
    const contentEditable = bookDisplay.querySelectorAll(
      "[contenteditable=true]"
    );
    contentEditable.forEach((p) =>
      p.addEventListener("input", () => {
        switch (p.classList.value) {
          case "book-display-title":
            myLibrary[whereIsBook(bookWrapper.id)].title = p.textContent;
            break;
          case "book-display-author":
            myLibrary[whereIsBook(bookWrapper.id)].author = p.textContent;
            break;
          case "book-display-pages-num":
            myLibrary[whereIsBook(bookWrapper.id)].pages = p.textContent;
        }
        set("library", myLibrary);
      })
    );
  }

  const exitBtn = document.createElement("div");
  exitBtn.classList.add("exit", "drawn-border", "inactive");
  exitBtn.textContent = "X";
  bookWrapper.appendChild(exitBtn);
  exitBtn.addEventListener("click", closeBookDisplay);

  function closeBookDisplay() {
    bookWrapper.style.transform = "translateY(0)";
    bookWrapper.setAttribute("draggable", "true");
    bookDisplay.classList.remove("book-display-update");
    secondPage.style.opacity = "0";
    firstPageContents[0].setAttribute("contenteditable", "false");
    firstPageContents[1].setAttribute("contenteditable", "false");
    bookDisplayPages.firstElementChild.setAttribute("contenteditable", "false");
    exitBtn.classList.add("inactive");
    removeBookBtn.classList.add("inactive");

    bookDisplay.ontransitionend = checkOverflow;
  }

  bookDisplay.appendChild(firstPage);
  bookDisplay.appendChild(secondPage);

  bookContainer.prepend(bookWrapper);

  return bookWrapper;
}
let currentBook;
const removeBookPopUp = document.querySelector(".pop-up");
function showPopUp(book) {
  removeBookPopUp.classList.remove("inactive");
  return (currentBook = book);
}
const yesBtn = removeBookPopUp.querySelector(".yes-btn");
const noBtn = removeBookPopUp.querySelector(".no-btn");

yesBtn.addEventListener("click", () => {
  myLibrary.splice(whereIsBook(currentBook), 1);
  set("library", myLibrary);
  document.getElementById(currentBook).remove();
  removeBookPopUp.classList.add("inactive");
  checkBookCtn();
});
noBtn.addEventListener("click", () => {
  removeBookPopUp.classList.add("inactive");
});

const whereIsBook = (bookId) => {
  for (i = 0; i < myLibrary.length; i++)
    if (bookId == myLibrary[i].id) return i;
};

function onDragStart(event) {
  let obj = { id: event.target.id, dataset: event.target.dataset.status };
  event.dataTransfer.setData("text/plain", JSON.stringify(obj));
}
function onDragEnter(event) {
  event.preventDefault();
  const section = findSection(event);
  section.classList.add("drag-over");
}
function onDragLeave(event) {
  const section = findSection(event);
  section.classList.remove("drag-over");
}
function onDragOver(event) {
  event.preventDefault();
  const section = findSection(event);
  section.classList.add("drag-over");
}
function onDrop(event) {
  event.preventDefault();

  const section = findSection(event);
  section.classList.remove("drag-over");

  const objStr = event.dataTransfer.getData("text/plain");
  const obj = JSON.parse(objStr);
  const draggableElement = document.getElementById(obj.id);
  let dropzone = event.target;

  let i = 0;
  while (!dropzone.getAttribute("ondrop") && i < 7) {
    dropzone = dropzone.parentElement;
    i++;
  }
  if (obj.dataset == dropzone.dataset.status) return false;

  dropzone.prepend(draggableElement);
  draggableElement.dataset.status = dropzone.dataset.status;
  myLibrary[whereIsBook(obj.id)].status = dropzone.dataset.status;
  myLibrary.push(myLibrary[whereIsBook(obj.id)]);
  myLibrary.splice(whereIsBook(obj.id), 1);
  set("library", myLibrary);

  checkBookCtn();
}
function findSection(event) {
  let section = event.target;
  let i = 0;
  while (!section.getAttribute("data-name") && i < 40) {
    section = section.parentElement;
    i++;
  }
  return section;
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

const sampleCounter = document.getElementsByName("sample-book-counter")[0];
sampleCounter.addEventListener("input", () => {
  removeSampleBook();
  displaySampleBook(sampleCounter.value);
  set("sample counter", sampleCounter.value);
  set("library", myLibrary);
  checkBookCtn();
});

function removeSampleBook() {
  const sampleBooks = document.querySelectorAll(".sample-book");
  for (let i = 0; i < sampleBooks.length; i++) sampleBooks[i].remove();
  myLibrary = myLibrary.filter(checkId);
}
function checkId(obj) {
  if (typeof obj.id === "number") return obj;
}
function displaySampleBook(counter) {
  if (counter > 20) counter = 20;
  const bookStatusArr = [
    "currently reading",
    "haven't started",
    "wishlist",
    "finished",
  ];
  const coverRadios = newBookForm.querySelectorAll("input[name=cover-color]");
  const accentRadios = newBookForm.querySelectorAll("input[name=accent-color]");
  let bookCounter = 0;
  for (let i = 0; i < +counter; i++) {
    for (let n = 0; n < bookStatusArr.length; n++) {
      const sampleBook = new Book(
        `sample book${bookCounter}`,
        `sample author${bookCounter}`,
        `${Math.floor(Math.random() * 5000)}`,
        bookStatusArr[n],
        `${coverRadios[Math.floor(Math.random() * 2)].value}`,
        `${accentRadios[Math.floor(Math.random() * 5)].value}`,
        `sample-book${bookCounter++}`
      );
      displayBook(sampleBook).classList.add("sample-book");
      myLibrary.push(sampleBook);
    }
  }
}
const modalBulk = document.querySelector(".modal-bulk");
const bulkEditForm = document.querySelector("form[name=bulk-update]");
function showBulkForm() {
  modalBulk.style.cssText = "display: grid; place-items: center;";
}
function bulkUpdate() {
  let checkedBooks = [];
  const bulkUpdateChecked = document.querySelectorAll(
    "input[name=bulk-update]:checked"
  );

  for (i = 0; i < bulkUpdateChecked.length; i++) {
    checkedBooks.push(bulkUpdateChecked[i].value);
    bulkUpdateChecked[i].checked = false;
  }

  const bookTitle = bulkEditForm.querySelector(
    "input[name = book-title]"
  ).value;
  const bookAuthor = bulkEditForm.querySelector("input[name = author]").value;
  const bookPages = bulkEditForm.querySelector(
    "input[name = pages-read]"
  ).value;
  let bookStatus;
  const readRadio = bulkEditForm.querySelectorAll("input[name = read]");
  for (i = 0; i < readRadio.length; i++) {
    if (readRadio[i].checked) {
      bookStatus = readRadio[i].value;
      i = readRadio.length;
    }
  }
  let bookCover;
  const coverRadio = bulkEditForm.querySelectorAll("input[name = cover-color]");
  for (i = 0; i < coverRadio.length; i++) {
    if (coverRadio[i].checked) {
      bookCover = coverRadio[i].value;
      i = coverRadio.length;
    }
  }
  let bookAccent;
  const accentRadio = bulkEditForm.querySelectorAll(
    "input[name = accent-color]"
  );
  for (i = 0; i < accentRadio.length; i++) {
    if (accentRadio[i].checked) {
      bookAccent = accentRadio[i].value;
      i = accentRadio.length;
    }
  }

  for (n = 0; n < checkedBooks.length; n++) {
    const book = whereIsBook(checkedBooks[n]);
    bookWrapper = document.getElementById(checkedBooks[n]);
    if (bookTitle) {
      myLibrary[book].title = bookTitle;
      const bookDisplayTitle = bookWrapper.querySelector(".book-display-title");
      bookDisplayTitle.innerHTML = `<span>${bookTitle}</span>`;
    }
    if (bookAuthor) {
      myLibrary[book].author = bookAuthor;
      const bookDisplayAuthor = bookWrapper.querySelector(
        ".book-display-author"
      );
      bookDisplayAuthor.innerHTML = `<span>${bookAuthor}</span>`;
    }
    if (bookPages) {
      myLibrary[book].pages = bookPages;
      const bookDisplayPages = bookWrapper.querySelector(
        ".book-display-pages-num"
      );
      bookDisplayPages.innerHTML = `<span>${bookPages}</span>`;
    }
    if (bookCover) {
      const secondPage = bookWrapper.querySelector(".second-page");
      const bookDisplay = bookWrapper.querySelector(".book-display");
      bookDisplay.style.backgroundColor = bookCover;
      if (bookCover === "#2C514C") {
        secondPage.style.borderLeft = "1px solid white";
        bookDisplay.style.color = "white";
      } else {
        secondPage.style.borderLeft = "1px solid var(--main-font)";
        bookDisplay.style.color = "#2C514C";
      }
      const coverInputs = bookWrapper.querySelectorAll(
        `input[name="cover-color[${+checkedBooks[n]}]"`
      );
      for (i = 0; i < coverInputs.length; i++) {
        if (bookCover == coverInputs[i].value) {
          coverInputs[i].checked = true;
          i = coverInputs.length;
        }
      }
      myLibrary[book].cover = bookCover;
    }
    if (bookAccent) {
      const bookDisplayTitle = bookWrapper.querySelector(".book-display-title");
      bookDisplayTitle.style.borderLeft = `5px solid ${bookAccent}`;
      const accentInputs = bookWrapper.querySelectorAll(
        `input[name="accent-color[${+checkedBooks[n]}]"`
      );
      for (i = 0; i < accentInputs.length; i++) {
        if (bookAccent == accentInputs[i].value) {
          accentInputs[i].checked = true;
          i = accentInputs.length;
        }
      }
      myLibrary[book].accent = bookAccent;
    }
    if (bookStatus) {
      const newSection = document.querySelector(
        `.book-ctn[data-status="${bookStatus}"]`
      );
      newSection.prepend(bookWrapper);
      bookWrapper.dataset.status = bookStatus;
      myLibrary[book].status = bookStatus;
      myLibrary.push(myLibrary[book]);
      myLibrary.splice(book, 1);
    }
  }
  modalBulk.style.display = "none";
  resetModalAndForm(modalBulk, "bulk-update");

  checkBookCtn();
  set("library", myLibrary);
}

const modalSequence = newBookForm.querySelectorAll(".modal-sequence");
const nextModalBtns = newBookForm.querySelectorAll(".next-modal");
let modalNumber = 0;
nextModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const currentModal =
      newBookForm.querySelectorAll(".modal-sequence")[modalNumber];
    if (validateForm() === true) {
      if (btn.value === "Submit") {
        resetModalAndForm(modal, "new-book");
        return;
      }
      const nextModal =
        newBookForm.querySelectorAll(".modal-sequence")[++modalNumber];
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
    const currentModal =
      newBookForm.querySelectorAll(".modal-sequence")[modalNumber];
    const prevModal =
      newBookForm.querySelectorAll(".modal-sequence")[--modalNumber];

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
  modalNumber = 0;
}
function resetInvalid(popUp) {
  const invalids = popUp.querySelectorAll(".invalid");
  invalids.forEach((field) => field.classList.remove("invalid"));
}
window.onclick = function (e) {
  if (e.target == modal) {
    return resetModalAndForm(modal, "new-book");
  } else if (e.target == modalBulk) {
    return resetModalAndForm(modalBulk, "bulk-update");
  } else if (e.target == modalSignIn) {
    return resetModalAndForm(modalSignIn, "signin");
  } else if (e.target == modalSignUp) {
    return resetModalAndForm(modalSignUp, "signup");
  }
};
const exitBulk = bulkEditForm.querySelector(".exit");
exitBulk.addEventListener("click", function () {
  resetModalAndForm(modalBulk, "bulk-update");
});
const exitModal = newBookForm.querySelectorAll(".exit");
exitModal.forEach((btn) =>
  btn.addEventListener("click", function () {
    resetModalAndForm(modal, "new-book");
  })
);
function resetModalAndForm(popUp, formName) {
  popUp.style.display = "none";
  resetInvalid(popUp);
  if (popUp === modal) resetModal();
  document.forms[formName].reset();
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

const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", () => {
  const bookWrappers = document.querySelectorAll(".book-wrapper");
  const str = searchBar.value;

  const found = myLibrary
    .filter((obj) => {
      for (key in obj) {
        if (key === "title" || key === "author") {
          if (obj[key].toLowerCase().includes(str.toLowerCase())) {
            return true;
          }
        }
      }
    })
    .map(function (obj) {
      return String(obj.id);
    });
  for (let i = 0; i < bookWrappers.length; i++) {
    if (found.includes(bookWrappers[i].id)) {
      bookWrappers[i].classList.remove("inactive");
    } else {
      bookWrappers[i].classList.add("inactive");
    }
  }

  checkBookCtn();
});

const menuLinks = document.querySelectorAll("li");
menuLinks.forEach((link) =>
  link.addEventListener("click", () => {
    const activeMenu = document.querySelector(".active-menu");
    activeMenu.classList.remove("active-menu");
    link.classList.add("active-menu");
  })
);
const arrowCtn = document.querySelectorAll(".arrow-ctn");
const sections = document.querySelectorAll(".section");
function displayMenu(menuItem) {
  for (i = 0; i < arrowCtn.length; i++) {
    arrowCtn[i].classList.add("inactive");
  }
  for (i = 0; i < sections.length; i++) {
    if (menuItem != sections[i].dataset.name) {
      sections[i].classList.add("inactive");
      sections[i].classList.remove("active-section");
    } else {
      sections[i].classList.remove("inactive");
      sections[i].classList.add("active-section");
    }
  }
}
function displayAll() {
  for (i = 0; i < sections.length; i++) {
    sections[i].classList.remove("active-section");
    sections[i].classList.remove("inactive");
  }
  checkBookCtn();
}

const modalSignUp = document.querySelector(".modal-signup");
const modalSignIn = document.querySelector(".modal-signin");
const exitSignUp = modalSignUp.querySelector(".exit");
exitSignUp.addEventListener("click", function () {
  resetModalAndForm(modalSignUp, "signup");
});
const exitSignIn = modalSignIn.querySelector(".exit");
exitSignIn.addEventListener("click", function () {
  resetModalAndForm(modalSignIn, "signin");
});

function showSignUp() {
  modalSignIn.style.display = "none";
  modalSignUp.style.display = "grid";
  modalSignUp.querySelector("input[name=email-signup]").focus();
}
const signUpForm = modalSignUp.querySelector("form");
const submitSignUp = modalSignUp.querySelector("input[type=button]");
submitSignUp.addEventListener("click", onSubmitSignUp);
function onSubmitSignUp() {
  const signUpInfo = validateSignUp();
  if (!signUpInfo[0]) {
    incompleteFields(signUpForm);
  } else {
    if (loggedIn) firebase.auth().signOut();
    resetModalAndForm(modalSignUp, "signup");
    displaySigningIn("start", "first time");
    firebase
      .auth()
      .createUserWithEmailAndPassword(signUpInfo[1], signUpInfo[2])
      .then((user) => {
        loggedIn = true;
        displaySigningIn("end");
        displayMessage("you're in!", "success");
        displaySignedIn();
        displaySigningIn("end");
        set("library", myLibrary);
        set("sample counter", sampleCounter.value);
      })
      .catch((error) => {
        displayMessage(error, "error");
        displaySigningIn("end");
      });
  }
}

function showSignIn() {
  modalSignIn.style.display = "grid";
  signInEmail.focus();
}
const signInEmail = modalSignIn.querySelector("input[name=email-signin]");
const signInPw = modalSignIn.querySelector("input[name=password-signin]");
const signInBtn = modalSignIn.querySelector("input[type=button]");
signInBtn.addEventListener("click", onSubmitSignIn);
signInPw.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    onSubmitSignIn();
    signInBtn.style.boxShadow = "none";
  }
});
signInPw.addEventListener("keyup", (e) => {
  if (e.key === "Enter")
    setTimeout(function () {
      signInBtn.style.boxShadow = "2px 2px var(--add-new-btn)";
    }, 100);
});
function onSubmitSignIn() {
  if (loggedIn) firebase.auth().signOut();
  firebase
    .auth()
    .signInWithEmailAndPassword(signInEmail.value, signInPw.value)
    .then((user) => {
      resetModalAndForm(modalSignIn, "signin");
      displaySigningIn("start", "vet");
      loggedIn = true;
      refreshDisplay().then((result) => {
        displaySigningIn("end");
        displaySignedIn();
        displayMessage("you're in!", "success");
      });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode) {
        console.log(errorCode);
        displaySigningIn("end");
        const signInForm = modalSignIn.querySelector("form");
        incompleteFields(signInForm);
        signInEmail.classList.add("invalid");
        signInPw.classList.add("invalid");
      }
      if (errorCode.includes("email")) {
        displayMessage("couldn't find that email boss", "error");
      } else if (errorCode.includes("password")) {
        displayMessage("that's not the right password", "error");
      }
    });
}
function resetPw() {
  var auth = firebase.auth();
  var emailAddress = signInEmail.value;
  if (!validateEmail(emailAddress))
    return displayMessage("did you type your email in right?", "error");
  auth
    .sendPasswordResetEmail(emailAddress)
    .then(function () {
      displayMessage("reset password email sent", "success");
    })
    .catch(function (error) {
      displayMessage(error, "error");
    });
}
function signInGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  sessionStorage.setItem("google pending", "pending");
  if (loggedIn) firebase.auth().signOut();
  firebase.auth().signInWithRedirect(provider);
}
function googleOnRedirect() {
  firebase
    .auth()
    .getRedirectResult()
    .then(function (result) {
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // ...
      }
      var user = result.user;
      if (result.additionalUserInfo.isNewUser) {
        refreshDisplay();
        loggedIn = true;
        displaySigningIn("end");
        displaySignedIn();
        displayMessage("you're in!", "success");
        set("library", myLibrary);
        set("sample counter", sampleCounter.value);
      } else {
        loggedIn = true;
        refreshDisplay().then((result) => {
          displaySigningIn("end");
          displaySignedIn();
          displayMessage("you're in!", "success");
        });
      }
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      displaySigningIn("end");
      displayMessage(`${errorMessage}`, "error");
    });
}

function displaySigningIn(state, virgin) {
  const loading = document.querySelector("#signing-in-display");
  const contents = document.querySelector(".content");
  const firstSessImg = loading.querySelector("#first-session");
  const vetUserImg = loading.querySelector("#vet-user");
  const text = loading.querySelector("#signing-in-text");
  const dotDotDot = loading.querySelectorAll(".fade-animate");

  var startAnimate;

  switch (state) {
    case "start":
      contents.classList.add("inactive");
      loading.classList.remove("inactive");

      switch (virgin) {
        case "first time":
          text.textContent = "signing in";
          firstSessImg.classList.remove("inactive");
          vetUserImg.classList.add("inactive");
          break;
        case "vet":
          text.textContent = "grabbing your books";
          firstSessImg.classList.add("inactive");
          vetUserImg.classList.remove("inactive");
          break;
      }

      (function animateDot() {
        let i = 0;
        startAnimate = setInterval(function () {
          if (i === 3) {
            i = -1;
            dotDotDot.forEach((dot) => dot.classList.add("inactive"));
          }
          if (i >= 0) dotDotDot[i].classList.remove("inactive");
          i++;
        }, 500);
      })();

      break;
    case "end":
      clearInterval(startAnimate);
      startAnimate = null;
      loading.classList.add("inactive");
      setTimeout(() => contents.classList.remove("inactive"), 200);
      break;
  }
}
const userEmailText = document.querySelector("#user");
const signedIn = document.querySelector(".signed-in");
function displaySignedIn() {
  signedIn.classList.remove("inactive");
  var user = firebase.auth().currentUser;
  if (user) userEmail = user.email;
  userEmailText.textContent = `hi ${userEmail}`;
}
function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}
function validateSignUp() {
  var valid = true;

  const email = modalSignUp.querySelector("input[name=email-signup]");

  const pass = modalSignUp.querySelector("input[name=password-signup]");
  const passConfirm = modalSignUp.querySelector(
    "input[name=password-confirm-signup]"
  );
  function validatePw(pass) {
    let validPw = true;
    if (passConfirm.value != pass) {
      displayMessage("passwords do not match up", "error");
      validPw = false;
    }
    if (pass.length < 6) {
      displayMessage("password must be at least 6 characters", "error");
      validPw = false;
    }
    return validPw;
  }
  if (!validateEmail(email.value)) {
    email.classList.add("invalid");
    displayMessage("did you type your email in right?", "error");
    valid = false;
  }
  if (!validatePw(pass.value)) {
    pass.classList.add("invalid");
    passConfirm.classList.add("invalid");
    valid = false;
  }
  return [valid, email.value, pass.value];
}
function signOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      signedIn.classList.add("inactive");
      displayMessage("you are signed out", "success");
      loggedIn = false;
      refreshDisplay();
    })
    .catch(function (error) {
      displayMessage(error, "error");
      displaySigningIn("end");
    });
}

function upToFb(name, item) {
  var user = firebase.auth().currentUser;
  var storageRef = firebase.storage().ref();
  var itemRef = storageRef.child(`${user.email}/${name}`);

  itemRef.putString(JSON.stringify(item));
}
function dlFromFb(name) {
  var user = firebase.auth().currentUser;

  var storageRef = firebase.storage().ref();
  var itemRef = storageRef.child(`${user.email}/${name}`);

  return new Promise((resolve) => {
    itemRef
      .getDownloadURL()
      .then(function (url) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.onload = () => resolve(xhr.response);

        xhr.open("GET", url);
        xhr.send();
      })
      .catch(function (error) {
        displayMessage(error, "error");
        return {};
      });
  });
}
function displayMessage(str, type) {
  const messageCtn = document.querySelector("#message");
  messageCtn.textContent = str;
  messageCtn.classList.remove("inactive");
  if (type === "error") {
    messageCtn.classList.remove("success");
    messageCtn.classList.add("error");
  } else {
    messageCtn.classList.remove("error");
    messageCtn.classList.add("success");
  }
  return setTimeout(() => {
    messageCtn.classList.add("inactive");
  }, 1500);
}

let shiftInt;
arrowCtn.forEach((arrow) =>
  arrow.addEventListener("mousedown", () => {
    shiftInt = setInterval(scrollLeft, 1);
    function scrollLeft() {
      if (arrow.firstElementChild.classList.contains("left")) {
        arrow.nextElementSibling.scrollLeft -= 10;
      } else {
        arrow.previousElementSibling.scrollLeft += 10;
      }
    }
  })
);
arrowCtn.forEach((arrow) =>
  arrow.addEventListener("mouseup", function () {
    clearInterval(shiftInt);
  })
);

const bookCtns = document.querySelectorAll(".book-ctn");
function checkBookCtn() {
  for (let i = 0; i < bookCtns.length; i++) {
    const filler = bookCtns[i].querySelector(".nothing-here");
    const bookWrapper = bookCtns[i].querySelector(
      ".book-wrapper:not(.inactive)"
    );
    if (!bookWrapper) {
      filler.classList.remove("inactive");
      toggleArrows(bookCtns[i], "add");
    } else if (bookWrapper) {
      filler.classList.add("inactive");
    }
  }
  checkOverflow();
}
function toggleArrows(bookCtn, action) {
  switch (action) {
    case "add":
      bookCtn.previousElementSibling.classList.add("inactive");
      bookCtn.nextElementSibling.classList.add("inactive");
      break;
    case "remove":
      bookCtn.previousElementSibling.classList.remove("inactive");
      bookCtn.nextElementSibling.classList.remove("inactive");
      break;
  }
}
window.onresize = checkOverflow;
function checkOverflow() {
  for (i = 0; i < bookCtns.length; i++) {
    if (bookCtns[i].scrollWidth <= bookCtns[i].offsetWidth) {
      toggleArrows(bookCtns[i], "add");
    } else {
      toggleArrows(bookCtns[i], "remove");
    }
  }
}
