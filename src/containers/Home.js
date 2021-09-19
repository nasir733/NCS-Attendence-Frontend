import React from "react";
import { Link } from "react-router-dom";

const home = () => (
  <div className="container mx-100 mw-100 ">
    <div className="jumbotron mt-5 bg-primary">
      <h1 className="display-4 text-white">
        Welcome to <span className="fw-bolder">Nova City School</span>{" "}
        Attendence System
      </h1>
      <p className="lead text-white">
        This is a super cool attendence system with all kinds of
        functionalities.
      </p>
      <p className="lead text-white fw-bold">Developed by Nasir Iqbal</p>
      <hr className="my-4 text-white" />
      {/* <p className="text-white ">Go ahead and login!</p> */}
      {/* <Link
        className="btn btn-success btn-lg"
        to="/view-attendence"
        role="button"
      >
        Continue
      </Link> */}
      <Link className="btn btn-success  btn-lg" to="/attendence" role="button">
        mark attendence
      </Link>
    </div>
  </div>
);

export default home;
