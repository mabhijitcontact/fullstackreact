const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");

//adding user Models
const User = require("../../models/User");

/* 
    @route      GET api/users
    @desc       Register user
    @access     Public
*/
router.post("/", [
    check('name', "Name is required!").not().isEmpty(),
    check('email', 'Please include a valid email!').isEmail(),
    check('password', 'Please enter a password with 6 or more charecters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { name, email, password } = req.body;
    try {
        //see if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        // get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        // encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        // Return json token

        console.log(req.body);
        res.send("User Saved");
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

});

module.exports = router;