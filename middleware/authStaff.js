const jwt = require('jsonwebtoken')
const Staff = require('../model/staff.model')

const authStaff = async(req, res, next) => {
   //  console.log(req.header('Authorization'));
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.JWT_KEY)
    try {
        const staff = await Staff.findOne({ _id: data._id, 'tokens.token': token })
        if (!staff) {
            throw new Error()
        }
        req.staff = staff
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized staff to access this resource' })
    }
}
module.exports = authStaff;