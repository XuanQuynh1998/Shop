const apiRouter = require('./api');
const homeRouter = require('./home');
const authenRouter = require('./authen');
const cartRouter = require('./cart');
const productRouter = require('./product');
const checkoutRouter = require('./checkout');
const userInfoRouter = require('./userInfo')

function route(app) {
    app.use('/api', apiRouter);
    app.use('/buyer', authenRouter)
    app.use('/cart', cartRouter);
    app.use('/user_info', userInfoRouter);
    app.use('/product', productRouter);
    app.use('/checkout', checkoutRouter);
    app.use('/*', homeRouter);
}

module.exports = route;