const router = require("express").Router();
const loggedinuser = require("../models/loginedUserSchema");
const usersignup = require("../models/usersignupSchema");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const areaModel = require("../models/areaSchema");
const { checkCookies } = require("../auth/checkCookies");
const bcrypt = require("bcrypt");
const UserSignupModel = require("../models/usersignupSchema");
const fs = require("fs");
const { google, GoogleApis } = require("googleapis");
const path = require("path");
const { Stream } = require("stream");
const { Promise } = require("../config/db");
// const upload = multer({ dest: 'uploads/' })
const itemModel = require("../models/itemSchema");

// const storage = multer.memoryStorage();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only .png .jpg and .jpeg format allowed!"));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("image");

router.post("/logout", async (req, res) => {
  res.clearCookie("jwt");
  res.json({
    status: "SUCCESS",
    message: "cookie is deleted successfully!",
  });
});

router.post("/login", async (req, res) => {
  // console.log(req.body);
  await loggedinuser.findOne({ userEmail: req.body.email }).then((user) => {
    console.log("backend", user);
    if (!user) {
      res.json({
        status: "FAILED",
        message: "user not found with given email!",
      });
      return res;
    }
    bcrypt.compare(
      req.body.password,
      user.hashedPassword,
      async (err, isMatch) => {
        if (!isMatch) {
          res.json({
            status: "FAILED",
            message: "user not found with given data",
          });
          return res;
        } else {
          const token = await user.generateToken();
          res.cookie("jwt", token);
          res.status(201).json({
            status: "SUCCESS",
            message: "token generated successfully",
            jwt: token,
          });

          return res;
        }
        callback(null, isMatch);
      }
    );
  });
});

router.post("/additem", checkCookies, async (req, res) => {
  console.log('inside additem....')
    // console.log('inside additem', req.body,"\nreq.file: ", req.file)
  if (req.body.item_id && true) {
    let url = req.body.image_url;
    if(req.file){
        // console.log('getting file at backend');
        url = await uploadFile(req.file);
    }
    // console.log('url content before:',url,'     ',req.body.image_url);
    const newData = {
        name: req.body.item_name,
      installationDate: req.body.installation_date
        ? req.body.installation_date
        : Date.now(),
      user: req.body.user_id,
      area: req.body.area_id,
      serialNumber: req.body.serial_number ? req.body.serial_number : null,
      imageUrl: url,
    }
    const newitem = await itemModel.findByIdAndUpdate(req.body.item_id, newData, {new:false})
    console.log('new item:->', newitem);
    if(newitem){
        res.json({
            status: "SUCCESS",
            message: "",
          });
          return res;
    }else{
        res.json({
            status: "FAILED",
            message: "failed to add item in area!",
          });
          return res;
    }
  } else {
    console.log(req.body, req.file);
    let url = null;
    try {
      if(req.file){
        url = await uploadFile(req.file);
      }
    } catch {
      res.json({
        status: "FAILED",
        message: "Error while uploading the image",
      });
    }
    const area = await areaModel.findById(req.body.area_id);
    console.log("item image:", req.file, "additem body", req.body, req.data);
    if (!area) {
      res.json({
        status: "FAILED",
        message: "failed to add item in area!",
      });
      return res;
    }
    console.log("area", area);
    const user = await loggedinuser.findById(req.body.user_id);
    if (!user) {
      res.json({
        status: "FAILED",
        message: "failed to add item in area!",
      });
      return res;
    }
    console.log("area");
    console.log("inside additem api");
    const userId = req.body.user_id;
    console.log("req body for adding item:", req.body);
    if (!userId) {
      res.json({
        status: "FAILED",
        message: "invalid user!",
      });
      return res;
    }
    let itemId;
    let check = 0;
    let code = null;
    console.log("inside add item:", req.body);
    const newItem = new itemModel({
      name: req.body.item_name,
      installationDate: req.body.installation_date
        ? req.body.installation_date
        : Date.now(),
      user: user._id,
      area: area._id,
      serialNumber: req.body.serial_number ? req.body.serial_number : null,
      imageUrl: url,
    });
    // newItem.user=user._id;
    console.log("new item:", newItem);
    const item = await newItem.save();
    if (!item) {
      res.json({
        status: "FAILED",
        message: "cannot save the item!",
      });
      return res;
    }
    itemId = item._id;
    // item.area=req.body.area_id;
    // item.user=req.body.user_id;

    if (req.body.generate_qr == "true" || req.body.generate_qr) {
      try {
        code = await item.generateQRCode();
        console.log("code after generate:", code);
      } catch (err) {
        res.json({
          status: "FAILED",
          message: "error while generating the qrcode!",
        });
        return res;
      }
    }
    await item.save();

    await area.items.push(itemId);
    await area.save();
    if (code != null) {
      console.log("afeter");
    }
    console.log("code:", code);
    res.json({
      status: "SUCCESS",
      message: "item is added successfully!",
    });
  }
  return res;
});

