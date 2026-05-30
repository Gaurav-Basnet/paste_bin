const mongoose = require("mongoose");


const pasteSchema = new mongoose.Schema(    
  {
    title: {
      type: String,
      default: "Untitled Paste"
    },

    content: {
      type: String,
      required: true
    },

    shortId: {
      type: String,
      required: true,
      unique: true
    },

    expiresAt: {
      type: Date,
      default: null
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);
pasteSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);


const Paste = mongoose.model('paste',pasteSchema);
module.exports=Paste;