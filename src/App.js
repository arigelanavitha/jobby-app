import {Route, Switch, Redirect} from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import LoginForm from './Components/LoginForm'
import Home from './Components/Home'
import Jobs from './Components/Jobs'
import JobItemDetails from './Components/JobItemDetails'
import NotFound from './Components/NotFound'
import './App.css'

// Replace your code here
const App = () => (
  <div>
    <Switch>
      <Route exact path="/login" component={LoginForm} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/jobs" component={Jobs} />
      <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
      <Route path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  </div>
)

export default App
