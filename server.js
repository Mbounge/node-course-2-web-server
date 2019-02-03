const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000; // allows app to run with heroku or 3000

var app = express(); // in order to make the app all we have to do is call the method express

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');


//  use next to tell express when were done, when dealing asyncronous functions
// if you dont use next() your handlers will never fire
// req.method gives you the http method (get, put etc) 
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`
    
    console.log(log);
    fs.appendFile('server.log', log + '/n', (err) => { // callback function
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

//app.use((req, res, next) => {
//    res.render('maintenance.hbs')
//}); // will stop everything below it from rendering

// going to use middleware, lets you configure how your express app works, if it doesnt know how to do something you want 
// we use express to read a static dir
// app.use is how you register middleware and it takes a function
app.use(express.static(__dirname + '/public')); // takes absolute path to the folder you want to serve up

// we can start to set up our http route handlers

// first arg is root of app or url, second arg is for the function to run, the function that tells express what to send back to the person who sent the request

hbs.registerHelper('getCurrentYear', () => { // found in partials
  return new Date().getFullYear();                 
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

// Handler registration
//res.send('<h1>Hello Express!<h1>') // response for http request
// req stores info about all info for request coming in, headers, body etc, res is methods called the handler
app.get('/', (req, res) => {  
    res.render('home.hbs', { // render is used to make a different page
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to the home page',
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to fulfill request'
    });
});

app.listen(port, () => {
    console.log(`Server is up on Port ${port}`); // which will change over time because of heroku
}); // its going to bind our app to a port on our machine