import React, { Component } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { Alert } from "bootstrap";
import axios from "axios";
import ApiUrl from "../../globalVariables";
import { getUnitById } from "../../store/actions/dbActions";

export class ListingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      loading: false,
      unit: { listing: {} },
      form: {
        id: "",
        url: "",
        active: true,
        picture: "",
        provider: "",
        remit_taxes: "",
        public_name: "",
      },
    };
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true, error: "" });
    let unit = this.state.unit;
    let form = this.state.form;
    unit.listings[form.id] = form;
    axios
      .post(ApiUrl + "/updateUnit", unit)
      .then((res) => {
        this.setState({ loading: false });
        this.props.history.push("/unit/" + res.data.id);
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
  handleUrlChange = (event) => {
    let form = { ...this.state.form };
    console.log(event.target.value);
    form.url = event.target.value;
    let domain = new URL(form.url);
    let provider = domain.hostname.replace("www.", "").replace(".com", "");

    console.log(provider);
    if (provider === "airbnb") {
      form.provider = provider;
      form.id = form.url.match(/(?<=\/rooms\/)(\d*)/g)[0];
    } else if (provider === "vrbo" || provider === "homeaway") {
      form.provider = "homeaway";
      let a = form.url.match(/(?<=.com\/)(\d*)/g)[0];
      let b = form.url.match(/(?<=unitId=)(\d*)/gm)[0];
      form.id = "321." + a + "." + b;
    } else if (provider === "booking") {
      form.provider = "booking";
    }
    this.setState({
      form,
    });
  };
  componentDidMount() {
    const { unitId, listingId } = this.props.match.params;

    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.unit
    ) {
      this.setState({
        unit: this.props.location.state.unit,
        form: this.props.location.state.unit.listings[listingId],
      });
    } else if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.listing
    ) {
      this.setState({ form: this.props.location.state.listing });
    } else if (unitId !== undefined) {
      this.props.getUnitById(unitId).then(() => {
        this.setState({
          unit: this.props.unit,
          form: this.props.unit.listing[listingId],
        });
      });
    }
  }

  render() {
    const { error, loading, form } = this.state;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="url">
            <Form.Label>Listing URL</Form.Label>
            <Form.Control
              type="url"
              placeholder="Enter listing public ad url"
              onChange={this.handleUrlChange}
              value={form.url}
              required
            />
          </Form.Group>
          <Form.Row>
            <Col xs="auto" className="my-1">
              <Form.Label className="mr-sm-2" htmlFor="">
                Active
              </Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.active}
                as="select"
                className="mr-sm-2"
                id="payment_type"
                custom
                required
              >
                <option value={true}>true</option>
                <option value={false}>false</option>
              </Form.Control>
            </Col>
          </Form.Row>
          <Form.Row>
            <Col xs="auto" className="my-1">
              <Form.Label className="mr-sm-2" htmlFor="">
                Platfrom Provider
              </Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.provider}
                as="select"
                className="mr-sm-2"
                id="payment_type"
                custom
                required
              >
                <option value="airbnb">Airbnb</option>
                <option value="homeaway">VRBO</option>
                <option value="booking">Booking.com</option>
                <option value="gilberthotels">Gilbert Hotels</option>
              </Form.Control>
            </Col>
          </Form.Row>
          <Form.Row>
            <Col xs="auto" className="my-1">
              <Form.Label className="mr-sm-2" htmlFor="">
                Remit Taxes Collected
              </Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.remit_tax}
                as="select"
                className="mr-sm-2"
                id="remit_tax"
                custom
                required
              >
                <option value={true}>true</option>
                <option value={false}>false</option>
              </Form.Control>
            </Col>
          </Form.Row>
          <Form.Group controlId="picture">
            <Form.Label>Picture Url</Form.Label>
            <Form.Control
              onChange={this.handleInputChange}
              value={form.picture}
              type="url"
              placeholder="Enter picture url"
            />
          </Form.Group>
          <Form.Group controlId="public_name">
            <Form.Label>Listing Title</Form.Label>
            <Form.Control
              onChange={this.handleInputChange}
              value={form.public_name}
              type="text"
              placeholder="Enter listing title"
              required
            />
          </Form.Group>

          {error && <Alert varient="danger">{error}</Alert>}
          <Button disabled={loading} variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    unit: state.db.unit,
  };
};
export default connect(mapStateToProps, { getUnitById })(ListingForm);
