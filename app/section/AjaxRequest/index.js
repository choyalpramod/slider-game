var axios = require('axios');
var apiConstants = require('../constants/apiConstants');

module.exports = {
  userRequest: function(obj){
    var currentUrl = obj.url;
    obj.url = apiConstants.apiBaseUrl + currentUrl;

    return axios(obj).then(function(response){
      return response;
    }).catch(function(response){
      return response;
    });
  }
}
