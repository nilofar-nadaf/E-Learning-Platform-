const express = require('express');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');

const pool = require('../Database/pool');
const result = require('../utils/result');
const config = require('../utils/config');

const router = express.Router();

router.post('/login', (req, res) => {

    const { email, password } = req.body;

    const hashedPassword =
        cryptojs.SHA256(password).toString();

    const sql = `
        SELECT EMAIL, ROLE
        FROM USERS
        WHERE EMAIL = ? AND PASSWORD = ?
    `;

    pool.query(
        sql,
        [email, hashedPassword],
        (error, data) => {

            if (error) {
                return res.send(
                    result.createResult(error)
                );
            }

            if (data.length === 0) {
                return res.send(
                    result.createResult(
                        "Invalid email or password"
                    )
                );
            }

            const user = data[0];

            const payload = {
                email: user.EMAIL,
                role: user.ROLE
            };

            const token = jwt.sign(
                payload,
                config.SECRET
            );

            const userData = {
                email: user.EMAIL,
                role: user.ROLE,
                token: token
            };

            return res.send(
                result.createResult(error, userData)
            );
        }
    );
});

module.exports = router;