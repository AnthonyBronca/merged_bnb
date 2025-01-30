// backend/routes/index.js
const express = require('express');
const router = express.Router();

// ...
// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});
// ...
// backend/routes/api/index.js
// ...

// Keep this route to test frontend setup in Mod 5
router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});


const apiRouter = require('./api');

router.use('/api', apiRouter);

module.exports = router;