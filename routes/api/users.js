const express = require('express')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../models/User')
require('dotenv').config()

const router = express.Router()

router.post('/register', [
   check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password should be atleast 6 characters').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {name, email, password} = req.body

    try{
        let user = await User.findOne({email})
        if(user){
            return res.status(400).json({errors: [{msg: 'User already exists.'}]})
        }
        const salt = await bcrypt.genSalt(10)
        user = new User({
            name,
            email,
            password: await bcrypt.hash(password, salt)
        })
        await user.save()

        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, process.env.SECRET, {expiresIn: 360000}, (error, token) => {
            if(error) throw error
            res.json({token})
        })

    }catch(error){
        console.log(error)
        res.status(500).send('Server error')
    }
})

router.post('/login', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {email, password} = req.body
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({errors: [{msg: 'Invalid Credentials' }]})
        }
        const passwordsMatch = await bcrypt.compare(password, user.password)
        if(!passwordsMatch){
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})
        }
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, process.env.SECRET, {expiresIn: 360000}, (error, token) => {
            if(error) throw error
            res.json({token})
        })
    }catch(error){
        console.log(error)
        res.status(500).send('Server Error')
    }
})

module.exports = router
