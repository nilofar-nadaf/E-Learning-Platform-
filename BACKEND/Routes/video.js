const express = require('express');
const pool = require('../Database/pool');
const result = require('../utils/result');
const { auth, requireAdmin } = require('../utils/auth');
const { NOT_EXPIRED, courseFromBody, videoNotExpired } = require('../utils/courseGuard');

const router = express.Router();

// ADMIN ONLY — get all videos, optionally filtered by courseId
router.get('/all-videos', auth, requireAdmin, (req, res) => {
  const { courseId } = req.query;

  let sql = `SELECT V.* FROM VIDEOS V JOIN COURSES C ON V.COURSE_ID = C.COURSE_ID WHERE ${NOT_EXPIRED}`;
  const params = [];

  if (courseId) {
    sql += ` AND V.COURSE_ID = ?`;
    params.push(courseId);
  }

  pool.query(sql, params, (error, data) => {
    if (error) return res.send(result.createResult(error));
    res.send(result.createResult(null, data));
  });
});

// ADMIN ONLY — add a video to a course
router.post('/add', auth, requireAdmin, courseFromBody, (req, res) => {
  const { courseId, title, youtubeURL, description } = req.body;

  const sql = `INSERT INTO VIDEOS (COURSE_ID, TITLE, YOUTUBE_URL, DESCRIPTION, ADDED_AT) 
               VALUES (?, ?, ?, ?, CURDATE())`;

  pool.query(sql, [courseId, title, youtubeURL, description], (error, data) => {
    if (error) return res.send(result.createResult(error));
    res.send(result.createResult(null, { message: "Video added successfully" }));
  });
});

// ADMIN ONLY — update a video
router.put('/update/:videoId', auth, requireAdmin, videoNotExpired, courseFromBody, (req, res) => {
  const { videoId } = req.params;
  const { courseId, title, youtubeURL, description } = req.body;

  const sql = `UPDATE VIDEOS SET COURSE_ID=?, TITLE=?, YOUTUBE_URL=?, DESCRIPTION=? WHERE VIDEO_ID=?`;

  pool.query(sql, [courseId, title, youtubeURL, description, videoId], (error, data) => {
    if (error) return res.send(result.createResult(error));
    res.send(result.createResult(null, { message: "Video updated successfully" }));
  });
});

// ADMIN ONLY — delete a video
router.delete('/delete/:videoId', auth, requireAdmin, videoNotExpired, (req, res) => {
  const { videoId } = req.params;

  const sql = `DELETE FROM VIDEOS WHERE VIDEO_ID=?`;

  pool.query(sql, [videoId], (error, data) => {
    if (error) return res.send(result.createResult(error));
    res.send(result.createResult(null, { message: "Video deleted successfully" }));
  });
});

module.exports = router;