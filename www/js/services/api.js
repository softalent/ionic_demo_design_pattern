angular.module('coordinate')

//
// Base URL for coordinate (set to empty string to use local proxies.)
// Commit with: http://coordinate.ticonerd.com
//
.constant('COORD_API_URL', 'http://coordinate.ticonerd.com')
.constant('COORD_IMG_URL', 'http://coordinate-email.ticonerd.com')

//
// Function to generate a coordinate api url
// @return String
//
.service('$coordinateUrl', function (COORD_API_URL) {
  return function () {
    return COORD_API_URL + '/' + Array.prototype.slice.call(arguments)
      .join('/')
      .replace(/\/+/g, '\/')
      .replace(/^\//, '');
  };
})

//
// Function to generate a coordinate image url (for task images)
// @return String
//
.service('$coordinateImageUrl', function (COORD_IMG_URL) {
  return function () {
    return COORD_IMG_URL + '/' + Array.prototype.slice.call(arguments)
      .join('/')
      .replace(/\/+/g, '\/')
      .replace(/^\//, '');
  };
});