const Ordonnance = require('../model/ordonnance');

const getOrdonnance = async (req, res) => {
    var id = req.body.id;
    try {   
        id = new Object(id);
        var ordonnance = await Ordonnance.findById(id);
        if (!ordonnance) {
            return res.status(404).json({ message: 'Ordonnance not found' });
        }
        const ordonnanceObject = ordonnance.toObject();
        res.status(200).json(ordonnanceObject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getOrdonnance = getOrdonnance;

