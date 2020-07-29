var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override"); 



// DB Setting
mongoose.set('useNewUrlParser',true);
mongoose.set('useFindAndModify',true);
mongoose.set('useCreateIndex',true);
mongoose.set('useUnifiedTopology',true);
mongoose.connect(process.env.MONGO_PATH);
var db = mongoose.connection;
db.once('open',function(){
    console.log('DB Connected');
});

db.on('error',function(){
    console.log("뭐가 이상한디?");
});

// Other Setting
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

// Routes
app.use("/",require('./routes/home'));
app.use("/contacts",require("./routes/contacts"));

// Port Setting
var port = 3000;
app.listen(port,function(){
    console.log("connect server on! https://localhost:"+port);
});