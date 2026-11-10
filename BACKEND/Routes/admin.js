const express = require('express');
const pool = require('../Database/pool');
const result = require('../utils/result');
const { auth, requireAdmin } = require('../utils/auth');
const { NOT_EXPIRED } = require('../utils/courseGuard');

const router = express.Router();

// ADMIN ONLY — get all enrolled students, optionally filtered by courseId
router.get('/enrolled-students', auth, requireAdmin, (req, res) => {
  const { courseId } = req.query;

  let sql = `
    SELECT S.REG_NO, S.NAME, S.EMAIL, S.MOBILE_NO, C.COURSE_NAME
    FROM STUDENTS S
    JOIN COURSES C ON S.COURSE_ID = C.COURSE_ID
    WHERE ${NOT_EXPIRED}
  `;
  const params = [];

  if (courseId) {
    sql += ` AND S.COURSE_ID = ?`;
    params.push(courseId);
  }

  pool.query(sql, params, (error, data) => {
    if (error) return res.send(result.createResult(error));
    res.send(result.createResult(null, data));
  });
});

module.exports = router;