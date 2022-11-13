const Model = require("./model");

const router = require("express").Router();


router.post("/sendEmail", (req, res) => {
  const { subject, body, to = [], cc = [], bcc = [] } = req.body;
  const authInstance = new Model(req.user);

  return authInstance
    ._send_email({
      subject,
      body,
      to,
      cc,
      bcc
    })
    .then((employees) => {
      console.log(employees);
      return res.json(employees);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Failed to send email" });
    });
});


// router.post("/createemployee",(req,res))



module.exports = router;
