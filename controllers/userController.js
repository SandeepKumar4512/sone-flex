// Get User Profile
const getUserProfile = (req, res) => {
  // sample response
  res.json({
    id: 1,
    name: "Sone Flex User",
    phone: "9876543210",
  });
};

// Update User Profile
const updateUserProfile = (req, res) => {
  const { name, photo } = req.body;
  // sample response
  res.json({
    message: "Profile updated",
    name,
    photo
  });
};

module.exports = { getUserProfile, updateUserProfile };
