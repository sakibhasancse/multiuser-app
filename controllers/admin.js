


const About = require('../models/about');
const Privacy = require('../models/privasy');

const User = require('../models/user')
const Order = require('../models/selldata')
const { validationResult } = require('express-validator/check');

const Data = require('../models/selldata');
const Rating = require('../models/rating');
const sendEmail = require('../middleware/sentemail')
const Buydata = require('../models/buydata');
const Sellprice = require('../models/sellprice');
const Buyprice = require('../models/buyprice');
const Number = require('../models/number');




exports.adminindex = async (req, res, next) => {

  try {
    const result = await Data.find()
    const results = await Buydata.find()
    const pendingbuy = await Buydata.find({ status: 'pandding' })
    const pendingsell = await Data.find({ status: 'pandding' })

    const rating = await Rating.find()
    const user = await User.find()
    res.render('admin/index', { pageTitle: '', result, results, rating, user, pendingbuy, pendingsell });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)

  }
}

exports.getalluser = (req, res, next) => {
  User.find().then(user => {
    res.render('admin/userTable', { pageTitle: '', user: user });

  }).catch((err) => {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)
  });
}
exports.postdeleteuser = (req, res, next) => {
  const usersid = req.body.users;
  User.findByIdAndRemove(usersid)
    .then(result => {
      if (!result) {
        return res.redirect('/')
      }
      res.redirect('/currency/admin/alluser')
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error)
    });
}

exports.viewUser = async (req, res, next) => {
  try {
    const userId = req.params.userId

    const conframorder = await Data.find({ userId: userId, ordercon: false })
    const buyconframorder = await Buydata.find({ userId: userId, ordercon: false })
    await User.findById(userId).then(result => {
      res.render('admin/viewUser', { pageTitle: 'View User', result, conframorder, buyconframorder })
    }).catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error)

    })
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)


  }
}





exports.eorder = async (req, res, next) => {
  try {

    await Data.find({ ordercon: false }).then(order => {
      order = order.reverse()
      if (order) {

        const user = User.findById({ _id: order.userId })


        res.render('admin/order', { order: order, user: user })
      }

    }).catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error)
    })

  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)
  }
}

exports.buyorder = async (req, res, next) => {
  try {
   
    await Buydata.find({ ordercon: false }).then(orderss => {
      orderss = orderss.reverse()

      if (orderss) {



        const user = User.findById({ _id: orderss.userId })


        res.render('admin/buyorder', { orderss, user: user })
      }

    }).catch((err) => {
      console.log(err)

      const error = new Error(err);
      error.httpStatus = 500;
      return next(error)
    })

  } catch (err) {
    console.log(err)
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)
  }
}

