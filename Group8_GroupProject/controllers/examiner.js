const Users = require("../models/user");

module.exports = async (req, res) => {
  try {
    //getting the users
    let users = [];
    users = await Users.find({ appointment: { $exists: true } }).populate(
      "appointment"
    );
    
    const message = req.session.message;

    res.render("pages/examiner", { title: 'Examiner', message, users });
  } catch (error) {
    console.log(error);
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
