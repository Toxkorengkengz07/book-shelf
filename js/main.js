// Do your work here...
console.log("Hello, world!");
// Inisialisasi ID elemen penting
const bookForm = document.getElementById("bookForm");
const searchForm = document.getElementById("searchBook");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");

const STORAGE_KEY = "BOOKSHELF_APP";
let books = [];

// Fungsi untuk menambah buku
function addBook(title, author, year, isComplete) {
  const id = +new Date();
  const newBook = { id, title, author, year, isComplete };
  books.push(newBook);
  saveBooks();
}

// Fungsi untuk menyimpan buku ke localStorage
function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  renderBooks();
}

// Fungsi untuk mendapatkan data buku dari localStorage
function loadBooks() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    books = JSON.parse(data);
    renderBooks();
  }
}

// Fungsi untuk merender buku ke layar
function renderBooks() {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  });
}

// Fungsi untuk membuat elemen buku
function createBookElement({ id, title, author, year, isComplete }) {
  const bookItem = document.createElement("div");
  bookItem.classList.add("book-item");
  bookItem.dataset.bookid = id;

  const bookTitle = document.createElement("h3");
  bookTitle.textContent = title;
  bookTitle.dataset.testid = "bookItemTitle";

  const bookAuthor = document.createElement("p");
  bookAuthor.textContent = `Penulis: ${author}`;
  bookAuthor.dataset.testid = "bookItemAuthor";

  const bookYear = document.createElement("p");
  bookYear.textContent = `Tahun: ${year}`;
  bookYear.dataset.testid = "bookItemYear";

  const actionContainer = document.createElement("div");

  const toggleCompleteButton = document.createElement("button");
  toggleCompleteButton.textContent = isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";
  toggleCompleteButton.dataset.testid = "bookItemIsCompleteButton";
  toggleCompleteButton.addEventListener("click", () => toggleBookStatus(id));

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Hapus Buku";
  deleteButton.dataset.testid = "bookItemDeleteButton";
  deleteButton.addEventListener("click", () => deleteBook(id));

  actionContainer.append(toggleCompleteButton, deleteButton);

  bookItem.append(bookTitle, bookAuthor, bookYear, actionContainer);

  return bookItem;
}

// Fungsi untuk menghapus buku
function deleteBook(id) {
  books = books.filter((book) => book.id !== id);
  saveBooks();
}

// Fungsi untuk mengubah status selesai/belum selesai membaca
function toggleBookStatus(id) {
  const book = books.find((book) => book.id === id);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooks();
  }
}

// Fungsi untuk mencari buku berdasarkan judul
function searchBooks(keyword) {
  return books.filter((book) =>
    book.title.toLowerCase().includes(keyword.toLowerCase())
  );
}

// Event listener untuk menambah buku dari form
bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  addBook(title, author, year, isComplete);
  bookForm.reset();
});

// Event listener untuk mencari buku dari form
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const keyword = document.getElementById("searchBookTitle").value;
  const searchResult = searchBooks(keyword);

  // Merender hasil pencarian
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  searchResult.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  });
});

// Memuat buku dari localStorage saat halaman pertama kali dibuka
window.addEventListener("load", () => {
  loadBooks();
});
