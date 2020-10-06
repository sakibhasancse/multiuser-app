const express = require('express');
const router = express.Router();
const About = require('../models/about')
const Privasy = require('../models/privasy')
const Sell = require('../models/sellprice')
const BuyPrice = require('../models/buyprice')
router.get('/privacy', async(re, res, next) => {
    try {
        await Privasy.find().then(result => {
            res.render('footer/privacydata', { pageTitle: 'Privacy', path: '',about: result })

        }).catch(err => {
            console.log(err)
        })
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatus = 500;
        return next(error)


    }
    
})
router.get('/contact', (re, res, next) => {
    res.render('footer/contactus', { pageTitle: 'contact', path: '' })
})
router.get('/about', async (req, res, next) => {
    try {
        await About.find().then(result => {
            res.render('footer/aboutus', { pageTitle: 'about', path: '', about: result })

        }).catch(err => {
            console.log(err)
        })
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatus = 500;
        return next(error)

    }

})
router.get('/price-list', async (req, res, next) => {
    try {

        //sell
        const bkashandskill = await Sell.findOne({ bdcountryname: "bk", uscountryname: "sk" })
        const nogodpayonner = await Sell.findOne({  bdcountryname: "no",uscountryname: "pa" })
        const rocketnetteler = await Sell.findOne({ bdcountryname: "rd", uscountryname: "ne" })
        
        console.log(bkashandskill.usrate)
        //buy
        const buybkashandskill = await BuyPrice.findOne({ bdcountryname: "bk", uscountryname: "sk" })
        const buynogodpayonner = await BuyPrice.findOne({ bdcountryname: "no", uscountryname: "pa" })
        const buyrocketnetteler = await BuyPrice.findOne({ bdcountryname: "rd", uscountryname: "ne" })

      
     


        res.render('footer/pricelist', { pageTitle: 'Price', path: 'price-list', 
            bkashandskill, nogodpayonner, rocketnetteler, buybkashandskill, buynogodpayonner, buyrocketnetteler
    
        })


    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatus = 500;
        return next(error)


    }
})


router.get('/getprice/selldoller', (req, res) => {
    try {
        if (req.query.currency) {
            var searchfield = req.query.currency

            Sell.findOne({ bdcountryname: { $in: searchfield.substring(0, 2) }, uscountryname: { $in: searchfield.substring(3, 5) } }).then(result => {

                let bdrate = result.bdrate
                let usrate = result.usrate

                res.status(200).json({
                    bdrate,
                    usrate
                })

            }).catch(err => {
                console.log(err);
                const error = new Error(err);
                error.httpStatus = 500;
                return next(error)

            })
        } else {

            Sell.find().then(result => {
                console.log(result)
                res.status(200).json({ result })

            }).catch(err => {
                console.log(err);
                const error = new Error(err);
                error.httpStatus = 500;
                return next(error)

            })

        }
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatus = 500;
        return next(error)


    }
})


router.get('/getprice/buydoller', (req, res) => {
    try {
        if (req.query.currency) {
            var searchfield = req.query.currency

            BuyPrice.findOne({ bdcountryname: { $in: searchfield.substring(0, 2) }, uscountryname: { $in: searchfield.substring(3, 5) } }).then(result => {

                let bdrate = result.bdrate
                let usrate = result.usrate


                res.status(200).json({

                    bdrate,
                    usrate
                })

            }).catch(err => {
                console.log(err);
                const error = new Error(err);
                error.httpStatus = 500;
                return next(error)

            })
        } else {

            BuyPrice.find().then(result => {
                res.json({
                    result
                })

            }).catch(err => {
                console.log(err);
                const error = new Error(err);
                error.httpStatus = 500;
                return next(error)

            })

        }
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatus = 500;
        return next(error)


    }
})


module.exports = router
