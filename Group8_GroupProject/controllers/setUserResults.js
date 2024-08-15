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

    const users = await Users.find({ appointment: { $exists: true } }).populate('appointment') ?? [];
  
    const message = req.session.message;
    res.render("pages/examiner", { title: 'Examiner', message, users });
  
  } catch (error) {
    //handle error
    console.log(error);
  }
};
