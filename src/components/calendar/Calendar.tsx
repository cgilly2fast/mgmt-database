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
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import BackButton from "../../img/BackButton.svg";
import {
  getActiveUnits,
  getCalendar,
  getReservationsDetail,
  updateCalendar,
} from "../../API";
import Heartrateloading from "../loader/Heartrateloading/Heartrateloading";
import {
  UnitsType,
  calenderdatatype,
  calendertype,
  eventsListtype,
  postsItemstype,
  reservationDetailtype,
  reservationItemstype,
  reservationListtype,
} from "../../API/Types";

function renderEventContent(eventInfo: {
  event: {
    extendedProps: {
      date: any;
      value: {
        price: {
          amount:
            | string
            | number
            | boolean
            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
            | React.ReactFragment
            | React.ReactPortal
            | null
            | undefined;
        };
        reservation: {
          first_name:
            | string
            | number
            | boolean
            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
            | React.ReactFragment
            | React.ReactPortal
            | null
            | undefined;
        };
      };
      picture: any;
    };
  };
}) {
  return (
    <>
      <>
        {eventInfo?.event?.extendedProps?.date ? (
          <>
            <b>
              Price: ${eventInfo?.event?.extendedProps?.value?.price?.amount}
            </b>
            <br />
          </>
        ) : (
          <>
            <div className="reservation-event">
              {eventInfo?.event?.extendedProps?.picture ? (
                <img
                  src={
                    eventInfo?.event?.extendedProps?.picture &&
                    eventInfo?.event?.extendedProps?.picture
                  }
                  alt="img"
                  className="img-calendar"
                />
              ) : null}
              <h5>
                {
                  eventInfo?.event?.extendedProps?.value?.reservation
                    ?.first_name
                }
              </h5>
            </div>
          </>
        )}
      </>
    </>
  );
}

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reservationloading, setReservationLoading] = useState(false);
  const [eventsList, setEventsList] = useState<eventsListtype[]>([]);
  const [postsItems, setPostsItems] = useState<postsItemstype[]>([]);
  const [reservationItems, setReservationItems] = useState<
    reservationItemstype[]
  >([]);
  const [reservationList, setReservationList] = useState<reservationListtype[]>(
    []
  );
  const [data, setData] = useState<calenderdatatype | null>(null);
  const [reservationId, setReservationId] = useState<number>();
  const [showCanvas, setShowCanvas] = useState<boolean>(false);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [units, setUnits] = useState<UnitsType[]>([]);
  const [calendar, setCalendar] = useState<calendertype | undefined>();
  const [reservationDetail, setReservationDetail] =
    useState<reservationDetailtype>();
  const { id } = useParams();
  const calendarId = calendar?.id && calendar?.id;
  const unitData = calendar?.unit && calendar?.unit;

  useEffect(() => {
    setLoading(true);
    const activeUnitsGet = async () => {
      const activeUnits = await getActiveUnits();
      setUnits(activeUnits);
    };
    activeUnitsGet();
    setLoading(false);
  }, []);

  useEffect(() => {
    getCalendarlist();
  }, [id]);

  const getCalendarlist = async () => {
    const calendarList = await getCalendar(id, setLoading);
    setCalendar(calendarList);
  };

  const handleClick = (arg: any) => {
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
    setData(null);
    setShow(false);
  };

  const handleSelect = (e: any) => {
    const id = e.target.value;
    navigate(`/calendar/${id}`);
  };

  useEffect(() => {
    setLoading(true);
    if (calendar) {
      if (calendar?.days) {
        setEventsList(Object?.values(calendar?.days));
      }
      if (calendar?.response) {
        setReservationList(Object?.values(calendar?.response));
      }
    }
    setLoading(false);
  }, [calendar]);

  useEffect(() => {
    if (reservationList?.length) {
      const data: any = reservationList.map((value) => {
        return {
          type: "reservations",
          id: value?.reservation?.reservation_id,
          title: value?.reservation?.first_name,
          start: value?.start_date,
          end: value?.end_date,
          extendedProps: {
            picture: value?.reservation?.picture,
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
    setLoading(true);
    if (eventsList?.length) {
      const data: any = eventsList
        ?.map((values: any) => {
          if (values.status.reason !== "RESEVERED")
            if (values.date >= moment(new Date()).format("YYYY-MM-DD")) {
              return {
                type: "price",
                title: "$" + values?.price.amount,
                extendedProps: {
                  date: values?.date,
                  value: values,
                },
                date: values?.date,
              };
            }
        })
        .filter((res) => res);
      setPostsItems(data);
      setLoading(false);
    }
  }, [eventsList, reservationList]);

  useEffect(() => {
    const reservationDetailGet = async () => {
      if (reservationId) {
        setReservationLoading(true);
        const reservationDetail = await getReservationsDetail(reservationId);
        setReservationDetail(reservationDetail);
        setReservationLoading(false);
      }
    };
    reservationDetailGet();
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
        onClick={() => navigate(-1)}
      />
      <>
        {/* Full calendar */}
        <div className="main-div-calendar">
          {loading ? (
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
                  {units?.map((item) => (
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
                // defaultView={reservationItems}
                eventSources={[reservationItems, postsItems]}
                selectable={true}
                eventContent={renderEventContent}
                eventClick={(arg: any) => handleClick(arg)}
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
                price: data?.value?.price?.amount,
                currency: data?.value?.price?.currency,
                reason: data?.value?.status?.reason,
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                const reloadCalendar = () => {
                  getCalendarlist();
                };
                const data = await { ...values, calendarId, id };
                updateCalendar(data, reloadCalendar);
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
          <Offcanvas
            show={showCanvas}
            onHide={() => {
              setShowCanvas(false);
            }}
            placement="end"
          >
            {!reservationloading ? (
              <>
                <Offcanvas.Header
                  closeButton
                  style={{ borderBottom: "1px solid black", padding: "1rem" }}
                >
                  <Offcanvas.Title className="m-0">
                    <div className="d-flex m-0">
                      {reservationDetail?.guest?.picture ? (
                        <img
                          src={
                            reservationDetail?.guest?.picture &&
                            reservationDetail?.guest?.picture
                          }
                          alt="guest_pic"
                          className="guest-image-calendar"
                        />
                      ) : (
                        <>
                          <BsPersonCircle
                            style={{ fontSize: "25px", color: "#5c576a" }}
                          />
                          &nbsp;&nbsp;
                        </>
                      )}
                      <h3 className="model-owner-title m-0">
                        {reservationDetail?.guest?.first_name &&
                          reservationDetail?.guest?.first_name}{" "}
                        {reservationDetail?.guest?.last_name &&
                          reservationDetail?.guest?.last_name}
                      </h3>
                    </div>
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <div className="d-flex" style={{ position: "relative" }}>
                    {unitData?.picture?.filter(
                      (item: { isCurrent: any }) => item?.isCurrent
                    )[0]?.original ? (
                      <img
                        src={
                          unitData?.picture?.filter(
                            (item: { isCurrent: any }) => item?.isCurrent
                          )[0]?.original
                        }
                        alt="property"
                        className="property-image-calendar"
                      />
                    ) : null}

                    <h6 className="title">
                      {unitData?.name ? unitData?.name : null}
                    </h6>
                  </div>

                  <div className="d-flex mt-3">
                    <BsBoxArrowInLeft
                      style={{ fontSize: "20px", color: "#5c576a" }}
                    />
                    <h6 className="mx-3 detail-tag">
                      {reservationDetail?.start_date &&
                        moment(reservationDetail?.start_date).format(
                          "ddd, MMMM-DD-YYYY"
                        )}
                    </h6>
                  </div>
                  <div className="d-flex">
                    <BsBoxArrowRight
                      style={{ fontSize: "20px", color: "#5c576a" }}
                    />{" "}
                    <h6 className="mx-3 detail-tag">
                      {reservationDetail?.end_date &&
                        moment(reservationDetail?.end_date).format(
                          "ddd, MMMM-DD-YYYY"
                        )}
                    </h6>
                  </div>

                  <div
                    className="d-flex"
                    style={{ justifyContent: "space-between" }}
                  >
                    <div className="d-flex">
                      <label className="detail-tag">Nights:</label>
                      <h6 className="mx-3 detail-tag">
                        {reservationDetail?.nights && reservationDetail?.nights}
                      </h6>
                    </div>
                    <div className="d-flex">
                      <label className="detail-tag">Payment:</label>
                      <h6 className="mx-3 detail-tag">
                        {reservationDetail?.invoice?.total_price &&
                          `$${reservationDetail?.invoice?.total_price}`}
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
                        {reservationDetail?.occupancy?.adults &&
                          reservationDetail?.occupancy?.adults}
                      </h6>
                    </div>
                    <div className="d-flex">
                      <label className="detail-tag">Children:</label>{" "}
                      <h6 className="mx-3 detail-tag">
                        {reservationDetail?.occupancy?.children &&
                          reservationDetail?.occupancy?.children}
                      </h6>
                    </div>
                    <div className="d-flex">
                      <label className="detail-tag">Infants:</label>{" "}
                      <h6 className="mx-3 detail-tag">
                        {reservationDetail?.occupancy?.infants &&
                          reservationDetail?.occupancy?.infants}
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
              <Heartrateloading />
              // <div>
              //   <Spinner animation="border" variant="primary" size="sm" />
              // </div>
            )}
          </Offcanvas>
        )}

        {/* Reservations Model */}
        {showModel && (
          <Modal
            show={showModel}
            onHide={() => {
              setShowModel(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <div className="d-flex">
                  {reservationDetail?.guest?.picture ? (
                    <>
                      <img
                        src={
                          reservationDetail?.guest?.picture &&
                          reservationDetail?.guest?.picture
                        }
                        alt="guest_pic"
                        className="guest-image"
                      />
                      &nbsp;&nbsp;
                    </>
                  ) : (
                    <>
                      <BsPersonCircle
                        style={{ fontSize: "25px", color: "#5c576a" }}
                      />
                      &nbsp;&nbsp;
                    </>
                  )}
                  <h3 className="model-owner-title">
                    {reservationDetail?.guest?.first_name &&
                      reservationDetail?.guest?.first_name}{" "}
                    {reservationDetail?.guest?.last_name &&
                      reservationDetail?.guest?.last_name}
                  </h3>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5 style={{ fontFamily: "system-ui", color: "#165aa3" }}>
                Booking Details
              </h5>
              <hr />
              {reservationDetail?.reservation_code && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Reservation Code : {reservationDetail?.reservation_code}
                  </p>
                  <hr />
                </>
              )}
              {reservationDetail?.check_in_date && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Check In : {reservationDetail?.check_in_date}
                  </p>
                  <hr />
                </>
              )}
              {reservationDetail?.check_out_date && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Check Out : {reservationDetail?.check_out_date}
                  </p>
                  <hr />
                </>
              )}
              {reservationDetail?.occupancy?.guests && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Guests : {reservationDetail?.occupancy?.guests}
                  </p>
                  <hr />
                </>
              )}
              {reservationDetail?.nights && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Nights : {reservationDetail?.nights}
                  </p>
                  <hr />
                </>
              )}
              <br />
              <h5 style={{ fontFamily: "system-ui", color: "#165aa3" }}>
                Listing Details
              </h5>
              <hr />
              {unitData?.name && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Listing Name : {unitData?.name}
                  </p>
                  <hr />
                </>
              )}
              {unitData?.address?.street && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Listing Address : {unitData?.address?.street},{" "}
                    {unitData?.address?.city}
                  </p>
                  <hr />
                </>
              )}
              {unitData?.capacity?.beds && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Beds : {unitData?.capacity?.beds}
                  </p>
                  <hr />
                </>
              )}
              {unitData?.capacity?.bathrooms && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Bathrooms : {unitData?.capacity?.bathrooms}
                  </p>
                  <hr />
                </>
              )}
              {unitData?.capacity?.bedrooms >= 0 && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Bedrooms: {unitData?.capacity?.bedrooms}
                  </p>
                  <hr />
                </>
              )}
              {unitData?.room_type && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Property type : {unitData?.room_type}
                  </p>
                  <hr />
                </>
              )}
              {unitData?.property_type && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Room type : {unitData?.property_type}
                  </p>
                  <hr />
                </>
              )}
              <br />
              <h5 style={{ fontFamily: "system-ui", color: "#165aa3" }}>
                Payment Details
              </h5>
              <hr />
              {reservationDetail?.invoice?.total_price && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Amount : ${reservationDetail?.invoice?.total_price}
                  </p>
                  <hr />
                </>
              )}
              {reservationDetail?.invoice?.cleaning_fee && (
                <>
                  <p style={{ fontFamily: "monospace" }}>
                    Cleaning Fee : ${reservationDetail?.invoice?.cleaning_fee}
                  </p>
                  <hr />
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  setShowModel(false);
                }}
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

export default Calendar;
