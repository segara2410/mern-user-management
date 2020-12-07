import React, { Component } from "react";
import axios from 'axios';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { MdEdit, MdDelete } from "react-icons/md";
import { Modal, Button, Form } from "react-bootstrap";
import classnames from "classnames";
import SweetAlert from 'react-bootstrap-sweetalert';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      usersNotReady: true, 
      users : [], 
      showModal: false,
      showAlert: false,
      managementState: "Create",
      _id: "",
      name: "",
      email: "",
      role: "User",
      password: "",
      password2: "",
      success: "",
      errors: {}
    };
  }
  
  getData() {
    axios.get('/api/users', {headers: {'x-access-token': localStorage.jwtToken}}).then(response => {
      this.setState({ users: response.data, usersNotReady: false });
    })
  }

  componentDidMount() {
    this.getData();
  }

  handleCreate = () => {
    this.setState({
      managementState: "Create",
      name: "",
      email: "",
      role: "User",
      password: "",
      password2: "",
    });
    this.handleShowModal();
  }

  handleEdit = (userData) => {
    this.setState({
      _id: userData._id,
      managementState: "Edit",
      name: userData.name,
      email: userData.email,
      role: userData.role,
      password: "",
      password2: "",
    });
    this.handleShowModal();
  }

  handleDelete = (_id) => {
    this.setState({ _id: _id, showAlert: true });
  }

  handleCancelDelete = () => {
    this.setState({ _id: "", showAlert: false });
  }

  createUser = () => {
    const userData = {
      name: this.state.name,
      email: this.state.email,
      role: this.state.role,
      password: this.state.password,
      password2: this.state.password2
    };

    axios.post('/api/users/create', userData,
      { headers: {'x-access-token': localStorage.jwtToken}}).then(response => {
        const newUsers = this.state.users;
        newUsers.push(response.data.user);
        this.setState({ showModal: false, errors: [], users: newUsers, success: response.data.success });
      }
    ).catch(err => this.setState({errors: err.response.data}));
  }
  
  updateUser = () => {
    const userData = {
      _id: this.state._id,
      name: this.state.name,
      email: this.state.email,
      role: this.state.role,
      password: this.state.password,
      password2: this.state.password2
    };

    axios.put('/api/users/update', userData,
      { headers: {'x-access-token': localStorage.jwtToken}}).then(response => {
        const newUsers = this.state.users;
        newUsers.forEach((user, index) => {
          if (user._id === this.state._id) {
            newUsers[index] = response.data.user;
          }
        })
        this.setState({ showModal: false, errors: [], users: newUsers, success: response.data.success });
      }
    ).catch(err => this.setState({errors: err.response.data}));
  }

  deleteUser = () => {
    axios.post('/api/users/delete', {_id: this.state._id},
      { headers: {'x-access-token': localStorage.jwtToken}}).then(response => {
        const newUsers = this.state.users.filter(user => user._id !== this.state._id); 
        this.setState({ _id: "", showAlert: false, users: newUsers, success: response.data.success });
      }
    );
  }

  handleCloseModal = () => { 
    this.setState({showModal: false, errors: []});
  }

  handleShowModal = () => { 
    this.setState({showModal: true});
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    if (this.state.managementState === "Create")
      this.createUser();
    
    if (this.state.managementState === "Edit")
      this.updateUser();
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="container">
        <h2 className="mt-5 mb-3 text-center">User Management</h2>
        { this.state.success &&
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {this.state.success}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.setState({success: ""})}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        }
        <div className="table-responsive">
          { this.props.auth.user.role === "Super Admin" &&
            <button className="btn btn-success float-right mb-2" onClick={this.handleCreate}>+ Add Account</button>
          }
          <table className="table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                { this.props.auth.user.role === "Super Admin" &&
                  <>
                    <th scope="col">Role</th>
                    <th scope="col">Action</th>
                  </>
                }
              </tr>
            </thead>
            <tbody>
              {this.state.users.map((user, i) => 
                <tr>
                  <th scope="row">{++i}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  { this.props.auth.user.role === "Super Admin" &&
                    <>
                      <td>{user.role}</td>
                      <td>
                        <button className="btn btn-sm mr-1 pt-0 btn-warning" onClick={() => this.handleEdit(user)}><MdEdit /></button>
                        <button className="btn btn-sm pt-0 btn-danger" onClick={() => this.handleDelete(user._id)}><MdDelete /></button>
                      </td>
                    </>
                  }
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.managementState} Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("form-control", {
                    "is-invalid": errors.name
                  })}
                />
                <div className="invalid-feedback">
                  {errors.name}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("form-control", {
                    "is-invalid": errors.email
                  })}
                />
                <div className="invalid-feedback">
                  {errors.email}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <Form.Control
                  onChange={this.onChange}
                  as="select"
                  defaultValue={this.state.role}
                  error={errors.role}
                  id="role"
                  className={classnames("form-control", {
                    "is-invalid": errors.role
                  })}
                >
                  <option>User</option>
                  <option>Admin</option>
                  <option>Super Admin</option>
                </Form.Control>
                <div className="invalid-feedback">
                  {errors.role}
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
                  className={classnames("form-control", {
                    "is-invalid": errors.password
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
                  className={classnames("form-control", {
                    "is-invalid": errors.password2
                  })}
                />
                <div className="invalid-feedback">
                  {errors.password2}
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={this.onSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
        <SweetAlert
          show={this.state.showAlert}
          danger
          showCancel
          confirmBtnText="Yes!"
          confirmBtnBsStyle="danger"
          title="Are you sure?"
          onConfirm={this.deleteUser}
          onCancel={this.handleCancelDelete}
        >
          This action is irreversible.
        </SweetAlert>
      </div>
    );
  }
}

User.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(User);
