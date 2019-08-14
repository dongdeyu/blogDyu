let express = require('express');
let router  = express.Router();

router.get("/user", function (req,res,next){
    res.send("User");
})

module.exports = router;
