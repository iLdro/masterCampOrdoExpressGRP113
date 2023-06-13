const User = require('../model/users.js');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    const { firstname, name, email, password, carteVitale } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        firstname,
        name,
        email,
        encryptedPassword,
        carteVitale
    });
    
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    }


const deleteUser = async (req, res) => {
    try {
        await res.user.remove();
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    }



module.exports = createUser;
module.exports = deleteUser;
