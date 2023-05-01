import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import "./CreateMagicalMomentsModal.css";
import MessageModalImage from "../../../img/MessageModalImage.png";
import BookingAlteration from "../../../img/booking-alteration.svg";
import BookingRequest from "../../../img/booking-request.svg";
import BookingCancelled from "../../../img/booking-cancelled.svg";
import BookingInquiry from "../../../img/booking-inquiry.svg";
import CheckIn from "../../../img/check-in.svg";
import CheckOut from "../../../img/check-out.svg";
import Cancel from "../../../img/cancel.svg";
import { getMessageRules } from "../../../API";
import { db } from "../../../config/firebase";
import { useNavigate } from "react-router-dom";
import { listMessagetype } from "../../../API/Types";

const listOfMessage = [
  {
    name: "New inquiry",
    type: "new_inquiry",
    short_type: "event",
    icon: BookingInquiry,
  },
  {
    name: "New pre-approval",
    type: "new_pre_approval",
    short_type: "event",
    icon: BookingRequest,
  },
  {
    name: "New request to book",
    type: "new_request_to_book",
    short_type: "event",
    icon: BookingAlteration,
  },
  {
    name: "New reservation",
    type: "new_reservation",
    short_type: "event",
    icon: BookingAlteration,
  },
  {
    name: "New cancellation",
    type: "new_cancellation",
    short_type: "event",
    icon: BookingCancelled,
  },
  {
    name: "Expired pre-approval",
    type: "expired_pre_approval",
    short_type: "event",
    icon: BookingCancelled,
  },
  {
    name: "Inquiry/booking denied",
    type: "inquiry_denied",
    short_type: "event",
    icon: BookingCancelled,
  },
  {
    name: "New special offer",
    type: "new_special_offer",
    short_type: "event",
    icon: BookingInquiry,
  },
  {
    name: "New payment issue",
    type: "new_payment_issue",
    short_type: "event",
    icon: BookingCancelled,
  },
  {
    name: "After a new reservation",
    type: "after_a_new_reservation",
    short_type: "scheduled",
    icon: BookingAlteration,
  },
  {
    name: "Before check-in",
    type: "before_check_in",
    short_type: "scheduled",
    icon: CheckIn,
  },
  {
    name: "After check-in",
    type: "after_check_in",
    short_type: "scheduled",
    icon: CheckIn,
  },
  {
    name: "Before check-out",
    type: "before_check_out",
    short_type: "scheduled",
    icon: CheckOut,
  },
  {
    name: "After check-out",
    type: "after_check_out",
    short_type: "scheduled",
    icon: CheckOut,
  },
  {
    name: "On a given day of the week",
    type: "on_a_given_day_of_the_week",
    short_type: "scheduled",
    icon: CheckOut,
  },
  {
    name: "After a cancel reservation",
    type: "after_a_cancel_reservation",
    short_type: "scheduled",
    icon: BookingCancelled,
  },
];

interface CreateMagicalMomentsModalProps {
  showModel: boolean;
  setShowModel: (value: boolean) => void;
}

const CreateMagicalMomentsModal: React.FC<CreateMagicalMomentsModalProps> = ({
  showModel,
  setShowModel,
}: CreateMagicalMomentsModalProps) => {
  const navigate = useNavigate();
  const [listMessage, setListMessage] = useState<listMessagetype[]>([]);
  const [unitList, setUnitList] = useState([]);

  useEffect(() => {
    const functioGetMessagRulesList = async () => {
      if (showModel) {
        const getMessageRulesList =
          (await getMessageRules()) as listMessagetype[];
        const rules: any = getMessageRulesList.reduce(
          (
            typeList: { [x: string]: any[] },
            item: { short_type: string | number }
          ) => {
            if (!typeList[item?.short_type]) typeList[item?.short_type] = [];
            typeList[item?.short_type].push(item);
            return typeList;
          },
          {}
        );
        setListMessage(rules);
      }
    };
    functioGetMessagRulesList();
  }, [showModel]);

  useEffect(() => {
    const OwnerAndUnitsDetail = async () => {
      const unitRef = await db
        .collection("units")
        .where("active", "==", true)
        .get();
      const tempUnits: any = [];
      unitRef.docs.forEach((item) => {
        tempUnits.push({
          unit_id: item?.id,
          unit_name: item?.data()?.name,
          unit_picture: item
            ?.data()
            ?.picture?.filter((itemPic) => itemPic?.isCurrent)[0]?.original,
        });
      });
      setUnitList(tempUnits);
    };
    OwnerAndUnitsDetail();
  }, []);

  const handleClick = async (value) => {
    const messagingRuleObject = {
      name: value?.name,
      message: "",
      active: false,
      immediately: true,
      minutes: "",
      hours: "",
      days: "",
      trigger_on: "after",
      type: value?.type,
      exclude_last_minute_stays: false,
      one_night_stays: false,
      two_night_stays: false,
      greater_than_2_night_stays: false,
      platforms: [],
      owners: [],
      units: unitList,
    };
    const addNewMessageRule = await db
      .collection("messaging-rules")
      .add(messagingRuleObject);
    navigate(`/rules/${addNewMessageRule?.id}`);
  };

  return (
    <Modal
      show={showModel}
      onHide={() => {
        setShowModel(false);
      }}
      dialogClassName="magical-modal"
    >
      <Modal.Body className="magical-body-modal">
        <div
          className="create-magical-wrapper"
          style={{ backgroundImage: `url(${MessageModalImage})` }}
        >
          <h3>Create magical moments.</h3>
          <span className="sub-title">
            Save time by automating your conversations. You can create rules to
            allow Hospitable.com to send messages on your behalf.
          </span>
          <span
            className="cancel-span"
            onClick={() => {
              setShowModel(false);
            }}
          >
            <img src={Cancel} />
          </span>
        </div>
        <div className="list-wrapper">
          {showModel &&
            Object.entries(listMessage)?.map(([key, value]) => {
              return (
                <div style={{ flex: "1 1 0%" }} key={key}>
                  <h6 className="title-scheduler">{key}</h6>
                  {value?.map((item) => {
                    return (
                      <div
                        className="li-wrapper"
                        onClick={() => handleClick(item)}
                        key={item?.name}
                      >
                        <p className="list-name">{item?.name}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreateMagicalMomentsModal;
