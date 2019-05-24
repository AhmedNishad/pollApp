const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'/components')));
app.set('views', path.join(__dirname,'/views'));
app.set('view engine', 'ejs');
app.use(express.json())


app.use('/polls', require('./routes/polls'))

app.get('/', (req,res)=>{
     res.redirect('polls');
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`We are LIVE!`);
});