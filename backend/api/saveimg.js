const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, "../public");
    },
    filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
    },
    });
const upload = multer({ storage: storage,
    fileFilter:(req, file, cb)=>{
        if(file.mimetype =="image/png"|| file.mimetype=="image/jpg"||file.mimetype=="image/jpeg"){
            cb(null,true);
        }
        else{
            cb(null,false);
            return cb(new Error('only .png .jpg and .jpeg format allowed!'))
        }
    },
    limits:{fileSize: 2*1024*1024}
}).single('image');



const keyFile = require('./googledrive.json');
const SCOPES = ["https://www.googleapis.com/auth/drive"]

const auth = new google.auth.GoogleAuth({
    keyFile:path.join(__dirname,'googledrive.json'),
    scopes: SCOPES
})

const uploadFile=async(imageFile)=>{
    console.log('auth: ',auth);
    const bufferStream = new Stream.PassThrough();
    bufferStream.end(imageFile.buffer);
    console.log('bufferStream value:->  ',bufferStream)
    const {data}= await google.drive({version:"v3", auth:auth}).files.create({
        media:{
            mimeType:imageFile.mimeType,
            body: bufferStream,
            
        },
        requestBody:{
            name:imageFile.originalname,
            parents:[process.env.GOOGLE_DRIVE_FOLDER_ID],
        },
        fields:"id,name"
    });
    console.log("data id and name inside uploads: ",data.id, data.name);
    return `https://drive.google.com/thumbnail?id=${data.id}`;
}

module.exports = uploadFile