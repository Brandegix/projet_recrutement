import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CandidateSearchFilter() {
  const [candidates, setCandidates] = useState([]);
  const [filters, setFilters] = useState({ name: "", skills: "" });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/candidates`)
    .then((res) => res.json())
      .then((data) => {
        setCandidates(data);
      })
      .catch((err) => console.error("Error fetching candidates:", err));
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesName = candidate.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesSkills = filters.skills
      ? candidate.skills.some(skill => skill.name.toLowerCase().includes(filters.skills.toLowerCase()))
      : true;
    return matchesName && matchesSkills;
  });

  return (
    <div className="candidate-search-filter">
      <input
        type="text"
        name="name"
        placeholder="Search by name"
        value={filters.name}
        onChange={handleFilterChange}
      />
      <input
        type="text"
        name="skills"
        placeholder="Search by skills"
        value={filters.skills}
        onChange={handleFilterChange}
      />

      <div className="candidate-list">
        {filteredCandidates.map((candidate) => (
          <div key={candidate.id} className="candidate-card">
            <Link to={`/recruiter/candidate-profile/${candidate.id}`}>
              <h3>{candidate.name}</h3>
            </Link>
            <p>{candidate.skills.map((skill) => skill.name).join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CandidateSearchFilter;
