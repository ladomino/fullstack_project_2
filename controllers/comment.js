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

////////////////////////////////////////////
// Routes
////////////////////////////////////////////

//////////////////////////////////////////////
// Route used for retrieving all the comments for a recipeId
//////////////////////////////////////////////
router.get('/:recipeId', (req, res) => {
    const recipeId = req.params.recipeId
    console.log("Showing Comments: recipeId: ", recipeId)
    console.log('first comment body', req.body)
    
    // we'll adjust req.body to include an author
    // the author's id will be the logged in user's id
    // req.body.author = req.session.userId
    const username = req.session.username
	const loggedIn = req.session.loggedIn
	const userId = req.session.userId


    // we'll find the recipe with the recipeId
    Recipe.findById(recipeId)
        .then(recipe => {
        //     // then we'll send req.body to the comments array
        //     recipe.comments.push(req.body)
        //     // save the recipe
        //     return recipe.save()
        // })
        // .then(recipe => {
        //     // redirect

             // this will need to be updated as we need to retrieve the recipe first
            // from the API before we can display it.
            // res.redirect(`/recipes/${recipe.id}`)
            res.render('comment/index', {recipe, username, loggedIn, userId})
        })
        // or show an error if we have one
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

///////////////////////////////////////////////////////
// Route to create a comment
// POST -> to create a comment
router.post('/:recipeId', (req, res) => {
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
            // then we'll send req.body to the comments array
            recipe.comments.push(req.body)
            // save the recipe
            return recipe.save()
        })
        .then(recipe => {
            // redirect

             // this will need to be updated as we need to retrieve the recipe first
            // from the API before we can display it.
            res.redirect(`/comment/${recipe.id}`)
        })
        // or show an error if we have one
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

//////////////////////////////////////////////////////////////
// DELETE -> to destroy a comment
// we'll use two params to make our life easier
// first the id of the recipe, since we need to find it
// then the id of the comment, since we want to delete it
router.delete('/delete/:recipeId/:commId', (req, res) => {
    // first we want to parse out our ids
    const recipeId = req.params.recipeId
    const commId = req.params.commId
    // then we'll find the recipe
    Recipe.findById(recipeId)
        .then(recipe => {
            const theComment = recipe.comments.id(commId)
            // only delete the comment if the user who is logged in is the comment's author
            // if ( theComment.author == req.session.userId) {
                // then we'll delete the comment
                theComment.remove()
                // return the saved recipe
                return recipe.save()
            // } else {
            //     return
            // }

        })
        .then(recipe => {
            // redirect to the recipe show page

            // this will need to be updated as we need to retrieve the recipe first
            // from the API before we can display it.
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