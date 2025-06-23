from flask import Flask
from backend.database.db import connect_db
from backend.routes import vote_routes

app = Flask(__name__)

# Initialize database
connect_db()

# Register blueprints
app.register_blueprint(vote_routes.vote_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)