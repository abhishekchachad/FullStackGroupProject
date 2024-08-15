const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");
const examresultController = require("../controllers/examResult");
const setUserResultController = require("../controllers/setUserResults");
const examiner = require("../controllers/examiner");
const { isAuthenticated } = require('../middleware/auth');
const getUserDetailsController = require("../controllers/getUserDetails");

router.get("/dashboard", userController.dashboard);
router.get("/g2", userController.g2Page);
router.get("/g", userController.gPage);
router.post("/saveUserData", userController.saveUserData);
router.post("/saveGtestUserData", userController.saveGtestUserData);
router.get('/appointment', isAuthenticated, userController.appointmentPage);
router.post('/add-appointment', isAuthenticated, userController.addAppointment);
router.post('/book-appointment', isAuthenticated, userController.bookAppointment);
router.get('/appointments/:date', isAuthenticated, userController.getBookedTimesForDate);
router.get('/examiner', isAuthenticated, examiner);
router.post('/resultData', examresultController);
router.post('/examResult', isAuthenticated, setUserResultController);
router.get('/users/:id', getUserDetailsController);

module.exports = router;