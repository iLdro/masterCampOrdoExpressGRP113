const Pharmacian = require('../model/pharmarciens');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const mdp = require('../private/mailpass');
const bcrypt = require('bcrypt');


const createMed = async (req, res) => {
    var { name, firstname, email, numberStreet, street, city, postalCode, phamarcieName, phoneNumber, RPPS} = req.body;
    var validate = false;
    var password_to_send = Math.random().toString(36).slice(-8);
    var password = await bcrypt.hash(password_to_send, 10);
    const pharmacian = new Pharmacian({
        name,
        firstname,
        email,
        password,
        numberStreet,
        street,
        city,
        postalCode,
        phamarcieName,
        phoneNumber,
        RPPS,
        validate
    });

    try {
        const newPharmacian = await pharmacian.save();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mastercampordo2023@gmail.com ',
                pass: mdp
            }
        });
        const mailOptions = {
            from: 'OrdonnanceOnline',
            to: email,
            subject: 'Votre inscription sur OrdonnanceOnline',
            text : "Retrouver ci joint-votre mot de passe temporaire, nous reviendrons vers vous une fois votre inscription validée par nos services. \n" + password_to_send
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            }
            else {
                res.status(201).json(newPharmacian);
            }

        }
        );
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const getPendingPharmacien = async (req, res) => {
    try {
        const pharmacien = await Pharmacian.find({validate: false});
        res.status(200).json(pharmacien);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


module.exports = {createMed, getPendingPharmacien};