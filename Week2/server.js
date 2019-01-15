const express = require('express');
const hbs = require('hbs');

const app = express();
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'handlebars');
app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index.hbs', { title:"Index" });
});

app.get('/index', (req, res) => {
    res.render('index.hbs', { title:"Index" });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', { title:"About" });
});

app.get('/form', (req, res) => {
    res.render('form.hbs', { title:"Form" });
});

app.post('/results', (req, res) => {
    res.render('results.hbs',
    {
        title:"Submit",
        fName:req.body.fName,
        lName:req.body.lName,
        email:req.body.email,
        comments:req.body.comments
    });
});

app.listen(3000, () => {
    console.log("Listening...");
});