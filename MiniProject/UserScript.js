const express=require('express');
const mysql=require('mysql');
const bodyParser=require('body-parser');
const app=express();


app.set("view engine", "ejs");
app.use(express.static(__dirname + '/views'));
app.set('views',__dirname+'/views');
var urlencoded= bodyParser.urlencoded({ extended : true});
const db=mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '987654321',
    database : 'miniproject'
})
db.connect((err)=>{
if(err){throw err;} 


console.log("Database  Connected.....");
});

app.use(function(req, res, next) {
    console.log(typeof req.next);

    next();
});
var current_user=null;
var resultset=null;
var BookingInformation=null;
var BookingRow=null;
var Jr_day=null;
var smmry=null;
var noofpassinger;
var city=null;
var cccc=new Date();
var mm=cccc.getMonth()+1;
var dd=cccc.getDate();
if(dd<10){dd="0"+dd;}
if(mm<10){mm="0"+mm;}
var cr_d=cccc.getFullYear()+"-"+mm+"-"+dd;
console.log(cr_d);
let sqlcity="SELECT * FROM City";
db.query(sqlcity,(err,resultcity)=>
{
    if(err) throw err;
    //console.log(resultcity);
    city=resultcity;
})
//Main Program
app.get("/",(req,res) => {
    res.render("login.ejs");
    console.log("/ called");
})
app.get("/password",(req,res) => {
    res.render("password.ejs");
    console.log("forget called");
})
app.get("/signupscript",(req,res) => {
    res.render("signup.ejs");
    console.log("sing up called");
})
app.get("/login",(req,res) => {
    res.render("login.ejs");
    console.log("login link called");
});
//Login

app.post("/profile",urlencoded,function(req,res) {
   console.log(req.body);
   var u_name=req.body.login[0];
   var pass=req.body.login[1];
   let sql="select * from U_Table";
   var match_user="NO";
   db.query(sql,(err,results)=>{
      if(err){throw err;}
      for(var i=0;i<results.length;i++)
      {
          if(results[i].user_name==u_name)
          {
              match_user="Yes";
            if(results[i].password==pass)
            {
                //res.render("profile.ejs",{file:{"name":results[i].user_name,"dob":results[i].dob}});
                 
                current_user=results[i];
                let posts=[u_name];
                let sqls="select Tiket.j_date,Tiket.route_id,Tiket.vehicle_id,Tiket.seats,Payment.amount,Payment.trans_mode,V_Routes.source,V_Routes.destination from Tiket inner join Payment on Payment.tiket_no=Tiket.tiket_no  inner join V_Routes on V_Routes.route_id=Tiket.route_id where Tiket.user_name=?";
                db.query(sqls,posts,(err,resu)=>
                {
                 if(err){res.send("Error");}
                 else{
                    smmry=resu;
                    console.log(resu);
                    res.render("profile.ejs",{file:current_user,sm:resu});
                 }
                });
              
            }
            else
            {
                console.log("Worng Password !");
                res.render("worng.ejs",{file:{xyz:"Worng Password !"}});
            }
           }
          
          /*else {
            res.render("worng.ejs",{file:{xyz:"User Name !"}});
              console.log("Worong Username !");}  */
       }
       if(match_user=="NO")
       {
        res.render("worng.ejs",{file:{xyz:"User Name !"}});
        console.log("Worong Username !");
       }
    
    });
});

//SignUp
app.post("/user",urlencoded,function(req,res){
var u_name=req.body.username;
var pass=req.body.pass;
var repeat=req.body.again;
let sql="select * from U_Table";
var passnotmatch="NO";
var usermatch="NO";
var answerstring;
db.query(sql,(err,results)=>
{
    if(err){throw err;}
    for(var i=0;i<results.length;i++)
    {
        if(results[i].user_name==u_name)
        {usermatch="Yes";
        answerstring="User Reapat";
        console.log("User Reapat");
        }  
    }
    if(pass!=repeat)
    {passnotmatch="Yes";
    answerstring="Pass mismatch";
    console.log("Pass mismatch");
    }
    if(passnotmatch=="NO" && usermatch=="NO")
{
    console.log("Inside matching");
    let post={user_name:u_name,city:req.body.city,password:pass,name:req.body.name,dob:req.body.dob};
    let sql2="INSERT INTO U_Table SET ?"
    db.query(sql2,post,(err,results)=>{
    if(err){throw err;}
    else{
        console.log("Values Inserted ");
        let post2=[u_name];
        let sql3="SELECT * FROM U_Table WHERE user_name=?";
        db.query(sql3,post2,(err,rst)=>
        {
            if(err){res.send("Error");}
            else{
                current_user=rst[0];
                let posts=[u_name];
                let sqls="select Tiket.j_date,Tiket.route_id,Tiket.vehicle_id,Tiket.seats,Payment.amount,Payment.trans_mode,V_Routes.source,V_Routes.destination from Tiket inner join Payment on Payment.tiket_no=Tiket.tiket_no  inner join V_Routes on V_Routes.route_id=Tiket.route_id where Tiket.user_name=?";
                db.query(sqls,posts,(err,resu)=>
                {
                 if(err){res.send("Error");}
                 else{
                    smmry=resu;
                    console.log(resu);
                    res.render("profile.ejs",{file:current_user,sm:resu});
                 }
                });
               
            }
        })
        
    }
    });
   
}
else{
    res.render("worng.ejs",{file:{xyz:answerstring}});
}
});

});


