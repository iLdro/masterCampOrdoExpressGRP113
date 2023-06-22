const User = require('../model/users.js');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


const createUser = async (req, res) => {
    var { firstname, name, email, password, carteVitale } = req.body;
    var password = await bcrypt.hash(password, 10);
    var carteVitale = await bcrypt.hash(carteVitale, 10);
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


const resetPassword = async (req, res) => {
    const { mail } = req.body;
    try {
    // verifier que le password est bon
    // generer un nouveau password  
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        try {
             await User.findOneAndUpdate({ email: mail }, { $set: { password: hashedPassword } })
            }catch (error) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: "Password changed" });
    // envoyer le nouveau password par mail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mastercampordo2023@gmail.com ',
                pass: process.env.MAILPASS
            }
        });
        const mailOptions = {
            from: 'OrdonnanceOnline',
            to: mail,
            subject: 'Votre nouveau mot de passe',
            text : "Retrouver ci joint-votre nouveau mot de passe, nous vous conseillons de le changer dès votre prochaine connexion. \n" + randomPassword
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            }
            else {
                res.status(201).json(new_user);
            }

        }
        );




    } catch (error) {
        res.status(400).json({ message: error.message });
    }

}




const changePassword = async (req, res) => {
  const { id, password, newPassword } = req.body;
  try {
    const objectId = new Object(id);

    // Verify that the password is correct
    const user = await User.findById(objectId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Wrong password' });
    } else {

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      try {
        await User.findByIdAndUpdate(objectId, { password: hashedPassword });
        } catch (error) {
            console.log(error);
        return res.status(404).json({ message: 'User not found' });
        }

      return res.status(200).json({ message: 'Password changed' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUser = async (req,res) => {
    const { carteVitale } = req.body;
    try {
        encrypted = await bcrypt.hash(carteVitale, 10);
        const user = await User.findOne({carteVitale: encrypted});
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}




module.exports = {createUser, resetPassword, changePassword, getUser} ;
