import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="container p-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-4 bg-white border rounded">
            <h2 className="text-center mt-4 mb-4">Register</h2>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  placeholder="Enter Name"
                  className={classnames("form-control", {
                    "is-invalid": errors.name
                  })}
                />
              </div>
              <div className="form-group">
                <div className="invalid-feedback">
                  {errors.name}
                </div>
                <label htmlFor="email">Email</label>
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  className={classnames("form-control", {
                    "is-invalid": errors.email || errors.emailnotfound
                  })}
                />
                <div className="invalid-feedback">
                  {errors.email}
                  {errors.emailnotfound}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  className={classnames("form-control", {
                    "is-invalid": errors.password || errors.passwordincorrect
                  })}
                />
                <div className="invalid-feedback">
                  {errors.password}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password2">Confirm Password</label>
                <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                  placeholder="Enter Password Confirmation"
                  className={classnames("form-control", {
                    "is-invalid": errors.password2
                  })}
                />
                <div className="invalid-feedback">
                  {errors.password2}
                </div>
              </div>
              <div>
                <button
                  style={{
                    width: "100%"
                  }}
                  type="submit"
                  className="btn btn-outline-dark mb-1"
                >
                  Login
                </button>
                <div className="mb-4">Already have an account? <a href="/">Login.</a></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
