from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Candidate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    resume = db.Column(db.String(200))  # chemin vers le CV

    applications = db.relationship('Application', backref='candidate', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Recruiter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    logo = db.Column(db.String(200))  # chemin vers le logo de l'entreprise

    job_offers = db.relationship('JobOffer', backref='recruiter', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class JobOffer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    experience = db.Column(db.String(50))
    description = db.Column(db.Text)
    skills = db.Column(db.Text)
    salary = db.Column(db.String(50))
    type = db.Column(db.String(50))  # exemple : "CDI", "Stage", etc.
    logo = db.Column(db.String(200))  # chemin vers le logo
    recruiter_id = db.Column(db.Integer, db.ForeignKey('recruiter.id'), nullable=False)

    applications = db.relationship('Application', backref='job_offer', lazy=True)

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'), nullable=False)
    job_offer_id = db.Column(db.Integer, db.ForeignKey('job_offer.id'), nullable=False)
    application_date = db.Column(db.DateTime, default=datetime.utcnow)
