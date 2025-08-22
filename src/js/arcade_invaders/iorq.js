let arcade_invaders_iorq = (function(bus, options) {
  let port2shift;
  let port4lo;
  let port4hi;
  let port3sound1;
  let port5sound2;
  let audioHandler;
  let sampleList = [];
  // Understanding from:
  // http://www.computerarcheology.com/Arcade/SpaceInvaders/Hardware.html
  // https://bluishcoder.co.nz/js8080/
  (function ctor() {
    audioHandler = new emf.audio(bus);

    // 確保 Audio Context 已啟動
    setTimeout(() => {
      try {
        let AudioContext = window.AudioContext || window.webkitAudioContext;
        if (audioHandler.audioContext && audioHandler.audioContext.state === 'suspended') {
          audioHandler.audioContext.resume();
        }
      } catch (e) {
        console.log('Audio Context 啟動失敗:', e);
      }
    }, 1000);

    // Samples taken from here:
    //   https://www.classicgaming.cc/classics/space-invaders/sounds
    for (let i = 0; i < 11; ++i) {
      try {
        let fn = `res/sfx/sx${i}.mp3`;
        sampleList[i] = audioHandler.sampleLoad(fn);
        console.log('載入音效:', fn, sampleList[i]);
      } catch (e) {
        console.log('無法載入音效檔案:', fn, e);
        // NOP - ignore this one, and move on
      }
    }
    //
    reset();
  })();

  function reset() {
    audioHandler.reset();
    //
    port3sound1 = 0;
    port5sound2 = 0;
  }

  function readPort(addr) {
    addr = addr.getUnsigned ? addr.getUnsigned() : addr;
    // My understanding, from the original manual, is that only the port
    // is pushed onto the address bus, in A0-A7. However, the Z80 (which is
    // supposedly compatible) also pushes the A register into A8-A15.
    // Given that the two situations are mutually exclusive, we mask off
    // A0-A7 here, knowing that the Invaders hardware only considered these
    // bits. 
    addr &= 0xff;

    let state = 0;

    switch (addr) {
      case 1:
        state |= arcade_invaders_keyboard.isCoin() ? 0x01 : 0;
        state |= arcade_invaders_keyboard.isPly2Start() ? 0x02 : 0;
        state |= arcade_invaders_keyboard.isPly1Start() ? 0x04 : 0;
        state |= arcade_invaders_keyboard.isPly1Fire() ? 0x10 : 0;
        state |= arcade_invaders_keyboard.isPly1Left() ? 0x20 : 0;
        state |= arcade_invaders_keyboard.isPly1Right() ? 0x40 : 0;
        //
        if (arcade_invaders_keyboard.isCoin()) {
          arcade_invaders_keyboard.clearCoinSlot();
        }
        break

      case 2:
        // Port 2 maps player 2 controls and dip switches
        // Bit 0,1 = number of ships
        // Bit 2 = Tilt
        // Bit 3  = mode (1=easy with extra ship at 1000, 0=hard, ship at 1500)
        state |= arcade_invaders_keyboard.isPly2Fire() ? 0x10 : 0;
        state |= arcade_invaders_keyboard.isPly2Left() ? 0x20 : 0;
        state |= arcade_invaders_keyboard.isPly2Right() ? 0x40 : 0;
        // Bit 7   = show or hide coin info
        break;

      case 3:
        return ((((port4hi << 8) | (port4lo)) << port2shift) >> 8) & 0xFF;

    }
    return state;
  }

  function writePort(addr, val) {
    addr = addr.getUnsigned ? addr.getUnsigned() : addr;
    val = val.getUnsigned ? val.getUnsigned() : val;

    switch (addr) {
      case 2:
        port2shift = val;
        break;

      case 3:
        // the out value is a bitmap of which sounds to play
        // but we need to check that it was previously cleared before
        // playing the sound, as otherwise it will restart to play
        // every frame

        // Bit 1 = spaceship sound (looped)
        // Bit 2 = Shot
        // Bit 3 = Your ship hit
        // Bit 4 = Invader hit
        // Bit 5 = Extended play sound
        for (let i = 0; i < 5; ++i) {
          let b = 1 << i;
          if ((val & b) && !(port3sound1 & b)) {
            audioHandler.samplePlay(sampleList[i]);
          }
        }
        port3sound1 = val;
        break;

      case 4: // special bitshifting hardware
        port4lo = port4hi;
        port4hi = val;
        break;

      case 5:
        // Bit 0 = invaders sound 1
        // Bit 1 = invaders sound 2
        // Bit 2 = invaders sound 3
        // Bit 3 = invaders sound 4
        // Bit 4 = spaceship hit
        // Bit 5 = amplifier enabled/disabled
        for (let i = 0; i < 5; ++i) {
          let b = 1 << i;
          if ((val & b) && !(port5sound2 & b)) {
            audioHandler.samplePlay(sampleList[i + 5]);
          }
        }
        port5sound2 = val;
        break;
    }
  }

  function setState(newState) {
    port2shift = newState.port2shift;
    port4lo = newState.port4lo;
    port4hi = newState.port4hi;
    port3sound1 = newState.port3sound1;
    port5sound2 = newState.port5sound2;
  }

  function getState() {
    return {
      port2shift: port2shift,
      port4lo: port4lo,
      port4hi: port4hi,
      port3sound1: port3sound1,
      port5sound2: port5sound2,
    };
  }

  return {
    reset,
    readPort,
    writePort,
    setState,
    getState,
  }
});