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
		recipe: {
			uri: {type: String, required: true},
			label: { type: String, required: true},
			image: {type: String, required: true},
			yield: {type: Number, default: 0},
		},
		ingredientLines: [{type: String}],
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
