from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from backend.models.vote_model import Vote

vote_bp = Blueprint('votes', __name__)

@vote_bp.route('/votes', methods=['POST'])
def create_vote():
    data = request.json
    required_fields = ['title', 'description', 'options', 'creator_id', 'end_date']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Convert options to proper format
    options = [{"text": opt, "votes": 0} for opt in data['options']]
    
    new_vote = Vote(
        title=data['title'],
        description=data['description'],
        options=options,
        creator_id=data['creator_id'],
        end_date=data['end_date']
    )
    
    result = new_vote.save()
    return jsonify({
        "message": "Vote created successfully",
        "vote_id": str(result.inserted_id)
    }), 201

@vote_bp.route('/votes', methods=['GET'])
def get_all_votes():
    votes = Vote.find_all()
    # Convert ObjectId to string
    for vote in votes:
        vote['_id'] = str(vote['_id'])
    return jsonify(votes), 200

@vote_bp.route('/votes/<vote_id>', methods=['GET'])
def get_vote(vote_id):
    vote = Vote.find_by_id(ObjectId(vote_id))
    if vote:
        vote['_id'] = str(vote['_id'])
        return jsonify(vote), 200
    return jsonify({"error": "Vote not found"}), 404

@vote_bp.route('/votes/<vote_id>/vote', methods=['POST'])
def cast_vote(vote_id):
    data = request.json
    if 'option_index' not in data or 'user_id' not in data:
        return jsonify({"error": "Missing option index or user ID"}), 400
    
    success = Vote.add_vote(ObjectId(vote_id), data['option_index'], data['user_id'])
    if success:
        return jsonify({"message": "Vote recorded successfully"}), 200
    return jsonify({"error": "Failed to record vote or user already voted"}), 400