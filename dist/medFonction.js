const Meds = require('../model/meds');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongoose').Types;



const createMed = async (req, res) => {
    var { name, firstname, numberStreet, street, city, postalCode, phoneNumber, email, profINSEE, RPPS, signature, intitule } = req.body;
    var validation = false;
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
        validation,
        intitule
    });

    try {
        const newMed = await med.save();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mastercampordo2023@gmail.com',
                pass: process.env.MAILPASS
            }
        });
        const mailOptions = {
            from: 'OrdonnanceOnline',
            to: email,
            subject: 'Votre inscription sur OrdonnanceOnline',
            text: "Retrouver ci joint-votre mot de passe temporaire, nous reviendrons vers vous une fois votre inscription validée par nos services. \n" + password_tosend
        };
        transporter.sendMail(mailOptions, function (error, info) {
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

const getPendingMed = async (req, res) => {
    try {
        const meds = await Meds.find({ validation: false });
        res.status(200).json(meds);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const validateMed = async (req, res) => {
    const { id } = req.body;
    try {
        console.log(id);
        const objectId = new ObjectId(id);
        console.log(objectId);
        const med = await Meds.findById(objectId);
        if (!med) {
            return res.status(404).json({ message: 'Med not found' + id + ' ' + objectId });
        }
        med.validation = true;
        await med.save();
        const medObject = med.toObject();
        res.status(200).json(medObject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const getMedById = async (req, res) => {
    console.log(req.body);
    const { id } = req.body;
    try {
        const objectId = new Object(id);
        const med = await Meds.findById(objectId);
        if (!med) {
            return res.status(404).json({ message: 'Med not found' });
        }
        const medObject = med.toObject();
        res.status(200).json(medObject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


const declineMed = async (req, res) => {
    const { id } = req.body;
    try {
        const objectId = new ObjectId(id);
        const med = await Meds.findByIdAndDelete(objectId);
        if (!med) {
            return res.status(404).json({ message: 'Med not found' });
        }
        const medObject = med.toObject();

        res.status(200).json(medObject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const changePasswordMed = async (req, res) => {
    const { id, password, newPassword } = req.body;
    console.log(req.body);
    try {
        const objectId = new Object(id);
        const med = await Meds.findById(objectId);
        if (!med) {
            return res.status(404).json({ message: 'Medecin not found' });
        }
        console.log(med);




        const isPasswordCorrect = await bcrypt.compare(password, med.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        med.password = hashedPassword;
        await med.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}






module.exports = { createMed, getPendingMed, validateMed, getMedById, declineMed, changePasswordMed };