//backprofile
app.get("/backshow",(req,res)=>
{
console.log("backshow called");
res.render("profile.ejs",{file:current_user,sm:smmry});
});
//***************** */ Booking ..


//fecthing booking  details
app.post("/booking_data",urlencoded,function(req,res){
   console.log("inside booking fetched");
   BookingInformation=req.body;
   console.log(req.body);
     var source=req.body.q6_source;
     var destination=req.body.q32_destination;
     console.log(source);
     console.log(destination);
     var booking_date=req.body.q22_date.day;
     var booking_month=req.body.q22_date.month;
     var booking_year=req.body.q22_date.year;
     var formatstring=booking_month+'-'+booking_date+'-'+booking_year;
     var compairestring=booking_year+"-"+booking_month+"-"+booking_date;
     console.log(compairestring);
     console.log(formatstring);
     var today = new Date(formatstring); 
     var date  = today.getDate();
     var day=today.getDay();
     var nuofpass=req.body.q18_numberOf18;
     noofpassinger=req.body.q18_numberOf18;
     console.log("day value "+day);
     Jr_day=day;
     var likestring;
     switch (day)
     {
        case 0: likestring='1%';
        break;
        case 1:likestring="_1%";
        break;
        case 2: likestring="__1%";
        break;
        case 3: likestring ="___1%"; 
        break;
        case 4: likestring ="____1%"; 
        break;
        case 5 : likestring ="_____1%"; 
        break;
        case 6: likestring ="______1%"; 
        break;
     }
    console.log("Like String "+likestring);
    if(compairestring>=cr_d){
    post=[source,destination,likestring];
    let sql="SELECT V_Routes.source, V_Routes.route_id,V_Routes.destination,join_route.booleanstring,join_route.vehicle_id,join_route.fare FROM V_Routes INNER JOIN join_route ON V_Routes.route_id=join_route.route_id where V_Routes.source=? and V_Routes.destination=? and join_route.booleanstring like ?  "; 
    db.query(sql,post,(err,results)=>
        {
        if(err){res.send("Some error Ocurred");
            throw err;
        }
        console.log(results);
      resultset=results;
      res.render("show.ejs",{file:current_user,data:results,c:nuofpass,local:{s:source,d:destination,dd:formatstring}});
        
    });}
    else{
        res.render("booking.ejs",{file:current_user,c:city,massage:"Invalid Date !!"});
    }

});
//Tiketbooking
app.get("/tans/:id",(req,res)=>
{
   var row_no=req.params.id;
   BookingRow=row_no;
   res.render("trans_mode.ejs",{file:current_user,data:resultset[row_no-1],booking_data:BookingInformation});
   console.log(row_no);
   console.log(resultset[row_no-1]);
});
//payment
app.post("/payment/:id",urlencoded,(req,res)=>
{
    var paymetmode=req.params.id;
    var tansid=Math.floor((Math.random() * 10000000) + 1)
    tansid=tansid+req.body.title;
    var paymentstring
    var paymentamountss=resultset[BookingRow-1].fare*noofpassinger;
    //** */
    var current=new Date();
    var dayint=current.getDay();
    //var current_day=getdayString(dayint);
    var str=current.getDate()+'-'+current.getMonth()+'-'+current.getFullYear();
    var str1=BookingInformation.q22_date.day+'-'+BookingInformation.q22_date.month+'-'+BookingInformation.q22_date.year;
    var weekday=  ["Sunday",
    "Monday",
    "Tuesday",
     "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"];
    let post={
        user_name:current_user.user_name,
        B_date:str,
        B_day:weekday[dayint],
        J_date:str1,
        J_day:weekday[Jr_day],
        seats:noofpassinger,
        route_id:resultset[BookingRow-1].route_id,
        vehicle_id:resultset[BookingRow-1].vehicle_id
    };

    if(paymetmode==1)
    {
        tansid="VISA"+tansid;
        paymentstring="By CARD";

    }
    else if(paymetmode==2)
    {
        tansid="Paytm"+tansid;
        paymentstring=" BY PAYTM";
    }
    else if(paymetmode==3)
    {
        tansid="UPI@"+tansid;
        paymentstring="BY UPI";
    }
    let sql="SELECT COUNT('tiket_no') AS nft FROM Tiket";
    db.query(sql,(err,results)=>{
    if(err) {
        res.send("Error intikets");
            }
    else{
      var t=results[0].nft+1;
      let sql2="INSERT INTO Tiket SET ?";
      db.query(sql2,post,(err,results)=>{
        if(err) {throw err;}
        else{
        console.log("value inserted");
        let sql3="INSERT INTO Payment SET ?";
        let post2={trans_id:tansid,amount:paymentamountss,about:"XYX",trans_mode:paymentstring,tiket_no:t};
        db.query(sql3,post2,(err,resu)=>{
            if(err){res.send("Error");}
            else
            {
                res.render("tiketconfirm.ejs",{file:current_user,data:BookingInformation,d:str1});
            }
        });
        
    }
    })
    }
    });
})
//confirmBooking
app.get("/confirm",(req,res)=>{
    var current=new Date();
    var dayint=current.getDay();
    //var current_day=getdayString(dayint);
    var str=current.getDate()+'-'+current.getMonth+'-'+current.getFullYear();
    var str1=BookingInformation.q22_date.day+'-'+BookingInformation.q22_date.month+'-'+BookingInformation.q22_date.year;
    let post={
        user_name:current_user.user_name,
        B_date:str,
        B_day:"mondyay",
        J_date:str1,
        J_day:"Tuesday",
        seats:BookingInformation.q18_numberOf18,
        route_id:resultset[BookingRow-1].route_id,
        vehicle_id:resultset[BookingRow-1].vehicle_id};
     let sql2="INSERT INTO Tiket SET ?";
     db.query(sql2,post,(err,results)=>{
        if(err) throw err;
        console.log("value inserted");
        res.render("tiketconfirm.ejs",{file:current_user,data:BookingInformation,d:str1});})
 });
