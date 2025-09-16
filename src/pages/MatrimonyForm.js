import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";

export default function MatrimonyForm() {
  const [formData, setFormData] = useState({});
  const [photos, setPhotos] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useAuth();
  const [profileSubmitted, setprofileSubmitted] = useState(false);

  const [managerData, setManagerData] = useState([]);

  useEffect(() => {
    // setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}get_active_managers`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setManagerData(data.result);
          console.log(managerData);
        }
        // setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        // setLoading(false);
      });
  }, [managerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos([...photos, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setPhotos([...photos, ...files]);
    }
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    photos.forEach((file) => {
      data.append("photos[]", file);
    });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}create_profile`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();
      console.log(result);
      alert(result.message || "Profile submitted!");
      if (state.user) {
        navigate(process.env.PUBLIC_URL + "/");
      } else {
        setprofileSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      {profileSubmitted ? (
        <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
          <div
            className="card shadow p-5 text-center"
            style={{ maxWidth: "500px" }}
          >
            <div className="mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle"
                style={{ width: "100px", height: "100px" }}
              >
                <i className="fa fa-check-circle text-success" aria-hidden="true" style={{fontSize: '6.5rem'}}></i>
              </div>
            </div>

            <h2 className="h4 fw-bold">Submitted Successfully</h2>
            <p className="text-muted mt-3 mb-0">
              Thank you — your submission has been received successfully.
            </p>
          </div>
        </div>
      ) : (
        <div className="card shadow p-4">
          <h2 className="mb-4 text-center">Matrimony Data Sheet</h2>
          <form onSubmit={handleSubmit}>
            <h4 className="mb-3">1) Manager Details</h4>
            <div className="row g-3 b-3">
              <div className="col-md-6">
                <label className="form-label">Select Manager</label>
                <select
                  className="form-select"
                  name="manager"
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {managerData.length > 0 &&
                    managerData.map((manager, index) => (
                      <option value={manager.id} key={index}>
                        {manager.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            {/* Personal Details */}
            <h4 className="mb-3">2) Personal Details</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name with surname</label>
                <input
                  className="form-control"
                  name="name"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  name="dob"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  name="age"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Birth Nakshatram & Padam</label>
                <input
                  className="form-control"
                  name="nakshatram"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Birth Rasi</label>
                <input
                  className="form-control"
                  name="rasi"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Time of Birth</label>
                <input
                  type="time"
                  className="form-control"
                  name="tob"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Place of Birth</label>
                <input
                  className="form-control"
                  name="pob"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Height (in feet)</label>
                <input
                  className="form-control"
                  name="height"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Complexion</label>
                <select
                  className="form-select"
                  name="complexion"
                  required
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Fair">Fair</option>
                  <option value="Medium">Medium</option>
                  <option value="Dark">Dark</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Education</label>
                <input
                  className="form-control"
                  name="education"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">College Studied</label>
                <input
                  className="form-control"
                  name="college"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Job</label>
                <select
                  className="form-select"
                  name="jobType"
                  required
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Software">Software</option>
                  <option value="Bank">Bank</option>
                  <option value="Govt">Govt. Job</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Job Role</label>
                <input
                  className="form-control"
                  name="jobRole"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Company Name</label>
                <input
                  className="form-control"
                  name="company"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Salary per annum</label>
                <input
                  type="number"
                  className="form-control"
                  name="salary"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Place of Work</label>
                <input
                  className="form-control"
                  name="workPlace"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  Wanted partner from any specific field?
                </label>
                <input
                  className="form-control"
                  name="partnerPreference"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Family Details */}
            <h4 className="mt-5 mb-3">3) Family Details</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Father Name</label>
                <input
                  className="form-control"
                  name="fatherName"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Father Job</label>
                <input
                  className="form-control"
                  name="fatherJob"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Mother Name</label>
                <input
                  className="form-control"
                  name="motherName"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Mother Job</label>
                <input
                  className="form-control"
                  name="motherJob"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Sibling 1</label>
                <input
                  className="form-control"
                  name="sibling1"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Sibling 2</label>
                <input
                  className="form-control"
                  name="sibling2"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Sibling 1 Job</label>
                <input
                  className="form-control"
                  name="siblingJob1"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Sibling 2 Job</label>
                <input
                  className="form-control"
                  name="siblingJob2"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Caste</label>
                <input
                  className="form-control"
                  name="caste"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Sub Caste</label>
                <input
                  className="form-control"
                  name="subCaste"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Present Family Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  required
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="col-md-6">
                <label className="form-label">Native Place</label>
                <input
                  className="form-control"
                  name="nativePlace"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Contact Numbers</label>
                <input
                  className="form-control"
                  name="contact"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Photo Upload */}
            <h4 className="mt-5 mb-3">4) Upload Photos</h4>
            <div
              className={`border border-2 p-4 text-center rounded ${
                dragActive ? "border-primary bg-light" : "border-secondary"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="form-control d-none"
                id="photoUpload"
              />
              <label htmlFor="photoUpload" style={{ cursor: "pointer" }}>
                {photos.length > 0 ? (
                  <div className="row g-3">
                    {photos.map((file, index) => (
                      <div
                        key={index}
                        className="col-md-4 text-center position-relative"
                      >
                        <button
                          type="button"
                          className="btn-close position-absolute top-0 end-0 m-1"
                          aria-label="Remove"
                          onClick={() => removePhoto(index)}
                        ></button>
                        <p
                          className="mb-1 small text-truncate"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="img-fluid rounded border"
                          style={{ maxHeight: "150px" }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mb-0">
                    Drag & Drop photos here or click to upload
                  </p>
                )}
              </label>
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
      )}
    </div>
  );
}
