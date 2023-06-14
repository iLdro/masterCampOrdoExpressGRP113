const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/users.js')
const Med = require('../model/meds.js')
const Pharmacian = require('../model/pharmarciens.js')

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
                    res.status(200).send(token)
                }
            })
        }
    }
    )
}

const startMedSession = (req, res) => {
    const { email, password } = req.body

    Med.findOne({ email: email }, (err, med) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal server error')
        } else if (!med) {
            res.status(401).send('Med not found')
        } else {
            bcrypt.compare(password, med.password, (err, same) => {
                if (err) {
                    console.log(err)
                    res.status(500).send('Internal server error')
                } else if (!same) {
                    res.status(401).send('Wrong password')
                } else {
                    const token = jwt.sign({ id: med._id, userType: 2 }, process.env.JWT_SECRET)
                    req.session.token = token
                    res.status(200).send(token)
                }
            })
        }
    }
    )
}

const startPharmacianSession = (req, res) => {
    const { email, password } = req.body

    Pharmacian.findOne({ email: email }, (err, pharmacian) => {
        if (err) {
            console.log(err)
            res.status(500).send('Internal server error')
        } else if (!pharmacian) {
            res.status(401).send('Pharmacian not found')
        } else {
            bcrypt.compare(password, pharmacian.password, (err, same) => {
                if (err) {
                    console.log(err)
                    res.status(500).send('Internal server error')
                } else if (!same) {
                    res.status(401).send('Wrong password')
                } else {
                    const token = jwt.sign({ id: pharmacian._id, userType: 3 }, process.env.JWT_SECRET)
                    req.session.token = token
                    res.status(200).send(token)
                }
            })
        }
    }
    )
}


// const startAdminSession = (req, res) => {
//     const { email, password } = req.body

//     Admin.findOne({ email: email }, (err, admin) => {
//         if (err) {
//             console.log(err)
//             res.status(500).send('Internal server error')
//         } else if (!admin) {
//             res.status(401).send('Admin not found')
//         } else {
//             bcrypt.compare(password, admin.password, (err, same) => {
//                 if (err) {
//                     console.log(err)
//                     res.status(500).send('Internal server error')
//                 } else if (!same) {
//                     res.status(401).send('Wrong password')
//                 } else {
//                     const token = jwt.sign({ id: admin._id, userType: 4 }, process.env.JWT_SECRET)
//                     req.session.token = token
//                     res.status(200).send(token)
//                 }
//             })
//         }
//     }
//     )
// }





module.exports = {startUserSession , startMedSession , startPharmacianSession}