var path = require('path');

function initialize(app){
    const viewPath = path.join(__dirname,'..', 'views') //Assumes view and config folders are at the same directory level
    app.set('views', viewPath);
    app.set('view engine', 'ejs');
}

module.exports = initialize;