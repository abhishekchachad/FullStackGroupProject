const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { isAuthenticated } = require('./middleware/auth'); // This line imports isAuthenticated functions from auth.js specifically
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
})); 
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
  res.locals.user = req.session.user || null;
  next();
});
app.use(authRoutes);
app.use(isAuthenticated);
app.use(userRoutes);

const URI = 'mongodb+srv://node:node@cluster0.uzfufsj.mongodb.net/DrivingTest?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(URI)
.then(result => app.listen(PORT, (req, res) => {
    console.log(`Database is connected & Server is running on http://localhost:${PORT}.`);
}) )
.catch(err => console.log(err));


app.get('/', (req, res) => {
  res.render('pages/home', {title: 'Home', body: '<%- include("pages/home") %>'});
});