import { ErrorMessage, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Form, FormControl } from "react-bootstrap";
import { v4 as uuid } from "uuid";
import { Multiselect } from "multiselect-react-dropdown";
import "./AccountingRulesForm.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getActiveUnits,
  getConnections,
  getUnits,
} from "../../store/actions/dbActions";
import * as Yup from "yup";

const typeOption = {
  options: [
    { type: "HOURS" },
    { type: "CLEANING" },
    { type: "COMMISIONS" },
    { type: "AMAZON" },
    { type: "BILLABLE_EXPENSE" },
  ],
};

const source_data_type_option = {
  options: [
    { source_data_type: "HOURS" },
    { source_data_type: "CLEANING" },
    { source_data_type: "COMMISIONS" },
    { source_data_type: "AMAZON" },
  ],
};

const status_option = {
  options: [{ status: "ACTIVE" }, { status: "ERROR" }, { status: "DEACTIVED" }],
};

const AccountingRulesForm = () => {
  const dispatch = useDispatch();

  const typeMultiSelectRef = useRef();
  const unitMultiSelectRef = useRef();
  const filterMultiSelectRef = useRef();
  const sourceDataTypeMultiSelectRef = useRef();
  const statusMultiSelectRef = useRef();
  const connectionMultiSelectRef = useRef();

  const [billable, setBillable] = useState(false);
  const [filter, setFilter] = useState(false);
  const [emailReceipt, setEmailReceipt] = useState(false);
  const [mirror, setMirror] = useState(false);
  const [typeValue, setTypeValue] = useState();
  const [unitValue, setUnitValue] = useState();
  const [filterValue, setFilterValue] = useState();
  const [sourceDataTypeValue, setSourceDataTypeValue] = useState();
  const [sourceDataValue, setSourceDataValue] = useState();
  const [statusValue, setStatusValue] = useState();
  const [connectionValue, setConnectionValue] = useState();

  const units = useSelector(({ db }) => db?.units);
  const connections = useSelector(({ db }) => db?.connections);

  useEffect(() => {
    dispatch(getActiveUnits());
    dispatch(getConnections());
  }, []);

  const unitlist = units.map((item) => {
    return {
      unit_name: item?.name,
      unit_id: item?.id,
      account_code: "",
      bill_to: "",
    };
  });

  const filterUnitList = units.map((item) => {
    return {
      unit_name: item?.name,
      unit_id: item?.id,
    };
  });

  const connectionlist = connections.map((item) => {
    return {
      account: item?.account,
      account_id: item?.account_id,
      connection_id: item?.owner_id,
      platfrom: item?.platfrom,
    };
  });

  const SelectedItemsType = () => {
    return typeMultiSelectRef.current.getSelectedItems();
  };
  const handleTypeMultiSelectChange = () => {
    setTypeValue(SelectedItemsType());
  };
  const SelectedItemsUnit = () => {
    return unitMultiSelectRef.current.getSelectedItems();
  };
  const handleUnitMultiSelectChange = () => {
    setUnitValue(SelectedItemsUnit());
  };
  const SelectedItemsFilter = () => {
    return filterMultiSelectRef.current.getSelectedItems();
  };
  const handleFilterMultiSelectChange = () => {
    setFilterValue(SelectedItemsFilter());
  };
  const SelectedItemsSourceDataType = () => {
    return sourceDataTypeMultiSelectRef.current.getSelectedItems();
  };
  const handleSourceDataTypeMultiSelectChange = () => {
    setSourceDataTypeValue(SelectedItemsSourceDataType());
  };
  const SelectedItemsStatus = () => {
    return statusMultiSelectRef.current.getSelectedItems();
  };
  const handleStatusMultiSelectChange = () => {
    setStatusValue(SelectedItemsStatus());
  };
  const SelectedItemsConnection = () => {
    return connectionMultiSelectRef.current.getSelectedItems();
  };
  const handleConnectionMultiSelectChange = () => {
    setConnectionValue(SelectedItemsConnection());
  };

  const validationSchema = Yup.object().shape({
    type: Yup.string().required("Type is required"),
    billable: Yup.boolean(),
    units_billable: Yup.string().when("billable", {
      is: true,
      then: Yup.string().required("units_billable is required"),
    }),
    mirror: Yup.boolean(),
    filter: Yup.boolean(),
    filter_units: Yup.string().when("filter", {
      is: true,
      then: Yup.string().required("filter_units is required"),
    }),
    email_receipt: Yup.boolean(),
    source_data_type: Yup.string().required("source_data_type is required"),
    source_data: Yup.string().required("source_data is required"),
    status: Yup.string().required("Status is required"),
    connections: Yup.string().required("Connection is required"),
  });

  return (
    <>
      <h3>Accounting Rules Form</h3>
      <Formik
        initialValues={{
          uuid: uuid(),
          type: typeValue ? typeValue : "",
          billable: billable ? billable : "",
          mirror: mirror ? mirror : "",
          filter: filter ? filter : "",
          email_receipt: emailReceipt ? emailReceipt : "",
          source_data_type: sourceDataTypeValue ? sourceDataTypeValue : "",
          source_data: sourceDataValue ? sourceDataValue : "",
          units_billable: unitValue ? unitValue : "",
          filter_units: filterValue ? filterValue : "",
          status: statusValue ? statusValue : "",
          connections: connectionValue ? connectionValue : "",
        }}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values) => {
          console.log("values", values);
        }}
      >
        {({
          touched,
          errors,
          values,
          isSubmiting,
          handleSubmit,
          handleChange,
          handleBlur,
        }) => (
          <div className="d-flex justify-content-center">
            <Form className="form" onSubmit={handleSubmit}>
              {/* <Form.Control
                placeholder="Enter uuid"
                value={uuid()}
                className="input"
                style={{ display: "none" }}
                onChange={handleChange}
                onBlur={handleBlur}
                name="uuid"
              /> */}
              <Form.Label>Type</Form.Label>
              <Multiselect
                placeholder="Select type..."
                options={typeOption.options}
                displayValue="type"
                ref={typeMultiSelectRef}
                onRemove={handleTypeMultiSelectChange}
                onSelect={handleTypeMultiSelectChange}
                onChange={handleChange}
                onBlur={handleBlur}
                // value={values?.type}
                name="type"
                className={touched.type && errors.type ? "is-invalid" : ""}
              />
              <ErrorMessage
                component="div"
                name="type"
                className="invalid-feedback"
              />
              <hr />
              <Form.Check
                label="Billable"
                onChange={(e) => {
                  handleChange(e);
                  setBillable(e.target.checked);
                }}
                onBlur={handleBlur}
                name="billable"
                className={
                  touched.billable && errors.billable ? "is-invalid" : ""
                }
              />
              <ErrorMessage
                component="div"
                name="billable"
                className="invalid-feedback"
              />
              {billable && (
                <>
                  <Form.Label>Units billable</Form.Label>
                  <Multiselect
                    placeholder="Select Unit..."
                    options={unitlist}
                    displayValue="unit_name"
                    ref={unitMultiSelectRef}
                    onRemove={handleUnitMultiSelectChange}
                    onSelect={handleUnitMultiSelectChange}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="units_billable"
                    className={
                      touched.units_billable && errors.units_billable
                        ? "is-invalid"
                        : ""
                    }
                  />
                  <ErrorMessage
                    component="div"
                    name="units_billable"
                    className="invalid-feedback"
                  />
                </>
              )}
              <hr />
              <Form.Check
                label="Mirror"
                onChange={(e) => {
                  handleChange(e);
                  setMirror(e.target.checked);
                }}
                onBlur={handleBlur}
                name="mirror"
                className={touched.mirror && errors.mirror ? "is-invalid" : ""}
              />
              <ErrorMessage
                component="div"
                name="mirror"
                className="invalid-feedback"
              />
              <hr />
              <Form.Check
                label="Filter"
                onChange={(e) => {
                  handleChange(e);
                  setFilter(e.target.checked);
                }}
                onBlur={handleBlur}
                name="filter"
                className={touched.filter && errors.filter ? "is-invalid" : ""}
              />
              <ErrorMessage
                component="div"
                name="filter"
                className="invalid-feedback"
              />
              {filter && (
                <>
                  <Form.Label>Filter units</Form.Label>
                  <Multiselect
                    placeholder="Select Filter Unit..."
                    options={filterUnitList}
                    displayValue="unit_name"
                    ref={filterMultiSelectRef}
                    onRemove={handleFilterMultiSelectChange}
                    onSelect={handleFilterMultiSelectChange}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      touched.filter_units && errors.filter_units
                        ? "is-invalid"
                        : ""
                    }
                  />
                  <ErrorMessage
                    component="div"
                    name="filter_units"
                    className="invalid-feedback"
                  />
                </>
              )}
              <hr />
              <Form.Check
                label="Email_receipt"
                onChange={(e) => {
                  handleChange(e);
                  setEmailReceipt(e.target.checked);
                }}
                onBlur={handleBlur}
                name="email_receipt"
                className={
                  touched.email_receipt && errors.email_receipt
                    ? "is-invalid"
                    : ""
                }
              />
              <ErrorMessage
                component="div"
                name="email_receipt"
                className="invalid-feedback"
              />
              <hr />
              <Form.Label>Source data type</Form.Label>
              <Multiselect
                placeholder="Select source_data_type..."
                options={source_data_type_option.options}
                displayValue="source_data_type"
                ref={sourceDataTypeMultiSelectRef}
                onRemove={handleSourceDataTypeMultiSelectChange}
                onSelect={handleSourceDataTypeMultiSelectChange}
                onChange={handleChange}
                onBlur={handleBlur}
                name="source_data_type"
                className={
                  touched.source_data_type && errors.source_data_type
                    ? "is-invalid"
                    : ""
                }
              />
              <ErrorMessage
                component="div"
                name="source_data_type"
                className="invalid-feedback"
              />
              <hr />
              <Form.Label>Source data</Form.Label>
              <Form.Control
                placeholder="Enter source data"
                // className="input"
                name="source_data"
                onChange={(e) => {
                  handleChange(e);
                  setSourceDataValue(e.target.value);
                }}
                onBlur={handleBlur}
                className={
                  touched.source_data && errors.source_data ? "is-invalid" : ""
                }
              />
              <ErrorMessage
                component="div"
                name="source_data"
                className="invalid-feedback"
              />
              <hr />
              <Form.Label>Status</Form.Label>
              <Multiselect
                placeholder="Select status..."
                options={status_option.options}
                displayValue="status"
                ref={statusMultiSelectRef}
                onRemove={handleStatusMultiSelectChange}
                onSelect={handleStatusMultiSelectChange}
                onChange={handleChange}
                onBlur={handleBlur}
                name="status"
                className={touched.status && errors.status ? "is-invalid" : ""}
              />
              <ErrorMessage
                component="div"
                name="status"
                className="invalid-feedback"
              />
              <hr />
              <Form.Label>Connections</Form.Label>
              <Multiselect
                placeholder="Select Connection..."
                options={connectionlist}
                displayValue="account"
                ref={connectionMultiSelectRef}
                onRemove={handleConnectionMultiSelectChange}
                onSelect={handleConnectionMultiSelectChange}
                onChange={handleChange}
                onBlur={handleBlur}
                name="connections"
                className={
                  touched.connections && errors.connections ? "is-invalid" : ""
                }
              />
              <ErrorMessage
                component="div"
                name="connections"
                className="invalid-feedback"
              />
              <hr />
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  disabled={isSubmiting}
                  className="save-button"
                >
                  save
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
};

export default AccountingRulesForm;
