'use strict';

// README
promise_test(async () => {
  const context = new AudioContext();
  await context.audioWorklet.addModule(
      './processors/register-processor-exception.js');

  // DO something

  return new Promise(resolve => {
    resolve();
  }).then(event => {
  });
}, 'aaa');
