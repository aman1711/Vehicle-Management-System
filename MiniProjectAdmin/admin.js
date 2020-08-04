const express=require('express');
const mysql=require('mysql');
const bodyParser=require('body-parser');
const app=express();

app.use(express.static(__dirname + '/views'))
app.set("view engine", "ejs");
var urlencoded= bodyParser.urlencoded({ extended : true});
const db=mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '987654321',
    database : 'miniproject'
});

var logged=false;


db.connect((err)=>{
if(err){throw err;} 
console.log("Database  Connected.....");
});

app.use(function(req, res, next) {
    console.log(typeof req.next);

    next();
});
var current_user;
//creating database;
app.get('/lo',(req,res)=>{
    let sql='CREATE DATABASE DEMO';
    db.query(sql,(err,result)=>
    {
        if(err) throw err;
        else 
        {
            console.log(result);
            res.send("DataBase Created");
        }
    })

});

//Landing 

app.get('/',(req,res)=>{
    logged=false;
    console.log("insid landing");
    res.render('landing',{message:""});
});



app.get('/employees',(req,res)=>{

    if(!logged){
        res.redirect('/');
    }

    let sql='select * from Employee';

    db.query(sql,(err,results)=>{
        
        if(err){
            res.send('Some Error Occured');
            throw err;
        }

        else{
            res.render('index_empl',{employees:results});
        }

    });

});


app.get('/employees/new',(req,res)=>{
    res.render('Employee');

});

app.get('/employees/:empID',(req,res)=>{

    var emp= req.params.empID;
    console.log("in in");
    console.log(req.params);
    var employee,vehicles;
    var post =[emp];
    let sql =' select * from Employee where emp_id = ?';
    
    db.query(sql,post,(err,results)=>{
        if(err){
            res.send('Some error Occurred');
            throw err;
        }
        else{
            console.log('I am here');
            console.log(results);
            employee=results[0];
            let sql2=null;
            if(employee.post_id=="sup")
            {
                console.log("inside sup");
                sql2="SELECT *FROM Vehicles WHERE Vehicles.sup_id=?";
            }
            else if(employee.post_id=="dri")
            {console.log("inside dri");
            sql2="SELECT *FROM Vehicles WHERE Vehicles.driver_id=?";
                //sql2="SELECT Vehicles.vehicle_id,Vehicles.vehicle_no,Vehicles.v_code,Vehicles.max_seats FROM Vehicles INNER JOIN Employee ON Vehicles.driver_id=Employee.emp_id  WHERE Employee.emp_id=?";
            }
            else if(employee.post_id=="maint")
            {
               console.log("inside maint");
              sql2="SELECT Vehicles.vehicle_id,Vehicles.vehicle_no,Vehicles.v_code,Vehicles.max_seats FROM Vehicles INNER JOIN Vehicle_Maintenance ON Vehicles.vehicle_id=Vehicle_Maintenance.vehicle_id where Vehicle_Maintenance.maintainer_id = ?";
            }
        
            db.query(sql2,post,(err,results)=>{
        
                if(err){
                    res.send('Some Error Occured');
                    throw err;
                }
        
                else{
                        vehicles= results;
                        console.log(results);
                        res.render('show_empl',{emp:employee,vehicles:vehicles});
        
                }
        
            });
        }
    });



});



app.get('/vehicles',(req,res)=>{

    if(!logged){
        res.redirect('/');
    }

    let sql='select * from Vehicles';

    db.query(sql,(err,results)=>{
        
        if(err){
            res.send('Some Error Occured');
            throw err;
        }

        else{
            res.render('index',{vehicles:results});
        }

    });

});

app.get('/vehicles/new',(req,res)=>{

    res.render('NewVehicle');

});


// app.get('/vehicles',(req,res)=>{

//     if(!logged){
//         res.redirect('/');
//     }

//     let sql='select * from Vehicles';

//     db.query(sql,(err,results)=>{
        
//         if(err){
//             res.send('Some Error Occured');
//             throw err;
//         }

//         else{
//             res.render('index',{vehicles:results});
//         }

//     });

// });



app.get('/vehicles/:vehID',(req,res)=>{

    var veh= req.params.vehID;
    var vehicle,supervisor,driver,maintainers;
    var post =[veh];
    let sql =' select * from Vehicles where vehicle_id = ?';
    
    db.query(sql,post,(err,results)=>{
        if(err){
            res.send('Some error Occurred');
            throw err;
        }
        else{
            console.log('I am here');
            console.log(results);
            vehicle=results[0];
            res.render('show',{veh:vehicle});
        }
    });


});

app.get('/buses/:busId/new',(req,res)=>{
    var bus= req.params.busId;

    res.render('NewRouteToBus',{bus:bus,message:""});

});

app.get('/newVehicle',(req,res)=>{

    res.render('newBus');
});


app.get('/routes/new',(req,res)=>{

    let sql='select * from City;'

    db.query(sql,(err,results)=>{

        if(err){
            console.log('Some Error Occured!!');
        }
        else{
            res.render('NewRoute',{cities:results,message:''});
        }

    })

})






// Post Routes

app.post('/login',urlencoded,(req,res)=>{

    let sql ="select * from adminpass";

    db.query(sql,(err,results)=>{

        if(err){
            res.send("Some Error Occured");
            throw err;
        }
        else{
            console.log(results[0].pass);
            console.log(req.body.password);
            if(results[0].pass == req.body.password){
                logged=true;
                res.redirect('/vehicles');
            }
            else{
                res.render('landing',{message:'wrong password'});
            }
        }

    });

    

});

app.post('/newVehicle',urlencoded,(req,res)=>{

    req.body.day = req.body.day.map(item => (Array.isArray(item) && item[1]) || null);

    console.log(req.body.day);
});

