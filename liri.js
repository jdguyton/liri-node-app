require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
moment().format();
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
})
var fs = require("fs")



var command = process.argv[2]
var workOfArt = process.argv.slice(3).join(" ");

function whatToDo() {
    if (command === 'do-what-it-says') {
        fs.readFile('./random.txt', 'UTF8', function(err, data) {
            if (err) {
                console.log("I don't know what it says!")
            }
            command = data.substring(0, data.indexOf(","))
            workOfArt = data.substring(data.indexOf(",") + 2, data.length - 1)
            whatToDo();
        })
    }
    
    else if (command === 'concert-this') {
        ConcertThis();
    }
    
    else if (command === 'spotify-this-song') {
        SpotifyThis()
    }
    
    else if (command === 'movie-this') {
        MovieThis();
    }
    
    else {
        console.log("Enter a valid command")
    }
}




//Function for concert-this
function ConcertThis() {
    if (workOfArt == "") {
        console.log("You must include an artist to search.")
    }
    else {
        axios.get("https://rest.bandsintown.com/artists/" + workOfArt + "/events?app_id=codingbootcamp")
        .then(function(response) {
            var results = response.data;
            for (i=0;i<results.length;i++) {
                var venue = results[i].venue.name;
                if (results[i].country === "United States") {
                    var location = results[i].venue.city + ", " + results[i].venue.region
                }
                else {
                    var location = results[i].venue.city + ", " + results[i].venue.country
                }
                var date = moment(results[i].datetime)
                date = date.format("MM/DD/YYYY")
                var output = ("\nVenue: " + venue + "\nLocation: " + location + "\nDate: " + date + "\n---------------------------------");
                console.log(output)
                fs.appendFile('log.txt', output, 'utf8', function(error) {
                    if (error) {
                        console.log("Oops! Couldn't write.")
                    }
                    console.log("Yay! Appended data to file.")
                })
            }
        })
    }

}

//Function for 'spotify-this-song
function SpotifyThis() {
    console.log("SpotifyThis says workOfArt is: ")
    if (workOfArt == "") {
        workOfArt = "The Sign Ace of Base"
    }
    spotify.search({
        type: 'track',
        query: workOfArt
    }, function(err, data) {
        if (err) {
            console.log("Error occurred finding your song")
        }
        var results = data.tracks.items[0]
        var artist = results.artists[0].name;
        var name = results.name;
        var preview = results.preview_url;
        var album = results.album.name;
        var output = ("\nArtist: " + artist + "\nSong Name: " + name + "\nPreview Link: " + preview + "\nAlbum: " + album + "\n---------------------------------");
        console.log(output)
        fs.appendFile('log.txt', output, 'utf8', function(error) {
            if (error) {
                console.log("Oops! Couldn't write.")
            }
            console.log("Yay! Appended data to file.")
        })
    })
}


//Function for movie-this
function MovieThis() {
    if (workOfArt === "") {
        workOfArt = "Mr. Nobody"
    }
    axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + workOfArt)
    .then(function(response) {
        console.log(response.data.Title)
        results = response.data;
        var title = results.Title;
        var year = results.Year;
        ratingsArr = results.Ratings
        var IMDB = ratingsArr.filter(function(item) {
            return item.Source === 'Internet Movie Database'
        }).map(function(item) {
            return item.Value.toString()
        })
        IMDB = IMDB.toString();
        var RT = ratingsArr.filter(function(item) {
            return item.Source === 'Rotten Tomatoes'
        }).map(function(item) {
            return item.Value.toString()
        })
        RT = RT.toString();
        country = results.Country;
        language = results.Language;
        plot = results.Plot;
        actors = results.Actors;
        var output = ("\nTitle: " + title + "\nYear: " + year + "\nIMDB Rating: " + IMDB + "\nRotten Tomatoes Rating: " + RT + "\nCountry: " + country + "\nLanguage: " + language + "\nPlot: " + plot + "\nActors: " + actors + "\n---------------------------------")
        console.log(output)
        fs.appendFile('log.txt', output, 'utf8', function(error) {
            if (error) {
                console.log("Oops! Couldn't write.")
            }
            console.log("Yay! Appended data to file.")
        })
    })
}

whatToDo();