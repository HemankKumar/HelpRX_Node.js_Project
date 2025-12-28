var express = require("express");
var fileuploader = require("express-fileupload");// used to upload file
const mysql = require("mysql2");
var app = express();
var cors=require('cors'); 


app.listen(3000, function () {
  console.log("server started");
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileuploader());  // used to upload image file..
app.use(express.static("public")); // public ki file ko use krne k liye(middle ware jo client and server k beech conversation krega)


app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/index.html");
});

//=============DB OPERATIONS=============================
//=============DATABASE CONNECTIVITY====================

var dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  },
  dateStrings: true
}

var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (err) {
  if (err) {
    console.error("❌ DB connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL on Aiven");
  }
});






//===================saving index k signup ka data on database===========

app.get("/signup", function (req, resp) {

  var email = req.query.kuchemail;
  var pass = req.query.kuchpass;
  var type = req.query.kuchtype;

  dbCon.query("insert into signup(email,pass,type,status,doj) values(?,?,?,1,current_date())", [email, pass, type], function (err) {
      if (err) {
        resp.json({
          success: false,
          message: err.message
        });
      } else {
        resp.json({
          success: true,
          message: "Record saved successfully"
        });
      }

  });


});

//====================check index k login ka data in database=================

app.get("/Login",function(req,resp){
  var email=req.query.kuchemail;
  var password=req.query.kuchpass;
  dbCon.query("select type,status from signup where email=? and pass=?",[email,password],function(err,resultTable){
    if(err==null)
    {
      if(resultTable.length==1)
        {
          if(resultTable[0].status==1)
                resp.send(resultTable[0].type);
          else
               resp.send("U R Blocked");
        }
        else
          resp.send("Invalid User Id/Password");

    }
  else{ 
    resp.send(err.toString());
  }
  })
})

//========================================================================


//===============Saving profile-donor.html data in table=================================

app.post("/profile-donor.html", function (req, resp) {

  console.log("FILES =====>", req.files);
  console.log("BODY =====>", req.body);

  let idProofPic = "nopic.jpg";

  // 🔹 SAME FIELD NAME AS FORM: name="ppic"
  if (req.files && req.files.ppic) {
    idProofPic = req.files.ppic.name;
    let path = process.cwd() + "/public/uploads/" + idProofPic;
    req.files.ppic.mv(path);
  }

  let email   = req.body.txtEmail;
  let name    = req.body.txtName;
  let mobile  = req.body.txtmob;
  let state   = req.body.txtstate;
  let city    = req.body.txtcity;
  let address = req.body.txtadd;
  let idproof = req.body.txtid;
  let frm     = req.body.txtfrm;
  let too     = req.body.txtto;

  let sql = `
    INSERT INTO donors
    (email, name, mobile, userstate, city, address, idproof, id_proof_pic, frm, too)
    VALUES (?,?,?,?,?,?,?,?,?,?)
  `;

  dbCon.query(
    sql,
    [email, name, mobile, state, city, address, idproof, idProofPic, frm, too],
    function (err) {
      if (err) {
        console.log("DB ERROR =>", err);
        resp.status(500).send(err.sqlMessage);
      } else {
        resp.send("Record Saved Successfully ✅");
      }
    }
  );
});



//=======================================update profile-donor============================

app.post("/update",function(req,resp){
  var fileName="nopic.jpg";
  if(req.files!=null)
    {
      //console.log(process.cwd());
       fileName=req.files.pic.name;
      var path=process.cwd()+"/public/uploads/"+fileName;
      req.files.pic.mv(path);
    }
  var email=req.body.txtEmail;
  var name=req.body.txtName;
  var mobile=req.body.txtmob;
  var userstate=req.body.txtstate;
  var city=req.body.txtcity;
  var address=req.body.txtadd;
  var id=req.body.txtid;
  var frm=req.body.txtfrm;
  var too=req.body.txtto;
  
  
 
  
  dbCon.query("update donors set name=?,mobile=?,userstate=?,city=?,,address=?,idproof=?,pic=?,frm=?,too=? where email=?",[name,mobile,userstate,city,address,id,fileName,frm,too,email],function(err){
      if(err==null){
          resp.send("Updated successfully");
        }
        else{
          resp.send(err); 
        }
  })


})
//===================saving availmedicine.html====================================

