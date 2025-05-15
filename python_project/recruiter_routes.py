from flask import Blueprint, jsonify
from models import JobOffer, Application

recruiter_bp = Blueprint('recruiter', __name__, url_prefix='/api/recruiter')

@recruiter_bp.route('/<int:recruiter_id>/offers', methods=['GET'])
def get_job_offers(recruiter_id):
    offers = JobOffer.query.filter_by(recruiter_id=recruiter_id).all()
    print(f"Offres récupérées: {offers}")  # Débogage
    return jsonify([{
        'id': offer.id,
        'title': offer.title,
        'company': offer.company,
        'location': offer.location,
        'experience': offer.experience,
        'description': offer.description,
        'skills': offer.skills,
        'salary': offer.salary,
        'type': offer.type,
        'logo': offer.logo
    } for offer in offers])

@recruiter_bp.route('/<int:recruiter_id>/applications', methods=['GET'])
def get_applications(recruiter_id):
    job_offer_ids = [o.id for o in JobOffer.query.filter_by(recruiter_id=recruiter_id).all()]
    print(f"Offres d'emploi IDs: {job_offer_ids}")  # Débogage
    applications = Application.query.filter(Application.job_offer_id.in_(job_offer_ids)).all()
    print(f"Candidatures récupérées: {applications}")  # Débogage
    return jsonify([{
        'id': app.id,
        'candidate_id': app.candidate_id,
        'job_offer_id': app.job_offer_id,
        'application_date': app.application_date.isoformat()
    } for app in applications])
