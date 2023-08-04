const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://gaurav409:gaurav123@cluster0.awz5oze.mongodb.net/gofoodmern?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to MongoDB');

    // Retrieve data from the "food_items" collection
    try {
      const foodItemsCollection = mongoose.connection.db.collection("food_items");

      const foodItemsData = await foodItemsCollection.find().toArray();

      const foodCategory = mongoose.connection.db.collection("foodCategory");

      const catData = await foodCategory.find().toArray();

      if (Array.isArray(foodItemsData)) {
        global.food_items = foodItemsData;
        global.foodCategory = catData;
        
      }  else {
        console.log('No data found in the "food_items" collection');
      }
    } catch (error) {
      console.error('Error retrieving data from the "food_items" collection:', error);
    }

    
    
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Add middleware to allow CORS and parse JSON
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());

app.use('/api',require("./Routes/CreateUser"));
app.use('/api',require("./Routes/DisplayData"));
app.use('/api',require("./Routes/OrderData"));


// Handle GET request to "/"
app.get('/', (req, res) => {
  res.send('Hello Gaurav!!!');
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
