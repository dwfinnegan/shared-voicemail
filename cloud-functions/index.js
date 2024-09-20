const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();

const db = getFirestore();
const collection = 'sharedVoicemail';

exports.sharedVoicemail = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type, Accept, x-userid");
    return res.status(204).send('');
  }


  // Ping/Pong
  if (req.path === "/ping") {
    return res.status(200).json({ status: "200", message: "Pong" })
  }


  // Write MWI status to Firestore
  if ((req.path === "/") && (req.method === "POST")) {
    try {
      const data = req.body.data;
      await db.collection(collection).doc(req.body.name).set(req.body.data)
      return res.status(200).json({ status: "200", message: "accepted" })
    } catch (error) {
      return res.status(500).json({ status: "500", message: "an error occurred", error: error.message })
    }
  }

}