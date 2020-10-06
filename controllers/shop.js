
const Data = require('../models/selldata');
const Buydata = require('../models/buydata');
const Rating = require('../models/rating');
const { validationResult } = require('express-validator/check')
const User = require('../models/user')
const ANumber = require('../models/number')
const sendEmail = require('../middleware/sentemail')







//profile
exports.profileIndex = (req, res, next) => {
  if (!req.user) {
    return res.status(422).redirect('/login');
  }

  try {
    User.findById(req.user._id).then(result => {

      res.render('shop/profile', {
        pageTitle: 'Profile', path: '/profile',
        errorMessage: '',
        validationError: [],

        oldInput: {
          email: result.email,
          name: result.name,
          phone: result.phone,
          address: result.address,
          zip: result.zip
        }
      })
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

exports.updateProfile = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id).then(user => {
    if (!user) {
      return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        oldInput: { name: '', email: '', password: '', confirmPassword: '' },
        validationError: []
      });
    }

    user.name = req.body.name,
      user.phone = req.body.phone,
      user.address = req.body.address,
      user.zip = req.body.zip



    return user.save()


  }).then(result => {
    res.redirect('/profile')
  }).catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)

  })
}
//end

exports.getIndex = async (req, res, next) => {

  try {
    const rating = await Rating.find().limit(8)
    const result = await Data.find().limit(8)
    const results = await Buydata.find().limit(8)


    res.render('shop/index', {
      result: result,
      results: results,

      pageTitle: 'Shop',
      path: '/',
      rating
    });


  } catch (err) {
    console.log(err)
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)
  }


};



//sell client doller
exports.getDollerformUser = (req, res, nex) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  if (!req.user) {
    return res.status(422).redirect('/login');
  }
  try {
  
    
    res.render('shop/buydoller', {
      pageTitle: 'selldoller', path: '/selldoller',
      errorMessage: message,
      validationError: []
      
    })
  } catch (err) {
    
    console.log(err);
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)
  
  }

}

