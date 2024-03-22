import { Router } from "./router.js";
import passport from "passport";
import { userModel } from "../dao/models/user.model.js";
import { checkAdmins } from "../middlewares/auth.js";
import { createHash } from "../utils/bcrypt.js";
import jwt from 'jsonwebtoken'
import { secret } from "../config/const.js";

export default class SessionRoutes extends Router {

    init() {
        this.post('/register', ['PUBLIC'], checkAdmins, passport.authenticate('register'), async (req, res) => {
            try {
                const { email, firstName, lastName, age, cart, role } = req.body

                const token = jwt.sign({ email, firstName, lastName, age, cart, role },
                    secret, { expiresIn: '24h' });

                res.cookie('cookieToken', token, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true
                }).redirect('/');
            } catch (error) {
                res.sendServerError(error.message)
            }
        });

        this.post('/login', ['PUBLIC'], passport.authenticate('login'), async (req, res) => {
            try {
                const { email, firstName, lastName, age, cart, role } = req.user;

                const token = jwt.sign({ email, firstName, lastName, age, cart, role },
                    secret, { expiresIn: '24h' });

                res.cookie('cookieToken', token, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true
                }).redirect('/');
            } catch (error) {
                res.sendServerError(error.message)
            }
        });

        this.post('/logout', ['USER', 'ADMIN'], async (req, res) => {
            try {
                res.clearCookie('cookieToken').redirect('/login')
            } catch (error) {
                res.sendServerError(error.message)
            }
        })

        this.post('/restorepassword', ['PUBLIC'], async (req, res) => {
            try {
                const { email, newPassword } = req.body;

                const user = await userModel.findOne({ email });
                if (!user) {
                    return res.status(401).send({ message: 'unauthorized' })
                };
                user.password = createHash(newPassword);
                await user.save();
                res.sendSuccess('password updated')
            } catch (error) {
                res.sendServerError(error.message)
            }
        })

        this.get("/github", ['PUBLIC'], passport.authenticate("github", { scope: ["user:email"] }), (req, res) => {

        }
        );

        this.get("/githubcallback", ['PUBLIC'], passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
            try {
                const { email, firstName, lastName, age, cart, role } = req.user;

                const token = jwt.sign({ email, firstName, lastName, age, cart, role },
                    secret, { expiresIn: '24h' });

                res.cookie('cookieToken', token, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true
                }).redirect('/');
            } catch (error) {
                res.sendServerError(error.message)
            }
        }
        );

        this.get('/getUser',['USER','ADMIN'], (req, res) => {
            const { email, firstName, lastName, age, cart, role } = req.user;
            const user = {
                email,
                firstName,
                lastName,
                age,
                cart,
                role
            }
            res.sendSuccess(user);
        });
    }

}
