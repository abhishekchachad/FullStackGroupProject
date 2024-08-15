const User = require("../models/user");

module.exports = async (req, res) => {
  try {
    const passedUsers = await User.find({ isPassed: true });
    const failedUsers = await User.find({ isPassed: false });
    res.json({ passedUsers, failedUsers });
  } catch (error) {
     console.error(error);
    res.status(500).send("Server Error");
  }
};
