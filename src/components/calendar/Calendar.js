import FullCalendar from "@fullcalendar/react";
import React, { useEffect, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import "./Calendar.css";
import moment from "moment-timezone";
import { useHistory } from "react-router-dom";
import {
  getActiveUnits,
  getCalendar,
  getReservations,
  updateCalendar,
} from "../../store/actions/dbActions";
import { connect, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";

function renderEventContent(eventInfo) {
  return (
    <>
      <>
        {eventInfo?.event?.extendedProps?.date ? (
          <>
            <b>{eventInfo?.event?.extendedProps?.date}</b>
            <br />
          </>
        ) : (
          <img
            src={eventInfo?.event?.extendedProps?.picture}
            className="img-calendar"
          />
        )}
      </>
      <b>
        <i>{eventInfo?.event?.title}</i>
      </b>
    </>
  );
}

const Calendar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [eventsList, setEventsList] = useState([]);
  const [postsItems, setPostsItems] = useState([]);
  const [reservationItems, setReservationItems] = useState([]);
  const [reservationList, setReservationList] = useState([]);
  const [data, setData] = useState();
  const { id } = useParams();

  const unitsdata = useSelector(({ db }) => db?.units);
  const calendardata = useSelector(({ db }) => db?.calendar);
  const reservations = useSelector(({ db }) => db?.reservations);

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
  };

  const handleClose = () => {
    setData();
    setShow(false);
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
  }, [calendardata.data]);

  useEffect(() => {
    if (reservationList?.length) {
      const data = reservationList.map((value) => {
        return {
          type: "reservations",
          title: value?.guest?.firstName,
          start: value?.checkInDate,
          end: value?.checkOutDate,
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
          const filter = reservationList.find(
            (reserveDate) =>
              new Date(reserveDate.checkOutDate).getTime() >
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
        })
        .filter((res) => res);
      setPostsItems(data);
    }
  }, [eventsList, reservationList]);

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
      <>
        <div className="main-div">
          {calendardata.loading ? (
            <h1 className="loader">Loading...</h1>
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
        {show && (
          <Modal show={show} onHide={handleClose}>
            <Formik
              initialValues={{
                ...data,
                day: data?.value?.day,
                min_stay: data?.value?.min_stay,
                price: data?.value?.price?.price / 10,
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
      </>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    units: state.db.units,
  };
};
export default connect(mapStateToProps, {
  getActiveUnits,
  getCalendar,
  getReservations,
})(Calendar);
