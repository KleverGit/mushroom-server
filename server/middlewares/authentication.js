const jwt = require('jsonwebtoken');

// next continua con la funcionalidad
let verificarToken = (req, resp, next) => {
    // obtiene token del header
    let token = req.get('Authorization');

    // verifica el token enviado sea valido
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return resp.status(401).json({
                code: 401,
                message: err
            })
        }
        // Se setea en el req el usuario
        req.usuario = decoded.usuario;
        next();
    });
}


/**
 * Metodo que verifica si la peticion lo realiza un rol ADMIN
 * @param {req} request
 * @param {response} response
 * @param {callback} next callback
 */
let verificarAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.rol === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            code: 401,
            message: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

module.exports = {
    verificarToken: verificarToken,
    verificarAdminRole: verificarAdminRole
}