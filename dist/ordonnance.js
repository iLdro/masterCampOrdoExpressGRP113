const Ordonnance = require('../model/ordonnance');
const Doc = require('../model/doc');

const getOrdonnance = async (req, res) => {
    var id = req.body.id;
    try {
        var ordonnance = await Ordonnance.findById(id);
        if (!ordonnance) {
            return res.status(404).json({ message: 'Ordonnance not found' });
        }

        var currentDate = new Date();
        var ordonnanceDate = new Date(ordonnance.dateDeCréation);

        var threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
        console.log(threeMonthsAgo)

        if (ordonnanceDate < threeMonthsAgo) {
            ordonnance.expired = true;
            await ordonnance.save();
        }

        const ordonnanceObject = ordonnance.toObject();
        res.status(200).json(ordonnanceObject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getImages = async (req, res) => {
    var id = req.body.id;
    try {
        id = new Object(id);
        var ordonnance = await Doc.findById(id);
        if (!ordonnance) {
            return res.status(404).json({ message: 'Ordonnance not found' });
        }
        else {
            res.status(200).json(ordonnance);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const createOrdonnance = async (req, res) => {
    const { client_id, medecin_id, medicaments, } = req.body;
    console.log(req.body);
    const ordonnance = new Ordonnance({
        client_id: client_id,
        medecin_id: medecin_id,
        medicaments: medicaments,
        pharmacien_id: null,
        dateDeCréation: Date.now(),
        expired: false,
    });
    try {
        const newOrdonnance = await ordonnance.save();
        res.status(201).json(newOrdonnance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const modifyOrdonnance = async (req, res) => {
    const { id, pharmacien_id, medicaments } = req.body;
    try {

        var ordonnance = await Ordonnance.findById(id);
        if (!ordonnance) {
            return res.status(404).json({ message: 'Ordonnance not found' });
        }
        ordonnance.pharmacien_id = pharmacien_id;
        ordonnance.medicaments = medicaments;
        ordonnance.expired = false;
        await ordonnance.save();
        res.status(200).json(ordonnance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const validateOrdonnance = async (req, res) => {
    const { id } = req.body;
    try {
        var ordonnance = await Ordonnance.findById(id);
        if (!ordonnance) {
            return res.status(404).json({ message: 'Ordonnance not found' });
        }
        ordonnance.expired = true;
        await ordonnance.save();
        res.status(200).json(ordonnance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}








module.exports = { createOrdonnance, modifyOrdonnance, getOrdonnance, getImages, validateOrdonnance };

