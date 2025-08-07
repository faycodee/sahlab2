const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SchreibenSchema = new Schema({
  id: { type: Number, required: true },
  themaName: { type: String, required: true },
  punkt1: {
    id: { type: Number, required: true },
    frage: { type: String, required: true },
    antwort: { type: String, required: true }
  },
  punkt2: {
    id: { type: Number, required: true },
    frage: { type: String, required: true },
    antwort: { type: String, required: true }
  },
  punkt3: {
    id: { type: Number, required: true },
    frage: { type: String, required: true },
    antwort: { type: String, required: true }
  }
}, { collection: "SCHREIBEN" });

// More explicit export
const Schreiben = mongoose.model("Schreiben", SchreibenSchema);


module.exports = Schreiben;