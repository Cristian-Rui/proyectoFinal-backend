import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import { checkAdmins } from "../middlewares/auth.js";

const sessionRoutes = Router();

sessionRoutes.post('/register', checkAdmins, async (req, res) => {
    const { firstName, lastName, email, age, password, role } = req.body;
    try {
        const user = await userModel.create({
            firstName, lastName, email, age, password, role
        });
        req.session.user = user;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(400).send({ error });
    }
});

sessionRoutes.post('/login', async(req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({message: 'Invalid credentials'});
        }        
        if(user.password !== password){
            return res.status(401).send({message: 'Invalid credentials'});
        }
        req.session.user = user;
        res.redirect('/');
    } catch (error) {
        res.status(400).send({error});
    }
});

sessionRoutes.post('/logout', async(req, res) => {
    try {
        req.session.destroy((err) => {
            if(err){
                return res.status(500).json({message: 'Logout failed'});
            }
        });
        res.send({redirect: 'http://localhost:8080/login'});
    } catch (error) {
        res.status(400).send({error});
    }
});






export default sessionRoutes;