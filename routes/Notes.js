const express = require("express");
const axios = require("axios");
const Note = require("../models/Note");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// POST /api/notes/summarize
router.post("/summarize", auth, async (req, res) => {
  const { original, category } = req.body;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful note summarizer. Summarize the following note in **2-3 sentences max**. Be concise and retain only the key points.",
          },
          {
            role: "user",
            content: original,
          },
        ],
        temperature: 0.5, // ✅ ADD THIS LINE
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data.choices[0].message.content;

    const note = new Note({
      userId: req.user.id,
      original,
      summary,
      category,
    });

    await note.save();
    res.json(note);
  } catch (error) {
    console.error(
      "❌ Error summarizing note:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: error.response?.data?.error?.message || "Failed to summarize note",
    });
  }
});

// GET /api/notes
router.get("/", auth, async (req, res) => {
  const notes = await Note.find({ userId: req.user.id }).sort({ _id: -1 });
  res.json(notes);
});

// DELETE /api/notes/:id
router.delete("/:id", auth, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note deleted" });
});

module.exports = router;
