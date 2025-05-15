from werkzeug.security import generate_password_hash

# Mot de passe en clair
password = "20032003"  # Remplace par le mot de passe réel

# Générer le hash
hashed_password = generate_password_hash(password)

# Afficher le hash pour l'utiliser dans la base de données
print(hashed_password)
