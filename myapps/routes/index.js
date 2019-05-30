var express = require('express');
var empModel = require('../modules/employee');
var router = express.Router();
var employee =empModel.find({});

/* GET home page. */
router.get('/', function(req, res, next) {
  employee.exec(function(err,data){
if(err) throw err;
res.render('index', { title: 'Employee Records', records:data, success:'' });
  });
  
});

router.post('/', function(req, res, next) {
  var empDetails = new empModel({
    name: req.body.uname,
    email: req.body.email,
    etype: req.body.emptype,
    hourlyrate: req.body.hrlyrate,
    totalHour: req.body.ttlhr,
    total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),
  });

  empDetails.save(function(err,req1){
    if(err) throw err;
    employee.exec(function(err,data){
      if(err) throw err;
      res.render('index', { title: 'Employee Records', records:data, success:'Record Inserted Successfully' });
        });
  })
  
  
});

router.post('/search/', function(req, res, next) {

  var flrtName = req.body.fltrname;
  var flrtEmail = req.body.fltremail;
  var fltremptype = req.body.fltremptype;
  
  if(flrtName !='' && flrtEmail !='' && fltremptype !='' ){

   var flterParameter={ $and:[{ name:flrtName},
  {$and:[{email:flrtEmail},{etype:fltremptype}]}
  ]
   }
  }else if(flrtName !='' && flrtEmail =='' && fltremptype !=''){
    var flterParameter={ $and:[{ name:flrtName},{etype:fltremptype}]
       }
  }else if(flrtName =='' && flrtEmail !='' && fltremptype !=''){

    var flterParameter={ $and:[{ email:flrtEmail},{etype:fltremptype}]
       }
  }else if(flrtName =='' && flrtEmail =='' && fltremptype !=''){

    var flterParameter={etype:fltremptype
       }
  }else{
    var flterParameter={}
  }
  var employeeFilter =empModel.find(flterParameter);
  employeeFilter.exec(function(err,data){
      if(err) throw err;
      res.render('index', { title: 'Employee Records', records:data });
        });
  
  
});

router.get('/delete/:id', function(req, res, next) {
var id=req.params.id;
var del= empModel.findByIdAndDelete(id);

del.exec(function(err){
if(err) throw err;
employee.exec(function(err,data){
  if(err) throw err;
  res.render('index', { title: 'Employee Records', records:data, success:'Record Deleted Successfully' });
    });
  });
  
});

router.get('/edit/:id', function(req, res, next) {
  var id=req.params.id;
var edit= empModel.findById(id);
edit.exec(function(err,data){
if(err) throw err;
res.render('edit', { title: 'Edit Employee Record', records:data });
  });
  
});

router.post('/update/', function(req, res, next) {
 
var update= empModel.findByIdAndUpdate(req.body.id,{
  name: req.body.uname,
    email: req.body.email,
    etype: req.body.emptype,
    hourlyrate: req.body.hrlyrate,
    totalHour: req.body.ttlhr,
    total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),
});
update.exec(function(err,data){
if(err) throw err;
employee.exec(function(err,data){
  if(err) throw err;
  res.render('index', { title: 'Employee Records', records:data, success:'Record Updated Successfully' });
    });
  });
  
});

module.exports = router;
