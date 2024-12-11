const express = require('express')

const router = express.Router()

const { AddProfile, FindAllProfiles, FindSingleProfile, DeleteProfile ,AdminDashboard} = require('../controller/profile.js')

const passport = require('passport')
const { ROLES, inRole } = require('../security/Rolemiddleware')
const { cloudinary } = require('../utils/cloudinary.js');
const upload = require('../middleware/multer.js')


router.get('/admin',passport.authenticate("jwt", { session: false }),inRole(ROLES.ADMIN),AdminDashboard)


/* add profile route */
router.post("/add",
  passport.authenticate("jwt", { session: false }),
  AddProfile);
/* get all profiles */
router.get("/getAll",
  passport.authenticate("jwt", { session: false }),
  inRole(ROLES.ADMIN),
  FindAllProfiles);
/* get one profiles */
router.get("/profile",
  passport.authenticate("jwt", { session: false }),
  FindSingleProfile);
/* delete profiles */
router.delete("/:id",
  passport.authenticate("jwt", { session: false }),
  inRole(ROLES.ADMIN),
  DeleteProfile);

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res.secure_url
}
router.post("/upload", passport.authenticate("jwt", { session: false }),
  upload.single("my_file"), async (req, res) => {
    console.log("Multer processed file:", req.file);
    
    /*if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }*/

    try {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const imageUrl = await handleUpload(dataURI);

      // Ensure newProfile does not have any circular structure
      const newProfile = await AddProfile(req, res, imageUrl);

      // Send the response only once, after all processing is complete
      return res.json(newProfile);
    } catch (error) {
      console.error(error);

      // Ensure error response is sent only once
      /**if (!res.headersSent) {
        return res.status(500).json({ message: error.message });
      }*/
    }
  });


  

module.exports = router