router.post("/getuserdata", checkCookies, (req, res) => {
  // res.json({validuser:`${req.body.userId}`})
  console.log("/getuserdata is called");
  loggedinuser.findById(req.body.user_id).then((userData) => {
    res.json({
      status: "SUCCESS",
      user_data: {
        user_name: userData.userName,
        user_email: userData.userEmail,
        user_profile_url: userData.profileImgUrl,
      },
    });
  });
});

// const keyFile = require("./googledrive.json");
const keyFile = require("../googledrive.json");
const { json } = require("body-parser");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../googledrive.json"),
  scopes: SCOPES,
});

const uploadFile = async (imageFile) => {
  console.log("auth: ", auth);
  const bufferStream = new Stream.PassThrough();
  bufferStream.end(imageFile.buffer);
  console.log("bufferStream value:->  ", bufferStream);
  const { data } = await google
    .drive({ version: "v3", auth: auth })
    .files.create({
      media: {
        mimeType: imageFile.mimeType,
        body: bufferStream,
      },
      requestBody: {
        name: imageFile.originalname,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      },
      fields: "id,name",
    });
  console.log("data id and name inside uploads: ", data.id, data.name);
  return `https://drive.google.com/thumbnail?id=${data.id}`;
};

router.post("/createloggedinuser", async (req, res) => {
  const { area_name, email, image } = req.body;
  let url = null;
  console.log("user area:", area_name);
  console.log("req.file data:", req.file);
  const imageFile = req.file;
  console.log("inside create user area and image file", area_name, imageFile);
  let canDelete = false;
  if (imageFile) {
    console.log("will call the post to upload the profile image");
    url = await uploadFile(imageFile);
  }
  let area_id;
  let user_id;
  const newArea = new areaModel({
    name: area_name,
  });
  await newArea.save().then((area) => {
    area_id = area._id;
    console.log("area_id value: ", area_id);
  });
  await usersignup.findOne({ userEmail: email }).then(async (user) => {
    console.log("user we find afetr add area", user);
    if (user.validate) {
      console.log("url value: ", url);
      const userData = new loggedinuser({
        userName: user.userName,
        userEmail: user.userEmail,
        hashedPassword: user.hashedPassword,
        signupDate: Date.now(),
        profileImgUrl: url,
      });
      userData.areas.push(area_id);
      userData.save().then((res) => {
        user_id = res._id;
        console.log("user_id", res);
      });
      // await loggedinuser.findByIdAndUpdate(user_id, {$push: {areas: area_id}})

      canDelete = true;
    }
  });
  if (canDelete) {
    await usersignup.deleteOne({ userEmail: req.body.email });
  }
  res.json({
    status: "SUCCESS",
    message: "Loggined user is created successfully!",
  });
  return res;
});
module.exports = router;
