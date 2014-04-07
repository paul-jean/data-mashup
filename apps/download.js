var https = require('https');
// https://www.rescuetime.com/anapi/manage
var key = 'B63SNgMEIKmZXl3dhYh9FXYw6kcaCyztonT9HlUa';
var url = 'https://www.rescuetime.com/anapi/data?key=' + key + '&format=csv&pv=interval&rs=hour&rb=2014-03-01';

https.get(url, function (res) {
  // console.log('status code \n', res.statusCode);
  // console.log('headers:\n', res.headers);
  res.on('data', function (d) {
    process.stdout.write(d);
  });
}).on('error', function (e) {
  console.error(e);
});

