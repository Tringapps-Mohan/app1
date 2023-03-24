const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { SECRET_KEY } = require("../../config");
const { validateRegisterInput,validateLoginInput } = require("../../util/validators");
const User = require("../../models/User");

function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: "1h" });
}

module.exports = {
    Mutation: {
        async register(parent, { registerInput: {
            username,
            email,
            password,
            confirmPassword
        } }, context, info) {

            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
            );

            if(!valid){
                throw new UserInputError("Can't able to register!",{
                    errors
                })
            }

            const user = User.findOne({ username });

            if (user) {
                console.log("User already exists!");
                throw new UserInputError("Username already exists!", {
                    errors: {
                        username: "Username already exists!"
                    }
                })
            }

            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toString()
            });

            const res = await newUser.save();

            const token = generateToken(res);
            return {
                ...res._doc,
                id: res._id,
                token
            }
        },

        async login(parent,{username,password}){

            const {valid,errors} = validateLoginInput(username,password);

            if(!valid){
                throw new UserInputError("Login Error",{errors});
            }

            const user = await User.findOne({username});

            if(!user){
                errors.username = "User not found !";
                throw new UserInputError("Login Error",{errors});
            }

           const match = await bcrypt.compare(password,user.password);

           if(!match){
                errors.general = "User credentials are not matched!";
                throw new UserInputError("Login Error",{errors});
           }

           const token = generateToken(user);

           return {
                ...user._doc,
                id:user._id,
                token
           }

        }
    }
}