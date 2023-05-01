import { ErrorMessage, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import GoogleMapReact from "google-map-react";
import TimePicker from "react-bootstrap-time-picker";
import "./AddNewUnitForm.css";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { getOwners, getUnitById, setUnits, updateUnits } from "../../API";
import * as Yup from "yup";
import LocationIcon from "../../img/Location.png";
import firebase from "firebase";
import amenities from "../../amenities/amenities.json";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment-timezone";
import NewtonLoader from "../loader/ NewtonLoader/NewtonLoader";
import { UnitsType, addownerstype } from "../../API/Types";
const AddNewUnitForm: React.FC = () => {
  const navigate = useNavigate();
  const { unitId } = useParams();
  const [addressObject, setAddressObject] = useState<any>({
    display: "",
    city: "",
    state: "",
    coordinates: "",
    postcode: "",
    apartment: "",
    areas: [],
    country: "",
    number: "",
    street: "",
  });
  const [owners, setOwners] = useState<addownerstype[]>([]);
  const [amenitiesList, setAmenitiesList] = useState(amenities);
  const [show, setShow] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addAndUpdateLoading, setAddAndUpdateLoading] = useState(false);
  const [unit, setUnit] = useState<UnitsType | null>(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const today = moment().format("DD-MM-YYYY");

  useEffect(() => {
    const getUnitByIdData = async () => {
      setLoading(true);
      if (unitId) {
        const unitDataById: any = await getUnitById(unitId);
        setUnit(unitDataById);
        setAddressObject(unitDataById?.address);
      }
      setLoading(false);
    };
    getUnitByIdData();
  }, []);
  useEffect(() => {
    const getOwnersList = async () => {
      const ownersList = (await getOwners()) as addownerstype[];
      setOwners(ownersList);
    };
    getOwnersList();
  }, []);

  const handleSelect = async (address: any) => {
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      let temp: any = {};
      if (results[0]?.formatted_address) {
        temp.display = results[0].formatted_address;
      }
      if (latLng) {
        temp.coordinates = latLng;
      }
      results[0]?.address_components?.map(
        (item: { types: string | string[]; long_name: any }) => {
          if (item.types.includes("route")) {
            temp.street = item.long_name;
          }
          if (item.types.includes("locality")) {
            temp.city = item.long_name;
          }
          if (item.types.includes("administrative_area_level_1")) {
            temp.state = item.long_name;
          }
          if (item.types.includes("country")) {
            temp.country = item.long_name;
          }
          if (item.types.includes("postal_code")) {
            temp.postcode = item.long_name;
          }
        }
      );
      setAddressObject({
        display: temp?.display || "",
        city: temp?.city || "",
        state: temp?.state || "",
        coordinates: temp?.coordinates || {},
        postcode: temp?.postcode || "",
        apartment: "",
        areas: [],
        country: temp?.country || "",
        number: "",
        street: temp?.street || "",
      });
      handleShow();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleTimeChange = (time: any) => {
    var n = time;
    n = n % (24 * 3600);
    var hour = parseInt(`${n / 3600}`);

    n %= 3600;
    var minutes = n / 60;

    n %= 60;

    var stringTime = "";
    if (hour < 10) {
      stringTime += "0";
    }
    stringTime += hour + ":";
    if (minutes.toFixed() < `${10}`) {
      stringTime += "0";
    }
    stringTime += minutes.toFixed();
    return stringTime;
  };

  const validationSchema = Yup.object().shape({
    unit_name: Yup.string().required("Unit name is required"),
    // unit_picture: Yup.string().required('Picture url is required'),
    property_type: Yup.string().required("Property type is required"),
    room_type: Yup.string().required("Room type is required"),
    check_in: Yup.string().required("Check in time is required"),
    check_out: Yup.string().required("Check out time is required"),
    active: Yup.string().required("Active is required"),
    owner: Yup.object().required("Owner is required").nullable(),
    office: Yup.string().required("Office is required"),
    title: Yup.string().required("Title is required"),
    tax_rate: Yup.string().required("Tax rate is required"),
  });

  return (
    <>
      {loading ? (
        <NewtonLoader />
      ) : (
        <div className="main-unit-form">
          <Formik
            initialValues={{
              address:
                !addressObject?.display || unit?.address
                  ? addressObject
                  : addressObject,
              property_type: unit?.property_type ? unit?.property_type : "",
              room_type: unit?.room_type ? unit?.room_type : "",
              unit_name: unit?.name ? unit?.name : "",
              unit_picture: unit?.picture ? unit?.picture : [],
              guests: unit?.capacity?.max ? unit?.capacity?.max : 1,
              beds: unit?.capacity?.beds ? unit?.capacity?.beds : 1,
              bedrooms: unit?.capacity?.bedrooms ? unit?.capacity?.bedrooms : 1,
              bathrooms: unit?.capacity?.bathrooms
                ? unit?.capacity?.bathrooms
                : 1,
              check_in: unit?.check_in ? unit?.check_in : "",
              check_out: unit?.check_out ? unit?.check_out : "",
              active: unit?.active ? unit?.active : "",
              owner: unit?.owner ? unit?.owner : unit?.owner,
              guest_info_type: unit?.guest_info_type
                ? unit?.guest_info_type
                : "",
              office: unit?.office ? unit?.office : "",
              rent: unit?.rent ? unit?.rent : "",
              send_guest_info: unit?.send_guest_info
                ? unit?.send_guest_info
                : "",
              send_info_guest: "",
              cleaning_fee: unit?.cleaningf_ee ? unit?.cleaningf_ee : "",
              tax_rate: unit?.tax_rate ? unit?.tax_rate : "",
              wifi: unit?.wifi ? unit?.wifi : "",
              wifi_password: unit?.wifi_password ? unit?.wifi_password : "",
              photos_url: unit?.photos_archive ? unit?.photos_archive : "",
              listing_settings: unit?.listing_settings
                ? unit?.listing_settings
                : "",
              amenities_list: unit?.amenities_list ? unit?.amenities_list : "",
              faq_url: unit?.faq ? unit?.faq : "",
              house_manual: unit?.house_manaul ? unit?.house_manaul : "",
              guidebook_url: unit?.guidebook_url ? unit?.guidebook_url : "",
              title: unit?.title ? unit?.title : "",
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              console.log("values", values);
              const newUnits = {
                active: values?.active,
                address: {
                  apartment: values?.address?.apartment,
                  areas: values?.address?.areas,
                  city: values?.address?.city,
                  coordinates: new firebase.firestore.GeoPoint(
                    values?.address?.coordinates?.lat ||
                      values?.address?.coordinates?.latitude,
                    values?.address?.coordinates?.lng ||
                      values?.address?.coordinates?.longitude
                  ),
                  country: values?.address?.country,
                  display: values?.address?.display,
                  number: values?.address?.number,
                  postcode: values?.address?.postcode,
                  state: values?.address?.state,
                  street: values?.address?.street,
                },
                amenities_list: values?.amenities_list,
                capacity: {
                  bathrooms: values?.bathrooms,
                  bedrooms: values?.bedrooms,
                  beds: values?.beds,
                  max: values?.guests,
                },
                check_in: unit?.check_in
                  ? values?.check_in
                  : values?.check_in + moment().format("ZZ"),
                check_out: unit?.check_out
                  ? values?.check_out
                  : values?.check_out + moment().format("ZZ"),
                cleaningf_ee: values?.cleaning_fee,
                currency: "USD",
                description: "",
                faq: values?.faq_url,
                guest_info_type: values?.guest_info_type,
                guidebook_url: values?.guidebook_url,
                hospitable_id: "",
                house_manual: values?.house_manual,
                listing_settings: values?.listing_settings,
                listings: {},
                name: values?.unit_name,
                neighborhood: "",
                office: values?.office,
                owner: {
                  email: values?.owner?.email,
                  first_name: values?.owner?.first_name,
                  last_name: values?.owner?.last_name,
                  phone: values?.owner?.phone,
                  picture: values?.owner?.picture,
                  uuid: values?.owner?.id || values?.owner?.uuid,
                },
                photos_archive: values?.photos_url,
                picture: values?.unit_picture,
                property_type: values?.property_type,
                remit_taxes: false,
                rent: values?.rent,
                room_type: values?.room_type,
                send_guest_info: values?.send_guest_info,
                tax_rate: values?.tax_rate,
                timezone: "",
                title: values?.title,
                unit_folder: "",
                wifi: values?.wifi,
                wifi_password: values?.wifi_password,
              };
              if (!unitId) {
                setAddAndUpdateLoading(true);
                try {
                  const result = await setUnits(newUnits, amenitiesList);
                  navigate(`/unit/${result}`);
                  setAddAndUpdateLoading(false);
                } catch (error) {
                  console.log("error", error);
                  setAddAndUpdateLoading(false);
                }
              } else {
                setAddAndUpdateLoading(true);
                try {
                  const result = await updateUnits(unitId, newUnits);
                  navigate(`/unit/${result}`);
                  setAddAndUpdateLoading(false);
                } catch (error) {
                  console.log("error", error);
                  setAddAndUpdateLoading(false);
                }
              }
            }}
          >
            {({
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              setValues,
              setFieldValue,
            }) => (
              <Form onSubmit={handleSubmit}>
                <h5 className="title-new-unit">Location</h5>
                <div className="same-div">
                  <Form.Label>Address</Form.Label>
                  <PlacesAutocomplete
                    // name="address.display"
                    value={values?.address?.display}
                    onChange={(e: any) => {
                      setValues({
                        ...values,
                        address: { ...values?.address, display: e },
                      });
                    }}
                    // geocodeLatLng
                    onSelect={handleSelect}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }: any) => (
                      <div>
                        <div className="address-div">
                          <input
                            name="address.display"
                            {...getInputProps({
                              placeholder: "Search Places ...",
                            })}
                            value={values?.address?.display}
                            className={`location-search-input ${
                              touched?.address && errors?.address
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {values?.address?.display && (
                            <span
                              className="address-span"
                              onClick={(e) => {
                                setAddressObject({
                                  display: "",
                                  city: "",
                                  state: "",
                                  coordinates: "",
                                  postcode: "",
                                  apartment: "",
                                  areas: [],
                                  country: "",
                                  number: "",
                                  street: "",
                                });
                              }}
                            >
                              x
                            </span>
                          )}
                        </div>
                        {suggestions.length !== 0 && (
                          <div className="autocomplete-dropdown-container suggestion-dropdown">
                            {loading && <div>Loading...</div>}
                            {suggestions?.map((suggestion: any) => {
                              const className = suggestion.active
                                ? "suggestion-item--active"
                                : "suggestion-item";
                              // inline style for demonstration purpose
                              const style = suggestion.active
                                ? {
                                    backgroundColor: "#007bff",
                                    cursor: "pointer",
                                  }
                                : {
                                    backgroundColor: "#ffffff",
                                    cursor: "pointer",
                                  };
                              return (
                                <div
                                  {...getSuggestionItemProps(suggestion, {
                                    className,
                                    style,
                                  })}
                                  key={suggestion.description}
                                >
                                  <span className="suggestion-description">
                                    {suggestion.description}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </PlacesAutocomplete>
                  <ErrorMessage
                    component="div"
                    name="address"
                    className="invalid-feedback"
                  />
                </div>
                <h5 className="title-new-unit">Property and rooms</h5>
                <div className="d-flex">
                  <div className="inner-div" style={{ width: "50%" }}>
                    <Form.Label>Property type</Form.Label>
                    <Form.Control
                      as="select"
                      name="property_type"
                      className={`property-select ${
                        touched?.property_type && errors?.property_type
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={handleChange}
                      value={values?.property_type}
                      onBlur={handleBlur}
                    >
                      <option selected>Select...</option>
                      <option value="Cottage">Cottage</option>
                      <option value="Studio">Studio</option>
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Boutique Hotel">Boutique Hotel</option>
                      <option value="Loft">Loft</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Villa">Villa</option>
                      <option value="Hostel">Hostel</option>
                    </Form.Control>
                    <ErrorMessage
                      component="div"
                      name="property_type"
                      className="invalid-feedback"
                    />
                  </div>
                  <div className="inner-div" style={{ width: "50%" }}>
                    <Form.Label>Room type</Form.Label>
                    <Form.Control
                      as="select"
                      name="room_type"
                      className={`property-select ${
                        touched?.room_type && errors?.room_type
                          ? "is-invalid"
                          : ""
                      }`}
                      value={values?.room_type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option selected>Select...</option>
                      <option value="Entire Room">Entire Room</option>
                      <option value="Shared Room">Shared Room</option>
                      <option value="Hotel Room">Hotel Room</option>
                      <option value="Private Room">Private Room</option>
                      <option value="Unknown">Unknown</option>
                    </Form.Control>{" "}
                    <ErrorMessage
                      component="div"
                      name="room_type"
                      className="invalid-feedback"
                    />
                  </div>
                </div>
                <div className="number-of-guests inner-div">
                  <Form.Label>Number of guests</Form.Label>
                  <div className="count-div">
                    <button
                      type="button"
                      className="guest-add-minus"
                      style={{ marginRight: "20px" }}
                      value={values?.guests}
                      name="guests"
                      onClick={() =>
                        values?.guests > 1 &&
                        setValues({ ...values, guests: values?.guests - 1 })
                      }
                    >
                      -
                    </button>
                    {values?.guests}
                    <button
                      type="button"
                      className="guest-add-minus"
                      name="guests"
                      value={values?.guests}
                      style={{ marginLeft: "20px" }}
                      onClick={() =>
                        setValues({ ...values, guests: values?.guests + 1 })
                      }
                    >
                      +
                    </button>
                  </div>
                  <Form.Label>Number of beds</Form.Label>
                  <div className="count-div">
                    <button
                      type="button"
                      className="guest-add-minus"
                      value={values?.beds}
                      name="beds"
                      style={{ marginRight: "20px" }}
                      onClick={() =>
                        values?.beds > 1 &&
                        setValues({ ...values, beds: values?.beds - 1 })
                      }
                    >
                      -
                    </button>
                    {values?.beds}
                    <button
                      type="button"
                      className="guest-add-minus"
                      value={values?.beds}
                      name="beds"
                      style={{ marginLeft: "20px" }}
                      onClick={() =>
                        setValues({ ...values, beds: values?.beds + 1 })
                      }
                    >
                      +
                    </button>
                  </div>
                  <Form.Label>Number of bedrooms</Form.Label>
                  <div className="count-div">
                    <button
                      type="button"
                      className="guest-add-minus"
                      value={values?.bedrooms}
                      name="bedrooms"
                      style={{ marginRight: "20px" }}
                      onClick={() =>
                        values?.bedrooms > 1 &&
                        setValues({ ...values, bedrooms: values?.bedrooms - 1 })
                      }
                    >
                      -
                    </button>
                    {values?.bedrooms}
                    <button
                      type="button"
                      className="guest-add-minus"
                      style={{ marginLeft: "20px" }}
                      onClick={() =>
                        setValues({ ...values, bedrooms: values?.bedrooms + 1 })
                      }
                    >
                      +
                    </button>
                  </div>
                  <Form.Label>Number of bathrooms</Form.Label>
                  <div>
                    <button
                      type="button"
                      className="guest-add-minus"
                      style={{ marginRight: "20px" }}
                      value={values?.bathrooms}
                      name="bathrooms"
                      onClick={() =>
                        values?.bathrooms > 1 &&
                        setValues({
                          ...values,
                          bathrooms: values?.bathrooms - 1,
                        })
                      }
                    >
                      -
                    </button>
                    {values?.bathrooms}
                    <button
                      type="button"
                      className="guest-add-minus"
                      style={{ marginLeft: "20px" }}
                      value={values?.bathrooms}
                      name="bathrooms"
                      onClick={() =>
                        setValues({
                          ...values,
                          bathrooms: values?.bathrooms + 1,
                        })
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <h5 className="title-new-unit">Listing basics</h5>
                <div className="inner-div">
                  <Form.Label>Unit Name</Form.Label>
                  <Form.Control
                    className={`unit-form-control ${
                      touched?.unit_name && errors?.unit_name
                        ? "is-invalid"
                        : ""
                    }`}
                    name="unit_name"
                    style={{ width: "25%" }}
                    value={values?.unit_name}
                    placeholder="Enter Unit Name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />{" "}
                  <ErrorMessage
                    component="div"
                    name="unit_name"
                    className="invalid-feedback"
                  />
                  {/* <div className="same-div" style={{ width: '50%' }}>
                    <Form.Label>Unit Picture Url</Form.Label>
                    <Form.Control
                      name="unit_picture"
                      value={values?.unit_picture}
                      className={`unit-form-control ${
                        touched?.unit_picture && errors?.unit_picture
                          ? 'is-invalid'
                          : ''
                      }`}
                      placeholder="Enter Unit picture url"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />{' '}
                    <ErrorMessage
                      component="div"
                      name="unit_picture"
                      className="invalid-feedback"
                    />
                  </div> */}
                </div>
                <div className="d-flex">
                  <div className="inner-div" style={{ width: "50%" }}>
                    <Form.Label>Check In Time</Form.Label>
                    <TimePicker
                      start="9:00"
                      end="21:00"
                      // name="check_in"
                      step={30}
                      value={
                        values?.check_in?.split("-")?.slice()[0] ===
                        values?.check_in
                          ? values?.check_in?.split("+")?.slice()[0]
                          : values?.check_in?.split("-")?.slice()[0]
                      }
                      className={`property-select ${
                        touched?.check_in && errors?.check_in
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={(time: any) => {
                        const changeTime = handleTimeChange(time);
                        setValues({ ...values, check_in: changeTime });
                      }}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      component="div"
                      name="check_in"
                      className="invalid-feedback"
                    />
                  </div>
                  <div className="inner-div" style={{ width: "50%" }}>
                    <Form.Label>Check Out Time</Form.Label>
                    <TimePicker
                      start="9:00"
                      end="21:00"
                      step={30}
                      // name="check_out"
                      value={
                        values?.check_out?.split("-")?.slice()[0] ===
                        values?.check_out
                          ? values?.check_out?.split("+")?.slice()[0]
                          : values?.check_out?.split("-")?.slice()[0]
                      }
                      className={`property-select ${
                        touched?.check_out && errors?.check_out
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={(time: any) => {
                        const changeTime = handleTimeChange(time);
                        setValues({ ...values, check_out: changeTime });
                      }}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      component="div"
                      name="check_out"
                      className="invalid-feedback"
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>Active</Form.Label>
                    <div className="d-flex">
                      <Form.Check
                        type="radio"
                        label="True"
                        name="active"
                        className={
                          touched?.active && errors?.active ? "is-invalid" : ""
                        }
                        value={values?.active}
                        checked={values?.active === true}
                        onChange={(e) =>
                          e?.target?.checked &&
                          setValues({ ...values, active: true })
                        }
                        onBlur={handleBlur}
                      />
                      <Form.Check
                        type="radio"
                        label="False"
                        className={`mx-5 ${
                          touched?.active && errors?.active ? "is-invalid" : ""
                        }`}
                        value={values?.active}
                        checked={values?.active === false}
                        name="active"
                        onChange={(e) =>
                          e?.target?.checked &&
                          setValues({ ...values, active: false })
                        }
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        component="div"
                        name="active"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      className={`unit-form-control ${
                        touched?.title && errors?.title ? "is-invalid" : ""
                      }`}
                      name="title"
                      value={values?.title}
                      placeholder="Enter Unit Title"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />{" "}
                    <ErrorMessage
                      component="div"
                      name="title"
                      className="invalid-feedback"
                    />
                  </div>
                </div>
                {!unit && (
                  <>
                    <h5 className="title-new-unit">Amenities Detail</h5>
                    <div className="same-div amenities-div">
                      <p
                        style={{
                          width: "40%",
                          border: "1px solid lightgray",
                          margin: "0px",
                          borderRadius: "5px",
                          padding: "5px",
                        }}
                        // name="amenities"
                      >
                        {amenitiesList?.map(
                          (obj) =>
                            obj?.available === true && (
                              <span className="mx-2">{obj.name},</span>
                            )
                        )}
                      </p>
                      <button
                        // name="amenities"
                        type="button"
                        onClick={() => {
                          setShowAmenities(true);
                        }}
                        className="select-amenities-button"
                      >
                        +
                      </button>
                    </div>
                  </>
                )}
                <h5 className="title-new-unit">Owner Detail</h5>
                <div className="inner-div">
                  <Form.Label>Select Owner</Form.Label>
                  <Form.Control
                    as="select"
                    style={{ width: "25%" }}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue("owner", JSON.parse(e.target.value));
                    }}
                    onSelect={handleChange}
                    // value={values?.owner}
                    name="owner"
                    className={
                      touched?.owner && errors?.owner ? "is-invalid" : ""
                    }
                  >
                    <option selected={true} disabled>
                      Select Owner
                    </option>
                    {owners?.map((item: any) => {
                      return (
                        <option
                          key={item.id}
                          value={JSON.stringify(item)}
                          selected={item?.id === values?.owner?.uuid}
                        >
                          {item?.first_name}
                        </option>
                      );
                    })}
                  </Form.Control>
                  <ErrorMessage
                    component="div"
                    name="owner"
                    className="invalid-feedback"
                  />
                </div>
                <h5 className="title-new-unit">Other Detail</h5>
                <div className="same-div">
                  <Form.Label>Guest Info Type</Form.Label>
                  <div className="d-flex">
                    <Form.Check
                      type="checkbox"
                      label="CSV"
                      onChange={(e) =>
                        e?.target?.checked &&
                        setValues({ ...values, guest_info_type: "CSV" })
                      }
                      defaultChecked={values?.guest_info_type === "CSV"}
                      onBlur={handleBlur}
                      name="guest_info_type"
                      value={values?.guest_info_type}
                    />
                    <Form.Check
                      type="checkbox"
                      label="TEXT"
                      className="mx-5"
                      onChange={(e) =>
                        e?.target?.checked &&
                        setValues({ ...values, guest_info_type: "TEXT" })
                      }
                      defaultChecked={values?.guest_info_type === "TEXT"}
                      onBlur={handleBlur}
                      name="guest_info_type"
                      value={values?.guest_info_type}
                    />
                    <Form.Check
                      type="checkbox"
                      label="PDF"
                      onChange={(e) =>
                        e?.target?.checked &&
                        setValues({ ...values, guest_info_type: "PDF" })
                      }
                      defaultChecked={values?.guest_info_type === "PDF"}
                      onBlur={handleBlur}
                      name="guest_info_type"
                      value={values?.guest_info_type}
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>Office</Form.Label>
                    <div className="d-flex">
                      <Form.Check
                        type="radio"
                        label="Stinson Beach"
                        name="office"
                        className={
                          touched?.office && errors?.office ? "is-invalid" : ""
                        }
                        onChange={(e) =>
                          e?.target?.checked &&
                          setValues({ ...values, office: "Stinson Beach" })
                        }
                        onBlur={handleBlur}
                        checked={values?.office === "Stinson Beach"}
                        value={values?.office}
                      />
                      <Form.Check
                        type="radio"
                        label="Waikiki"
                        className={`mx-5 ${
                          touched?.office && errors?.office ? "is-invalid" : ""
                        }`}
                        name="office"
                        onChange={(e) =>
                          e?.target?.checked &&
                          setValues({ ...values, office: "Waikiki" })
                        }
                        checked={values?.office === "Waikiki"}
                        onBlur={handleBlur}
                        value={values?.office}
                      />
                      <ErrorMessage
                        component="div"
                        name="office"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>Rent</Form.Label>
                    <Form.Control
                      className="unit-form-control"
                      placeholder="Enter Rent per month"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="rent"
                      value={values?.rent}
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>Send Guest Info</Form.Label>
                    <div className="d-flex">
                      <Form.Check
                        type="radio"
                        label="True"
                        name="send_guest_info"
                        onChange={(e) =>
                          e?.target?.checked &&
                          setValues({ ...values, send_guest_info: true })
                        }
                        checked={values?.send_guest_info === true}
                        onBlur={handleBlur}
                        value={values?.send_guest_info}
                      />
                      <Form.Check
                        type="radio"
                        label="False"
                        className="mx-5"
                        name="send_guest_info"
                        onChange={(e) =>
                          e?.target?.checked &&
                          setValues({ ...values, send_guest_info: false })
                        }
                        checked={values?.send_guest_info === false}
                        onBlur={handleBlur}
                        value={values?.send_guest_info}
                      />
                    </div>
                  </div>
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>Send Guest Info</Form.Label>
                    <Form.Control
                      className="unit-form-control"
                      placeholder="USD"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="send_info_guest"
                      value={values?.send_info_guest}
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>Cleaners Pay</Form.Label>
                    <Form.Control
                      className="unit-form-control"
                      placeholder="Enter amount paid to cleaners each cleaning"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="cleaning_fee"
                      value={values?.cleaning_fee}
                    />
                  </div>
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>Tax Rate</Form.Label>
                    <Form.Control
                      className={`unit-form-control ${
                        touched?.tax_rate && errors?.tax_rate
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder=".14"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.tax_rate}
                      name="tax_rate"
                    />
                    <ErrorMessage
                      component="div"
                      name="tax_rate"
                      className="invalid-feedback"
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>Wifi</Form.Label>
                    <Form.Control
                      className="unit-form-control"
                      placeholder="Enter Wi-Fi name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.wifi}
                      name="wifi"
                    />
                  </div>
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>Wifi Password</Form.Label>
                    <Form.Control
                      className="unit-form-control"
                      placeholder="Enter Wi-Fi Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.wifi_password}
                      name="wifi_password"
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>Photos Url</Form.Label>
                    <Form.Control
                      className="unit-form-control"
                      placeholder="Enter Google drive url"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.photos_url}
                      name="photos_url"
                    />
                  </div>
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>Listing Settings</Form.Label>
                    <Form.Control
                      className="unit-form-control"
                      placeholder="Enter Google sheet url"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.listing_settings}
                      name="listing_settings"
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>Amenities List</Form.Label>
                    <Form.Control
                      className="unit-form-control"
                      placeholder="Enter Google sheet url"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.amenities_list}
                      name="amenities_list"
                    />
                  </div>
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>FAQ Url</Form.Label>
                    <Form.Control
                      className="unit-form-control"
                      placeholder="Enter Google docs url"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.faq_url}
                      name="faq_url"
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>House Manual</Form.Label>
                    <Form.Control
                      className="unit-form-control"
                      placeholder="Example.com"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.house_manual}
                      name="house_manual"
                    />
                  </div>
                  <div className="same-div" style={{ width: "50%" }}>
                    <Form.Label>Guidebook Url</Form.Label>
                    <Form.Control
                      className="unit-form-control"
                      placeholder="Example.com"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.guidebook_url}
                      name="guidebook_url"
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    margin: "20px 0px",
                  }}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting || addAndUpdateLoading}
                    className="save-button"
                  >
                    Save{" "}
                    {addAndUpdateLoading && (
                      <Spinner animation="border" size="sm" variant="light" />
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Display</Form.Label>
          <Form.Control
            value={addressObject?.display}
            onChange={(e) =>
              setAddressObject({ ...addressObject, display: e.target.value })
            }
          />
          <Form.Label className="mt-2">Street</Form.Label>
          <Form.Control
            value={addressObject?.street}
            onChange={(e) =>
              setAddressObject({ ...addressObject, street: e.target.value })
            }
          />
          <Form.Label className="mt-2">City</Form.Label>
          <Form.Control
            value={addressObject?.city}
            onChange={(e) =>
              setAddressObject({ ...addressObject, city: e.target.value })
            }
          />
          <Form.Label className="mt-2">State</Form.Label>
          <Form.Control
            value={addressObject?.state}
            onChange={(e) =>
              setAddressObject({ ...addressObject, state: e.target.value })
            }
          />
          <Form.Label className="mt-2">Country</Form.Label>
          <Form.Control
            value={addressObject?.country}
            onChange={(e) =>
              setAddressObject({ ...addressObject, country: e.target.value })
            }
          />
          <Form.Label className="mt-2">Postal Code</Form.Label>
          <Form.Control
            value={addressObject?.postcode}
            onChange={(e) =>
              setAddressObject({
                ...addressObject,
                postcode: e.target.value,
              })
            }
          />
          <div style={{ height: "250px", marginTop: "20px" }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: `${process.env.REACT_APP_APIKEY}` }}
              defaultCenter={{
                lat: 39.1910983,
                lng: -106.8175387,
              }}
              center={{
                lat: addressObject?.coordinates?.lat,
                lng: addressObject?.coordinates?.lng,
              }}
              defaultZoom={17}
              yesIWantToUseGoogleMapApiInternals
              onClick={(e: any) => {
                setAddressObject({
                  ...addressObject,
                  coordinates: {
                    lat: e?.lat,
                    lng: e.lng,
                  },
                });
                handleSelect(e);
              }}
            >
              <img
                src={LocationIcon}
                width="30"
                className="marker-img"
                // lng={addressObject?.coordinates?.lng}
                // lat={addressObject?.coordinates?.lat}
                onClick={(e) => console.log("click", e)}
                onChange={(e) => console.log("map", e)}
              />
            </GoogleMapReact>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" onClick={handleClose} className="save-button">
            Save
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAmenities}
        onHide={() => {
          setShowAmenities(false);
        }}
        contentClassName="content-modal"
        dialogClassName="dialog-modal"
      >
        <Modal.Header closeButton>Select Amenities</Modal.Header>
        <Modal.Body style={{ display: "flex", flexWrap: "wrap" }}>
          {amenitiesList.map((item) => {
            return (
              <div className="d-flex" style={{ width: "33%" }}>
                {item?.url ? (
                  <img
                    src={item?.url}
                    style={{
                      background: "#f9f9f9",
                      width: "50px",
                      height: "50px",
                      padding: "0px 10px",
                      margin: "10px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      background: "#f9f9f9",
                      width: "50px",
                      height: "50px",
                      padding: "0px 10px",
                      margin: "10px",
                    }}
                  ></div>
                )}
                <p
                  style={{
                    alignSelf: "center",
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  {item?.name}
                  <Form.Check
                    type="checkbox"
                    name={item?.name}
                    checked={item?.available}
                    onChange={(e) => {
                      e.target.checked
                        ? setAmenitiesList((listOfAmenities) =>
                            listOfAmenities.map((obj) => {
                              return {
                                ...obj,
                                ...(obj?.name === e.target.name && {
                                  available: true,
                                }),
                              };
                            })
                          )
                        : setAmenitiesList((listOfAmenities) =>
                            listOfAmenities.map((obj) => {
                              return {
                                ...obj,
                                ...(obj?.name === e.target.name && {
                                  available: false,
                                }),
                              };
                            })
                          );
                    }}
                  />
                </p>
              </div>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="submit"
            onClick={() => {
              setShowAmenities(false);
            }}
            className="save-button"
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddNewUnitForm;
