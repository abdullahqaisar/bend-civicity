var axios = require('axios');
var FormData = require('form-data');
var data = new FormData();
data.append('mobile', '97150900XXXX');
data.append('sender_id', 'SMSINFO');
data.append('message', 'Your otp code is {code}');
data.append('expiry', '900');

var config = {
  method: 'post',
  url: 'https://d7networks.com/api/verifier/send',
  headers: { 
    'Authorization': 'Token {D7 verify token}', 
    ...data.getHeaders()
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});