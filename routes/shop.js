
const express = require('express');
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const { check, body } = require("express-validator/check");

const router = express.Router();
router.get('/',shopController.getIndex);
router.get('/profile', isAuth, shopController.profileIndex)
router.post('/profile', isAuth, shopController.updateProfile)


router.get('/how-its-work', shopController.interior);
router.get('/travel', shopController.travel);

//rating
router.get('/rating', isAuth,shopController.getRating);
router.post('/rating', isAuth, shopController.postRating);




//sell doller
router.get('/selldoller', isAuth, shopController.getDollerformUser)
router.post('/selldoller', isAuth,
    check('usdsend')
        .isNumeric()
        .withMessage('Must be Number')
        . isLength({ min: 2})
        .withMessage('usd is empty')
        .isInt({ min: 50, max: 100 })
        .withMessage('The highest (100) dollars and the lowest (50) dollars ').trim(),

    shopController.postDollerformUser)

//buy  doller
router.get('/buydoller', isAuth, shopController.getbuyDollerformUser)
router.post('/buydollers', isAuth,
    check('reciveusd')
        .isNumeric()
        .withMessage('Must be Number')
        .isLength({ min: 2 })
        .withMessage('usd is empty')
        .isInt({ min: 50, max: 100 })
        .withMessage('The highest (100) dollars and the lowest (50) dollars ').trim(),shopController.postbuyDollerformUser)


//order
router.get('/order', isAuth, shopController.getOrder)
router.get('/order/:orderId', isAuth, shopController.getdetailsPage)

router.post('/neworder/:orderId', isAuth,shopController.postConframOrder)





module.exports = router;