exports.controlOrder = async (req, res, next) => {
  try {

    const orderId = req.body.orderId

    const userdata = await Data.findById(orderId)
    const user = await User.findById(userdata.userId)
    const result = await Data.findOneAndUpdate({ _id: req.body.orderId }, { new: true, runValidators: true })
    await Data.updateOne({ _id: req.body.orderId }, { status: req.body.status }, (err, data) => {


      if (req.body.status === 'completed') {

        if (result) {
          
          result.rat = true
           result.save()
        }

      }
      

     

      if (req.body.status === 'completed') {

        const html = `<h1 style="text-align: center;"><strong><span style="background-color: rgb(255, 255, 255); color: rgb(26, 188, 156);">Order Complete Successful</span></strong></h1>
<ol>
    <li><strong>
    <span style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 18px;">
    Method: ${userdata.condition}</span></strong></li>
    <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
   <li> <strong><span style="background-color: rgb(255, 255, 255);">Recive Amount :${userdata.tkrecive}</span></strong></li>
    <br>
   <li> <strong><span style="background-color: rgb(255, 255, 255);">Sent Amount :${userdata.usdsend}</span></strong></li>
    
    <br>
    <p style="text-align: center;"><span style="font-size: 20px;">Your Information</span></p>
    
   <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Number :${userdata.senderphone}</span></strong></li>
    <br>
   <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Email :${userdata.personalemail}</span></strong></li>
<br>
    <p style="text-align: center;"><span style="font-size: 20px;">Account Information</span></p>
<li><strong><span style="background-color: rgb(255, 255, 255);">Sendr Number/Email :${userdata.senderphone}</span></strong></li>
<br>
  <li>  <strong><span style="background-color: rgb(255, 255, 255);">Recive Number/Email :${userdata.reciveemail}</span></strong>
    </span></span></li>
    <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;"> 
    <br>

    <strong>Amount:${userdata.tkrecive}</strong></span></span></li>
    <li><span style="font-size: 18px; color: rgb(0, 0, 0);"><strong>Message:${userdata.description}</strong></span></li>
</ol>
<p><span style="font-size: 20px;">Order Id :#${userdata._id}</span></p>
<p><span style="font-size: 20px;">Date : ${userdata.createdAt}</span></p>
<p>Thanks You&nbsp;</p>

`

        sendEmail({
          email: user.email,
          subject: 'Order Complete Successfull',

          htmls: html
        })


      } else if (req.body.status === 'refunded') {

        const html = `<h1 style="text-align: center;"><strong><span style="background-color: rgb(255, 255, 255);
         color:rgb(235, 107, 86)">Your Order will be refunded</span></strong></h1>
<ol>
    <li><strong>
    <span style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 18px;">
    Method: ${userdata.condition}</span></strong></li>
    <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
    <strong><span style="background-color: rgb(255, 255, 255);">Recive Amount :${userdata.tkrecive}</span></strong></li>
    <br>
    <li><strong><span style="background-color: rgb(255, 255, 255);">Sent Amount :${userdata.usdsend}</span></strong></li>
  
    <br>
    <p style="text-align: center;"><span style="font-size: 20px;">Your Information</span></p>
    
   <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Number :${userdata.personalphone}</span></strong></li>
    <br>
   <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Email :${userdata.personalemail}</span></strong></li>
<br>
    <p style="text-align: center;"><span style="font-size: 20px;">Account Information</span></p>
<strong><span style="background-color: rgb(255, 255, 255);">Sendr Number/Email :${userdata.senderphone}</span></strong></li>
<br>
   <li> <strong><span style="background-color: rgb(255, 255, 255);">Recive Number/Email :${userdata.reciveemail}</span></strong></li>
    </span></span></li>
    <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;"> 
    <br>

   <li> <strong>Amount:${userdata.usdsend}</strong></span></span></li>
    <li><span style="font-size: 18px; color: rgb(0, 0, 0);"><strong>Message:${userdata.description}</strong></span></li>
</ol>
<p><span style="font-size: 22px; color: rgb(251, 160, 38);">Your money will be refunded, your money will be refunded to you due to some mechanical error Contact us</span></p>
<p><span style="font-size: 20px;">Order Id :#${userdata._id}</span></p>
<p><span style="font-size: 20px;">Date : ${userdata.createdAt}</span></p>
<p>Thanks You&nbsp;</p>`

        sendEmail({
          email: user.email,
          subject: 'Order Is refunded',

          htmls: html
        })
      } else if (req.body.status === 'pending') {

        const html = `<h1 style = "text-align: center;" > <strong><span style="background-color: rgb(255, 255, 255);
         color:rgb(250, 197, 28);">Your Order Is Pending</span></strong></h1>
          <ol>
            <li><strong>
              <span style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 18px;">
                Method: ${userdata.condition}</span></strong></li>
            <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
              <strong><span style="background-color: rgb(255, 255, 255);">Recive Amount :${userdata.tkrecive}</span></strong></li>
              <li> <strong><span style="background-color: rgb(255, 255, 255);">Sent Amount :${userdata.usdsend}</span></strong></li>

              <br>
                <p style="text-align: center;"><span style="font-size: 20px;">Your Information</span></p>

                <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Number :${userdata.personalphone}</span></strong></li>
                <br>
                <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Email :${userdata.personalemail}</span></strong></li>
                <br>
                  <p style="text-align: center;"><span style="font-size: 20px;">Account Information</span></p>
                 <li>  <strong><span style="background-color: rgb(255, 255, 255);">Sendr Number/Email :${userdata.senderphone}</span></strong></li>
                   <br>
                  <li> <strong><span style="background-color: rgb(255, 255, 255);">Recive Number/Email :${userdata.reciveemail}</span></strong></li>
    </span></span></li>
              <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
                <br>

                  <strong>Amount:${userdata.usdsend}</strong></span></span></li>
                <li><span style="font-size: 18px; color: rgb(0, 0, 0);"><strong>Message:${userdata.description}</strong></span></li>
</ol>
              <p><span style="font-size: 22px; color: rgb(251, 160, 38);">Your order will be completed shortly, Please wait</span></p>
              <p><span style="font-size: 20px;">Order Id :#${userdata._id}</span></p>
              <p><span style="font-size: 20px;">Date : ${userdata.createdAt}</span></p>
              <p>Thanks You&nbsp;</p>`

        sendEmail({
          email: user.email,
          subject: 'Order Is Pending',

          htmls: html
        })
      } else if (req.body.status === 'awaiting') {

        const html = `<h1 style = "text-align: center;" > <strong><span style="background-color: rgb(255, 255, 255);
         rgb(247, 218, 100);">Order Is awaiting</span></strong></h1>
          <ol>
            <li><strong>
              <span style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 18px;">
                Method: ${userdata.condition}</span></strong></li>
            <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
              <strong><span style="background-color: rgb(255, 255, 255);">Recive Amount :${userdata.tkrecive}</span></strong></li>
              <br>
             <li> <strong><span style="background-color: rgb(255, 255, 255);">Sent Amount :${userdata.usdsend}</span></strong></li>

              <br>
                <p style="text-align: center;"><span style="font-size: 20px;">Your Information</span></p>

              <li>  <strong><span style="background-color: rgb(255, 255, 255);">Your Number :${userdata.personalphone}</span></strong></li>
                <br>
              <li>  <strong><span style="background-color: rgb(255, 255, 255);">Your Email :${userdata.personalemail}</span></strong></li>
                <br>
                  <p style="text-align: center;"><span style="font-size: 20px;">Account Information</span></p>
                <li>  <strong><span style="background-color: rgb(255, 255, 255);">Sendr Number/Email :${userdata.senderphone}</span></strong></li>
                  <br>
                <li>  <strong><span style="background-color: rgb(255, 255, 255);">Recive Number/Email :${userdata.reciveemail}</span></strong></li>
                       </span></span></li>
              <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
                <br>

                  <strong>Amount:${userdata.usdsend}</strong></span></span></li>
                <li><span style="font-size: 18px; color: rgb(0, 0, 0);"><strong>Message:${userdata.description}</strong></span></li>
</ol>
              <p><span style="font-size: 22px; color: rgb(251, 160, 38);">You will have to wait a while due to a mechanical error. You will receive your payment as soon as possible.</span></p>
              <p><span style="font-size: 20px;">Order Id :#${userdata._id}</span></p>
              <p><span style="font-size: 20px;">Date : ${userdata.createdAt}</span></p>
              <p>Thanks You&nbsp;</p>`

        sendEmail({
          email: user.email,
          subject: 'Order Is awaiting',

          htmls: html
        })
      } else if (req.body.status === 'cancelled') {

        const html = `<h1 style = "text-align: center;" > <strong><span style="background-color:
         rgb(184, 49, 47);">Order Is cancelled</span></strong></h1>
          <ol>
            <li><strong>
              <span style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 18px;">
                Method: ${userdata.condition}</span></strong></li>
            <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
              <strong><span style="background-color: rgb(255, 255, 255);">Recive Amount :${userdata.tkrecive}</span></strong></li>
              <br>
             <li> <strong><span style="background-color: rgb(255, 255, 255);">Sent Amount :${userdata.usdsend}</span></strong></li>

              <br>
                <p style="text-align: center;"><span style="font-size: 20px;">Your Information</span></p>

               <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Number :${userdata.personalphone}</span></strong></li>
                <br>
               <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Email :${userdata.personalemail}</span></strong></li>
                <br>
                  <p style="text-align: center;"><span style="font-size: 20px;">Account Information</span></p>
                <li>  <strong><span style="background-color: rgb(255, 255, 255);">Sendr Number/Email :${userdata.senderphone}</span></strong></li>
                  <br>
                <li>  <strong><span style="background-color: rgb(255, 255, 255);">Recive Number/Email :${userdata.reciveemail}</span></strong></li>
    </span></span></li>
              <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
                <br>

                  <strong>Amount:${userdata.usdsend}</strong></span></span></li>
                <li><span style="font-size: 18px; color: rgb(0, 0, 0);"><strong>Message : ${userdata.description}</strong></span></li>
</ol>
              <p><span style="font-size: 22px; color: rgb(251, 160, 38);">Your order has been canceled, please contact us and re-order</span></p>
              <p><span style="font-size: 20px;">Order Id :#${userdata._id}</span></p>
              <p><span style="font-size: 20px;">Date : ${userdata.createdAt}</span></p>
              <p>Thanks You&nbsp;</p>`
        sendEmail({
          email: user.email,
          subject: 'Order Is cancelled',

          htmls: html
        })
      }

      

      if (err) {

        return res.redirect('/currency/admin/order')

      }
      return res.redirect('/currency/admin/order')
    })
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)
  }

}

