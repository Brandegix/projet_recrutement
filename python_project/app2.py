# Importation des modules nécessaires
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask import send_from_directory
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify,session
import os

# Initialisation de l'application Flask
app = Flask(__name__)

# Activation de CORS pour permettre les requêtes depuis le frontend React
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Configuration de la base de données MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Ikram2003%40@localhost/jobs?charset=utf8mb4'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_recycle': 299,
    'pool_pre_ping': True
}

# session config
app.secret_key = 'mysupersecretkey'  # 🔐 Required for session
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = False


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
# jwt = JWTManager(app)

# -------------------------------------------
#               MODELES
# -------------------------------------------

# Modèle Candidat
# Modèles avec validation améliorée
class Candidate(db.Model):
    _tablename_ = 'candidates'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phoneNumber = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(255))
    dateOfBirth = db.Column(db.Date)
    skills = db.Column(db.Text)  # Store as Text (JSON serialized string)
    cv_filename = db.Column(db.String(255))  # Column to store the filename of the uploaded CV

    def set_skills(self, skills_list):
        # Convert the list of skills to a JSON string before saving it
        self.skills = json.dumps(skills_list)

    def get_skills(self):
        # Convert the JSON string back to a list of skills when retrieving it
        if self.skills:
            return json.loads(self.skills)
        return []

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Modèle Recruteur
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

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Modèle Offre d'emploi

# Modèle SQLAlchemy
class JobOffer(db.Model):
    __tablename__ = 'JobOffer'  # Ajouté pour s'assurer que le nom de la table est correct.

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
    logo = db.Column(db.String(255))  # Nouvelle colonne pour le logo


# Define the Application model
class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, nullable=False)
    job_offer_id = db.Column(db.Integer, db.ForeignKey('JobOffer.id'), nullable=False)
    application_date = db.Column(db.DateTime, default=datetime.utcnow)

    job_offer = db.relationship('JobOffer', backref='applications')  # ✅ Add this line

    def _repr_(self):
        return f"<Application{self.id}>"
# Création de la base de données si elle n'existe pas
with app.app_context():
    if not os.path.exists("job_offers.db"):
        db.create_all()

# -------------------------------------------
#               ROUTES API
# -------------------------------------------

# Enregistrement d'un candidat# Routes avec validation et gestion d'erreur améliorée
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

        # Handle date of birth
        dateOfBirth = data.get("dateOfBirth")
        if dateOfBirth:
            try:
                dateOfBirth = datetime.strptime(dateOfBirth, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"error": "Invalid date format. Expected YYYY-MM-DD"}), 400
        else:
            dateOfBirth = None

        # Convert skills list to JSON string
        skills = data.get('skills')
        if isinstance(skills, list):
            try:
                skills_json = json.dumps(skills)
            except Exception as e:
                return jsonify({'error': f'Failed to save skills: {e}'}), 400
        else:
            skills_json = '[]'

        # Create new candidate
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

        session['candidate_id'] = new_candidate.id
        session['user_type'] = 'candidate'
        # Send confirmation email
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

    <p>À bientôt,<br>L’équipe Casajobs.ma</p>
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
    # ! hna salina
# Connexion d'un candidat
@app.route("/api/candidates/login", methods=["POST"])
def login_candidate():
    try:
        data = request.get_json()
        candidate = Candidate.query.filter_by(username=data["username"]).first()
        if not candidate or not candidate.check_password(data["password"]):
            return jsonify({"error": "Identifiants invalides"}), 401

        session['candidate_id'] = candidate.id  # ✅ ENREGISTRER DANS LA SESSION
        session.permanent = True

        return jsonify({"message": "Connexion réussie", "id": candidate.id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/candidates/profile', methods=['GET'])
def get_candidate_profile():
    print("Session data:", session)

    user_id = session.get('candidate_id')
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
        'cv_filename': candidate.cv_filename 
    })

