const path = require('path');

class HomeController {
    index(req, res, next) {
        res.sendFile(path.join(__dirname, '../../', 'client', 'index.html'))
    }
}

module.exports = new HomeController();