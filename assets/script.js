var books = new Array();
const SHELF_CHANGE = 'shelf-change';
const buttonAdd = document.getElementById('button-add-book');

document.addEventListener(SHELF_CHANGE, function() {
    const shelfs = document.querySelectorAll('.shelf');
    shelfs[0].innerHTML = '<h4>Daftar Baca</h4>';
    shelfs[1].innerHTML = '<h4>Selesai Dibaca</h4>';

    for (const book of books) {
        const newBookElement = generateBookElement(book);
        if (!book.isCompleted) {
            shelfs[0].append(newBookElement);
        } else {
            shelfs[1].append(newBookElement);
        }
    }
});

buttonAdd.addEventListener('click', function(event) {
    event.preventDefault();

    //getting form objects
    const titleText = document.getElementById('title');
    const authorText = document.getElementById('author');
    const yearText = document.getElementById('year');

    const title = titleText.value;
    const author = authorText.value;
    const year = yearText.value;

    if (title === '' || author === '' || year === '') {
        alert('Detail buku tidak boleh kosong!');
        return;
    }

    //adding new book object to books array
    addNewBook(title, author, year);
    
    titleText.value = '';
    authorText.value = '';
    yearText.value = '';

    document.dispatchEvent(new Event(SHELF_CHANGE));
});

function addNewBook(title, author, year) {
    const newBook = generateBookObject(title, author, year, false);
    console.log(newBook);
    books.push(newBook);
}

function generateBookObject(title, author, year, isCompleted) {
    return {
        id: generateId(),
        title: title,
        author: author,
        year: year,
        isCompleted: isCompleted,
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
        buttonMark.innerText = 'Tandai Belum Selesai'
    }

    buttonDelete.innerText = 'Hapus';

    //adding click listener for each book's button
    const bookId = bookObject.id;
    buttonMark.addEventListener('click', function() {
        setBookMark(bookId);
        document.dispatchEvent(new Event(SHELF_CHANGE));
    });

    buttonDelete.addEventListener('click', function() {
        deleteBook(bookId);
        document.dispatchEvent(new Event(SHELF_CHANGE));
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
    for (let i = 0; i < books.length; i++) {
        if (id === books[i].id) {
            books.pop(i);
        }
    }
}

