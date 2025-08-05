const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the schema for LESEN
const LesenSchema = new Schema(
{
  id: { type: Number, required: true },
  thema: { type: String, required: true },
  themaTr: { type: String, required: true },
  teile: {
    teil1: {
      titel: { type: String, required: true },
      photo: { type: String, required: true },
      Überschriften: [
        {
          id: { type: String, required: true },
          text: { type: String, required: true },
        },
      ],
      Texte: [
        {
          id: { type: Number, required: true },
          text: { type: String, required: true },
          antwort: { type: String, required: true },
          fazit: { type: String, required: true },
        },
      ],
    },
    teil2: {
      titel: { type: String, required: true },
      photo: { type: String, required: true },
      text: { type: String, required: true },
      fragen: [
        {
          id: { type: Number, required: true },
          text: { type: String, required: true },
          options: [
            {
              id: { type: String, required: true },
              text: { type: String, required: true },
            },
          ],
          antwort: { type: String, required: true },
          begründung: { type: String, required: true },
        },
      ],
      fazit: [{ type: String, required: true }],
    },
    teil3: {
      titel: { type: String, required: true },
      situationen: [
        {
          id: { type: Number, required: true },
          text: { type: String, required: true },
        },
      ],
      anzeigen: [
        {
          id: { type: String, required: true },
          text: { type: String, required: true },
          antwort: { type: Number, required: true },
          fazit: { type: String, required: true },
        },
      ],
    },
  },
  sprachb: {
    teil1: {
      text: { type: String, required: true },
      fragen: [
        {
          id: { type: Number, required: true },
          options: [
            {
              id: { type: String, required: true },
              text: { type: String, required: true },
            },
          ],
          antwort: { type: String, required: true },
          begründung: { type: String, required: true },
        },
      ],
    },
    teil2: {
      text: { type: String, required: true },
      options: [
        {
          id: { type: String, required: true },
          text: { type: String, required: true },
          antwort: { type: Number, required: true },
          begründung: { type: String, required: true },
        },
      ],
    },
  },
},
{ collection: 'LESEN' } );

// Create the model
const Lesen = mongoose.model('Lesen', LesenSchema);

module.exports = Lesen;