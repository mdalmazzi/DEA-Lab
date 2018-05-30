var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var schema = new Schema({
    content: { type: String, required: false },
    testo: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    livello: { type: Number, required: false },
    titolo: { type: Boolean, required: false },
    numero_mappa: { type: Number, required: false },
    color: { type: String, required: false },
    rectangle: { type: { top: Number, bottom: Number, left: Number, right: Number, height: Number, width: Number }, required: false },
    //order: { type: String, required: false }
    order: { type: Number, required: false },
    inMap: { type: Boolean, required: false },
    intestazione: { type: Boolean, required: false },
    testo_mappa: { type: String, required: false },
    stato: { type: Number, required: false },

});

schema.post('remove', function(mappa) {
    User.findById(mappa.user, function(err, user) {
        user.mappa.pull(mappa);
        user.save();

    })
});

module.exports = mongoose.model('Mappa', schema);