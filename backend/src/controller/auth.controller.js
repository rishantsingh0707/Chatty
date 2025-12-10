import { generateToken } from "../lib/utils.js";
import User from "../model/User.Model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;
        console.log(req.body);

        if (!email || !firstName || !password) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        function generateUniqueCode() {
            return Math.floor(100000 + Math.random() * 900000).toString();
        }

        let code;
        while (true) {
            code = generateUniqueCode();
            const exists = await User.findOne({ uniqueCode: code });
            if (!exists) break;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            uniqueCode: code
        });

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();
            res.status(201).json({
                user: {
                    _id: newUser._id,
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    uniqueCode: newUser.uniqueCode
                }
                ,
                message: "User created successfully"
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Error in signup" });
    }

};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        else {
            generateToken(user._id, res);
            res.status(200).json({
                user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    uniqueCode: user.uniqueCode
                },
                message: "Login successful",
            });
            console.log("Login successful for user:", user);
        }
    } catch (error) {
        res.status(500).json({ message: "Error in login" });
        console.error("Login Error:", error);
    }
};
export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Error in logout" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { firstName, lastName, profilePic } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let uploadedImage;

        if (profilePic) {
            uploadedImage = await cloudinary.uploader.upload(profilePic, {
                public_id: user.profilePicPublicId || `profile_${userId}`,
                overwrite: true
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                profilePic: uploadedImage?.secure_url || user.profilePic,
                profilePicPublicId: uploadedImage?.public_id || user.profilePicPublicId
            },
            { new: true }
        );

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Error in updating profile" });
    }
};

export const checkRoute = async (req, res) => {
    try {
        res.status(200).json({ user: req.user, message: "You are authorized to access this route" });
    } catch (error) {
        console.error("Check Route Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const searchByCode = async (req, res) => {
    try {
        const { code } = req.params;

        if (!code || code.length !== 6) {
            return res.status(400).json({ message: "Invalid code format" });
        }

        const user = await User.findOne({ uniqueCode: code }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "No user found with this code" });
        }

        return res.json({
            message: "User found",
            user,
        });

    } catch (error) {
        console.error("Search user by code error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

