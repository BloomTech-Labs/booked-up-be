const cloudinary = require("cloudinary");
const Contents = require("./content-model");

const cloudinaryConfig = require("../config/cloudinary");

cloudinaryConfig;

async function deleteServer(req, res) {
  const { id } = req.params;
  const promise = new Promise((resolve, reject) => {
    Contents.deleteContent(id)
      .then(() => {
        resolve({ server: "content removed from server" });
      })
      .catch((err) => {
        reject(err);
      });
  });
  return promise;
}

async function deletePublic(req, res) {
  const { cloudId } = req.params;
  return cloudinary.v2.uploader.destroy(`${cloudId}`, (error, success) => {
    const promise = new Promise((resolve, reject) => {
      try {
        if (success) {
          resolve(success);
        }
      } catch (err) {
        reject(error);
      }
    });
    return promise;
  });
}

async function deleteImage(req, res) {
  const { imgId } = req.params;
  return cloudinary.v2.uploader.destroy(`${imgId}`, (error, success) => {
    const promise = new Promise((resolve, reject) => {
      try {
        if (success) {
          resolve(success);
        }
      } catch (err) {
        reject(error);
      }
    });
    return promise;
  });
}

module.exports = {
  deleteServer,
  deletePublic,
  deleteImage,
};
