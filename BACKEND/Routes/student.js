const express = require('express');
const pool = require('../Database/pool');
const result = require('../utils/result');
const { auth } = require('../utils/auth');
const { NOT_EXPIRED, courseFromBody } = require('../utils/courseGuard');

const router = express.Router();
const cryptojs = require('crypto-js');   // add this import at the top

// STUDENT — change own password
router.put('/change-password', auth, (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const email = req.user.email;   // from the token — student can only change their OWN password

  if (!newPassword || !confirmPassword) {
    return res.send(result.createResult("Both newPassword and confirmPassword are required"));
  }

  if (newPassword !== confirmPassword) {
    return res.send(result.createResult("Passwords do not match"));
  }

  const hashedPassword = cryptojs.SHA256(newPassword).toString();

  const sql = `UPDATE USERS SET PASSWORD = ? WHERE EMAIL = ?`;

  pool.query(sql, [hashedPassword, email], (error, data) => {
    if (error) return res.send(result.createResult(error));
    res.send(result.createResult(null, { message: "Password changed successfully" }));
  });
});
// STUDENT — register (logged-in student enrolls into a course)
router.post('/register-to-course', auth, courseFromBody, (req, res) => {
  const { courseId, name, mobileNo } = req.body;
  const email = req.user.email;   // comes from the token, NOT the request body — can't be faked

  const sql = `INSERT INTO STUDENTS (NAME, EMAIL, COURSE_ID, MOBILE_NO) VALUES (?, ?, ?, ?)`;

  pool.query(sql, [name, email, courseId, mobileNo], (error, data) => {
    if (error) return res.send(result.createResult(error));
    res.send(result.createResult(null, { message: "Registered successfully" }));
  });
});

// STUDENT — get all courses I'm registered in
router.get('/my-courses', auth, (req, res) => {
  const email = req.user.email;

  const sql = `
    SELECT C.COURSE_ID, C.COURSE_NAME, C.DESCRIPTION, C.START_DATE, C.END_DATE
    FROM STUDENTS S
    JOIN COURSES C ON S.COURSE_ID = C.COURSE_ID
    WHERE S.EMAIL = ?
      AND ${NOT_EXPIRED}
  `;

  pool.query(sql, [email], (error, data) => {
    if (error) return res.send(result.createResult(error));
    res.send(result.createResult(null, data));
  });
});

// STUDENT — get my registered courses WITH valid (non-expired) videos
router.get('/my-course-with-videos', auth, (req, res) => {
  const email = req.user.email;

  const sql = `
    SELECT S.COURSE_ID, C.COURSE_NAME, C.START_DATE, C.END_DATE, C.VIDEO_EXPIRE_DAYS,
           V.VIDEO_ID, V.TITLE, V.YOUTUBE_URL, V.DESCRIPTION, V.ADDED_AT
    FROM STUDENTS S
    JOIN COURSES C ON S.COURSE_ID = C.COURSE_ID
    LEFT JOIN VIDEOS V ON V.COURSE_ID = C.COURSE_ID
    WHERE S.EMAIL = ?
      AND ${NOT_EXPIRED}
  `;

  pool.query(sql, [email], (error, data) => {
    if (error) return res.send(result.createResult(error));
    res.send(result.createResult(null, data));
  });
});

// STUDENT — get a single video, but only if it's within the student's valid access window
router.get('/video/:videoId', auth, (req, res) => {
  const { videoId } = req.params;
  const email = req.user.email;

  const sql = `
    SELECT V.VIDEO_ID, V.TITLE, V.DESCRIPTION, V.YOUTUBE_URL, V.ADDED_AT
    FROM STUDENTS S
    JOIN COURSES C ON S.COURSE_ID = C.COURSE_ID
    JOIN VIDEOS V ON V.COURSE_ID = C.COURSE_ID
    WHERE S.EMAIL = ?
      AND V.VIDEO_ID = ?
      AND ${NOT_EXPIRED}
  `;

  pool.query(sql, [email, videoId], (error, data) => {
    if (error) return res.send(result.createResult(error));

    if (data.length === 0) {
      return res.send(result.createResult("Video not found or access has expired"));
    }

    res.send(result.createResult(null, data[0]));
  });
});

// STUDENT — get my own profile details
router.get('/profile', auth, (req, res) => {
  const email = req.user.email;

  const sql = `
    SELECT NAME, EMAIL, MOBILE_NO 
    FROM STUDENTS 
    WHERE EMAIL = ? 
    ORDER BY REG_NO DESC 
    LIMIT 1
  `;

  pool.query(sql, [email], (error, data) => {
    if (error) return res.send(result.createResult(error));

    if (data.length === 0) {
      // Student hasn't registered for any course yet
      return res.send(result.createResult(null, { EMAIL: email, NAME: null, MOBILE_NO: null }));
    }

    res.send(result.createResult(null, data[0]));
  });
});

module.exports = router;