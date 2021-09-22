import React, { Component } from 'react';
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom'
import {Dropdown} from 'react-bootstrap'
import './App.css';

const Dashboard = () => {
  const authInstance = window.gapi.auth2.getAuthInstance()
  const user = authInstance.currentUser.get()
  const profile = user.getBasicProfile()
  const email = profile.getEmail()
  const imageUrl = profile.getImageUrl()

  return (
    <>
      <nav>
        <div>Admin Portal</div>
        <img className="push" src={imageUrl}/>
        <Dropdown>
          <Dropdown.Toggle as="a">
            {email}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={authInstance.signOut}>
              Sign out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </nav>


      <div className="container">
        <p>UFO Museum: Roswell, NM</p>
        <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbloximages.chicago2.vip.townnews.com%2Fsiouxcityjournal.com%2Fcontent%2Ftncms%2Fassets%2Fv3%2Feditorial%2F2%2Fda%2F2dacdf32-5dff-51ea-a08d-c7b0afe9e670%2F565f79f2ae6b5.image.jpg%3Fresize%3D1200%252C803&f=1&nofb=1"/>
      </div>
      
    </>
  )
}

class LoginPage extends React.Component {
  
  componentDidMount() {
    window.gapi.load('signin2', () => {
      window.gapi.signin2.render('login-button')
    })
  }

  render() {
      return ( 
      <div className="container">
        <div id="login-button">Sign in with Google</div>
      </div>
    )
  }
}

const LandingPage = () => {
  return (
    <div className="container">
      <h1>Admin Portal</h1>
      <p>Guided Tour Admin Portal</p>
      <Link to="/dashboard">Login to Museum</Link>
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isSignedIn: null
    }
  }

  initializeGoogleSignIn () {
    window.gapi.load('auth2', () => {
       window.gapi.auth2.init({
         client_id: '750927893244-qer1plfq43tql3f3lgi8vb00cintpkm2.apps.googleusercontent.com'
       }).then(() => {
         const authInstance = window.gapi.auth2.getAuthInstance()
         const isSignedIn = authInstance.isSignedIn.get()
         this.setState({isSignedIn})

         authInstance.isSignedIn.listen(isSignedIn => {
           this.setState({isSignedIn})
         })
       })
    })
  }
 
  componentDidMount() {
    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/platform.js'
    script.onload = () => this.initializeGoogleSignIn()
    document.body.appendChild(script);
  }

  ifUserSignedIn(Component) {
    if (this.state.isSignedIn === null) {
      return (
        <h1>Checking if you're signed in...</h1>
      )
    }
    return this.state.isSignedIn ?
      <Component/> :
      <LoginPage/>
  }

  render() {
    return (
      <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <LandingPage/>
         </Route>
        <Route path="/dashboard" render={() =>
         this.ifUserSignedIn(Dashboard)} />
      </Switch>
      </BrowserRouter>
    )
  }

}

export default App;
