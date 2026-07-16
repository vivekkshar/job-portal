import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    

    role: {
      type: String,
      enum: ["jobseeker", "recruiter", "admin"],
      default: "jobseeker",
    },

    profile: {
      bio: {
        type: String,
        
      },

      skills: [
        {
          type: String,
        },
      ],

      phoneNumber: {
        type: String,
        
      },

      profilePhoto: {
        public_id: String,
        url: String,
      },

      resume: {
        public_id: String,
        url: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
