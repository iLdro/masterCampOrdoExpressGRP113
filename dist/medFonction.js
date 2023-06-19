const Meds = require('../model/meds');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongoose').Types;



const createMed = async (req, res) => {
    var { name, firstname, numberStreet, street, city, postalCode, phoneNumber, email, profINSEE, RPPS, signature} = req.body;
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
        validation
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

const getPendingMed = async (req, res) => {
    try {
        const meds = await Meds.find({validation: false});
        res.status(200).json(meds);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const validateMed = async (req, res) => {
    const { id } = req.body;
    try {
      const objectId = new ObjectId(id);
      console.log(objectId);
      const med = await Meds.findById(objectId);
      if (!med) {
        return res.status(404).json({ message: 'Med not found' + id + ' ' + objectId});
      }
      med.validation = true;
    await med.save();
      const medObject = med.toObject();
      res.status(200).json(medObject);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  
const getMedById = async(req, res) => {
    const { id } = req.params;
    try {
        const objectId = new ObjectId(id);
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



module.exports = {createMed, getPendingMed, validateMed , getMedById};