app.post('/employees/new',urlencoded,(req,res)=>{

    console.log(req.body);
    var post=req.body;
    let sql='insert into Employee set ?';

    db.query(sql,post,(err,results)=>{

        if(err){
            res.send('Some Error Occured');
            throw err;
        }
        else{
            res.redirect('/employees');
        }

    });


});


app.post('/vehicles/new',urlencoded,(req,res)=>{

    console.log(req.body);
    var post={
        vehicle_id:req.body.vehicle_id,
        vehicle_no: req.body.vehicle_no,
        v_code: req.body.v_code,
        about: req.body.about,
        max_seats:req.body.max_seats,
        sup_id:null,
        driver_id:null,
        garage_no:null

    };
    let sql='insert into Vehicles set ?';

    db.query(sql,post,(err,results)=>{

        if(err){
            res.send('Some Error Occured');
            throw err;
        }
        else{
            res.redirect('/vehicles');
        }

    });


});


app.post("/buses/:busId/new",urlencoded,(req,res)=>{

    console.log("req.body");
    var bus= req.params.busId;
    var post=[req.body.route_id];
    var message="";


    let sql='select * from V_Routes where route_id = ?';
    db.query(sql,post,(err,results)=>{
        if(err){
            res.send('Some Error Occured');
            console.log(err);
        }
        else{
            if(results.length==0){
                message="Enter A Valid RouteId";
                res.render('NewRouteToBus',{bus:bus,message:message});
            }
            else{

                var like = req.body.day.map(item => (Array.isArray(item) && item[0]) || '_');
                var like2 = req.body.day.map(item => (Array.isArray(item) && item[1]) || '0');
                var str =like.join("");
                var str2 =like2.join("");
                console.log(like);
                var post2= [bus,str];
                let sql3='select * from join_route where vehicle_id = ? and booleanstring like ?';

                db.query(sql3,post2,(err,results2)=>{

                    if(err){
                        res.send('Some Error Occured');
                        console.log(err);
                    }
                    else{
                        var post3=[bus];
                        let sql4='select * from join_route where vehicle_id = ? ';

                        db.query(sql4,post3,(err,results3)=>{

                            if(err){
                                res.send('Some Error Occured');
                                console.log(err);                                
                            }
                            else{
                                if(results2.length==results3.length){
                                    
                                    post4={
                                        time_arrival: req.body.time_arrival,
                                        time_departure:req.body.time_departure,
                                        route_id: req.body.route_id,
                                        fare:req.body.fare,
                                        vehicle_id:bus,
                                        booleanstring:str2
                                    }

                                    let sql5= 'insert into join_route set ?';

                                    db.query(sql5,post4,(err,results6)=>{

                                        if(err){
                                            res.send('Some Error Occurred');
                                            console.log(err);
                                        }
                                        else{
                                            message='Inserted Successfully';
                                            res.render('NewRouteToBus',{bus:bus,message:message});
                                        }
                                    })

                                }
                                else{
                                    message='Bus already busy on these days';
                                    res.render('NewRouteToBus',{bus:bus,message:message});
                                }
                            }

                        })

                    }

                })
                
            }
        }
    })


});

app.post('/routes/new',urlencoded,(req,res)=>{
    
    console.log(req.body);
    if(req.body.source==req.body.destination){

        let sql1='select * from City;'

                db.query(sql1,(err,results)=>{
            
                    if(err){
                        res.send('Some Error Occured2!!');
                        console.log(err);

                    }
                    else{
                        res.render('NewRoute',{cities:results,message:'Source and Destination should not be same'});
                    }
            
                })

    }
    else{

        post={
            route_id:req.body.route_id,
            source: req.body.source,
            destination: req.body.destination
        };
        let sql= 'insert into V_Routes set ?';

        db.query(sql,post,(err,results)=>{
            if(err){
                res.send('Some Error Occurred1');
                console.log(err);
            }
            else{

                let sql1='select * from City;'

                db.query(sql1,(err,results)=>{
            
                    if(err){
                        res.send('Some Error Occured2!!');
                        console.log(err);

                    }
                    else{
                        res.render('NewRoute',{cities:results,message:'Inserted Succesfully'});
                    }
            
                })

            }
        });

    }

});

app.post('/addVehicle/:id/:emp',urlencoded,(req,res)=>{

    var emp= req.params.emp;
    var id=Number(req.params.id);
    if(id==1){

        post=[emp,req.body.vehicle_id];
        let sql='update Vehicles set sup_id= ? where vehicle_id = ?';
        db.query(sql,post,(err,results)=>{
            if(err){
                res.send('Some Error Occurred');
                console.log(err);
            }
            else{
                res.redirect('/employees/'+emp);
            }
        });

    }
    if(id==2){

        post=[emp];
        let sql='update Vehicles set driver_id = null where driver_id = ?';
        db.query(sql,post,(err,results)=>{
            if(err){
                res.send('Some Error Occurred');
                console.log(err);
            }
            else{
                
                post1=[emp,req.body.vehicle_id];
                let sql='update Vehicles set driver_id= ? where vehicle_id = ?';
                db.query(sql,post1,(err,results)=>{
                    if(err){
                        res.send('Wrong Vehicle Id');
                        console.log(err);
                    }
                    else{
                        res.redirect('/employees/'+emp);
                    }
                });

            }
        });


    }
    if(id==3){

        post={
            maintainer_id:emp,
            vehicle_id: req.body.vehicle_id
        }

        let sql='insert into Vehicle_Maintenance set ?';
        db.query(sql,post,(err,results)=>{
            if(err){
                res.send('Wrong Vehicle id');
                console.log(err);
            }
            else{
                res.redirect('/employees/'+emp);
            }
        });


    }    
})



app.listen('3062',() =>{console.log("Server is on 3062")});