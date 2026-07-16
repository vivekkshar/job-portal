import Company from "../models/Company.js"


export const  createCompany = async (req, res) => {
     try {

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required"
      });
    }

    const companyExists = await Company.findOne({ name });

    if (companyExists) {
      return res.status(400).json({
        success: false,
        message: "Company already exists"
      });
    }

    const company = await Company.create({
      name,
      owner: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Company Created Successfully",
      company
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

}

export const getMyCompanies = async (req, res) => {

  try {

    const companies = await Company.find({
      owner: req.user._id
    });

    res.status(200).json({
      success: true,
      companies
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const updateCompany = async (req, res) => {

  try {

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    if (company.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const fields = [
      "description",
      "website",
      "location",
      "logo"
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field];
      }
    });

    await company.save();

    res.status(200).json({
      success: true,
      message: "Company Updated",
      company
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

