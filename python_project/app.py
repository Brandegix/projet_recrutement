# Importation des modules nécessaires
from flask import Flask, request, jsonify, session  # session est déjà importé ici
import requests
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask import send_from_directory
from werkzeug.utils import secure_filename
import os
from flask_session import Session  # Si tu utilises Flask-Session pour stocker les sessions
from datetime import timedelta
from flask import Flask, session, jsonify
from flask_session import Session
from models import db, Candidate, Recruiter, JobOffer, Application
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*", manage_session=False)  # Initialize SocketIO, allow CO
# Initialisation de l'application Flask

# Configuration de la clé secrète pour les sessions
app.secret_key = 'mysupersecretkey'  # Clé secrète pour les sessions
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = False



# Configuration de la session
app.config['SECRET_KEY'] = 'votre_clé_secrète'
app.config['SESSION_TYPE'] = 'filesystem'  # Ou 'redis', si vous utilisez Redis pour stocker la session
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)  # Expire après 7 jours
# Configuration CORS plus complète
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, 
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     expose_headers=["Set-Cookie"])


#  CORS pour permettre les requêtes depuis le frontend React

# Configuration de la base de données MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost:3306/projet?charset=utf8mb4'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_recycle': 299,
    'pool_pre_ping': True
}
Session(app)

from flask_mail import Mail, Message
import json
# Add mail config
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # or your mail server
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'oaboussafi@gmail.com'
app.config['MAIL_PASSWORD'] = 'nedh ojom fpal ctyd'  # Not your Gmail password, but a generated app password
app.config['MAIL_DEFAULT_SENDER'] = 'oaboussafi@gmail.com'

mail=Mail(app)
# Initialisation des extensions
db = SQLAlchemy(app)
# Configuration des sessions

# Configuration essentielle des sessions
app.config.update(
    SECRET_KEY='votre_cle_secrete_ici',
    SESSION_TYPE='filesystem',
    SESSION_FILE_DIR='./flask_sessions',
    SESSION_PERMANENT=True,
    PERMANENT_SESSION_LIFETIME=timedelta(days=1),
    SESSION_COOKIE_NAME='jobs_session',
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=False,  # True en production avec HTTPS
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_REFRESH_EACH_REQUEST=True
)

# Initialisation de la session
Session(app)


# -------------------------------------------
#               MODELES
# -------------------------------------------
class Candidate(db.Model):
    __tablename__ = 'candidates'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phoneNumber = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(255))
    dateOfBirth = db.Column(db.Date)
    skills = db.Column(db.Text)  # Stockée comme texte JSON
    cv_filename = db.Column(db.String(255))
    profile_image = db.Column(db.String(255))  # 🔧 AJOUT ICI
    reset_token = db.Column(db.String(255), nullable=True)  # ✅ Add this line

    def set_skills(self, skills_list):
        self.skills = json.dumps(skills_list)

    def get_skills(self):
        if self.skills:
            return json.loads(self.skills)
        return []

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Recruiter(db.Model):
    __tablename__ = 'recruiters'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phoneNumber = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(255))
    companyName = db.Column(db.String(255), nullable=False)
    activity_domains = db.Column(db.String(255))
    description = db.Column(db.Text)
    profile_image = db.Column(db.String(255))  # <-- Ajout de la colonne pour l'image de profil
    reset_token = db.Column(db.String(255), nullable=True)  # ✅ Add this line
    subscription_active = db.Column(db.Boolean, default=False)  # ✅ Track subscription status
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Modèle Subscription
class Subscription(db.Model):
    __tablename__ = "subscriptions"

    id = db.Column(db.Integer, primary_key=True)
    recruiter_id = db.Column(db.Integer, db.ForeignKey("recruiters.id"), nullable=False)
    plan_name = db.Column(db.String(50), nullable=False)  # Example: Basic, Premium
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=False)

# Modèle Offre d'emploi
class JobOffer(db.Model):
    __tablename__ = 'JobOffer'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    experience = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    skills = db.Column(db.Text, nullable=False)
    salary = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    recruiter_id = db.Column(db.Integer, nullable=False)
    logo = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=False) # Added the is_active field





# Admin table
class Admin(db.Model):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)\
        


# Define the Application model
class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, nullable=False)
    job_offer_id = db.Column(db.Integer, db.ForeignKey('JobOffer.id'), nullable=False)
    application_date = db.Column(db.DateTime, default=datetime.utcnow)

    job_offer = db.relationship('JobOffer', backref='applications')  # ✅ Add this line

    def __repr__(self):
        return f"<Application {self.id}>"


class Message(db.Model):
    __tablename__ = 'messagest'  # Changed table name to 'messagest'

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('application.id'), nullable=False)
    sender_id = db.Column(db.Integer, nullable=False)
    sender_type = db.Column(db.String(50))  # "candidate" or "recruiter"
    message = db.Column(db.String(500))  # Message content field
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "applicationId": self.application_id,
            "senderId": self.sender_id,
            "senderType": self.sender_type,
            "message": self.message,  # Message field instead of content
            "timestamp": self.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        }


# Création de la base de données si elle n'existe pas
with app.app_context():
    if not os.path.exists("job_offers.db"):
        db.create_all()

# -------------------------------------------
#               ROUTES API
# -------------------------------------------
import io
import base64
import matplotlib.pyplot as plt
from flask import session, jsonify
import io
import base64
import matplotlib.pyplot as plt
from flask import jsonify, session








from flask import session, redirect, url_for





 # Admin stuff
 # Admin stuff