exports.controlOrderbuy = async (req, res, next) => {
  try {
    const orderId = req.body.orderId
    const data = await Buydata.findById(orderId)
    const user = await User.findById(data.userId)
    const result = await Buydata.findOneAndUpdate({ _id: req.body.orderId }, { new: true, runValidators: true })

    await Buydata.updateOne({ _id: req.body.orderId }, { status: req.body.status }, (err, datas) => {

      if (req.body.status === 'completed') {
        if (result) {
          
          result.rat = true
           result.save()
        }
      }

     
   
      if (req.body.status === 'completed') {

        const html = `<h1 style="text-align: center;"><strong><span style="background-color: rgb(255, 255, 255); color: rgb(26, 188, 156);">Order Complete Successful</span></strong></h1>
<ol>
    <li><strong>
    <span style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 18px;">
    Method: ${data.condition}</span></strong></li>
    <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
   <li> <strong><span style="background-color: rgb(255, 255, 255);">Recive Amount :${data.reciveusd}</span></strong></li>
    <br>
   <li> <strong><span style="background-color: rgb(255, 255, 255);">Sent Amount :${data.senttk}</span></strong></li>
    
    <br>
    <p style="text-align: center;"><span style="font-size: 20px;">Your Information</span></p>
    
   <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Number :${data.senderphone}</span></strong></li>
    <br>
   <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Email :${data.personalemail}</span></strong></li>
<br>
    <p style="text-align: center;"><span style="font-size: 20px;">Account Information</span></p>
<li><strong><span style="background-color: rgb(255, 255, 255);">Sendr Number/Email :${data.senderphone}</span></strong></li>
<br>
  <li>  <strong><span style="background-color: rgb(255, 255, 255);">Recive Number/Email :${data.reciveemail}</span></strong>
    </span></span></li>
    <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;"> 
    <br>

    <strong>Amount:${data.reciveusd}</strong></span></span></li>
    <li><span style="font-size: 18px; color: rgb(0, 0, 0);"><strong>Message:${data.description}</strong></span></li>
</ol>
<p><span style="font-size: 20px;">Order Id :#${data._id}</span></p>
<p><span style="font-size: 20px;">Date : ${data.createdAt}</span></p>
<p>Thanks You&nbsp;</p>

`

        sendEmail({
          email: user.email,
          subject: 'Order Complete Successfull',
       
          htmls: html
        })


      } else if (req.body.status === 'refunded') {

        const html = `<h1 style="text-align: center;"><strong><span style="background-color: rgb(255, 255, 255);
         color:rgb(235, 107, 86)">Your Order will be refunded</span></strong></h1>
<ol>
    <li><strong>
    <span style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 18px;">
    Method: ${data.condition}</span></strong></li>
    <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
    <strong><span style="background-color: rgb(255, 255, 255);">Recive Amount :${data.reciveusd}</span></strong></li>
    <br>
    <li><strong><span style="background-color: rgb(255, 255, 255);">Sent Amount :${data.senttk}</span></strong></li>
  
    <br>
    <p style="text-align: center;"><span style="font-size: 20px;">Your Information</span></p>
    
   <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Number :${data.senderphone}</span></strong></li>
    <br>
   <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Email :${data.personalemail}</span></strong></li>
<br>
    <p style="text-align: center;"><span style="font-size: 20px;">Account Information</span></p>
<strong><span style="background-color: rgb(255, 255, 255);">Sendr Number/Email :${data.senderphone}</span></strong></li>
<br>
   <li> <strong><span style="background-color: rgb(255, 255, 255);">Recive Number/Email :${data.reciveemail}</span></strong></li>
    </span></span></li>
    <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;"> 
    <br>

   <li> <strong>Amount:${data.reciveusd}</strong></span></span></li>
    <li><span style="font-size: 18px; color: rgb(0, 0, 0);"><strong>Message:${data.description}</strong></span></li>
</ol>
<p><span style="font-size: 22px; color: rgb(251, 160, 38);">Your money will be refunded, your money will be refunded to you due to some mechanical error Contact us</span></p>
<p><span style="font-size: 20px;">Order Id :#${data._id}</span></p>
<p><span style="font-size: 20px;">Date : ${data.createdAt}</span></p>
<p>Thanks You&nbsp;</p>`

        sendEmail({
          email: user.email,
          subject: 'Order Is refunded',

          htmls: html
        })
      } else if (req.body.status === 'pending') {

        const html = `<h1 style = "text-align: center;" > <strong><span style="background-color: rgb(255, 255, 255);
         color:rgb(250, 197, 28);">Your Order Is Pending</span></strong></h1>
          <ol>
            <li><strong>
              <span style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 18px;">
                Method: ${data.condition}</span></strong></li>
            <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
              <strong><span style="background-color: rgb(255, 255, 255);">Recive Amount :${data.reciveusd}</span></strong></li>
              <li> <strong><span style="background-color: rgb(255, 255, 255);">Sent Amount :${data.senttk}</span></strong></li>

              <br>
                <p style="text-align: center;"><span style="font-size: 20px;">Your Information</span></p>

                <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Number :${data.senderphone}</span></strong></li>
                <br>
                <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Email :${data.personalemail}</span></strong></li>
                <br>
                  <p style="text-align: center;"><span style="font-size: 20px;">Account Information</span></p>
                 <li>  <strong><span style="background-color: rgb(255, 255, 255);">Sendr Number/Email :${data.senderphone}</span></strong></li>
                   <br>
                  <li> <strong><span style="background-color: rgb(255, 255, 255);">Recive Number/Email :${data.reciveemail}</span></strong></li>
    </span></span></li>
              <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
                <br>

                  <strong>Amount:${data.reciveusd}</strong></span></span></li>
                <li><span style="font-size: 18px; color: rgb(0, 0, 0);"><strong>Message:${data.description}</strong></span></li>
</ol>
              <p><span style="font-size: 22px; color: rgb(251, 160, 38);">Your order will be completed shortly, Please wait</span></p>
              <p><span style="font-size: 20px;">Order Id :#${data._id}</span></p>
              <p><span style="font-size: 20px;">Date : ${data.createdAt}</span></p>
              <p>Thanks You&nbsp;</p>`

        sendEmail({
          email: user.email,
          subject: 'Order Is Pending',

          htmls: html
        })
      } else if (req.body.status === 'awaiting') {
       
        const html = `<h1 style = "text-align: center;" > <strong><span style="background-color: rgb(255, 255, 255);
         rgb(247, 218, 100);">Order Is awaiting</span></strong></h1>
          <ol>
            <li><strong>
              <span style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 18px;">
                Method: ${data.condition}</span></strong></li>
            <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
              <strong><span style="background-color: rgb(255, 255, 255);">Recive Amount :${data.reciveusd}</span></strong></li>
              <br>
             <li> <strong><span style="background-color: rgb(255, 255, 255);">Sent Amount :${data.senttk}</span></strong></li>

              <br>
                <p style="text-align: center;"><span style="font-size: 20px;">Your Information</span></p>

              <li>  <strong><span style="background-color: rgb(255, 255, 255);">Your Number :${data.senderphone}</span></strong></li>
                <br>
              <li>  <strong><span style="background-color: rgb(255, 255, 255);">Your Email :${data.personalemail}</span></strong></li>
                <br>
                  <p style="text-align: center;"><span style="font-size: 20px;">Account Information</span></p>
                <li>  <strong><span style="background-color: rgb(255, 255, 255);">Sendr Number/Email :${data.senderphone}</span></strong></li>
                  <br>
                <li>  <strong><span style="background-color: rgb(255, 255, 255);">Recive Number/Email :${data.reciveemail}</span></strong></li>
                       </span></span></li>
              <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
                <br>

                  <strong>Amount:${data.reciveusd}</strong></span></span></li>
                <li><span style="font-size: 18px; color: rgb(0, 0, 0);"><strong>Message:${data.description}</strong></span></li>
</ol>
              <p><span style="font-size: 22px; color: rgb(251, 160, 38);">You will have to wait a while due to a mechanical error. You will receive your payment as soon as possible.</span></p>
              <p><span style="font-size: 20px;">Order Id :#${data._id}</span></p>
              <p><span style="font-size: 20px;">Date : ${data.createdAt}</span></p>
              <p>Thanks You&nbsp;</p>`

        sendEmail({
          email: user.email,
          subject: 'Order Is awaiting',

          htmls: html
        })
      } else if (req.body.status === 'cancelled') {
       
        const html = `<h1 style = "text-align: center;" > <strong><span style="background-color:
         rgb(184, 49, 47);">Order Is cancelled</span></strong></h1>
          <ol>
            <li><strong>
              <span style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 18px;">
                Method: ${data.condition}</span></strong></li>
            <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
              <strong><span style="background-color: rgb(255, 255, 255);">Recive Amount :${data.reciveusd}</span></strong></li>
              <br>
             <li> <strong><span style="background-color: rgb(255, 255, 255);">Sent Amount :${data.senttk}</span></strong></li>

              <br>
                <p style="text-align: center;"><span style="font-size: 20px;">Your Information</span></p>

               <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Number :${data.senderphone}</span></strong></li>
                <br>
               <li> <strong><span style="background-color: rgb(255, 255, 255);">Your Email :${data.personalemail}</span></strong></li>
                <br>
                  <p style="text-align: center;"><span style="font-size: 20px;">Account Information</span></p>
                <li>  <strong><span style="background-color: rgb(255, 255, 255);">Sendr Number/Email :${data.senderphone}</span></strong></li>
                  <br>
                <li>  <strong><span style="background-color: rgb(255, 255, 255);">Recive Number/Email :${data.reciveemail}</span></strong></li>
    </span></span></li>
              <li><span style="color: rgb(0, 0, 0);"><span style="font-size: 18px;">
                <br>

                  <strong>Amount:${data.reciveusd}</strong></span></span></li>
                <li><span style="font-size: 18px; color: rgb(0, 0, 0);"><strong>Message : ${data.description}</strong></span></li>
</ol>
              <p><span style="font-size: 22px; color: rgb(251, 160, 38);">Your order has been canceled, please contact us and re-order</span></p>
              <p><span style="font-size: 20px;">Order Id :#${data._id}</span></p>
              <p><span style="font-size: 20px;">Date : ${data.createdAt}</span></p>
              <p>Thanks You&nbsp;</p>`
        sendEmail({
          email: user.email,
          subject: 'Order Is cancelled',

          htmls: html
        })
      }

      if (err) {

        return res.redirect('/currency/admin/buyorder')

      }
      return res.redirect('/currency/admin/buyorder')
    })
  } catch (err) {
    console.log(err);

    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)
  }

}




