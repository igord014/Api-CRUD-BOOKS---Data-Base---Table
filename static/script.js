// Этот код выполняется после полной загрузки HTML-страницы
document.addEventListener('DOMContentLoaded', function () {
    // Вызываем функцию getBooks() для получения списка книг
    getBooks();
});

function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    fetch('/api/add_book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: title, author: author })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        getBooks();
    });
}

// Функция для получения списка книг с сервера
function getBooks() {
    // Отправляем GET-запрос на сервер для получения списка книг
    fetch('/api/get_books')
    // После получения ответа, парсим его в формат JSON
    .then(response => response.json())
    // Обрабатываем полученные данные
    .then(data => {
        // Получаем элемент списка книг по его id
        const bookList = document.getElementById('bookList');
        // Очищаем содержимое списка перед добавлением новых данных
        bookList.innerHTML = '';
        // Проходим по каждой книге в списке и добавляем её в таблицу
        data.books.forEach(book => {
            // Создаем новую строку таблицы <tr>
            const row = document.createElement('tr');
            // Создаем ячейки <td> для id, title и author
            const idCell = document.createElement('td');
            const titleCell = document.createElement('td');
            const authorCell = document.createElement('td');
            // Задаем текст ячеек
            idCell.textContent = book.id;
            titleCell.textContent = book.title;
            authorCell.textContent = book.author;
            // Добавляем ячейки в строку таблицы
            row.appendChild(idCell);
            row.appendChild(titleCell);
            row.appendChild(authorCell);
            // Создаем кнопки Edit и Delete для каждой строки
            const editCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = function() { showEditModal(book.id, book.title, book.author); };
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() { deleteBook(book.id); };
            editCell.appendChild(editButton);
            editCell.appendChild(deleteButton);
            row.appendChild(editCell);
            // Добавляем строку в таблицу
            bookList.appendChild(row);
        });
    });
}

// Функция для показа модального окна редактирования книги
function showEditModal(id, title, author) {
    document.getElementById('editId').value = id;
    document.getElementById('editTitle').value = title;
    document.getElementById('editAuthor').value = author;
    document.getElementById('editModal').style.display = 'block';
}

// Функция для закрытия модального окна редактирования книги
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Функция для сохранения отредактированной книги
function saveEditedBook() {
    const id = document.getElementById('editId').value;
    const title = document.getElementById('editTitle').value;
    const author = document.getElementById('editAuthor').value;
    fetch('/api/update_book/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: title, author: author })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        closeEditModal();
        getBooks(); // обновляем список книг после сохранения изменений
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Функция для удаления книги
function deleteBook(id) {
    fetch('/api/delete_book/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        getBooks(); // обновляем список книг после удаления
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
