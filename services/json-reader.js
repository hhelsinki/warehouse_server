const fs = require('fs');

function jsonReader(filePath, cb) {
    fs.readFile(filePath, function (err, fileData) {
        if (err) {
            return cb && cb(err);
        }
        try {
            var object = JSON.parse(fileData);
            return cb && cb(null, object);
        }
        catch (err) {
            return cb && cb(err);
        }
    });
}

module.exports = {jsonReader};