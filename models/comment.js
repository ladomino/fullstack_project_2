const mongoose = require('mongoose')

// extract the Schema constructor, to make it easier to use
const Schema = mongoose.Schema

// Make sure to load the recipe model, so it can be populated later
const Recipe = require('./recipe')

const commentSchema = new Schema(
	{
		body: String,
		title: String,
	},
	{
		// add the createdAt and updatedAt timestamps
		timestamps: true,
	}
)

// export the commentSchema, so we can use it as a subdocument
// in place.js
// Note: We don't need to create or export a model, for a subdocument
module.exports = commentSchema