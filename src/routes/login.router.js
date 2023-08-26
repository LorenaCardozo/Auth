import { Router, response } from "express";
import userModel from "../models/users.model.js";
import { AuthManager } from "../classes/AuthManager.js";

const router = Router();

router.get("/", (req, res) => {
    res.render("login")
})

router.post("/", async (req, res) => {
    const { email, password } = req.body;
    let result;

    if (email === "adminCoder@coder.com" && password === "adminCod3r123"){
        result = {username: "Admin", email: email, admin: true}
    }else{
        result = await userModel.findOne({ email });
    }

    if (result === null) {
        return res.status(401).json({
            respuesta: "error de autenticación",
        });
    } else {
        if(!AuthManager.isInvalidPassword(result, password)) return res.status(401).send({status:"error", error:"Error. Revise los datos."});        
        console.log(result.username);
        req.session.username = result.username;
        req.session.email = email;
        req.session.admin = result.admin? true: false;

        res.redirect('/api/products')
    }
});


export default router;