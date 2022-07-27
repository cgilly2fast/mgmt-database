import React, { Component } from "react";
import { Form, Button, Col, Row, Alert } from "react-bootstrap";
import axios from "axios";
import ApiUrl from "../../globalVariables";
import BackButton from "../../img/BackButton.svg";
import { getUnitById } from "../../API";

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
    const currantProvider = this.props.match.params.provider;
    let unit = this.state.unit;
    let form = this.state.form;
    if (
      currantProvider === undefined ||
      currantProvider === this.state.form.provider ||
      !Object.keys(unit.listings).includes(form.provider)
    ) {
      if (currantProvider === undefined) {
        if (Object.keys(unit.listings).includes(form.provider)) {
          this.setState({
            error: "Select diffrant provider or remove existing provider",
            loading: false,
          });
        } else {
          unit.listings[form.provider] = form;
          axios
            .post(ApiUrl + "/updateUnit", unit)
            .then((res) => {
              this.setState({ loading: false });
              this.props.history.push("/unit/" + res.data.id);
            })
            .catch((err) => {
              this.setState({ error: err });
            });
        }
      } else {
        if (
          !Object.keys(unit.listings).includes(form.provider) &&
          currantProvider !== undefined
        ) {
          unit.listings[form.provider] = form;
          delete unit.listings[currantProvider];
          axios
            .post(ApiUrl + "/updateUnit", unit)
            .then((res) => {
              this.setState({ loading: false });
              this.props.history.push("/unit/" + res.data.id);
            })
            .catch((err) => {
              this.setState({ error: err });
            });
        } else {
          unit.listings[form.provider] = form;
          axios
            .post(ApiUrl + "/updateUnit", unit)
            .then((res) => {
              this.setState({ loading: false });
              this.props.history.push("/unit/" + res.data.id);
            })
            .catch((err) => {
              this.setState({ error: err });
            });
        }
      }
    } else {
      this.setState({
        error: "Select diffrant provider or remove existing provideraaaaa",
        loading: false,
      });
    }
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
    form.url = event.target.value;
    let domain = new URL(form.url);
    let provider = domain.hostname.replace("www.", "").replace(".com", "");

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

  async componentDidMount() {
    const { unitId, provider } = this.props.match.params;
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.unit
    ) {
      this.setState({
        unit: this.props.location.state.unit,
        form: this.props.location.state.unit.listings[provider],
      });
    } else if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.listing
    ) {
      this.setState({ form: this.props.location.state.listing });
    } else if (unitId !== undefined) {
      const unitDataById = await getUnitById(unitId);
      this.setState({
        unit: unitDataById,
        form: unitDataById.listing[provider],
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
          {error && (
            <Alert key="danger" variant="danger">
              {error}
            </Alert>
          )}
          <br />
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="url">
              <Form.Label>Listing URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter listing public ad url"
                onChange={this.handleUrlChange}
                value={form?.url}
                required
              />
            </Form.Group>
            <Row>
              <Col xs="auto" className="my-1">
                <Form.Label className="mr-sm-2" htmlFor="">
                  Active
                </Form.Label>
                <Form.Control
                  name="active"
                  onChange={this.handleInputChange}
                  value={form?.active}
                  as="select"
                  className="mr-sm-2"
                  id="active"
                  custom
                  required
                >
                  <option value={true}>true</option>
                  <option value={false}>false</option>
                </Form.Control>
              </Col>
            </Row>
            <Row>
              <Col xs="auto" className="my-1">
                <Form.Label className="mr-sm-2" htmlFor="">
                  Platfrom Provider
                </Form.Label>
                <Form.Control
                  onChange={this.handleInputChange}
                  value={form?.provider}
                  as="select"
                  className="mr-sm-2"
                  id="provider"
                  custom
                  required
                >
                  <option>Choose your provider</option>
                  <option value="airbnb">Airbnb</option>
                  <option value="homeaway">VRBO</option>
                  <option value="booking">Booking.com</option>
                  <option value="gilberthotels">Gilbert Hotels</option>
                </Form.Control>
              </Col>
            </Row>
            <Row>
              <Col xs="auto" className="my-1">
                <Form.Label className="mr-sm-2" htmlFor="">
                  Remit Taxes Collected
                </Form.Label>
                <Form.Control
                  name="remit_taxes"
                  onChange={this.handleInputChange}
                  value={form?.remit_taxes}
                  as="select"
                  className="mr-sm-2"
                  id="remit_taxes"
                  custom
                  required
                >
                  <option value={true}>true</option>
                  <option value={false}>false</option>
                </Form.Control>
              </Col>
            </Row>
            <Form.Group controlId="picture">
              <Form.Label>Picture Url</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form?.picture}
                type="url"
                placeholder="Enter picture url"
              />
            </Form.Group>
            <Form.Group controlId="public_name">
              <Form.Label>Listing Title</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form?.public_name}
                type="text"
                placeholder="Enter listing title"
                required
              />
            </Form.Group>

            <Button disabled={loading} variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </>
    );
  }
}

export default ListingForm;
