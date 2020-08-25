const jwt = require('jsonwebtoken');

/**
 * Veriry token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
let verifyToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                code: 401,
                err: {
                    message: 'invalid token'
                }
            });
        }
        req.user = decoded.user;
        next();
    });

};

/**
 * Verify role
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
let verifyRole = (req, res, next) => {

    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            code: 401,
            err: {
                message: 'invalid role'
            }
        });
    }
};

module.exports = {
    verifyToken,
    verifyRole
}