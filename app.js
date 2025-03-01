const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const app = express();

const Recipe = require("./models/Recipe.model");

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());


// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION

const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev";

mongoose
  .connect(MONGODB_URI)
  .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to mongo", err));

// ROUTES
//  GET  / route - This is just an example route
/*app.get('/', (req, res) => {
    res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});*/


//  Iteration 3 - Create a Recipe route
//  POST  /recipes route

app.post("/recipes", (req, res)=>{
    Recipe.create({
        title: req.body.title,
        instructions: req.body.instructions,
        level: req.body.level,
        ingredients: req.body.ingredients,
        image: req.body.image,
        duration: req.body.duration,
        isArchived: req.body.isArchived,
        created: req.body.created
    })
    .then((createdRecipe)=>{
        console.log("Recipe was created!", createdRecipe);
        res.status(201).json(createdRecipe);
    })
    .catch((error)=>{
        console.log("Failed to create recipe");
        res.status(500).json({ message:"Failed to create recipe"});
    })
});

//  Iteration 4 - Get All Recipes
//  GET  /recipes route

app.get("/recipes", (req, res)=>{
    Recipe.find()
    .then((getRecipes)=>{
        console.log("Retrieved recipes", getRecipes);
        res.status(200).json(getRecipes);
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).json({message: "Failed to get recipes"});
    })
});

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route

app.get("/recipes/:recipeId", (req, res)=>{
    const recipeId = req.params.recipeId;

    Recipe.findById(recipeId)
    .then((getOneRecipe)=>{
        console.log("Retrieved recipes", getOneRecipe);
        res.status(200).json(getOneRecipe);
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).send({error: "Failed to retrieve recipe"});
    })
});

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route

app.put("/recipes/:recipeId", (req, res)=>{
    const recipeId = req.params.recipeId;

    Recipe.findByIdAndUpdate(recipeId, req.body, {new: true})
    .then((updatedRecipe)=>{
        console.log("Updated Recipe", updatedRecipe);
        res.status(200).json(updatedRecipe);
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).json({message: "Failed to update recipe"});
    })
});


//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route

app.delete("/recipes/:recipeId", (req, res)=>{
    const recipeId = req.params.recipeId;
    Recipe.findByIdAndDelete(recipeId)
    .then(()=>{
        console.log("Recipe deleted!");
        res.status(204).send();
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).json({message:"Failed to delete the recipe"});
    })
});

// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));



//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;