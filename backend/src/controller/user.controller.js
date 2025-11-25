import User from "../model/User.Model.js";

export const searchByCode = async (req, res) => {
  try {
    const { code } = req.params;


    const user = await User.findOne({ uniqueCode: code }).select(
      "firstName lastName profilePic uniqueCode"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error in searchByCode:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// add friend
export const addFriend = async (req, res) => {

  try {
    const myId = req.user._id;               
    const friendId = req.params.friendId;    

    const me = await User.findById(myId);
    const friend = await User.findById(friendId);

    if (!me || !friend)
      return res.status(404).json({ message: "User not found" });

    if (!me.friends.includes(friendId)) me.friends.push(friendId);
    if (!friend.friends.includes(myId)) friend.friends.push(myId);

    await me.save();
    await friend.save();

    res.json({ message: "Friend added successfully" });
  } catch (err) {
    console.error("Error in addFriend:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFriendsList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends", "_id firstName lastName avatar uniqueCode");
    res.json({ friends: user.friends });
  } catch (error) {
    res.status(500).json({ message: "Failed to get friends" });
  }
}

