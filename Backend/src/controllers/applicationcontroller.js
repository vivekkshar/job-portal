import Application from "../models/Application.js";

import Job from "../models/jobs.js";

export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check Job Exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check Duplicate Application
    const alreadyApplied = await Application.findOne({
      applicant: req.user._id,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Create Application
    const application = await Application.create({
      applicant: req.user._id,
      job: jobId,
    });

    res.status(201).json({
      success: true,
      message: "Applied Successfully",
      application,
    });

  } catch (error) {

    // Handle duplicate index error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMyApplications = async (req, res) => {
  try {

    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name logo location",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalApplications: applications.length,
      applications,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check Job Exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Ownership Check
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view applicants",
      });
    }

    const applications = await Application.find({
      job: jobId,
    })
      .populate("applicant", "fullName email profile")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalApplicants: applications.length,
      applications,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatus = [
      "Pending",
      "Reviewed",
      "Shortlisted",
      "Rejected",
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const application = await Application.findById(applicationId)
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check Recruiter Ownership
    if (
      application.job.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized",
      });
    }

    application.status = status;

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};