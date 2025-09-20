import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ViewManagers() {
  const [managerData, setManagerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}get_only_managers`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setManagerData(data.result);
          console.log(managerData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [managerData]);

  const updateStatus = (status, id) => {
    if (window.confirm("Do you want to change status?")) {
      fetch(`${process.env.REACT_APP_API_URL}update_manager_status/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...{ status }, _method: "PUT" }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
          setManagerData({ ...managerData, status });
        });
    }
  };

const handleDeletion = (id) => {
    if (window.confirm("Delete this profile?")) {
      fetch(`${process.env.REACT_APP_API_URL}delete_manager/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
        });
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex flex-row-reverse">
        <Link
          to={`${process.env.PUBLIC_URL}/addManager`}
          className="btn btn-primary mb-3"
        >
          Add Manager
        </Link>
      </div>

      <div className="card shadow p-4">
        <h2 className="mb-4 text-center">Managers</h2>

        {managerData.length > 0 ? (
          <table className="table table-stripped table-bordered">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Edit</th>
                <th>Status</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {managerData.length > 0 &&
                managerData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.phone_number}</td>
                    <td>
                      <Link
                        to={`${process.env.PUBLIC_URL}/editManager/${data.id}`}
                        className="btn btn-primary"
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </Link>
                    </td>
                    <td>
                      {data.status === "active" ? (
                        <button
                          className="btn btn-success"
                          onClick={() => updateStatus("inactive", data.id)}
                        >
                          <i className="fa fa-power-off" aria-hidden="true"></i>
                        </button>
                      ) : (
                        <button
                          className="btn btn-danger"
                          onClick={() => updateStatus("active", data.id)}
                        >
                          <i className="fa fa-power-off" aria-hidden="true"></i>
                        </button>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-danger" onClick={()=>handleDeletion(data.id)}>
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center border p-2">No data found</p>
        )}
      </div>
    </div>
  );
}
