let express = require('express');
let router  = express.Router();

router.get("/", function (req,res,next){
    res.render("main/index");
})
router.get("/views", function (req,res,next){
    res.send("views");
})
module.exports = router;
