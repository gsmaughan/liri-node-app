require("dotenv").config();

var fs = require("fs");

var keys = require("./keys.js");

var Twitter = require("twitter");
var client = new Twitter(keys.twitter);


var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var request = require('request');

var which = process.argv[2];
var input = process.argv[3];

if (which == "my-tweets"){
		tweets();
} //end if

if (which == "spotify-this-song"){
		song();
		
} //end spotify

if (which == "movie-this"){
		movies();
	
} //end movie-this

if (which == "do-what-it-says"){

	fs.readFile("random.txt", "utf8", function(error, data){

		if (error){
			return console.log(error);
		} //end error

		var dataArr = data.split(",");  //make an array from data info, split by the comma

		//run the song() function if the random.txt first entry is 'spotify-this-song'
		if(dataArr[0] == 'spotify-this-song'){
			//make the input the second element in the dataArr array (from the random.txt file)
			input = dataArr[1];
			song();
		}

		//run movies() function if the random.txt first entry is 'movie-this'
		else if(dataArr[0] == 'movie-this'){
			//make the input the second element in the dataArr array (from the random.txt file)
			input = dataArr[1];
			movies();
		}


	});// end .readFile

}//end which

function tweets(){
	client.get('favorites/list', function(error, tweets, response) {

  			if(!error){
  				for (var i = 0; i < tweets.length; i++){
  				var arg1 = tweets[i].text;	
  				var arg2 = tweets[i].created_at;
  				console.log("Tweet: ", arg1, "Date tweeted:  ", arg2);  // The favorites.

  				var arg = (arg1 + arg2);
  				append(arg);
  			}
			}
			else{
				console.log("error");

			}



	}); //end client.get
} //end tweets()

function song(){

	//search "The Sign" by Ace of Base if no song was entered in the console
		if(input === undefined){
			input = "The Sign Ace of Base";
		}

		spotify.search({ type: 'track', query: input }, function(err, data) {
  			if (err) {
    				return console.log('Error occurred: ' + err);
  			}
  			
  			console.log("_______________________________________________");
			console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
			console.log("Song: " + data.tracks.items[0].name);
			console.log("Song preview: " + data.tracks.items[0].preview_url);
			console.log("Album:  " + data.tracks.items[0].album.name);

			var arg = data.tracks.items[0].album.artists[0].name + data.tracks.items[0].name + data.tracks.items[0].preview_url + data.tracks.items[0].album.name; 
			
			append(arg);
		});
} //end song()

function movies(){

	//search for "Mr Nobody" is no movie is entered into the console
	if(input === undefined){
			input = "Mr. Nobody";
		}

	request('http://www.omdbapi.com/?i=tt3896198&apikey=d7a699b0&t=' + input, function (error, response, body) {
  		if(error){
  			console.log('error:', error); // Print the error if one occurred
  		}
  		else{
  			// parse body so that we can use JSON
  			var result = JSON.parse(body);
  			console.log('Title: ', result.Title);
  			console.log('Year: ', result.Year);
  			console.log('IMDB rating: ', result.imdbRating);
  			console.log('Rotten Tomatoes rating: ', result.Ratings[1].Value);
  			console.log('Country: ', result.Country);
  			console.log('Language: ', result.Language);
  			console.log('Plot: ', result.Plot);
  			console.log('Actors: ', result.Actors);

  			var arg = result.Title + result.Year + result.imdbRating + result.Ratings[1].Value + result.Country + result.Language + result.Plot + result.Actors;  
  			append(arg);
  		}
   		 
});	
} //end movies()

function append(arg){

	fs.appendFile("log.txt", arg, function (err){

		if(err){
			console.log(err);
		}

		else{
			console.log("Content added!");
		}

	});

} //end append()