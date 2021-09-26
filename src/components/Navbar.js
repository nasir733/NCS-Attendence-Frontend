import React, { Fragment } from "react";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import download from "../download.jfif";
const navbar = ({ isAuthenticated, logout }) => {
  const authLinks = (
    <li className="nav-item">
      <a className="nav-link text-white" onClick={logout} href="#!">
        Logout
      </a>
    </li>
  );

  const guestLinks = (
    <Fragment>
      <li className="nav-item">
        <NavLink className="nav-link text-white" exact to="/login">
          Login
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link  text-white" exact to="/signup">
          Sign Up
        </NavLink>
      </li>
    </Fragment>
  );

  return (
    <Navbar bg="warning" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <img src={download} alt="" className="w-25 h-25" srcSet="" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(navbar);
