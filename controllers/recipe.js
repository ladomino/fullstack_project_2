// Import Dependencies
require("dotenv").config(); // Load ENV Variables
const express = require('express')
const Recipe = require('../models/recipe')

// Setup for Recipe retrieval through API
const apiId = process.env.EDAMAM_API_ID
const apiKey = process.env.EDAMAM_API_KEY

const fetch = (url) => import('node-fetch').then(({default: fetch}) => fetch(url));

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
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

// Routes

// index ALL
// router.get('/', (req, res) => {
// 	Recipe.find({})
// 		.then(recipes => {
// 			const username = req.session.username
// 			const loggedIn = req.session.loggedIn

// 			const searchQ = req.query.q; 
// 			const reqUrl = `https://api.edamam.com/search?q=${search}&app_id=${apiId}&app_key=${apiKey}&ingr=${maxIngr}&to=50`
			
// 			res.send();
// 			res.render('recipes/index', { recipes, username, loggedIn })
// 		})
// 		.catch(error => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })


// Called from Search to retrieve the recipes based on search keywords
router.get("/", (req, res) => {

	console.log("In get search route")
	
	// Setup the requestUrl for recipes  
	const searchQ = req.query.q; 
	console.log("Search key: ", searchQ);
	console.log("API_ID: ", apiId)
	console.log("API_KEY: ", apiKey)

	const username = req.session.username
	const loggedIn = req.session.loggedIn
	const userId = req.session.userId

	// limiting number of ingredients
	// &ingr=${maxIngr}&to=50
	const requestUrl = `https://api.edamam.com/search?q=${searchQ}&app_id=${apiId}&app_key=${apiKey}`


	console.log("Search RequestUrl: ", requestUrl)

	// Submit the request to retrieve the data
	// Fetch requires node-fetch and special import
	fetch(requestUrl)
	  .then((responseData)=>{
		  return responseData.json();
	  })
	  .then((jsonData)=>{
		 
		  const recipeList = jsonData.hits;
		  
		  // Render the new display page and pass in the data needed 
		  //  to display
		//   res.render("./weather/show.liquid", { city: city, cityTemp: cityTemp,
		// 	  description: cityDescription, minTemp: minTemp, maxTemp: maxTemp});

		res.render('index.liquid', { recipes: recipeList, loggedIn, username, userId })
	  })
	  .catch((error)=>{
		  // If any error is sent bac, you will have access to it here.
		  console.log(error);
		  res.json({ error })
	  });
  });



// index that shows only the user's recipes
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Recipe.find({ owner: userId })
		.then(recipes => {
			res.render('recipes/index', { recipes, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('recipes/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false

	req.body.owner = req.session.userId
	Recipe.create(req.body)
		.then(recipe => {
			console.log('this was returned from create', recipe)
			res.redirect('/recipes')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const recipeId = req.params.id
	Recipe.findById(recipeId)
		.then(recipe => {
			res.render('recipes/edit', { recipe })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const recipeId = req.params.id
	req.body.ready = req.body.ready === 'on' ? true : false

	Recipe.findByIdAndUpdate(recipeId, req.body, { new: true })
		.then(recipe => {
			res.redirect(`/recipes/${recipe.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	const recipeId = req.params.id
	Recipe.findById(recipeId)
		.then(recipe => {
            const {username, loggedIn, userId} = req.session
			res.render('recipes/show', { recipe, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const recipeId = req.params.id
	Recipe.findByIdAndRemove(recipeId)
		.then(recipe => {
			res.redirect('/recipes')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
