import passport from "passport";
import local from 'passport-local';
import { userModel } from '../dao/models/user.model.js';
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { Strategy as GithubStrategy } from "passport-github2";


const localStrategy = local.Strategy;

const initializePassport = () => {

    //register strategy
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { firstName, lastName, email, age, role } = req.body;
            try {
                const user = await userModel.findOne({ email: username });

                if (user) {
                    Swal.fire({
                        title: "The email used is already linked to an account",
                        icon: "warning",
                        html: `<b>Please log in by <a href="/login">clicking here</a></b>`
                    });
                };

                const result = await userModel.create({
                    firstName,
                    lastName,
                    email,
                    age,
                    password: createHash(password),
                    role
                });

                return done(null, result);
            } catch (error) {
                return done('There was a problem registering the user, try again later' + error)
            };
        }
    ));

    passport.use('login', new localStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });

                if (!user) {
                    Swal.fire({
                        title: "User is not registered",
                        icon: "warning",
                        html: `<b>You can register by <a href="/register">clicking here</a></b>`
                    });
                    return done(null, false);
                };

                if (!isValidPassword) {
                    Swal.fire({
                        title: "Wrong email or password",
                        icon: "warning",
                        html: `<b>try to access again by <a href="/login">clicking here</a></b>`
                    });
                    return done(null, false);
                };

                return done(null, user);
            } catch {
                return done("There was a problem logging in, please try again later" + error);
            };
        }
    ));

    passport.use('github', new GithubStrategy(
        {
            clientID:'Iv1.acc1f53e1783cf8a',
            callbackURL:'http://localhost:8080/api/session/githubcallback',
            clientSecret:'e0a6d3d12b5a24128fb278f5a702af140d01da58'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log({profile});
                const user = await userModel.findOne({email: profile._json.email});
                if(!user){
                    const newUser = {
                        firstName: profile._json.name.split(' ')[0],
                        lastName: profile._json.name.split(' ')[1],
                        age: 18,
                        email: profile._json.email,
                        password: 'GithubGenerated'
                    }
                    const result = await userModel.create(newUser);
                    return done(null, result);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findOne({ _id: id });
        done(null, user);
    })

};



export default initializePassport;