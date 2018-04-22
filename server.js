var express = require('express');
var app= express();
var request=require('request');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var socket=require('socket.io');
var alreadyRecorded=0;
var path = require('path');

var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));



//set up MongoDb
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  //create collections
  var dbo = db.db("test");
  dbo.collection("emotions").deleteMany({}, function(err, obj) {
    if (err) throw err;
    console.log("Cleared emotions");
  });
  dbo.collection("eyeContact").deleteMany({}, function(err, obj) {
    if (err) throw err;
    console.log("Cleared eyeContact");
  });
  dbo.collection("positions").deleteMany({}, function(err, obj) {
    if (err) throw err;
    console.log("Cleared positions");
  });
  dbo.collection("words").deleteMany({}, function(err, obj) {
    if (err) throw err;
    console.log("Cleared words");
  });

  var myobj = { question:1, anger: 0, contempt: 0, disgust: 0, fear: 0, happiness: 0, neutral: 0, sadness: 0, surprise: 0};
  dbo.collection("emotions").insertOne({ question:1, anger: 0, contempt: 0, disgust: 0, fear: 0, happiness: 0, neutral: 0, sadness: 0, surprise: 0}, function(err, res) {
  	if (err) throw err;
  		console.log("Inserted initial emotions 1");
  
  });
  myobj.question=2;
  dbo.collection("emotions").insertOne({ question:2, anger: 0, contempt: 0, disgust: 0, fear: 0, happiness: 0, neutral: 0, sadness: 0, surprise: 0}, function(err, res) {
  	if (err) throw err;
  		console.log("Inserted initial emotions 2");
  
  });
  myobj = { question:1, left: 0, right: 0, down: 0, straight: 0};
  dbo.collection("eyeContact").insertOne({ question:1, left: 0, right: 0, down: 0, straight: 0}, function(err, res) {
  	if (err) throw err;
  		console.log("Inserted initial eye contact 1");
  		
  });
  myobj.question=2;
  dbo.collection("eyeContact").insertOne({ question:2, left: 0, right: 0, down: 0, straight: 0}, function(err, res) {
  	if (err) throw err;
  		console.log("Inserted initial eye contact 2");
  });
  db.close();
});


app.get("/voiceRecogFiles", function(req,res){
	console.log("called voice files");
	res.sendFile(path.join(__dirname + '/views/speech.sdk.bundle.js'));
});
app.get('/logo.png', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/logo.png'));
});

app.get("/", function(req,res){
	//res.send("Hey");
	res.render('home.ejs',{number:""});
	alreadyRecorded=0;
	console.log("Home screen called");


	MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  //create collections
  var dbo = db.db("test");
  dbo.collection("emotions").deleteMany({}, function(err, obj) {
    if (err) throw err;
    console.log("Cleared emotions");
  });
  dbo.collection("eyeContact").deleteMany({}, function(err, obj) {
    if (err) throw err;
    console.log("Cleared eyeContact");
  });
  dbo.collection("positions").deleteMany({}, function(err, obj) {
    if (err) throw err;
    console.log("Cleared positions");
  });
  dbo.collection("words").deleteMany({}, function(err, obj) {
    if (err) throw err;
    console.log("Cleared words");
  });

  var myobj = { question:1, anger: 0, contempt: 0, disgust: 0, fear: 0, happiness: 0, neutral: 0, sadness: 0, surprise: 0};
  dbo.collection("emotions").insertOne({ question:1, anger: 0, contempt: 0, disgust: 0, fear: 0, happiness: 0, neutral: 0, sadness: 0, surprise: 0}, function(err, res) {
  	if (err) throw err;
  		console.log("Inserted initial emotions 1");
  
  });
  myobj.question=2;
  dbo.collection("emotions").insertOne({ question:2, anger: 0, contempt: 0, disgust: 0, fear: 0, happiness: 0, neutral: 0, sadness: 0, surprise: 0}, function(err, res) {
  	if (err) throw err;
  		console.log("Inserted initial emotions 2");
  
  });
  myobj = { question:1, left: 0, right: 0, down: 0, straight: 0};
  dbo.collection("eyeContact").insertOne({ question:1, left: 0, right: 0, down: 0, straight: 0}, function(err, res) {
  	if (err) throw err;
  		console.log("Inserted initial eye contact 1");
  		
  });
  myobj.question=2;
  dbo.collection("eyeContact").insertOne({ question:2, left: 0, right: 0, down: 0, straight: 0}, function(err, res) {
  	if (err) throw err;
  		console.log("Inserted initial eye contact 2");
  });
  db.close();
});


});

