const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const xlsx = require('node-xlsx').default;
const FormData = require('form-data');
const multipart = require('connect-multiparty');
var multer  = require('multer')
var multipartMiddleware = multipart();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './upload')
    },
    filename: function (req, file, cb) {
        console.log(file)
      cb(null, file.originalname+'')
    }
  })
var upload = multer({ storage:storage});


//上传excle
router.post('/uploadExcle',function(req, res, next) {
    upload.single('file')(req,res,function(err){
        if (err instanceof multer.MulterError) {
            // 发生错误
          } else if (err) {
            // 发生错误
          }else{
              let data = xlsx.parse(fs.readFileSync(path.join(__dirname,'../upload/report_01.xlsx')))
            //   console.log(data[0].data)
              
          }
    })
  });

  router.get('/downloadExcle',function(req, res, next) {
      let data = [
          ['groupIdadGroupId','keywordId','rangeEnd','rangeStart','suggested'],
          ['2wqew23232wqed1','sasas232ewe1',1,1,1],
          ['2wqew23232wqed2','sasas232ewe2',2,2,2],
          ['2wqew23232wqed3','sasas232ewe3',3,3,3],
      ]
    let buffer = xlsx.build([{
        name: "xxx.xlsx",
        data: data
    }]);
    
    fs.writeFile(path.join(__dirname,'../upload/report_01.xlsx'), buffer, function (err,a,b,c) {
        if (err) {
            throw err;
        };
        res.send(
            fs.readFileSync(path.join(__dirname,'../upload/report_01.xlsx'))
        )
    });
    
  });

module.exports = router;
