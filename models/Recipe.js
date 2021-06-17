const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    ingredients: [
        {
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: String,
                required: true
            }
        }
    ],
    steps: {
        type: [String],
        required: true
    },
    prepTime: {
        type: Number,
        required: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }
        }
    ]
}) 

module.exports = Recipe = mongoose.model('recipe', RecipeSchema)