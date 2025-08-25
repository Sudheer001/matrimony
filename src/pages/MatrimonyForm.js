import { useState } from "react";
import { useNavigate } from 'react-router-dom';


export default function MatrimonyForm() {
  const [formData, setFormData] = useState({});
  const [photos, setPhotos] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        "https://softsolutionz.in/matrimony/server/API/create_profile",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();
      console.log(result);
      alert(result.message || "Profile submitted!");
      navigate('/');
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4 text-center">Matrimony Data Sheet</h2>
        <form onSubmit={handleSubmit}>
          {/* Personal Details */}
          <h4 className="mb-3">I) Personal Details</h4>
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
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                name="dob"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                name="age"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Birth Nakshatram & Padam</label>
              <input
                className="form-control"
                name="nakshatram"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Birth Rasi</label>
              <input
                className="form-control"
                name="rasi"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Time of Birth</label>
              <input
                type="time"
                className="form-control"
                name="tob"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Place of Birth</label>
              <input
                className="form-control"
                name="pob"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Height (in feet)</label>
              <input
                className="form-control"
                name="height"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Complexion</label>
              <select
                className="form-select"
                name="complexion"
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
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">College Studied</label>
              <input
                className="form-control"
                name="college"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Job</label>
              <select
                className="form-select"
                name="jobType"
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
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Company Name</label>
              <input
                className="form-control"
                name="company"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Salary per annum</label>
              <input
                type="number"
                className="form-control"
                name="salary"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Place of Work</label>
              <input
                className="form-control"
                name="workPlace"
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
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Family Details */}
          <h4 className="mt-5 mb-3">II) Family Details</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Father Name</label>
              <input
                className="form-control"
                name="fatherName"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Father Job</label>
              <input
                className="form-control"
                name="fatherJob"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Mother Name</label>
              <input
                className="form-control"
                name="motherName"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Mother Job</label>
              <input
                className="form-control"
                name="motherJob"
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
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Sub Caste</label>
              <input
                className="form-control"
                name="subCaste"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-12">
              <label className="form-label">Present Family Address</label>
              <textarea
                className="form-control"
                name="address"
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="col-md-6">
              <label className="form-label">Native Place</label>
              <input
                className="form-control"
                name="nativePlace"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Contact Numbers</label>
              <input
                className="form-control"
                name="contact"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Photo Upload */}
          <h4 className="mt-5 mb-3">III) Upload Photos</h4>
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
                      <p className="mb-1 small text-truncate" title={file.name}>
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
    </div>
  );
}
