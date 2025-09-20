import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditManager() {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}get_managers/${id}`)
    .then((response)=> response.json())
    .then((data) =>{
        if (data.status === "success") {
          setFormData(data.result[0]);
          console.log(formData);
        }
        setLoading(false);
    }).catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let submitData = {
      name: formData.name,
      phone_number: formData.phone_number,
      phone_number2: formData.phone_number2,
    };

    if(password){
      submitData.password=password;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}edit_manager/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...submitData, _method: "PUT" }),
        }
      );

      const result = await response.json();
      console.log(result);
      alert(result.message || "Profile updated!");
      navigate(process.env.PUBLIC_URL + "/viewManagers");
    } catch (error) {
      console.error("Error updating form:", error);
      alert("Something went wrong!");
    }
    setLoading(false);
  };
  return (
    <div className="container mt-5">
      <Link
        to={`${process.env.PUBLIC_URL}/viewManagers`}
        className="btn btn-secondary mb-3"
      >
        ← Back to Managers
      </Link>
      <div className="card shadow p-4">
        <h2 className="mb-4 text-center">Update Manager</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name with surname</label>
              <input
                className="form-control"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                name="phone_number"
                value={formData.phone_number || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Alternative Number</label>
              <input
                type="text"
                className="form-control"
                name="phone_number2"
                value={formData.phone_number2 || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="text"
                name="password"
                onChange={handleChangePassword}
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


