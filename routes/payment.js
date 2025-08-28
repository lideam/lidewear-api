const express = require("express");
const router = express.Router();

// ✅ Chapa return_url → Redirect back to Flutter app
router.get("/success", (req, res) => {
  const { orderId, tx_ref } = req.query;

  // Redirect back to your Flutter app via deep link
  res.send(`
    <html>
      <head>
        <meta http-equiv="refresh" content="0; url=myapp://success?orderId=${orderId}&tx_ref=${tx_ref}" />
      </head>
      <body>
        <h2>Redirecting to the app...</h2>
        <p>If you are not redirected automatically, 
        <a href="myapp://success?orderId=${orderId}&tx_ref=${tx_ref}">click here</a>.</p>
      </body>
    </html>
  `);
});

module.exports = router;
