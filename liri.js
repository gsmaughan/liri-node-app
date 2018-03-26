require("dotenv").config();

var keys = require("./keys.js");

var Twitter = require("twitter");
var client = new Twitter(keys.twitter);


var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var request = require('request');

var which = process.argv[2];
var input = process.argv[3];

if (which == "my-tweets"){
		client.get('favorites/list', function(error, tweets, response) {

  			if(!error){
  				for (var i = 0; i < tweets.length; i++){	
  				console.log("Tweet: ", tweets[i].text, "Date tweeted:  ", tweets[i].created_at );  // The favorites.  
  			}
			}else{
				console.log("error");

			}
	}); //end client.get
} //end if

if (which == "spotify-this-song"){
		
		//search "The Sign" by Ace of Base if no song was entered in the console
		if(process.argv[3] === undefined){
			input = "The Sign Ace of Base";
		}

		spotify.search({ type: 'track', query: input }, function(err, data) {
  			if (err) {
    				return console.log('Error occurred: ' + err);
  			}
 			console.log("+++++++++++++++++++++++++++++++++++++");
			console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
			console.log("Song: " + data.tracks.items[0].name);
			console.log("Song link: " + data.tracks.items[0].album.artists[0].external_urls.spotify);
			console.log("Album:  " + data.tracks.items[0].album.name);
			console.log("+++++++++++++++++++++++++++++++++++++");

		});
} //end spotify

if (which == "movie-this"){
	
	//search for "Mr Nobody" is no movie is entered into the console
	if(process.argv[3] === undefined){
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
  		}
   		 
});
	
 

} //end movie-this

