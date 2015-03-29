var express = require("express"),
	http = require("http"),
	redis = require("redis"),
	app = express(),
	outcome = "",
	newUrl,
	link,
	genUrl,
	redirect,
	myJson = '{}';

app.use(express.static(__dirname + "/client"));

http.createServer(app).listen(3000);

app.get("/results.json", function (req, res) {
	res.json(myJson);
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
	res.json(myJson);
});

//create a client to connect to redis
client = redis.createClient();

function processURL() {
	//check to see if it's a short URL in the DB
	//if so, return long URL
	//if not, add as a long URL and generate new short URL
	//then return the generated short URL

	//we will assume a new long URL is entered
	//genUrl = "12345";
	genUrl = (Math.floor(Math.random() * 9) + 0)+""+(Math.floor(Math.random() * 9) + 0)+""+(Math.floor(Math.random() * 9) + 0)+""+(Math.floor(Math.random() * 9) + 0)+""+(Math.floor(Math.random() * 9) + 0);
    client.set(newUrl,genUrl, function(err, reply) {
  		console.log(reply);
	});
    client.set(genUrl,newUrl, function(err, reply) {
  		console.log(reply);
	});
    
    console.log("Added: "+genUrl+" to "+newUrl);

    client.get("*", function (err, reply) {
    	console.log(reply);
    	//console.log("key"+key);
    	//console.log("keys"+keys);
    	//for (key in keys){
    	//	console.log(key);
    	//}
    });
    
	myJson = '{"shortURL": "http://localhost:3000/' + genUrl + '"}';	
};
