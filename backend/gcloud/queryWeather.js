
const http = require('http')

const urldata = (city, date) =>
{ return {
  host: "api.weatherbit.io",
  path: "/v2.0/history/daily?city="+city+"," + state + "&start_date=" + date + "&end_date=" + date + "&key=3a53bf8eab544baa8b00169e1be1576e",
  method: "GET",
}}

module.exports = {
  fetchWeather: function (city, date) {
    let url = urldata(city, date);
    http.request(urldata, queryWeather).end();
  }
};


function queryWeather(response, city, date) {
  var data = '';

  response.on('data', function(chunk) {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  response.on('end', function() {
    // console.log(JSON.parse(data).explanation);
    var obj = JSON.parse(data)
    console.log(obj.data[0]["temp"]);
  });
}
