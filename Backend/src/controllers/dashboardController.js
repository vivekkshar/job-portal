import Job from "../models/jobs.js";
import Application from "../models/Application.js";
import Company from "../models/Company.js";

export const getRecruiterDashboard = async (req, res) => {
  try {
    // Get all recruiter jobs
    const jobs = await Job.find({
      createdBy: req.user._id,
    }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    // Total Companies
    const totalCompanies = await Company.countDocuments({
      owner: req.user._id,
    });

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

    const accepted = shortlisted;

    // Recent Jobs
    const recentJobs = await Job.find({
      createdBy: req.user._id,
    })
      .populate("company", "name")
      .sort({ createdAt: -1 })
      .limit(5);

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
        totalCompanies,
        totalJobs,
        totalApplications,
        pending,
        reviewed,
        shortlisted,
        rejected,
        accepted,
        recentJobs,
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