////////////////////////////////////////////////////
// Import Dependencies
///////////////////////////////////////////////////
require("dotenv").config(); // Load ENV Variables
const express = require('express')
const Recipe = require('../models/recipe')

////////////////////////////////////////////////////
// Setup for Recipe retrieval through API
////////////////////////////////////////////////////
const apiId = process.env.EDAMAM_API_ID
const apiKey = process.env.EDAMAM_API_KEY

const fetch = (url) => import('node-fetch').then(({default: fetch}) => fetch(url));

////////////////////////////////////////////////////
// Create router
////////////////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////////////
// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
/////////////////////////////////////////////////////
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

//////////////////////////////////////////////////////////////////////////////
// Search Route - Retrieves the recipes based on the search query string
//   Example ?q=keto
/////////////////////////////////////////////////////////////////////////////
router.get("/", (req, res) => {
	
	// A query string might be preserved from a previous request
	// Setup the requestUrl for recipes  
	const searchQ = req.query.q; 

	// destructure user info from req.session
	const { username, userId, loggedIn } = req.session


	// limiting number of ingredients
	// &ingr=${maxIngr}&to=50
	const requestUrl = `https://api.edamam.com/search?q=${searchQ}&app_id=${apiId}&app_key=${apiKey}&from=0&to=50`
	const requestArticleUrl = "https://health.gov/myhealthfinder/api/v3/topicsearch.json?categoryId=healthy"


	// Submit the request to the API to retrieve the data
	// Fetch requires node-fetch and special import
	fetch(requestUrl)
	  .then((responseData)=>{
		  return responseData.json();
	  })
	  .then((jsonData)=>{
		const recipeList = jsonData.hits;

		// TEST TO SHOW FETCH GETTING ONLY 10 ITEMS MAX FROM RECIPE API
		//res.send(jsonData)
		//
		fetch(requestArticleUrl)
		.then((responseArticleData)=>{
		   return responseArticleData.json();
		})
		.then((jsonArticleData)=>{
		   const articleList = jsonArticleData.Result.Resources.Resource;

		   res.render('index.liquid', { recipes: recipeList, articles: articleList, searchQ, loggedIn, username, userId })
		  })
		})
	  .catch((error)=>{
		// If any error is sent bac, you will have access to it here.
		console.log(error);
		res.json({ error })
	  });
  });


////////////////////////////////////////////////////////////////////////////////
// Show display for MyRecipes
//   Only display those recipes for a given userId.
//   Calls the recipe index page to display the recipes.
////////////////////////////////////////////////////////////////////////////////
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session

	// preserve the query string
	const searchQ = req.query.q;

	Recipe.find({ owner: userId })
		.then(recipes => {
			res.render('recipes/index', { recipes, searchQ, username, loggedIn, userId })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

////////////////////////////////////////////////////////////////
// Create a New Recipe
//
// 	 Creates a New recipe using the new form.
////////////////////////////////////////////////////////////////
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session

	res.render('recipes/new', { username, loggedIn })
})

///////////////////////////////////////////////////////////////////////////
// Called when adding a New Recipe to the database  
//    A new recipe object is created for a specific owner.
//////////////////////////////////////////////////////////////////////////
router.post('/new', (req, res) => {
	const apiRecipeId = req.params.id

	// destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	
	req.body.owner = req.session.userId

	//res.send(req.body)
	Recipe.create(req.body)
		.then(recipe => {
			console.log('this was returned from create', recipe)

			res.redirect(`/recipes/mine`)
	})
	.catch(error => {
		res.redirect(`/error?error=${error}`)
	})
})

///////////////////////////////////////////////////////////////////////////
// Called when adding to Myrecipes.  
//    A new recipe object is created for a specific owner.
//    The query string is needed to redraw the exact display you were on
//    while adding to Myrecipes.
//////////////////////////////////////////////////////////////////////////
router.post('/:id', (req, res) => {
	const apiRecipeId = req.params.id
	const searchQuery = req.query

	// destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	
	req.body.owner = req.session.userId

	//res.send(req.body)
	Recipe.create(req.body)
		.then(recipe => {
			// console.log('this was returned from create', recipe)

			res.redirect(`/recipes?q=${searchQuery.q}`)
	})
	.catch(error => {
		res.redirect(`/error?error=${error}`)
	})
})

////////////////////////////////////////////////////////////
// Edit a recipe 
//   requires a recipeId
// edit route -> GET that takes us to the edit form view
///////////////////////////////////////////////////////////
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const recipeId = req.params.id

	// destructure user info from req.session
	const { username, userId, loggedIn } = req.session

	Recipe.findById(recipeId)
		.then(recipe => {
			console.log("edit recipe: ", recipe)
			res.render('recipes/edit', { recipe, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

/////////////////////////////////////////////////////////////
// Update a MyRecipe
//   update a recipe by the recipeId
/////////////////////////////////////////////////////////////
router.put('/:id', (req, res) => {
	const recipeId = req.params.id

	console.log("Update Body: ", req.body)

	Recipe.findByIdAndUpdate(recipeId, req.body, { new: true })
		.then(recipe => {
			res.redirect(`/recipes/mine`)
		})
		.catch((error) => {
	 		res.redirect(`/error?error=${error}`)
	})
})

////////////////////////////////////////////////////////////////
// Show a specific recipe.
//   Requires an api recipe id to use the API to retrieve the recipe
//   so we can get at the ingredients.
//   This comes in from clicking on a recipe image.
////////////////////////////////////////////////////////////////
router.get('/:id', (req, res) => {
	const apiRecipeId = req.params.id

	const { username, userId, loggedIn } = req.session

	const requestUrl = `https://api.edamam.com/api/recipes/v2/${apiRecipeId}?type=public&app_id=${apiId}&app_key=${apiKey}`


	// Submit the request to retrieve the data
	// Fetch requires node-fetch and special import
	fetch(requestUrl)
	  .then((responseData)=>{
		  return responseData.json();
	  })
	  .then((jsonData)=>{
		// This is one specific recipe from the API call		 
		const recipe = jsonData.recipe;
		res.render('recipes/show', { recipe, username, loggedIn, userId })
	  })
	  .catch((error)=>{
		  // If any error is sent bac, you will have access to it here.
		console.log(error);
		res.redirect(`/error?error=${error}`)
	})
})

////////////////////////////////////////////////////////////
// Show a MyRecipe
//   requires a recipeId
///////////////////////////////////////////////////////////
router.get('/mine/:id', (req, res) => {
	// we need to get the id
	const recipeId = req.params.id

	// destructure user info from req.session
	const { username, userId, loggedIn } = req.session

	Recipe.findById(recipeId)
		.then(recipe => {
			res.render('recipes/show', { recipe, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})


/////////////////////////////////////////////////////////////////
// Delete a recipe 
// 	  Requires a recipe id to remove a recipe from the database.
/////////////////////////////////////////////////////////////////
router.delete('/:id', (req, res) => {
	const recipeId = req.params.id
	Recipe.findByIdAndRemove(recipeId)
		.then(recipe => {
			res.redirect('/recipes/mine')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
