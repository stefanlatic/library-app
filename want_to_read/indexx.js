// Selectors
const bookInput = document.querySelector('.book-input');
const authorInput = document.querySelector('.author-input');
const bookList = document.querySelector('.books-list');
const newBookButton = document.querySelector('.new-book-button');

let headerAdded = false;

// Event Listeners
document.addEventListener('DOMContentLoaded', getBooksAndAuthors);
newBookButton.addEventListener("click", addBook);
bookList.addEventListener("click", deleteList);

// Functions
function addHeader() {
    if (!headerAdded) {
        const newHeader = document.createElement('h2');
        newHeader.innerText = "My Library";
        newHeader.classList.add("library-title");
        bookList.appendChild(newHeader);
        headerAdded = true;
    }
}

function removeHeader() {
    const header = document.querySelector('.library-title');
    if (header) {
        bookList.removeChild(header);
        headerAdded = false;
    }
}

function deleteList(e) {
    const item = e.target;
    if (item.classList[0] === 'trash-button') {
        const booksDiv = item.parentElement;
        
        const bookName = booksDiv.querySelector('.book-name').innerText.replace(/"/g, '');
        booksDiv.remove();
        removeBookFromLocalStorage(bookName);

        const remainingBooks = bookList.querySelectorAll('.books');
        if (remainingBooks.length === 0) {
            removeHeader(); 
        }
    }
}

function saveLocalBooksAndAuthors(book, author) {
    let books = localStorage.getItem("books") ? JSON.parse(localStorage.getItem("books")) : [];
    let authors = localStorage.getItem("authors") ? JSON.parse(localStorage.getItem("authors")) : [];

    books.push(book);
    authors.push(author);

    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("authors", JSON.stringify(authors));
}

function getBooksAndAuthors() {
    let books = localStorage.getItem("books") ? JSON.parse(localStorage.getItem('books')) : [];
    let authors = localStorage.getItem("authors") ? JSON.parse(localStorage.getItem('authors')) : [];
    
    if (books.length === 0) {
        removeHeader(); 
        return; 
    }
    addHeader(); 

    if (books.length === authors.length) {
        books.forEach(function(book, index) {
            const bookDiv = document.createElement("div");
            bookDiv.classList.add("books");

            const newBook = document.createElement('li');
            newBook.innerText = `"${book}"`;
            newBook.classList.add('book-name');
            bookDiv.appendChild(newBook);

            const newAuthor = document.createElement('li');
            newAuthor.innerText = authors[index];
            newAuthor.classList.add('author-name');
            bookDiv.appendChild(newAuthor);

            const trashButton = document.createElement('button');
            trashButton.innerHTML = '<span class="material-symbols-outlined"> delete </span>';
            trashButton.classList.add("trash-button");
            bookDiv.appendChild(trashButton);

            bookList.appendChild(bookDiv);
        });
    }
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeFirstLetters(string) {
    return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function addBook(event) {
    event.preventDefault();
    const bookName = capitalizeFirstLetter(bookInput.value.trim());
    const authorName = capitalizeFirstLetters(authorInput.value.trim());

    if (bookName === "" || authorName === "") {
        alert("Please enter both book name and author.");
        return;
    }

    addHeader(); 

    const bookDiv = document.createElement("div");
    bookDiv.classList.add("books");

    const newBook = document.createElement('li');
    newBook.innerText = `"${bookName}"`;
    newBook.classList.add('book-name');
    bookDiv.appendChild(newBook);

    const newAuthor = document.createElement('li');
    newAuthor.innerText = authorName;
    newAuthor.classList.add('author-name');
    bookDiv.appendChild(newAuthor);

    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<span class="material-symbols-outlined"> delete </span>';
    trashButton.classList.add("trash-button");
    bookDiv.appendChild(trashButton);

    bookList.appendChild(bookDiv);

    saveLocalBooksAndAuthors(bookName, authorName);

    bookInput.value = "";
    authorInput.value = "";
}

function removeBookFromLocalStorage(bookName) {
    let books = localStorage.getItem("books") ? JSON.parse(localStorage.getItem("books")) : [];
    let authors = localStorage.getItem("authors") ? JSON.parse(localStorage.getItem("authors")) : [];

    const index = books.indexOf(bookName);
    if (index !== -1) {
        
        books.splice(index, 1);
        authors.splice(index, 1);

        localStorage.setItem("books", JSON.stringify(books));
        localStorage.setItem("authors", JSON.stringify(authors));
    }
}