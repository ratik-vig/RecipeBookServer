const express = require('express')
const {check, validationResult} = require('express-validator')

const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Recipe = require('../../models/Recipe')

const router = express.Router()

router.get('/search', async(req, res) => {
    const {name} = req.query
    try {
        const recipes = await Recipe.find({name: {$regex: name, $options: '$i'}})
        res.json(recipes)
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
})

router.post('/new', auth, [
    check('name', 'Name is required').not().isEmpty(),
    check('cuisine', 'Cuisine is required').not().isEmpty(),
    check('ingredients', 'Ingredients are required').isArray({min: 1}),
    check('ingredients.*.name', 'name of ingredient is required').not().isEmpty(),
    check('ingredients.*.quantity', 'quantity is required').not().isEmpty(),
    check('steps', 'Steps are required').isArray({min: 1}),
    check('prepTime', 'Preparation time is required').not().isEmpty()
], async(req, res) => {
    const errors = await validationResult(req)
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()})
    
    const {
        name,
        cuisine,
        ingredients,
        steps,
        prepTime
    } = req.body
    
    try{
        const user = await User.findById(req.user.id).select('-password')
        const newRecipe = new Recipe({
            name,
            cuisine,
            ingredients,
            steps,
            prepTime,
            addedBy: user.id,
        })
        const post = await newRecipe.save()
        res.json(post)
    }catch(error){
        console.log(error)
        res.status(500).send('server error')
    }
})

module.exports = router