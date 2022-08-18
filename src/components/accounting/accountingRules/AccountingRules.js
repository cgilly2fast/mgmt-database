import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { BsArrowRight, BsPencil } from "react-icons/bs";
import { executeAccountingRule } from "../../../API";

const AccountingRules = ({ item }) => {
  const [executeLoading, setExecuteLoading] = useState(false);
  const [message, setMessage] = useState({ responseMessage: "", color: "" });

  const handleExecuteAccountingRule = (id) => {
      setExecuteLoading(true);
      executeAccountingRule(id)
        .then((response, ) => {
          
          console.log("response", response);
          setExecuteLoading(false);
          setMessage({
            responseMessage: "Complete!",
            color: "green",
          });
          setTimeout(() => {
            setMessage(null);
          }, 2000);
        })
        .catch((err) => {
          console.log("error", err);
            setExecuteLoading(false);
            setMessage({
              responseMessage: "Something went wrong!",
              color: "red",
            });
            setTimeout(() => {
              setMessage(null);
            }, 2000);
        });
  };

  return (
    <tr>
      <td>
        <span>{item?.account?.account}</span>
        <br />
        <span>{item?.invoice?.contact?.name}</span>
        <br />
        <span>{item?.id}</span>
      </td>
      <td>
        <span>{item?.type}</span>
      </td>
      <td>
        <BsArrowRight />
      </td>
      <td>
        <span>{item?.mirror_account?.account}</span>
        <br />
        <span>{item?.mirror_invoice?.contact?.name}</span>
      </td>
      <td>View History</td>
      <td>
        {executeLoading && !message?.responseMessage ? (
          <Spinner animation="border" size="sm" variant="primary" />
        ) : (
          <>
            {message?.responseMessage ? (
              <span style={{ color: message?.color }}>
                {message?.responseMessage}
              </span>
            ) : (
              <button
                type="submit"
                className="active-button"
                onClick={() => handleExecuteAccountingRule(item?.id)}
              >
                EXECUTE
              </button>
            )}
          </>
        )}
      </td>
      <td>
        <BsPencil />
      </td>
    </tr>
  );
};

export default AccountingRules;
