import Cookies from 'js-cookie'
import {Redirect, Route} from 'react-router-dom'
import Header from '../Components/Header'

const ProtectedRoute = props => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <div>
      <Header />
      <Route {...props} />
    </div>
  )
}

export default ProtectedRoute
