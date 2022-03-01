const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema({
    fullname:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true,
        //lowerCase:true,
        unique:true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('The email is invalid')
            }
        }
    },
    password:{
        type:String,
        require:true,
        minlength:6,
        validate(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error(`password must not be ${value.join()}`)
            }
        }
    },
    followers:[{
        type:Object,
        default:{}
    }],
    followings:[{
        type:Object,
        defualt:{}
    }],

    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

UserSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({_id:this._id.toString()}, 'chatapp')

    this.tokens = this.tokens.concat({token})
    await this.save()

    return token
}

UserSchema.statics.emailExistCheck = async function (email){
    const user = await User.findOne({email})

    if (user) {
        throw new Error('User already exists')
    }
    return user
}

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

UserSchema.statics.findByCridentials = async function (email,password){
    const user = await User.findOne({email})

    if (!user) {
        throw new Error ('Incorrect cridentials')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Incorrect cridentials')
    }
    return user
}

const User = mongoose.model('User', UserSchema)
module.exports = User