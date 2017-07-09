var express = require('express');
var bodyparser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var shortUrl = require('./models/shortUrl');

var app = express();
app.use(bodyparser.json());
app.use(cors());

app.use(express.static(__dirname + "/public"));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shortUrls');

app.get('/new/:urltoshorten(*)', function(req,res,next){    
    //to check for correct url input with or without the http protocol
    var testUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
    
    if(!testUrl.test(req.params.urltoshorten)){
        res.end("Invalid Url entered");
    } else {

        var data = new shortUrl({
            originalURL: req.params.urltoshorten,
            shorterURL:  Math.floor(Math.random() * 10000).toString() 
        });

        data.save(function(err){
            if(err){
                console.log("Problem saving");
            }
        });
        res.writeHead(200);   
        res.end(JSON.stringify(data, null, 4));
    }
});

app.get('/showUrls', function(req, res){

    shortUrl.find({})
        .exec(function(err, urls){

            if (err) {
                console.log("Error getting stuff");
            } else {
                res.writeHead(200);
                res.end(JSON.stringify(urls, null, 4));
            }
        });
});

app.get('/go/:short(*)', function(req,res,next){

    shortUrl.findOne({"shorterURL": req.params.short.toString()})
        .exec(function(err, data){

        if(err){
            res.writeHead(404);
            res.end("404 couldn't find data");
        } else {

            if(/^http$|^https/.test(data.originalURL)){
                var url = data.originalURL;
            } else {
                var url = "http://" + data.originalURL;
            }
            
            res.writeHead(301, {Location: url});
            res.end();
        }

    });
});

app.listen(3000, function(){
    console.log('connected');
});