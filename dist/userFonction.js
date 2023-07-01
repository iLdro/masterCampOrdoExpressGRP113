const User = require('../model/users.js');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Ordonnance = require('../model/ordonnance.js');


const createUser = async (req, res) => {
  var { firstname, name, email, password, carteVitale, dateNaissance } = req.body;
  var password = await bcrypt.hash(password, 10);
  const user = new User({
    firstname,
    name,
    email,
    password,
    carteVitale,
    dateNaissance
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
    } catch (error) {
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
      text: "Retrouver ci joint-votre nouveau mot de passe, nous vous conseillons de le changer dès votre prochaine connexion. \n" + randomPassword
    };
    transporter.sendMail(mailOptions, function (error, info) {
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

const getUser = async (req, res) => {
  const { carteVitale } = req.body;
  try {
    try {
      const user = await User.findOne({ carteVitale: carteVitale });
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}


const getUserById = async (req, res) => {
  console.log(req.body);
  const { id } = req.body;
  try {
    const objectId = new Object(id);
    try {
      const user = await User.findById(objectId);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}



const getOrdonnances = async (req, res) => {
  const { id } = req.body;
  try {
    const objectId = new Object(id);
    try {
      const ordonnances = await Ordonnance.find({ client_id: objectId });
      res.status(200).json(ordonnances);

      const updateOrdonnances = ordonnances.map(async (ordonnance) => {
        var ordonnanceDate = new Date(ordonnance.dateDeCréation);
        var currentDate = new Date();

        var threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        if (ordonnanceDate < threeMonthsAgo) {
          ordonnance.expired = true;
          await ordonnance.save();
        }
      });

      await Promise.all(updateOrdonnances);
    } catch (error) {
      res.status(404).json({ message: 'Ordonnances not found' });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};








module.exports = { createUser, resetPassword, changePassword, getUser, getUserById, getOrdonnances };
