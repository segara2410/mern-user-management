import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class Navbar extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <a className="navbar-brand" href="/">User Management</a>

          { this.props.auth.user.name &&
            <>
              <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                  <div className="navbar-nav">
                  </div>
                  <div className="navbar-nav">
                    { this.props.auth.user.role === "Super Admin" &&
                      <NavLink to="/user" className="nav-item nav-link mr-3" activeClassName="active">Manage User</NavLink>
                    }
                    <NavLink to="/chart" className="nav-item nav-link mr-3" activeClassName="active">Chart</NavLink>
                    <div className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle" href="!#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.props.auth.user.name}
                      </a>
                      <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                        <a href="!#" onClick={this.onLogoutClick} className="dropdown-item">Logout</a>
                      </div>
                    </div>
                  </div>
              </div>
            </>
          }
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logoutUser })(Navbar)

