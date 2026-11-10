const express = require('express');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');

const pool = require('../Database/pool');
const result = require('../utils/result');
const config = require('../utils/config');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send(result.createResult("Email and password are required"));
  }

  const DEFAULT_PASSWORD = "welcome@123";
  const hashedPassword = cryptojs.SHA256(password).toString();
  const defaultHashed = cryptojs.SHA256(DEFAULT_PASSWORD).toString();

  const findSql = `SELECT EMAIL, ROLE, PASSWORD FROM USERS WHERE EMAIL = ?`;

  pool.query(findSql, [email], (error, data) => {
    if (error) return res.send(result.createResult(error));

    if (data.length === 0) {
      // No account yet — only auto-create if they typed the known default password
      if (password !== DEFAULT_PASSWORD) {
        return res.send(result.createResult("Invalid email or password"));
      }

      const insertSql = `INSERT INTO USERS (EMAIL, PASSWORD, ROLE) VALUES (?, ?, 'STUDENT')`;

      pool.query(insertSql, [email, defaultHashed], (insertError) => {
        if (insertError) return res.send(result.createResult(insertError));

        const payload = { email, role: "STUDENT" };
        const token = jwt.sign(payload, config.SECRET);

        res.send(result.createResult(null, {
          email,
          role: "STUDENT",
          token,
          isDefaultPassword: true,
        }));
      });

    } else {
      const user = data[0];

      if (user.PASSWORD !== hashedPassword) {
        return res.send(result.createResult("Invalid email or password"));
      }

      const payload = { email: user.EMAIL, role: user.ROLE };
      const token = jwt.sign(payload, config.SECRET);

      res.send(result.createResult(null, {
        email: user.EMAIL,
        role: user.ROLE,
        token,
        isDefaultPassword: user.PASSWORD === defaultHashed,
      }));
    }
  });
});

module.exports = router;