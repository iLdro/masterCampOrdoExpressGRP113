const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/users.js')

const startUserSession = (req, res) => {
    const { email, password } = req.body

    User.findOne({ email: email }, (err, user) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal server error')
        } else if (!user) {
            res.status(401).send('User not found')
        } else {
            bcrypt.compare(password, user.password, (err, same) => {
                if (err) {
                    console.log(err)
                    res.status(500).send('Internal server error')
                } else if (!same) {
                    res.status(401).send('Wrong password')
                } else {
                    const token = jwt.sign({ id: user._id, userType: 1 }, process.env.JWT_SECRET)
                    req.session.token = token
                    res.status(200).send('User logged in')
                }
            })
        }
    }
    )
}


module.exports = startUserSession