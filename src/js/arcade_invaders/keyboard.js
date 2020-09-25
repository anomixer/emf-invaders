let arcade_invaders_keyboard = (function(options) {
  const KEY_COIN = 0;
  const KEY_PLY1_FIRE = 1;
  const KEY_PLY1_LEFT = 2;
  const KEY_PLY1_RIGHT = 3;
  const KEY_PLY1_START = 4;
  const KEY_PLY2_FIRE = 5;
  const KEY_PLY2_LEFT = 6;
  const KEY_PLY2_RIGHT = 7;
  const KEY_PLY2_START = 8;
  const KEY_TOTAL = 16; // includes player 2's buttons
  const keyStates = [];
  const keyCodes = {
    13: KEY_PLY1_START,
    /* ENTER */
    49: KEY_PLY1_START,
    /* 1 */
    50: KEY_PLY2_START,
    /* 2 */

    67: KEY_COIN,
    /* C */

    32: KEY_PLY1_FIRE,
    /* space */
    190: KEY_PLY1_FIRE,
    /* dot */
    90: KEY_PLY1_LEFT,
    /* z */
    88: KEY_PLY1_RIGHT,
    /* x */

    76: KEY_PLY2_FIRE,
    /* l */
    65: KEY_PLY2_LEFT,
    /* a */
    83: KEY_PLY2_RIGHT,
    /* s */
  };


  (function ctor() {
    for (let row = 0; row < KEY_TOTAL; row++) {
      keyStates[row] = 0;
    }

    emf.input.onKeyDown(keyDown);
    emf.input.onKeyUp(keyUp);
  })();

  function keyDown(key) {
    const keyCode = keyCodes[key];
    if (keyCode == null) {
      return;
    }

    keyStates[keyCode] = true;
  }

  function keyUp(key) {
    const keyCode = keyCodes[key];
    if (keyCode == null) {
      return;
    }

    keyStates[keyCode] = false;
  }

  function isCoin() {
    return keyStates[KEY_COIN];
  }

  function clearCoinSlot() {
    keyStates[KEY_COIN] = false;
  }

  function isPly1Start() {
    return keyStates[KEY_PLY1_START];
  }

  function isPly1Fire() {
    return keyStates[KEY_PLY1_FIRE];
  }

  function isPly1Left() {
    return keyStates[KEY_PLY1_LEFT];
  }

  function isPly1Right() {
    return keyStates[KEY_PLY1_RIGHT];
  }
  //
  function isPly2Start() {
    return keyStates[KEY_PLY2_START];
  }

  function isPly2Fire() {
    return keyStates[KEY_PLY2_FIRE];
  }

  function isPly2Left() {
    return keyStates[KEY_PLY2_LEFT];
  }

  function isPly2Right() {
    return keyStates[KEY_PLY2_RIGHT];
  }

  return {
    isCoin,
    isPly1Start,
    isPly1Fire,
    isPly1Left,
    isPly1Right,
    //
    isPly2Start,
    isPly2Fire,
    isPly2Left,
    isPly2Right,
    //
    clearCoinSlot
  }
})();