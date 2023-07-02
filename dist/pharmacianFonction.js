const Pharmacian = require('../model/pharmarciens');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');


const createPharmacian = async (req, res) => {
    var { name, firstname, email, numberStreet, street, city, postalCode, phamarcieName, phoneNumber, RPPS } = req.body;
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
            text: "Retrouver ci joint-votre mot de passe temporaire, nous reviendrons vers vous une fois votre inscription validée par nos services. \n" + password_to_send
        };
        transporter.sendMail(mailOptions, function (error, info) {
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
        const pharmacien = await Pharmacian.find({ validation: false });
        res.status(200).json(pharmacien);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const validatePharmacien = async (req, res) => {
    const { id } = req.body;
    try {
        console.log(id);
        const objectId = new Object(id);
        const pharmacien = await Pharmacian.findById(objectId);
        pharmacien.validation = true;
        await pharmacien.save();
        const pharmObject = pharmacien.toObject();
        res.status(200).json(pharmObject);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


const declinePharmarcien = async (req, res) => {
    const { id } = req.body;
    try {
        const objectId = new Object(id);
        const pharmacien = await Pharmacian.findByIdAndDelete(objectId);
        res.status(200).json(pharmacien);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getPharmacienById = async (req, res) => {
    const { id } = req.body;
    try {
        const objectId = new Object(id);
        const pharmacien = await Pharmacian.findById(objectId);
        res.status(200).json(pharmacien);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const changePasswordPharmacien = async (req, res) => {
    const { id, password, newPassword } = req.body;
    try {
        const objectId = new Object(id);
        const pharmacien = await Pharmacian.findById(objectId);
        const isMatch = await bcrypt.compare(password, pharmacien.password);
        if (isMatch) {
            pharmacien.password = await bcrypt.hash(newPassword, 10);
            await pharmacien.save();
            res.status(200).json(pharmacien);
        }
        else {
            res.status(404).json({ message: "Mot de passe incorrect" });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}





module.exports = { createPharmacian, getPendingPharmacien, validatePharmacien, declinePharmarcien, getPharmacienById, changePasswordPharmacien };
