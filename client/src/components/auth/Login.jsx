import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/user");
    }

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

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="container mt-5 p-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-4 bg-white border rounded">
            <h2 className="text-center mt-4 mb-4">Login</h2>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="form-group">
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
                  {errors.passwordincorrect}
                </div>
              </div>
              <div>
                <button
                  style={{
                    width: "100%"
                  }}
                  type="submit"
                  className="btn btn-outline-dark mb-4"
                >
                  Login
                </button>
                <div className="mb-4">Don't have an account? <a href="/register">Sign Up.</a></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
