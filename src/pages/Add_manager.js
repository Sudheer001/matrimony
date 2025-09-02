import { useState } from "react";
import { useNavigate } from 'react-router-dom';


export default function AddManager() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}update_profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, _method: "POST" }),
      });

      const result = await response.json();
      console.log(result);
      alert(result.message || "Profile submitted!");
      navigate(process.env.PUBLIC_URL+'/');
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong!");
    }
    setLoading(false);
  };
  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4 text-center">Add Manager</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name with surname</label>
              <input
                className="form-control"
                name="name"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                name="ph_no"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Alternative Number</label>
              <input
                type="text"
                className="form-control"
                name="ph_no2"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                onChange={handleChange}
              />
            </div>            
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-4"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
