const Profile = require('../model/profile.js')
const ValidateProfile = require("../validation/Profile")


/**const AddProfile = async (req, res,imageUrl) => {
    const { errors, isValid } = ValidateProfile(req.body);

    if (!isValid) {
        return res.status(400).json(errors);  // Use 400 for bad request instead of 404
    }

    try {
        let profile = await Profile.findOne({ user: req.user._id });

        if (!profile) {
            // Create new profile if it doesn't exist
            req.body.user = req.user._id;
            profile = await Profile.create(req.body);
            return res.status(201).json({ message: 'Profile created successfully', profile });
        } else {
            // Update the profile if it exists
            const updatedProfile = await Profile.findOneAndUpdate(
                { user: req.user._id },
                req.body,
                { new: true }  // Return the updated document
            );
            return res.status(200).json({ message: 'Profile updated successfully', updatedProfile });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};*/
const AddProfile = async (req, res, imageUrl) => {
    const { errors, isValid } = ValidateProfile(req.body);  // Validate incoming data

    // If validation fails, return a 400 error with validation messages
    if (!isValid) {
        return res.status(400).json(errors);
    }

    try {
        // Check if a profile already exists for the current user
        let profile = await Profile.findOne({ user: req.user._id });

        if (!profile) {
            // If no profile exists, create a new one
            req.body.user = req.user._id;
            if (imageUrl) {
                req.body.imageUrl = imageUrl; // Assign the image URL from Cloudinary
            }
            profile = await Profile.create(req.body); // Create the profile

            // Return the success response with the created profile
            return res.status(201).json({ message: 'Profile created successfully', profile });
        } else {
            // If a profile already exists, update it
            if (imageUrl) {
                req.body.imageUrl = imageUrl; // Update the image URL if it's provided
            }

            const updatedProfile = await Profile.findOneAndUpdate(
                { user: req.user._id }, // Find profile by user ID
                req.body, // Updated data
                { new: true }  // Return the updated profile
            );

            // Return the success response with the updated profile
            return res.status(200).json({ message: 'Profile updated successfully', updatedProfile });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};




const FindAllProfiles = async (req, res) => {
    try {
        // Populate 'user' instead of 'users'
        const profiles = await Profile.find().populate('user', ["name", "email", "role"]);

        // If there are no profiles, you might want to return a specific message
        if (profiles.length === 0) {
            return res.status(404).json({ message: "No profiles found" })
        }

        res.status(200).json(profiles);
    } catch (error) {
        console.error("Error fetching profiles:", error);
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const FindSingleProfile = async (req, res) => {
    try {
      // Check if req.user exists to ensure authentication worked
      if (!req.user || !req.user._id) {
        return res.status(400).json({ message: 'User ID not found in request.' });
      }
          console.log(req.user._id)
      // Find the profile for the authenticated user
      const data = await Profile.findOne({ user: req.user._id }).populate('user', ['name', 'email', 'role']);
  
      // If no profile is found for this user
      if (!data) {
        return res.status(404).json({ message: 'Profile not found for this user.' });
      }
  
      // Successful response with the profile data
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
  
      // Return a more specific error message
      res.status(500).json({ message: 'Server error', error: error.message || error });
    }
  };
  
  module.exports = { FindSingleProfile };
  

const DeleteProfile = async (req ,res)=>{
    try {
        const data =  await Profile.findOneAndDelete({_id: req.params.id})
        res.status(200).json({message: "deleted"})
 
     } catch (error) {
         res.status(404).json(error.message)
     }
}

module.exports = {
    AddProfile,
    FindAllProfiles,
    FindSingleProfile,
    DeleteProfile
}