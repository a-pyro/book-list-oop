class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById('bookList');

    // creo elemento
    const row = document.createElement('tr');

    // inserisco le colonne generando html
    row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a  href="#" class="delete">X</a></td>
  `;
    // appendo
    list.appendChild(row);
  }

  showAlert(message, className) {
    // costruisco elemento
    const alert = document.createElement('div');

    // aggiungo classe
    alert.className = `alert ${className} start`;

    // Aggiungo testo
    alert.appendChild(document.createTextNode(message));

    // entro nel dom
    const container = document.querySelector('.container'); //prendo parente
    const wrapper = document.querySelector('.wrapper');

    container.insertBefore(alert, wrapper);
    wrapper.classList.add('move-wrap-down');
    // add show animation
    setTimeout(() => {
      alert.classList.remove('start');
      alert.classList.add('show');
    }, 100);

    // sparisce dopo time
    setTimeout(() => {
      alert.classList.remove('show');
      alert.classList.add('fade-out');

      setTimeout(() => {
        alert.remove();
        wrapper.classList.remove('move-wrap-down');
      }, 100);
    }, 3000);
  }

  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.classList.add('fade-out');
      setTimeout(() => {
        // delego e rimuovo
        target.parentElement.parentElement.remove();
      }, 200);
      const ui = new UI();
      ui.showAlert('Libro rimosso, CAPRA 🐑', 'success');
    }
  }

  clearFields() {
    document.getElementById('author').value = '';
    document.getElementById('title').value = '';
    document.getElementById('isbn').value = '';
    document.getElementById('title').focus();
  }
}

class Store {
  static getBooks() {
    // se non è null, dammi il json, se è null setta array vuoto
    // const books = JSON.parse(localStorage.getItem('books')) ?? [];
    // return books;
    // oneline:
    return JSON.parse(localStorage.getItem('books')) ?? [];
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => {
      const ui = new UI();
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    console.log(books);

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(target, isbn) {
    if (target.className === 'delete') {
      const books = Store.getBooks();
      books.splice(
        books.findIndex((book) => book.isbn === isbn),
        1
      );
      localStorage.setItem('books', JSON.stringify(books));
    } else {
      return;
    }
  }
}

// DOM LOAD EVENT -----------------------------------------
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// EVENTI PER AGGIUNGERE
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
  console.log(ui);

  // Validazione input
  if (title === '' || author === '' || isbn === '') {
    console.log('inserisci qualcosa 🖕🏻');
    ui.showAlert('Riempi tutti i campi! 🛠', 'error');
    ui.clearFields();
  } else {
    // aggiungi libro
    ui.addBookToList(book);

    // aggiungo a LS
    Store.addBook(book);

    // mostro messaggio successo
    ui.showAlert('Libro aggiunto! Secchione 💩', 'success');

    // pulizia ui
    ui.clearFields();
  }

  e.preventDefault();
});

// Eventi per cancellare
document.getElementById('bookList').addEventListener('click', (e) => {
  const ui = new UI();
  // delete book nel prototipo => anche la delegazione dell'evento
  ui.deleteBook(e.target);

  // per rimuoverli ho bisogno di una chiave unica => ISBN, me la prendo con un po' di dom magia 🪄
  Store.removeBook(
    e.target,
    e.target.parentElement.previousElementSibling.textContent
  );
  e.preventDefault();
});
