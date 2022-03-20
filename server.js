////////////////////
//  Dependencies  //
////////////////////
require("dotenv").config() // make env variables available
const express = require("express")

const middleware = require('./utils/middleware')
const RecipeRouter = require('./controllers/recipe')
const UserRouter = require('./controllers/user')
const CommentRouter = require('./controllers/comment')

// const User = require("./models/user")

// SEE MORE DEPENDENCIES IN ./utils/middleware.js
// user and resource routes linked in ./utils/middleware.js

const apiId = process.env.EDAMAM_API_ID
const apiKey = process.env.EDAMAM_API_KEY

const fetch = (url) => import('node-fetch').then(({default: fetch}) => fetch(url));

const searchQ = "keto"
const requestUrl = `https://api.edamam.com/search?q=${searchQ}&app_id=${apiId}&app_key=${apiKey}&from=0&to=50`

const requestArticleUrl = "https://health.gov/myhealthfinder/api/v3/topicsearch.json?categoryId=healthy"


//////////////////////////////
// Middleware + App Object  //
//////////////////////////////
const app = require("liquid-express-views")(express())

middleware(app)

////////////////////
//    Routes      //
////////////////////

app.use('/auth', UserRouter)
app.use('/recipes', RecipeRouter)
app.use('/comment', CommentRouter)

app.get('/', (req, res) => {
	console.log("Main route")
    const { username, userId, loggedIn } = req.session

	console.log("Main RequestUrl: ", requestUrl)

	// Submit the request to retrieve the data
	// Fetch requires node-fetch and special import
	fetch(requestUrl)
	  .then((responseData)=>{
		  return responseData.json();
	  })
	  .then((jsonData)=>{
		 
		const recipeList = jsonData.hits;
		//console.log("Name of first: ", recipeList[0].recipe.label);

		// res.send(recipeList)
		// console.log(recipeList)
		fetch(requestArticleUrl)
	 	.then((responseArticleData)=>{
			return responseArticleData.json();
	 	})
	 	.then((jsonArticleData)=>{
			const articleList = jsonArticleData.Result.Resources.Resource;
			//console.log("Article array: ", articleList)
			console.log("First Article Title", articleList[0].Title)
		
			res.render('index.liquid', { recipes: recipeList, articles: articleList, searchQ, loggedIn, username, userId })
		})
	  })
	  .catch((error)=>{
		  // If any error is sent bac, you will have access to it here.
		  console.log(error);
		  res.json({ error })
	  });
})

app.get('/error', (req, res) => {
	const error = req.query.error || 'This Page Does Not Exist'
    const { username, loggedIn, userId } = req.session
	res.render('error.liquid', { error, username, loggedIn, userId })
})

// if page is not found, send to error page
app.all('*', (req, res) => {
	res.redirect('/error')
})



//////////////////////////////
//      App Listener        //
//////////////////////////////
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
})