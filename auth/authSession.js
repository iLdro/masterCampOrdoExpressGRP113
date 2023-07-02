const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/users.js')
const Med = require('../model/meds.js')
const Pharmacian = require('../model/pharmarciens.js')
const Admin = require('../model/admin.js')
// const Token = require('../model/token')

// const newTokendb = (user, type,new_token) => {
//     const newToken = new Token({
//         token: new_token,
//         id: user._id,
//         type: type,
//         date: Date.now(),
//     });
//     newToken.save();
// }


const startUserSession = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).send('User not found');
    }

    const same = await bcrypt.compare(password, user.password);

    if (!same) {
      return res.status(401).send('Wrong password');
    }

    const token = jwt.sign({ id: user._id, userType: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    try {
      req.session.token = token;
      req.session.user = user;
      req.session.userType = 1;

    } catch (error) {
      console.log(error);
    }

    try {
      req.session.save();
    } catch (error) {
      console.log("cannot save", error);
    }


    //   newTokendb(user, 1, token);
    return res.status(200).send(token);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal server error');
  }
};


const startMedSession = async (req, res) => {

  try {
    const { email, password } = req.body;

    const med = await Med.findOne({ email: email });

    if (!med) {
      return res.status(401).send('User not found');
    }
    const same = await bcrypt.compare(password, med.password);

    if (!same) {
      return res.status(401).send('Wrong password');
    }

    if (med.validation === false) {
      return res.status(401).send('Account not verified');
    }

    const token = jwt.sign({ id: med._id, userType: 2 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    try {
      req.session.token = token;
      req.session.user = med;
      req.session.userType = 2;
    } catch (error) {
      console.log(error);
    }
    return res.status(200).send(token);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal server error', error);
  }
};

const startPharmacianSession = async (req, res) => {
  try {
    const { email, password } = req.body;

    const pharmacian = await Pharmacian.findOne({ email: email });

    if (!pharmacian) {
      return res.status(401).send('User not found');
    }

    const same = await bcrypt.compare(password, pharmacian.password);

    if (!same) {
      return res.status(401).send('Wrong password');
    }

    if (pharmacian.validation === false) {
      return res.status(401).send('Account not verified');
    }

    const token = jwt.sign({ id: pharmacian._id, userType: 3 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    try {
      req.session.token = token;
      req.session.user = pharmacian;
      req.session.userType = 3;
    } catch (error) {
      console.log(error);
    }
    return res.status(200).send(token);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal server error');
  }
};


const startAdminSession = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email });

    if (!admin) {
      return res.status(401).send('User not found');
    }

    const same = await bcrypt.compare(password, admin.password);

    if (!same) {
      return res.status(401).send('Wrong password');
    }

    const token = jwt.sign({ id: admin._id, userType: 0 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    try {
      req.session.token = token;
      req.session.user = admin;
      req.session.userType = 4;
    } catch (error) {
      console.log(error);
    }
    return res.status(200).send(token);
  }
  catch (error) {
    console.log(error);
    return res.status(500).send('Internal server error');
  }
}





module.exports = { startUserSession, startMedSession, startPharmacianSession, startAdminSession }