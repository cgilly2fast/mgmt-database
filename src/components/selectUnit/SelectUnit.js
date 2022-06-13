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
} from "../../store/actions/dbActions";
import { connect, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// function renderEventContent(eventInfo) {
//   return (
//     <>
//       {console.log("eventInfo", eventInfo?.event?.extendedProps?.picture)}
//       <>
//         {eventInfo?.event?.extendedProps?.date ? (
//           <>
//             <b>{eventInfo?.event?.extendedProps?.date}</b>
//             <br />
//           </>
//         ) : (
//           <img
//             src={eventInfo?.event?.extendedProps?.picture}
//             className="img-calendar"
//           />
//         )}
//       </>
//       <b>
//         <i>{eventInfo?.event?.title}</i>
//       </b>
//     </>
//   );
// }

const SelectUnit = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const [show, setShow] = useState(false);
  // const [eventsList, setEventsList] = useState([]);
  // const [reservationList, setReservationList] = useState([]);
  // const [date, setDate] = useState();
  const { id } = useParams();

  const unitsdata = useSelector(({ db }) => db?.units);
  // const calendardata = useSelector(({ db }) => db?.calendar);
  // const reservations = useSelector(({ db }) => db?.reservations);

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   dispatch(getCalendar(id));
  //   dispatch(getReservations(id));
  // }, [id]);

  const fetchData = () => {
    dispatch(getActiveUnits());
  };

  // const handleClick = (arg) => {
  //   setDate(arg?.date);
  //   setShow(true);
  // };

  // const handleClose = () => {
  //   setShow(false);
  // };

  const handleSelect = (e) => {
    const id = e.target.value;
    history.push(`/calendar/${id}`);
  };

  // useEffect(() => {
  //   if (
  //     (calendardata?.loading == false && calendardata?.data) ||
  //     (reservations?.loading == false && reservations?.data)
  //   ) {
  //     if (calendardata?.data?.days || reservations?.data) {
  //       setEventsList(Object.values(calendardata?.data?.days));
  //       setReservationList(Object.values(reservations?.data));
  //     }
  //   }
  // }, [calendardata.data]);

  // let postsItems = [];
  // for (const [key, value] of eventsList.entries()) {
  //   postsItems.push({
  //     title: "$" + value?.price.price / 10,
  //     extendedProps: {
  //       date: value?.date,
  //     },
  //     date: value?.date,
  //   });
  // }
  // console.log("reservationList", reservationList);
  // let reservationItems = [];
  // for (const [key, value] of reservationList.entries()) {
  //   reservationItems.push({
  //     title: value?.guest?.firstName,
  //     start: value?.checkInDate,
  //     end: value?.checkOutDate,
  //     extendedProps: {
  //       picture: value?.guest?.picture,
  //     },
  //     borderColor: "black",
  //     backgroundColor: "#fffadf",
  //     textColor: "black",
  //   });
  // }

  return (
    <>
      {id === undefined && (
        <>
          <h2 className="text-center mt-5 mb-3" style={{ color: "#007bff" }}>
            Select Unit
          </h2>
          <div className="d-flex justify-content-center">
            <Form.Control
              as="select"
              className="select-unit"
              onChange={handleSelect}
              style={{ width: "30%" }}
            >
              <option selected disabled>
                Select Units
              </option>
              {unitsdata?.map((item) => (
                <option value={item?.id} key={item?.id}>
                  {item?.name} {item?.address?.city}
                </option>
              ))}
            </Form.Control>
          </div>
        </>
      )}
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
})(SelectUnit);
