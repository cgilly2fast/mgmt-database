import React, { useEffect, useState } from "react";
import { Form, Button, Col, Row, Alert } from "react-bootstrap";
import BackButton from "../../img/BackButton.svg";
import { getUnitById, updateUnit } from "../../API";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ListingFormtype } from "../../API/Types";

export const ListingForm: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<any>("");
  const [lodaing, setLoding] = useState(false);
  const [unit, setUnit] = useState({ listings: {} });
  const [form, setForm] = useState<any>({
    id: "",
    url: "",
    active: true,
    picture: "",
    provider: "",
    remit_taxes: true,
    public_name: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoding(true);
    setError("");
    const currantProvider: any = params;
    if (
      currantProvider === undefined ||
      currantProvider === form?.provider ||
      !Object.keys(unit.listings).includes(form.provider)
    ) {
      if (currantProvider === undefined) {
        if (Object.keys(unit.listings).includes(form.provider)) {
          setLoding(false);
          setError("Select diffrant provider or remove existing provider");
        } else {
          unit.listings[form.provider] = form;
          try {
            const res: any = await updateUnit(unit);
            setLoding(false);
            navigate("/unit/" + res?.data?.id);
          } catch (err) {
            setError(err);
          }
        }
      } else {
        if (
          !Object.keys(unit.listings).includes(form.provider) &&
          currantProvider !== undefined
        ) {
          unit.listings[form.provider] = form;
          delete unit.listings[currantProvider];
          try {
            const res: any = await updateUnit(unit);
            setLoding(false);
            navigate("/unit/" + res?.data?.id);
          } catch (err) {
            setError(err);
          }
        } else {
          unit.listings[form.provider] = form;
          try {
            const res: any = await updateUnit(unit);
            setLoding(false);
            navigate("/unit/" + res?.data?.id);
          } catch (err) {
            setError(err);
          }
        }
      }
    } else {
      setLoding(false);
      setError("Select diffrant provider or remove existing provideraaaaa");
    }
  };

  const handleInputChange = (event) => {
    form[event.target.id] = event.target.value;
    setForm(form);
  };

  const handleUrlChange = (event) => {
    form.url = event.target.value;
    let domain = new URL(form.url);
    let provider = domain.hostname.replace("www.", "").replace(".com", "");

    if (provider === "airbnb") {
      form.provider = provider;
      form.id = form.url.match(/(?:\/rooms\/)(\d*)/g)[0];
    } else if (provider === "vrbo" || provider === "homeaway") {
      form.provider = "homeaway";
      let a = form.url.match(/(?:.com\/)(\d*)/g)[0];
      let b = form.url.match(/(?:unitId=)(\d*)/gm)[0];
      form.id = "321." + a + "." + b;
    } else if (provider === "booking") {
      form.provider = "booking";
    }
    setForm(form);
  };

  useEffect(() => {
    const listingunitdata = async () => {
      const { unitId, provider }: any = params;
      if (location && location.state && location.state.unit) {
        setForm(location.state.unit.listings[provider]);
        setUnit(location.state.unit);
      } else if (location && location.state && location.state.listing) {
        setForm(location.state.listings);
      } else if (unitId !== undefined) {
        const unitDataById: any = await getUnitById(unitId);
        setForm(unitDataById.listing[provider]);
        setUnit(unitDataById);
      }
    };
    listingunitdata();
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
        {error && (
          <Alert key="danger" variant="danger">
            {error}
          </Alert>
        )}
        <br />
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="url">
            <Form.Label>Listing URL</Form.Label>
            <Form.Control
              type="url"
              placeholder="Enter listing public ad url"
              onChange={handleUrlChange}
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
                onChange={handleInputChange}
                value={form?.active}
                as="select"
                className="mr-sm-2"
                id="active"
                required
              >
                <option value={true as any}>true</option>
                <option value={false as any}>false</option>
              </Form.Control>
            </Col>
          </Row>
          <Row>
            <Col xs="auto" className="my-1">
              <Form.Label className="mr-sm-2" htmlFor="">
                Platfrom Provider
              </Form.Label>
              <Form.Control
                onChange={handleInputChange}
                value={form?.provider}
                as="select"
                className="mr-sm-2"
                id="provider"
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
                onChange={handleInputChange}
                value={form?.remit_taxes}
                as="select"
                className="mr-sm-2"
                id="remit_taxes"
                required
              >
                <option value={true as any}>true</option>
                <option value={false as any}>false</option>
              </Form.Control>
            </Col>
          </Row>
          <Form.Group controlId="picture">
            <Form.Label>Picture Url</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={form?.picture}
              type="url"
              placeholder="Enter picture url"
            />
          </Form.Group>
          <Form.Group controlId="public_name">
            <Form.Label>Listing Title</Form.Label>
            <Form.Control
              onChange={handleInputChange}
              value={form?.public_name}
              type="text"
              placeholder="Enter listing title"
              required
            />
          </Form.Group>

          <Button disabled={lodaing} variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
};

export default ListingForm;
