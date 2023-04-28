import FullCalendar from "@fullcalendar/react";
import React, { useEffect, useRef, useState } from "react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import {
  getActiveUnits,
  getAllCalendarWithPrice,
  getReservationsDetail,
  updateCalendar,
} from "../../API";
import moment from "moment-timezone";
import interactionPlugin from "@fullcalendar/interaction";
import "./NewCalendar.css";
import { Button, Form, Modal, Spinner, Offcanvas } from "react-bootstrap";
import {
  BsBoxArrowInLeft,
  BsBoxArrowRight,
  BsPersonCircle,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Loader from "../loader/Loader";
import Heartrateloading from "../loader/Heartrateloading/Heartrateloading";
import { db } from "../../config/firebase";
import {
  UnitsType,
  calenderdatatype,
  calendertype,
  postsItemstypes,
  reservationDetailtype,
  reservationItems,
} from "../../API/Types";

function renderEventContent(eventInfo) {
  return (
    <>
      {eventInfo?.event?.extendedProps?.date ? (
        <>
          <p>${eventInfo?.event?.extendedProps?.value?.price?.amount}</p>
          <br />
        </>
      ) : (
        <div className="new-calendar-reservation-event">
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
          <h5 className="guest-name">
            {eventInfo?.event?.extendedProps?.value?.reservation?.first_name}
          </h5>
        </div>
      )}
    </>
  );
}

const NewCalendar: React.FC = () => {
  const navigate = useNavigate();
  const calendarRef: any | null = useRef();
  const [units, setUnits] = useState<UnitsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [calendar, setCalendar] = useState<calendertype[]>([]);
  const [postsItems, setPostsItems] = useState<postsItemstypes[]>([]);
  const [reservationItems, setReservationItems] = useState<reservationItems[]>(
    []
  );
  const [reservationId, setReservationId] = useState<number>();
  const [reservationDetail, setReservationDetail] =
    useState<reservationDetailtype>();
  const [showCanvas, setShowCanvas] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [unitData, setUnitData] = useState<UnitsType>();
  const [reservationloading, setReservationLoading] = useState(false);
  const [data, setData] = useState<calenderdatatype | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const activeUnitsGet = async () => {
      setLoading(true);
      const activeUnits = await getActiveUnits();
      setUnits(activeUnits);
      setLoading(false);
    };
    activeUnitsGet();
  }, []);

  const getCalendarlist = async () => {
    const calendarList = await getAllCalendarWithPrice();
    setCalendar(calendarList);
  };

  useEffect(() => {
    getCalendarlist();
  }, []);

  useEffect(() => {
    if (calendar?.length) {
      let tempData: any = [];
      calendar?.filter((value) => {
        if (value.length !== 0) {
          value?.response?.map((item) => {
            const reservationItem = {
              type: "reservations",
              resourceId: item?.unit_id,
              id: item?.reservation?.reservation_id,
              title: item?.reservation?.first_name,
              start: item?.start_date,
              end: item?.end_date,
              extendedProps: {
                picture: item?.reservation?.picture,
                value: item,
              },
              borderColor: "black",
              backgroundColor: "#fffadf",
              textColor: "black",
            };
            return tempData.push(reservationItem);
          });
        }
      });
      setReservationItems(tempData);
    }
  }, [calendar]);

  useEffect(() => {
    setLoading(true);
    if (calendar?.length) {
      let tempData: any = [];
      calendar?.filter((value) => {
        if (value?.length !== 0) {
          Object?.values(value?.days)?.map((item: any) => {
            if (
              item?.status?.reason !== "RESEVERED" &&
              moment(item?.date).format("YYYY-MM-DD") >=
                moment().format("YYYY-MM-DD")
            ) {
              const tempPriceObject = {
                type: "price",
                resourceId: value?.unit_id,
                title: "$" + item?.price?.amount,
                extendedProps: {
                  date: item?.date,
                  value: item,
                  resourceId: value?.unit_id,
                  calendarId: value?.id,
                },
                date: item?.date,
                borderColor: "#f1f1f100",
                backgroundColor: "#f1f1f100",
                textColor: "#5c576a",
                transform: "skewX(-20deg)",
              };
              return tempData.push(tempPriceObject);
            }
          });
        }
      });
      setPostsItems(tempData);
      setLoading(false);
    }
  }, [calendar]);

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

  useEffect(() => {
    const reservationDetailGet = async () => {
      if (reservationId) {
        setReservationLoading(true);
        const reservationDetail = await getReservationsDetail(reservationId);
        if (reservationDetail) {
          const unitRef: any = await db
            .collection("units")
            .doc(reservationDetail?.unit_id)
            .get();
          setUnitData(unitRef?.data());
          setReservationDetail(reservationDetail);
          setReservationLoading(false);
        } else {
          setReservationLoading(false);
        }
      }
    };
    reservationDetailGet();
  }, [reservationId]);

  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.incrementDate({ day: -7 });
  }, []);

  const handleClose = () => {
    setData(null);
    setShow(false);
  };

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
    <div>
      {loading ? <Loader /> : null}
      <div className={`${loading ? "d-none" : "block"}`}>
        <FullCalendar
          plugins={[interactionPlugin, resourceTimelinePlugin]}
          initialView="resourceTimelineYear"
          headerToolbar={{
            left: "today prev,next",
            center: "title",
            right: "",
          }}
          views={{
            resourceTimelineYear: {
              duration: { months: 12 },
              buttonText: "Year",
              dateIncrement: { day: -7 },
              slotLabelFormat: [
                { month: "long" },
                { weekday: "short", day: "2-digit" },
              ],
            },
          }}
          initialDate={new Date().toISOString()}
          nowIndicator={true}
          showNonCurrentDates={false}
          timeZone="local"
          aspectRatio={1.5}
          eventDisplay="true"
          resourceAreaHeaderContent="Property Name"
          resources={units}
          resourceLabelDidMount={function (arg) {
            arg.el.onclick = function () {
              navigate(`calendar/${arg?.resource?._resource?.id}`);
            };
          }}
          resourceLabelClassNames="resource-label-calendar"
          eventSources={[reservationItems, postsItems]}
          eventContent={renderEventContent}
          dayMaxEvents={false}
          initialEvents={[reservationItems, postsItems]}
          ref={calendarRef}
          eventClick={(arg) => handleClick(arg)}
        />
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
              const data = await {
                ...values,
                calendarId: values?.calendarId,
                id: values?.resourceId,
              };
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
                  {unitData?.picture?.filter((item) => item?.isCurrent)[0]
                    ?.original ? (
                    <img
                      src={
                        unitData?.picture?.filter((item) => item?.isCurrent)[0]
                          ?.original
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
                  <Button className="button" onClick={() => setShowModel(true)}>
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
    </div>
  );
};

export default NewCalendar;
