import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [photos_server, setPhotos_server] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Fetch profile details
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}get_profiles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setFormData(data.profile);
          setPhotos_server(data.profile.photos);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleDeletePhoto = (photoId) => {
    if (window.confirm("Delete this photo?")) {
      fetch(`${process.env.REACT_APP_API_URL}delete_photo/${photoId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
          setPhotos_server(photos_server.filter((p) => p.id !== photoId));
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    for (const key in formData) {
      if(formData[key] !== 'photos'){
        data.append(key, formData[key]);
      }
      
    }

    photos.forEach((file) => {
      data.append("photos[]", file);
    });

    console.log(formData);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}update_profile/${id}`,
        {
          method: "POST",
          body: data,
        }
      );

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

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Link to="/" className="btn btn-secondary mb-3">
        ← Back to Profiles
      </Link>
      <div className="card shadow-lg p-4">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          {/* Personal Details */}
          <h4 className="mb-3">I) Personal Details</h4>
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
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                name="dob"
                value={formData.dob || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Birth Nakshatram & Padam</label>
              <input
                className="form-control"
                name="nakshatram"
                value={formData.nakshatram_padam ? formData.nakshatram_padam :  formData.nakshatram || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Birth Rasi</label>
              <input
                className="form-control"
                name="rasi"
                value={formData.rasi || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Time of Birth</label>
              <input
                type="time"
                className="form-control"
                name="tob"
                value={formData.tob ? formData.tob :formData.time_of_birth || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Place of Birth</label>
              <input
                className="form-control"
                name="pob"
                value={formData.pob ? formData.pob : formData.place_of_birth || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Height (in feet)</label>
              <input
                className="form-control"
                name="height"
                value={formData.height || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Complexion</label>
              <select
                className="form-select"
                name="complexion"
                value={formData.complexion || ''}
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
                value={formData.education || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">College Studied</label>
              <input
                className="form-control"
                name="college"
                value={formData.college || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Job</label>
              <select
                className="form-select"
                name="jobType"
                value={formData.jobType ? formData.jobType : formData.job_type || ''}
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
                value={formData.jobRole ? formData.jobRole : formData.job_role || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Company Name</label>
              <input
                className="form-control"
                name="company"
                value={formData.company || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Salary per annum</label>
              <input
                type="number"
                className="form-control"
                name="salary"
                value={formData.salary || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Place of Work</label>
              <input
                className="form-control"
                name="workPlace"
                value={formData.workPlace ? formData.workPlace : formData.work_place || ''}
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
                value={formData.partnerPreference ? formData.partnerPreference : formData.partner_preference || ''}
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
                value={formData.fatherName ? formData.fatherName : formData.father_name || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Father Job</label>
              <input
                className="form-control"
                name="fatherJob"
                value={formData.fatherJob ? formData.fatherJob : formData.father_job || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Mother Name</label>
              <input
                className="form-control"
                name="motherName"
                value={formData.motherName ? formData.motherName : formData.mother_name || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Mother Job</label>
              <input
                className="form-control"
                name="motherJob"
                value={formData.motherJob ? formData.motherJob : formData.mother_job || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Sibling 1</label>
              <input
                className="form-control"
                name="sibling1"
                value={formData.sibling1 || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Sibling 2</label>
              <input
                className="form-control"
                name="sibling2"
                value={formData.sibling2 || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Sibling 1 Job</label>
              <input
                className="form-control"
                name="siblingJob1"
                value={formData.siblingJob1 ? formData.siblingJob1 : formData.sibling1_job || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Sibling 2 Job</label>
              <input
                className="form-control"
                name="siblingJob2"
                value={formData.siblingJob2 ? formData.siblingJob2 : formData.sibling2_job || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Caste</label>
              <input
                className="form-control"
                name="caste"
                value={formData.caste || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Sub Caste</label>
              <input
                className="form-control"
                name="subCaste"
                value={formData.subCaste ? formData.subCaste : formData.sub_caste || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-12">
              <label className="form-label">Present Family Address</label>
              <textarea
                className="form-control"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="col-md-6">
              <label className="form-label">Native Place</label>
              <input
                className="form-control"
                name="nativePlace"
                value={formData.nativePlace ? formData.nativePlace : formData.native_place || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Contact Numbers</label>
              <input
                className="form-control"
                name="contact"
                value={formData.contact || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Photo Upload */}
          <h4 className="mt-5 mb-3">III) Upload Photos</h4>
          <div className="row g-3 mb-3">
          {photos_server.length > 0 && photos_server.map((photo, index) => (
          
            <div className="col-md-3 position-relative">
            <img
                    src={`${process.env.REACT_APP_Server_Domain}${photo.photo_path}`}
                    alt="Profile"
                    className="img-thumbnail"
                    style={{ width: "100%", height: "100px", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    onClick={() => handleDeletePhoto(photo.id)}
                  >
                    ×
                  </button>
            </div>
          
          ))}
</div>
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