exports.postdeleteorder = (req, res, next) => {
  const orderId = req.body.orderId;
  Data.findByIdAndRemove(orderId).then(result => {
    if (!result) {
      return res.redirect('/')
    }
    res.redirect('/currency/admin/order')
  }).catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)

  })
}

exports.postdeleteorderbuy = (req, res, next) => {
  const orderId = req.body.orderId;
  Buydata.findByIdAndRemove(orderId).then(result => {
    if (!result) {
      return res.redirect('/')
    }
    res.redirect('/currency/admin/buyorder')
  }).catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)

  })
}



exports.orderDetails = (req, res, next) => {
  const orderId = req.params.orderId
  Order.findById(orderId)

    .then(result => {
      console.log(result);
      let userss = result.user.userId
      User.findById(userss).then(info => {
        console.log(result);
        console.log(info);


        res.render('admin/manage-order', { order: result, userInfo: info })

      }).catch((err) => {
        const error = new Error(err);
        error.httpStatus = 500;
        return next(error)
      });

    }).catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error)
    });
}


exports.getrate = async (req, res, next) => {
  try {
 
    const results = await Sellprice.find()


    res.render('admin/rate', { results })



  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)

  }
}

exports.updateRate = (req, res, next) => {
  try {
    const rateId = req.body.rateId
    Sellprice.findByIdAndUpdate(rateId, { new: true, runValidators: true }).then(result => {
      result.bdcountryname = req.body.bdcountryname,
        result.bdrate = req.body.bdrate,
        result.uscountryname = req.body.uscountryname,
        result.usrate = req.body.usrate

      result.save()
      res.redirect('/currency/admin/rate')
    }).catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error)

    })

  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)


  }
}





