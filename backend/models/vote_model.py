from datetime import datetime
from . import db

class Vote:
    def __init__(self, title, description, options, creator_id, end_date):
        self.title = title
        self.description = description
        self.options = options  # List of dicts: [{"text": "Option1", "votes": 0}, ...]
        self.creator_id = creator_id
        self.created_at = datetime.utcnow()
        self.end_date = end_date
        self.voters = []  # List of user IDs who voted

    def save(self):
        db = get_db()
        return db.votes.insert_one({
            "title": self.title,
            "description": self.description,
            "options": self.options,
            "creator_id": self.creator_id,
            "created_at": self.created_at,
            "end_date": self.end_date,
            "voters": self.voters
        })
    
    @staticmethod
    def find_all():
        db = get_db()
        return list(db.votes.find({}, {'_id': 1, 'title': 1, 'description': 1, 'creator_id': 1, 'created_at': 1}))
    
    @staticmethod
    def find_by_id(vote_id):
        db = get_db()
        return db.votes.find_one({"_id": vote_id})
    
    @staticmethod
    def add_vote(vote_id, option_index, user_id):
        db = get_db()
        # Ensure user hasn't voted already
        vote = db.votes.find_one({"_id": vote_id, "voters": user_id})
        if vote:
            return False
        
        # Update vote count and add voter
        result = db.votes.update_one(
            {"_id": vote_id},
            {
                "$inc": {f"options.{option_index}.votes": 1},
                "$push": {"voters": user_id}
            }
        )
        return result.modified_count > 0