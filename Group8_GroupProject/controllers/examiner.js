const Users = require("../models/user");

module.exports = async (req, res) => {
  try {
    //getting the users
    let users = [];
    users = await Users.find({ appointmentId: { $exists: true } }).populate(
      "appointmentId"
    );

    res.render("examiner", { users });
  } catch (error) {
    console.log(error);
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
