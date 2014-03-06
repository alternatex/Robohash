/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

var pageres = require('pageres');

pageres(['cnn.com'], ['240x720','480x240','860x480','1024x768', '1366x768', '1600x900'], function () {
  console.log('done');
}, function () {
  console.log('done err');
});