import cloudinary from "../config/cloudinary.js";

const deleteFromCloudinary = async (publicId, resourceType) => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};

export { deleteFromCloudinary };
