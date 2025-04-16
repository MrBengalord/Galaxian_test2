from flask import Flask, send_from_directory

app = Flask(__name__)

# Маршрут для главной страницы
@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

# Маршрут для отдачи статических файлов (JS, CSS, изображения)
@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('../assets', filename)

@app.route('/scripts/<path:filename>')
def custom_scripts(filename):
    return send_from_directory('../scripts', filename)

@app.route('/img/<path:filename>')
def custom_img(filename):
    return send_from_directory('../img', filename)

if __name__ == '__main__':
    app.run(debug=True)