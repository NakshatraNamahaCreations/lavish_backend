import Service from "../../models/serviceManagement/Service.js";

// export const createService = async (req, res) => {
//   try {
//     const {
//       serviceName,
//       categoryId,
//       subCategoryId,
//       subSubCategoryId,
//       themeId,
//       packageDetails,
//       requiredDetails,
//       customizedInputs,
//       balloonColors,
//       originalPrice,
//       offerPrice,
//     } = req.body;

//     // Validate required fields
//     if (
//       !serviceName ||
//       !categoryId ||
//       !subCategoryId ||
//       !packageDetails ||
//       !originalPrice ||
//       !offerPrice ||
//       !balloonColors ||
//       !req.files // Check for multiple files
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required fields",
//       });
//     }

//     // ✅ Convert back from JSON string to actual arrays
//     const parsedCustomizedInputs = customizedInputs
//       ? JSON.parse(customizedInputs)
//       : [];
//     const parsedBalloonColors = balloonColors ? JSON.parse(balloonColors) : [];

//     // Save the image paths
//     const imagePaths = req.files.map(
//       (file) => file.filename
//     );

//     // Create a new service
//     const newService = new Service({
//       serviceName,
//       categoryId,
//       subCategoryId,
//       subSubCategoryId: subSubCategoryId || null,
//       themeId: themeId || null,
//       packageDetails,
//       requiredDetails: requiredDetails || null,
//       customizedInputs: parsedCustomizedInputs,
//       balloonColors: parsedBalloonColors,
//       originalPrice: Number(originalPrice),
//       offerPrice: Number(offerPrice),
//       images: imagePaths,
//     });

//     await newService.save();

//     return res.status(201).json({
//       success: true,
//       message: "Service created successfully",
//       data: newService,
//     });
//   } catch (error) {
//     console.error("Error creating service:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to create service",
//       error: error.message,
//     });
//   }
// };
export const createService = async (req, res) => {
  try {
    const {
      serviceName,
      categoryId,
      subCategoryId,
      subSubCategoryId,
      themeId,
      packageDetails,
      requiredDetails,
      customizedInputs,
      balloonColors,
      originalPrice,
      offerPrice,
    } = req.body;

    if (
      !serviceName ||
      !categoryId ||
      !subCategoryId ||
      !packageDetails ||
      !originalPrice ||
      !offerPrice ||
      !balloonColors ||
      !req.files
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Parse inputs
    let parsedCustomizedInputs = [];
    try {
      parsedCustomizedInputs = customizedInputs ? JSON.parse(customizedInputs) : [];

      if (!Array.isArray(parsedCustomizedInputs)) {
        return res.status(400).json({
          success: false,
          message: "customizedInputs must be an array of objects.",
        });
      }

      for (const input of parsedCustomizedInputs) {
        if (!input.label || !input.inputType) {
          return res.status(400).json({
            success: false,
            message: "Each customized input must include label and inputType.",
          });
        }
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid customizedInputs format.",
      });
    }

    const parsedBalloonColors = JSON.parse(balloonColors);

    const imagePaths = req.files.map((file) => file.filename);

    const newService = new Service({
      serviceName,
      categoryId,
      subCategoryId,
      subSubCategoryId: subSubCategoryId || null,
      themeId: themeId || null,
      packageDetails,
      requiredDetails,
      customizedInputs: parsedCustomizedInputs,
      balloonColors: parsedBalloonColors,
      originalPrice: Number(originalPrice),
      offerPrice: Number(offerPrice),
      images: imagePaths,
    });

    await newService.save();

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: error.message,
    });
  }
};


// export const updateService = async (req, res) => {
//   try {
//     const { serviceId } = req.params;
//     const {
//       serviceName,
//       categoryId,
//       subCategoryId,
//       subSubCategoryId,
//       themeId,
//       packageDetails,
//       requiredDetails,
//       customizedInputs,
//       balloonColors,
//       originalPrice,
//       offerPrice,
//     } = req.body;

//     // Check if the service exists
//     const service = await Service.findById(serviceId);
//     if (!service) {
//       return res.status(404).json({
//         success: false,
//         message: "Service not found",
//       });
//     }

//     // Safely parse JSON strings to arrays
//     let parsedCustomizedInputs = service.customizedInputs;
//     let parsedBalloonColors = service.balloonColors;

