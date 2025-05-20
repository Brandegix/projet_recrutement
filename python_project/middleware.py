from functools import wraps
from flask import session, render_template, redirect, url_for
from flask_socketio import emit

def role_required(allowed_roles):
    """
    Décorateur pour vérifier les rôles des utilisateurs
    :param allowed_roles: Liste des rôles autorisés
    :return: Décorateur
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session or 'user_type' not in session:
                return render_template('error_general.html',
                    error_code='401',
                    error_title="Non authentifié",
                    error_message="Vous devez être connecté pour accéder à cette page.",
                    error_details="Veuillez vous connecter pour continuer."
                ), 401
            
            if session['user_type'] not in allowed_roles:
                return render_template('error_general.html',
                    error_code='403',
                    error_title="Accès non autorisé",
                    error_message="Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
                    error_details=f"Rôles autorisés : {', '.join(allowed_roles)}",
                    current_role=session['user_type']
                ), 403
                
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def socket_role_required(allowed_roles):
    """
    Décorateur pour vérifier les rôles dans les événements Socket.IO
    :param allowed_roles: Liste des rôles autorisés
    :return: Décorateur
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session or 'user_type' not in session:
                emit('error', {
                    'code': '401',
                    'title': 'Non authentifié',
                    'message': 'Vous devez être connecté pour accéder à cette fonctionnalité.',
                    'details': 'Veuillez vous connecter pour continuer.'
                })
                return
            
            if session['user_type'] not in allowed_roles:
                emit('error', {
                    'code': '403',
                    'title': 'Accès non autorisé',
                    'message': 'Vous n\'avez pas les permissions nécessaires.',
                    'details': f'Rôles autorisés : {", ".join(allowed_roles)}',
                    'current_role': session['user_type']
                })
                return
                
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Rôles prédéfinis
ROLES = {
    'ADMIN': 'admin',
    'RECRUITER': 'recruiter',
    'CANDIDATE': 'candidate'
}

def auth_required(f):
    """
    Middleware pour vérifier l'authentification
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or 'user_type' not in session:
            return render_template('error_general.html',
                error_code='401',
                error_title="Non authentifié",
                error_message="Vous devez être connecté pour accéder à cette page.",
                error_details="Veuillez vous connecter pour continuer."
            ), 401
        return f(*args, **kwargs)
    return decorated_function

def socket_auth_required(f):
    """
    Middleware pour vérifier l'authentification dans Socket.IO
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or 'user_type' not in session:
            emit('error', {
                'code': '401',
                'title': 'Non authentifié',
                'message': 'Vous devez être connecté pour accéder à cette fonctionnalité.',
                'details': 'Veuillez vous connecter pour continuer.'
            })
            return
        return f(*args, **kwargs)
    return decorated_function

def handle_error(error):
    """
    Gestionnaire d'erreurs global pour l'application
    """
    error_code = getattr(error, 'code', 500)
    error_messages = {
        401: {
            'title': 'Non authentifié',
            'message': 'Vous devez être connecté pour accéder à cette page.',
            'details': 'Veuillez vous connecter pour continuer.'
        },
        403: {
            'title': 'Accès non autorisé',
            'message': 'Vous n\'avez pas les permissions nécessaires.',
            'details': 'Contactez l\'administrateur si vous pensez que c\'est une erreur.'
        },
        404: {
            'title': 'Page non trouvée',
            'message': 'La page que vous recherchez n\'existe pas.',
            'details': 'Vérifiez l\'URL ou retournez à l\'accueil.'
        },
        500: {
            'title': 'Erreur serveur',
            'message': 'Une erreur inattendue s\'est produite.',
            'details': 'Nos équipes ont été notifiées du problème.'
        }
    }

    error_info = error_messages.get(error_code, error_messages[500])
    
    return render_template('error_general.html',
        error_code=str(error_code),
        error_title=error_info['title'],
        error_message=error_info['message'],
        error_details=error_info['details']
    ), error_code 