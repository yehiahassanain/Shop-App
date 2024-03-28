const fs = require('fs');
// i create this function to delete any file (image) have this is path
const deleteFile = (filePath)=>{
    fs.unlink(filePath, (err)=>{
        if (err){
            throw (err);
        }
    });
}

exports.deleteFile = deleteFile;