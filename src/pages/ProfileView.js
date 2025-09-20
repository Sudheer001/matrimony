import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useAuth } from "../providers/AuthContext";


export default function ProfileView() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { state } = useAuth();
  const [downloadData, setDownloadData] = useState();

  // Ref for PDF capture
  const profileRef = useRef();

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}get_profiles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setProfile(data.profile);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    // setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}get_profile_downloads/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          console.log(data.data);
          setDownloadData(data.data);
        }
        // setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        // setLoading(false);
      });
  }, [id, profile]);

  const handleProfileDeletion = () => {
    if (window.confirm("Delete this profile?")) {
      fetch(`${process.env.REACT_APP_API_URL}delete_profile/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
          navigate(process.env.PUBLIC_URL + "/");
        });
    }
  };

  const handleProfileStatus = (status) => {
    if (window.confirm("Do you want to change status?")) {
      fetch(`${process.env.REACT_APP_API_URL}update_profile_status/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...{ status }, _method: "PUT" }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
          setProfile({ ...profile, status });
        });
    }
  };

  const makeProfileLive = (profile_live) =>{
    if (window.confirm("Do you want to change status?")) {
      fetch(`${process.env.REACT_APP_API_URL}make_profile_live/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...{ profile_live }, _method: "PUT" }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
          setProfile({ ...profile, profile_live });
          setDownloadData();
        });
    }    
  };

  const handleProfileDownloads = async () => {
    try {
      let formData = {
        profile_id: id,
        manager_id: state.user.id,
      };
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}add_profile_downloads`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, _method: "POST" }),
        }
      );

      const result = await response.json();
      console.log(result);
      let profile_live = 'inactive';     
      setProfile({ ...profile, profile_live });
      return result.status === "success";
    } catch (error) {
      console.error("Error submitting form:", error);
      return false;
      // alert("Something went wrong!");
    }
  };

  const handleDownloadPDF = async () => {
    let downloadProfile = await handleProfileDownloads();
    if (!downloadProfile) {
      return alert("Something went wrong!");
    }

    const input = profileRef.current;

     // Wait for all images to load
  const images = input.querySelectorAll("img");
  const promises = [];

  images.forEach((img) => {
    if (!img.complete) {
      promises.push(
        new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // Still resolve on error
        })
      );
    }
  });

  await Promise.all(promises);
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true, // allow cross-origin images
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // If content exceeds one page, add extra pages
    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(`${profile.name}_profile.pdf`);
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

  if (!profile) {
    return <p className="text-center">Profile not found</p>;
  }

  const photoUrls = profile.photos
    ? profile.photos.map(
        (p) => `${process.env.REACT_APP_Server_Domain}${p.photo_path}`
      )
    : [];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between my-2">
        <div>
          <Link
            to={`${process.env.PUBLIC_URL}`}
            className="btn btn-secondary mb-3"
          >
            ← Back to Profiles
          </Link>
          <button
            onClick={handleDownloadPDF}
            className="btn btn-info mb-3 ms-2"            
          >
            <i className="fa fa-download" aria-hidden="true"></i> {!loading ? 'Download as PDF' : 'Downloading...'}
          </button>
        </div>
        {state.user.role === "admin" ? (
          <div>
            <Link
              to={`${process.env.PUBLIC_URL}/editProfile/${id}`}
              className="btn btn-warning mb-3 ms-2"
            >
              <i className="fa fa-pencil" aria-hidden="true"></i> Edit Profile
            </Link>
            {profile.status === "active" ? (
              <button
                onClick={() => handleProfileStatus("inactive")}
                className="btn btn-success mb-3 ms-2"
              >
                <i className="fa fa-power-off" aria-hidden="true"></i> Make
                Deactive
              </button>
            ) : profile.status === "inactive" ? (
              <button
                onClick={() => handleProfileStatus("active")}
                className="btn btn-danger mb-3 ms-2"
              >
                <i className="fa fa-power-off" aria-hidden="true"></i> Make
                Active
              </button>
            ) : (
              <button
                onClick={() => handleProfileStatus("active")}
                className="btn btn-danger mb-3 ms-2"
              >
                <i className="fa fa-power-off" aria-hidden="true"></i> Accept
                Profile
              </button>
            )}
            <button
              onClick={handleProfileDeletion}
              className="btn btn-danger mb-3 ms-2"
            >
              <i className="fa fa-trash" aria-hidden="true"></i> Delete Profile
            </button>
          </div>
        ) : (downloadData && profile.profile_live=='inactive') ? (
          downloadData.manager_id == state.user.id ? (
            <button
              onClick={() => makeProfileLive("active")}
              className="btn btn-success mb-3 ms-2"
            >
              <i className="fa fa-power-off" aria-hidden="true"></i> Make
              Profile Live
            </button>
          ) : (
            <p className="text-danger">This profile was downloaded by <b>{downloadData.manager.name}</b> on {downloadData.created_at}</p>
          )
        ) : (
          <p className="text-success ">This profile is in live to download...</p>
        )}
      </div>

      <div className="card shadow-lg p-4" ref={profileRef}>
        <h2 className="mb-4">{profile.name}</h2>
        <div className="row">
          {/* Photos */}
          <div className="col-md-3">
            {photoUrls.length > 0 ? (
              photoUrls.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Profile ${index + 1}`}
                  className="img-fluid rounded mb-2 border"
                  style={{ cursor: "pointer" }}
                />
              ))
            ) : (
              <div className="bg-light text-center p-5 rounded">
                No Photos Available
              </div>
            )}
          </div>

          {/* Full Details */}
          <div className="col-md-9">
            <h4 className="mb-3">Personal Information</h4>
            <table className="table table-bordered">
              <tbody>
                {profile.manager_name &&
                <tr>
                  <th>Manager Name</th>
                  <td>{profile.manager_name}</td>
                </tr>
}
                <tr>
                  <th>Full Name</th>
                  <td>{profile.name}</td>
                </tr>
                <tr>
                  <th>Age</th>
                  <td>{profile.age}</td>
                </tr>
                <tr>
                  <th>Date of Birth</th>
                  <td>{profile.dob}</td>
                </tr>
                <tr>
                  <th>Time of Birth</th>
                  <td>{profile.time_of_birth}</td>
                </tr>
                <tr>
                  <th>Place of Birth</th>
                  <td>{profile.place_of_birth}</td>
                </tr>
                <tr>
                  <th>Nakshatram / Padam</th>
                  <td>{profile.nakshatram_padam}</td>
                </tr>
                <tr>
                  <th>Rasi</th>
                  <td>{profile.rasi}</td>
                </tr>
                <tr>
                  <th>Height</th>
                  <td>{profile.height}</td>
                </tr>
                <tr>
                  <th>Complexion</th>
                  <td>{profile.complexion}</td>
                </tr>
              </tbody>
            </table>

            <h4 className="mt-4 mb-3">Education & Career</h4>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Education</th>
                  <td>{profile.education}</td>
                </tr>
                <tr>
                  <th>College</th>
                  <td>{profile.college}</td>
                </tr>
                <tr>
                  <th>Job Type</th>
                  <td>{profile.job_type}</td>
                </tr>
                <tr>
                  <th>Job Role</th>
                  <td>{profile.job_role}</td>
                </tr>
                <tr>
                  <th>Company</th>
                  <td>{profile.company}</td>
                </tr>
                <tr>
                  <th>Salary</th>
                  <td>₹{profile.salary}</td>
                </tr>
                <tr>
                  <th>Work Place</th>
                  <td>{profile.work_place}</td>
                </tr>
              </tbody>
            </table>

            <h4 className="mt-4 mb-3">Family Details</h4>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Father's Name</th>
                  <td>{profile.father_name}</td>
                </tr>
                <tr>
                  <th>Father's Job</th>
                  <td>{profile.father_job}</td>
                </tr>
                <tr>
                  <th>Mother's Name</th>
                  <td>{profile.mother_name}</td>
                </tr>
                <tr>
                  <th>Mother's Job</th>
                  <td>{profile.mother_job}</td>
                </tr>
                <tr>
                  <th>Sibling 1</th>
                  <td>
                    {profile.sibling1} ({profile.sibling1_job})
                  </td>
                </tr>
                <tr>
                  <th>Sibling 2</th>
                  <td>
                    {profile.sibling2} ({profile.sibling2_job})
                  </td>
                </tr>
              </tbody>
            </table>

            <h4 className="mt-4 mb-3">Other Details</h4>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Caste</th>
                  <td>{profile.caste}</td>
                </tr>
                <tr>
                  <th>Sub-caste</th>
                  <td>{profile.sub_caste}</td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td>{profile.address}</td>
                </tr>
                <tr>
                  <th>Native Place</th>
                  <td>{profile.native_place}</td>
                </tr>
                <tr>
                  <th>Partner Preference</th>
                  <td>{profile.partner_preference}</td>
                </tr>
                <tr>
                  <th>Contact</th>
                  <td>{profile.contact}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