exports.postDollerformUser = async (req, res, next) => {

  const error = validationResult(req)
  if (!error.isEmpty()) {
    console.log(error.array())
    return res.status(422).render('shop/buydoller',
      {
        pageTitle: 'selldoller', path: '/selldoller',
        errorMessage: error.array()[0].msg,
        validationError: error.array()
      });
  }
  try {
    await Data.find().then(result => {

      const usdsend = req.body.usdsend;
      const bdcardName = req.body.bdcard;
      const tkrecive = req.body.excengprice;
      const usdcardname = req.body.cardname;

      const data = new Data({

        usdsend: usdsend + '$US',
        bdcardName,
        tkrecive: tkrecive + 'Tk',
        usdcardname,

        userId: req.user._id

      })

      console.log(data)
      if (data) {

        const html = `<p style="text-align: center;"><span style="color: rgb(71, 85, 119); font-size: 24px;">Your Order Created Successfully</span></p>
      <br>
      <p style="text-align: left;"><span style="font-size: 20px; color: rgb(226, 80, 65);">You Are Selling(</span><span style="font-size: 22px; color: rgb(0, 0, 0);">${usdsend}USD) </span></p>
<p><br></p>
<p><br></p>
      <br>
<p><span style="font-size: 18px;">Please Go to Our Website and Click Order Button ( if You are not login please login Your Website and) You Can see Confirm Your Order click this button And you can see Our Account number/email &nbsp;Send Your Dollar In Our Accounts , and also sent your select number (Baksh/rocket/etc) </span></p>
<p><br></p>
<br>
<p style="text-align: center;"><span style="font-size: 15px;">(দয়া করে আমাদের ওয়েবসাইটে যান এবং অর্ডার বোতামটি ক্লিক করুন (আপনি লগইন না করে থাকলে দয়া করে আপনার ওয়েবসাইটটিতে লগইন করুন এবং) আপনি দেখতে পাবেন যাব বাড়ে অর্ডার বাটন অর্ডার  নিশ্চিত করে করতে কনফার্ম  বোতামটি ক্লিক করুন এবং আমাদের অ্যাকাউন্টটি আপনার ডলার পপাঠান  এবং ফ্রম টি পুরোন করুন সাথে  আপনার একাউন্ট নম্বর টি সেন্ড করুন  (বিকাশ / রকেট  ) )</span></p>
<p><br></p>

<p><span style="font-size: 20px;">Order Complete time maximum 1hr min (1-10minit)</span></p>
<p><br></p>
<p><span style="font-size: 22px;">Thanks You</span></p>`

        sendEmail({
          email: req.user.email,
          subject: 'Your Order Created Successfully',

          html
        })

      }

      return data.save()

    }).then(results => {
      res.redirect('/order')
    }).catch(err => {
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



//buy client doller
exports.getbuyDollerformUser = (req, res, nex) => {
  try {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    if (!req.user) {
      return res.status(422).redirect('/login');
    }
    res.render('shop/selldoller', {
      pageTitle: 'buydoller', path: '/buydoller', errorMessage: message,
      validationError: []
    })

  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)
  }
}
exports.postbuyDollerformUser = async (req, res, next) => {
  try {
    const error = validationResult(req)
    if (!error.isEmpty()) {
      console.log(error.array())
      return res.status(422).render('shop/selldoller',
        {
          pageTitle: 'buydoller', path: '/buydoller',
          errorMessage: error.array()[0].msg,
          validationError: error.array()
        });
    }

    await Buydata.find().then(result => {

      const reciveusd = req.body.reciveusd;
      const reciveusdName = req.body.bdcard;
      const senttk = req.body.doller;
      const sentaccountname = req.body.cardname;

      const data = new Buydata({

        reciveusd: reciveusd + '$US',
        reciveusdName,
        senttk: senttk + 'Tk',
        sentaccountname,

        userId: req.user._id

      })
      if (data) {

        const html = `<p style="text-align: center;"><span style="color: rgb(71, 85, 119); font-size: 24px;">Your Order Created Successfully</span></p>
        <br>
       <p style="text-align: left;"><span style="font-size: 20px; color: rgb(226, 80, 65);">You have purchased (</span><span style="font-size: 22px; color: rgb(0, 0, 0);">${reciveusd}USD)</span></p>
<p><br></p>
<p><br></p>
        <br>
<p><span style="font-size: 18px;">Please Go to Our Website and Click Order Button ( if You are not login please login Your Website and) You Can see Confirm Your Order click this button And you can see Our Account number &nbsp;Send Your Tk  In Our Accounts , and also sent your select number (Neteller/Paypal/ets) </span></p>
<p style="text-align: center;"><span style="font-size: 15px;">(দয়া করে আমাদের ওয়েবসাইটে যান এবং অর্ডার বোতামটি ক্লিক করুন (আপনি লগইন না করে থাকলে দয়া করে আপনার ওয়েবসাইটটিতে লগইন করুন এবং) আপনি দেখতে পাবেন যাব বাড়ে অর্ডার বাটন অর্ডার  নিশ্চিত করে করতে কনফার্ম  বোতামটি ক্লিক করুন এবং আমাদের অ্যাকাউন্টটি আপনার টাকা পপাঠান  এবং ফ্রম টি পুরোন করুন সাথে  আপনার একাউন্ট নম্বর টি সেন্ড করুন  (নেটেলার / পেপাল / ইত্যাদি )  )</span></p>
<p><br></p>
<p><span style="font-size: 20px;">Order Complete time maximum 1hr min (1-10minit)</span></p>
<p><br></p>
<p><span style="font-size: 22px;">Thanks You</span></p>`

        sendEmail({
          email: req.user.email,
          subject: 'Your Order Created Successfully',

          htmls: html
        })

      }

      return data.save()
      // } else {
      //   res.redirecet('/')
      // }


    }).then(results => {
      res.redirect('/order')
    })

      .catch(err => {
        console.log(err);
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






//order
exports.getOrder = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(422).redirect('/login');
    }

    const order = await Data.find({ userId: req.user._id, ordercon: true })
    const conframorder = await Data.find({ userId: req.user._id, ordercon: false })
    const buyconframorder = await Buydata.find({ userId: req.user._id, ordercon: false })
    const buyorder = await Buydata.find({ userId: req.user._id, ordercon: true })

    res.render('shop/order', {
      pageTitle: 'Order', path: 'order',
      neworder: order,
      conframorder: conframorder,
      buyconframorder: buyconframorder,
      buyneworder: buyorder

    })

  }
  catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)

  }
}

exports.getdetailsPage = async (req, res, next) => {
  if (!req.user) {
    return res.status(422).redirect('/login');
  }
  const orderId = req.params.orderId
  try {
    const result = await Data.findById(orderId)
    const results = await Buydata.findById(orderId)

    const bkash = await ANumber.findOne({ "accountname": "bkash" })
    const rocket = await ANumber.findOne({ "accountname":"rocket"})
    const Nagad = await ANumber.findOne({ "accountname":"Nagad"})
    const Skrill = await ANumber.findOne({ "accountname":"Skrill"})
    const Neteller = await ANumber.findOne({ "accountname":"Neteller"})
    const PayPal = await ANumber.findOne({ "accountname": "PayPal" })
 

    if (!results & !result) {
      return res.status(422).redirect('/')
    }

    if (result) {

      res.render('shop/details', {

        pageTitle: 'Get Details', path: '/details',

        doller: result.usdsend,
        excengprice: result.tkrecive,
        Id: result._id,
        cardname: result.usdcardname,
        bdcard: result.bdcardName,
        bkash,
        rocket, Nagad, Skrill, Neteller, PayPal

      })
    } else if (results) {

      res.render('shop/details', {
        pageTitle: 'Get Details', path: '/details',
        doller: results.senttk,
        excengprice: results.reciveusd,
        Id: results._id,
        cardname: results.sentaccountname,
        bdcard: results.reciveusdName,
        bkash,
        rocket, Nagad, Skrill, Neteller, PayPal
      })

    }
  } catch (err) {
    console.log(err)
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)

  }
}

exports.postConframOrder = async (req, res) => {



  const orderId = req.params.orderId
  const senderphone = req.body.senderphone
  const reciveemail = req.body.reciveemail
  const personalemail = req.body.personalemail
  const personalphone = req.body.personalphone
  const description = req.body.description
  try {

    const resultdata = await Data.findById(orderId)
    const results = await Buydata.findById(orderId)
    if (resultdata) {
      await Data.findByIdAndUpdate(orderId, { new: true, runValidators: true }).then(result => {
        if (!result) {
          return res.status(422).redirect('/')
        }


        result.senderphone = senderphone,
          result.reciveemail = reciveemail,
          result.personalemail = personalemail,
          result.personalphone = personalphone,
          result.description = description,
          result.ordercon = false




        const html = `<p style="text-align: center;"><span style="color: rgb(71, 85, 119); font-size: 24px;">Your Order Is Confirmed</span></p>
                  <br>

          <p><br></p>
                  <br>
          <p><span style="font-size: 18px;">Once your order is confirmed, we will check your information and within a few minutes you will receive your payment. </span></p>
          <p style="text-align: center;"><span style="font-size: 15px;">(আপনার অর্ডার টি কনফ্রাম হয়েসে  , আমরা আপনার ইনফরমেশন গুলো চেক করতেসি , কিকক্ষন এর ভিতরে আপনি আপনার পেমেন্ট পায়ে যাবেন  )</span></p>
          <p><br></p>
          <p><span style="font-size: 20px;">Order Complete time maximum 1hr min (1-10minit)</span></p>
          <p><br></p>
          <p><span style="font-size: 22px;">Thanks You</span></p>`

        sendEmail({
          email: req.user.email,
          subject: 'Your Order Is Confirmed',

          htmls: html
        })


        return result.save()

      }).then(results => {
        res.redirect('/order')
      })
        .catch(err => {
          console.log(err)
          const error = new Error(err);
          error.httpStatus = 500;
          return next(error)
        })
    } else if (results) {
      await Buydata.findByIdAndUpdate(orderId, { new: true, runValidators: true }).then(result => {
        if (!result) {
          return res.status(422).redirect('/')
        }

        console.log(result)
        result.senderphone = senderphone,
          result.reciveemail = reciveemail,
          result.personalemail = personalemail,
          result.personalphone = personalphone,
          result.description = description,
          result.ordercon = false


        const html = `<p style="text-align: center;"><span style="color: rgb(71, 85, 119); font-size: 24px;">Your Order Is Confirmed</span></p>
                <br>

        <p><br></p>
                <br>
        <p><span style="font-size: 18px;">Once your order is confirmed, we will check your information and within a few minutes you will receive your payment. </span></p>
        <p style="text-align: center;"><span style="font-size: 15px;">(আপনার অর্ডার টি কনফ্রাম হয়েসে  , আমরা আপনার ইনফরমেশন গুলো চেক করতেসি , কিকক্ষন এর ভিতরে আপনি আপনার পেমেন্ট পায়ে যাবেন  )</span></p>
        <p><br></p>
        <p><span style="font-size: 20px;">Order Complete time maximum 1hr min (1-10minit)</span></p>
        <p><br></p>
        <p><span style="font-size: 22px;">Thanks You</span></p>`

        sendEmail({
          email: req.user.email,
          subject: 'Your Order Is Confirmed',

          htmls: html
        })

        return result.save()

      }).then(results => {
        res.redirect('/order')
      })
        .catch(err => {
          console.log(err)
          const error = new Error(err);
          error.httpStatus = 500;
          return next(error)
        })
    }


  } catch (err) {
    console.log(err)
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)

  }
}


