// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

// Still being modified
const recipeSchema = new Schema(
	{
		name: { type: String},
		title: { type: String, required: true },
        body: { type: String, required: true },
		img: {type: String},
		ingredients: { type: String},
		dietLabels: {type: String},
		healthLabels: {type: String},
        servings: { type: Number},
		ready: { type: Boolean, required: true},
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
