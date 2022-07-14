import FullCalendar from "@fullcalendar/react";
import React, { useEffect, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Form, Modal, Spinner, Offcanvas } from "react-bootstrap";
import "./Calendar.css";
import {
  BsBoxArrowInLeft,
  BsBoxArrowRight,
  BsPersonCircle,
} from "react-icons/bs";
import moment from "moment-timezone";
import { useHistory, withRouter } from "react-router-dom";
import {
  getActiveUnits,
  getCalendar,
  getReservations,
  updateCalendar,
  getReservationsDetail,
} from "../../store/actions/dbActions";
import { connect, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import BackButton from "../../img/BackButton.svg";

function renderEventContent(eventInfo) {
  return (
    <>
      <>
        {eventInfo?.event?.extendedProps?.date ? (
          <>
            <b>
              Price: $
              {eventInfo?.event?.extendedProps?.value?.price?.price / 100}
            </b>
            <br />
          </>
        ) : (
          <>
            <div className="reservation-event">
              <img
                src={
                  eventInfo?.event?.extendedProps?.picture &&
                  eventInfo?.event?.extendedProps?.picture
                }
                className="img-calendar"
              />
              <h5>
                {eventInfo?.event?.extendedProps?.value?.guest?.first_name}
              </h5>
            </div>
          </>
        )}
      </>
    </>
  );
}

const Calendar = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [eventsList, setEventsList] = useState([]);
  const [postsItems, setPostsItems] = useState([]);
  const [reservationItems, setReservationItems] = useState([]);
  const [reservationList, setReservationList] = useState([]);
  const [data, setData] = useState();
  const [reservationId, setReservationId] = useState();
  const [showCanvas, setShowCanvas] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const { id } = useParams();

  const unitsdata = useSelector(({ db }) => db?.units);
  const calendardata = useSelector(({ db }) => db?.calendar);
  const reservations = useSelector(({ db }) => db?.reservations);
  const reservationDetail = useSelector(
    ({ db }) => db?.reservationDetail?.data
  );

  const loading = useSelector(({ db }) => db?.reservationDetail?.loading);

  const calendarId = calendardata?.data?.id && calendardata?.data?.id;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    dispatch(getCalendar(id));
    dispatch(getReservations(id));
  }, [id]);

  const fetchData = () => {
    dispatch(getActiveUnits());
  };

  const handleClick = (arg) => {
    if (
      arg?.event?._def?.extendedProps?.type &&
      arg?.event?._def?.extendedProps?.type === "price"
    ) {
      setData(arg?.event?._def?.extendedProps);
      setShow(true);
    }
    if (
      arg?.event?._def?.extendedProps?.type &&
      arg?.event?._def?.extendedProps?.type === "reservations"
    ) {
      setReservationId(arg?.event?.id);
      setShowCanvas(true);
    }
  };

  const handleClose = () => {
    setData();
    setShow(false);
  };

  const handleCloseCanvas = () => {
    setShowCanvas(false);
  };

  const handleCloseModel = () => {
    setShowModel(false);
  };

  const handleSelect = (e) => {
    const id = e.target.value;
    history.push(`/calendar/${id}`);
  };

  useEffect(() => {
    if (
      (calendardata?.loading === false && calendardata?.data) ||
      (reservations?.loading === false && reservations?.data)
    ) {
      if (calendardata?.data?.days) {
        setEventsList(Object?.values(calendardata?.data?.days));
      }
      if (reservations?.data) {
        setReservationList(Object?.values(reservations?.data));
      }
    }
  }, [calendardata.data, reservations?.data]);

  useEffect(() => {
    if (reservationList?.length) {
      const data = reservationList.map((value) => {
        return {
          type: "reservations",
          id: value?.uuid,
          title: value?.guest?.first_name,
          start: value?.start_date,
          end: value?.end_date,
          extendedProps: {
            picture: value?.guest?.picture,
            value: value,
          },
          borderColor: "black",
          backgroundColor: "#fffadf",
          textColor: "black",
        };
      });
      setReservationItems(data);
    }
  }, [reservationList]);

  useEffect(() => {
    if (eventsList?.length) {
      const data = eventsList
        ?.map((values) => {
          if (values.date >= moment(new Date()).format("YYYY-MM-DD")) {
            const filter = reservationList.find(
              (reserveDate) =>
                new Date(reserveDate.start_date).getTime() <=
                  new Date(values.date).getTime() &&
                new Date(reserveDate.end_date).getTime() >
                  new Date(values.date).getTime()
            );
            if (!Boolean(filter)) {
              return {
                type: "price",
                title: "$" + values?.price.price / 10,
                extendedProps: {
                  date: values?.date,
                  value: values,
                },
                date: values?.date,
              };
            }
            return null;
          }
        })
        .filter((res) => res);
      setPostsItems(data);
    }
  }, [eventsList, reservationList]);

  useEffect(() => {
    if (reservationId) {
      dispatch(getReservationsDetail(reservationId));
    }
  }, [reservationId]);

  const validationSchema = Yup.object().shape({
    day: Yup.number()
      .typeError("only number allowed")
      .required("day is required"),
    min_stay: Yup.number()
      .typeError("only number allowed")
      .required("min_stay is required"),
    price: Yup.number()
      .typeError("only number allowed")
      .required("price is required"),
    currency: Yup.string().required("currency is required"),
    reason: Yup.string().required("reason is required"),
  });

  return (
    <>
      <img
        src={BackButton}
        alt="back"
        style={{ height: "30px", cursor: "pointer" }}
        onClick={() => props.history.goBack()}
      />
      <>
        {/* Full calendar */}
        <div className="main-div">
          {calendardata.loading ? (
            <div className="loader" />
          ) : (
            <>
              <div className="d-flex justify-content-end">
                <Form.Control
                  as="select"
                  className="form-input mb-3"
                  onChange={handleSelect}
                  value={id}
                  style={{ width: "30%" }}
                >
                  <option value="Select Units" selected disabled>
                    Select Units
                  </option>
                  {unitsdata?.map((item) => (
                    <option value={item?.id} key={item?.id}>
                      {item?.name} {item?.address?.city}
                    </option>
                  ))}
                </Form.Control>
              </div>

              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth",
                }}
                defaultView={reservationItems}
                eventSources={[
                  reservationItems.length && reservationItems,
                  postsItems,
                ]}
                selectable={true}
                eventContent={renderEventContent}
                eventClick={handleClick}
              />
            </>
          )}
        </div>

        {/* Price update Model  */}
        {show && (
          <Modal show={show} onHide={handleClose}>
            <Formik
              initialValues={{
                ...data,
                day: data?.value?.day,
                min_stay: data?.value?.min_stay,
                price: data?.value?.price?.price / 100,
                currency: data?.value?.price?.currency,
                reason: data?.value?.status?.reason,
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                const reloadCalendar = () => {
                  dispatch(getCalendar(id));
                  dispatch(getReservations(id));
                };
                const data = await { ...values, calendarId, id };
                dispatch(updateCalendar(data, reloadCalendar));
                setShow(false);
                setSubmitting(false);
              }}
            >
              {({
                touched,
                errors,
                values,
                isSubmitting,
                handleSubmit,
                handleChange,
                handleBlur,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Modal.Header>
                    <Modal.Title>Form</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="model-div">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="text"
                        className="form-input"
                        name="date"
                        value={moment(values?.value?.date).format("DD-MM-YYYY")}
                        disabled
                      />
                      <Form.Label className="mt-3">Enter Days</Form.Label>
                      <Form.Control
                        type="number"
                        name="day"
                        className={`form-input ${
                          touched?.day && errors?.day ? "is-invalid" : ""
                        }`}
                        min={0}
                        value={values?.day}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        component="div"
                        name="day"
                        className="invalid-feedback"
                      />
                      <Form.Label className="mt-3">Enter Min_stay</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        name="min_stay"
                        className={`form-input mb-2 ${
                          touched?.min_stay && errors?.min_stay
                            ? "is-invalid"
                            : ""
                        }`}
                        value={values?.min_stay}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        component="div"
                        name="min_stay"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="model-div mt-2">
                      <Form.Label className="label ">Price</Form.Label>
                      <br />
                      <Form.Label className="mt-1">Enter Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        min={0}
                        className={`form-input ${
                          touched?.price && errors?.price ? "is-invalid" : ""
                        }`}
                        value={values?.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        component="div"
                        name="price"
                        className="invalid-feedback"
                      />
                      <Form.Label className="mt-3">Select Currency</Form.Label>
                      <Form.Control
                        as="select"
                        name="currency"
                        className={`form-input mb-2 ${
                          touched?.currency && errors?.currency
                            ? "is-invalid"
                            : ""
                        }`}
                        value={values?.currency}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option selected disabled>
                          Select Currency
                        </option>
                        <option value="USD">USD</option>
                      </Form.Control>
                      <ErrorMessage
                        component="div"
                        name="currency"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="model-div mt-2">
                      <Form.Label className="label">Status</Form.Label>
                      <br />
                      <Form.Label className="mt-1">Select Reason</Form.Label>
                      <Form.Control
                        as="select"
                        name="reason"
                        className={`form-input mb-2 ${
                          touched?.reason && errors?.reason ? "is-invalid" : ""
                        }`}
                        value={values?.reason}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option selected disabled>
                          Select Reason
                        </option>
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="BLOCKED">BLOCKED</option>
                      </Form.Control>
                      <ErrorMessage
                        component="div"
                        name="reason"
                        className="invalid-feedback"
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Spinner animation="border" size="sm" />}{" "}
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal>
        )}

        {/* Show Reservation detail on offcanvas */}
        {showCanvas && (
          <>
            <Offcanvas
              show={showCanvas}
              onHide={handleCloseCanvas}
              placement="end"
            >
              {!loading ? (
                <>
                  <Offcanvas.Header
                    closeButton
                    style={{ borderBottom: "1px solid black", padding: "1rem" }}
                  >
                    <Offcanvas.Title className="m-0">
                      <div className="d-flex m-0">
                        <BsPersonCircle
                          style={{ fontSize: "25px", color: "#5c576a" }}
                        />
                        &nbsp;&nbsp;
                        <h3 className="model-owner-title m-0">
                          {reservationDetail?.reservation?.guest?.first_name &&
                            reservationDetail?.reservation?.guest
                              ?.first_name}{" "}
                          {reservationDetail?.reservation?.guest?.last_name &&
                            reservationDetail?.reservation?.guest?.last_name}
                        </h3>
                      </div>
                    </Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <div className="d-flex" style={{ position: "relative" }}>
                      {reservationDetail?.my_stays?.unit_picture !== "" ? (
                        <img
                          src={reservationDetail?.my_stays?.unit_picture}
                          alt="property image"
                          className="property-image"
                        />
                      ) : null}

                      {/* <h6 className="title">
                        {reservationDetail?.reservation?.unitName
                          ? reservationDetail?.reservation?.unitName
                          : null}
                      </h6> */}
                    </div>

                    <div className="d-flex mt-3">
                      <BsBoxArrowInLeft
                        style={{ fontSize: "20px", color: "#5c576a" }}
                      />
                      <h6 className="mx-3 detail-tag">
                        {reservationDetail?.reservation?.start_date &&
                          moment(
                            reservationDetail?.reservation?.start_date
                          ).format("ddd, MMMM-DD-YYYY")}
                      </h6>
                    </div>
                    <div className="d-flex">
                      <BsBoxArrowRight
                        style={{ fontSize: "20px", color: "#5c576a" }}
                      />{" "}
                      <h6 className="mx-3 detail-tag">
                        {reservationDetail?.reservation?.end_date &&
                          moment(
                            reservationDetail?.reservation?.end_date
                          ).format("ddd, MMMM-DD-YYYY")}
                      </h6>
                    </div>

                    <div
                      className="d-flex"
                      style={{ justifyContent: "space-between" }}
                    >
                      <div className="d-flex">
                        <label className="detail-tag">Nights:</label>
                        <h6 className="mx-3 detail-tag">
                          {reservationDetail?.reservation?.nights &&
                            reservationDetail?.reservation?.nights}
                        </h6>
                      </div>
                      <div className="d-flex">
                        <label className="detail-tag">Payment:</label>
                        <h6 className="mx-3 detail-tag">
                          {reservationDetail?.reservation?.invoice
                            ?.total_price &&
                            `$${reservationDetail?.reservation?.invoice?.total_price}`}
                        </h6>
                      </div>
                    </div>

                    <div
                      className="d-flex"
                      style={{ justifyContent: "space-between" }}
                    >
                      <div className="d-flex">
                        <label className="detail-tag">Adults:</label>{" "}
                        <h6 className="mx-3 detail-tag">
                          {reservationDetail?.reservation?.occupancy?.adults &&
                            reservationDetail?.reservation?.occupancy?.adults}
                        </h6>
                      </div>
                      <div className="d-flex">
                        <label className="detail-tag">Children:</label>{" "}
                        <h6 className="mx-3 detail-tag">
                          {reservationDetail?.reservation?.occupancy
                            ?.children &&
                            reservationDetail?.reservation?.occupancy?.children}
                        </h6>
                      </div>
                      <div className="d-flex">
                        <label className="detail-tag">Infants:</label>{" "}
                        <h6 className="mx-3 detail-tag">
                          {reservationDetail?.reservation?.occupancy?.infants &&
                            reservationDetail?.reservation?.occupancy?.infants}
                        </h6>
                      </div>
                    </div>

                    <div className="d-flex justify-content-center my-2">
                      <Button
                        className="button"
                        onClick={() => setShowModel(true)}
                      >
                        More Details
                      </Button>
                    </div>

                    <div className="mt-3">
                      <label>
                        <b>Notes</b>
                      </label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Add a note for this conversation"
                      />
                    </div>
                  </Offcanvas.Body>
                </>
              ) : (
                <div>
                  <Spinner animation="border" variant="primary" size="sm" />
                </div>
              )}
            </Offcanvas>
          </>
        )}

        {/* Reservations Model */}
        {showModel && (
          <Modal show={showModel} onHide={handleCloseModel}>
            <Modal.Header closeButton>
              <Modal.Title>
                <div className="d-flex">
                  {reservationDetail?.reservation?.guest?.picture ? (
                    <img
                      src={
                        reservationDetail?.reservation?.guest?.picture &&
                        reservationDetail?.reservation?.guest?.picture
                      }
                      alt="guest_pic"
                      className="guest-image"
                    />
                  ) : (
                    <>
                      <BsPersonCircle
                        style={{ fontSize: "25px", color: "#5c576a" }}
                      />
                      &nbsp;&nbsp;
                    </>
                  )}
                  <h3 className="model-owner-title">
                    {reservationDetail?.reservation?.guest?.first_name &&
                      reservationDetail?.reservation?.guest?.first_name}{" "}
                    {reservationDetail?.reservation?.guest?.last_name &&
                      reservationDetail?.reservation?.guest?.last_name}
                  </h3>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5 style={{ fontFamily: "system-ui", color: "#165aa3" }}>
                Booking Details
              </h5>
              <hr />
              {reservationDetail?.reservation?.reservation_code && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Reservation Code :{" "}
                    {reservationDetail?.reservation?.reservation_code}
                  </p>
                  <hr />
                </>
              )}
              {reservationDetail?.reservation?.start_date && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Check In : {reservationDetail?.reservation?.start_date}
                  </p>
                  <hr />
                </>
              )}
              {reservationDetail?.reservation?.end_date && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Check Out : {reservationDetail?.reservation?.end_date}
                  </p>
                  <hr />
                </>
              )}
              {/* {reservationDetail?.explore?.capacity?.max && (
                  <>
                    <p>Guests : {reservationDetail?.explore?.capacity?.max}</p>
                    <hr />
                  </>
                )} */}
              {reservationDetail?.reservation?.nights && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Nights : {reservationDetail?.reservation?.nights}
                  </p>
                  <hr />
                </>
              )}
              <br />
              <h5 style={{ fontFamily: "system-ui", color: "#165aa3" }}>
                Listing Details
              </h5>
              <hr />
              {reservationDetail?.reservation?.unitName && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Listing Name : {reservationDetail?.reservation?.unitName}
                  </p>
                  <hr />
                </>
              )}
              {reservationDetail?.checkout?.address?.street && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Listing Address :{" "}
                    {reservationDetail?.checkout?.address?.street},{" "}
                    {reservationDetail?.checkout?.address?.city}
                  </p>
                  <hr />
                </>
              )}
              {/* {reservationDetail?.explore?.capacity?.bedrooms && (
                <>
                  <p>
                    Bedrooms : {reservationDetail?.explore?.capacity?.bedrooms}
                  </p>
                  <hr />
                </>
              )}
              {reservationDetail?.explore?.capacity?.beds && (
                <>
                  <p>Beds : {reservationDetail?.explore?.capacity?.beds}</p>
                  <hr />
                </>
              )}
              {reservationDetail?.explore?.capacity?.bathrooms && (
                <>
                  <p>
                    Bathrooms :{" "}
                    {reservationDetail?.explore?.capacity?.bathrooms}
                  </p>
                  <hr />
                </>
              )} */}
              <br />
              <h5 style={{ fontFamily: "system-ui", color: "#165aa3" }}>
                Payment Details
              </h5>
              <hr />
              {reservationDetail?.reservation?.invoice?.total_price && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Amount : $
                    {reservationDetail?.reservation?.invoice?.total_price}
                  </p>
                  <hr />
                </>
              )}
              {reservationDetail?.reservation?.invoice?.cleaning_fee && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Cleaning Fee : $
                    {reservationDetail?.reservation?.invoice?.cleaning_fee}
                  </p>
                  <hr />
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={handleCloseModel}
                style={{ borderRadius: "50px" }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    units: state.db.units,
  };
};
export default withRouter(
  connect(mapStateToProps, {
    getActiveUnits,
    getCalendar,
    getReservations,
    getReservationsDetail,
  })(Calendar)
);
