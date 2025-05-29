import json

def calculate_skill_match(candidate_skills, job_skills):
    """Calculate match percentage between candidate skills and job requirements"""
    print(f"Raw candidate skills: {candidate_skills} ({type(candidate_skills)})")
    print(f"Raw job skills: {job_skills} ({type(job_skills)})")
    
    if not candidate_skills or not job_skills:
        return 0, []
    
    # Handle candidate skills
    if isinstance(candidate_skills, str):
        try:
            # Try to parse as JSON first
            candidate_skills = json.loads(candidate_skills)
            if isinstance(candidate_skills, list):
                # If it's a list of skill objects with 'name' property
                if candidate_skills and isinstance(candidate_skills[0], dict) and 'name' in candidate_skills[0]:
                    candidate_skills = [skill['name'] for skill in candidate_skills]
            else:
                # If JSON parsing worked but result isn't a list
                candidate_skills = candidate_skills.split(',')
        except:
            # Fall back to comma splitting
            candidate_skills = candidate_skills.split(',')
            
    # Handle job skills
    if isinstance(job_skills, str):
        try:
            job_skills = json.loads(job_skills)
        except:
            job_skills = job_skills.split(',')
    
    # Normalize skills (lowercase, strip whitespace)
    candidate_skills = [s.lower().strip() for s in candidate_skills if s]
    job_skills = [s.lower().strip() for s in job_skills if s]
    
    print(f"Processed candidate skills: {candidate_skills}")
    print(f"Processed job skills: {job_skills}")
    
    # Calculate match
    matches = set(candidate_skills).intersection(set(job_skills))
    match_percentage = len(matches) / len(job_skills) * 100 if job_skills else 0
    
    return match_percentage, list(matches)