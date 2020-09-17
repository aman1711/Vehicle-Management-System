create table U_Table(user_name varchar(80),city varchar(80),password varchar(80),name varchar(100),dob varchar(80),primary key(user_name));


create table V_Routes(route_id varchar(80),source varchar(80),destination varchar(80),sub_station_A varchar(100),sub_station_B varchar(100),sub_station_C varchar(100),primary key(route_id));


create table Vehicles(vehicle_id varchar(80),v_code varchar(80),about varchar(200),max_seats int,primary key(vehicle_id));

create table join_route(time_arrival varchar(60),time_departure varchar(60),route_id varchar(80),vehicle_id varchar(80),foreign key (route_id) references Routes(route_id),foreign key (vehicle_id) references Vehicles(vehicle_id));
create table Tiket(tiket_no int ,user_name varchar(80),B_date date,B_day varchar(80),B_time varchar(60),J_date date,J_day varchar(80),J_time varchar(60),
seats int ,route_id varchar(80),vehicle_id varchar(80) ,foreign key(user_name) references U_Table(user_name),foreign key(route_id) references V_Routes(route_id),
foreign key(vehicle_id) references Vehicles(vehicle_id),primary key(tiket_no));

create table Payment(trans_id varchar(80),amount int,about varchar(100),tiket_no int,foreign key(tiket_no) references Tiket(tiket_no));

create table employee_characters(em_code varchar(80),post varchar(100),working_hour int,primary key(em_code));

create table employees(emp_id varchar(80),em_code varchar(80),salary int ,name varchar(100),about varchar(100),foreign key(em_code) references employee_character(em_code),primary key(emp_id));

