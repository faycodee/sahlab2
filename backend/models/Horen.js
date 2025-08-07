const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Define the schema for Hören
const HorenSchema = new Schema(
  {
    teil1: [
      {
        id: { type: Number, required: true },
        text: { type: String, required: true },
        antwort: { type: Number, required: true },
        begründung: { type: String, required: true },
        options: [
          {
            id: { type: String, required: true },
            code: { type: Number, required: true },
          },
        ],
      },
    ],
    teil2: [
      {
        id: { type: Number, required: true },
        text: { type: String, required: true },
        antwort: { type: Number, required: true },
        begründung: { type: String, required: true },
        options: [
          {
            id: { type: String, required: true },
            code: { type: Number, required: true },
          },
        ],
      },
    ],
    teil3: [
      {
        id: { type: Number, required: true },
        text: { type: String, required: true },
        antwort: { type: Number, required: true },
        begründung: { type: String, required: true },
        options: [
          {
            id: { type: String, required: true },
            code: { type: Number, required: true },
          },
        ],
      },
    ],
  },

  { collection: "HÖREN" }
);

// Create the model
const Horen = mongoose.model("Horen", HorenSchema);

module.exports = Horen;
