const books = [];
const RENDER_EVENT = 'render_book';

function generateId() {
	return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
	return {
		id, 
		title, 
		author, 
		year, 
		isCompleted
	}	
}

function findBook(bookId) {
	for (const bookItem of books){
		if (bookItem.id === bookId) {
			return bookItem;
		}
	}
	return null;
}

function findBookIndex(bookId) {
	for (const index in books){
		if (books[index].id === bookId) {
			return index;
		}
	}
	return -1;
}

function inputBook(bookObject) {
	const {id, title, author, year, isCompleted} = bookObject;

	const textTitle = document.createElement('h2');
	textTitle.innerText = title;

	const textAuthor = document.createElement('p');
	textAuthor.innerText = innerHTML = 'Penulis : ' + author;

	const textYear = document.createElement('p');
	textYear.innerText = innerHTML = 'Tahun : ' + year;

	const textContainer = document.createElement('div');
	textContainer.classList.add('inner');
	textContainer.append(textTitle, textAuthor, textYear);

	const container = document.createElement('div');
	container.classList.add('item', 'shadow')
	container.append(textContainer);
	container.setAttribute('id', `book-${id}`);

	if (isCompleted) {

		const unreadingButton = document.createElement('button');
		const unreadingButtonText = document.createTextNode("Belum Selesai dibaca");
		unreadingButton.appendChild(unreadingButtonText);
		document.body.appendChild(unreadingButton);

		unreadingButton.addEventListener('click', function () {
			undoReadingFromCompleted(id);
		});

		const trashButton = document.createElement('button');
		const trashButtonText = document.createTextNode("Hapus Buku");
		trashButton.appendChild(trashButtonText);
		document.body.appendChild(trashButton);
		trashButton.addEventListener('click', function () {
			removeBook(id)
		});
		trashButton.className = 'trash-button';

		container.append(unreadingButton, trashButton);

	}else{

		const readingButton = document.createElement('button');
		const readingButtonText = document.createTextNode("Selesai dibaca");
		readingButton.appendChild(readingButtonText);
		document.body.appendChild(readingButton);

		readingButton.addEventListener('click', function () {
			readingCompleted(id);
		});
		const trashButton = document.createElement('button');
		const trashButtonText = document.createTextNode("Hapus Buku");
		trashButton.appendChild(trashButtonText);
		document.body.appendChild(trashButton);
		trashButton.addEventListener('click', function () {
			removeBook(id)
		});
		trashButton.className = 'trash-button';

		container.append(readingButton, trashButton);
	}

	return container;
}

function addBook() {

	const bookTitle = document.getElementById('inputBookTitle').value;
	const bookAuthor = document.getElementById('inputBookAuthor').value;
	const bookYear = document.getElementById('inputBookYear').value;
	const hasCompleted = document.getElementById('inputBookIsComplete').checked;

	const generatedID = generateId();
	const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, hasCompleted);
	books.push(bookObject);
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function readingCompleted(bookId) {
	const bookTarget = findBook(bookId);
	if (bookTarget == null) return;

	bookTarget.isCompleted = true;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function removeBook(bookId) {
	const bookTarget = findBookIndex(bookId);

	if (bookTarget === -1) return;

	books.splice(bookTarget, 1);
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function undoReadingFromCompleted(bookId) {
	const bookTarget = findBook(bookId);

	if (bookTarget == null) return;

	bookTarget.isCompleted = false;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}


document.addEventListener('DOMContentLoaded', function () {
	const submitForm = document.getElementById('inputBook');

	submitForm.addEventListener('submit',function (event) {
		event.preventDefault();
		addBook();
	});

	if (isStorageExist()) {
		loadDataFromStorage();
	}
});

document.addEventListener(RENDER_EVENT, function () {
	const uncompletedReadingBooks = document.getElementById('incompleteBookshelfList');
	const completedReadingBooks = document.getElementById('completeBookshelfList');

	uncompletedReadingBooks.innerHTML = '';
	completedReadingBooks.innerHTML = '';

	for (const bookItem of books){
		const bookElement = inputBook(bookItem);
		if (bookItem.isCompleted) {
			completedReadingBooks.append(bookElement);
		}else {
			uncompletedReadingBooks.append(bookElement);
		}
	}

});


function saveData() {
	if (isStorageExist()) {
		const parsed = JSON.stringify(books);
		localStorage.setItem(STORAGE_KEY, parsed);
		document.dispatchEvent(new Event(SAVED_EVENT))
	}
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
	if (typeof (Storage) === undefined) {
		alert('Browser kamu tidak mendukung local storage');
		return false;
	}
	return true;
}

document.addEventListener(SAVED_EVENT, function () {
	console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializedData);

	if (data !== null) {
		for (const book of data){
			books.push(book);
		}
	}
	document.dispatchEvent(new Event(RENDER_EVENT));
}































































