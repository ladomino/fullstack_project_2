// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// require the commentSchema so we can create a subdocument array
const commentSchema = require('./comment')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

// Still being modified
const recipeSchema = new Schema(
	{
		apiId: {type: String, required: true},
		name: { type: String, required: true},
		img: {type: String, required: true},
		// Subdocument array
		comments: [commentSchema],
		// Track for MyRecipes
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		},
	},
	{ timestamps: true }
)

const Recipe = model('Recipe', recipeSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Recipe
