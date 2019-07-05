import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const AboutBlurb = () =>
  <div className="jumbotron my-3">
    <h1 className="display-4">Anyone wanna play?</h1>
    <p className="lead">Play better matches more often.</p>
    <hr className="my-4" />
    <p><strong>Currently in alpha.</strong> If you like playing pickleball and are in the Philadelphia, email us to become a beta tester.</p>
    <a className="btn btn-primary btn-lg" href="mailto:signup@anyonewannaplay.com" role="button">Become a beta tester</a>
  </div>

const App = () =>
  <div className="container d-flex align-items-center banner">
    <AboutBlurb />
  </div>

export default App;
