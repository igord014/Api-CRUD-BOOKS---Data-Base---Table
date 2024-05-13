import os
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

db_path = os.path.join(app.root_path, 'books.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)


@app.route('/')
def index():
    return render_template('index.html')


# Маршрут для добавления книги
@app.route('/api/add_book', methods=['POST'])
def add_book():
    data = request.get_json()  # Получение данных JSON из запроса
    title = data.get('title')  # Получение названия книги из данных
    author = data.get('author')  # Получение автора книги из данных
    if title and author:  # Проверка наличия названия и автора
        new_book = Book(title=title, author=author)  # Создание новой книги
        db.session.add(new_book)  # Добавление книги в сессию базы данных
        db.session.commit()  # Применение изменений в базе данных
        print("Book added:", {'title': title, 'author': author})  # Вывод отладочной информации
        return jsonify({'message': 'Book added successfully'})  # Возврат JSON-ответа об успешном добавлении
    else:
        return jsonify({'message': 'Invalid request'}), 400  # Возврат JSON-ответа о неверном запросе


@app.route('/api/get_books')
def get_books():
    books = Book.query.all()
    book_list = [{'id': book.id, 'title': book.title, 'author': book.author} for book in books]
    print("Books retrieved:", book_list)
    return jsonify({'books': book_list})


@app.route('/api/update_book/<int:id>', methods=['PUT'])
def update_book(id):
    data = request.get_json()
    title = data.get('title')
    author = data.get('author')
    if title and author:
        book = Book.query.get(id)
        if book:
            book.title = title
            book.author = author
            db.session.commit()
            return jsonify({'message': 'Book updated successfully'})
        else:
            return jsonify({'message': 'Book not found'}), 404
    else:
        return jsonify({'message': 'Invalid request'}), 400


@app.route('/api/delete_book/<int:id>', methods=['DELETE'])
def delete_book(id):
    book = Book.query.get(id)
    if book:
        db.session.delete(book)
        db.session.commit()
        return jsonify({'message': 'Book deleted successfully'})
    else:
        return jsonify({'message': 'Book not found'}), 404


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
