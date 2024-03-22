import { Router as ExpressRouter } from "express";
import jwt from 'jsonwebtoken';
import { secret } from "../config/const.js";

export class Router {
    constructor() {
        this.router = ExpressRouter();
        this.init();
    };

    applyCallbacks(callbacks) {
        return callbacks.map((calback) => async (...params) => {
            try {
                await calback.apply(this, params)
            } catch (error) {
                console.log(error);
                params[1].status(500).send(error)
            }
        })
    }

    handlePolicies = policies => (req, res, next) => {
        if (policies.find(p => p === 'PUBLIC')) {
            return next();
        }
        
        const authHeaders = req.headers.cookie;
        
        if (!authHeaders.includes('cookieToken')) {
            return res.redirect('/login')
        }
        
        const token = authHeaders.split('cookieToken=')[1].split(';')[0];
        const user = jwt.verify(token, secret)
        if (!policies.includes(user.role.toUpperCase())) {
            return res.status(403).send({ error: 'Forbidden' });
        }
        next();
    }

    getRouter() {
        return this.router
    };

    init() {

    };

    get(path, policies, ...callbacks) {
        this.router.get(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    };

    post(path, policies, ...callbacks) {
        this.router.post(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    };

    put(path, policies, ...callbacks) {
        this.router.put(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    };

    delete(path, policies, ...callbacks) {
        this.router.delete(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    };

    generateCustomResponses(req, res, next) {
        res.sendSuccess = payload => res.send({ status: 'succes', payload });
        res.sendServerError = error => res.status(500).send({ status: 'error', error });
        res.sendUserError = error => res.status(400).send({ status: 'error', error });
        next();
    }
}