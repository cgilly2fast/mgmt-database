import React, { Component, createRef, useEffect, useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { Alert } from "bootstrap";
import axios from "axios";
import ApiUrl from "../../globalVariables";
import { Multiselect } from "multiselect-react-dropdown";
import BackButton from "../../img/BackButton.svg";
import { getTeammateById, getUnits, updateOwner } from "../../API";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const OwnerForm: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<any>("");
  const [lodaing, setLoding] = useState(false);
  const [options, setOptions] = useState([]);
  const [form, setForm] = useState<any>({
    uuid: "",
    first_name: "",
    last_name: "",
    airbnb_username: "",
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
    vrbo_username: "",
    company_name: "",
    picture: "",
    active: "",
    business_number: "",
    business_pin: "",
    owner_statements: "",
    partnership: "",
    percentage: "",
    tot_account: "",
    tot_pin: "",
    units: [],
  });

  const multiselectRef: any = createRef();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoding(true);
    setError("");
    try {
      await updateOwner(form);
      setLoding(false);
      // navigate('/owner/' + res.data.uuid);
    } catch (err) {
      setError(err);
    }
  };

  const handleInputChange = (event) => {
    form[event.target.id] = event.target.value;
    setForm(form);
  };

  const handleMultiSelectChange = (event) => {
    form.units = multiselectRef.current;
    setForm(form);
  };

  const handleAddresInputChange = (event) => {
    form.address[event.target.id] = event.target.value;
    setForm(form);
  };

  useEffect(() => {
    const addownerdata = async () => {
      const { ownerId } = params;
      let options: any = [];
      const units = await getUnits();
      for (let i = 0; i < units.length; i++) {
        options.push({
          id: units[i].id,
          name: units[i].name,
          picture: units[i].picture,
        });
      }
      setOptions(options);
      if (location && location.state && location.state.owner) {
        const { owner } = location.state;
        let arrayUnits: any = [];
        Object.keys(owner.units).map((key) => {
          return arrayUnits.push(owner.units[key]);
        });
        owner.units = arrayUnits;
        setForm(owner);
      } else if (ownerId !== undefined) {
        const teammateById = await getTeammateById(ownerId);
        setForm(teammateById);
      }
    };
    addownerdata();
  }, []);

  return (
    <>
      <img
        src={BackButton}
        alt="back"
        style={{ height: "30px", cursor: "pointer" }}
        onClick={() => navigate(-1)}
      />

      <div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="first_name">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              onChange={handleInputChange}
              value={form.first_name}
              required
            />
          </Form.Group>
          <Form.Group controlId="last_name">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={form.last_name}
              type="text"
              placeholder="Enter last name"
              required
            />
          </Form.Group>
          <Form.Group controlId="airbnb_username">
            <Form.Label>Airbnb Username</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={form.airbnb_username}
              type="email"
              placeholder="dave@examaple.com"
            />
          </Form.Group>
          <Form.Group controlId="vrbo_username">
            <Form.Label>VRBO Username</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={form.vrbo_username}
              type="email"
              placeholder="dave@examaple.com"
            />
          </Form.Group>
          <Form.Group controlId="picture">
            <Form.Label>Picture Url</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={form.picture}
              type="text"
              placeholder="Enter url to teammate picture"
            />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={form.email}
              type="email"
              placeholder="Enter email"
              required
            />
          </Form.Group>
          <Form.Group controlId="phone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={form.phone}
              type="phone"
              placeholder="Enter phone number"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Units</Form.Label>
            <Multiselect
              // controlId="unit"
              onRemove={handleMultiSelectChange}
              onSelect={handleMultiSelectChange}
              selectedValues={form.units}
              options={options}
              displayValue="name"
              ref={multiselectRef}
            />
          </Form.Group>

          <Form.Group controlId="company_name">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={form.company_name}
              type="text"
              placeholder="DevelopX LLC"
            />
          </Form.Group>

          <Form.Group controlId="street">
            <Form.Label>Address</Form.Label>
            <Form.Control
              onChange={handleAddresInputChange}
              value={form.address.street}
              placeholder="1234 Main St"
            />
          </Form.Group>

          <Form.Group controlId="number">
            <Form.Label>Address 2</Form.Label>
            <Form.Control
              onChange={handleAddresInputChange}
              value={form.address.number}
              placeholder="Apartment, studio, or floor"
            />
          </Form.Group>

          <Row>
            <Form.Group as={Col} controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                onChange={handleAddresInputChange}
                value={form.address.city}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Control
                onChange={handleAddresInputChange}
                value={form.address.state}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="postcode">
              <Form.Label>Zip</Form.Label>
              <Form.Control
                onChange={handleAddresInputChange}
                value={form.address.postcode}
              />
            </Form.Group>
          </Row>
          <Row>
            <Col xs="auto" className="my-1">
              <Form.Label className="mr-sm-2" htmlFor="">
                Active
              </Form.Label>
              <Form.Control
                onChange={handleInputChange}
                value={form.active}
                as="select"
                className="mr-sm-2"
                id="active"
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </Form.Control>
            </Col>
          </Row>

          <Form.Group controlId="business_number">
            <Form.Label>Business Number</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={form.business_number}
              type="text"
              placeholder="123456"
            />
          </Form.Group>
          <Form.Group controlId="business_pin">
            <Form.Label>Business Pin</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={form.business_pin}
              type="text"
              placeholder="123456"
            />
          </Form.Group>
          <Form.Group controlId="tot_number">
            <Form.Label>TOT Number</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={form.tot_number}
              type="text"
              placeholder="123456"
            />
          </Form.Group>
          <Form.Group controlId="tot_pin">
            <Form.Label>TOT Pin</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={form.tot_pin}
              type="text"
              placeholder="123456"
            />
          </Form.Group>
          <Row>
            <Col xs="auto" className="my-1">
              <Form.Label className="mr-sm-2" htmlFor="">
                Owner Statements
              </Form.Label>
              <Form.Control
                onChange={handleInputChange}
                value={form.owner_statements}
                as="select"
                className="mr-sm-2"
                id="owner_statements"
                required
              >
                <option value="false">false</option>
                <option value="true">true</option>
              </Form.Control>
            </Col>
          </Row>
          <Row>
            <Col xs="auto" className="my-1">
              <Form.Label className="mr-sm-2" htmlFor="">
                Owner Partnership
              </Form.Label>
              <Form.Control
                onChange={handleInputChange}
                value={form.owner_partnership}
                as="select"
                className="mr-sm-2"
                id="owner_partnership"
                required
              >
                <option value="false">false</option>
                <option value="true">true</option>
              </Form.Control>
            </Col>
          </Row>
          <Form.Group controlId="percentage">
            <Form.Label>Percentage</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={form.percentage}
              type="text"
              placeholder=".2"
            />
          </Form.Group>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button disabled={lodaing} variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
};

export default OwnerForm;
