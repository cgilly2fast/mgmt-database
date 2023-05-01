import React, { useEffect, useState } from "react";
import { ErrorMessage, Formik, FormikHelpers } from "formik";
import { Form } from "react-bootstrap";
import { v4 as uuid } from "uuid";
import Multiselect from "multiselect-react-dropdown";
import "./AccountingRulesForm.css";
import * as Yup from "yup";
import { getActiveUnits, getConnections } from "../../API";
import {
  UnitsType,
  connectionValue,
  filterValue,
  invoiceTypeValue,
  mirrorInvoiceTypeValue,
  sourceDataTypeValue,
  statusValue,
  tempDatatype,
  typeValue,
  unitValue,
} from "../../API/Types";

const typeOption = {
  options: [
    { type: "HOURS" },
    { type: "CLEANING" },
    { type: "COMMISIONS" },
    { type: "BILLABLE_EXPENSE" },
    { type: "AMAZON_BILLS" },
    { type: "AMAZON_REFUNDS" },
    { type: "CLEANING_FEES_TO_MANAGER" },
    { type: "OWNER_PAYOUT" },
  ],
};

const source_data_type_option = {
  options: [
    { source_data_type: "HOURS" },
    { source_data_type: "CLEANING" },
    { source_data_type: "COMMISIONS" },
    { source_data_type: "AMAZON_BILLS" },
    { source_data_type: "AMAZON_REFUNDS" },
    { source_data_type: "CLEANING_FEES_TO_MANAGER" },
    { source_data_type: "OWNER_PAYOUT" },
  ],
};

const status_option = {
  options: [{ status: "ACTIVE" }, { status: "ERROR" }, { status: "DEACTIVED" }],
};

const invoice_type = {
  options: [{ type: "ACCPAY" }, { type: "ACCREC" }],
};

