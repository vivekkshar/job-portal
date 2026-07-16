import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Shortlisted", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// One user can apply only once to one job
applicationSchema.index(
  { applicant: 1, job: 1 },
  { unique: true }
);

const Application =  mongoose.model("Application", applicationSchema);

export default Application;