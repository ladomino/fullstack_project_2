// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

// Still being modified
const recipeSchema = new Schema(
	{
		apiId: {type: String, required: true},
		name: { type: String, required: true},
		img: {type: String, required: true},
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
