const express = require("express");
const { model } = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { Logger } = require("log4js");
const { check, validationResult } = require("express-validator/check");
/* 
    @route      GET api/auth
    @desc       Test route
    @access     Public
*/
router.get("/", auth, async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err.message);
        Logger.addLog(err.message);
        res.send(500).send('server error');
    }
});

router.post("/", [
    check('email', 'Please include a valid email!').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { email, password } = req.body;
    try {
        //see if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credential' }] });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credential' }] });
        }
        // Return json token
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get("jwtToken"),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;