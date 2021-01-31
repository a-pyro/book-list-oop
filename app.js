console.log('Hi there!🔥');
// es 5 oop

// BOOK CONSTRUCTOR => create book objects --------------------------

function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI CONSTRUCTIOR => prototype methods to add, show, delete books --
// vuota, tutti i methodi andranno nel proto
function UI() {}

// aggiungo metodo al prototipo UI
UI.prototype.addBookToList = function (book) {
  const list = document.getElementById('bookList');

  // creo elemento
  const row = document.createElement('tr');

  // inserisco le colonne generando html
  row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href="#" class="delete">X</a></td>
  `;
  // appendo
  list.appendChild(row);
};

// EVENT LISTENERS --------------------------------------------------

document.getElementById('bookForm').addEventListener('submit', function (e) {
  console.log('🔥');
  // prendo i valori del form
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

  // instantiate book
  const book = new Book(title, author, isbn); //creo nuova istanza book

  // nuova istanza UI
  const ui = new UI();

  // aggiungi libro
  ui.addBookToList(book);

  // pulizia ui
  ui.clearFields();

  e.preventDefault();
});
