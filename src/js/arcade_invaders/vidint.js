let arcade_invaders_vidint = (function(bus, options) {
  let interuptTo = 0x08;

  bus.attachPin('vidint', {
    onFalling: function() {
      bus.writeBlock('int_addr', interuptTo);
      bus.pulseLow('int');

      // Could also have written an instruction
      // CF is RST 8 and D7 is RST 10.

      if (interuptTo == 0x10) { //vblank just happened
        interuptTo = 0x08;
        bus.display.render();
      } else {
        interuptTo = 0x10;
      }
    },
  });

  return {

  }
});