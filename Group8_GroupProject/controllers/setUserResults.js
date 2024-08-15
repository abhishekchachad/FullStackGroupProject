const Users = require("../models/user");
module.exports = async (req, res) => {
  try {
    let body = req.body;

    const id = body.userId;

    //edit the car details of user based on userID
    const updatedUser = await Users.findByIdAndUpdate(
      id,
      {
        Comments: body.comment,
        isPassed: body.passed,
      },
      { new: true } // This option returns the updated document
    );

    const users = await Users.find({ appointmentId: { $exists: true } }).populate('appointmentId') ?? [];

    res.render("examiner", { users });
  } catch (error) {
    //handle error
    console.log(error);
  }
};
