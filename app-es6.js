class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book, timeout) {
    const list = document.getElementById('bookList');

    // creo elemento
    const row = document.createElement('tr');

    row.className = 'start';

    // inserisco le colonne generando html
    row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a  href="#" class="delete">X</a></td>
  `;

    // appendo
    list.appendChild(row);

    // timeout viene calcolato nel metodo statico Store.displayBooks()
    // quindi aumenta di mezzo secondo ad ogni item
    // serve convertirlo in tempo per inserire l'effetto di translate da sinistra

    setTimeout(() => {
      row.classList.remove('start');
      row.classList.add('show');
    }, timeout);
  }

  showAlert(message, className) {
    // check if there is already a notification active
    const notifications = document.querySelector('.notifications'); //prendo parente
    const alert = document.querySelector('.alert');
    //se c'è già => LOGGO c'è già
    if (alert) {
      console.log('gia notifica');
    } else {
      // costruisco elemento
      const alert = document.createElement('span');

      // aggiungo classe
      alert.className = `alert ${className} notification-start`;

      // Aggiungo testo
      alert.appendChild(document.createTextNode(message));

      // entro nel dom 🚀
      notifications.appendChild(alert);

      // add show animation
      setTimeout(() => {
        alert.classList.remove('notification-start');
        alert.classList.add('notification-in');
      }, 100);

      // sparisce dopo time
      setTimeout(() => {
        alert.classList.remove('notification-in');
        alert.classList.add('notification-end');

        setTimeout(() => {
          alert.remove();
        }, 100);
      }, 3000);
    }
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

  static displayBooks(timeMilliseconds) {
    const books = Store.getBooks();
    const ui = new UI();

    // passo timeMilliseconds con cui calcolo i ms per il timeout dell'animazione in ui.addBookToList
    books.forEach((book, idx) => {
      // uso indice per avere un timeout che cresce ad ogni iterazione
      const timeout = idx * timeMilliseconds;
      ui.addBookToList(book, timeout);
    });
    if (books.length > 0) {
      ui.showAlert('Books Loaded, Welcome Back', 'success');
    }
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
// qui setto il tempo dell'animazione per caricare la lista
document.addEventListener('DOMContentLoaded', Store.displayBooks(50));

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
