import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function ProfilesList() {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [visibleProfiles, setVisibleProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [placeFilter, setPlaceFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://192.168.0.117/matrimony/API/get_profiles")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setProfiles(data.profiles);
          setFilteredProfiles(data.profiles);
          setVisibleProfiles(data.profiles.slice(0, 10));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profiles:", err);
        setLoading(false);
      });
  }, []);

  // Apply filters
  useEffect(() => {
    let results = profiles;

    if (nameFilter) {
      results = results.filter(
        (p) => p.name && p.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (placeFilter) {
      results = results.filter(
        (p) =>
          p.work_place &&
          p.work_place.toLowerCase().includes(placeFilter.toLowerCase())
      );
    }

    if (salaryFilter) {
      results = results.filter(
        (p) => p.salary && parseFloat(p.salary) >= parseFloat(salaryFilter)
      );
    }

    if (ageFilter) {
      results = results.filter(
        (p) => p.age && parseInt(p.age) === parseInt(ageFilter)
      );
    }

    setFilteredProfiles(results);
    setPage(1);
    setVisibleProfiles(results.slice(0, 10));
  }, [nameFilter, placeFilter, salaryFilter, ageFilter, profiles]);

  // Infinite scroll
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 50 >=
      document.documentElement.offsetHeight
    ) {
      loadMore();
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    const start = (nextPage - 1) * 10;
    const end = nextPage * 10;
    const moreProfiles = filteredProfiles.slice(start, end);

    if (moreProfiles.length > 0) {
      setVisibleProfiles([...visibleProfiles, ...moreProfiles]);
      setPage(nextPage);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Matrimony Profiles</h2>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-3">
          <input
            type="text"
            placeholder="Filter by Name"
            className="form-control"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            placeholder="Filter by Place"
            className="form-control"
            value={placeFilter}
            onChange={(e) => setPlaceFilter(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            placeholder="Min Salary"
            className="form-control"
            value={salaryFilter}
            onChange={(e) => setSalaryFilter(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            placeholder="Filter by Age"
            className="form-control"
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : visibleProfiles.length === 0 ? (
        <p className="text-center">No profiles found</p>
      ) : (
        <div className="row">
          {visibleProfiles.map((profile) => (
            <div className="col-md-4 mb-3" key={profile.id}>
              <Link to={`/profile/${profile.id}`} className="text-decoration-none text-dark">
              <div className="card h-100 shadow-sm">
                {profile.photos && profile.photos.length > 0 ? (
                  <img
                    src={`http://192.168.0.117/matrimony/${profile.photos[0]}`}
                    alt={profile.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="bg-light d-flex align-items-center justify-content-center"
                    style={{ height: "200px" }}
                  >
                    <span>No Photo</span>
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{profile.name}</h5>
                  <p className="card-text">
                    <strong>Age:</strong> {profile.age} <br />
                    <strong>Salary:</strong> ₹{profile.salary} <br />
                    <strong>Place:</strong> {profile.work_place} <br />
                  </p>
                </div>
              </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Load more indicator */}
      {visibleProfiles.length < filteredProfiles.length && !loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading more...</span>
          </div>
        </div>
      )}
    </div>
  );
}
