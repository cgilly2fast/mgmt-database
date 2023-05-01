import React, { useEffect, useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import BackButton from "../../img/BackButton.svg";
import { getTeammateById, updateTeammate } from "../../API";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Teammateformtype } from "../../API/Types";

export const TeammateForm: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<any>("");
  const [lodaing, setLoding] = useState(false);
  const [form, setForm] = useState<Teammateformtype>({
    active: true,
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
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoding(true);
    setError("");
    try {
      const res: any = await updateTeammate(form);
      setLoding(false);
      navigate("/teammate/" + res.uuid);
    } catch (err) {
      setError(err);
    }
  };

  const handleInputChange = (event) => {
    form[event.target.id] = event.target.value;
    setForm(form);
  };
  const handleAddresInputChange = (event) => {
    form.address[event.target.id] = event.target.value;
    setForm(form);
  };

  useEffect(() => {
    const addteamdata = async () => {
      const { teammateId } = params;

      if (location && location.state && location.state.teammate) {
        setForm(location.state.teammate);
      } else if (teammateId !== undefined) {
        const teammateById = await getTeammateById(teammateId) as Teammateformtype;
        setForm(teammateById);
      }
    };
    addteamdata();
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
            />
          </Form.Group>
          <Form.Group controlId="position">
            <Form.Label>Position</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={form.position}
              type="text"
              placeholder="Enter teammate position"
              required
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
                Choose Payment Type
              </Form.Label>
              <Form.Control
                onChange={handleInputChange}
                value={form.payment_type}
                as="select"
                className="mr-sm-2"
                id="payment_type"
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
              onChange={handleInputChange}
              value={form.hours_sheet}
              type="text"
              placeholder="Enter hours sheet url"
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

export default TeammateForm;