app.get("/avail", function (req, resp) {
  

  var email = req.query.kuchemail;
  var medicinename = req.query. kuchmed;
  var expirydate= req.query.kuchexp;
  var packingtype = req.query.kuchpacktype;
  var quantity = req.query.kuchq;

  dbCon.query("insert into availmedicine(email,medicinename,expirydate,packingtype,quantity) values(?,?,?,?,?)", [email,medicinename,expirydate,packingtype,quantity], function (err) {
    if (err == null){
      resp.send("Record Saved");
      
      
    }
    else
      resp.send(err);

  });


});

//================================================================================


//===============Saving profile-needy.html data in table=================================

app.post("/profile-needy.html",function(req,resp)
{
  //---------------File Uploading================
  var pic="nopic.jpg";
  if(req.files!=null)
   {
     //console.log(process.cwd());
    pic=req.files.ppic.name;
     var path=process.cwd()+"/public/uploads/"+pic;
     req.files.ppic.mv(path);
   }
    console.log(req.body);
    //resp.send("   File name="+fileName);

    //saving data in table
    var email=req.body.txtEmail;
    var name=req.body.txtName;
    var mobile=req.body.txtmob;
    var dob=req.body.txtdate;
    var gender=req.body.txtgen;
    var city=req.body.txtcity;
    var address=req.body.txtadd;
    
    

         //fixed                             //same seq. as in table
    dbCon.query("insert into needyprofile(email,name,mobile,dob,gender,city,address,pic) values(?,?,?,?,?,?,?,?)",[email,name,mobile,dob,gender,city,address,pic],function(err)
    {
          if(err==null)
            resp.send("Record Saved");
            
          else
            resp.send(err);
    })
});

//=============================================================================================================


//=======================saving modal jisme setting donor.html ka data jayega================

app.get("/setting", function (req, resp) {

  var email   = req.query.kuchemail;
  var oldpass = req.query.kucholdpass;
  var newpass = req.query.kuchnewpass;

  console.log(req.query);

  dbCon.query(
    "UPDATE signup SET pass=? WHERE email=? AND pass=?",
    [newpass, email, oldpass],
    function (err, result) {

      if (err) {
        resp.send(err.toString());
      }
      else if (result.affectedRows === 0) {
        resp.send("Old password incorrect ❌");
      }
      else {
        resp.send("Password updated successfully ✅");
      }
    }
  );
});


