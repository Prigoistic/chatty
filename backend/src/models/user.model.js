import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilepic : {
            type: String,
            default: "",
        }
    },
    { timestamps: true }
    
);

// Instance method to compare a plain password with the hashed password
// Note: Keep the name singular `comparePassword`. For convenience, we also alias
// it to `comparePasswords` to avoid typos.
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
// Alias to support accidental pluralization in calls
userSchema.methods.comparePasswords = userSchema.methods.comparePassword;

const User = mongoose.model("User", userSchema);

export default User;

