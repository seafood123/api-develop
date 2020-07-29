var express = require("express");
var router = express.Router();

// HOME
router.get("/",function(req,res){
    res.redirect("/contacts");
})

module.exports = router;
