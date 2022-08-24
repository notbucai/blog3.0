// import { Application } from '@splinetool/runtime';
import tween from '@tweenjs/tween.js';
import { asyncLoad } from '../../utils/loadScriptComponent';

const keyCodeMap = {
  SPACE: 'space',
  TAB: 'tab',
  CAPSLOCK: 'capslock',
  METALEFT: 'command-left',
  METARIGHT: 'command-right',
  CONTROLLEFT: 'control-left',
  CONTROLRIGHT: 'control-right',
  ALTLEFT: 'option-left',
  ALTRIGHT: 'option-right',
  SHIFTLEFT: 'shift-left',
  SHIFTRIGHT: 'shift-right',
  ARROWLEFT: 'left',
  ARROWUP: 'up',
  ARROWRIGHT: 'right',
  ARROWDOWN: 'down',
  BRACKETRIGHT: ']',
  BRACKETLEFT: '[',
  SEMICOLON: ';',
  QUOTE: '\'',
  COMMA: ',',
  PERIOD: '.',
  SLASH: '/',
  BACKQUOTE: '`',
  BACKSLASH: '\\',
  BACKSPACE: 'delete',
  EQUAL: '+',
  MINUS: '-',
  ENTER: 'return',
  FN: 'fn'
};

export const run = async (canvasElement) => {
  const splinetoolRuntime = await asyncLoad.splinetoolRuntime()
  const app = new splinetoolRuntime.Application(canvasElement, {autoRender: true});

  const keyHandle = {
    animate: new Map(),
    getKeyName (key) {
      const keyUp = key.toUpperCase();
      const keyName = keyCodeMap[keyUp];
      if (keyName) return keyName;
      return keyUp.replace('KEY', '').replace('DIGIT', '');
    },
    handle (type, key) {
      const name = this.getKeyName(key);
      const obj = app.findObjectByName('key ' + name)
      if (!obj) return;
      let distance = type === 'up' ? 0 : -30;
      const keyAnimate = this.animate.get(key);
      if (keyAnimate && keyAnimate.isPlaying()) {
        if (keyAnimate.type !== type) {
          keyAnimate.stop();
        } else {
          return;
        }
      }
      const newKeyAnimate = new tween
        .Tween(obj.position)
        .to({ y: distance }, 50)
        .start();
      newKeyAnimate.type = type;
      this.animate.set(key, newKeyAnimate);
    },
    down (key) {
      this.handle('down', key);
    },
    up (key) {
      this.handle('up', key);
    }
  }

  const listenHandle = (type) => (e) => {
    let code = e.code;
    if (/F[0-9]+/i.test(code)) {
      code = 'FN'
    }
    keyHandle[type](code);
    // e.preventDefault()
  };

  app
    .load('https://image.notbucai.com/static/k.splinecode?t=22')
    .then(() => {
      document.addEventListener('keydown', listenHandle('down'));
      document.addEventListener('keyup', listenHandle('up'));
    });
  return app;
}

function animate (time) {
  requestAnimationFrame(animate)
  tween.update(time)
}
requestAnimationFrame(animate)