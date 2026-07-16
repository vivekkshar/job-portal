import Job from "../models/jobs.js";
import Application from "../models/Application.js";

export const getRecruiterDashboard = async (req, res) => {
  try {
    // Get all recruiter jobs
    const jobs = await Job.find({
      createdBy: req.user._id,
    }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    // Total Jobs
    const totalJobs = jobIds.length;

    // Total Applications
    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    // Status Counts
    const pending = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Pending",
    });

    const reviewed = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Reviewed",
    });

    const shortlisted = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Shortlisted",
    });

    const rejected = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Rejected",
    });

    // Recent Applications
    const recentApplications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("applicant", "fullName email")
      .populate("job", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      dashboard: {
        totalJobs,
        totalApplications,
        pending,
        reviewed,
        shortlisted,
        rejected,
        recentApplications,
      },
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};