exports.getnumber = async (req, res, next) => {
  try {
  
    const results = await Number.find()


    res.render('admin/number', { results })



  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)

  }
}

exports.updatenumber = (req, res, next) => {
  try {
    const rateId = req.body.rateId
    Number.findByIdAndUpdate(rateId, { new: true, runValidators: true }).then(result => {

      result.accountname = req.body.accountname,
        result.number = req.body.number ,
      
      result.save()
      res.redirect('/currency/admin/accountnumber')
    }).catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error)

    })

  } catch (err) {
     console.log(err);
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)


  }
}




exports.buygetrate = async (req, res, next) => {
  try {
    const result = await Buyprice.find()
    res.render('admin/buyprice', { results: result })

  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)

  }
}

exports.buyupdateRate = (req, res, next) => {
  try {
    const rateId = req.body.rateId
    Buyprice.findByIdAndUpdate(rateId, { new: true, runValidators: true }).then(result => {
      result.bdcountryname = req.body.bdcountryname,
        result.bdrate = req.body.bdrate,
        result.uscountryname = req.body.uscountryname,
        result.usrate = req.body.usrate

      result.save()
      res.redirect('/currency/admin/buyprice')
    }).catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error)

    })

  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)


  }
}


exports.addpostaboutus = (req, res, next) => {

  const title = req.body.title;

  About.findOne({ title: title }).then(result => {
    if (result) {
      console.log('this title alrady created');
      return res.redirect('/currency/admin/add-cetagory')
    }
    const about = new About({
      title: title,

    })
    return about.save()
  }).then(result => {
    res.redirect('/currency/admin/add-about')
  })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error)
    });

}
exports.addgetAbouts = (req, res, next) => {
  About.find().then(about => {
    res.render('admin/addAbout', { path: '/currency/admin/add-about', pageTitle: 'admin  About Us', about: about, editing: false })
  }).catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)


  })

}

