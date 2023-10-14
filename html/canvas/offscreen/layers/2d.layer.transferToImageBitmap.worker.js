// DO NOT EDIT! This test has been generated by /html/canvas/tools/gentest.py.
// OffscreenCanvas test in a worker:2d.layer.transferToImageBitmap
// Description:Check that calling transferToImageBitmap in a layer throws an exception.
// Note:

importScripts("/resources/testharness.js");
importScripts("/html/canvas/resources/canvas-tests.js");

var t = async_test("Check that calling transferToImageBitmap in a layer throws an exception.");
var t_pass = t.done.bind(t);
var t_fail = t.step_func(function(reason) {
    throw reason;
});
t.step(function() {

  var canvas = new OffscreenCanvas(100, 50);
  var ctx = canvas.getContext('2d');

  ctx.beginLayer();
  assert_throws_dom("InvalidStateError",
                    () => canvas.transferToImageBitmap());
  t.done();
});
done();
