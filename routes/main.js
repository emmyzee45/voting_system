var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
/* GET users listing. */
// const express=require('express');
// const app=express()
var conn=require('../database');
dotenv.config();

router.get('/form', function(req, res, next) {
  // res.render('voter-registration.ejs');
  if(req.session.loggedinUser){
    res.render('voter-registration.ejs')
  }else{
    res.redirect('/login');
  }
});


var getAge = require('get-age');
const authorization = {
  "access_token": "ya29.a0AWY7Ckn_JC5L8TnWi6rnjdVzV5GZ3hWzqY_NlZujToq9CSZFFulo1LY5rri2LXwmnP5Mgb50TdvdZ48DC5L7YzPukZd2XR5LbKgNsueptESsqHC_JClxmlfNX4AXFY5FleWVJ8itMoqjtVacGoZR5TJjuMYnaCgYKAeYSARESFQG1tDrp39Y3KYjfZSPxQDlUXfIViQ0163", 
  "scope": "https://mail.google.com/", 
  "token_type": "Bearer", 
  "expires_in": 3599, 
  "refresh_token": "1//04CxuqX0JqzPzCgYIARAAGAQSNwF-L9IrT4JTkpiXy8DGerioeTNRu9d3NyRjIpY0b0jiYjbcOEPIUphTC2feiemds4yWV6pN-S0"
}
// 764879974942-skov9jliah1iobptjj6apb33e5ds7ct1.apps.googleusercontent.com
// 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

var nodemailer = require('nodemailer');
var rand=Math.floor((Math.random() * 10000) + 54);
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'emmyaondohemba45@gmail.com',
      pass: 'iorolun45',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    }
  });

var account_address;
var data;

// app.use(express.static('public'));
// //app.use('/css',express.static(__dirname+'public/css'));
// //app.use(express.json());
// app.use(express.urlencoded());

router.post('/registerdata',function(req,res){
    var dob=[];
    data=req.body.aadharno;    //data stores aadhar no
    account_address=req.body.account_address;     //stores metamask acc address
    //console.log(data);
    let sql = "SELECT * FROM aadhar_info WHERE aadharno = ?" ;   
    conn.query(sql, data, (error, results, fields) => {
        if (error) {
          return console.error(error.message);
        }
        if(results.length == 0) {
          return console.error(error.message);
        }
        dob = results[0].Dob;
        var email=results[0].Email;
        age = getAge(dob);
        is_registerd=results[0].Is_registered;
        if (is_registerd!='YES')
        {
          console.log("Age",dob)

          if (dob>=18)
          {
            var mailOptions = {
                from: 'sharayuingale19@gmail.com',
                to: email,
                subject : "Please confirm your Email account",
                text : "Hello, Your otp is "+rand	
              };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } 
                else {
                  console.log('Email sent: ' + info.response);
                }
              });
            res.render('emailverify.ejs');
          }
          else
          {
            res.send('You cannot vote as your age is less than 18');
          }
        }
        else    //IF USER ALREADY REGISTERED
        {
          res.render('voter-registration.ejs',{alertMsg:"You are already registered. You cannot register again"});
        }
        
    });

    //console.log(dob);
    //console.log(age);
    //res.send("ok")
    //console.log(dob);
})

router.post('/otpverify', (req, res) => {
    var otp = req.body.otp;
    if (otp==rand) 
    {
        var record= { Account_address: account_address, Is_registered : 'Yes' };
        var sql="INSERT INTO registered_users SET ?";
        conn.query(sql,record, function(err2,res2)
          {
              if (err2){
             throw err2;
            }
              else{
                var sql1="Update aadhar_info set Is_registered=? Where Aadharno=?";
                var record1=['YES',data]
                console.log(data)
                conn.query(sql1,record1, function(err1,res1)
                {
                   if (err1) {
                    res.render('voter-registration.ejs');
                   }
                   else{
                    console.log("1 record updated");
                    var msg = "You are successfully registered";
                    // res.send('You are successfully registered');
                    res.render('voter-registration.ejs',{alertMsg:msg});                 
                  }
                }); 
               
              }
          }); 
    }
    else 
    {
       res.render('voter-registration.ejs',{alertMsg:"Session Expired! , You have entered wronge OTP "});
    }
})



// router.get('/register',function(req,res){
//     res.sendFile(__dirname+'/views/index.html')
// });

/*app.get('/signin_signup',function(req,res){
    res.sendFile(__dirname+'/views/signup.html')
});

app.get('/signup',function(req,res){
    console.log(req.body);
    res.sendFile(__dirname+'/views/signup.html')
});*/

module.exports = router;