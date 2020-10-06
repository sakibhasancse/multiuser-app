
const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-adminauth');
const admin = require('../middleware/admin-isauth');
const router = express.Router();



router.get('/buyorder', isAuth, admin, adminController.buyorder)

router.post('/buyorder/delete', isAuth, admin, adminController.postdeleteorderbuy);


router.get('/order',isAuth, admin, adminController.eorder)
router.post('/order', isAuth, admin, adminController.controlOrder)
router.post('/buyorder', isAuth, admin, adminController.controlOrderbuy)

router.post('/order/delete', isAuth, admin, adminController.postdeleteorder);

router.get('/index', isAuth, admin, adminController.adminindex)
router.get('/alluser', isAuth, admin, adminController.getalluser)
router.post('/delete-user', isAuth, admin, adminController.postdeleteuser)
router.get('/viewUser/:userId', isAuth, admin, adminController.viewUser)





router.get('/add-about', isAuth,admin, adminController.addgetAbouts);
router.post('/add-about', isAuth,admin, adminController.addpostaboutus);

router.post('/delete-about', isAuth, admin, adminController.postdeleteAbout);


router.get('/add-privacy', isAuth, admin, adminController.addgetPrivacy);
router.post('/add-privacy', isAuth, admin, adminController.addpostaPrivacy);

router.post('/delete-privacy', isAuth, admin, adminController.postdeletePrivacy);






router.get('/rate', isAuth, admin, adminController.getrate)
router.post('/rate', isAuth, admin, adminController.updateRate)

router.get('/accountnumber', isAuth, admin, adminController.getnumber)
router.post('/accountnumber', isAuth, admin, adminController.updatenumber)


router.get('/buyprice', isAuth, admin, adminController.buygetrate)
router.post('/buyprice', isAuth, admin, adminController.buyupdateRate)



module.exports = router;
