import { useEffect, useState } from "react";
import { User, Building, Shield, Save, X, AlertCircle, CheckCircle } from "lucide-react";

function EditRecruiterProfile() {
  const [profile, setProfile] = useState({
    companyName: "",
    email: "",
    description: "",
    phoneNumber: "",
    address: "",
    name: "",
    creationDate: "",
    public_profile: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = (path) => {
    // Mock navigation function - replace with actual routing logic
    console.log(`Navigating to: ${path}`);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/recruiter/profile`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          setProfile({
            ...data,
            description: data.description || "",
            public_profile: data.public_profile || false,
          });
        } else {
          setErrors({ general: "Erreur lors du chargement du profil" });
        }
      } catch (error) {
        setErrors({ general: "Erreur de connexion" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!profile.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!profile.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!profile.companyName.trim()) {
      newErrors.companyName = "Le nom de l'entreprise est requis";
    }

    if (profile.phoneNumber && !/^[\d\s\-+]+$/.test(profile.phoneNumber)) {
      newErrors.phoneNumber = "Format de téléphone invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({
      ...profile,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      setErrors({});

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recruiter/update_profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(profile),
        }
      );

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        setSuccessMessage("Profil mis à jour avec succès !");

        setTimeout(() => {
          navigate("/RecruiterProfile");
        }, 1500);
      } else {
        const errorData = await res.json();
        setErrors({ general: errorData.message || "Erreur lors de la mise à jour" });
      }
    } catch (error) {
      setErrors({ general: "Erreur de connexion" });
    } finally {
      setIsSaving(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-20">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-transparent border-t-orange-300 rounded-full animate-spin" style={{animationDelay: '0.15s'}}></div>
      </div>
      <p className="text-xl text-slate-600 font-medium">Chargement du profil...</p>
    </div>
  );

  const MessageAlert = ({ type, message, icon: Icon }) => (
    <div className={`flex items-center gap-3 p-4 mb-6 rounded-xl border transition-all duration-300 ${
      type === 'success' 
        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
        : 'bg-red-50 border-red-200 text-red-700'
    }`}>
      <Icon size={20} />
      <span className="font-medium">{message}</span>
    </div>
  );

  const InputField = ({ label, name, type = "text", placeholder, required = false, rows }) => (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "textarea" ? (
        <>
          <textarea
            id={name}
            name={name}
            value={profile[name]}
            onChange={handleChange}
            placeholder={placeholder}
            rows={rows}
            maxLength={500}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 resize-vertical focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 ${
              errors[name] ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          />
          <div className="text-xs text-gray-500 text-right">
            {(profile[name] || "").length}/500 caractères
          </div>
        </>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={profile[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 ${
            errors[name] ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        />
      )}
      {errors[name] && (
        <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
          <AlertCircle size={16} />
          {errors[name]}
        </div>
      )}
    </div>
  );

  const Section = ({ icon: Icon, title, children }) => (
    <div className="space-y-6 pb-8 border-b border-gray-100 last:border-b-0">
      <h3 className="flex items-center gap-3 text-xl font-bold text-slate-800">
        <Icon size={24} className="text-orange-500" />
        {title}
      </h3>
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="flex justify-center items-start py-10 px-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-12 px-8">
            <div className="mb-4">
              <User size={40} className="mx-auto mb-4" />
            </div>
            <h1 className="text-4xl font-bold mb-3 tracking-tight">Modifier votre profil</h1>
            <p className="text-lg opacity-95">Mettez à jour vos informations professionnelles</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {successMessage && (
              <MessageAlert type="success" message={successMessage} icon={CheckCircle} />
            )}

            {errors.general && (
              <MessageAlert type="error" message={errors.general} icon={AlertCircle} />
            )}

            <div onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <Section icon={User} title="Informations personnelles">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Nom complet"
                    name="name"
                    placeholder="Votre nom complet"
                    required
                  />
                  <InputField
                    label="Adresse email"
                    name="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    required
                  />
                </div>
                <InputField
                  label="Numéro de téléphone"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+33 1 23 45 67 89"
                />
              </Section>

              {/* Company Information */}
              <Section icon={Building} title="Informations de l'entreprise">
                <InputField
                  label="Nom de l'entreprise"
                  name="companyName"
                  placeholder="Nom de votre entreprise"
                  required
                />
                <InputField
                  label="Adresse de l'entreprise"
                  name="address"
                  placeholder="Adresse complète"
                />
                <InputField
                  label="Description de l'entreprise"
                  name="description"
                  type="textarea"
                  placeholder="Décrivez votre entreprise, ses activités, sa culture..."
                  rows={5}
                />
              </Section>

              {/* Privacy Settings */}
              <Section icon={Shield} title="Paramètres de confidentialité">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 transition-colors duration-200">
                  <input
                    type="checkbox"
                    id="public_profile"
                    name="public_profile"
                    checked={profile.public_profile}
                    onChange={handleChange}
                    className="w-5 h-5 mt-1 text-orange-500 rounded border-gray-300 focus:ring-orange-500 focus:ring-2"
                  />
                  <label htmlFor="public_profile" className="cursor-pointer">
                    <div className="font-semibold text-gray-800 mb-1">Rendre mon profil public</div>
                    <div className="text-sm text-gray-600">
                      Permettre aux candidats de voir votre profil d'entreprise
                    </div>
                  </label>
                </div>
              </Section>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/RecruiterProfile")}
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  <X size={20} />
                  Annuler
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditRecruiterProfile;
