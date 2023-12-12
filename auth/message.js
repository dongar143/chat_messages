var mongoose = require('mongoose');  
var messageSchema = new mongoose.Schema({  
  message: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
mongoose.model('message', messageSchema);

module.exports = mongoose.model('message');