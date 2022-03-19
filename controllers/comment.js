const express = require('express')

// Mongoose models
// good to bring in the Place and Comment models
// since comments are dependent on places
const Recipe = require('../models/recipe')
const Comment = require('../models/comment')

///////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()

///////////////////////////////////////////
// throws custom error
///////////////////////////////////////////
const customErrors = require('../utils/custom_errors')

////////////////////////////////////////////
// sends 404 when non-existant document is requested
////////////////////////////////////////////
const handle404 = customErrors.handle404

///////////////////////////////////////////
// Middleware
// this is middleware that will remove blank fields from `req.body`, e.g.
// { comment: { title: '', text: 'foo' } } -> { comment: { text: 'foo' } }
///////////////////////////////////////////
const removeBlanks = require('../utils/remove_blank_fields')

////////////////////////////////////////////
// Routes
////////////////////////////////////////////

//////////////////////////////////////////////
// Show a recipes comments display
// Requires the id of the recipe to retrieve it
//   from the database and then calls the comments
//   index page to display the recipe and the comments
//   documents.
//////////////////////////////////////////////
router.get('/:recipeId', removeBlanks, (req, res) => {
    const recipeId = req.params.recipeId
    
    // we'll adjust req.body to include an author
    // the author's id will be the logged in user's id
    // req.body.author = req.session.userId
    const username = req.session.username
	const loggedIn = req.session.loggedIn
	const userId = req.session.userId


    // we'll find the recipe with the recipeId
    Recipe.findById(recipeId)
        .then(recipe => {
            res.render('comment/index', {recipe, username, loggedIn, userId})
        })
        // or show an error if we have one
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})


//////////////////////////////////////////////
// Show a recipe specific comments display
// Requires the id of the recipe and the id of the
//   comment to retrieve it from the database and 
//   then calls the comments edit page to display 
//   the recipe and the specific comment to edit.
//////////////////////////////////////////////
router.get('/:recipeId/:commentId', removeBlanks, (req, res) => {
    const recipeId = req.params.recipeId
    const commentId = req.params.commentId;
    
    // we'll adjust req.body to include an author
    // the author's id will be the logged in user's id
    // req.body.author = req.session.userId
    const username = req.session.username
	const loggedIn = req.session.loggedIn
	const userId = req.session.userId


    // we'll find the recipe with the recipeId
    Recipe.findById(recipeId)
        .then(recipe => {
            // find the recipes comment using commentId
			const comment = recipe.comments.id(commentId)

            res.render('comment/edit', {recipe, comment, username, loggedIn, userId})
        })
        // or show an error if we have one
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

///////////////////////////////////////////////////////
// Create a comment for a specific recipe
// Requires the id of the recipe to add the comment to.
// Form for the add comment uses this route.
//////////////////////////////////////////////////////
router.post('/:recipeId', removeBlanks, (req, res) => {
    const recipeId = req.params.recipeId
    console.log('POST to create comment - first comment body', req.body)
    
    // we'll adjust req.body to include an author
    // the author's id will be the logged in user's id
    //req.body.author = req.session.userId
    const username = req.session.username
	const loggedIn = req.session.loggedIn
	const userId = req.session.userId

    // we'll find the fruit with the fruitId
    Recipe.findById(recipeId)
        .then(recipe => {
            // Push the Comment from the forms body to create the 
            //  comment in the recipe.
            recipe.comments.push(req.body)
            // Save the recipe to the database
            return recipe.save()
        })
        .then(recipe => {
            // Redisplay the comments recipes page for the recipe
            res.redirect(`/comment/${recipe.id}`)
        })
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

///////////////////////////////////////////////////////////////
// Update a Comment
//   Requries a recipeId to find the recipe and a commentId to
//    update a specific comment
///////////////////////////////////////////////////////////////
router.patch('/:recipeId/:commentId', removeBlanks, (req, res, next) => {
    const recipeId = req.params.recipeId
    const commentId = req.params.commentId

	// find the recipe by recipeId
	Recipe.findById(recipeId)
        .then(handle404)
		.then((recipe) => {

			// find the recipes comment using commentId
			const comment = recipe.comments.id(commentId)
            console.log("comment: ", comment)

			// update title and content of comment
			const newComment = req.body
            console.log("newComment", newComment)
            console.log("req.body", req.body)

            comment.title = newComment.title
            comment.body = newComment.body

			// save the recipes's updated comment
			return recipe.save()
		})
		.then(recipe => {
            // Redisplay the comments recipes page for the recipe
            res.redirect(`/comment/${recipe.id}`)
        })
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

//////////////////////////////////////////////////////////////
// Delete a comment from a recipe
// Requires the id of the recipe, since we need to find it
// and the id of the comment, since we want to delete it
//////////////////////////////////////////////////////////////
router.delete('/delete/:recipeId/:commId', (req, res) => {
    // first we want to parse out our ids
    const recipeId = req.params.recipeId
    const commId = req.params.commId
    // then we'll find the recipe
    Recipe.findById(recipeId)
        .then(handle404)
        .then(recipe => {
            const theComment = recipe.comments.id(commId)
                theComment.remove()
                // return the saved recipe
                return recipe.save()

        })
        .then(recipe => {
            // redirect to the comment show page
            res.redirect(`/comment/${recipeId}`)
        })
        .catch(error => {
            // catch any errors
            console.log(error)
            res.send(error)
        })
})

////////////////////////////////////////////
// Export the Router
////////////////////////////////////////////
module.exports = router