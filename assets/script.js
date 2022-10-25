var books = new Array();
var tempBooks = new Array();

const SHELF_UPDATE = 'shelf-update';
const STORAGE_KEY = 'saved-book';

const buttonAdd = document.getElementById('button-add-book');
const searchField = document.getElementById('search-book');

document.addEventListener(SHELF_UPDATE, function() {
    const shelfs = document.querySelectorAll('.shelf');
    shelfs[0].innerHTML = '<h4>Belum Selesai Dibaca</h4>';
    shelfs[1].innerHTML = '<h4>Selesai Dibaca</h4>';

    for (const book of books) {
        const newBookElement = generateBookElement(book);
        if (!book.isCompleted) {
            shelfs[0].append(newBookElement);
        } else {
            shelfs[1].append(newBookElement);
        }
    }

    saveBook();
});

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem(STORAGE_KEY) !== null) {
        loadBook();
        document.dispatchEvent(new Event(SHELF_UPDATE));
    }
});

buttonAdd.addEventListener('click', function(event) {
    event.preventDefault();

    //getting form objects
    const titleText = document.getElementById('title');
    const authorText = document.getElementById('author');
    const yearText = document.getElementById('year');
    const completeCheck = document.getElementById('complete');

    const title = titleText.value;
    const author = authorText.value;
    const year = yearText.value;
    const isComplete = completeCheck.checked;

    if (title === '' || author === '' || year === '') {
        alert('Detail buku tidak boleh kosong!');
        return;
    }

    //adding new book object to books array
    addNewBook(title, author, year, isComplete);
    
    titleText.value = '';
    authorText.value = '';
    yearText.value = '';
    completeCheck.checked = false;


    document.dispatchEvent(new Event(SHELF_UPDATE));
});

searchField.addEventListener('input', function(event) {
    event.preventDefault();
    const shelfs = document.querySelectorAll('.shelf');

    if (this.value === null || this.value === '') {
        document.dispatchEvent(new Event(SHELF_UPDATE));
        return;
    }

    tempBooks = filterBook(this.value);
    shelfs[0].innerHTML = '<h4>Belum Selesai Dibaca</h4>';
    shelfs[1].innerHTML = '<h4>Selesai Dibaca</h4>';

    for (const book of tempBooks) {
        const newBookElement = generateBookElement(book);
        if (!book.isCompleted) {
            shelfs[0].append(newBookElement);
        } else {
            shelfs[1].append(newBookElement);
        }
    }
});

function addNewBook(title, author, year, isComplete) {
    const newBook = generateBookObject(title, author, year, isComplete);
    books.push(newBook);
}

function generateBookObject(title, author, year, isComplete) {
    return {
        id: generateId(),
        title: title,
        author: author,
        year: year,
        isCompleted: isComplete,
    }
}

function generateBookElement(bookObject) {
    const {title, author, year} = bookObject;
    const element = document.createElement('div');
    element.classList.add('book');

    //title
    const titleText = document.createElement('span');
    titleText.classList.add('book-title');
    titleText.innerText = title;

    //author
    const authorText = document.createElement('p');
    authorText.innerText = author;

    //year
    const yearText = document.createElement('p');
    yearText.innerText = year;

    //button
    const buttonContainer = document.createElement('div');
    const buttonMark = document.createElement('button');
    const buttonDelete = document.createElement('button');

    //spesifying class
    buttonContainer.classList.add('book-buttons');
    buttonMark.classList.add('mark');
    buttonDelete.classList.add('delete');

    //specifying button innerText
    if (!bookObject.isCompleted){
        buttonMark.innerText = 'Tandai Selesai';
    } else {
        buttonMark.innerText = 'Tandai Belum Selesai';
    }

    buttonDelete.innerText = 'Hapus';

    //adding click listener for each book's button
    const bookId = bookObject.id;
    buttonMark.addEventListener('click', function() {
        setBookMark(bookId);
        document.dispatchEvent(new Event(SHELF_UPDATE));
    });

    buttonDelete.addEventListener('click', function() {
        deleteBook(bookId);
        document.dispatchEvent(new Event(SHELF_UPDATE));
    });

    buttonContainer.append(buttonMark, buttonDelete);
    element.append(titleText, authorText, yearText, buttonContainer);
    return element;
}

function generateId() {
    return +new Date();
}

function setBookMark(id) {
    for (const book of books) {
        if (id === book.id) {
            book.isCompleted = !book.isCompleted;
        }
    }
}

function deleteBook(id) {
    // returns the index of book with desired ID
    const index = books.findIndex(Object => {
        return Object.id === id;
    });
    books.splice(index, 1);        
}

function saveBook() {
    const bookJSON = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, bookJSON);
}

function loadBook() {
    const savedBook = localStorage.getItem(STORAGE_KEY);
    books = JSON.parse(savedBook);
}

function filterBook(str) {
    let temp = [];
    for (const book of books) {
        if (
            book.title.toLowerCase().includes(str)||
            book.author.toLowerCase().includes(str) ||
            book.year.toLowerCase().includes(str)
        ){
            temp.push(book);
        }
    }

    return temp;
}
