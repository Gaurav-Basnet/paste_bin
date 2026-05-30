const Paste = require("../model/Paste");
const { nanoid } = require("nanoid");

const createPaste = async (req, res) => {
  try {
    const { title, content, expiresIn } = req.body;

    // 1. Validate input
    if (!content) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    // 2. Generate unique ID
    const shortId = nanoid(6);

    // 3. Handle expiration logic
    let expiresAt = null;

    if (expiresIn === "10m") {
      expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    } else if (expiresIn === "1h") {
      expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    } else if (expiresIn === "1d") {
      expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    // 4. Save to database
    const newPaste = await Paste.create({
      title: title || "Untitled Paste",
      content,
      shortId,
      expiresAt,
    });

    // 5. Send response
    return res.status(201).json({
      message: "Paste created successfully",
      url: `/p/${shortId}`,
      paste: newPaste,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getPaste = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find paste
    const paste = await Paste.findOne({ shortId: id });

    // 2. If not found
    if (!paste) {
      return res.status(404).json({
        message: "Paste not found",
      });
    }

    // 3. Check expiration
    if (paste.expiresAt && paste.expiresAt < new Date()) {
      return res.status(410).json({
        message: "Paste expired",
      });
    }

    // 4. Return paste
    return res.json({
      title: paste.title,
      content: paste.content,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deletePaste = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find paste first
    const paste = await Paste.findOne({ shortId: id });

    // 2. If not found
    if (!paste) {
      return res.status(404).json({
        message: "Paste not found",
      });
    }

    // 3. Delete it
    await Paste.deleteOne({ shortId: id });

    // 4. Send response
    return res.json({
      message: "Paste deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllPaste = async (req, res) => {
  try {
    const pastes = await Paste.find({}).sort({ createdAt: -1 });

    // if no pastes (array check)
    if (pastes.length === 0) {
      return res.status(404).json({
        message: "There are no pastes right now",
      });
    }

    return res.json({
      count: pastes.length,
      pastes: pastes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = { createPaste, getPaste, deletePaste ,getAllPaste };
