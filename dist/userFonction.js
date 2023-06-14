const User = require('../model/users.js');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    var { firstname, name, email, password, carteVitale } = req.body;
    var password = await bcrypt.hash(password, 10);
    var carteVitale = await bcrypt.hash(carteVitale, 20);
    const user = new User({
        firstname,
        name,
        email,
        password,
        carteVitale
    });
    
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    }

module.exports = createUser;