//     try {
//       parsedCustomizedInputs = customizedInputs
//         ? JSON.parse(customizedInputs)
//         : service.customizedInputs;
//     } catch (error) {
//       console.error("Error parsing customizedInputs:", error);
//       return res.status(400).json({
//         success: false,
//         message: "Invalid format for customizedInputs",
//       });
//     }

//     try {
//       parsedBalloonColors = balloonColors
//         ? JSON.parse(balloonColors)
//         : service.balloonColors;
//     } catch (error) {
//       console.error("Error parsing balloonColors:", error);
//       return res.status(400).json({
//         success: false,
//         message: "Invalid format for balloonColors",
//       });
//     }

//     // Convert empty strings to null for ObjectId fields
//     const sanitizedSubSubCategoryId =
//       subSubCategoryId === "" ? null : subSubCategoryId;
//     const sanitizedThemeId = themeId === "" ? null : themeId;

//     // Update the service fields
//     const updateField = (newValue, existingValue) =>
//       newValue !== undefined ? newValue : existingValue;

//     service.serviceName = updateField(serviceName, service.serviceName);
//     service.categoryId = updateField(categoryId, service.categoryId);
//     service.subCategoryId = updateField(subCategoryId, service.subCategoryId);
//     service.subSubCategoryId = updateField(
//       sanitizedSubSubCategoryId,
//       service.subSubCategoryId
//     );
//     service.themeId = updateField(sanitizedThemeId, service.themeId);
//     service.packageDetails = updateField(
//       packageDetails,
//       service.packageDetails
//     );
//     service.requiredDetails = updateField(
//       requiredDetails,
//       service.requiredDetails
//     );
//     service.customizedInputs = parsedCustomizedInputs;
//     service.balloonColors = parsedBalloonColors;
//     service.originalPrice = updateField(originalPrice, service.originalPrice);
//     service.offerPrice = updateField(offerPrice, service.offerPrice);

//     // Update images if new files are uploaded
//     if (req.files && req.files.length > 0) {
//       service.images = req.files.map(
//         (file) => file.filename
//       );
//     }

//     // Save the updated service
//     await service.save();

//     return res.status(200).json({
//       success: true,
//       message: "Service updated successfully",
//       data: service,
//     });
//   } catch (error) {
//     console.error("Error updating service:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update service",
//       error: error.message,
//     });
//   }
// };
export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const {
      serviceName,
      categoryId,
      subCategoryId,
      subSubCategoryId,
      themeId,
      packageDetails,
      requiredDetails,
      customizedInputs,
      balloonColors,
      originalPrice,
      offerPrice,
    } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    let parsedCustomizedInputs = service.customizedInputs;
    try {
      parsedCustomizedInputs = customizedInputs ? JSON.parse(customizedInputs) : service.customizedInputs;

      if (!Array.isArray(parsedCustomizedInputs)) {
        return res.status(400).json({
          success: false,
          message: "customizedInputs must be an array of objects.",
        });
      }

      for (const input of parsedCustomizedInputs) {
        if (!input.label || !input.inputType) {
          return res.status(400).json({
            success: false,
            message: "Each customized input must include label and inputType.",
          });
        }
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid format for customizedInputs",
      });
    }

    let parsedBalloonColors = service.balloonColors;
    try {
      parsedBalloonColors = balloonColors ? JSON.parse(balloonColors) : service.balloonColors;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid format for balloonColors",
      });
    }

    if (serviceName) service.serviceName = serviceName;
    if (categoryId) service.categoryId = categoryId;
    if (subCategoryId) service.subCategoryId = subCategoryId;
    service.subSubCategoryId = subSubCategoryId || null;
    service.themeId = themeId || null;
    if (packageDetails) service.packageDetails = packageDetails;
    if (requiredDetails !== undefined) service.requiredDetails = requiredDetails;

    service.customizedInputs = parsedCustomizedInputs;
    service.balloonColors = parsedBalloonColors;

    if (originalPrice) service.originalPrice = originalPrice;
    if (offerPrice) service.offerPrice = offerPrice;

    if (req.files && req.files.length > 0) {
      service.images = req.files.map((file) => file.filename);
    }

    await service.save();

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update service",
      error: error.message,
    });
  }
};


