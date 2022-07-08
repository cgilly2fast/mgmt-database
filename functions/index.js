const {updateUnit,
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
    getReservationsDetail } = require("./mgmt-functions");

const {connect,callback, 
    hawaiiRevenue, 
    separateResAdjs, 
    bookingData, 
    uploadMgmtInvoices, 
    uploadCompanyInvoices,
    uploadAmazonBills,
    uploadCleaningBills,
    getCleaningSheetById,
    uploadHoursBills,
    getHoursSheetById} = require("./acct-functions");
//const format = require("./format-functions");

exports.connect = connect;
exports.callback = callback;
exports.hawaiiRevenue = hawaiiRevenue;
exports.separateResAdjs = separateResAdjs;
exports.bookingData = bookingData;
exports.uploadMgmtInvoices = uploadMgmtInvoices;
exports.uploadCompanyInvoices = uploadCompanyInvoices;
exports.uploadAmazonBills = uploadAmazonBills;
exports.uploadCleaningBills = uploadCleaningBills;
exports.getCleaningSheetById = getCleaningSheetById;
exports.uploadHoursBills = uploadHoursBills;
exports.getHoursSheetById = getHoursSheetById;

<<<<<<< HEAD

exports.updateUnit = updateUnit;
exports.createOauth = createOauth;
exports.getUnits = getUnits;
exports.getOwnerByUnitId = getOwnerByUnitId;
exports.getUnitsbyId = getUnitsbyId;
exports.getListings = getListings;
exports.getListingsById = getListingsById
exports.updateListing = updateListing
exports.getOwners = getOwners
exports.getOwnersById = getOwnersById
exports.updateOwner = updateOwner
exports.getTeam = getTeam;
exports.getTeammateById = getTeammateById
exports.updateTeammate = updateTeammate
exports.checkSignup = checkSignup
exports.getCalendar = getCalendar
exports.updateCalendar = updateCalendar
exports.getReservationsByUnit = getReservationsByUnit
exports.getReservationsDetail = getReservationsDetail
=======
exports.updateUnit = mgmt.updateUnit;
exports.createOauth = mgmt.createOauth;
exports.getUnits = mgmt.getUnits;
exports.getOwnerByUnitId = mgmt.getOwnerByUnitId;
exports.getUnitsbyId = mgmt.getUnitsbyId;
exports.getListings = mgmt.getListings;
exports.getListingsById = mgmt.getListingsById;
exports.updateListing = mgmt.updateListing;
exports.getOwners = mgmt.getOwners;
exports.getOwnersById = mgmt.getOwnersById;
exports.updateOwner = mgmt.updateOwner;
exports.getTeam = mgmt.getTeam;
exports.getTeammateById = mgmt.getTeammateById;
exports.updateTeammate = mgmt.updateTeammate;
exports.checkSignup = mgmt.checkSignup;
exports.getCalendar = mgmt.getCalendar;
exports.updateCalendar = mgmt.updateCalendar;
exports.getReservationsByUnit = mgmt.getReservationsByUnit;
exports.getReservationsDetail = mgmt.getReservationsDetail;
exports.testHospitableWebhook = mgmt.testHospitableWebhook;
exports.getCodeWiseWebhookData = mgmt.getCodeWiseWebhookData;
>>>>>>> ba5b0f10c7e8d0691bbc22881b17372931e0a4d1
//exports.format = format.format;
