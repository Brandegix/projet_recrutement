from flask import render_template
from flask_mail import Message
from datetime import datetime, timedelta
from app import app, mail, db
from models import Candidate, JobOffer
from job_matcher import calculate_skill_match

def send_job_match_notification(candidate, matching_jobs):
    """Send email notification about matching jobs"""
    if not matching_jobs:
        return
        
    html_content = render_template(
        'email/job_matches.html', 
        candidate=candidate,
        matching_jobs=matching_jobs
    )
    
    msg = Message(
        subject=f"New Job Matches Found - CasaJobs",
        recipients=[candidate.email],
        html=html_content
    )
    
    mail.send(msg)
    print(f"Job match notification sent to {candidate.email}")

def check_for_matching_jobs():
    """Check for new job matches for all candidates with notifications enabled"""
    with app.app_context():
        # Get candidates who have enabled notifications
        candidates = Candidate.query.filter_by(notification_enabled=True).all()
        print(f"Found {len(candidates)} candidates with notifications enabled")
        
        # Get recent job offers (e.g., posted in the last 24 hours)
        yesterday = datetime.now() - timedelta(days=1)
        new_jobs = JobOffer.query.filter(JobOffer.created_at >= yesterday).all()
        print(f"Found {len(new_jobs)} job offers posted in the last 24 hours")
        
        for candidate in candidates:
            matching_jobs = []
            
            for job in new_jobs:
                match_percentage, matching_skills = calculate_skill_match(candidate.skills, job.skills)
                print(f"Candidate {candidate.name}: {len(matching_skills)} matching skills with {job.title}")
                
                # Change this to check for AT LEAST 3 MATCHING SKILLS
                if len(matching_skills) >= 3:  # Changed from percentage to count
                    matching_jobs.append({
                        'job': job,
                        'match_percentage': match_percentage,
                        'matching_skills': matching_skills
                    })
            
            if matching_jobs:
                send_job_match_notification(candidate, matching_jobs)
                print(f"Sent notification to {candidate.name} about {len(matching_jobs)} matching jobs")