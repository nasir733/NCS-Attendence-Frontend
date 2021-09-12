import React from 'react';
import { Link } from 'react-router-dom';

const home = () => (
  <div className="container">
    <div className="jumbotron mt-5">
      <h1 className="display-4">Welcome to NCS Attendence System</h1>
      <p className="lead">
        This is a super cool attendence system with all kinds of
        functionalities.
      </p>
      <p className="lead">Developed with 💗 by Nasir Iqbal</p>
      <hr className="my-4" />
      <p>Go ahead and login!</p>
      <Link className="btn btn-primary btn-lg" to="/attendence" role="button">
        Continue
      </Link>
    </div>
  </div>
);

export default home;
