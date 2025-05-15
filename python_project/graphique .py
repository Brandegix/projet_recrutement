from werkzeug.security import generate_password_hash
from datetime import datetime
from app import db  # Assurez-vous que votre application Flask et la base de données sont correctement configurées

# Modèle Candidat
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
    skills = db.Column(db.Text)  # Store as Text (JSON serialized string)
    cv_filename = db.Column(db.String(255))  # Column to store the filename of the uploaded CV

# Liste des candidats fictifs
candidates_data = [
    ('john_doe', 'password123', 'John Doe', 'john.doe@example.com', '0123456789', '123 Rue Exemple, Paris', '1990-01-01', 'Java, Python, SQL', 'john_cv.pdf'),
    ('jane_smith', 'securePass456', 'Jane Smith', 'jane.smith@example.com', '9876543210', '456 Rue Modèle, Lyon', '1992-03-14', 'JavaScript, React, Node.js', 'jane_cv.pdf'),
    ('alex_brown', 'alexPass789', 'Alex Brown', 'alex.brown@example.com', '0147258369', '789 Avenue des Champs, Marseille', '1988-07-22', 'C++, Java, HTML, CSS', 'alex_cv.pdf'),
    ('sarah_lee', 'sarahPass012', 'Sarah Lee', 'sarah.lee@example.com', '0236758492', '123 Boulevard Victor, Toulouse', '1994-11-30', 'Python, Flask, Docker', 'sarah_cv.pdf'),
    ('michael_white', 'michaelPass345', 'Michael White', 'michael.white@example.com', '0678239471', '555 Rue Libération, Bordeaux', '1991-05-15', 'Go, Kubernetes, AWS', 'michael_cv.pdf'),
    ('lucas_garcia', 'lucasPass678', 'Lucas Garcia', 'lucas.garcia@example.com', '0693847562', '789 Rue de la République, Nantes', '1995-09-10', 'React Native, Firebase, JavaScript', 'lucas_cv.pdf'),
    ('emma_jones', 'emmaPass901', 'Emma Jones', 'emma.jones@example.com', '0774568390', '102 Route des Alpes, Lille', '1993-12-05', 'PHP, Laravel, MySQL', 'emma_cv.pdf'),
    ('daniel_martin', 'danielPass234', 'Daniel Martin', 'daniel.martin@example.com', '0887365472', '333 Rue du Parc, Nice', '1990-04-18', 'Swift, iOS Development', 'daniel_cv.pdf'),
    ('olivia_davis', 'oliviaPass567', 'Olivia Davis', 'olivia.davis@example.com', '0652389475', '456 Avenue de la Gare, Montpellier', '1992-02-20', 'Angular, TypeScript, Node.js', 'olivia_cv.pdf'),
    ('jackson_wilson', 'jacksonPass890', 'Jackson Wilson', 'jackson.wilson@example.com', '0692837461', '101 Rue de la Mer, Nice', '1996-08-25', 'Java, Spring Boot, PostgreSQL', 'jackson_cv.pdf')
]

# Hachage des mots de passe et ajout des candidats
for username, password, name, email, phoneNumber, address, dateOfBirth, skills, cv_filename in candidates_data:
    hashed_password = generate_password_hash(password)  # Hachage du mot de passe
    candidate = Candidate(
        username=username,
        password_hash=hashed_password,
        name=name,
        email=email,
        phoneNumber=phoneNumber,
        address=address,
        dateOfBirth=datetime.strptime(dateOfBirth, '%Y-%m-%d'),
        skills=skills,
        cv_filename=cv_filename
    )
    
    # Ajouter le candidat à la base de données
    db.session.add(candidate)

# Sauvegarder dans la base de données
db.session.commit()

print("Candidats ajoutés avec succès !")