export const getAllService = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search } = req.query;

    // Build the match filter for search
    const matchFilter = {};
    if (search) {
      matchFilter.$or = [
        { serviceName: { $regex: search, $options: "i" } }, // Case-insensitive search for serviceName
        { "categoryId.category": { $regex: search, $options: "i" } }, // Case-insensitive search for category name
        { "subCategoryId.subCategory": { $regex: search, $options: "i" } }, // Case-insensitive search for subCategory name
        {
          "subSubCategoryId.subSubCategory": { $regex: search, $options: "i" },
        }, // Case-insensitive search for subSubCategory name
        { "themeId.theme": { $regex: search, $options: "i" } }, // Case-insensitive search for theme name
      ];
    }

    // Use aggregation to join related collections and apply filters
    const services = await Service.aggregate([
      // Lookup for category
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryId",
        },
      },
      { $unwind: { path: "$categoryId", preserveNullAndEmptyArrays: true } },

      // Lookup for subCategory
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategoryId",
          foreignField: "_id",
          as: "subCategoryId",
        },
      },
      { $unwind: { path: "$subCategoryId", preserveNullAndEmptyArrays: true } },

      // Lookup for subSubCategory
      {
        $lookup: {
          from: "subsubcategories",
          localField: "subSubCategoryId",
          foreignField: "_id",
          as: "subSubCategoryId",
        },
      },
      {
        $unwind: {
          path: "$subSubCategoryId",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Lookup for theme
      {
        $lookup: {
          from: "themes",
          localField: "themeId",
          foreignField: "_id",
          as: "themeId",
        },
      },
      { $unwind: { path: "$themeId", preserveNullAndEmptyArrays: true } },

      // Match filter for search
      { $match: matchFilter },

      // Sort by createdAt
      { $sort: { createdAt: -1 } },

      // Pagination
      { $skip: skip },
      { $limit: limit },
    ]);

    // Count total services matching the filter
    const totalServices = await Service.aggregate([
      // Lookup for category
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryId",
        },
      },
      { $unwind: { path: "$categoryId", preserveNullAndEmptyArrays: true } },

      // Lookup for subCategory
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategoryId",
          foreignField: "_id",
          as: "subCategoryId",
        },
      },
      { $unwind: { path: "$subCategoryId", preserveNullAndEmptyArrays: true } },

      // Lookup for subSubCategory
      {
        $lookup: {
          from: "subsubcategories",
          localField: "subSubCategoryId",
          foreignField: "_id",
          as: "subSubCategoryId",
        },
      },
      {
        $unwind: {
          path: "$subSubCategoryId",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Lookup for theme
      {
        $lookup: {
          from: "themes",
          localField: "themeId",
          foreignField: "_id",
          as: "themeId",
        },
      },
      { $unwind: { path: "$themeId", preserveNullAndEmptyArrays: true } },

      // Match filter for search
      { $match: matchFilter },

      // Count documents
      { $count: "total" },
    ]);

    const total = totalServices.length > 0 ? totalServices[0].total : 0;

    return res.status(200).json({
      success: true,
      count: services.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    // console.log("Fetching service with ID:", serviceId);

    const service = await Service.findById(serviceId)
      .populate("categoryId", "category")
      .populate("subCategoryId", "subCategory")
      .populate("subSubCategoryId", "subSubCategory")
      .populate("themeId", "theme");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Error fetching service by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch service",
      error: error.message,
    });
  }
};


export const getServiceCount = async (req, res) => {
  try {
    const totalCount = await Service.countDocuments();
    console.log("Total number of documents:", totalCount);
    return res.status(200).json({
      success: true,
      count: totalCount
    })
  } catch (error) {
    console.log("Error", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch service Count",
      error: error.message,
    });
  }
}





export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Find and delete the service
    const service = await Service.findByIdAndDelete(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete service",
      error: error.message,
    });
  }
};


// Controller to get services by subCategoryId, subSubCategoryId, or themeId
export const getServicesByCategoryOrTheme = async (req, res) => {
  try {
    const { id } = req.params;  // Extract the ID from URL params

    // Find services where the `id` matches either subCategoryId, subSubCategoryId, or themeId
    const services = await Service.find({
      $or: [
        { subCategoryId: id },        // Check for subCategoryId match
        { subSubCategoryId: id },     // Check for subSubCategoryId match
        { themeId: id },              // Check for themeId match
      ]
    }).populate("categoryId", "category")  // Optionally populate category field
      .populate("subCategoryId", "subCategory")  // Optionally populate subCategory field
      .populate("subSubCategoryId", "subSubCategory")  // Optionally populate subSubCategory field
      .populate("themeId", "theme");  // Optionally populate theme field

    if (!services || services.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No services found for this ID."
      });
    }

    return res.status(200).json({
      success: true,
      data: services  // Return all matched services
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch services.",
      error: error.message,
    });
  }
};


