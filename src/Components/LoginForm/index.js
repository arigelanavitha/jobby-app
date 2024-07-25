import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    isLoginFailed: false,
    errorMsg: '',
  }

  onRenderUsername = () => {
    const {username} = this.state
    return (
      <div className="input-container">
        <label htmlFor="textInput" className="input-label">
          USERNAME
        </label>
        <input
          type="text"
          className="input-value"
          id="textInput"
          placeholder="Username"
          value={username}
          onChange={this.onUpdateUsername}
          autoComplete={username}
        />
      </div>
    )
  }

  onRenderPassword = () => {
    const {password} = this.state
    return (
      <div className="input-container">
        <label htmlFor="passwordInput" className="input-label">
          PASSWORD
        </label>
        <input
          type="password"
          className="input-value"
          id="passwordInput"
          placeholder="Password"
          value={password}
          onChange={this.onUpdatePassword}
          autoComplete={password}
        />
      </div>
    )
  }

  onUpdateUsername = event => {
    this.setState({username: event.target.value})
  }

  onUpdatePassword = event => {
    this.setState({password: event.target.value})
  }

  loginSuccess = jwtToken => {
    this.setState({
      isLoginFailed: false,
      errorMsg: '',
      username: '',
      password: '',
    })
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  loginFailure = errorMsg => {
    this.setState({isLoginFailed: true, errorMsg})
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify({username, password}),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.loginSuccess(data.jwt_token)
    } else {
      this.loginFailure(data.error_msg)
    }
  }

  render() {
    const {isLoginFailed, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        <form className="login-form">
          <div className="login-app-logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              className="website-logo"
              alt="website logo"
            />
          </div>
          {this.onRenderUsername()}
          {this.onRenderPassword()}
          <button
            className="login-btn"
            type="submit"
            onClick={this.onSubmitLoginForm}
          >
            Login
          </button>
          {isLoginFailed && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default LoginForm
