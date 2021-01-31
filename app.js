console.log('Hi there!🔥');
const shit = '💩',
  fire = '🔥',
  fuck = '🖕🏻',
  rocket = '🚀';
// es 5 oop

///::::::::::::::::::::::::::::>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// ========== CONSTRUCTORS ================
///::::::::::::::::::::::::::::>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// BOOK CONSTRUCTOR => create book objects --------------------------

function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI CONSTRUCTIOR => prototype methods to add, show, delete books --
// vuota, tutti i methodi andranno nel proto
function UI() {}

// aggiungo metodo al prototipo UI --------------------------
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

// clear fields -------------------------------------------
UI.prototype.clearFields = function () {
  document.getElementById('author').value = '';
  document.getElementById('title').value = '';
  document.getElementById('isbn').value = '';
  document.getElementById('title').focus();
};

// mostra allert -----------------------------------------
UI.prototype.showAlert = function (message, className) {
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
};

// REMOVE BOOK ------------------------------------------------
UI.prototype.deleteBook = function (target) {
  if ((target.className = 'delete')) {
    target.parentElement.parentElement.classList.add('fade-out');
    setTimeout(() => {
      // delego
      target.parentElement.parentElement.remove();
    }, 200);
  }
};

///::::::::::::::::::::::::::::>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// ========== EVENT LISTENERS ================
///::::::::::::::::::::::::::::>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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

  // Validazione input
  if (title === '' || author === '' || isbn === '') {
    console.log('inserisci qualcosa 🖕🏻');
    ui.showAlert('Riempi tutti i campi! 🛠', 'error');
    ui.clearFields();
  } else {
    // aggiungi libro
    ui.addBookToList(book);

    // mostro messaggio successo
    ui.showAlert('Libro aggiunto! Secchione 💩', 'success');

    // pulizia ui
    ui.clearFields();
  }

  e.preventDefault();
});

// LISTENER PER CANCELLARE LIBRI ------------------------------------
// devo delegare evento perchè i libri vengono creati dinamicamente mentre l'app viene usata,quindi  non posso selezionarli direttamente da queste linee di codice perchè non esistono ancora

document.getElementById('bookList').addEventListener('click', (e) => {
  const ui = new UI();
  // delete book nel prototipo => anche la delegazione dell'evento
  ui.deleteBook(e.target);
  ui.showAlert('Libro rimosso, CAPRA 🐑', 'success');

  e.preventDefault();
});
