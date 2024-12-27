const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'video/mp4'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            const err = new Error('Hanya file PNG, JPG, dan MP4 yang diperbolehkan!');
            cb(err, false);
        }
    },
    /* istanbul ignore next */
    onError: (error, next) => {
                /* istanbul ignore next */

        next(error);
    },
});

module.exports = upload;


