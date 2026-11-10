const express = require('express');
const pool = require('../Database/pool');
const result = require('../utils/result');
const { auth, requireAdmin } = require('../utils/auth');
const { NOT_EXPIRED, courseFromParams } = require('../utils/courseGuard');

const router = express.Router();

// PUBLIC — anyone can see active courses, no login needed
router.get('/all-active-courses', (req, res) => {
  const sql = `SELECT * FROM COURSES WHERE END_DATE >= CURDATE()`;

  pool.query(sql, (error, data) => {
    if (error) return res.send(result.createResult(error));
    res.send(result.createResult(null, data));
  });
});

// ADMIN ONLY — see all courses that are not expired
router.get('/all-courses', auth, requireAdmin, (req, res) => {
  const sql = `SELECT C.* FROM COURSES C WHERE ${NOT_EXPIRED}`;

  pool.query(sql, (error, data) => {
    if (error) return res.send(result.createResult(error));
    res.send(result.createResult(null, data));
  });
});

// ADMIN ONLY — add a new course
router.post('/add', auth, requireAdmin, (req, res) => {
  const { courseName, description, fees, startDate, endDate, videoExpireDays } = req.body;

  const sql = `INSERT INTO COURSES (COURSE_NAME, DESCRIPTION, FEES, START_DATE, END_DATE, VIDEO_EXPIRE_DAYS) 
               VALUES (?, ?, ?, ?, ?, ?)`;

  pool.query(sql, [courseName, description, fees, startDate, endDate, videoExpireDays], (error, data) => {
    if (error) return res.send(result.createResult(error));
    res.send(result.createResult(null, { message: "Course added successfully" }));
  });
});

// ADMIN ONLY — update a course
router.put('/update/:courseId', auth, requireAdmin, courseFromParams, (req, res) => {
  const { courseId } = req.params;
  const { courseName, description, fees, startDate, endDate, videoExpireDays } = req.body;

  const sql = `UPDATE COURSES SET COURSE_NAME=?, DESCRIPTION=?, FEES=?, START_DATE=?, END_DATE=?, VIDEO_EXPIRE_DAYS=? 
               WHERE COURSE_ID=?`;

  pool.query(sql, [courseName, description, fees, startDate, endDate, videoExpireDays, courseId], (error, data) => {
    if (error) return res.send(result.createResult(error));
    res.send(result.createResult(null, { message: "Course updated successfully" }));
  });
});

// ADMIN ONLY — delete a course
router.delete('/delete/:courseId', auth, requireAdmin, courseFromParams, (req, res) => {
  const { courseId } = req.params;

  const sql = `DELETE FROM COURSES WHERE COURSE_ID=?`;

  pool.query(sql, [courseId], (error, data) => {
    if (error) return res.send(result.createResult(error));
    res.send(result.createResult(null, { message: "Course deleted successfully" }));
  });
});

module.exports = router;