//===================needy profile mai fetch button working=======================================
app.get("/get-json-record",function(req,resp)
{
         //fixed                             //same seq. as in table
    dbCon.query("select * from needyprofile where email=?",[req.query.kuchEmail],function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})

app.get("/chkemail",function(req,resp){
  var email=req.query.kuchEmail;
  dbCon.query("select * from needyprofile where email=?",[email],function(err,result){
    if(err==null){
      if(result.length==1){
        resp.send("   &nbsp; &nbsp;: Email Already Exists");
      }
      else {
        resp.send("");
      }
    }
    else{
      resp.send(err);
    }
  })
})

app.get("/get-json-record",function(req,resp)
{
         //fixed                             //same seq. as in table
    dbCon.query("select * from needyprofile where email=?",[req.query.kuchEmail],function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})

//======================================Donor profile mai fetch button working================================

app.get("/getrecords",function(req,resp)
{
         //fixed                             //same seq. as in table
    dbCon.query("select * from donors where email=?",[req.query.txtEmail],function(err,resultTableJSON)
    {
      //console.log(req.query);

          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})

app.get("/checkmail",function(req,resp){
  var email=req.query.kuchEmail;
  dbCon.query("select * from donors where email=?",[email],function(err,result){
    if(err==null){
      if(result.length==1){
        resp.send("   &nbsp; &nbsp;: Email Already Exists");
      }
      else {
        resp.send("");
      }
    }
    else{
      resp.send(err);
    }
  })
})

//===========================================Donor profile mai fetch button working======================




//================================Users============================================

//==================fetch all records in users in admin dashboard========================
app.get("/get-angular-all-records",function(req,resp)
{
         //fixed                             //same seq. as in table
    dbCon.query("select * from signup",function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
          else
            resp.send(err);
    })
})


//===================delete Records ===================================================

app.get("/do-angular-delete",function(req,resp)
{
     //saving data in table
    var email=req.query.emailkuch;
    

         //fixed                             //same seq. as in table
    dbCon.query("delete from signup where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Removed Successfully");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})

//===================Block records============================================
app.get("/do-angular-block",function(req,resp)
{
     //saving data in table
    var email=req.query.emailkuch;
    

         //fixed                             //same seq. as in table
    dbCon.query("update signup set status=0 where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("User Blocked !!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})

//==========================Resume user=======================================================

app.get("/do-angular-resume",function(req,resp)
{
     //saving data in table
    var email=req.query.emailkuch;
    

         //fixed                             //same seq. as in table
    dbCon.query("update signup set status=1 where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("User Unblocked !!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})


//=================================================================================================

//===========================================Donors Records===============================================

app.get("/get-angular-donor-records",function(req,resp)
{
         //fixed                             //same seq. as in table
    dbCon.query("select * from signup where type='donor'",function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})

//===================================================================================================

//===============================================Needy Records=======================================
app.get("/get-angular-needy-records",function(req,resp)
{
         //fixed                             //same seq. as in table
    dbCon.query("select * from signup where type='needy'",function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})

//==========================================(med-manager.html)===Avail Medicine ka fetch record=========
app.get("/get-angular-dmed-records",function(req,resp)
{
      var email= req.query.kuchemail;
    dbCon.query("select * from availmedicine where email=?",[email] ,function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})

//================================================(med-manager.html)==unavail button=====================

app.get("/dodelete",function(req,resp)
{
     //saving data in table
    var srno=req.query.srkuch;
    

         //fixed                             //same seq. as in table
    dbCon.query("delete from availmedicine where srno=?",[srno],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("unavail");
            else
              resp.send("Inavlid");
            }
              else
            resp.send(err);
    })
})




//===============================================Fecth cities and medicine================================
app.get("/get-angular-city-records",function(req,resp)
{
    dbCon.query("select distinct city from donors",function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})



app.get("/get-angular-med-records",function(req,resp)
{
    dbCon.query("select distinct medicinename from availmedicine",function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})


//==========================================cards opening on show donors button click====================

app.get("/fetch-donors",function(req,resp)
{
  console.log(req.query);
  var med=req.query.medKuch;
  var city=req.query.cityKuch;

  var query="select donors.email,donors.name,donors.address,donors.city,availmedicine.medicinename from donors inner join availmedicine on donors.email= availmedicine.email where availmedicine.medicinename=? and donors.city=?";
  

  dbCon.query(query,[med,city],function(err,resultTable)
  {
    console.log(resultTable+"      "+err);
  if(err==null)
    resp.send(resultTable);
  else
    resp.send(err);
  })
})  

//==================================================



//=====================Whole AI Work===========================================
//====================AI Medicine Recommendation===============================


app.post("/ai-recommend", async (req, res) => {
  try {
    const { symptoms } = req.body;

    const response = await fetch(
      "https://helprx-ai.onrender.com/recommend",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms })
      }
    );

    const aiResult = await response.json();
    res.json(aiResult);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "AI service unavailable"
    });
  }
});



//==================ChatBot Working==============================================
const { getBotReply } = require("./public/chatbot");

app.post("/chatbot", function (req, res) {
  const msg = req.body.message;
  const reply = getBotReply(msg);
  res.send({ reply });
});



//==================chatbot needy side working=========
app.post("/chatbot-needy", function (req, resp) {

  let msg = req.body.message.toLowerCase();
  let reply = "";

  if (msg.includes("medicine")) {
    reply = "You can find medicines using the 'Find Medicine' option.";
  }
  else if (msg.includes("donate")) {
    reply = "Donors can donate medicines from their dashboard.";
  }
  else if (msg.includes("fever")) {
    reply = "For fever, Paracetamol is commonly used.";
  }
  else if (msg.includes("cold")) {
    reply = "For cold and cough, a cough syrup may help.";
  }
  else if (msg.includes("help")) {
    reply = "You can ask me about medicines, donors, or help.";
  }
  else {
    reply = "Sorry, I didn't understand. Try asking about medicine or donation.";
  }

  resp.json({ reply });
});


















