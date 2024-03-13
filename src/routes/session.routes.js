import { Router } from "express";
import passport from "passport";
import { userModel } from "../dao/models/user.model.js";
import { checkAdmins } from "../middlewares/auth.js";
import { createHash } from "../utils/bcrypt.js";

const sessionRoutes = Router();

sessionRoutes.post('/register', checkAdmins, passport.authenticate('register'), async (req, res) => {
    const { email } = req.body
    try {
        const user = await userModel.findOne({ email })
        req.session.user = user;
        res.status(201).redirect('/');
    } catch (error) {
        console.error(error);
        res.status(400).send({ error });
    }
});

sessionRoutes.post('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ message: 'error with credentials' })
        }
        req.session.user = {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        };
        res.redirect('/');
    } catch (error) {
        res.status(400).send({ error });
    }
});

sessionRoutes.post('/logout', async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Logout failed' });
            }
        });
        res.send({ redirect: 'http://localhost:8080/login' });
    } catch (error) {
        res.status(400).send({ error });
    }
});

sessionRoutes.post('/restorepassword', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).send({ message: 'unauthorized' })
        };
        user.password = createHash(newPassword);
        await user.save();
        res.send({ message: 'password updated' });
    } catch (error) {
        console.error(error);
        res.status(400).send({ error });
    }
})

sessionRoutes.get("/github", passport.authenticate("github", { scope: ["user:email"] }), (req, res) => {

}
);

sessionRoutes.get("/githubcallback",  passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
}
);

export default sessionRoutes;