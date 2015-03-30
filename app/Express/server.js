var express = require("express"),
	http = require("http"),
	redis = require("redis"),
	app = express(),
	outcome = "",
	newUrl,
	link,
	genUrl,
	redirect,
	found = 0,
	list = "{",
	myJson = '{}';

app.use(express.static(__dirname + "/client"));

http.createServer(app).listen(3000);

app.get("/results.json", function (req, res) {
	res.json(myJson);
});

app.get("/listdb", function (req, res) {
	//iterating the DB
    client.keys("*", function (err, reply) {
    	for (key in reply) {
    		list = list + key + ":" + "test" + ",";
    	}
    });
    setTimeout(function(){
    	list = list + "}";
		res.json(list);
	},500);
	list = "{";
});

app.get("/:urlLink", function (req, res) {
	link = req.params.urlLink;
	client.get(link, function(err, reply) {
		if (reply != null)
		{
			redirect = reply;
			res.writeHead(301,
				{Location: 'http://'+redirect}
			);
			res.end();
			//res.redirect(redirect);
		}
	});
	//console.log("You entered a link" + link);
});

app.post("/:url", function (req, res) {
	newUrl = req.params.url;
	processURL();
	//once done, return the JSON object back to the page
	setTimeout(function(){
		res.json(myJson);
	},500);
});

//create a client to connect to redis
client = redis.createClient();

function processURL() {
	genUrl = (Math.floor(Math.random() * 9) + 0)+""+(Math.floor(Math.random() * 9) + 0)+""+(Math.floor(Math.random() * 9) + 0)+""+(Math.floor(Math.random() * 9) + 0)+""+(Math.floor(Math.random() * 9) + 0);
    
    //check to see if long url exists in the DB
    client.get(newUrl,function (err,reply) {
    	if (reply === null) {
    		//this is a new long url
    		console.log("new");
    		client.set(newUrl,genUrl, function(err, reply) {
  				console.log(reply);
			});
    		client.set(genUrl,newUrl, function(err, reply) {
  				console.log(reply);
			});
			console.log("Added: "+genUrl+" to "+newUrl);
			myJson = '{"shortURL": "http://localhost:3000/' + genUrl + '"}';
    	} else {
    		//this is an existing URL
    		console.log("existing: " + reply);
    		myJson = '{"shortURL": "http://localhost:3000/' + reply + '"}';
    	}
    });

};
