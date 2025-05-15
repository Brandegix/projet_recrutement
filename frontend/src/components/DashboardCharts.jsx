import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#aa00ff', '#e91e63'];

const DashboardCharts = () => {
  const [typeData, setTypeData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [recruiterId, setRecruiterId] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/recruiter/me`, { withCredentials: true })
      .then(res => {
        const id = res.data.recruiter_id;
        setRecruiterId(id);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de l\'ID du recruteur :', error);
      });
  }, []);

  useEffect(() => {
    if (recruiterId) {
      // axios.get(`/api/recruiter/${recruiterId}/offers-by-type`)
      //   .then(res => setTypeData(res.data));

      // axios.get(`/api/recruiter/${recruiterId}/skills-distribution`)
      //   .then(res => setSkillsData(res.data));

      axios.get(`/api/recruiter/${recruiterId}/offers-by-experience`)
        .then(res => setExperienceData(res.data));

      axios.get(`/api/recruiter/${recruiterId}/offers-by-location`)
        .then(res => setLocationData(res.data));

      axios.get(`/api/recruiter/${recruiterId}/offers-by-salary`)
        .then(res => setSalaryData(res.data));

      axios.get(`/api/recruiter/${recruiterId}/offers-by-company`)
        .then(res => setCompanyData(res.data));
    }
  }, [recruiterId]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
      
      {/* Pie Chart: Répartition des offres par expérience */}
      <div>
        <h3>Répartition des offres par expérience</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={experienceData || []}
            dataKey="count"
            nameKey="experience"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {Array.isArray(experienceData) && experienceData.map((_, index) => (
              <Cell key={`cell-exp-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Bar Chart: Répartition des offres par lieu */}
      <div>
        <h3>Répartition des offres par lieu</h3>
        <BarChart width={500} height={300} data={locationData || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="location" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" name="Nombre d'offres" />
        </BarChart>
      </div>

      {/* Bar Chart: Répartition des offres par salaire */}
      <div>
        <h3>Répartition des offres par salaire</h3>
        <BarChart width={500} height={300} data={salaryData || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="salary" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="Nombre d'offres" />
        </BarChart>
      </div>

      {/* Pie Chart: Répartition des offres par entreprise */}
      <div>
        <h3>Répartition des offres par entreprise</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={companyData || []}
            dataKey="count"
            nameKey="company"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {Array.isArray(companyData) && companyData.map((_, index) => (
              <Cell key={`cell-comp-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default DashboardCharts;
