const pool = require("../Database/pool");
const result = require("./result");

// A course is "expired" once today is later than END_DATE + VIDEO_EXPIRE_DAYS.
// Use this inside any query where the COURSES table is named C.
const NOT_EXPIRED = `CURDATE() <= DATE_ADD(C.END_DATE, INTERVAL C.VIDEO_EXPIRE_DAYS DAY)`;

// Lets the request continue only if the course exists and is NOT expired
function checkCourse(courseId, res, next) {
  const sql = `SELECT C.COURSE_ID FROM COURSES C WHERE C.COURSE_ID = ? AND ${NOT_EXPIRED}`;

  pool.query(sql, [courseId], (error, data) => {
    if (error) return res.send(result.createResult(error));
    if (data.length === 0)
      return res.send(result.createResult("Course not found or has expired"));
    next();
  });
}

// courseId comes from the URL, e.g. /course/update/:courseId
const courseFromParams = (req, res, next) =>
  checkCourse(req.params.courseId, res, next);

// courseId comes from the request body, e.g. POST /video/add
const courseFromBody = (req, res, next) =>
  checkCourse(req.body.courseId, res, next);

// For /video/update/:videoId and /video/delete/:videoId
const videoNotExpired = (req, res, next) => {
  const sql = `
    SELECT V.VIDEO_ID
    FROM VIDEOS V
    JOIN COURSES C ON V.COURSE_ID = C.COURSE_ID
    WHERE V.VIDEO_ID = ? AND ${NOT_EXPIRED}
  `;

  pool.query(sql, [req.params.videoId], (error, data) => {
    if (error) return res.send(result.createResult(error));
    if (data.length === 0)
      return res.send(result.createResult("Video not found or its course has expired"));
    next();
  });
};

module.exports = { NOT_EXPIRED, courseFromParams, courseFromBody, videoNotExpired };