# Apply CORS to your specific route
CORS(app, resources={r"/api/upload-cv/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
  
@app.route('/api/upload-cv', methods=['POST'])
def upload_cv():
    candidate_id = session.get('candidate_id')
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
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(app.root_path, 'uploads'), filename)

@app.route('/api/getapplications', methods=['GET'])
def get_applications():
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

    return jsonify(applications_list)
#? Enregistrement d'un recruteur
@app.route("/api/recruiters/register", methods=["POST"])
def register_recruiter():
    try:
        data = request.get_json()
        required_fields = ['username', 'password', 'name', 'email', 'phoneNumber', 'companyName']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Champ manquant : {field}"}), 400

        if Recruiter.query.filter_by(username=data["username"]).first():
            return jsonify({"error": "Nom d'utilisateur déjà utilisé"}), 409
        if Recruiter.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email déjà utilisé"}), 409
        
        new_recruiter = Recruiter(
            username=data["username"],
            name=data["name"],
            email=data["email"],
            phoneNumber=data["phoneNumber"],
            address=data.get("address"),
            companyName=data["companyName"]
        )
        new_recruiter.set_password(data["password"])
        db.session.add(new_recruiter)
        db.session.commit()

        # Start session
        session['recruiter_id'] = new_recruiter.id
        session['user_type'] = 'recruiter'
        print("Session data:", session)  # This will display the session in your terminal/logs

        return jsonify({"message": "Recruteur enregistré avec succès", "id": new_recruiter.id}), 201

    except Exception as e:
        return jsonify({"error":str(e)}),500

# Connexion du recruteur avec JWT
# @app.route('/api/recruiters/login', methods=['POST'])
# def login_recruteur():
#     try:
#         data = request.get_json()
#         recruteur = Recruiter.query.filter_by(username=data.get('username')).first()
#         if recruteur and recruteur.check_password(data.get('password')):
#             access_token = create_access_token(identity=recruteur.id)
#             return jsonify(access_token=access_token), 200
#         return jsonify({"error": "Identifiants invalides"}), 401
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
#! Login recruiter
# Login recruiter
@app.route("/api/recruiters/login", methods=["POST"])
def login_recruiter():
    data = request.get_json()
    recruiter = Recruiter.query.filter_by(username=data["username"]).first()

    if not recruiter or not recruiter.check_password(data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    # ✅ Store recruiter ID in session
    session["recruiter_id"] = recruiter.id
    print("Session data:", session)  # This will display the session in your terminal/logs
    session.permanent = True  # Optionally make the session permanent
    print("Session data:", session)  # This will display the session in your terminal/logs

    return jsonify({"message": "Login successful", "id":recruiter.id})

# candidates who applied to certain job offers posted by a recruiter
@app.route('/api/recruiter/applications', methods=['GET'])
def get_recruiter_applications():
    recruiter_id = session.get('recruiter_id')
    print("Session data:", session)

    if not recruiter_id:
        return jsonify({"error": "Recruiter ID is required"}), 400

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


@app.route('/api/recruiter/job_offers', methods=['GET'])
def get_job_offers():
    recruiter_id = session.get('recruiter_id')
    print("Session :", session)

    # Check if the recruiter is logged in
    if not recruiter_id:
        return jsonify({"error": "Not logged in"}), 401
    
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
            'recruiter_id': offer.recruiter_id
        })
    
    return jsonify(result)
@app.route("/api/recruiter/profile", methods=["GET"])
def get_recruiter_profile():
    recruiter_id = session.get("recruiter_id")

    if not recruiter_id:
        return jsonify({"error": "Utilisateur non connecté"}), 401

    recruiter = Recruiter.query.get(recruiter_id)
    if not recruiter:
        return jsonify({"error": "Recruteur introuvable"}), 404

    return jsonify({
        "id": recruiter.id,
        "username": recruiter.username,
        "name": recruiter.name,
        "email": recruiter.email,
        "phoneNumber": recruiter.phoneNumber,
        "companyName": recruiter.companyName,
        "address": recruiter.address
    })

# @app.route('/api/j')
# def get_jobs():
#     jobs = [
#         {
#             'title': 'Développeur Full Stack',
#             'company': 'TechMar Solutions',
#             'location': 'Casablanca',
#             'experience': '2-5 ans d\'expérience',
#             'description': 'Nous recherchons un développeur Full Stack capable de travailler sur des projets web innovants.',
#             'skills': ['React', 'Node.js', 'SQL'],
#             'salary': '25 000 - 35 000 MAD',
#             'type': 'Temps plein'
#         }
#     ] * 6
#     return jsonify(jobs)

@app.route('/api/job_offersr', methods=['GET'])
def get_all_job_offersr():
    offres = JobOffer.query.all()
    data = [
        {'id': o.id, 'title': o.title, 'description': o.description}
        for o in offres
    ]
    return jsonify(data)

# Route pour ajouter une offre
@app.route("/api/add_job_offer", methods=["POST"])
def add_job_offer():
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
        recruiter_id=data["recruiter_id"]
    )

    db.session.add(new_offer)
    db.session.commit()

    return jsonify({"message": "Offre ajoutée avec succès !"}), 201

# Route pour récupérer toutes les offres
from flask import Flask, jsonify
#! ici j'ai ajouter un s pour elminer la double definition de cette fct
@app.route("/api/j", methods=["GET"])
def get_job_offerss():
    try:
        # Récupère toutes les offres d'emploi depuis la base de données
        offers = JobOffer.query.all()
        
        # Transforme chaque offre en un dictionnaire
        offers_list = [{
            "id": offer.id,
            "title": offer.title,
            "company": offer.company,
            "location": offer.location,
            "experience": offer.experience,
            "description": offer.description,
            "skills": offer.skills.split(",") if offer.skills else [],  # Sépare les compétences en tableau
            "salary": offer.salary,
            "type": offer.type,
            "recruiter_id": offer.recruiter_id
        } for offer in offers]
        
        # Retourne les offres sous forme de JSON
        return jsonify(offers_list)

    except Exception as e:
        # Si une erreur survient, on renvoie un message d'erreur
        return jsonify({"error": str(e)}), 500


# Route pour supprimer une offre
@app.route("/api/delete_job_offer/<int:offer_id>", methods=["DELETE"])
def delete_job_offer(offer_id):
    offer = JobOffer.query.get_or_404(offer_id)
    db.session.delete(offer)
    db.session.commit()
    return jsonify({"message": "Offre supprimée avec succès !"})

# Route pour modifier une offre
@app.route("/api/update_job_offer/<int:offer_id>", methods=["PUT"])
def update_job_offer(offer_id):
    offer = JobOffer.query.get_or_404(offer_id)
    data = request.json

    for key in ["title", "company", "location", "experience", "description", "skills", "salary", "type"]:
        if key in data:
            setattr(offer, key, data[key])

    db.session.commit()
    return jsonify({"message": "Offre mise à jour avec succès !"})





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
    app.run(host='0.0.0.0', port=5000, debug=True)
