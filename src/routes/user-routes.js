const express = require('express')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const User = require('../models/user-model')


const router = new express.Router()
 
        // Signing up users 
router.post('/register', async (req, res) => {

    
    try {
      await User.emailExistCheck(req.body.email)
        if (req.body.password.length < 6) {
            return res.send({error:'password must be more than 6 characters'})
        }
        if (!validator.isEmail(req.body.email)) {
            return res.send({error:'email is invalid'})
        }
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()

        res.send({user, token})
        
    } catch (error) {
    
        res.send({error:error.message})
    }
 
})

        // Logging in users 
router.post('/login', async(req, res) => {
    try {
        const user = await User.findByCridentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (Error) {
        res.send({Error:Error.message})
    }
})

router.put('/follow/:id/', async (req, res) => {
    if (req.body._id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body._id)
            if (!user.followers.includes(currentUser.fullname)) {
               await user.updateOne( {$push: { followers: currentUser.fullname}})
               await currentUser.updateOne({$push: {followings: user.fullname}})
                res.send('followed')

            }else{
               return res.send('already following');
            } 
        } catch (error) {
            res.send({error:error.message})
        }
    } else {
        res.send('cant follow yourself')
    }
}),

router.put('/unfollow/:id/', async (req, res) => {
    if (req.body._id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body._id)
            if (user.followers.includes(currentUser.fullname)) {
               await user.updateOne( {$pull: { followers: currentUser.fullname}})
               await currentUser.updateOne({$pull: {followings: user.fullname}})
                res.send('unfollowed')

            }else{
               return res.send('already unfollowed');
            } 
        } catch (error) {
            res.send({error:error.message})
        }
    } else {
        res.send({error:error.message})
    }
})

module.exports = router

