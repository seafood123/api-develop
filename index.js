var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override"); 

mongoose.set('useNewUrlParser',true);
mongoose.set('useFindAndModify',true);
mongoose.set('useCreateIndex',true);
mongoose.set('useUnifiedTopology',true);
mongoose.connect(process.env.MONGO_PATH);
var db = mongoose.connection;

// DB Schema
var contactSchema = mongoose.Schema({
    name : {type:String , required:true, unique:true},
    email: {type:String},
    phone: {type:String}
});
var Contact = mongoose.model('contact',contactSchema);

// DB Setting
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
// Home 

app.get("/",function(req,res){
    res.redirect("/contacts");
})
app.get("/contacts",function(req,res){
    Contact.find({},function(err,contacts){
        if(err) return res.json(err);
        res.render('contacts/index',{contacts:contacts});
    });
});

// Contacts - New
app.get('/contacts/new',function(req,res){
    res.render('contacts/new');
})
// Contacts - Create
app.post('/contacts',function(req,res){
    Contact.create(req.body,function(err,contact){
        if(err) return res.json(err);
        res.redirect('/contacts');
    })
})

// Contacts - show
app.get("/contacts/:id",function(req,res){
    Contact.findOne({_id:req.params.id},function(err,contact){
        if(err) return res.json(err);
        res.render('contacts/show',{contact:contact});
    });
});

// Contact - edit
app.get("/contacts/:id/edit",function(req,res){
    Contact.findOne({_id:req.params.id},function(err,contact){
        if(err) return req.json(err);
        res.render('contacts/edit',{contact:contact});
    });
});

// Contact - update
app.put('/contacts/:id',function(req,res){
    Contact.findOneAndUpdate({_id:req.params.id},req.body,function(err,contact){
        if(err) return req.json(err);
        res.redirect("/contacts/"+req.params.id);
    });
});

// Contacts - destroy
app.delete('/contacts/:id',function(req,res){
    Contact.deleteOne({_id:req.params.id},function(err){
        if(err) return req.json(err);
        res.redirect("/contacts");
    })
    
})

// Port Setting
var port = 3000;
app.listen(port,function(){
    console.log("connect server on! https://localhost:"+port);
});