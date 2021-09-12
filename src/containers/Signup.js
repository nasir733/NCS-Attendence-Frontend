import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { signup } from '../actions/auth';

const Signup = ({ signup, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        re_password: '',
        profile_pic: '',
        roll_no: '',
        grade: '',
        phone_number: '',
        address: '',
        
        
    });

    const [accountCreated, setAccountCreated] = useState(false);

    const {
      first_name,
      last_name,
      email,
      profile_pic,
      roll_no,
      grade,
      password,
        phone_number,
      address,
      re_password,
    } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
const ProfilePic = e => setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    const onSubmit = e => {
        e.preventDefault();
          let formdata = new FormData();
        formdata.append('first_name', first_name);
        formdata.append('last_name', last_name);
        formdata.append('email', email);
        formdata.append('password', password);
        formdata.append('re_password', re_password);
        formdata.append('profile_pic', profile_pic);
        formdata.append('roll_no', roll_no);
        formdata.append('grade', grade);
        formdata.append('phone_number', phone_number);
        formdata.append('address', address);

        if (password === re_password) {
            signup(formdata);
            setAccountCreated(true);
        }
    };

    if (isAuthenticated)
        return <Redirect to='/' />;
    if (accountCreated)
        return <Redirect to='login' />;
    
    return (
      <div className="container mt-5">
        <h1>Sign Up</h1>
        <p>Create your Account</p>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder="First Name"
              name="first_name"
              value={first_name}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder="Last Name"
              name="last_name"
              value={last_name}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="email"
              placeholder="Email*"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="password"
              placeholder="Password*"
              name="password"
              value={password}
              onChange={(e) => onChange(e)}
              minLength="6"
              required
            />
          </div>

          <div className="form-group">
            <input
              className="form-control"
              type="password"
              placeholder="Confirm Password*"
              name="re_password"
              value={re_password}
              onChange={(e) => onChange(e)}
              minLength="6"
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="int"
              placeholder="Roll No"
              name="roll_no"
              value={roll_no}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="password"
              placeholder="Grade"
              name="grade"
              value={grade}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="tel"
              placeholder="Phone Number"
              name="phone_number"
              value={phone_number}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder="Address"
              name="address"
              value={address}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlFile1">
              Your Profile Picture with clear face{" "}
            </label>
            <input
              type="file"
              className="form-control-file"
              id="exampleFormControlFile1"
              onChange={(e) => ProfilePic(e)}
              name="profile_pic"
              required
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Register
          </button>
        </form>
        <p className="mt-3">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    );

};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { signup })(Signup);
