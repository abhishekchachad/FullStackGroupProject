const Users = require("../models/user");

module.exports = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        res.json(user);
    } catch (error) {
        //handle error
        console.log(error);
        console.error(error);
        res.status(500).json({
            error: 'Failed to fetch user'
        });
    }
}