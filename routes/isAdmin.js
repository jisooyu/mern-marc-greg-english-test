const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');

router.get(
    '/', auth, async (req, res) => {
        try {
            const student = await Student.findById(req.student.id).select('-password');ß
            res.json(student);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

module.exports = router;