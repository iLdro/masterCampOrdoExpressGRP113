const Pharmacian = require('../model/pharmarciens');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');


const createPharmacian = async (req, res) => {
    var { name, firstname, email, numberStreet, street, city, postalCode, phamarcieName, phoneNumber, RPPS} = req.body;
    var validation = false;
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
        validation
    });

    try {
        const newPharmacian = await pharmacian.save();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mastercampordo2023@gmail.com ',
                pass: process.env.MAILPASS
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
        const pharmacien = await Pharmacian.find({validation: false});
        res.status(200).json(pharmacien);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const validatePharmacien = async (req, res) => {
    const { id } = req.body;
    try {
        const objectId = mongoose.Types.ObjectId(id);
        const pharmacien = await Pharmacian.findById(objectId); 
        pharmacien.validation = true;
        const pharmObject = pharmacien.toObject();
        res.status(200).json(pharmObject);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


const deletePharmacien = async (req, res) => {
    const { id } = req.body;
    try {
        const objectId = mongoose.Types.ObjectId(id);
        const pharmacien = await Pharmacian.findByIdAndDelete(objectId);
        res.status(200).json(pharmacien);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }   
}


module.exports = {createPharmacian, getPendingPharmacien, validatePharmacien, deletePharmacien};
