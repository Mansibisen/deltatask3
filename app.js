var express=require("express"); 
var bodyParser=require("body-parser"); 

const mongoose = require('mongoose'); 

mongoose.set('useNewUrlParser', true); 
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true); 
mongoose.set('useUnifiedTopology', true);  
mongoose.connect('mongodb://localhost:27017/trytry'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
	console.log("connection succeeded"); 
}) 

var app=express() 
app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
	extended: true
}));
app.set('view engine','ejs');
//for signup
app.get('/sign_up',function(req,res){
    res.redirect("signup.html")

})
app.post('/sign_up', function(req,res){ 
	var name = req.body.name; 
	var email =req.body.email; 
	var pass = req.body.password; 
	var phone =req.body.phone; 

	var data = { 
		"name": name, 
		"email":email, 
		"password":pass, 
		"phone":phone 
	} 
db.collection('details').insertOne(data,function(err, collection){ 
		if (err) throw err; 
		console.log("Record inserted Successfully"); 
			
	}); 
		
	return res.redirect('signup_success.html'); 
}) 
//for log in
app.get('/log_in',function(req,res){
    res.redirect("login.html")

})
var names ={value :0}
app.post('/log_in',function(req,res){
	names.value = req.body.name;
	var name = names.value
    var password = req.body.password; 
    db.collection('details').findOne({"name":name,"password":password},{projection:{"name":1,"password":1}},function(err,collection){
        if (err) throw err;
        console.log("logged in Successfully"); 
        return res.redirect('signup_success.html');
    });

})
app.post('/logout',function(req,res){
	
	console.log('logged out successfully')
	res.redirect("/"); 

})
var counter ={num:0};
 var store = {sender : ""}
app.post('/send',function(req,res){
	
	
	var uname = req.body.username;
	var invdata = req.body.invdata ;
	store.sender = names.value ;
	var myquery = { "name" : uname}
	var newvalue = { $set: {"invitation":invdata } }
	
	db.collection('details').updateOne(myquery,newvalue,function(err,data){
		if(err) throw err ;
		console.log('invitation sent');
		counter.num ++
		return res.redirect('signup_success.html');
	
	})
	
	
})

app.post('/check2',function(req,res){
	var number = counter.num
	res.render('number',{data2:number})
	
})
app.post('/check',function(req,res){
	var myname = store.sender;
	
	
	db.collection('details').find({"name":myname}, {projection :{_id:0,invitation:1}}).toArray(function(err,result){
		var data = {value:JSON.stringify(result),sendfrom:myname}
		if (err) throw err ;
		res.render('home',{data:data})
	})

})

app.post('/accepted',function(req,res){
	
	return res.redirect('signup_success.html');
	
})
app.post('/check3',function(req,res){
    var data3 ={usname:names.value,fromone:store.sender}
	res.render('accinvi',{data3:data3})
	

})

app.get('/',function(req,res){ 
    
res.set({ 
	'Access-control-Allow-Origin': '*'
	}); 
return res.redirect("index.html"); 
})
app.listen(4000) 


console.log("server listening at port 4000"); 