exports.postdeleteAbout = (req, res, next) => {
  const aboutID = req.body.aboutId;
  About.findByIdAndRemove(aboutID)
    .then(result => {
      if (!result) {
        return res.redirect('/')
      }
      res.redirect('/currency/admin/add-about')
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error)
    });
}



//privasy

exports.addpostaPrivacy = (req, res, next) => {

  const title = req.body.title;

  Privacy.findOne({ title: title }).then(result => {
    if (result) {
      console.log('this title alrady created');
      return res.redirect('/currency/admin/add-privacy')
    }
    const about = new Privacy({
      title: title,

    })
    return about.save()
  }).then(result => {
    res.redirect('/currency/admin/add-privacy')
  })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error)
    });

}
exports.addgetPrivacy = (req, res, next) => {
  Privacy.find().then(about => {
    res.render('admin/privasy', { path: '/currency/admin/add-privacy', pageTitle: 'admin  About Us', about: about, editing: false })
  }).catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)

  })

}

exports.postdeletePrivacy = (req, res, next) => {
  const aboutID = req.body.aboutId;
  Privacy.findByIdAndRemove(aboutID)
    .then(result => {
      if (!result) {
        return res.redirect('/')
      }
      res.redirect('/currency/admin/add-privacy')
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error)
    });
}
