const {
  updateUnit,
  createOauth,
  getUnits,
  getOwnerByUnitId,
  getUnitsbyId,
  getListings,
  getListingsById,
  updateListing,
  getOwners,
  getOwnersById,
  updateOwner,
  getTeam,
  getTeammateById,
  updateTeammate,
  checkSignup,
  getCalendar,
  updateCalendar,
  getReservationsByUnit,
  getReservationsDetail,
  midnightSchedule,
  staticData,
  getConnections,
  getThread,
  getThreadById,
  addMessages,
} = require("./mgmt-functions");

const {
  connect,
  callback,
  uploadAmazonBills,
  uploadCleaningBills,
  getCleaningSheetById,
  uploadHoursBills,
  getHoursSheetById,
  getAllXeroContacts,
  refreshXeroConnection,
  createBillableExpenseInvoice,
  templatingTest,
  executeAccountingRule
} = require("./acct-functions");
//const format = require("./format-functions");

exports.connect = connect;
exports.callback = callback;
exports.uploadAmazonBills = uploadAmazonBills;
exports.uploadCleaningBills = uploadCleaningBills;
exports.getCleaningSheetById = getCleaningSheetById;
exports.uploadHoursBills = uploadHoursBills;
exports.getHoursSheetById = getHoursSheetById;
exports.getAllXeroContacts = getAllXeroContacts;
exports.refreshXeroConnection = refreshXeroConnection;
exports.createBillableExpenseInvoice = createBillableExpenseInvoice;
exports.templatingTest = templatingTest;
exports.executeAccountingRule = executeAccountingRule

exports.updateUnit = updateUnit;
exports.createOauth = createOauth;
exports.getUnits = getUnits;
exports.getOwnerByUnitId = getOwnerByUnitId;
exports.getUnitsbyId = getUnitsbyId;
exports.getListings = getListings;
exports.getListingsById = getListingsById;
exports.updateListing = updateListing;
exports.getOwners = getOwners;
exports.getOwnersById = getOwnersById;
exports.updateOwner = updateOwner;
exports.getTeam = getTeam;
exports.getTeammateById = getTeammateById;
exports.updateTeammate = updateTeammate;
exports.checkSignup = checkSignup;
exports.getCalendar = getCalendar;
exports.updateCalendar = updateCalendar;
exports.getReservationsByUnit = getReservationsByUnit;
exports.getReservationsDetail = getReservationsDetail;
exports.midnightSchedule = midnightSchedule;
exports.staticData = staticData;
exports.getConnections = getConnections;
exports.getThread = getThread;
exports.getThreadById = getThreadById;
exports.addMessages = addMessages;
