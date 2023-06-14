const Meds = require('../model/meds');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const mdp = require('../private/mailpass');
const bcrypt = require('bcrypt');


const createMed = async (req, res) => {
    var { name, firstname, numberStreet, street, city, postalCode, phoneNumber, email, profINSEE, RPPS, signature} = req.body;
    var validate = false;
    //Generate a random password
    var password_tosend = Math.random().toString(36).slice(-8);
    //Hash the password
    var password = await bcrypt.hash(password_tosend, 10);
    const med = new Meds({
        name,
        firstname,
        numberStreet,
        street,
        city,
        postalCode,
        phoneNumber,
        email,
        password,
        profINSEE,
        RPPS,
        signature,
        validate
    });
    
    try {
        const newMed = await med.save();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mastercampordo2023@gmail.com',
                pass: mdp
            }
        });
        const mailOptions = {
            from: 'mastercampordo2023@gmail.com',
            to: email,
            subject: 'Votre inscription sur OrdonnanceOnline',
            text : "Retrouver ci joint-votre mot de passe temporaire, nous reviendrons vers vous une fois votre inscription validée par nos services. \n" + password_tosend
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            }
            else {
                res.status(201).json(newMed);
            }

        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    }

module.exports = createMed;