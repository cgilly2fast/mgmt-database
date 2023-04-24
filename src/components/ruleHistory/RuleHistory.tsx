import React, { useEffect, useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import "./RuleHistory.css";
import { useParams } from "react-router-dom";
import db from "../../admin";
import Loader from "../loader/Loader";
import { rollBackAccountingRule } from "../../API";
import moment from "moment";
import { functions } from "../../config/firebase";
import { RuleHistorytype, syncListtype } from "../../API/Types";

const RuleHistory: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [syncList, setSyncList] = useState<syncListtype[]>([]);
  const [executeLoading, setExecuteLoading] = useState(false);
  const [message, setMessage] = useState<RuleHistorytype | null>(null);
  const { rule_id } = useParams();
  const callablRollBackAccountingRulep = functions.httpsCallable(
    "accounting-rollBackAccountingRule"
  );

  useEffect(() => {
    setLoading(true);
    const getSyncDataOnSnapShot = async () => {
      try {
        await db
          .collection("sync")
          .where("rule_id", "==", rule_id)
          .orderBy("created_at", "desc")
          .onSnapshot((doc) => {
            let tempData: any = [];
            doc.forEach((item) => {
              tempData.push({ ...item.data(), id: item?.id });
            });
            setSyncList(tempData);
            setLoading(false);
          });
      } catch (e) {
        console.log(e);
      }
    };
    getSyncDataOnSnapShot();
  }, []);

  const handleRollBackAccountingRule = (id: any) => {
    setExecuteLoading(true);
    callablRollBackAccountingRulep({ sync_id: id })
      .then((response) => {
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
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div className="account-div mb-2">
              <h3 className="account-title">Sync History</h3>
            </div>
            <div>
              <Table className="table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Details</th>
                    <th>Executed</th>
                    <th>ID</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {syncList?.map((item, index) => {
                    return (
                      <tr key={index + item.id}>
                        <td>{item?.status}</td>
                        <td>{item?.status_details}</td>
                        <td>{moment(item?.created_at._seconds).toString()}</td>
                        <td>{item.id}</td>
                        <td>
                          {executeLoading && !message?.responseMessage ? (
                            <Spinner
                              animation="border"
                              size="sm"
                              variant="primary"
                            />
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
                                  onClick={() =>
                                    handleRollBackAccountingRule(item?.id)
                                  }
                                >
                                  Roll Back
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RuleHistory;