//booktikets
app.get("/booktikets",(req,res)=>{
    console.log("Bokking callrd");
    
    res.render("booking.ejs",{file:current_user,c:city,massage:""});
    }
    );
 //logout
app.get("/logoutpaige",(req,res)=>
{
    
    BookingInformation=null;
    Jr_day=null;
    resultset=null;
    BookingRow=null;
    noofpassinger=0;
    console.log(current_user);
    current_user=null;
    smmry=null;
    console.log("login called for logout");
    res.render("login.ejs");
});
 /********************************************************************************************************************* */
//Employee Part
var current_employee=null;
var employeeclick;
var vehicleunderemployee=null;
app.get("/employee/login",(req,res) => {
    res.render("emplogin.ejs",{file:""});
    console.log("/ for employee called");
})
app.post("/employee/loginSubmit",urlencoded,function(req,res) {
    console.log(req.body);
    var u_name=req.body.user;
    var pass=req.body.pass;
   // console.log(pass);
    let sql="select * from Employee";
    var match_user="NO";
    db.query(sql,(err,results)=>
    {
       if(err){throw err;}
       //console.log(results);
       for(var i=0;i<results.length;i++)
       {
           if(results[i].emp_id==u_name)
           {
             match_user="Yes";
             if(results[i].password==pass)
             {
                 current_employee=results[i];
                 //console.log(results[i]);
                 post=[current_employee.emp_id];
                 console.log(current_employee.emp_id);
                 let sql2=null;
                 if(current_employee.post_id=="sup")
                 {
                     console.log("inside sup");
                     sql2="SELECT *FROM Vehicles WHERE Vehicles.sup_id=?";
                 }
                 else if(current_employee.post_id=="dri")
                 {console.log("inside dri");
                 sql2="SELECT *FROM Vehicles WHERE Vehicles.driver_id=?";
                     //sql2="SELECT Vehicles.vehicle_id,Vehicles.vehicle_no,Vehicles.v_code,Vehicles.max_seats FROM Vehicles INNER JOIN Employee ON Vehicles.driver_id=Employee.emp_id  WHERE Employee.emp_id=?";
                 }
                 else if(current_employee.post_id=="maint")
                 {
                   console.log("inside maint");
                   post=[current_employee.emp_id];
                   sql2="SELECT Vehicles.vehicle_id,Vehicles.vehicle_no,Vehicles.v_code,Vehicles.max_seats FROM Vehicles INNER JOIN Vehicle_Maintenance ON Vehicles.vehicle_id=Vehicle_Maintenance.vehicle_id WHERE Vehicle_Maintenance.maintainer_id=?";
                 }
                 db.query(sql2,post,(err,results_inside)=>
                 {
                   if(err) {throw err;}
                    vehicleunderemployee=results_inside;
                    console.log(results_inside);
                    console.log(current_employee);
                   // res.render("employee_profile.ejs",{file:current_employee,vehicledata:vehicleunderemployee});
                    res.render("employee_profile.ejs",{file:current_employee,vehicledata:vehicleunderemployee});
                 });
             }
             else
             {
                 console.log("Worng Password !");
                 res.render("worng.ejs",{file:{xyz:"Worng Password !"}});
             }
            }
           
        }
        if(match_user=="NO")
        {
         res.render("worng.ejs",{file:{xyz:"User Name !"}});
         console.log("Worong Username !");
        }
     
     });

 });