//rating
exports.getRating = async (req, res) => {
  if (!req.user) {
    return res.status(422).redirect('/login');
  }
  try {

    const data = await Data.find({ userId: req.user._id, rat: true })
    const buydata = await Buydata.find({ userId: req.user._id, rat: true })



    res.render('shop/rating', { pageTitle: 'Your Rating', path: 'rating', buydata, data })
  } catch (err) {
    console.log(err)
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error)

  }
}

exports.postRating = async (req, res) => {
  try {
    const orderId = req.body.orderId
    await Rating.find().then(result => {
      const rating = new Rating({
        rating: req.body.rating,
        description: req.body.description,
        username: req.user.name
      })

      Data.updateOne({ _id: orderId, rat: true }, { rat: false }, (err, data) => {
        if (err) {
          const error = new Error(err);
          error.httpStatus = 500;
          return next(error)
        }
      })
      Buydata.updateOne({ _id: orderId, rat: true }, { rat: false }, (err, data) => {
        if (err) {
          const error = new Error(err);
          error.httpStatus = 500;
          return next(error)
        }
      })


      const html = `Thanks For Your Rating .`



      sendEmail({
        email: req.user.email,
        subject: 'Thanks For Your Rating ',

        htmls: html
      })


      return rating.save()

    }).then(results => {
      res.redirect('/')
    }).catch(err => {
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

exports.travel = (req, res, next) => {

  res.render('shop/', {
    path: '/travel',
    pageTitle: 'Travel',

  });

};
exports.interior = (req, res, next) => {

  res.render('shop/work', {
    path: '/work',
    pageTitle: 'how-its-work',

  });

};

