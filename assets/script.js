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

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;

    if (title === '' || author === '' || year === '') {
        alert('Detail buku tidak boleh kosong!');
        return;
    }

    addNewBook(title, author, year);
    document.dispatchEvent(new Event(SHELF_CHANGE));
});

function addNewBook(title, author, year) {
    const newBook = generateBookObject(title, author, year, false);
    console.log(newBook);
    books.push(newBook);
}

function generateBookObject(title, author, year, isCompleted) {
    return {
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
    buttonContainer.classList.add('book-buttons');
    buttonContainer.innerHTML = '<button>Tandai Selesai</button><button>Hapus</button>'

    element.append(titleText, authorText, yearText, buttonContainer);

    console.log(element);
    console.log(title, author, year)

    return element;
}