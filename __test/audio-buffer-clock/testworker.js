class EventLoop extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = Math.random() * 2 - 1;
      }
    });
    return true;
  }
}

registerProcessor('EventLoop', EventLoop);

class Click extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        if (i < 100) {
          channel[i] = Math.random() * 2 - 1
        } else {
          channel[i] = 0;
        }
      }
    });
    return true;
  }
}

registerProcessor('Click', Click);

