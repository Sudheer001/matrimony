import { NavLink, Link } from 'react-router-dom';
function Header(){
    return (
        <>
        <div className="p-5 bg-secondary text-white text-center">
        <h1>Matrimony</h1>
        {/* <p>Resize this responsive page to see the effect!</p>  */}
      </div>
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to={process.env.PUBLIC_URL+"/Matrimony"}>Add Profile</NavLink>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">Disabled</a>
            </li>
          </ul>
        </div>
      </nav>
      </>
    )
}
export default Header;