app.get("/results", function(req,res){
	//res.send("Hey");
	res.render('results.ejs',{number:""});
	console.log("Results screen called");
});

var server= app.listen(3000,function(){
	console.log("Server running on port 3000");
});

var io=socket(server);




io.on('connection', function(socket){
	console.log('made socket connection');

	socket.on('face', function(data){
		alreadyRecorded=1;

		//determine emotion
		var emotions=data.face.faceAttributes.emotion;
		var largest=emotions.anger;
		var emotion="anger";
		
		if (emotions.contempt>largest){
			largest=emotions.contempt;
			emotion="contempt"
		}
		if (emotions.disgust>largest){
			largest=emotions.disgust;
			emotion="disgust";
		}
		if (emotions.fear>largest){
			largest=emotions.fear;
			emotion="fear";
		}
		if (emotions.happiness>largest){
			largest=emotions.happiness;
			emotion="happiness";
		}
		if (emotions.neutral>largest){
			largest=emotions.neutral;
			emotion="neutral";
		}
		if (emotions.sadness>largest){
			largest=emotions.sadness;
			emotion="sadness";
		}
		if (emotions.surprise>largest){
			largest=emotions.surprise;
			emotion="surprise";
		}

		//determine eye contact
		var looking;
		if (data.face.faceAttributes.headPose.yaw<-10)
          looking="left";
        else if(data.face.faceAttributes.headPose.yaw>10)
          looking="right";
        else{
          if ((data.face.faceLandmarks.pupilRight.x-data.face.faceLandmarks.eyeRightInner.x)/(data.face.faceLandmarks.eyeRightOuter.x- data.face.faceLandmarks.eyeRightInner.x)<0.4)
            looking="left";
          else if ((data.face.faceLandmarks.pupilRight.x-data.face.faceLandmarks.eyeRightInner.x)/(data.face.faceLandmarks.eyeRightOuter.x- data.face.faceLandmarks.eyeRightInner.x)>0.6)
            looking="right";
          else if(((data.face.faceLandmarks.eyeRightBottom.y-data.face.faceLandmarks.eyeRightTop.y)/
                   (data.face.faceLandmarks.eyeRightOuter.x-data.face.faceLandmarks.eyeRightInner.x))<0.35){
            looking="down";
          }
          else
            looking="straight";
        }

        //determing position
        var y=data.face.faceRectangle.top+data.face.faceRectangle.width/2;
		var x=data.face.faceRectangle.left+data.face.faceRectangle.width/2;

		var update={
			question:data.question,
			emotion: emotion,
			looking: looking,
			position: {
				x: x,
				y: y,
				width: data.face.faceRectangle.width
			}
		}

		io.sockets.emit('update', update);


		MongoClient.connect(url, function(err, db) {
  			if (err) throw err;
  			var dbo = db.db("test");
  			//update emotions
  			if (emotion=="anger")
  				dbo.collection("emotions").updateOne({question:{$eq:data.question}}, { $inc: { anger: 1} }, function(err, res) {
	    			if (err) throw err;
	    			console.log("anger incremented");
	    			
  				});
  			else if (emotion=="contempt")
  				dbo.collection("emotions").updateOne({question:{$eq:data.question}}, { $inc: { contempt: 1} }, function(err, res) {
	    			if (err) throw err;
	    			console.log("anger incremented");
	    			
  				});
  			else if (emotion=="disgust")
  				dbo.collection("emotions").updateOne({question:{$eq:data.question}}, { $inc: { disgust: 1} }, function(err, res) {
	    			if (err) throw err;
	    			console.log("disgust incremented");
	    			
  				});
  			else if (emotion=="fear")
  				dbo.collection("emotions").updateOne({question:{$eq:data.question}}, { $inc: { fear: 1} }, function(err, res) {
	    			if (err) throw err;
	    			console.log("fear incremented");
	    			
  				});
  			else if (emotion=="happiness")
  				dbo.collection("emotions").updateOne({question:{$eq:data.question}}, { $inc: { happiness: 1} }, function(err, res) {
	    			if (err) throw err;
	    			console.log("happiness incremented");
	    			
  				});
  			else if (emotion=="neutral")
  				dbo.collection("emotions").updateOne({question:{$eq:data.question}}, { $inc: { neutral: 1} }, function(err, res) {
	    			if (err) throw err;
	    			console.log("neutral incremented");
	    			
  				});
  			else if (emotion=="sadness")
  				dbo.collection("emotions").updateOne({question:{$eq:data.question}}, { $inc: { sadness: 1} }, function(err, res) {
	    			if (err) throw err;
	    			console.log("sadness incremented");
	    			
  				});
  			else if (emotion=="surprise")
  				dbo.collection("emotions").updateOne({question:{$eq:data.question}}, { $inc: { surprise: 1} }, function(err, res) {
	    			if (err) throw err;
	    			console.log("surprise incremented");
	    			
  				});
  			//updating eye contact
  			if (looking=="down")
  				dbo.collection("eyeContact").updateOne({question:{$eq:data.question}}, { $inc: { down: 1} }, function(err, res) {
	    			if (err) throw err;
	    			console.log("down incremented");
	    			
  				});
  			else if (looking=="left")
  				dbo.collection("eyeContact").updateOne({question:{$eq:data.question}}, { $inc: { left: 1} }, function(err, res) {
	    			if (err) throw err;
	    			console.log("left incremented");
	    			
  				});
  			else if (looking=="right")
  				dbo.collection("eyeContact").updateOne({question:{$eq:data.question}}, { $inc: { right: 1} }, function(err, res) {
	    			if (err) throw err;
	    			console.log("right incremented");
	    			
  				});
  			else if (looking=="straight")
  				dbo.collection("eyeContact").updateOne({question:{$eq:data.question}}, { $inc: { straight: 1} }, function(err, res) {
	    			if (err) throw err;
	    			console.log("straight incremented");
	    			
  				});

  			//Inserting position
  			dbo.collection("positions").insertOne({x:x, y:y, width:data.face.faceRectangle.width, question:data.question}, function(err, res) {
			    if (err) throw err;
			    console.log("added position");
			    
			  });

  			db.close();

		});

	});

	socket.on('voice', function(data){
		console.log(data);
		var speech= data.voice.DisplayText;
		if (speech!=null){
			var voiceData={
				total:speech.split(" ").length,
				um:speech.split("um").length - 1+speech.split("Um").length - 1,
				like:speech.split("like").length - 1+speech.split("Like").length - 1,
				youKnow:speech.split("you know").length - 1+speech.split("You know").length - 1,
				duration:data.voice.Duration,
				question:data.question
			};

			io.sockets.emit('voiceUpdate', voiceData);

			MongoClient.connect(url, function(err, db) {
				var dbo = db.db("test");
				dbo.collection("words").insertOne(voiceData, function(err, res) {
					if (err) throw err;
					console.log("added words");	    
				});
				db.close();
			});
		}
	});





	socket.on('resultsLoad',function(){
		console.log("resultsLoad called");
		if (alreadyRecorded==1){
			var loadData={
				emotions: {
					anger : 0, 
					contempt : 0,
					disgust : 0, 
					fear : 0, 
					happiness : 0, 
					neutral : 0, 
					sadness : 0, 
					surprise :0
				},
				eyeContact: {
					left:0,
					right:0,
					down:0,
					straight:0
				},
				positions: [],
				words:[]
			};


			MongoClient.connect(url, function(err, db) {
	  			if (err) throw err;
	  			var dbo = db.db("test");
	  			dbo.collection("emotions").findOne({question : 1},function(err, result) {
			    	if (err) throw err;
			    	loadData.emotions.anger=result.anger;
			    	loadData.emotions.contempt=result.contempt;
			    	loadData.emotions.disgust=result.disgust;
			    	loadData.emotions.fear=result.fear;
			    	loadData.emotions.happiness=result.happiness;
			    	loadData.emotions.neutral=result.neutral;
			    	loadData.emotions.sadness=result.sadness;
			    	loadData.emotions.surprise=result.surprise;



			    	dbo.collection("eyeContact").findOne({question : 1},function(err, result) {
				    	if (err) throw err;
				    	loadData.eyeContact.left=result.left;
				    	loadData.eyeContact.right=result.right;
				    	loadData.eyeContact.down=result.down;
				    	loadData.eyeContact.straight=result.straight;


				    	dbo.collection("positions").find({question : 1}).toArray(function(err, result) {
		    				if (err) throw err;
		    				console.log("Reached pos");
		    				
		    				for (var i=0; i<result.length; i++){
		    					loadData.positions.push(result[i]);
		    				}

		    				dbo.collection("words").find({question : 1}).toArray(function(err, result) {
			    				if (err) throw err;
			    				console.log("Reached words");
			    				loadData.words=result;
			    				io.sockets.emit('loadData', loadData);
			    			});

		    			});

				    	
	  				});



  				});


			});

			var loadData2={
				emotions: {
					anger : 0, 
					contempt : 0,
					disgust : 0, 
					fear : 0, 
					happiness : 0, 
					neutral : 0, 
					sadness : 0, 
					surprise :0
				},
				eyeContact: {
					left:0,
					right:0,
					down:0,
					straight:0
				},
				positions: [],
				words:[]
			};

			MongoClient.connect(url, function(err, db) {
	  			if (err) throw err;
	  			var dbo = db.db("test");
	  			dbo.collection("emotions").findOne({question : 2},function(err, result) {
			    	if (err) throw err;
			    	loadData2.emotions.anger=result.anger;
			    	loadData2.emotions.contempt=result.contempt;
			    	loadData2.emotions.disgust=result.disgust;
			    	loadData2.emotions.fear=result.fear;
			    	loadData2.emotions.happiness=result.happiness;
			    	loadData2.emotions.neutral=result.neutral;
			    	loadData2.emotions.sadness=result.sadness;
			    	loadData2.emotions.surprise=result.surprise;



			    	dbo.collection("eyeContact").findOne({question : 2},function(err, result) {
				    	if (err) throw err;
				    	loadData2.eyeContact.left=result.left;
				    	loadData2.eyeContact.right=result.right;
				    	loadData2.eyeContact.down=result.down;
				    	loadData2.eyeContact.straight=result.straight;


				    	dbo.collection("positions").find({question : 2}).toArray(function(err, result) {
		    				if (err) throw err;
		    				console.log("Reached pos");
		    				
		    				for (var i=0; i<result.length; i++){
		    					loadData2.positions.push(result[i]);
		    				}

		    				dbo.collection("words").find({question : 2}).toArray(function(err, result) {
			    				if (err) throw err;
			    				console.log(result);
			    				loadData2.words=result;
			    				io.sockets.emit('loadData2', loadData2);
			    			});

		    			});

				    	
	  				});



  				});


			});

			
		}
		

	});

});




