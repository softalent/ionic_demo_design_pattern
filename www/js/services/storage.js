angular.module('coordinate')
//
// Wrapper/encoder for localStorage
//
.service('$storage', function () {
  return {
    get: function (key) {
      return JSON.parse(localStorage.getItem(key));
    },
    set: function (key, value) {
      return localStorage.setItem(key, JSON.stringify(value));
    },
    unset: function (key) {
      return localStorage.removeItem(key);
    }
  };
});