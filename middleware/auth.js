const jwt = require('jsonwebtoken');

const { User } = require('../models/user');

exports.authenticate = async (req, res, next) => {

    try { 

    const auth = req.headers.authorization;

        if (!auth || !auth.startsWith('Bearer ') ) {
            return res.status(401).json({
                 message: 'Authorization token missing'
                });
        }

        const token = auth.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);

        if(!user) {
            return res.status(401).json({
                message: 'User associated with this token no longer exists'
            });
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }


};