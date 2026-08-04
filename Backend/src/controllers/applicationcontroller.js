import Application from "../models/Application.js";
import User from "../models/user.js";
import Job from "../models/jobs.js";
import transporter from "../config/emai.js";

export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    
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

    // Get applicant details
    const applicant = await User.findById(req.user._id);

    // Get recruiter details
    const recruiter = await User.findById(job.createdBy);

    // Create Application
    const application = await Application.create({
      applicant: req.user._id,
      job: jobId,
    });

    // Send email to recruiter
    if (recruiter?.email) {
      await transporter.sendMail({
        from: `"Job Portal" <${process.env.EMAIL_USER}>`,
        to: recruiter.email,
        subject: `New Application for ${job.title}`,
        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 10px;
          ">

            <h2 style="color: #2563eb;">
              New Job Application
            </h2>

            <p>
              Hello ${recruiter.fullName},
            </p>

            <p>
              You have received a new application for:
            </p>

            <h3>
              ${job.title}
            </h3>

            <hr />

            <p>
              <strong>Applicant:</strong>
              ${applicant?.fullName || "N/A"}
            </p>

            <p>
              <strong>Email:</strong>
              ${applicant?.email || "N/A"}
            </p>

            <p>
              <strong>Application Status:</strong>
              Pending
            </p>

            <p style="margin-top: 25px;">
              Please login to your Job Portal recruiter dashboard
              to view the complete application and resume.
            </p>

            <hr />

            <p style="color: #777; font-size: 12px;">
              Job Portal
            </p>

          </div>
        `,
      });
    }

    return res.status(201).json({
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

    console.error("Apply job error:", error);

    return res.status(500).json({
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

    // Get application + applicant + job
    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant", "fullName email");

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

    // Update status
    application.status = status;

    await application.save();

    // Send email to applicant
    if (application.applicant?.email) {
      await transporter.sendMail({
        from: `"Job Portal" <${process.env.EMAIL_USER}>`,
        to: application.applicant.email,
        subject: `Application Update - ${application.job.title}`,

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 10px;
          ">

            <h2 style="color: #2563eb;">
              Application Status Update
            </h2>

            <p>
              Hello ${application.applicant.fullName},
            </p>

            <p>
              Your application status has been updated.
            </p>

            <h3>
              ${application.job.title}
            </h3>

            <p>
              <strong>New Status:</strong>
              ${status}
            </p>

            ${
              status === "Shortlisted"
                ? `
                  <p style="color: green;">
                    🎉 Congratulations! You have been shortlisted
                    for the next stage of the recruitment process.
                  </p>
                `
                : ""
            }

            ${
              status === "Rejected"
                ? `
                  <p style="color: #dc2626;">
                    Thank you for your interest. Unfortunately,
                    your application was not selected at this time.
                  </p>
                `
                : ""
            }

            <p style="margin-top: 25px;">
              Login to your Job Portal account to check
              your application details.
            </p>

            <hr />

            <p style="color: #777; font-size: 12px;">
              Job Portal
            </p>

          </div>
        `,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });

  } catch (error) {

    console.error("Update application status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
