import Job from "../models/jobs.js";
import Company from "../models/Company.js";


export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      experience,
      location,
      jobType,
      vacancies,
      company,
    } = req.body;

    // Validation
    if (
      !title ||
      !description ||
      !salary ||
      experience === undefined ||
      !location ||
      !jobType ||
      vacancies === undefined ||
      !company
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check company exists
    const companyData = await Company.findById(company);

    if (!companyData) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Ownership Check
    if (companyData.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can create jobs only for your own company",
      });
    }

    // Convert requirements string to array if needed
    const requirementArray = Array.isArray(requirements)
      ? requirements
      : requirements.split(",").map((item) => item.trim());

    const job = await Job.create({
      title,
      description,
      requirements: requirementArray,
      salary,
      experience,
      location,
      jobType,
      vacancies,
      company,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const location = req.query.location || "";
    const jobType = req.query.jobType || "";
    

    let query = {};
    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Search by title
    if (keyword) {
      query.title = {
        $regex: keyword,
        $options: "i",
      };
    }

    // Filter by location
    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Filter by job type
    if (jobType) {
      query.jobType = jobType;
    }

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate("company", "name logo location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {

    const { id } = req.params;

    const job = await Job.findById(id)
      .populate("company")
      .populate("createdBy", "fullName email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

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
        message: "You are not authorized to update this job",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "requirements",
      "salary",
      "experience",
      "location",
      "jobType",
      "vacancies"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    // Convert requirements string to array
    if (typeof job.requirements === "string") {
      job.requirements = job.requirements
        .split(",")
        .map((item) => item.trim());
    }

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    // Check if job exists
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
        message: "You are not authorized to delete this job",
      });
    }

    // Delete Job
    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMyJobs = async (req, res) => {
  try {

    const jobs = await Job.find({
      createdBy: req.user._id,
    })
      .populate("company", "name logo location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};