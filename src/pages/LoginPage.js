import { useState } from "react";
import { useAuth } from "../providers/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({ phone_number: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const { dispatch, state } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)


  const handleSubmit = (e) => {
    dispatch({ type: "LOGIN_START" });
setLoading(true);
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}login`, {
      method: "POST",
      // credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          localStorage.setItem('user', JSON.stringify((data.user)))
          dispatch({ type: "LOGIN_SUCCESS", payload: data.user });
          console.log(state);
          // alert(data.message)
          navigate(`${process.env.PUBLIC_URL}`);
          
        } else {
        dispatch({ type: "LOGIN_FAIL" });
          alert(data.message);
        }
        setLoading(false);
      });
  };

  return (
    <div className="container mt-4">
        <div className="card shadow p-4 w-50 mx-auto">
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit} className="py-4">
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input type="text" name="phone_number" className="form-control" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-control" onChange={handleChange} />
        </div>
        <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "logging..." : "Login"}
          </button>
      </form>
      </div>
    </div>
  );
}
