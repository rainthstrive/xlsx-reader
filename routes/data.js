var express = require('express');
var router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads/'});
const xlsx = require('xlsx');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/upload', upload.single('file'), function(req, res, next) {
  const workbook = xlsx.readFile(req.file.path);
  const sheet_name_list = workbook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  data.forEach(row => {
    row.Edad = Number(row.Edad);
  });
  data.forEach(row => {
    row.Nums = row.Nums.split(',').map(value => Number(value.trim()));
  });
  res.send(data);
})


module.exports = router;
