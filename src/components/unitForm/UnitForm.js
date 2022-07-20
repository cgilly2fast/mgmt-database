import React, { Component } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { getUnitById, getOwners } from "../../store/actions/dbActions";
import { connect } from "react-redux";
import { Alert } from "bootstrap";
import axios from "axios";
import ApiUrl from "../../globalVariables";
import { Multiselect } from "multiselect-react-dropdown";
import TimePicker from "react-bootstrap-time-picker";
import { withRouter } from "react-router-dom";
import BackButton from "../../img/BackButton.svg";

export class UnitForm extends Component {
  //const [loading, setLoading] = this.useState(true)
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      loading: false,
      options: [],
      form: {
        id: "",
        name: "",
        picture: "",
        capacity: {
          max: "",
          bedrooms: "",
          bathrooms: "",
          beds: "",
        },
        check_in: "",
        check_out: "",
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
        active: true,
        amenities_list: "",
        faq: "",
        listing_settings: "",
        house_manaul: "",
        guidebook_url: "",
        send_guest_info: "",
        guest_info_type: "",
        currency: "",
        listing: {},
        photos: "",
        property_type: "",
        owner: {},
        tax_rate: "",
        wifi: "",
        wifi_password: "",
        rent: "",
        cleaning_fee: "",
        office: "Stinson Beach",
      },
    };
    this.multiselectRef = React.createRef();
  }

  getSelectedValues() {
    return this.multiselectRef.current.getSelectedItems();
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true, error: "" });
    let form = this.state.form;
    axios
      .post(ApiUrl + "/updateUnit", form)
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
  handleTimeChange = (time) => {
    var n = time;
    n = n % (24 * 3600);
    var hour = parseInt(n / 3600);

    n %= 3600;
    var minutes = n / 60;

    n %= 60;

    var stringTime = "";
    if (hour < 10) {
      stringTime += "0";
    }
    stringTime += hour + ":";
    if (minutes.toFixed() < 10) {
      stringTime += "0";
    }
    stringTime += minutes.toFixed();
    return stringTime;
  };
  handleMultiSelectChange = (event) => {
    let form = { ...this.state.form };
    form.owner = this.getSelectedValues();
    this.setState({
      form,
    });
  };
  handleCapacityChange = (event) => {
    let form = { ...this.state.form };
    form.capacity[event.target.id] = event.target.value;
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
    const { unitId } = this.props.match.params;
    let options = [];
    this.props.getOwners().then(() => {
      const { owners } = this.props;
      for (let i = 0; i < owners.length; i++) {
        options.push({
          uuid: owners[i].uuid,
          first_name: owners[i].first_name,
          last_name: owners[i].last_name,
          phone: owners[i].phone,
          email: owners[i].email,
          picture: owners[i].picture,
        });
      }
      this.setState({ options: options });
    });
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.unit
    ) {
      const { unit } = this.props.location.state;

      unit.owner = [unit.owner];
      this.setState({ form: unit });
    } else if (unitId !== undefined) {
      this.props.getTeammateById(unitId).then(() => {
        this.setState({ form: this.props.owner });
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
            <Form.Group controlId="name">
              <Form.Label>Unit Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter unit name"
                onChange={this.handleInputChange}
                value={form.name}
                require
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
            <Form.Group controlId="max">
              <Form.Label>Accommodates</Form.Label>
              <Form.Control
                onChange={this.handleCapacityChange}
                value={form.capacity.max}
                type="text"
                placeholder="Enter number of people"
              />
            </Form.Group>
            <Form.Group controlId="bedrooms">
              <Form.Label>Bedrooms</Form.Label>
              <Form.Control
                onChange={this.handleCapacityChange}
                value={form.capacity.bedrooms}
                type="text"
                placeholder="3"
              />
            </Form.Group>
            <Form.Group controlId="bathrooms">
              <Form.Label>Bathrooms</Form.Label>
              <Form.Control
                onChange={this.handleCapacityChange}
                value={form.capacity.bathrooms}
                type="text"
                placeholder="3"
              />
            </Form.Group>
            <Form.Group controlId="beds">
              <Form.Label>Beds</Form.Label>
              <Form.Control
                onChange={this.handleCapacityChange}
                value={form.capacity.beds}
                type="text"
                placeholder="3"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Owner</Form.Label>
              <Multiselect
                controlId="unit"
                onRemove={this.handleMultiSelectChange}
                onSelect={this.handleMultiSelectChange}
                selectedValues={form.owner}
                options={this.state.options}
                displayValue="first_name"
                selectionLimit={1}
                ref={this.multiselectRef}
              />
            </Form.Group>
            <Form.Group controlId="check_in">
              <Form.Label>Check In Time</Form.Label>
              <TimePicker
                start="9:00"
                end="21:00"
                step={30}
                value={form.check_in}
                onChange={(time) => {
                  form.check_in = this.handleTimeChange(time);
                  this.setState({ form: form });
                }}
              />
            </Form.Group>

            <Form.Group controlId="check_out">
              <Form.Label>Check Out Time</Form.Label>
              <TimePicker
                start="9:00"
                end="21:00"
                step={30}
                value={form.check_out}
                onChange={(time) => {
                  form.check_out = this.handleTimeChange(time);
                  this.setState({ form: form });
                }}
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
                  Office
                </Form.Label>
                <Form.Control
                  onChange={this.handleInputChange}
                  value={form.office}
                  as="select"
                  className="mr-sm-2"
                  id="office"
                  custom
                  require
                >
                  <option value="Stinson Beach">Stinson Beach</option>
                  <option value="Waikiki">Waikiki</option>
                </Form.Control>
              </Col>
            </Row>
            <Row>
              <Col xs="auto" className="my-1">
                <Form.Label className="mr-sm-2" htmlFor="">
                  Active
                </Form.Label>
                <Form.Control
                  onChange={this.handleInputChange}
                  value={form.active}
                  as="select"
                  className="mr-sm-2"
                  id="active"
                  custom
                >
                  <option value="0">true</option>
                  <option value="1">false</option>
                </Form.Control>
              </Col>
            </Row>
            <Form.Group controlId="rent">
              <Form.Label>Rent</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.rent}
                type="url"
                placeholder="Enter rent per month"
              />
            </Form.Group>

            <Form.Group controlId="cleaning_fee">
              <Form.Label>Cleaners Pay</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.cleaning_fee}
                type="url"
                placeholder="Enter amount paid to cleaners each cleaning"
              />
            </Form.Group>
            <Form.Group controlId="amenities_list">
              <Form.Label>Amenities List</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.amenities_list}
                type="url"
                placeholder="Enter google sheets url"
              />
            </Form.Group>
            <Form.Group controlId="faq">
              <Form.Label>FAQ URL</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.faq}
                type="url"
                placeholder="Google docs url"
              />
            </Form.Group>
            <Form.Group controlId="listing_settings">
              <Form.Label>Listing Settings</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.listing_settings}
                type="url"
                placeholder="Google sheets url"
              />
            </Form.Group>
            <Form.Group controlId="house_manaul">
              <Form.Label>House Manual</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.house_manaul}
                type="url"
                placeholder="example.com"
              />
            </Form.Group>
            <Form.Group controlId="guidebook_url">
              <Form.Label>Guidebook Url</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.guidebook_url}
                type="url"
                placeholder="example.com"
              />
            </Form.Group>
            <Row controlId="send_guest_info">
              <Col xs="auto" className="my-1">
                <Form.Label className="mr-sm-2" htmlFor="">
                  Send Guest Info
                </Form.Label>
                <Form.Control
                  onChange={this.handleInputChange}
                  value={form.send_guest_info}
                  as="select"
                  className="mr-sm-2"
                  id="send_guest_info"
                  custom
                >
                  <option value="false">false</option>
                  <option value="true">true</option>
                </Form.Control>
              </Col>
            </Row>
            <Row controlId="guest_info_type">
              <Col xs="auto" className="my-1">
                <Form.Label className="mr-sm-2" htmlFor="">
                  Guest Info Type
                </Form.Label>
                <Form.Control
                  onChange={this.handleInputChange}
                  value={form.guest_info_type}
                  as="select"
                  className="mr-sm-2"
                  id="guest_info_type"
                  custom
                >
                  <option value="none">none</option>
                  <option value="csv">csv</option>
                  <option value="text">text</option>
                  <option value="pdf">pdf</option>
                </Form.Control>
              </Col>
            </Row>
            <Form.Group controlId="currency">
              <Form.Label>Send Guest Info</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.currency}
                type="text"
                placeholder="USD"
              />
            </Form.Group>
            <Form.Group controlId="photos">
              <Form.Label>Photos Url</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.photos}
                type="text"
                placeholder="google drive url"
              />
            </Form.Group>
            <Row>
              <Col xs="auto" className="my-1">
                <Form.Label className="mr-sm-2" htmlFor="">
                  Room Type
                </Form.Label>
                <Form.Control
                  onChange={this.handleInputChange}
                  value={form.property_type}
                  as="select"
                  className="mr-sm-2"
                  id="property_type"
                  custom
                >
                  <option value="Entire Room">Entire Room</option>
                  <option value="Shared Room">Shared Room</option>
                  <option value="Hotel Room">Hotel Room</option>
                  <option value="Private Room">Private Room</option>
                  <option value="Unknown">Unknown</option>
                </Form.Control>
              </Col>
            </Row>
            <Row>
              <Col xs="auto" className="my-1">
                <Form.Label className="mr-sm-2" htmlFor="">
                  Property Type
                </Form.Label>
                <Form.Control
                  onChange={this.handleInputChange}
                  value={form.property_type}
                  as="select"
                  className="mr-sm-2"
                  id="property_type"
                  custom
                >
                  <option value="Cottage<">Cottage</option>
                  <option value="Studio">Studio</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Boutique Hotel">Boutique Hotel</option>
                  <option value="Loft">Loft</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Villa">Villa</option>
                  <option value="Hostel">Hostel</option>
                </Form.Control>
              </Col>
            </Row>
            <Form.Group controlId="tax_rate">
              <Form.Label>Tax Rate</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.tax_rate}
                type="text"
                placeholder=".14"
              />
            </Form.Group>
            <Form.Group controlId="wifi">
              <Form.Label>Wifi</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.wifi}
                type="text"
                placeholder="18 Pradero"
              />
            </Form.Group>
            <Form.Group controlId="wifi_password">
              <Form.Label>Wifi Password</Form.Label>
              <Form.Control
                onChange={this.handleInputChange}
                value={form.wifi_password}
                type="text"
                placeholder="@beachhouse"
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
    owners: state.db.owners,
    unit: state.db.unit,
  };
};
export default withRouter(
  connect(mapStateToProps, { getOwners, getUnitById })(UnitForm)
);
