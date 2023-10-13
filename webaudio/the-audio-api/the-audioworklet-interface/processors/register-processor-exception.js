// TypeError: not a function!
const DummyObject = {};

// TypeError: not a constructor!
const DummyFunction = () => {};

try {
  registerProcessor('type-error-on-object', DummyObject);
} catch (exception) {

}

try {
  registerProcessor('type-error-on-function', DummyFunction);
} catch (exception) {

}