@app.route("/api/admin/login", methods=["POST"])
def login_admin():
    try:
        data = request.get_json()
        admin = Admin.query.filter_by(email=data["email"]).first()  # ✅ Changed username → email
        
        if not admin or not admin.check_password(data["password"]):
            return jsonify({"error": "Identifiants invalides"}), 401

        # Add session information for the admin
        session['user_id'] = admin.id
        session['user_type'] = 'admin'
        session.permanent = True

        return jsonify({"message": "Connexion réussie", "id": admin.id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/candidates1/<int:id>', methods=['PUT'])
def update_candidate(id):
    candidate = Candidate.query.get_or_404(id)
    data = request.json

    candidate.name = data.get("name", candidate.name)
    candidate.email = data.get("email", candidate.email)

    db.session.commit()
    return jsonify({"message": "Candidat mis à jour avec succès"})

@app.route('/api/candidates/<int:id>', methods=['DELETE'])
def delete_candidate(id):
    candidate = Candidate.query.get_or_404(id)

    db.session.delete(candidate)
    db.session.commit()
    return jsonify({"message": "Candidat supprimé avec succès"})


@app.route('/api/candidates/<int:id>', methods=['GET'])
def get_candidate(id):
    candidate = Candidate.query.get_or_404(id)
    return jsonify({
        "id": candidate.id,
        "name": candidate.name,
        "email": candidate.email    })

@app.route('/api/recruiters/<int:id>', methods=['PUT'])
def update_recruiter(id):
    recruiter = Recruiter.query.get_or_404(id)
    data = request.json

    recruiter.name = data.get("name", recruiter.name)
    recruiter.companyName = data.get("companyName", recruiter.companyName)
    recruiter.email = data.get("email", recruiter.email)

    # ✅ Allow subscription status update
    if "subscription_active" in data:
        recruiter.subscription_active = data["subscription_active"]

    db.session.commit()
    return jsonify({"message": "Recruteur mis à jour avec succès", "subscription_active": recruiter.subscription_active})

@app.route('/api/recruiters/<int:id>', methods=['DELETE'])
def delete_recruiter(id):
    recruiter = Recruiter.query.get_or_404(id)

    # ✅ Fetch all related job offers
    job_offers = JobOffer.query.filter_by(recruiter_id=id).all()

    # ✅ Delete each job offer individually
    for job in job_offers:
        db.session.delete(job)

    # ✅ Now delete the recruiter safely
    db.session.delete(recruiter)
    db.session.commit()

    return jsonify({"message": "Recruteur supprimé avec succès"})


@app.route('/api/recruiters', methods=['GET'])
def get_recruiters():
    recruiters = Recruiter.query.all()
    recruiter_list = [{
        "id": r.id,
        "name": r.name,
        "companyName": r.companyName,
        "email": r.email,
        "subscription_active": r.subscription_active  # ✅ Ensure this is included
    } for r in recruiters]

    print("✅ Recruiter Data:", recruiter_list)  # Debugging statement
    
    return jsonify(recruiter_list)


@app.route('/api/job_offers/<int:id>', methods=['PUT'])
def update_job(id):
    job = JobOffer.query.get_or_404(id)
    data = request.json

    job.title = data.get("title", job.title)
    job.company = data.get("company", job.company)
    job.location = data.get("location", job.location)
    job.salary = data.get("salary", job.salary)
    job.is_active = data.get("is_active", job.is_active) # Add this line


    db.session.commit()
    return jsonify({"message": "Offre d'emploi mise à jour avec succès"})

@app.route('/api/job_offers/<int:id>', methods=['DELETE'])
def delete_job(id):
    job = JobOffer.query.get_or_404(id)

    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Offre d'emploi supprimée avec succès"})

@app.route('/api/job_offers/<int:id>', methods=['GET'])
def get_job(id):
    job = JobOffer.query.get_or_404(id)
    return jsonify({
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "salary": job.salary
    })

@app.route('/recruiter/candidates', methods=['GET'])
def get_candidates_for_recruiter():
    try:
        # Vérifier si l'utilisateur est authentifié (si 'user_id' existe dans la session)
        if 'user_id' not in session:
            print(f"la partie de recruteur ds le dash : {'user_id'}")
            return jsonify({"error": "Utilisateur non authentifié"}), 401
        
        # Récupérer l'ID du recruteur depuis la session
        recruiter_id = session['user_id']

        # Récupérer toutes les offres d'emploi soumises par ce recruteur
        job_offers = JobOffer.query.filter_by(recruiter_id=recruiter_id).all()

        # Récupérer les candidats qui ont postulé à ces offres
        candidates = []
        for offer in job_offers:
            for application in offer.applications:
                candidate = Candidate.query.get(application.candidate_id)
                candidates.append(candidate)

        # Retourner les informations des candidats sous forme de liste
        result = []
        for candidate in candidates:
            result.append({
                'id': candidate.id,
                'name': candidate.name,
                'email': candidate.email,
                'phoneNumber': candidate.phoneNumber,
                'skills': candidate.get_skills(),
            })

        return jsonify(result)
    
    except Exception as e:
        app.logger.error(f"Erreur dans /recruiter/candidates: {str(e)}")
        return jsonify({"error": "Une erreur est survenue"}), 500

@app.route('/recruiterr/dashboard', methods=['GET'])
def gete_dashboard_data():
    recruiter_id = request.args.get('recruiter_id')
    
    # Total des candidats
    total_candidates = Candidate.query.filter_by(recruiter_id=recruiter_id).count()
    
    # Total des offres d'emploi
    job_offers = JobOffer.query.filter_by(recruiter_id=recruiter_id).count()
    
    # Postes ouverts (on suppose que tu as une logique ici)
    open_positions = job_offers  # Exemple basique : on suppose qu'un job_offer représente un poste ouvert
    
    # Candidats en cours (on peut considérer ici tous les candidats comme étant en cours)
    candidates_in_progress = total_candidates  # Exemple simple

    # Taux de conversion (exemple simple, à adapter)
    conversion_rate = 75  # Exemple d'un taux statique à 75%

    return jsonify({
        'totalCandidates': total_candidates,
        'jobOffers': job_offers,
        'openPositions': open_positions,
        'candidatesInProgress': candidates_in_progress,
        'conversionRate': conversion_rate
    })
@app.route('/api/stats')
def get_stats():
    total_candidates = Candidate.query.count()
    total_recruiters = Recruiter.query.count()
    total_jobs = JobOffer.query.count()  # Assuming you have a Job model
    total_applications = Application.query.count() 
    print("total_applications:", total_applications)

     # ✅ Count all applications
    return jsonify({
        "totalCandidates": total_candidates,
        "totalRecruiters": total_recruiters,
        "totalJobs": total_jobs,
        "totalApplications": total_applications  # ✅ Send application count
    })


@app.route('/api/candidates1', methods=['GET'])
def get_candidates1():
    try:
        # Récupération des candidats depuis la base de données
        candidates = Candidate.query.all()
        
        # Formatage des données
        candidates_list = []
        for candidate in candidates:
            candidate_data = {
                'id': candidate.id,
                'name': candidate.name,
                'email': candidate.email,
                'phoneNumber': candidate.phoneNumber,
                'address': candidate.address,
                'skills': candidate.skills,
                'cv_filename': candidate.cv_filename
            }
            candidates_list.append(candidate_data)
        
        # Retourne toujours un tableau, même vide
        return jsonify(candidates_list)
    
    except Exception as e:
        app.logger.error(f"Error in /api/candidates1: {str(e)}")
        # Retourne un tableau vide en cas d'erreur
        return jsonify([])
    




@app.route('/api/candidates', methods=['GET'])
def get_candidates():
    candidates = Candidate.query.all()
    candidate_list = [{"id": c.id, "name": c.name, "email": c.email} for c in candidates]
    return jsonify(candidate_list)
@app.route('/api/recruiters', methods=['GET'])
def get_recruiteres():
    recruiters = Recruiter.query.all()
    recruiter_list = [{"id": r.id, "name": r.name, "companyName": r.companyName, "email": r.email} for r in recruiters]
    return jsonify(recruiter_list)
@app.route('/api/job_offers', methods=['GET'])
def get_job_offeres():
    job_offers = JobOffer.query.all()
    job_list = [{
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "salary": job.salary,
        "is_active": job.is_active
    } for job in job_offers]
    return jsonify(job_list)


from functools import wraps

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return jsonify({"message": "Admin login required"}), 403
        return f(*args, **kwargs)
    return decorated_function
@app.route('/api/admin/dashboard')
@admin_required
def admin_dashboard():
    return jsonify({"message": f"Welcome {session['admin_username']}!"})

@app.route('/api/admin/status', methods=['GET'])
def admin_status():
     if 'admin_id' in session:
        return jsonify({"logged_in": True, "username": session.get("admin_username")}), 200
     else:
        return jsonify({"logged_in": False}), 200

@app.route('/api/logout', methods=['POST'])
def logout():
    print("Session before logout:", session)
    session.clear()
    session.modified = True  # Ensure session is updated
    print("Session after logout:", session)
    return jsonify({"message": "Logout successful"}), 200

#*  ___________________________________________Partie Candidat __________________________________



# handle job applications
@app.route('/api/applications', methods=['POST'])
def add_application():
    data = request.get_json()  # Get the JSON payload from the frontend
    candidate_id = session.get('user_id')
    job_offer_id = data.get('job_offer_id')
    print("Session data:", session)  # This will display the session in your terminal/logs
    print("Received JSON:", request.get_json())


    if not candidate_id or not job_offer_id:
        return jsonify({'message': 'Candidate ID and Job Offer ID are required'}), 400

    # Create a new application record
    new_application = Application(candidate_id=candidate_id, job_offer_id=job_offer_id)

    # Add the record to the database
    db.session.add(new_application)
    db.session.commit()

    return jsonify({'message': 'Application submitted successfully!'}), 201




@app.route("/api/candidates/login", methods=["POST"])
def login_candidate():
    try:
        data = request.get_json()
        candidate = Candidate.query.filter_by(email=data["email"]).first()
        
        if not candidate or not candidate.check_password(data["password"]):
            return jsonify({"error": "Identifiants invalides"}), 401

        # Ajout des informations de session
        session['user_id'] = candidate.id
        session['user_type'] = 'candidate'
        session.permanent = True

        return jsonify({"message": "Connexion réussie", "id": candidate.id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/current_candidate', methods=['GET'])
def current_candidate():
    if session.get('user_type') == 'candidate' and 'user_id' in session:
        return jsonify({'current_id': session['user_id']}), 200
    else:
        return jsonify({'error': 'Utilisateur non connecté ou non autorisé'}), 401


@app.route("/api/candidates/register", methods=["POST"])
def register_candidate():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        required_fields = ['username', 'password', 'name', 'email', 'phoneNumber']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        if Candidate.query.filter_by(username=data["username"]).first():
            return jsonify({"error": "Username already taken"}), 409

        if Candidate.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already registered"}), 409

        dateOfBirth = data.get("dateOfBirth")
        if dateOfBirth:
            try:
                dateOfBirth = datetime.strptime(dateOfBirth, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"error": "Invalid date format. Expected YYYY-MM-DD"}), 400
        else:
            dateOfBirth = None

        skills = data.get('skills')
        if isinstance(skills, list):
            try:
                skills_json = json.dumps(skills)
            except Exception as e:
                return jsonify({'error': f'Failed to save skills: {e}'}), 400
        else:
            skills_json = '[]'

        new_candidate = Candidate(
            username=data["username"],
            name=data["name"],
            email=data["email"],
            phoneNumber=data["phoneNumber"],
            address=data.get("address"),
            dateOfBirth=dateOfBirth,
            skills=skills_json
        )
        new_candidate.set_password(data["password"])

        db.session.add(new_candidate)
        db.session.commit()

        # Ajout des informations de session
        session['user_id'] = new_candidate.id
        session['user_type'] = 'candidate'
        session.permanent = True

        msg = Message(
            "Confirmation d'inscription à Casajobs.ma",
            recipients=[data["email"]]
        )
        msg.html = f"""
<html>
  <body style="font-family: Arial, sans-serif;">
    <p>Bonjour {data["name"]},</p>
    <p>Merci de vous être inscrit(e) sur <strong>Casajobs.ma</strong> 🎉<br>
    Votre identifiant : <strong>{data["username"]}</strong></p>
    <p>Vous pouvez maintenant vous connecter et compléter votre profil.</p>
    <p>
      <a href="http://localhost:3000/login/candidat" 
         style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; 
                color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Se connecter
      </a>
    </p>
    <p>À bientôt,<br>L'équipe Casajobs.ma</p>
  </body>
</html>
"""
        mail.send(msg)

        return jsonify({
            "message": "Candidate registered successfully",
            "id": new_candidate.id,
            "username": new_candidate.username
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/applications', methods=['GET'])
def get_user_applications():
    # Supposons que l'ID du candidat est stocké dans la session
    candidate_id = session.get('candidate_id')  # À adapter selon la manière dont vous gérez la session
    if not candidate_id:
        return jsonify({"error": "Candidate not authenticated"}), 401

    # Récupérer toutes les candidatures pour le candidat connecté
    applications = Application.query.filter_by(candidate_id=candidate_id).all()

    if not applications:
        return jsonify({"error": "No applications found for this candidate"}), 404

    applications_list = []
    for app in applications:
        job_offer = JobOffer.query.get(app.job_offer_id)

        if job_offer:
            applications_list.append({
                'id': app.id,
                'candidate_id': app.candidate_id,
                'job_offer_id': app.job_offer_id,
                'application_date': app.application_date.strftime('%Y-%m-%d %H:%M'),
                'job_offer': {
                    'title': job_offer.title,
                    'description': job_offer.description,
                    'company': job_offer.company,
                    'salary': job_offer.salary,
                    'location': job_offer.location,
                    'type': job_offer.type,
                    'experience': job_offer.experience,
                    'skills': job_offer.skills,
                    'logo': job_offer.logo,
                }
            })

    return jsonify(applications_list)
#*  ___________________________________________Partie recruteur__________________________________

@app.route("/api/recruiter/update_profile", methods=["PUT"])
def update_recruiter_profile():
    if 'user_id' not in session:
        return jsonify({"error": "Non autorisé"}), 401

    data = request.get_json()

    recruiter = Recruiter.query.get(session["user_id"])
    if recruiter is None:
        return jsonify({"error": "Recruteur non trouvé"}), 404

    print(f"Updating recruiter {recruiter.id} with data: {data}")
    print(f"Before update - Name: {recruiter.name}, Email: {recruiter.email}, Company: {recruiter.companyName}")

 # Perform the updates
    recruiter.name = data.get("name", recruiter.name)
    recruiter.email = data.get("email", recruiter.email)
    recruiter.companyName = data.get("companyName", recruiter.companyName)
    recruiter.description = data.get("description", recruiter.description)
    recruiter.phoneNumber = data.get("phoneNumber", recruiter.phoneNumber)

    db.session.commit()

    print(f"After update - Name: {recruiter.name}, Email: {recruiter.email}, Company: {recruiter.companyName}")

    return jsonify({"message": "Profil mis à jour avec succès"}), 200


@app.route("/api/recruiters/register", methods=["POST"])
def register_recruiter():

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        required_fields = ['username', 'password', 'name', 'email', 'phoneNumber', 'companyName']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        if Recruiter.query.filter_by(username=data["username"]).first():
            return jsonify({"error": "Username already taken"}), 409

        if Recruiter.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already registered"}), 409

        new_recruiter = Recruiter(
            username=data["username"],
            name=data["name"],
            email=data["email"],
            phoneNumber=data["phoneNumber"],
            address=data.get("address"),
            companyName=data["companyName"],
            activity_domains=data.get("activity_domains", "")
        )
        new_recruiter.set_password(data["password"])

        db.session.add(new_recruiter)
        db.session.commit()

        # Ajout des informations de session
        session['user_id'] = new_recruiter.id
        session['user_type'] = 'recruiter'
        session.permanent = True

        msg = Message(
            "Confirmation d'inscription à Casajobs.ma",
            recipients=[data["email"]]
        )
        
        msg.html = f"""
<html>
  <body style="font-family: Arial, sans-serif;">
    <p>Bonjour {data["name"]},</p>
    <p>Merci de vous être inscrit(e) en tant que recruteur sur <strong>Casajobs.ma</strong> 🚀<br>
    Votre identifiant : <strong>{data["username"]}</strong></p>
    <p>Vous pouvez maintenant vous connecter et commencer à publier des offres.</p>
    <p>
      <a href="http://localhost:3000/login/recruteur" 
         style="display: inline-block; padding: 10px 20px; background-color: #007BFF; 
                color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Se connecter
      </a>
    </p>
    <p>À bientôt,<br>L'équipe Casajobs.ma</p>
  </body>
</html>
"""
        mail.send(msg)

        return jsonify({
            "message": "Recruiter registered successfully",
            "id": new_recruiter.id,
            "username": new_recruiter.username
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    



 # candidates who applied to certain job offers posted by a recruiter
@app.route('/api/recruiter/applications', methods=['GET'])
def get_recruiter_applications():
    recruiter_id = session.get('user_id')
    print("Session data:", session)
    print("Recruiter ID from session:", recruiter_id)

    if not recruiter_id:
        return jsonify({"error": "Recruiter ID is required"}), 400
    print("on a depasser le premier if")
    # Get all job offers posted by the recruiter
    job_offers = JobOffer.query.filter_by(recruiter_id=recruiter_id).all()
    if not job_offers:
        return jsonify({"error": "No job offers found for this recruiter"}), 404

    job_offer_ids = [job_offer.id for job_offer in job_offers]

    # Fetch applications for these job offers
    applications = Application.query.filter(Application.job_offer_id.in_(job_offer_ids)).all()

    applications_list = []
    for app in applications:
        # Fetch candidate manually by ID (no relationship)
        candidate = Candidate.query.get(app.candidate_id)
        job_offer = JobOffer.query.get(app.job_offer_id)

        applications_list.append({
            'id': app.id,
            'candidate_id': app.candidate_id,
            'job_offer_id': app.job_offer_id,
            'application_date': app.application_date.strftime('%Y-%m-%d %H:%M'),
            'candidate': {
                'username': candidate.username,
                'name': candidate.name,
                'email': candidate.email,
                'phoneNumber': candidate.phoneNumber,
                'cv_filename': candidate.cv_filename

            } if candidate else None,
            'job_offer': {
                'title': job_offer.title,
                'description': job_offer.description,
                'company': job_offer.company,
                'salary': job_offer.salary,
                'location': job_offer.location,
                'type': job_offer.type,
                'experience': job_offer.experience,
                'skills': job_offer.skills,
                'logo': job_offer.logo,
            } if job_offer else None
        })

    return jsonify(applications_list)
@app.route('/api/recruiters/login', methods=['POST'])
def login_recruiter():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Mot de passe admin fixe
    admin_password = "20032003"

    # Vérification admin sans chercher dans la base de données
    if email == "admin@gmail.com" and password == admin_password:
        print("L'admin est connecté")
        session['user_id'] = "admin"  # Identifiant fictif pour l'admin
        session['user_type'] = 'admin'
        print(session['user_type'])
        session.permanent = True
        return jsonify({'message': 'Connexion réussie', 'user_type': 'admin'}), 200

    recruiter = Recruiter.query.filter_by(email=email).first()

    if recruiter:
        if check_password_hash(recruiter.password_hash, password):
            session['user_id'] = recruiter.id
            session['user_type'] = 'recruiter'
            session.permanent = True
            print("[DEBUG] Connexion recruteur réussie, session enregistrée:", session)
            return jsonify({'message': 'Connexion réussie', 'user_type': 'recruiter'}), 200

    # Si aucun des cas ci-dessus n'est valide
    print("[DEBUG] Identifiants invalides.")
    return jsonify({'error': 'Identifiants invalides'}), 401

#? Pour savoir le recruteur connecter
@app.route('/api/current_recruiter', methods=['GET'])
def current_recruiter():
    if session.get('user_type') == 'recruiter' and 'user_id' in session:
        return jsonify({'recruiter_id': session['user_id']}), 200
    else:
        return jsonify({'error': 'Utilisateur non connecté ou non autorisé'}), 401



UPLOAD_FOLDER1 = os.path.join(os.getcwd(), 'uploads', 'profile_images')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Utility function to check allowed file types
def allowed_file1(filename):
    filename = filename.strip()
    if '.' in filename:
        ext = filename.rsplit('.', 1)[1].lower()
        print(f"File extension: {ext}, Allowed extensions: {ALLOWED_EXTENSIONS}")
        return ext in ALLOWED_EXTENSIONS
    return False


@app.route('/uploads/profile_images/<path:filename>')
def uploaded_profile_image(filename):
    # Ensure this path matches where the files are being saved
    upload_folder = os.path.join(os.getcwd(), 'uploads', 'profile_images')
    return send_from_directory(upload_folder, filename)

# Recruiters profile image
@app.route('/api/upload-profile-image-recruiter', methods=['POST'])
def upload_profile_image_recruiter():
    print('abc')

    print('Request files:', request.files)
    file = request.files.get('profile_image')
    print('File:', file)
    print('Filename:', file.filename)
    print('Allowed file?', allowed_file1(file.filename))
    print("File Extension:", file.filename.rsplit('.', 1)[1].lower())

    recruiter_id = session.get('user_id')
    print("Session :", session)

    if not recruiter_id:
        return jsonify({'message': 'Recruiter not logged in'}), 401

    if 'profile_image' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['profile_image']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file and allowed_file1(file.filename):
        filename = secure_filename(file.filename)
        new_filename = f"recruiter_{recruiter_id}_{filename}"
        save_path = os.path.join(UPLOAD_FOLDER1, new_filename)

        # ➕ Créer le dossier s'il n'existe pas
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        file.save(save_path)

        # 🔁 Mise à jour dans la base de données
        recruiter = Recruiter.query.get(recruiter_id)
        recruiter.profile_image = new_filename
        print(recruiter.profile_image)

        db.session.commit()

        return jsonify({'message': 'Profile image uploaded successfully', 'filename': recruiter.profile_image}), 200

    return jsonify({'message': 'Invalid file type'}), 400


@app.route('/api/recruiter/job_offers_statistics', methods=['GET'])
def get_job_offers_statistics():
    recruiter_id = session.get('user_id')
    print("Session:", session)

    # Check if the recruiter is logged in
    if not recruiter_id:
        return jsonify({"error": "Not logged in"}), 401
    
    # Fetch the job offers for the recruiter
    offers = JobOffer.query.filter_by(recruiter_id=recruiter_id).all()

    # Calculate the number of job offers posted
    job_count = len(offers)

    # Return job offer statistics (number of job offers posted)
    return jsonify({
        'statistics': {
            'jobCount': job_count
        }
    })



@app.route('/uploads/cv/<path:cv_filename>')
def uploaded_cv(cv_filename):
    # Ensure this path matches where the files are being saved
    upload_folder = os.path.join(os.getcwd(), 'uploads')
    return send_from_directory(upload_folder, cv_filename)

from flask import request, jsonify, session


@app.route('/api/sapplications', methods=['GET'])
def get_all_applications():
    try:
        # ✅ Get all job offers
        job_offers = JobOffer.query.all()
        if not job_offers:
            return jsonify({"error": "No job offers found"}), 404

        job_offer_ids = [job_offer.id for job_offer in job_offers]

        # ✅ Fetch applications for all job offers
        applications = Application.query.filter(Application.job_offer_id.in_(job_offer_ids)).all()

        applications_list = []
        for app in applications:
            candidate = Candidate.query.get(app.candidate_id)
            job_offer = JobOffer.query.get(app.job_offer_id)
            recruiter = Recruiter.query.get(job_offer.recruiter_id) if job_offer else None

            if not recruiter or not candidate or not job_offer:
                continue  # Skip if any data is missing

            # ✅ Notify recruiter via email
            subject = f"New Application for {job_offer.title}"
            body = f"""
            Hello,

            A new candidate has applied for your job offer: {job_offer.title}.

            Candidate details:
            - Name: {candidate.name}
            - Email: {candidate.email}
            - Phone: {candidate.phoneNumber}

            Regards,
            Your Job Application Platform
            """

            # ✅ Append application details after successful notification
            applications_list.append({
                'id': app.id,
                'candidate_id': app.candidate_id,
                'job_offer_id': app.job_offer_id,
                'application_date': app.application_date.strftime('%Y-%m-%d %H:%M'),
                'candidate': {
                    'username': candidate.username,
                    'name': candidate.name,
                    'email': candidate.email,
                    'phoneNumber': candidate.phoneNumber,
                    'cv_filename': candidate.cv_filename
                } if candidate else None,
                'job_offer': {
                    'title': job_offer.title,
                    'description': job_offer.description,
                    'company': job_offer.company,
                    'salary': job_offer.salary,
                    'location': job_offer.location,
                    'type': job_offer.type,
                    'experience': job_offer.experience,
                    'skills': job_offer.skills,
                    'logo': job_offer.logo,
                } if job_offer else None
            })

        return jsonify(applications_list)

    except Exception as e:
        print(f"Error retrieving applications: {e}")
        return jsonify({"message": "Failed to process applications."}), 500


#  # candidates who applied to certain job offers posted by a recruiter
# @app.route('/api/recruiter/applications', methods=['GET'])
# def get_recruiter_applications():
#     recruiter_id = session.get('user_id')
#     print("Session data:", session)
#     print("Recruiter ID from session:", recruiter_id)

#     if not recruiter_id:
#         return jsonify({"error": "Recruiter ID is required"}), 400
#     print("on a depasser le premier if")
#     # Get all job offers posted by the recruiter
#     job_offers = JobOffer.query.filter_by(recruiter_id=recruiter_id).all()
#     if not job_offers:
#         return jsonify({"error": "No job offers found for this recruiter"}), 404

#     job_offer_ids = [job_offer.id for job_offer in job_offers]

#     # Fetch applications for these job offers
#     applications = Application.query.filter(Application.job_offer_id.in_(job_offer_ids)).all()

#     applications_list = []
#     for app in applications:
#         # Fetch candidate manually by ID (no relationship)
#         candidate = Candidate.query.get(app.candidate_id)
#         job_offer = JobOffer.query.get(app.job_offer_id)

#         applications_list.append({
#             'id': app.id,
#             'candidate_id': app.candidate_id,
#             'job_offer_id': app.job_offer_id,
#             'application_date': app.application_date.strftime('%Y-%m-%d %H:%M'),
#             'candidate': {
#                 'username': candidate.username,
#                 'name': candidate.name,
#                 'email': candidate.email,
#                 'phoneNumber': candidate.phoneNumber,
#                 'cv_filename': candidate.cv_filename

#             } if candidate else None,
#             'job_offer': {
#                 'title': job_offer.title,
#                 'description': job_offer.description,
#                 'company': job_offer.company,
#                 'salary': job_offer.salary,
#                 'location': job_offer.location,
#                 'type': job_offer.type,
#                 'experience': job_offer.experience,
#                 'skills': job_offer.skills,
#                 'logo': job_offer.logo,
#             } if job_offer else None
#         })

#     return jsonify(applications_list)


@app.route('/api/session')
def check_session():
    user_type = session.get('user_type')  # either 'candidate', 'recruiter', or 'admin'
    user_id = session.get('user_id')

    is_logged_in = user_type is not None and user_id is not None
    user = None

    if is_logged_in:
        if user_type == 'candidate':
            candidate = Candidate.query.get(user_id)
            if candidate:
                user = {
                    "id": candidate.id,
                    "role": "candidate",
                    "name": candidate.name
                }

        elif user_type == 'recruiter':
            recruiter = Recruiter.query.get(user_id)
            if recruiter:
                user = {
                    "id": recruiter.id,
                    "role": "recruiter",
                    "name": recruiter.name
                }

        elif user_type == 'admin':
            admin = Admin.query.get(user_id)  # Assuming you have an Admin model
            if admin:
                user = {
                    "id": admin.id,
                    "role": "admin",
                    "name": admin.username
                }

    return jsonify({
        "isLoggedIn": is_logged_in,
        "user": user
    })

@app.route('/recruiter/profile', methods=['GET', 'POST'])
def recruiter_profile():
    recruiter_id = session.get('user_id')
    recruiter = Recruiter.query.get(recruiter_id)

    # Predefined domains (can be static or dynamic)
    predefined_domains = ["Informatique", "Marketing", "Réseaux", "Finance", "Éducation", "Santé"]

    if request.method == 'POST':
        selected = request.json.get('domains', [])
        custom = request.json.get('custom_domain', None)
        # If there's a custom domain, add it to the list
        if custom:
            selected.append(custom.strip())
            predefined_domains.append(custom.strip())

        recruiter.activity_domains = ','.join(selected)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

        return jsonify({
            'message': 'Profile updated successfully',
            'selected_domains': selected
        })
    
    # Retrieve selected domains from the database
    selected_domains = recruiter.activity_domains.split(',') if recruiter.activity_domains else []
    
    # Send both predefined and selected domains to the frontend
    return jsonify({
        'predefined_domains': predefined_domains,
        'selected_domains': selected_domains
    })
@app.route('/api/recruiter/profile', methods=['GET'])
def get_recruiter_profile():
    recruiter_id = session.get('user_id')
    
    # Check if the recruiter is logged in
    if not recruiter_id:
        return jsonify({"error": "Not logged in"}), 401

    # Assuming you have a Recruiter model with a method to fetch recruiter details
    recruiter = Recruiter.query.get(recruiter_id)
    
    # Static list of predefined domains
    predefined_domains = ["Informatique", "Finance", "Marketing", "Design", "Droit"]

    # Split the stored domains into a list
    selected_domains = (
        recruiter.activity_domains.split(",") if recruiter.activity_domains else []
    )
    print("selected_domainssssssssss :", selected_domains)

    if not recruiter:
        return jsonify({"error": "Recruiter not found"}), 404

    # Return the recruiter profile data
    return jsonify({
        'id': recruiter.id,
        'name': recruiter.name,
        'email': recruiter.email,
        'companyName' : recruiter.companyName,
        'address' : recruiter.address,
        'phoneNumber' : recruiter.phoneNumber,
        'description': recruiter.description,
        'profile_image': recruiter.profile_image,
        'selected_domains': selected_domains,
        'predefined_domains': predefined_domains        
 # <-- ADD THIS

    })

@app.route('/api/upload-profile-image', methods=['POST'])
def upload_profile_image():
    print('abc')

    print('Request files:', request.files)
    file = request.files.get('profile_image')
    print('File:', file)
    print('Filename:', file.filename)
    print('Allowed file?', allowed_file1(file.filename))
    print("File Extension:", file.filename.rsplit('.', 1)[1].lower())

    candidate_id = session.get('user_id')
    print("Session :", session)


    if not candidate_id:
        return jsonify({'message': 'Candidate not logged in'}), 401

    if 'profile_image' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['profile_image']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file and allowed_file1(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(UPLOAD_FOLDER1, f"candidate_{candidate_id}_{filename}")
        file.save(save_path)

        # Now update your Candidate database record with the filename
        candidate = Candidate.query.get(candidate_id)
        candidate.profile_image = f"candidate_{candidate_id}_{filename}"
        print(candidate.profile_image)  # Check if it's correctly set

        db.session.commit()

        return jsonify({'message': 'Profile image uploaded successfully', 'filename': candidate.profile_image}), 200

    return jsonify({'message': 'Invalid file type'}), 400



    # static profile

@app.route('/api/wecandidates/profile/<int:id>', methods=['GET'])
def get_wecandidate_profile(id):
   

    # You may choose to add session checks if you want to ensure the user is logged in
   

    # Retrieve candidate by the id passed in the URL
    candidate = Candidate.query.get(id)
    if candidate is None:
        return jsonify({"error": "Candidate not found"}), 404

    print("Raw candidate.skills:", candidate.skills)

    # Handle skills if they are stored as a JSON string or a list
    skills = []
    if isinstance(candidate.skills, str):
        try:
            skills = json.loads(candidate.skills)
        except json.JSONDecodeError as e:
            print("JSON decoding failed:", e)
            return jsonify({"error": "Failed to decode skills data"}), 500
    elif isinstance(candidate.skills, list):
        skills = candidate.skills

    # Return candidate data as a JSON response
    return jsonify({
        'id': candidate.id,
        'name': candidate.name,
        'email': candidate.email,
        'skills': skills,
        'phoneNumber': candidate.phoneNumber,
        'address': candidate.address,
        'dateOfBirth': candidate.dateOfBirth,
        'cv_filename': candidate.cv_filename,
        'profile_image': candidate.profile_image,
    })

@app.route('/api/candidates/profile', methods=['GET'])
def get_candidate_profile():
    print("Session data:", session)

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    candidate = Candidate.query.get(user_id)
    if candidate is None:
        return jsonify({"error": "Candidate not found"}), 404

    print("Raw candidate.skills:", candidate.skills)

    skills = []
    if isinstance(candidate.skills, str):
        try:
            skills = json.loads(candidate.skills)
        except json.JSONDecodeError as e:
            print("JSON decoding failed:", e)
            return jsonify({"error": "Failed to decode skills data"}), 500
    elif isinstance(candidate.skills, list):
        skills = candidate.skills


    return jsonify({
        'id': candidate.id,
        'name': candidate.name,
        'email': candidate.email,
        'skills': skills,
        'phoneNumber': candidate.phoneNumber,
        'address': candidate.address,
        'dateOfBirth': candidate.dateOfBirth,
        'cv_filename': candidate.cv_filename,
        'profile_image': candidate.profile_image,
    })


@app.route('/api/candidates/profiles', methods=['GET'])
def get_candidate_profiles12():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    candidate = Candidate.query.get(user_id)
    if not candidate:
        return jsonify({"error": "Candidate not found"}), 404

    skills = []
    if isinstance(candidate.skills, str):
        try:
            skills = json.loads(candidate.skills)
        except json.JSONDecodeError:
            return jsonify({"error": "Failed to decode skills data"}), 500
    elif isinstance(candidate.skills, list):
        skills = candidate.skills

    return jsonify({
        'id': candidate.id,
        'name': candidate.name,
        'skills': skills,
        'profile_image': candidate.profile_image,
        'role': candidate.role
    })


# Routes pour les recruteurs (similaires aux candidats)
# Register recruiter




    
@app.before_request
def log_request_info():
    if request.path.startswith('/api/'):
        print(f"\n[Request] {request.method} {request.path}")
        print(f"Session: {dict(session)}")
        print(f"Headers: {dict(request.headers)}")
        print(f"Cookies: {request.cookies}\n")
import io
import base64
import matplotlib.pyplot as plt
from flask import jsonify, session
import io
import base64
import matplotlib.pyplot as plt
from flask import jsonify, session
from datetime import datetime
# @app.route('/api/stats', methods=['GET'])
# def get_recruiter_stats():
#     stats = [
#         {"label": "Candidats inscrits", "value": 123},
#         {"label": "Postes ouverts", "value": 2},
#         {"label": "Entretiens programmés", "value": 14},
#         {"label": "Candidats sélectionnés", "value": 5}
#     ]
#     return jsonify(stats)
@app.route('/api/stats', methods=['GET'])
def get_recruiter_stats():
    # Statistiques des candidats inscrits
    candidates_count = db.session.query(Candidate).count()

    # Statistiques des recruteurs inscrits
    recruiters_count = db.session.query(Recruiter).count()

    # Statistiques des postes ouverts
    job_offers_count = db.session.query(JobOffer).count()

    # Statistiques des candidatures envoyées
    applications_count = db.session.query(Application).count()

    # Retourner les statistiques sous forme de JSON
    stats = [
        {"label": "Candidats inscrits", "value": candidates_count},
        {"label": "Recruteurs inscrits", "value": recruiters_count},
        {"label": "Postes ouverts", "value": job_offers_count},
        {"label": "Candidatures envoyées", "value": applications_count},
    ]
    
    return jsonify(stats)
#!    changement 
# Modèle Entretien (ajouté à des fins d'exemple)
@app.route('/api/recent-activities', methods=['GET'])
def get_recent_activities():
    activities = []

    # Dernier candidat inscrit
    last_candidate = Candidate.query.order_by(Candidate.id.desc()).first()
    if last_candidate:
        activities.append(f"Nouveau candidat inscrit: {last_candidate.name}")

    # Dernière offre publiée
    last_offer = JobOffer.query.order_by(JobOffer.id.desc()).first()
    if last_offer:
        activities.append(f'Offre "{last_offer.title}" publiée')

    # Dernier entretien planifié
    last_interview = Interview.query.order_by(Interview.id.desc()).first()
    if last_interview:
        candidate = Candidate.query.get(last_interview.candidate_id)
        if candidate:
            activities.append(f"Entretien planifié avec {candidate.name}")

    # Dernière embauche
    last_hire = HiredCandidate.query.order_by(HiredCandidate.id.desc()).first()
    if last_hire:
        candidate = Candidate.query.get(last_hire.candidate_id)
        if candidate:
            activities.append(f"Candidat embauché: {candidate.name}")

    return jsonify(activities)

#!hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

@app.route('/api/recruiter-dashboard/graph')
def recruiter_dashboard_graph():
    # Vérification de session
    if 'user_id' not in session or 'user_type' not in session or session['user_type'] != 'recruiter':
        return jsonify({"message": "Unauthorized"}), 401

    # Données simulées
    months = ["Janvier", "Février", "Mars", "Avril"]
    offers = [3, 5, 2, 7]
    applications = [15, 22, 8, 17]

    # Génération du graphique avec Matplotlib
    plt.figure(figsize=(8, 5))
    plt.plot(months, offers, marker='o', label='Offres')
    plt.plot(months, applications, marker='x', label='Candidatures')
    plt.title('Statistiques mensuelles')
    plt.xlabel('Mois')
    plt.ylabel('Nombre')
    plt.legend()
    plt.grid(True)

    # Sauvegarder dans un buffer mémoire
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    buffer.close()
    plt.close()

    return jsonify({'image': image_base64})

from flask import session, jsonify

@app.route("/api/recruiter/me", methods=["GET"])
def get_recruiter_id():
    if session.get('user_type') == 'recruiter':
        recruiter_id = session.get('user_id')
        return jsonify({"recruiter_id": recruiter_id}), 200
    else:
        return jsonify({"error": "Unauthorized"}), 401




   # Fetch the job offers for the recruiter
@app.before_request
def before_request():
    print(f"Session data before request: {session}")
@app.route('/api/recruiter/job_offers', methods=['GET'])
def get_job_offers():
    recruiter_id = session.get('user_id')
    print("Session :", session)


    # Check if the recruiter is logged in
    if not recruiter_id:
        return jsonify({"error": "Not logged in"}), 401
    
     # ✅ Fetch recruiter details from the database
    recruiter = Recruiter.query.filter_by(id=recruiter_id).first()
    # ✅ Example field: recruiter.is_subscribed (boolean)

    

    # Fetch the job offers for the recruiter
    offers = JobOffer.query.filter_by(recruiter_id=recruiter_id).all()
    
    result = []
    for offer in offers:
        result.append({
            'id': offer.id,
            'title': offer.title,
            'description': offer.description,
            'company': offer.company,
            'salary': offer.salary,
            'location': offer.location,
            'experience': offer.experience,
            'skills': offer.skills,
            'type': offer.type,
            'logo': offer.logo,
            'recruiter_id': offer.recruiter_id,
            'is_active': bool(offer.is_active) # Explicitly convert to boolean

        })
    
    return jsonify(result)


@app.route('/api/recruiter/job_offers/<int:offer_id>', methods=['DELETE'])
def delete_job_offer(offer_id):
    recruiter_id = session.get('user_id')

    if not recruiter_id:
        return jsonify({"error": "Not logged in"}), 401

    offer = JobOffer.query.filter_by(id=offer_id, recruiter_id=recruiter_id).first()

    if not offer:
        return jsonify({"error": "Offre non trouvée ou non autorisée"}), 404

    try:
        db.session.delete(offer)
        db.session.commit()
        return jsonify({"message": "Offre supprimée avec succès"}), 200
    except Exception as e:
        print("Erreur suppression :", e)
        return jsonify({"error": "Erreur lors de la suppression"}), 500

@app.route('/api/recruiter/job_offers/<int:offer_id>', methods=['PUT'])
def update_job_offer(offer_id):
    recruiter_id = session.get('user_id')
    if not recruiter_id:
        return jsonify({"error": "Not logged in"}), 401

    offer = JobOffer.query.filter_by(id=offer_id, recruiter_id=recruiter_id).first()
    if not offer:
        return jsonify({"error": "Offer not found or unauthorized"}), 404

    data = request.get_json()
    offer.title = data.get('title', offer.title)
    offer.description = data.get('description', offer.description)
    offer.company = data.get('company', offer.company)
    offer.salary = data.get('salary', offer.salary)
    offer.location = data.get('location', offer.location)
    offer.experience = data.get('experience', offer.experience)
    offer.skills = data.get('skills', offer.skills)
    offer.type = data.get('type', offer.type)

    db.session.commit()
    return jsonify({"message": "Job offer updated successfully"})


@app.route('/api/recruiter/job_offers/<int:offer_id>', methods=['GET'])
def get_job_offer(offer_id):
    recruiter_id = session.get('user_id')
    if not recruiter_id:
        return jsonify({"error": "Not logged in"}), 401

    offer = JobOffer.query.filter_by(id=offer_id, recruiter_id=recruiter_id).first()
    if not offer:
        return jsonify({"error": "Offer not found or unauthorized"}), 404

    return jsonify({
        "id": offer.id,
        "title": offer.title,
        "description": offer.description,
        "company": offer.company,
        "salary": offer.salary,
        "location": offer.location,
        "experience": offer.experience,
        "skills": offer.skills,
        "type": offer.type
    })

# @app.route('/api/recruiter-dashboard/graph')
# def recruiter_dashboard_graph():
#     # Vérification de session
#     if 'user_id' not in session or 'user_type' not in session or session['user_type'] != 'recruiter':
#         return jsonify({"message": "Unauthorized"}), 401

#     # Exemple de données simulées
#     graph_data = {
#         "offers_per_month": [
#             {"month": "Janvier", "count": 3},
#             {"month": "Février", "count": 5},
#             {"month": "Mars", "count": 2},
#             {"month": "Avril", "count": 7}
#         ],
#         "applications_per_month": [
#             {"month": "Janvier", "count": 15},
#             {"month": "Février", "count": 22},
#             {"month": "Mars", "count": 8},
#             {"month": "Avril", "count": 17}
#         ],
#         "summary": {
#             "total_offers": 17,
#             "total_applications": 62,
#             "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#         }
#     }

#     return jsonify(graph_data)
import pdb
# Login recruiter



@app.route('/api/recruiters/profile', methods=['GET'])
def get_recruiter_profiles():
    # Vérifie que la session contient bien l'ID et le type de l'utilisateur
    recruiter_id = session.get('user_id')
    if not recruiter_id:
        return jsonify({'error': 'Utilisateur non connecté'}), 401

    recruiter = Recruiter.query.get(recruiter_id)
    if not recruiter:
        return jsonify({'error': 'Recruteur non trouvé'}), 404

    return jsonify({
        'id': recruiter.id,
        'username': recruiter.username,
        'name': recruiter.name,
        'email': recruiter.email,
        'phoneNumber': recruiter.phoneNumber,
        'address': recruiter.address,
        'companyName': recruiter.companyName
    })

@app.route('/api/job_offers', methods=['GET'])
def get_job_offerss1():
    offers = JobOffer.query.all()
    result = []
    recruiter_id = session.get('user_id')
    
    for offer in offers:
        result.append({
            'id': offer.id,
            'title': offer.title,
            'description': offer.description,
            'company': offer.company,
            'salary': offer.salary,
            'location': offer.location,
            'experience': offer.experience,
            'skills': safe_json_loads(offer.skills),  # Décodage sécurisé du champ skills
            'type': offer.type,
            'logo': offer.logo,
            'recruiter_id': recruiter_id
        })
    
    return jsonify(result)



@app.route('/api/job_offers', methods=['POST'])
def create_job_offer():
    title = request.form.get('title')
    location = request.form.get('location')
    experience = request.form.get('experience')
    description = request.form.get('description')
    skills = request.form.get('skills')
    salary = request.form.get('salary')
    type = request.form.get('type')
    recruiter_id = session.get('user_id')  # ✅ Get recruiter ID from session

    # ✅ Fetch recruiter details from the database
    recruiter = Recruiter.query.filter_by(id=recruiter_id).first()
    # ✅ Example field: recruiter.is_subscribed (boolean)

    if not recruiter or not recruiter.subscription_active:
     return jsonify({'error': 'Votre abonnement n\'est pas actif. Veuillez contacter l\'administrateur.'}), 403


    company = recruiter.companyName  # ✅ Automatically set company name from recruiter

    # ✅ Handle logo upload
    logo = request.files.get('logo')
    logo_filename = secure_filename(logo.filename) if logo else 'ccc.jpg'
    if logo:
        os.makedirs('path_to_save_directory', exist_ok=True)
        logo.save(os.path.join('path_to_save_directory', logo_filename))

    # ✅ Create job offer with fetched company name
    job_offer = JobOffer(
        title=title,
        company=company,  # ✅ Use recruiter’s company name
        location=location,
        experience=experience,
        description=description,
        skills=skills,
        salary=salary,
        type=type,
        recruiter_id=recruiter_id,
        logo=logo_filename,
    )

    try:
        db.session.add(job_offer)
        db.session.commit()
        return jsonify({'message': 'Job offer created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/job_offersr', methods=['GET'])
def get_all_job_offersr():
    offres = JobOffer.query.all()
    data = [
        {'id': o.id, 'title': o.title, 'description': o.description}
        for o in offres
    ]
    return jsonify(data)

@app.route("/api/add_job_offer", methods=["POST"])
def add_job_offer():
    # Vérification de la session
    if 'user_id' not in session or session['user_type'] != 'recruiter':
        return jsonify({"error": "Not logged in as recruiter"}), 401

    data = request.json
    required_fields = ["title", "company", "location", "experience", "description", "skills", "salary", "type", "recruiter_id"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Champ manquant : {field}"}), 400

    new_offer = JobOffer(
        title=data["title"],
        company=data["company"],
        location=data["location"],
        experience=data["experience"],
        description=data["description"],
        skills=data["skills"],
        salary=data["salary"],
        type=data["type"],
        recruiter_id=session['user_id']  # Utilisation de l'ID du recruteur connecté
    )

    db.session.add(new_offer)
    db.session.commit()

    return jsonify({"message": "Offre ajoutée avec succès !"}), 201

@app.route("/api/je", methods=["GET"])
def get_job_offerss():
    try:
        offers = JobOffer.query.all()
        offers_list = [{
            "id": offer.id,
            "title": offer.title,
            "company": offer.company,
            "location": offer.location,
            "experience": offer.experience,
            "description": offer.description,
            "skills": offer.skills.split(",") if offer.skills else [],
            "salary": offer.salary,
            "type": offer.type,
            "recruiter_id": offer.recruiter_id
        } for offer in offers]
        return jsonify(offers_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# @app.route("/api/delete_job_offer/<int:offer_id>", methods=["DELETE"])
# def delete_job_offer(offer_id):
#     # Vérification de la session
#     if 'user_id' not in session or session['user_type'] != 'recruiter':
#         return jsonify({"error": "Not logged in as recruiter"}), 401

#     offer = JobOffer.query.get_or_404(offer_id)
#     # Vérification que l'offre appartient bien au recruteur connecté
#     if offer.recruiter_id != session['user_id']:
#         return jsonify({"error": "Unauthorized to delete this offer"}), 403

#     db.session.delete(offer)
#     db.session.commit()
#     return jsonify({"message": "Offre supprimée avec succès !"})

# @app.route("/api/update_job_offer/<int:offer_id>", methods=["PUT"])
# def update_job_offer(offer_id):
#     # Vérification de la session
#     if 'user_id' not in session or session['user_type'] != 'recruiter':
#         return jsonify({"error": "Not logged in as recruiter"}), 401

#     offer = JobOffer.query.get_or_404(offer_id)
#     # Vérification que l'offre appartient bien au recruteur connecté
#     if offer.recruiter_id != session['user_id']:
#         return jsonify({"error": "Unauthorized to update this offer"}), 403

#     data = request.json
#     for key in ["title", "company", "location", "experience", "description", "skills", "salary", "type"]:
#         if key in data:
#             setattr(offer, key, data[key])

#     db.session.commit()
#     return jsonify({"message": "Offre mise à jour avec succès !"})
from recruiter_routes import recruiter_bp






@app.route('/api/recruiter/<int:recruiter_id>/offers', methods=['GET'])
def get_offers(recruiter_id):
    offers = JobOffer.query.filter_by(recruiter_id=recruiter_id).all()
    return jsonify([{
        'id': offer.id,
        'title': offer.title,
        'company': offer.company,
        'location': offer.location,
        'experience': offer.experience,
        'skills': offer.skills,
        'salary': offer.salary
    } for offer in offers])


@app.route('/api/recruiter/<int:recruiter_id>/applications', methods=['GET'])
def get_applications(recruiter_id):
    # Vérification des offres associées au recruteur
    job_offers = JobOffer.query.filter_by(recruiter_id=recruiter_id).all()
    if not job_offers:
        return jsonify({'message': 'Aucune offre trouvée pour ce recruteur'}), 404
    
    job_offer_ids = [o.id for o in job_offers]
    applications = Application.query.filter(Application.job_offer_id.in_(job_offer_ids)).all()
    
    # Vérification s'il y a des candidatures
    if not applications:
        return jsonify({'message': 'Aucune candidature trouvée pour ces offres'}), 404

    return jsonify([{
        'id': app.id,
        'candidate_id': app.candidate_id,
        'job_offer_id': app.job_offer_id,
        'application_date': app.application_date.isoformat()
    } for app in applications])

#! hnaq bdit les graphes:
@app.route('/api/recruiter/<int:recruiter_id>/offers-by-type')
def offers_by_type(recruiter_id):
    from sqlalchemy import func
    results = db.session.query(JobOffer.type, func.count(JobOffer.id))\
        .filter_by(recruiter_id=recruiter_id)\
        .group_by(JobOffer.type).all()
    return jsonify([{'type': r[0], 'count': r[1]} for r in results])
@app.route('/api/recruiter/<int:recruiter_id>/skills-distribution')
def skills_distribution(recruiter_id):
    offers = JobOffer.query.filter_by(recruiter_id=recruiter_id).all()
    from collections import Counter
    skill_counter = Counter()
    for offer in offers:
        for skill in offer.skills.split(','):  # Suppose que les skills sont séparés par des virgules
            skill_counter[skill.strip().lower()] += 1
    return jsonify([{'skill': k, 'count': v} for k, v in skill_counter.items()])
@app.route('/recruiter/<int:recruiter_id>/offers-by-experience', methods=['GET'])
def get_offers_by_experience(recruiter_id):
    # Récupérer les offres du recruteur
    offers = JobOffer.query.filter_by(recruiter_id=recruiter_id).all()
    
    # Calculer la répartition par expérience
    experience_data = {}
    for offer in offers:
        experience = offer.experience
        if experience not in experience_data:
            experience_data[experience] = 0
        experience_data[experience] += 1
    
    # Formater la réponse en JSON
    result = [{'experience': exp, 'count': count} for exp, count in experience_data.items()]
    return jsonify(result)
@app.route('/recruiter/<int:recruiter_id>/offers-by-location', methods=['GET'])
def get_offers_by_location(recruiter_id):
    # Récupérer les offres du recruteur
    offers = JobOffer.query.filter_by(recruiter_id=recruiter_id).all()
    
    # Calculer la répartition par lieu
    location_data = {}
    for offer in offers:
        location = offer.location
        if location not in location_data:
            location_data[location] = 0
        location_data[location] += 1
    
    # Formater la réponse en JSON
    result = [{'location': loc, 'count': count} for loc, count in location_data.items()]
    return jsonify(result)
@app.route('/recruiter/<int:recruiter_id>/offers-by-company', methods=['GET'])
def get_offers_by_company(recruiter_id):
    # Récupérer les offres du recruteur
    offers = JobOffer.query.filter_by(recruiter_id=recruiter_id).all()
    
    # Calculer la répartition par entreprise
    company_data = {}
    for offer in offers:
        company = offer.company
        if company not in company_data:
            company_data[company] = 0
        company_data[company] += 1
    
    # Formater la réponse en JSON
    result = [{'company': comp, 'count': count} for comp, count in company_data.items()]
    return jsonify(result)

@app.route('/recruiter/<int:recruiter_id>/offers-by-salary', methods=['GET'])
def get_offers_by_salary(recruiter_id):
    # Récupérer les offres du recruteur
    offers = JobOffer.query.filter_by(recruiter_id=recruiter_id).all()
    
    # Calculer la répartition par salaire
    salary_data = {}
    for offer in offers:
        salary = offer.salary
        if salary not in salary_data:
            salary_data[salary] = 0
        salary_data[salary] += 1
    
    # Formater la réponse en JSON
    result = [{'salary': sal, 'count': count} for sal, count in salary_data.items()]
    return jsonify(result)


from flask import jsonify, session
import json

# Fonction pour charger du JSON de maniFère sécurisée
def safe_json_loads(data):
    try:
        # Retourne une liste vide si les données sont invalides
        return json.loads(data) if data and data.strip() else []
    except (json.JSONDecodeError, TypeError):
        # En cas d'erreur de décodage, retourne une liste vide
        return []
    

@app.route('/api/candidate/profile', methods=['GET'])
def ge123t_candidate_profile():
    candidate_id = session.get('user_id')
    if not candidate_id:
        return jsonify({"error": "Not authenticated"}), 401

    candidate = Candidate.query.get(candidate_id)
    if not candidate:
        return jsonify({"error": "Candidate not found"}), 404

    return jsonify({
        "id": candidate.id,
        "name": candidate.name,
        "email": candidate.email,
        # Add other fields as needed
    })

@app.route('/api/getapplications', methods=['GET'])
def get_applicationsss():
    candidate_id = session.get('user_id')
    print("Session data:", session)

    if not candidate_id:
        return jsonify({"error": "Candidate ID is required"}), 400

    applications = Application.query.filter_by(candidate_id=candidate_id).all()

    applications_list = []
    seen_job_offer_ids = set()  # Set to track job_offer_ids that we've already added

    for app in applications:
        job_offer = app.job_offer  # grâce à la relation définie
        if job_offer and job_offer.id not in seen_job_offer_ids:  # Only add if not seen before
            seen_job_offer_ids.add(job_offer.id)  # Mark this job offer as seen

            offer_data = {
                'title': job_offer.title,
                'description': job_offer.description,
                'company': job_offer.company,
                'salary': job_offer.salary,
                'location': job_offer.location,
                'experience': job_offer.experience,
                'skills': safe_json_loads(job_offer.skills),  # Utilisation de la fonction sécurisée
                'type': job_offer.type,
                'logo': job_offer.logo
            }

            applications_list.append({
                'id': app.id,
                'candidate_id': app.candidate_id,
                'job_offer_id': app.job_offer_id,
                'application_date': app.application_date.strftime('%Y-%m-%d %H:%M'),
                'job_offer': offer_data
            })
            print(applications_list)

    return jsonify(applications_list)


# Number of applications per candidate
@app.route('/api/getapplicationsCount', methods=['GET'])
def get_applications_number():
    candidate_id = session.get('candidate_id')
    print("Session data:", session)  # Pour le debug

    if not candidate_id:
        return jsonify({"error": "Candidate ID is required"}), 400

    applications = Application.query.filter_by(candidate_id=candidate_id).all()

    applications_list = [
        {
            'id': app.id,
            'candidate_id': app.candidate_id,
            'job_offer_id': app.job_offer_id,
            'application_date': app.application_date.strftime('%Y-%m-%d %H:%M'),
            'job_offer': {
                'title': app.job_offer.title,
                'description': app.job_offer.description,
                'company': app.job_offer.company,
                'salary': app.job_offer.salary,
                'location': app.job_offer.location,
                'experience': app.job_offer.experience,
                'skills': app.job_offer.skills,
                'type': app.job_offer.type,
                'logo': app.job_offer.logo
            } if app.job_offer else None
        }
        for app in applications
    ]

 # Calculate the number of applied to jobs
    application_count = len(applications)

    # Return job offer statistics (number of job offers posted)
    return jsonify({
        'statistics': {
            'application_count': application_count
        }
    })






# Apply CORS to your specific route
CORS(app, resources={r"/api/upload-cv/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
  
@app.route('/api/upload-cv', methods=['POST'])
def upload_cv():
    candidate_id = session.get('user_id')
    print("Session data:", session)
    if 'cv' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['cv']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        app.config['UPLOAD_FOLDER'] = 'uploads/'  # make sure this folder exists
        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(upload_path)

        # Save filename in database
        candidate = Candidate.query.get(candidate_id)
        if candidate:
            candidate.cv_filename = filename
            db.session.commit()

        return jsonify({'message': 'File uploaded successfully'}), 200

    return jsonify({'error': 'Invalid file type'}), 400

def allowed_file(filename):
    allowed_extensions = {'pdf', 'doc', 'docx'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions





@app.route('/api/edit/candidate-profile', methods=['PUT'])
def update_candidate_profile():
    candidate_id = session.get('user_id')
    data = request.json
    candidate = Candidate.query.get(candidate_id)

    if not candidate:
        return jsonify({'error': 'Candidate not found'}), 404

    candidate.name = data.get('name')
    candidate.email = data.get('email')
    candidate.phoneNumber = data.get('phoneNumber')
    candidate.address = data.get('address')
    candidate.dateOfBirth = data.get('dateOfBirth')

    # Convert skills list to JSON string before saving
    skills = data.get('skills')
    if isinstance(skills, list):
        try:
            candidate.skills = json.dumps(skills)
        except Exception as e:
            return jsonify({'error': f'Failed to save skills: {e}'}), 400
    else:
        candidate.skills = '[]'  # fallback to empty list if not a list

    db.session.commit()

    return jsonify({'message': 'Profile updated successfully'})




@app.route('/api/candidates/<int:id>', methods=['PUT'])
def update_candidates(id):
    data = request.get_json()
    try:
        candidate = Candidate.query.get_or_404(id)
        candidate.name = data.get('name', candidate.name)
        candidate.email = data.get('email', candidate.email)
        candidate.phoneNumber = data.get('phoneNumber', candidate.phoneNumber)
        candidate.skills = data.get('skills', candidate.skills)
        db.session.commit()
        return jsonify({'message': 'Candidat mis à jour avec succès'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

with app.app_context():
    try:
        db.create_all()
        print("Tables créées avec succès")
    except Exception as e:
        print(f"Erreur lors de la création des tables : {str(e)}")



    # edit candidate profile

@app.route('/api/edit/candidate-profile', methods=['GET'])
def get_candidate_profiles():
    candidate_id = session.get('user_id')
    print("Session data:", session)  # This will display the session in your terminal/logs

    candidate = Candidate.query.get(candidate_id)
    skills = []
    if isinstance(candidate.skills, str):
        try:
            skills = json.loads(candidate.skills)
        except json.JSONDecodeError as e:
            print("JSON decoding failed:", e)
            return jsonify({"error": "Failed to decode skills data"}), 500
    elif isinstance(candidate.skills, list):
        skills = candidate.skills


    return jsonify({
    'id': candidate.id,
    'name': candidate.name,
    'email': candidate.email,
    'skills': skills,
    'phoneNumber': candidate.phoneNumber,
    'address': candidate.address,
    'dateOfBirth': candidate.dateOfBirth,
    'cv_filename': candidate.cv_filename
})

@app.route('/api/dashboardd')
def get_dashboard_data():
    total_candidates = Candidate.query.count()
    total_recruiters = Recruiter.query.count()
    total_jobs = JobOffer.query.count()

    # ✅ Calculate applications per week
    from datetime import datetime, timedelta
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    applications_this_week = Application.query.filter(Application.application_date >= one_week_ago).count()

    # ✅ Calculate new applications today
    today = datetime.utcnow().date()
    new_applications_today = Application.query.filter(Application.application_date >= today).count()

    # ✅ Calculate average applications per offer
    total_applications = Application.query.count()
    avg_applications_per_offer = total_applications / total_jobs if total_jobs > 0 else 0

    # ✅ Count job offers with applications
    offers_with_applications = db.session.query(JobOffer.id).join(Application, Application.job_offer_id == JobOffer.id).distinct().count()

    # ✅ Count job offers without applications
    offers_without_applications = total_jobs - offers_with_applications

    # ✅ Fetch recent applications
    recent_apps = Application.query.order_by(Application.application_date.desc()).limit(5).all()
    recent_applications = [
        {
            "name": Candidate.query.get(app.candidate_id).name if Candidate.query.get(app.candidate_id) else "Candidat inconnu",
            "position": JobOffer.query.get(app.job_offer_id).title if JobOffer.query.get(app.job_offer_id) else "Poste non spécifié",
            "application_date": app.application_date.strftime('%Y-%m-%d')
        } for app in recent_apps
    ]

    dashboard_data = {
        "total_candidates": total_candidates,
        "total_recruiters": total_recruiters,
        "total_job_offers": total_jobs,
        "applications_this_week": applications_this_week,  # ✅ Now included
        "new_applications_today": new_applications_today,  # ✅ Now included
        "avg_applications_per_offer": round(avg_applications_per_offer, 2),  # ✅ Now included
        "offers_with_applications": offers_with_applications,  # ✅ Now included
        "offers_without_applications": offers_without_applications,  # ✅ Now included
        "recent_applications": recent_applications
    }

    return jsonify(dashboard_data)

#! missing password
# change password

import random

@app.route('/api/request-reset', methods=['POST'])
def request_password_reset():
    data = request.json
    email = data.get("email")
    user = Recruiter.query.filter_by(email=email).first()
    print(user)

    if not user:
        return jsonify({"message": "Email not found"}), 404

    # ✅ Generate a 6-digit OTP
    otp = str(random.randint(100000, 999999))
    user.reset_token = otp  # Store OTP temporarily
    db.session.commit()

    # ✅ Send OTP via email
    msg = Message("Password Reset OTP", recipients=[email], body=f"Your OTP code: {otp}")
    mail.send(msg)

    return jsonify({"message": "OTP sent to your email."}), 200


@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    user = Recruiter.query.filter_by(email=email, reset_token=otp).first()
    if not user:
        return jsonify({"message": "Invalid OTP."}), 400

    return jsonify({"message": "OTP verified. Proceed to reset password."}), 200



@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get("email")
    new_password = data.get("password")

    user = Recruiter.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found."}), 404

    # ✅ Hash the new password
    user.set_password(new_password)
    user.reset_token = None  # ✅ Clear OTP after reset
    db.session.commit()

    return jsonify({"message": "Password reset successful."}), 200


@app.route('/api/candidate/request-reset', methods=['POST'])
def request_candidate_password_reset():
    data = request.json
    email = data.get("email")
    
    user = Candidate.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Email not found"}), 404

    # ✅ Generate OTP
    otp = str(random.randint(100000, 999999))
    user.reset_token = otp
    db.session.commit()
    print(user.reset_token)

    # ✅ Send OTP via email
    msg = Message("Candidate Password Reset OTP", recipients=[email], body=f"Your OTP code: {otp}")
    mail.send(msg)

    return jsonify({"message": "OTP sent to your email."}), 200

@app.route('/api/candidate/verify-otp', methods=['POST'])
def verify_candidate_otp():
    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    user = Candidate.query.filter_by(email=email, reset_token=otp).first()
    if not user:
        return jsonify({"message": "Invalid OTP."}), 400

    return jsonify({"message": "OTP verified. Proceed to reset password."}), 200


@app.route('/api/candidate/reset-password', methods=['POST'])
def reset_candidate_password():
    data = request.json
    email = data.get("email")
    new_password = data.get("password")

    user = Candidate.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found."}), 404

    # ✅ Hash new password
    user.set_password(new_password)
    user.reset_token = None  # ✅ Clear OTP after reset
    db.session.commit()

    return jsonify({"message": "Candidate password reset successful."}), 200


@app.route('/api/admin/request-reset', methods=['POST'])
def request_admin_password_reset():
    data = request.json
    email = data.get("email")
    
    user = Admin.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Email not found"}), 404

    # ✅ Generate OTP
    otp = str(random.randint(100000, 999999))
    user.reset_token = otp
    db.session.commit()

    # ✅ Send OTP via email
    msg = Message("Admin Password Reset OTP", recipients=[email], body=f"Your OTP code: {otp}")
    mail.send(msg)

    return jsonify({"message": "OTP sent to your email."}), 200


@app.route('/api/admin/verify-otp', methods=['POST'])
def verify_admin_otp():
    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    user = Admin.query.filter_by(email=email, reset_token=otp).first()
    if not user:
        return jsonify({"message": "Invalid OTP."}), 400

    return jsonify({"message": "OTP verified. Proceed to reset password."}), 200



@app.route('/api/admin/reset-password', methods=['POST'])
def reset_admin_password():
    data = request.json
    email = data.get("email")
    new_password = data.get("password")

    user = Admin.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found."}), 404

    # ✅ Hash new password
    user.set_password(new_password)
    user.reset_token = None  # ✅ Clear OTP after reset
    db.session.commit()

    return jsonify({"message": "Admin password reset successful."}), 200




@app.route('/api/notify-recruiter/<int:job_offer_id>', methods=['POST'])
def notify_recruiter(job_offer_id):  # ✅ Match parameter name exactly
    try:

        candidate_id = session.get('user_id')
        print("Session data:", session)
        print(f"Checking application for candidate_id={candidate_id}, job_offer_id={job_offer_id}")

        # Get the application info
        application = Application.query.filter_by(job_offer_id=job_offer_id, candidate_id=candidate_id).first()

        if not application:
            return jsonify({"message": "Application not found."}), 404

        candidate = Candidate.query.get(application.candidate_id)
        job_offer = JobOffer.query.get(application.job_offer_id)
        recruiter = Recruiter.query.get(job_offer.recruiter_id)
        print("Recruiter data:", recruiter)
        print("Recruiter data:", candidate)
        print("Recruiter data:", job_offer)

        cv_path = f"uploads/{candidate.cv_filename}"  # or whatever field you use


        # Compose the email
        subject = f"New Application for {job_offer.title}"
        body = f"""
        Hello,

        A new candidate has applied for your job offer: {job_offer.title}.

        Candidate details:
        - Name: {candidate.name}
        - Email: {candidate.email}
        - Phone: {candidate.phoneNumber}

        Regards,
        Your Job Application Platform
        """
        recruiter_email = recruiter.email
        msg = Message(subject=subject, recipients=[recruiter_email], body=body)
        # 📎 Attach the CV file
        with open(cv_path, 'rb') as cv_file:
            msg.attach(filename=candidate.cv_filename, content_type='application/pdf', data=cv_file.read())

        mail.send(msg)

        return jsonify({"message": "Recruiter notified successfully."}), 200
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({"message": "Failed to send email."}), 500

#  Sockets setup


from flask import Flask, session, jsonify, request
from flask_socketio import SocketIO, emit, join_room, leave_room
# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")  # Customize allowed origins as necessary

# ──────────────── Flask REST API routes ────────────────


def get_room_name(candidate_id, recruiter_id):
    """Generate a unique room name.  Order doesn't matter."""
    return f"chat_{min(candidate_id, recruiter_id)}_{max(candidate_id, recruiter_id)}"

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")
    if 'user_id' in session and 'user_type' in session:
        user_id = session['user_id']
        user_type = session['user_type']
        print(f"{user_type.capitalize()} {user_id} connected with session")
    else:
        print("Anonymous user connected")


@socketio.on('join_chat')
def handle_join_chat(data):
    if 'user_id' not in session:
        emit('error', {'message': 'You must be logged in to join a chat.'})
        return

    user_id = session['user_id']
    user_type = session['user_type']
    application_id = data.get('application_id')

    if not application_id:
        emit('error', {'message': 'application_id is required'})
        return

    application = Application.query.get(application_id)
    if not application:
        emit('error', {'message': 'Invalid application ID'})
        return

    candidate_id = application.candidate_id
    recruiter_id = application.job_offer.recruiter_id

    if user_type == 'candidate' and user_id != candidate_id:
        emit('error', {'message': 'Unauthorized to join this chat'})
        return
    elif user_type == 'recruiter' and user_id != recruiter_id:
        emit('error', {'message': 'Unauthorized to join this chat'})
        return

    print(f"Session data: {session}")
    print(f"User type: {user_type}, User ID: {user_id}, Application ID: {application_id}")

    room = f"chat_app_{application_id}"
    join_room(room)
    session['room'] = room
    print(f"{user_type.capitalize()} {user_id} joined room {room} for application {application_id}")
    emit('message', {
        'user': 'System',
        'message': f'{user_type.capitalize()} {user_id} joined the chat.'
    }, room=room)


@socketio.on('send_message')
def handle_send_message(data):
    if 'user_id' not in session:
        emit('error', {'message': 'You must be logged in to send messages.'})
        return

    user_id = session['user_id']
    user_type = session['user_type']
    message = data.get('message')
    room = session.get('room')

    if not message:
        emit('error', {'message': 'Message text is required.'})
        return

    if not room:
        emit('error', {'message': 'You are not in a chat room.'})
        return

    # Extract the application_id from the room name (room name format: chat_app_{application_id})
    try:
        application_id = int(room.split('_')[2])  # Assuming 'chat_app_{application_id}'
    except IndexError:
        emit('error', {'message': 'Invalid room name format'})
        return
    except ValueError:
        emit('error', {'message': 'Invalid application_id format in room name'})
        return

    if user_type == 'candidate':
        user = Candidate.query.get(user_id)
        sender_name = user.name if user else 'Unknown Candidate'
    elif user_type == 'recruiter' or user_type == 'admin':
        user = Recruiter.query.get(user_id)
        sender_name = user.name if user else 'Unknown Recruiter'
    else:
        sender_name = 'Unknown'

    # Insert message into the database
    new_message = Message(
        application_id=application_id,  # Use the correct application_id from room name
        sender_id=user_id,              # ID of the user sending the message
        sender_type=user_type,          # Type of the user (candidate, recruiter, admin)
        message=message,                # The actual message content
        timestamp=datetime.now()        # The current timestamp of when the message is sent
    )

    try:
        db.session.add(new_message)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error storing message: {e}")
        emit('error', {'message': 'Error storing message.'})

    emit('receive_message', {
        'user': sender_name,
        'message': message,
        'user_id': user_id,
        'user_type': user_type
    }, room=room)

    print(f"Message sent from {user_type} {user_id} to room {room}: {message}")

@app.route('/api/application/<int:application_id>/recruiter-started', methods=['GET'])
def has_recruiter_started(application_id):
    application = Application.query.get(application_id)
    if not application:
        return jsonify({'error': 'Application not found'}), 404

    # Check if recruiter sent any message
    message_exists = Message.query.filter_by(
        application_id=application_id,
        sender_type='recruiter'
    ).first()

    return jsonify({'recruiter_started': message_exists is not None})



@socketio.on('fetch_messages')
def handle_fetch_messages(data):
    application_id = data.get('application_id')
    
    if not application_id:
        emit('error', {'message': 'Invalid application_id'})
        return

    # Fetch messages for the given application_id
    messages = Message.query.filter_by(application_id=application_id).all()
    
    # Format the messages before sending them back to the frontend
    formatted_messages = [
        {
            'user': msg.sender_type,  # Assuming sender_name is a field in the Message model
            'message': msg.message,
            'user_id': msg.sender_id,
            'user_type': msg.sender_type,
            'timestamp': msg.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        }
        for msg in messages
    ]

    emit('fetch_messages_response', formatted_messages)

@socketio.on('disconnect')
def handle_disconnect():
    print("User disconnected")
    emit('message', {'user': 'System', 'message': 'User disconnected!'}, broadcast=True)

@app.route('/api/messages', methods=['GET'])
def get_messages():
    application_id = request.args.get('applicationId')
    if not application_id:
        return jsonify({"error": "Application ID is required"}), 400

    messages = Message.query.filter_by(application_id=application_id).order_by(Message.timestamp.asc()).all()
    return jsonify([msg.to_dict() for msg in messages])

#@socketio.on('send_message')
#def handle_send_message(data):
    #print(f"Message received in handle_send_message: {data}")
    #try:
        #emit('receive_message', data, broadcast=True)
        #print("Message emitted successfully")
    #except Exception as e:
        #print(f"Error emitting message: {e}")

# -------------------------------------------
#          INITIALISATION BASE DE DONNÉES
# -------------------------------------------
with app.app_context():
    try:
        db.create_all()
        print("Tables créées avec succès")
    except Exception as e:
        print(f"Erreur lors de la création des tables : {str(e)}")

# Lancement du serveur Flask
if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
