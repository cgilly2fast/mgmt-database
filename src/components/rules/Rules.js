import React from "react";
import { Accordion } from "react-bootstrap";
import "./Rules.css";
import { BsPencil, BsArrowRight } from "react-icons/bs";

const rulesList = [
  {
    key: 1,
    platform: "Airbnb",
    listing_account: "TNORDSTROM808@GMAIL.COM",
    xero_platform: "XERO",
    accounting_account: "SURFWOOD HOSPITALITY LLC",
    active: 4,
    active_list: [
      {
        picture:
          "https://a0.muscache.com/im/pictures/4a3da97c-2e86-4ade-b973-ee2123b91c67.jpg?aki_policy=small",
        title: "IM1491 · Stroll to the Beach from Chic & Spacious Condo",
        city: "Honolulu",
      },
      {
        picture:
          "https://a0.muscache.com/im/pictures/4a3da97c-2e86-4ade-b973-ee2123b91c67.jpg?aki_policy=small",
        title: "IM1483 · Top Location Easy Stay at this Waikiki Condo",
        city: "Honolulu",
      },
      {
        picture:
          "https://a0.muscache.com/im/pictures/4a3da97c-2e86-4ade-b973-ee2123b91c67.jpg?aki_policy=small",
        title: "RA1503 · Above & Beyond Sweeping Sights w Free Parking",
        city: "Honolulu",
      },
      {
        picture:
          "https://a0.muscache.com/im/pictures/4a3da97c-2e86-4ade-b973-ee2123b91c67.jpg?aki_policy=small",
        title: "KV905A · Smooth Stay near Waikiki Beach w Small Balcony",
        city: "Honolulu",
      },
    ],
  },
  {
    key: 2,
    platform: "Airbnb",
    listing_account: "COLBY@DIPSEAPM.COM",
    xero_platform: "XERO",
    accounting_account: "STINSON BEACH PM",
    active: 4,
    active_list: [
      {
        picture:
          "https://a0.muscache.com/im/pictures/4a3da97c-2e86-4ade-b973-ee2123b91c67.jpg?aki_policy=small",
        title: "IM1491 · Stroll to the Beach from Chic & Spacious Condo",
        city: "Honolulu",
      },
      {
        picture:
          "https://a0.muscache.com/im/pictures/4a3da97c-2e86-4ade-b973-ee2123b91c67.jpg?aki_policy=small",
        title: "IM1483 · Top Location Easy Stay at this Waikiki Condo",
        city: "Honolulu",
      },
      {
        picture:
          "https://a0.muscache.com/im/pictures/4a3da97c-2e86-4ade-b973-ee2123b91c67.jpg?aki_policy=small",
        title: "RA1503 · Above & Beyond Sweeping Sights w Free Parking",
        city: "Honolulu",
      },
      {
        picture:
          "https://a0.muscache.com/im/pictures/4a3da97c-2e86-4ade-b973-ee2123b91c67.jpg?aki_policy=small",
        title: "KV905A · Smooth Stay near Waikiki Beach w Small Balcony",
        city: "Honolulu",
      },
    ],
  },
];

const Rules = () => {
  return (
    <>
      <div className="rules-div">
        <h3 className="rules-title">Rules</h3>
        <button type="submit" className="rules-button">
          +Add Rules
        </button>
      </div>

      <Accordion flush>
        {rulesList.map((item) => {
          return (
            <Accordion.Item eventKey={item.key} className="mb-3">
              <Accordion.Header>
                <div className="accordion-div">
                  <div>
                    <p>
                      {item.platform}
                      <br />
                      {item.listing_account}
                    </p>
                  </div>
                  <BsArrowRight />
                  <div>
                    <p>
                      {item.xero_platform}
                      <br />
                      {item.accounting_account}
                    </p>
                  </div>
                  <div>
                    <p>
                      {item.active}
                      <br />
                      SET LISTINGS
                    </p>
                  </div>
                  <div style={{ alignSelf: "center" }}>
                    <button type="submit" className="rules-active-button">
                      Active
                    </button>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body style={{ padding: "0rem 4.25rem" }}>
                {item.active_list.map((ele) => {
                  return (
                    <div className="rules-list">
                      <img
                        src={ele.picture}
                        alt="img"
                        className="rules-picture"
                      />
                      <div style={{ alignSelf: "center" }}>
                        <span>{ele.title}</span>
                        <br />
                        <span>{ele.city}</span>
                      </div>
                      <div>
                        <button type="submit" className="active-button">
                          COMPLETE
                        </button>
                      </div>
                      <BsPencil />
                    </div>
                  );
                })}
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </>
  );
};

export default Rules;
