import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const emptyUser = {
  first_name: "",
  last_name: "",
  email: ""
}

function signupBeta(userData) {
  return fetch('/.netlify/functions/beta-signup', {
    body: JSON.stringify({
      first_name:userData.first_name,
      last_name:userData.last_name,
      email:userData.email
    }),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const SignupForm = ({onSignup,onLoading}) => {
  const [user,setUser] = useState(emptyUser)

  const updateUser = (newValue) => setUser(
    Object.assign({},user,newValue)
  )

  const createUser = () => {
    if (onLoading) {onLoading();}

    const onCreate = (createdUser) => {
      if (createdUser) { onSignup(createdUser) }
    }

    signupBeta(user).then((result) => { onCreate(result.users[0]) })
  }

  return(
    <form className="form-inline" onSubmit={(e) => {e.preventDefault();}}>
      <p>If you like playing pickleball and are in the Philadelphia, you can sign up using the form below.</p>
      <div className="form-group ml-2">
        <label className="sr-only">Name</label>
        <input type="text" className="form-control form-control-lg mr-2" onChange={(e) => {updateUser({first_name:e.target.value})}} placeholder="First Name"></input>
        <input type="text" className="form-control form-control-lg" onChange={(e) => {updateUser({last_name:e.target.value})}} placeholder="Last Name"></input>
      </div>
      <div className="form-group ml-2">
        <label className="sr-only">Email</label>
        <input type="email" className="form-control form-control-lg" onChange={(e) => {updateUser({email:e.target.value})}} placeholder="Email"></input>
      </div>
      <button onClick={createUser} className="btn btn-primary btn-lg ml-2">Sign Up</button>
    </form>
  )
}

const AboutBlurb = () => {
  const [signupStatus,setSignupStatus] = useState()

  const onSignup = () => {setSignupStatus("Signed up")}
  const onLoading = () => {setSignupStatus("creating")}

  const statusForm = (status) => {
    switch(status) {
      case 'creating':
        return(<span>Signing you up.</span>)
      case "Signed up":
        return(<span>You are signed up as a beta. Please check your email for next steps.</span>)
      default:
        return(<SignupForm onSignup={onSignup} onLoading={onLoading}></SignupForm>)
    }
  }

  return(
    <div className="jumbotron my-3">
    <h1 className="display-4">Anyone wanna play?</h1>
    <p className="lead">Play better matches more often.</p>
    <hr className="my-4" />
    <p><strong>Currently in development.</strong></p>
    
    { statusForm(signupStatus) }
  </div>

  )
}
  
const App = () =>
  <div className="container d-flex align-items-center banner">
    <AboutBlurb />
  </div>

export default App;