const AccountingRulesForm: React.FC = () => {
  const [billable, setBillable] = useState<boolean>(false);
  const [filter, setFilter] = useState<boolean>(false);
  const [emailReceipt, setEmailReceipt] = useState<boolean>(false);
  const [mirror, setMirror] = useState<boolean>(false);
  const [typeValue, setTypeValue] = useState<typeValue[]>([]);
  const [unitValue, setUnitValue] = useState<unitValue[]>([]);
  const [filterValue, setFilterValue] = useState<filterValue[]>([]);
  const [sourceDataTypeValue, setSourceDataTypeValue] = useState<
    sourceDataTypeValue[]
  >([]);
  const [sourceDataValue, setSourceDataValue] = useState<string>();
  const [statusValue, setStatusValue] = useState<statusValue[]>([]);
  const [connectionValue, setConnectionValue] = useState<connectionValue[]>([]);
  const [invoiceTypeValue, setInvoiceTypeValue] = useState<invoiceTypeValue[]>(
    []
  );
  const [mirrorInvoiceTypeValue, setMirrorInvoiceTypeValue] = useState<
    mirrorInvoiceTypeValue[]
  >([]);
  const [units, setUnits] = useState<UnitsType[]>([]);
  const [connections, setConnections] = useState<tempDatatype[]>([]);
  const [unitlistdata, setUnitlistdata] = useState<any>([]);
  const [filterUnitListdata, setFilterUnitListdata] = useState<any>([]);
  const [connectionlistdata, setConnectionlistdata] = useState<any>([]);

  useEffect(() => {
    const accountingRules = async () => {
      const activeUnits = (await getActiveUnits()) as UnitsType[];
      const connectionData = (await getConnections()) as tempDatatype[];
      setUnits(activeUnits);
      setConnections(connectionData);
    };
    accountingRules();
  }, []);
  useEffect(() => {
    const unitlist = units.map((item) => {
      return {
        unit_name: item?.name,
        unit_id: item?.id,
        account_code: "",
        bill_to: "",
      };
    });
    setUnitlistdata(unitlist);
  }, []);
  useEffect(() => {
    const filterUnitList = units.map((item) => {
      return {
        unit_name: item?.name,
        unit_id: item?.id,
      };
    });
    setFilterUnitListdata(filterUnitList);
  }, []);
  useEffect(() => {
    const connectionlist = connections.map((item) => {
      return {
        account: item?.account,
        account_id: item?.account_id,
        connection_id: item?.id,
        platfrom: item?.platform,
      };
    });
    setConnectionlistdata(connectionlist);
  }, []);

  const handleTypeMultiSelectChange = (
    selectedList: React.SetStateAction<typeValue[]>
  ) => {
    setTypeValue(selectedList);
  };
  const handleUnitMultiSelectChange = (
    selectedList: React.SetStateAction<unitValue[]>
  ) => {
    setUnitValue(selectedList);
  };
  const handleFilterMultiSelectChange = (
    selectedList: React.SetStateAction<filterValue[]>
  ) => {
    setFilterValue(selectedList);
  };
  const handleSourceDataTypeMultiSelectChange = (
    selectedList: React.SetStateAction<sourceDataTypeValue[]>
  ) => {
    setSourceDataTypeValue(selectedList);
  };
  const handleStatusMultiSelectChange = (
    selectedList: React.SetStateAction<statusValue[]>
  ) => {
    setStatusValue(selectedList);
  };
  const handleConnectionMultiSelectChange = (
    selectedList: React.SetStateAction<connectionValue[]>
  ) => {
    setConnectionValue(selectedList);
  };
  const handleInvoiceTypeMultiSelectChange = (
    selectedList: React.SetStateAction<invoiceTypeValue[]>
  ) => {
    setInvoiceTypeValue(selectedList);
  };
  const handleMirrorInvoiceTypeMultiSelectChange = (
    selectedList: React.SetStateAction<mirrorInvoiceTypeValue[]>
  ) => {
    setMirrorInvoiceTypeValue(selectedList);
  };

  const validationSchema = Yup.object().shape({
    type: Yup.object().required("type is required").nullable(),
    source_data_type: Yup.string()
      .required("source data type is required")
      .nullable(),
    source_data: Yup.string().required("source data is required"),
    status: Yup.string().required("Status is required"),
    connections: Yup.string().required("Connection is required"),
  });

  return (
    <>
      <h3>Accounting Rules Form</h3>
      <Formik
        initialValues={{
          uuid: "",
          type: "",
          billable: "",
          mirror: "",
          filter: "",
          email_receipt: "",
          source_data_type: "",
          source_data: "",
          units_billable: "",
          filter_units: "",
          status: "",
          connections: "",
          invoice: {
            type: "",
            contact: {
              contact_id: "",
              contact_name: "",
            },
            currency: "",
            date: "",
            due_date: "",
            reference: "",
            line_items: {
              account_code: "",
              description: "",
              quantity: "",
              unit_amount: "",
              tracking: [{ name: "", option: "" }],
            },
          },
          mirror_invoice: {
            type: "",
            contact: {
              contact_id: "",
              contact_name: "",
            },
            currency: "USD",
            date: "",
            due_date: "",
            reference: "",
            line_items: {
              account_code: "",
              description: "",
              quantity: "",
              unit_amount: "",
              tracking: [{ name: "", option: "" }],
            },
          },
          mirror_connection: {
            connection_id: "",
            account: "",
            account_id: "",
            platfrom: "",
          },
        }}
        enableReinitialize
        onSubmit={async (values: any) => {
          const newValue = {
            uuid: uuid(),
            type: typeValue ? typeValue?.[0]?.type : "",
            billable: billable ? billable : "",
            mirror: mirror ? mirror : "",
            filter: filter ? filter : "",
            email_receipt: emailReceipt ? emailReceipt : "",
            source_data_type: sourceDataTypeValue
              ? sourceDataTypeValue?.[0]?.source_data_type
              : "",
            source_data: sourceDataValue ? sourceDataValue : "",
            units_billable: unitValue ? unitValue : [],
            filter_units: filterValue ? filterValue : [],
            status: statusValue ? statusValue?.[0]?.status : "",
            connections: connectionValue ? connectionValue?.[0] : "",
            invoice: {
              type: invoiceTypeValue ? invoiceTypeValue?.[0]?.type : "",
              contact: {
                contact_id: values?.contact_id ? values?.contact_id : "",
                contact_name: values?.contact_name ? values?.contact_name : "",
              },
              currency: values?.currency ? values?.currency : "",
              date: values?.date ? values?.date : "",
              due_date: values?.due_date ? values?.due_date : "",
              reference: values?.reference ? values?.reference : "",
              line_items: {
                account_code: values?.account_code ? values?.account_code : "",
                description: values?.description ? values?.description : "",
                quantity: values?.quantity ? values?.quantity : "",
                unit_amount: values?.unit_amount ? values?.unit_amount : "",
                tracking: [{ values }],
              },
            },
            mirror_invoice: {
              type: mirrorInvoiceTypeValue
                ? mirrorInvoiceTypeValue?.[0].type
                : "",
              contact: {
                contact_id: values?.mirror_contact_id
                  ? values?.mirror_contact_id
                  : "",
                contact_name: values?.mirror_contact_name
                  ? values?.mirror_contact_name
                  : "",
              },
              currency: values?.mirror_currency ? values?.mirror_currency : "",
              date: values?.mirror_date ? values?.mirror_date : "",
              due_date: values?.mirror_due_date ? values?.mirror_due_date : "",
              reference: values?.mirror_reference
                ? values?.mirror_reference
                : "",
              line_items: {
                account_code: values?.mirror_account_code
                  ? values?.mirror_account_code
                  : "",
                description: values?.mirror_descripation
                  ? values?.mirror_descripation
                  : "",
                quantity: values?.mirror_quantity
                  ? values?.mirror_quantity
                  : "",
                unit_amount: values?.mirror_unit_amount
                  ? values?.mirror_unit_amount
                  : "",
                tracking: [
                  {
                    name: values?.mirror_tracking_name
                      ? values?.mirror_tracking_name
                      : "",
                    option: values?.mirror_tracking_option
                      ? values?.mirror_tracking_option
                      : "",
                  },
                ],
              },
            },
            mirror_connection: {
              connection_id: "",
              account: "",
              account_id: "",
              platfrom: "",
            },
          };
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
          <div className="d-flex justify-content-center">
            <Form className="form" onSubmit={handleSubmit}>
              <Form.Label>Type</Form.Label>
              <Multiselect
                singleSelect={true}
                placeholder="Select type..."
                options={typeOption.options}
                displayValue="type"
                onRemove={handleTypeMultiSelectChange}
                onSelect={handleTypeMultiSelectChange}
                // onChange={handleChange}
                // onBlur={handleBlur}
                // name="type"
                className={touched?.type && errors?.type ? "is-invalid" : ""}
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
                    options={unitlistdata}
                    displayValue="unit_name"
                    onRemove={handleUnitMultiSelectChange}
                    onSelect={handleUnitMultiSelectChange}
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                    // name="units_billable"
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
                    options={filterUnitListdata}
                    displayValue="unit_name"
                    onRemove={handleFilterMultiSelectChange}
                    onSelect={handleFilterMultiSelectChange}
                    // onChange={handleChange}
                    // onBlur={handleBlur}
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
                singleSelect={true}
                options={source_data_type_option.options}
                displayValue="source_data_type"
                onRemove={handleSourceDataTypeMultiSelectChange}
                onSelect={handleSourceDataTypeMultiSelectChange}
                // onChange={handleChange}
                // onBlur={handleBlur}
                // name="source_data_type"
                className={
                  touched?.source_data_type && errors?.source_data_type
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
                singleSelect={true}
                onRemove={handleStatusMultiSelectChange}
                onSelect={handleStatusMultiSelectChange}
                // onChange={handleChange}
                // onBlur={handleBlur}
                // name="status"
                className={touched.status && errors.status ? "is-invalid" : ""}
              />
              <ErrorMessage
                component="div"
                name="status"
                className="invalid-feedback"
              />
              <hr />
              <Form.Label>Invoice</Form.Label>
              <div className="invoice-div">
                <Form.Label>Invoice Type</Form.Label>
                <Multiselect
                  placeholder="Select Invoice type..."
                  options={invoice_type.options}
                  singleSelect={true}
                  displayValue="type"
                  onRemove={handleInvoiceTypeMultiSelectChange}
                  onSelect={handleInvoiceTypeMultiSelectChange}
                  // onChange={handleChange}
                  // onBlur={handleBlur}
                  // name="invoice_type"
                  className={
                    touched.connections && errors.connections
                      ? "is-invalid"
                      : ""
                  }
                />
                <Form.Label className="mt-2">Contact</Form.Label>
                <div className="invoice-div mb-2">
                  <Form.Label>Contact Id</Form.Label>
                  <Form.Control
                    placeholder="Enter Contact Id"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="contact_id"
                  />
                  <Form.Label>Contact Name</Form.Label>
                  <Form.Control
                    placeholder="Enter Contact name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="contact_name"
                  />
                </div>
                <Form.Label>Currency</Form.Label>
                <Form.Control
                  placeholder="Enter Currency"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="currency"
                />
                <Form.Label>Reference</Form.Label>
                <Form.Control
                  placeholder="Enter Reference"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="reference"
                />
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="date"
                />
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="due_date"
                />
                <Form.Label className="mt-2">Line items</Form.Label>
                <div className="invoice-div mb-2">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    placeholder="Enter Quantity"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="quantity"
                  />
                  <Form.Label>Unit Amount</Form.Label>
                  <Form.Control
                    placeholder="Enter unit amount"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="unit_amount"
                  />
                  <Form.Label>Descripation</Form.Label>
                  <Form.Control
                    placeholder="Enter descripation"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="descripation"
                  />
                  <Form.Label>Account Code</Form.Label>
                  <Form.Control
                    placeholder="Enter account code"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="account_code"
                  />
                  <Form.Label className="mt-2">Tracking</Form.Label>
                  <div className="invoice-div">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      placeholder="Enter tracking name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="name"
                    />
                    <Form.Label>Option</Form.Label>
                    <Form.Control
                      placeholder="Enter tracking option"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="option"
                    />
                  </div>
                </div>
              </div>
              <hr />
              <Form.Label>Connections</Form.Label>
              <Multiselect
                placeholder="Select Connection..."
                options={connectionlistdata}
                singleSelect={true}
                displayValue="account"
                onRemove={handleConnectionMultiSelectChange}
                onSelect={handleConnectionMultiSelectChange}
                // onChange={handleChange}
                // onBlur={handleBlur}
                // name="connections"
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
              {mirror && (
                <>
                  <Form.Label>Mirror Invoice</Form.Label>
                  <div className="invoice-div">
                    <Form.Label>Invoice Type</Form.Label>
                    <Multiselect
                      placeholder="Select Invoice type..."
                      options={invoice_type.options}
                      singleSelect={true}
                      displayValue="type"
                      onRemove={handleMirrorInvoiceTypeMultiSelectChange}
                      onSelect={handleMirrorInvoiceTypeMultiSelectChange}
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      // name="mirror_invoice_type"
                      // className={
                      //   touched.connections && errors.connections
                      //     ? "is-invalid"
                      //     : ""
                      // }
                    />
                    <Form.Label className="mt-2">Contact</Form.Label>
                    <div className="invoice-div mb-2">
                      <Form.Label>Contact Id</Form.Label>
                      <Form.Control
                        placeholder="Enter Contact Id"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="mirror_contact_id"
                      />
                      <Form.Label>Contact Name</Form.Label>
                      <Form.Control
                        placeholder="Enter Contact name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="mirror_contact_name"
                      />
                    </div>
                    <Form.Label>Currency</Form.Label>
                    <Form.Control
                      placeholder="Enter Currency"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="mirror_currency"
                    />
                    <Form.Label>Reference</Form.Label>
                    <Form.Control
                      placeholder="Enter Reference"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="mirror_reference"
                    />
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="mirror_date"
                    />
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                      type="date"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="mirror_due_date"
                    />
                    <Form.Label className="mt-2">Line items</Form.Label>
                    <div className="invoice-div mb-2">
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        placeholder="Enter Quantity"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="mirror_quantity"
                      />
                      <Form.Label>Unit Amount</Form.Label>
                      <Form.Control
                        placeholder="Enter unit amount"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="mirror_unit_amount"
                      />
                      <Form.Label>Descripation</Form.Label>
                      <Form.Control
                        placeholder="Enter descripation"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="mirror_descripation"
                      />
                      <Form.Label>Account Code</Form.Label>
                      <Form.Control
                        placeholder="Enter account code"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="mirror_account_code"
                      />
                      <Form.Label className="mt-2">Tracking</Form.Label>
                      <div className="invoice-div">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          placeholder="Enter tracking name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="mirror_name"
                        />
                        <Form.Label>Option</Form.Label>
                        <Form.Control
                          placeholder="Enter tracking option"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="mirror_option"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              <hr />
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
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
