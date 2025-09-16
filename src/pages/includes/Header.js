import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthContext";
function Header() {
  let { state, dispatch } = useAuth();
  console.log(state);
  let navigate = useNavigate();
  const handleLogout = async () => {
    localStorage.clear();
    dispatch({ type: "LOGOUT" });
    navigate(`${process.env.PUBLIC_URL}/login`);
  };
  return (
    <>
      <div className="p-5 bg-secondary text-white text-center">
        <h1>Matrimony</h1>
        {/* <p>Resize this responsive page to see the effect!</p>  */}
      </div>
      {state.user && (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
          <div className="container-fluid">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to={process.env.PUBLIC_URL}>
                  Profiles
                </NavLink>
              </li>
              {state.user.role === "admin" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to={process.env.PUBLIC_URL + "/pendingProfiles"}
                    >
                      Pending Profiles
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to={process.env.PUBLIC_URL + "/viewManagers"}
                    >
                      Managers
                    </NavLink>
                  </li>
                </>
              )}
              {/* <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li> */}
            </ul>
            {/* <ul className="navbar-nav d-flex ">
            
            <li className="nav-item pull-right">
              <a className="nav-link" href="#"><i className="fa fa-sign-out" aria-hidden="true"></i> Log Out</a>
            </li>
          </ul> */}
            <div className="d-flex align-content-center">
              <h6 className="text-white me-3 mb-0">
                Welcome {state.user.name}
              </h6>
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                <i className="fa fa-sign-out" aria-hidden="true"></i> Log Out
              </button>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
export default Header;
