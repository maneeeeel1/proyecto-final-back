require("dotenv").config()

const login = (req,res) =>{
    const { username, password } = req.body;

    const adminUsername= process.env.ADMIN_USERNAME;
    const adminPassword= process.env.ADMIN_PASSWORD;

    if( username === adminUsername && password === adminPassword){
        req.session.user = {username};
        req.session.authenticated = true;
        res.json({message: "Login correcto"});

    }else{
        res.status(401).json({error: "Login incorrecto"});
    }
}

const checkAuth = (req, res) =>{
    if (req.session?.user?.username === process.env.ADMIN_USERNAME){
        res.json({authenticated: true});
    }else{
        res.json({authenticated: false});
    }
}

const logout = (req,res) =>{
    req.session.destroy((err) =>{
        if(err) {
            return res.status(500).json({error: "Error al cerrar sesión"});
        }
        res.clearCookie("connect.sid");
        res.json({message: "Sesión cerada"});
    })
}
module.exports = { login, checkAuth, logout };