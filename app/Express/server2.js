var express = require("express"),
	http = require("http"),
	redis = require("redis"),
	app = express(),
	outcome = "",
	newUrl,
	link,
	genUrl,
	redirect,
	testUrl,
	data,
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

    client.keys("shorturls:*", function (err, reply) {
    	var keys = Object.keys(reply);

    	keys.forEach(function(l){
    		client.hget(reply[l], function (err,obj){
    			data = reply[l];
    			//console.log(data);
    			list = list + data + ",";
    		});
    	});

    	setTimeout(function(){
    		list = list + "}";
    		list.replace("/shorturls:/g","");
    		res.json(list);	
    		//list = "{";
    	},5000);  	

    	setTimeout(function(){
			console.log(list);
    	},7000);
		
    });
});

app.get("/:urlLink", function (req, res) {
	//need to also increment the view, client.incr(shorturl)
	link = req.params.urlLink;

	client.hget("shorturls:"+link,"longurl", function(err,obj) {
		if (obj != null)
		{
			client.hincrby("views:"+link,"views",1);
			client.hget("views:"+link,"views", function(err,obj) {
    			console.dir("the views are: "+obj);
    		});
			redirect = obj;
			
			//redirect to the external URL
			res.writeHead(301,{Location: 'http://'+redirect});
			res.end();
		} else {
			res.writeHead(404,
				{"Content-Type": "text/plain"});
			res.write("404 Not Found\n");
			res.end();
		}
    });
});

app.post("/:url", function (req, res) {
	newUrl = req.params.url;
	newUrl = newUrl.replace("-slashie-","/");
	newUrl = newUrl.replace("localhost:3000/","");

	processURL();
	//once done, return the JSON object back to the page
	setTimeout(function(){
		res.json(myJson);
	},1000);
});

//create a client to connect to redis
client = redis.createClient();


function processURL() {
	genUrl = (Math.floor(Math.random() * 9) + 0)+""+(Math.floor(Math.random() * 9) + 0)+""+(Math.floor(Math.random() * 9) + 0)+""+(Math.floor(Math.random() * 9) + 0)+""+(Math.floor(Math.random() * 9) + 0);
    
	//check to see if the entered URL already exists in the DB
	client.hget("longurls:"+newUrl,"shorturl", function(err,obj) {
    	if (obj === null) {
    		//then check to see if it's a short url that was entered
    		client.hget("shorturls:"+newUrl,"longurl", function(err,obj) {
    			if (obj === null) {
    				//create the records

					//with shorturl key
    				client.hset("shorturls:"+genUrl,"longurl",newUrl);
    				client.hset("views:"+genUrl,"views",0);

    				//with longurl key
    				client.hset("longurls:"+newUrl,"shorturl",genUrl);

    				//return the JSON object
    				testUrl = genUrl;
    				setTimeout(function(){
    					myJson = '{"shortURL": "http://localhost:3000/'+testUrl+'"}';
					},500);
    			} else {
    				//return the JSON object
					testUrl = obj;
					setTimeout(function(){
    					myJson = '{"shortURL": "http://'+testUrl+'"}';
					},500);
    			}
    		});
    	} else {
    		//return the JSON object
			testUrl = obj;
			setTimeout(function(){
    			myJson = '{"shortURL": "http://localhost:3000/'+testUrl+'"}';
			},500);
    	}
    });


    
	//////everything below this is for testing and reference
    
    //gets the long URL based on short URL
    client.hget("shorturls:"+genUrl,"longurl", function(err,obj) {
    	console.dir(obj);
    });

    //gets the views based on short URL
    client.hget("views:86073","views", function(err,obj) {
    	console.dir(obj);
    });

        
    //gets the short URL based on long URL
    client.hget("longurls:"+newUrl,"shorturl", function(err,obj) {
    	testUrl = obj;
    	console.dir(obj);
    });

	



};
