import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const {history} = props
  const onClickLogout = () => {
    history.replace('/login')
    Cookies.remove('jwt_token')
  }
  return (
    <nav className="header-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-logo-container"
        />
      </Link>
      <ul className="header-sm-items-container">
        <Link to="/">
          <li>
            <AiFillHome className="header-sm-icons" />
          </li>
        </Link>
        <Link to="/jobs">
          <li>
            <BsFillBriefcaseFill className="header-sm-icons" />
          </li>
        </Link>
        <li>
          <button type="button" className="sm-logout" onClick={onClickLogout}>
            <FiLogOut className="header-sm-icons" />
          </button>
        </li>
      </ul>
      <ul className="header-lg-items-container">
        <Link to="/" className="nav-item-link">
          <li className="nav-item">Home</li>
        </Link>
        <Link to="/jobs" className="nav-item-link">
          <li className="nav-item">Jobs</li>
        </Link>
      </ul>
      <button type="button" className="logout-btn" onClick={onClickLogout}>
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
