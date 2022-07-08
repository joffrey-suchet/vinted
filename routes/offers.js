console.clear();
const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");
require(`dotenv`).config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const Offer = require("../models/Offer");
const User = require("../models/User");

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

//fonction d'authentification
const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });
    if (!user) {
      console.log("unauthorized");
      res.status(401).json({ error: "Unauthorized" });
    } else {
      req.user = user;
      return next();
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
// route pour publier une offre
router.post(
  "/offer/publish",
  isAuthenticated,
  fileupload(),
  async (req, res) => {
    try {
      console.log(req.files.picture);
      const myPictureinBase64 = convertToBase64(req.files.picture);
      const newOffer = new Offer({
        product_name: req.body.title,
        product_description: req.body.description,
        product_price: req.body.price,
        product_detail: [
          { MARQUE: req.body.brand },
          { TAILLE: req.body.size },
          { ÉTAT: req.body.condition },
          { COULEUR: req.body.color },
          { EMPLACEMENT: req.body.city },
        ],
        owner: req.user,
      });

      const result = await cloudinary.uploader.upload(myPictureinBase64, {
        folder: "vinted/offers",
        public_id: `${req.body.title} - ${newOffer._id}`,
      });
      newOffer.product_image = result;

      await newOffer.save();

      res.json(newOffer);
    } catch (error) {
      res.json({ error: error.message });
    }
  }
);

router.get("/offers", async (req, res) => {
  const filtersObject = {};

  if (req.query.title) {
    filtersObject.product_name = new RegExp(req.query.title, "i");
  }
  if (req.query.priceMin) {
    filtersObject.product_price = { $gte: req.query.priceMin };
  }

  if (req.query.priceMin) {
    if (filtersObject.product_price) {
      filtersObject.product_price.$lte = req.query.priceMax;
    } else {
      filtersObject.product_price = { $lte: req.query.priceMax };
    }
  }
  console.log(filtersObject);
  const sortObject = {};

  if (req.query.sort === "price-desc") {
    sortObject.product_price = "desc";
  } else if (req.query.sort === "price-asc") {
    sortObject.product_price = "asc";
  }

  let limit = 3;
  if (req.query.limit) {
    limit = req.query.limit;
  }
  let page = 1;
  if (req.query.page) {
    page = req.query.page;
  }

  const offers = await Offer.find(filtersObject)
    .sort(sortObject)
    .select("product_name product_price")
    .limit(limit)
    .skip((page - 1) * limit);

  const count = await Offer.countDocuments(filtersObject);

  res.json({ count: count, offers: offers });
});

module.exports = router;
