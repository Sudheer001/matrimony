import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
// import Lightbox from "react-image-lightbox";
// import "react-image-lightbox/style.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ProfileView() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

//   // Lightbox state
//   const [isOpen, setIsOpen] = useState(false);
//   const [photoIndex, setPhotoIndex] = useState(0);

  // Ref for PDF capture
  const profileRef = useRef();

  useEffect(() => {
    setLoading(true);
    fetch(`https://softsolutionz.in/matrimony/server/API/get_profiles/${id}`)
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

  const handleDownloadPDF = async () => {
    const input = profileRef.current;
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,   // allow cross-origin images
      allowTaint: true
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
    ? profile.photos.map((p) => `https://softsolutionz.in/matrimony/server/${p}`)
    : [];

  return (
    <div className="container mt-4">
      <Link to="/" className="btn btn-secondary mb-3">
        ← Back to Profiles
      </Link>
      <button onClick={handleDownloadPDF} className="btn btn-success mb-3 ms-2">
        ⬇ Download as PDF
      </button>

      <div ref={profileRef} className="card shadow-lg p-4">
        <h2 className="mb-4">{profile.name}</h2>
        <div className="row">
          {/* Photos */}
          <div className="col-md-4">
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
          <div className="col-md-8">
            <h4 className="mb-3">Personal Information</h4>
            <table className="table table-bordered">
              <tbody>
                <tr><th>Full Name</th><td>{profile.name}</td></tr>
                <tr><th>Age</th><td>{profile.age}</td></tr>
                <tr><th>Date of Birth</th><td>{profile.dob}</td></tr>
                <tr><th>Time of Birth</th><td>{profile.time_of_birth}</td></tr>
                <tr><th>Place of Birth</th><td>{profile.place_of_birth}</td></tr>
                <tr><th>Nakshatram / Padam</th><td>{profile.nakshatram_padam}</td></tr>
                <tr><th>Rasi</th><td>{profile.rasi}</td></tr>
                <tr><th>Height</th><td>{profile.height}</td></tr>
                <tr><th>Complexion</th><td>{profile.complexion}</td></tr>
              </tbody>
            </table>

            <h4 className="mt-4 mb-3">Education & Career</h4>
            <table className="table table-bordered">
              <tbody>
                <tr><th>Education</th><td>{profile.education}</td></tr>
                <tr><th>College</th><td>{profile.college}</td></tr>
                <tr><th>Job Type</th><td>{profile.job_type}</td></tr>
                <tr><th>Job Role</th><td>{profile.job_role}</td></tr>
                <tr><th>Company</th><td>{profile.company}</td></tr>
                <tr><th>Salary</th><td>₹{profile.salary}</td></tr>
                <tr><th>Work Place</th><td>{profile.work_place}</td></tr>
              </tbody>
            </table>

            <h4 className="mt-4 mb-3">Family Details</h4>
            <table className="table table-bordered">
              <tbody>
                <tr><th>Father's Name</th><td>{profile.father_name}</td></tr>
                <tr><th>Father's Job</th><td>{profile.father_job}</td></tr>
                <tr><th>Mother's Name</th><td>{profile.mother_name}</td></tr>
                <tr><th>Mother's Job</th><td>{profile.mother_job}</td></tr>
                <tr><th>Sibling 1</th><td>{profile.sibling1} ({profile.sibling1_job})</td></tr>
                <tr><th>Sibling 2</th><td>{profile.sibling2} ({profile.sibling2_job})</td></tr>
              </tbody>
            </table>

            <h4 className="mt-4 mb-3">Other Details</h4>
            <table className="table table-bordered">
              <tbody>
                <tr><th>Caste</th><td>{profile.caste}</td></tr>
                <tr><th>Sub-caste</th><td>{profile.sub_caste}</td></tr>
                <tr><th>Address</th><td>{profile.address}</td></tr>
                <tr><th>Native Place</th><td>{profile.native_place}</td></tr>
                <tr><th>Partner Preference</th><td>{profile.partner_preference}</td></tr>
                <tr><th>Contact</th><td>{profile.contact}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {/* {isOpen && (
        <Lightbox
          mainSrc={photoUrls[photoIndex]}
          nextSrc={photoUrls[(photoIndex + 1) % photoUrls.length]}
          prevSrc={photoUrls[(photoIndex + photoUrls.length - 1) % photoUrls.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + photoUrls.length - 1) % photoUrls.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % photoUrls.length)
          }
        />
      )} */}
    </div>
  );
}
