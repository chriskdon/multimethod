var multimethod = require('../src/multimethod');

var method = multimethod(
  [String, function(str) {
    console.log("Basic String: %s", str);
  }],
  [String, Number, function(str, num) {
    console.log("Str + Num: %s %s", str, num);
  }],
  [String, String, function() {
    console.log("Str + Str");
  }],
  function() {
    console.log("Default");
  }
);

method("Just String");
method("String", 10);
method("String", "String");
method(10, 10);