//vehicleClick
app.get("/employee/vehicleclick/:id",(req,res)=>
{
employeeclick=req.params.id;
console.log(vehicleunderemployee[employeeclick-1]);
res.render("employee_vehicleinfo.ejs",{file:current_employee,selectedvehicle:vehicleunderemployee[employeeclick-1],massage:{xyz:""}});
}
);
app.post("/employee/updatevehicle/:id",urlencoded,function(req,res)
{
    var updateoption=req.params.id;
    if(updateoption==1)
    {
        console.log(req.body);
        post=[req.body.fuel,vehicleunderemployee[employeeclick-1].vehicle_id];
     let sql="UPDATE Vehicles SET fuel=? WHERE vehicle_id=?";
     db.query(sql,post,function(err,results){
         if(err) throw err;
         console.log("Inserted");
     });
    }
    else if(updateoption==2)
    {
     console.log(req.body);
     post=[req.body.service,vehicleunderemployee[employeeclick-1].vehicle_id];
     let sql="UPDATE Vehicles SET lastservice=? WHERE vehicle_id=?";
     db.query(sql,post,function(err,results){
      if(err) throw err;
      console.log("inserted");
     });
    }
    else if(updateoption==3)
    {
        console.log(req.body);
        post=[req.body.grg,vehicleunderemployee[employeeclick-1].vehicle_id];
        let sql="UPDATE Vehicles SET garage_no=? WHERE vehicle_id=?";
        db.query(sql,post,function(err,results){
         if(err) throw err;
         console.log("inserted");
        });
    }
    res.render("employee_vehicleinfo.ejs",{file:current_employee,selectedvehicle:vehicleunderemployee[employeeclick-1],massage:{ xyz:"Updated Succesfully !"}});
});
//employeeBackshow
app.get("/employee/backshow",(req,res)=>
{
    console.log("backshow called");
    res.render("employee_profile.ejs",{file:current_employee,vehicledata:vehicleunderemployee});
});
//employee logout
//employeepass
app.get("/employee/changepassword",(req,res)=>
{
   res.render("SetPassword.ejs",{file:current_employee,massage:""});
});
//changepass
app.post("/changep",urlencoded,function(req,res)
{
console.log(req.body);
var cp=req.body.current_p;
var pn=req.body.new_p;
var pnr=req.body.retype;
var str;
if(current_employee.password==cp)
{
  if(pn==pnr)
  {
      let post=[pn,current_employee.emp_id];
    let sql="UPDATE Employee SET password=? WHERE emp_id=?";
    db.query(sql,post,(err,results)=>{
       if(err) {res.send("Error occc");}
       else{
        res.render("employee_profile.ejs",{file:current_employee,vehicledata:vehicleunderemployee});
       }
      
    })
  }
  else{
    str="Password Mismatch !!!!";
    res.render("SetPassword.ejs",{file:current_employee,massage:str});
  }
}
else{
    str="Current Password Incorrect !!!!";
    res.render("SetPassword.ejs",{file:current_employee,massage:str});
}
});

app.get("/employee/lagout",(req,res)=>
{
    current_employee=null;
    employeeclick=null;
    vehicleunderemployee=null;
    console.log(current_employee);
    console.log("login called for employee");
    res.render("emplogin.ejs");
});
app.listen('3000',() =>{
    console.log("Port is on 3000")
});