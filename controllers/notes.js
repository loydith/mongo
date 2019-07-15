
// var db = require("../models");
var Note = require("../models/Note");
var makeDate = require("../scripts/date");

module.exports = {
  get: function(data, cb){
    Note.find({
      _headlineId: data._id
    }, cb);
    },
  
  save: function(data, cb) {
    var newNote = {
      _headlineId: data._id,
      data: makeDate(),
      noteText: data.noteText
    };
    Note.create(newNote, function(err, doc){
      if(err){
        console.log(err);
      }
      else{
        console.log(doc);
        cb(doc);
      }
    });
  },
  // Delete a note with a given id
  delete: function(data, cb) {
    Note.remove({ _id: data._id 
    }, cb);
  },

  // Find one note
  // find: function(req, res) {
  //   db.Note.find({ _headlineId: req.params.id }).then(function(dbNote) {
  //     res.json(dbNote);
  //   });
  // },
  // Create a new note
  // create: function(data, cb) {
  //   Note.create({_id: data._id
  //     }, cb);
  // },
  
};
