const express = require('express');
const path = require('path');
const app = express();
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost/contactDance', { useNewUrlParser: true });
const port = 3000;

// DEFINE MONGOOSE SCHEMA //
var contactSchema = new mongoose.Schema({
  name: String, 
  phone: String,
  email: String,
  address: String,
  desc: String, 
});  

// Define the Contact model based on the schema
var Contact = mongoose.model('Contact', contactSchema);

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));

// Parse request bodies
app.use(express.urlencoded({ extended: true }));

// Set up view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  const params = {};
  res.status(200).render('home.pug', params);
});

app.get('/contact', (req, res) => {
  const params = {};
  res.status(200).render('contact.pug', params);
}); 

app.post('/contact', async (req, res) => {
  try {
    const myData = new Contact(req.body);
    const savedData = await myData.save();
    console.log('Item saved to the database:', savedData);
    res.send('This item has been saved to the database');
  } catch (error) {
    console.error('MongoDB Error:', error);
    res.status(500).send('An error occurred while saving the item to the database. Details: ' + error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`The application started successfully on port ${port}`);
});
