create database project;
use project;
create table U_Table(user_name varchar(80),city varchar(80),password varchar(80),name varchar(100),dob varchar(80),email varchar(80),mob varchar(12),primary key(user_name));
insert into U_Table values('user1','Allahabad','password@1','Ravi Verma','10-10-1998','rverma767887@gmail.com','7678873249');
insert into U_Table values('user2','Allahabad','password@1','Rudra Verma','10-10-1997','rverma767887@gmail.com','7678873249');

create table V_Routes(route_id varchar(80),source varchar(80),destination varchar(80),primary key(route_id));
insert into V_Routes values('r110','Allahabd','Lucknow');
insert into V_Routes values('r111','Allahabd','Kanpur');
insert into V_Routes values('r112','Kolkata','Pune');
insert into V_Routes values('r113','Lucknow','Varanasi');
insert into V_Routes values('r114','Patna','Pune');
insert into V_Routes values('r115','Bhopal','Lucknow');

create table Employee(emp_id varchar(80),emp_name varchar (80),age int,address varchar(80),post_id varchar(80),CONSTRAINT chk_post_id CHECK (post_id IN ('sup', 'dri', 'maint')),primary key(emp_id));
insert into Employee values('1234','salil',20,'Allahabad','dri');
insert into Employee values('1235','ravi',20,'Allahabad','maint');
insert into Employee values('1236','gaurav',20,'Allahabad','sup');
insert into Employee values('1000','AMIT kUMAR gAUtAM',20,'Allahabad','dri');
insert into Employee values('1001','Hariom',20,'Allahabad','dri');
insert into Employee values('1200','Vinay',20,'Allahabad','dri');

create table Garage(garage_no varchar(80),city varchar(80),address varchar(80),primary key(garage_no));
insert into Garage values('555','Allahabad','Jhalwa');
insert into Garage values('556','Allahabad','CL');


create table Vehicles(vehicle_id varchar(80),vehicle_no varchar(80) UNIQUE,v_code varchar(80),about varchar(200),max_seats int,sup_id varchar(80) UNIQUE,driver_id varchar(80) UNIQUE,garage_no varchar(80),foreign key (sup_id) references Employee(emp_id),foreign key(driver_id) references Employee(emp_id),
foreign key (garage_no) references Garage(garage_no),primary key(vehicle_id));
insert into Vehicles values('vehicle2334','JH09C6132','All-Luck_route','Absdefgf',60,'1234','1000','555');
insert into Vehicles values('vehicle2358','UP70B1337','All-Kanpur_route','Absdefg',60,'1235','1001','556');

create table Vehicle_Maintenance(maintainer_id varchar(80),vehicle_id varchar(80),foreign key(maintainer_id) references Employee(emp_id),foreign key(vehicle_id) references Vehicles(vehicle_id));
insert into Vehicle_Maintenance values('1235','vehicle2334'); 
insert into Vehicle_Maintenance values('1235','vehicle2358'); 

create table Post(post_id varchar(80),CONSTRAINT chk_post_id CHECK (post_id IN ('sup', 'dri', 'maint')),post_desc varchar(80),salary int,primary key(post_id));
insert into Post values('dri','driver',8000);
insert into Post values('maint','maintainer',15000);
insert into Post values('sup','supervisor',30000);

create table join_route(time_arrival varchar(60),time_departure varchar(60),route_id varchar(80),max_seats int,seats_available int,fare float,booleanstring varchar(7),vehicle_id varchar(80),foreign key (route_id) references V_Routes(route_id),foreign key (vehicle_id) references Vehicles(vehicle_id));
insert into join_route values('09:30 pm','12:30 pm','r110',50,37,330.0,'0010101','vehicle2334');
insert into join_route values('12:30 pm','8:30 pm','r110',60,40,220,'1011001','vehicle2358');
insert into join_route values('12:30 pm','8:30 pm','r111',50,20,300,'1011001','vehicle2358');

create table Tiket(tiket_no int auto_increment ,user_name varchar(80),B_date varchar(80),B_day varchar(80),J_date varchar(70),J_day varchar(80),seats int ,route_id varchar(80),vehicle_id varchar(80),payment_mode varchar(80),payment_id varchar(80),foreign key(user_name) references U_Table(user_name),foreign key(route_id) references V_Routes(route_id),
foreign key(vehicle_id) references Vehicles(vehicle_id),primary key(tiket_no));

insert into Tiket(user_name,B_date,B_day,J_date,J_day,seats,route_id,vehicle_id,payment_mode,payment_id) values('user1','19-02-2018','Tuesday','20-02-2018','Wednesday',3,'r110','vehicle2334','paytm','txn123456789');
select * from Tiket;
create table Payment(trans_id varchar(80),amount int,about varchar(100),tiket_no int,foreign key(tiket_no) references Tiket(tiket_no));
insert into Payment values('trans001',700,'Allahabad-Lucknow',1);
create table Grage_Match(garage_no varchar(80),vehicle_id varchar(80),entry_date varchar(80),exit_date varchar(80),PRIMARY KEY(garage_no,vehicle_id,entry_date));

create table City(city_name varchar(89));
insert into City values('Prayagraj');
insert into City values('Allahabad');
insert into City values('Varanasi');
insert into City values('Agra');
insert into City values('Delhi');
insert into City values('Jaipur');
insert into City values('Bhopal');
insert into City values('Dehradun');
insert into City values('Kolkata');
insert into City values('Pune');
insert into City values('Patna');
insert into City values('Ranchi');
insert into City values('Bokaro');
insert into City values('Gangtok');
insert into City values('Lucknow');
insert into City values('Banglore');
insert into City values('Chennai');
insert into City values('Hyderabad');
insert into City values('Amritsar');
insert into City values('Nagpur');
insert into City values('Ahmedabad');
insert into City values('Surat');
insert into City values('Chandigarh');
insert into City values('Jamshedpur');
insert into City values('Kanpur');
insert into City values('Srinagar');
insert into City values('Satna');
insert into City values('Raipur');
insert into City values('Darjeeling');
insert into City values('Guwahati');
insert into City values('Roorkee');
insert into City values('Kharagpur');
insert into City values('Bhubaneshwar');
insert into City values('Udaipur');
select * from Employee;
SELECT user,authentication_string,plugin,host FROM mysql.user;
