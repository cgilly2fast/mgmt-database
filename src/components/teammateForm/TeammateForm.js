import React, { Component } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { Alert } from "bootstrap";
import axios from "axios";
import ApiUrl from "../../globalVariables";
import { getTeammateById } from "../../store/actions/dbActions";
import { withRouter } from "react-router-dom";
import BackButton from "../../img/BackButton.svg";

export class TeammateForm extends Component {
  //const [loading, setLoading] = this.useState(true)
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      loading: false,

      form: {
        uuid: "",
        first_name: "",
        last_name: "",
        position: "",
        address: {
          display: "",
          apartment: "",
          street: "",
          number: "",
          city: "",
          state: "",
          postcode: "",
          latitude: "",
          longitude: "",
        },
        email: "",
        phone: "",
        payment_type: "",
        hours_sheet: "",
        picture: "",
      },
    };
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true, error: "" });
    let form = this.state.form;
    axios
      .post(ApiUrl + "/updateTeammate", form)
      .then((res) => {
        this.setState({ loading: false });
        this.props.history.push("/teammate/" + res.data.uuid);
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleInputChange = (event) => {
    let form = { ...this.state.form };
    form[event.target.id] = event.target.value;
    this.setState({
      form,
    });
  };
  handleAddresInputChange = (event) => {
    let form = { ...this.state.form };
    form.address[event.target.id] = event.target.value;
    this.setState({
      form,
    });
  };
  componentDidMount() {
    const { teammateId } = this.props.match.params;

    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.teammate
    ) {
      this.setState({ form: this.props.location.state.teammate });
    } else if (teammateId !== undefined) {
      this.props.getTeammateById(teammateId).then(() => {
        this.setState({ form: this.props.teammate });
      });
    }
  }

  render() {
    const { error, loading, form } = this.state;
    return (
      <>
        <img
          src={BackButton}
          alt="back"
          style={{ height: "30px", cursor: "pointer" }}
          onClick={() => this.props.history.goBack()}
        />

        <div>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="first_name">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                onChange={this.handleInputChange}
                value={form.first_name}
                required
              />
            </Form.Group>
            <Form.Group controlId="last_name">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.last_name}
                type="text"
                placeholder="Enter last name"
              />
            </Form.Group>
            <Form.Group controlId="position">
              <Form.Label>Position</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.position}
                type="text"
                placeholder="Enter teammate position"
                required
              />
            </Form.Group>
            <Form.Group controlId="picture">
              <Form.Label>Picture Url</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.picture}
                type="text"
                placeholder="Enter url to teammate picture"
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.email}
                type="email"
                placeholder="Enter email"
                required
              />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.phone}
                type="phone"
                placeholder="Enter phone number"
              />
            </Form.Group>

            <Form.Group controlId="street">
              <Form.Label>Address</Form.Label>
              <Form.Control
                onChange={this.handleAddresInputChange}
                value={form.address.street}
                placeholder="1234 Main St"
              />
            </Form.Group>

            <Form.Group controlId="number">
              <Form.Label>Address 2</Form.Label>
              <Form.Control
                onChange={this.handleAddresInputChange}
                value={form.address.number}
                placeholder="Apartment, studio, or floor"
              />
            </Form.Group>

            <Row>
              <Form.Group as={Col} controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  onChange={this.handleAddresInputChange}
                  value={form.address.city}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="state">
                <Form.Label>State</Form.Label>
                <Form.Control
                  onChange={this.handleAddresInputChange}
                  value={form.address.state}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="postcode">
                <Form.Label>Zip</Form.Label>
                <Form.Control
                  onChange={this.handleAddresInputChange}
                  value={form.address.postcode}
                />
              </Form.Group>
            </Row>
            <Row>
              <Col xs="auto" className="my-1">
                <Form.Label className="mr-sm-2" htmlFor="">
                  Choose Payment Type
                </Form.Label>
                <Form.Control
                  onChange={this.handleInputChange}
                  value={form.payment_type}
                  as="select"
                  className="mr-sm-2"
                  id="payment_type"
                  custom
                  required
                >
                  <option value="ACH">ACH</option>
                  <option value="Upwork">Upwork</option>
                  <option value="PayPal">PayPal</option>
                </Form.Control>
              </Col>
            </Row>

            <Form.Group controlId="hours_sheet">
              <Form.Label>Hours Sheet</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.hours_sheet}
                type="text"
                placeholder="Enter hours sheet url"
              />
            </Form.Group>
            {error && <Alert varient="danger">{error}</Alert>}
            <Button disabled={loading} variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    teammate: state.db.teammate,
  };
};
export default withRouter(
  connect(mapStateToProps, { getTeammateById })(TeammateForm)
);
