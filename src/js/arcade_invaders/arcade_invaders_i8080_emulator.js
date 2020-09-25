// arcade_invaders_i8080_emulator
let arcade_invaders_i8080_emulator = (function(bus, options) {
  let tmp8 = new emf.Number(8);
  let tmp16 = new emf.Number(16);

  // TODO: f = flags, and cc_ are separate but should be unified?!?!
  let f = new emf.Number(8);

  let cc_bit_0 = 0;
  let cc_bit_1 = 0;
  let cc_bit_2 = 0;
  let cc_bit_3 = 0;
  let cc_bit_4 = 0;
  let cc_bit_5 = 0;
  let cc_bit_6 = 0;
  let cc_bit_7 = 0;


  // Options: directMemory = true
  // Options: directIORQ = true
  // Options: directFetch = true
  let read1 = function(a) {
    return read8(a) & 0x01;
  }
  let read2 = function(a) {
    return read8(a) & 0x03;
  }
  let read3 = function(a) {
    return read8(a) & 0x07;
  }
  let read4 = function(a) {
    return read8(a) & 0x0f;
  }
  let read5 = function(a) {
    return read8(a) & 0x1f;
  }
  let read6 = function(a) {
    return read8(a) & 0x3f;
  }
  let read7 = function(a) {
    return read8(a) & 0x7f;
  }
  let read8;
  let read9 = function(a) {
    return read16(a) & 0x1ff;
  }
  let read10 = function(a) {
    return read16(a) & 0x3ff;
  }
  let read11 = function(a) {
    return read16(a) & 0x7ff;
  }
  let read12 = function(a) {
    return read16(a) & 0xfff;
  }
  let read13 = function(a) {
    return read16(a) & 0x1fff;
  }
  let read14 = function(a) {
    return read16(a) & 0x3fff;
  }
  let read15 = function(a) {
    return read16(a) & 0x7fff;
  }
  let read16;

  /*
   **
   ** Declarations
   **
   */
  let a = new emf.Number(8);
  let gsRegisterA = new emf.Number(8);
  let b = new emf.Number(8);
  let gsRegisterB = new emf.Number(8);
  let c = new emf.Number(8);
  let gsRegisterC = new emf.Number(8);
  let d = new emf.Number(8);
  let gsRegisterD = new emf.Number(8);
  let e = new emf.Number(8);
  let gsRegisterE = new emf.Number(8);
  let h = new emf.Number(8);
  let gsRegisterH = new emf.Number(8);
  let l = new emf.Number(8);
  let gsRegisterL = new emf.Number(8);
  let pc = new emf.Number(16);
  let gsRegisterPC = new emf.Number(16);
  let sp = new emf.Number(16);
  let gsRegisterSP = new emf.Number(16);
  let af = createRegisterPair(a, f);
  let bc = createRegisterPair(b, c);
  let de = createRegisterPair(d, e);
  let hl = createRegisterPair(h, l);

  /*
   **
   ** Internal state
   **
   */
  let isBigEndian = (false); // Treat as bool
  let inHalt = (false); // Treat as bool
  let interruptEnabled = (0); // Treat as int8
  let wasNMIGenerated = (false); // Treat as bool
  let wasIRQGenerated = (false); // Treat as bool

  /*
   **
   ** Bus
   **
   */
  function setupBusHandlersInternal() {
    // Watching the pins
    bus.attachPin('nmi', {
      onFalling: function() {
        wasNMIGenerated = true
      },
    });
    bus.attachPin('nmi', {
      onRising: function() {
        wasNMIGenerated = false
      },
    });
    bus.attachPin('int', {
      onFalling: function() {
        wasIRQGenerated = true
      },
    });
    bus.attachPin('reset', {
      onFalling: function() {
        reset()
      },
    });
  }

  /*
   **
   ** ALU
   **
   */
  function set(r, v) {
    r.assign(v);
  }

  function get(r) {
    return r.getUnsigned();
  }

  function lit(v) {
    return v;
  }
  // NOTE: When using the bus versions, this uses Z80 conventions
  let in8;
  let out8;
  let write8;
  let fetch8;
  let write16;
  //
  function setupBusHandlers() {
    if (options.directIORQ) {
      in8 = bus.iorq.readPort;
      out8 = bus.iorq.writePort;
    } else {
      in8 = function(port) {
        port = port.getUnsigned ? port.getUnsigned() : port;
        bus.writeBlock('address', port);
        bus.setLow('rd');
        bus.setLow('iorq');
        let data = bus.readBlock('data');
        bus.setHigh('iorq');
        bus.setHigh('rd');
        return data;
      };

      out8 = function(port, data) {
        port = port.getUnsigned ? port.getUnsigned() : port;
        data = data.getUnsigned ? data.getUnsigned() : data;
        bus.writeBlock('address', port);
        bus.writeBlock('data', data);
        bus.setLow('wr');
        bus.pulseLow('iorq');
        bus.setHigh('wr');
      };
    }
    //
    if (options.directMemory) {
      // TODO: don't auto generate these
      read8 = bus.memory.read8;
      read16 = bus.memory.read16;
      write8 = bus.memory.write8;
      write16 = bus.memory.write16;
    } else {
      // TODO: CPU needs endian knowledge to do read16
      read8 = function(address) {
        address = address.getUnsigned ? address.getUnsigned() : address;
        bus.writeBlock('address', address);
        bus.setLow('rd');
        bus.setLow('mreq');
        let data = bus.readBlock('data');
        bus.setHigh('mreq');
        bus.setHigh('rd');
        return data;
      };

      write8 = function(address, data) {
        address = address.getUnsigned ? address.getUnsigned() : address;
        data = data.getUnsigned ? data.getUnsigned() : data;
        bus.writeBlock('address', address);
        bus.writeBlock('data', data);
        bus.setLow('wr');
        bus.pulseLow('mreq');
        bus.setHigh('wr');
      };

      read16 = function(address) {
        address = address.getUnsigned ? address.getUnsigned() : address;
        if (isBigEndian) {
          return read8(address) * 256 + read8(address + 1);
        } else {
          return read8(address + 1) * 256 + read8(address);
        }
      };

      write16 = function(address, data) {
        address = address.getUnsigned ? address.getUnsigned() : address;
        data = data.getUnsigned ? data.getUnsigned() : data;

        if (isBigEndian) {
          write8(address + 0, data >> 8);
          write8(address + 1, data & 0xff);
        } else {
          write8(address + 1, data >> 8);
          write8(address + 0, data & 0xff);
        }
      };
    }
    //
    if (options.directFetch) {
      fetch8 = function() {
        let pcValue = pc.getUnsigned();
        return bus.memory.read8(pcValue);
      };
    } else {
      fetch8 = function() {
        let pcValue = pc.getUnsigned();
        bus.writeBlock('address', pcValue);
        bus.setLow('m1');
        bus.setLow('rd');
        bus.setLow('mreq');
        let data = bus.readBlock('data');
        bus.setHigh('mreq');
        bus.setHigh('rd');
        bus.setHigh('m1');

        // TODO: Re-introduce this?
        //pc.inc();
        updateMemoryRefresh();

        return data;
      };

    }
    //
  }
  var alu = alu || {};

  alu.parityLUT8 = [];

  alu.start = function() {
    for (let i = 0; i < 256; ++i) {
      alu.parityLUT8[i] = calculateParity(i);
    }
  }

  alu.reset = function() {

  }

  function calculateParity(v, sz = 8) {
    let bits = 0;

    v = v & 255; /// ensure it's positive, for the table deference

    for (let i = 0; i < sz; ++i) {
      if (v & (1 << i)) {
        ++bits;
      }
    }
    let parity = (bits & 1) == 1 ? 0 : 1; // odd parity returns 0
    return parity;
  }
  let flagHalfCarryAdd = [0, 1, 1, 1, 0, 0, 0, 1];
  let flagHalfCarrySub = [0, 0, 1, 0, 1, 0, 1, 1];

  alu.add_u8u8c = function(v1, v2, v3 = 0) {
    v1 = v1.get ? v1.getUnsigned() : v1;
    v2 = v2.get ? v2.getUnsigned() : v2;

    let result = (v1 + v2 + v3);
    wasCarry = result > 0xff ? 1 : 0;

    // Did the calculation in the lowest 4 bits spill over into the upper 4 bits

    // The MSB is same on both src params, but changed between result and src param1
    let lookup = ((v1 & 0x88) >> 3) | (((v2) & 0x88) >> 2) | ((result & 0x88) >> 1);
    wasHalfCarry = flagHalfCarryAdd[(lookup & 7)];
    lookup >>= 4;
    wasOverflow = (lookup == 3 || lookup == 4) ? 1 : 0;

    result &= 0xff;

    computeFlags8(result);
    aluLastResult = result;

    return result;
  }

  alu.sub_u8u8b = function(v1, v2, v3 = 0) {
    v1 = v1.get ? v1.getUnsigned() : v1;
    v2 = v2.get ? v2.getUnsigned() : v2;
    let result = (v1 - v2) - v3;

    wasCarry = result & 0x100 ? 1 : 0;
    wasNegation = true;

    // Did the calculation in the lowest 4 bits spill under

    // The MSB is same on both src params, but changed between result and src param1
    let lookup = ((v1 & 0x88) >> 3) | (((v2) & 0x88) >> 2) | ((result & 0x88) >> 1);
    wasHalfCarry = flagHalfCarrySub[(lookup & 7)];
    lookup >>= 4;
    wasOverflow = (lookup == 1 || lookup == 6) ? 1 : 0;

    result &= 0xff;

    computeFlags8(result);

    return result;
  }
  alu.abs16 = function(v) {
    return computeFlags16(Math.abs(v));
  }

  alu.add_u16u16c = function(v1, v2, v3 = 0) {
    v1 = v1.get ? v1.getUnsigned() : v1;
    v2 = v2.get ? v2.getUnsigned() : v2;

    let result = (v1 + v2 + v3);
    wasCarry = result > 0xffff ? 1 : 0;

    // 16 bit adds set_'H' on overflow of bit 11 (!?)

    // The MSB is same on both src params, but changed between result and src param1
    let lookup = ((v1 & 0x8800) >> 11) | (((v2) & 0x8800) >> 10) | ((result & 0x8800) >> 9);
    wasHalfCarry = flagHalfCarryAdd[(lookup & 7)];
    lookup >>= 4;
    wasOverflow = (lookup == 3 || lookup == 4) ? 1 : 0; // TODO: not convinced any Z80 instr checks the 'V' flag fter 16 bit adds

    result &= 0xffff;

    computeFlags16(result);
    aluLastResult = result;

    return result;
  }

  alu.add_u16s8 = function(v1, v2, v3 = 0) {
    v1 = v1.get ? v1.getUnsigned() : v1;
    v2 = v2.get ? v2.getUnsigned() : v2;

    let result = (v1 + v2 + v3);
    if (v2 >= 128) { // handle the negative bit of 8 bit numbers in v2
      result -= 256;
    }
    wasCarry = result > 0xffff ? 1 : 0;

    // 16 bit adds set_'H' on overflow of bit 11 (!?)

    // The MSB is same on both src params, but changed between result and src param1
    let lookup = ((v1 & 0x8800) >> 11) | (((v2) & 0x8800) >> 10) | ((result & 0x8800) >> 9);
    wasHalfCarry = flagHalfCarryAdd[(lookup & 7)];
    lookup >>= 4;
    wasOverflow = (lookup == 3 || lookup == 4) ? 1 : 0;

    result &= 0xffff;

    computeFlags16(result);

    return result;
  }

  alu.sub_u16u16b = function(v1, v2, v3 = 0) {
    v1 = v1.get ? v1.getUnsigned() : v1;
    v2 = v2.get ? v2.getUnsigned() : v2;
    let result = (v1 - v2) - v3;

    wasCarry = result & 0x10000 ? 1 : 0;
    wasNegation = true;

    // 16-bit half carry occurs on bit 11

    // The MSB is same on both src params, but changed between result and src param1
    let lookup = ((v1 & 0x8800) >> 11) | (((v2) & 0x8800) >> 10) | ((result & 0x8800) >> 9);
    wasHalfCarry = flagHalfCarrySub[(lookup & 7)];
    lookup >>= 4;
    wasOverflow = (lookup == 1 || lookup == 6) ? 1 : 0;

    result &= 0xffff;

    computeFlags16(result);

    return result;
  }
  alu.daa = function(v, carry, subtraction) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = carry;

    if (subtraction) { // last instr was subtraction	
      if ((v & 0x0f) > 9) {
        v -= 6;
      }
      if ((v & 0xf0) > 0x90) {
        v -= 0x60;
      }
    } else { // post an addition
      if ((v & 0x0f) > 9) {
        v += 6;
      }
      if ((v & 0xf0) > 0x90) {
        v += 0x60;
      }
    }
    v = v & 0xff;
    computeFlags8(v);
    return v;
  }
  // utility methods
  let wasCarry;
  let wasNegation;
  let wasOverflow;
  let wasHalfCarry;
  let wasZero;
  let wasSign;
  let wasParity;
  //
  let aluLastResult;


  function sign() {
    return wasSign;
  }

  function sign16() {
    return wasSign;
  }

  function zero() {
    return wasZero;
  }

  function halfcarry() {
    return wasHalfCarry;
  }

  function overflow() {
    return wasOverflow;
  }

  function parity() {
    return wasParity;
  }

  function carry() {
    return wasCarry;
  }

  function getParity8(v) {
    return alu.parityLUT8[v];
  }

  function getParity16(v) {
    return alu.parityLUT8[v * 255] ^ alu.parityLUT8[v >> 8];
  }

  function computeFlags8(r) {
    wasSign = r & 0x80 ? 1 : 0;
    wasZero = r == 0 ? 1 : 0;
    wasParity = getParity8(r);
    return r;
  }

  function computeFlags16(r) {
    wasSign = r & 0x8000 ? 1 : 0;
    wasZero = r == 0 ? 1 : 0;
    wasParity = getParity16(r);
    return r;
  }
  //
  // Basic manipulation
  //
  alu.complement8 = function(v) {
    v = v.get ? v.getUnsigned() : v;
    v = (~v) & 0xff;

    computeFlags8(v);

    return v;
  }

  alu.setBit8 = function(bit, value) {
    value = value.get ? value.getUnsigned() : value;
    value = value | (1 << bit);
    computeFlags8(value);
    return value;
  }

  alu.clearBit8 = function(bit, value) {
    value = value.get ? value.getUnsigned() : value;
    value = value & ~(1 << bit);
    computeFlags8(value);
    return value;
  }

  alu.testBit8 = function(bit, value) {
    value = value.get ? value.getUnsigned() : value;
    let isBitSet = value & (1 << bit) ? 1 : 0;
    wasSign = value & 0x80 ? 1 : 0;
    wasZero = isBitSet ? 0 : 1;
    wasOverflow = wasZero;
    wasParity = wasZero; // TODO: sure this isn't getParity8(value);?
    return isBitSet;
  }

  alu.and8 = function(v, v2) {
    v = v.get ? v.getUnsigned() : v;
    v2 = v2.get ? v2.getUnsigned() : v2;

    return computeFlags8(v & v2);
  }

  alu.xor8 = function(v, v2) {
    v = v.get ? v.getUnsigned() : v;
    v2 = v2.get ? v2.getUnsigned() : v2;

    return computeFlags8(v ^ v2);
  }

  alu.or8 = function(v, v2) {
    v = v.get ? v.getUnsigned() : v;
    v2 = v2.get ? v2.getUnsigned() : v2;

    return computeFlags8(v | v2);
  }

  //
  // Shift and rotates
  //
  alu.lsr8 = function(v, places) {
    v = v.get ? v.getUnsigned() : v;
    wasCarry = v & 1;
    return v >> places;
  }

  alu.lsl8 = function(v, places) {
    v = v.get ? v.getUnsigned() : v;
    wasCarry = v & 0x80 ? 1 : 0;
    return v << places;
  }

  alu.rra8 = function(v, carry) {
    v = v.get ? v.getUnsigned() : v;

    v |= carry ? 0x100 : 0;
    wasCarry = v & 1;
    v >>= 1;
    v &= 0xff;

    computeFlags8(v);

    return v;
  }

  // SLL is undocumented it seems (at least in Zaks:82)
  // http://www.z80.info/z80undoc.htm
  // suggests it's like SLA, but with 1 in the LSB
  alu.sll8 = function(v) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 0x80 ? 1 : 0;
    v <<= 1;
    v |= 1;
    v = v & 0xff;

    computeFlags8(v);

    return v;
  }

  alu.sla8 = function(v) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 0x80 ? 1 : 0;
    v <<= 1;
    v = v & 0xff;

    computeFlags8(v);

    return v;
  }

  alu.sra8 = function(v) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 1;
    v >>= 1;
    v |= (v & 0x40) << 1;

    computeFlags8(v);

    return v;
  }

  alu.srl8 = function(v) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 1;
    v >>= 1;
    v = v & 0x7f;

    computeFlags8(v);

    return v;
  }

  alu.rlc8 = function(v) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 0x80 ? 1 : 0;
    v <<= 1;
    v |= wasCarry;
    v = v & 0xff;

    computeFlags8(v);

    return v;
  }

  alu.rl8 = function(v, carry) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 0x80 ? 1 : 0;
    v <<= 1;
    v |= carry;
    v = v & 0xff;

    computeFlags8(v);

    return v;
  }

  alu.rr8 = function(v, carry) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 1 ? 1 : 0;
    v >>= 1;
    v |= carry ? 0x80 : 0;

    computeFlags8(v);

    return v;
  }

  alu.rrc8 = function(v) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 1 ? 1 : 0;
    v >>= 1;
    v |= wasCarry ? 0x80 : 0;

    computeFlags8(v);

    return v;
  }
  alu.complement16 = function(v) {
    v = v.get ? v.getUnsigned() : v;
    v = (~v) & 0xffff;

    computeFlags16(v);

    return v;
  }

  alu.test16 = function(v) {
    return computeFlags16(v)
  }

  alu.xor16 = function(v1, v2) {
    return computeFlags16(v1 ^ v2);
  }

  alu.or16 = function(v1, v2) {
    return computeFlags16(v1 | v2);
  }

  alu.and16 = function(v1, v2) {
    return computeFlags16(v1 & v2);
  }

  function createRegisterPair(hi, lo) {
    let pair = new emf.Number(16);
    let pairAssign = pair.assign;
    let pairGetUnsigned = pair.getUnsigned;

    getMethods = (obj) => Object.getOwnPropertyNames(obj).filter(item => typeof obj[item] === 'function')
    let method = getMethods(pair);
    method.forEach((m) => {
      let original = pair[m];
      pair[m] = function(args) {
        //// Copy from individual
        let combined = (hi.getUnsigned() << 8) | lo.getUnsigned();
        pairAssign(combined);

        // Do normal math using genuine logic
        let returnValue = original(args);

        // Copy back
        let result = pairGetUnsigned();
        hi.assign(result >> 8);
        lo.assign(result & 255);

        return returnValue; // for those that use it. e.g. equals()
      }
    });

    // TODO: get() 
    pair.get = function() {
      return (hi.getUnsigned() << 8) | lo.getUnsigned();
    }
    pair.getUnsigned = function() {
      return (hi.getUnsigned() << 8) | lo.getUnsigned();
    }

    return pair;
  }

  /*
   **
   ** Utility methods
   **
   */
  function start() {
    alu.start();
    setupBusHandlersInternal();
    setupBusHandlers();
    return reset();
  }

  function reset() {
    alu.reset();
    a.assign(0);
    b.assign(0);
    c.assign(0);
    d.assign(0);
    e.assign(0);
    h.assign(0);
    l.assign(0);
    pc.assign(0);
    sp.assign(0);
    isBigEndian = (false);
    inHalt = (false);
    interruptEnabled = (0);
    wasNMIGenerated = (false);
    wasIRQGenerated = (false);
  }

  function getRegisterValueA() {
    return a.getUnsigned();
  }

  function setRegisterValueA(v) {
    a.assign(v);
  }

  function getRegisterValueB() {
    return b.getUnsigned();
  }

  function setRegisterValueB(v) {
    b.assign(v);
  }

  function getRegisterValueC() {
    return c.getUnsigned();
  }

  function setRegisterValueC(v) {
    c.assign(v);
  }

  function getRegisterValueD() {
    return d.getUnsigned();
  }

  function setRegisterValueD(v) {
    d.assign(v);
  }

  function getRegisterValueE() {
    return e.getUnsigned();
  }

  function setRegisterValueE(v) {
    e.assign(v);
  }

  function getRegisterValueH() {
    return h.getUnsigned();
  }

  function setRegisterValueH(v) {
    h.assign(v);
  }

  function getRegisterValueL() {
    return l.getUnsigned();
  }

  function setRegisterValueL(v) {
    l.assign(v);
  }

  function getRegisterValuePC() {
    return pc.getUnsigned();
  }

  function setRegisterValuePC(v) {
    pc.assign(v);
  }

  function getRegisterValueSP() {
    return sp.getUnsigned();
  }

  function setRegisterValueSP(v) {
    sp.assign(v);
  }

  function getRegisterValue(name) {
    name = name.toLowerCase();
    if (name == 'a') return getRegisterValueA();
    if (name == 'b') return getRegisterValueB();
    if (name == 'c') return getRegisterValueC();
    if (name == 'd') return getRegisterValueD();
    if (name == 'e') return getRegisterValueE();
    if (name == 'h') return getRegisterValueH();
    if (name == 'l') return getRegisterValueL();
    if (name == 'pc') return getRegisterValuePC();
    if (name == 'sp') return getRegisterValueSP();
  }

  function setRegisterValue(name, v) {
    name = name.toLowerCase();
    if (name === 'a') return setRegisterValueA(v);
    if (name === 'b') return setRegisterValueB(v);
    if (name === 'c') return setRegisterValueC(v);
    if (name === 'd') return setRegisterValueD(v);
    if (name === 'e') return setRegisterValueE(v);
    if (name === 'h') return setRegisterValueH(v);
    if (name === 'l') return setRegisterValueL(v);
    if (name === 'pc') return setRegisterValuePC(v);
    if (name === 'sp') return setRegisterValueSP(v);
  }

  function setFlagValue(name, v) {
    name = name.toLowerCase();
    if (name === 'c') return changeFlagC(v);
    if (name === 'b1') return changeFlagB1(v);
    if (name === 'p') return changeFlagP(v);
    if (name === 'v') return changeFlagV(v);
    if (name === 'b3') return changeFlagB3(v);
    if (name === 'h') return changeFlagH(v);
    if (name === 'b5') return changeFlagB5(v);
    if (name === 'z') return changeFlagZ(v);
    if (name === 's') return changeFlagS(v);
  }

  function getFlagC() {
    return cc_bit_0;
  }

  function clearFlagC() {
    cc_bit_0 = 0;
  }

  function setFlagC() {
    cc_bit_0 = 1;
  }

  function affectFlagC() {
    if (carry()) {
      setFlagC();
    } else {
      clearFlagC();
    }
  }

  function changeFlagC(newState) {
    if (newState) {
      setFlagC();
    } else {
      clearFlagC();
    }
  }

  function getFlagB1() {
    return cc_bit_1;
  }

  function clearFlagB1() {
    cc_bit_1 = 0;
  }

  function setFlagB1() {
    cc_bit_1 = 1;
  }

  function affectFlagB1() {
    if (unused1()) {
      setFlagB1();
    } else {
      clearFlagB1();
    }
  }

  function changeFlagB1(newState) {
    if (newState) {
      setFlagB1();
    } else {
      clearFlagB1();
    }
  }

  function getFlagP() {
    return cc_bit_2;
  }

  function clearFlagP() {
    cc_bit_2 = 0;
  }

  function setFlagP() {
    cc_bit_2 = 1;
  }

  function affectFlagP() {
    if (parity()) {
      setFlagP();
    } else {
      clearFlagP();
    }
  }

  function changeFlagP(newState) {
    if (newState) {
      setFlagP();
    } else {
      clearFlagP();
    }
  }

  function getFlagV() {
    return cc_bit_2;
  }

  function clearFlagV() {
    cc_bit_2 = 0;
  }

  function setFlagV() {
    cc_bit_2 = 1;
  }

  function affectFlagV() {
    if (overflow()) {
      setFlagV();
    } else {
      clearFlagV();
    }
  }

  function changeFlagV(newState) {
    if (newState) {
      setFlagV();
    } else {
      clearFlagV();
    }
  }

  function getFlagB3() {
    return cc_bit_3;
  }

  function clearFlagB3() {
    cc_bit_3 = 0;
  }

  function setFlagB3() {
    cc_bit_3 = 1;
  }

  function affectFlagB3() {
    if (unused3()) {
      setFlagB3();
    } else {
      clearFlagB3();
    }
  }

  function changeFlagB3(newState) {
    if (newState) {
      setFlagB3();
    } else {
      clearFlagB3();
    }
  }

  function getFlagH() {
    return cc_bit_4;
  }

  function clearFlagH() {
    cc_bit_4 = 0;
  }

  function setFlagH() {
    cc_bit_4 = 1;
  }

  function affectFlagH() {
    if (halfcarry()) {
      setFlagH();
    } else {
      clearFlagH();
    }
  }

  function changeFlagH(newState) {
    if (newState) {
      setFlagH();
    } else {
      clearFlagH();
    }
  }

  function getFlagB5() {
    return cc_bit_5;
  }

  function clearFlagB5() {
    cc_bit_5 = 0;
  }

  function setFlagB5() {
    cc_bit_5 = 1;
  }

  function affectFlagB5() {
    if (unused5()) {
      setFlagB5();
    } else {
      clearFlagB5();
    }
  }

  function changeFlagB5(newState) {
    if (newState) {
      setFlagB5();
    } else {
      clearFlagB5();
    }
  }

  function getFlagZ() {
    return cc_bit_6;
  }

  function clearFlagZ() {
    cc_bit_6 = 0;
  }

  function setFlagZ() {
    cc_bit_6 = 1;
  }

  function affectFlagZ() {
    if (zero()) {
      setFlagZ();
    } else {
      clearFlagZ();
    }
  }

  function changeFlagZ(newState) {
    if (newState) {
      setFlagZ();
    } else {
      clearFlagZ();
    }
  }

  function getFlagS() {
    return cc_bit_7;
  }

  function clearFlagS() {
    cc_bit_7 = 0;
  }

  function setFlagS() {
    cc_bit_7 = 1;
  }

  function affectFlagS() {
    if (sign()) {
      setFlagS();
    } else {
      clearFlagS();
    }
  }

  function changeFlagS(newState) {
    if (newState) {
      setFlagS();
    } else {
      clearFlagS();
    }
  }

  function update(how) {
    // emf.control ensures only 1 step is executed
    return step();
  }

  function xferCCBitsToFlagsByte() {
    f.assign(
      (cc_bit_0 ? 1 : 0) |
      (cc_bit_1 ? 2 : 0) |
      (cc_bit_2 ? 4 : 0) |
      (cc_bit_3 ? 8 : 0) |
      (cc_bit_4 ? 16 : 0) |
      (cc_bit_5 ? 32 : 0) |
      (cc_bit_6 ? 64 : 0) |
      (cc_bit_7 ? 128 : 0) |
      0
    );
  }

  function xferFlagsByteToCCBits() {
    let v = f.getUnsigned();
    cc_bit_0 = (v & 1) ? 1 : 0;
    cc_bit_1 = (v & 2) ? 1 : 0;
    cc_bit_2 = (v & 4) ? 1 : 0;
    cc_bit_3 = (v & 8) ? 1 : 0;
    cc_bit_4 = (v & 16) ? 1 : 0;
    cc_bit_5 = (v & 32) ? 1 : 0;
    cc_bit_6 = (v & 64) ? 1 : 0;
    cc_bit_7 = (v & 128) ? 1 : 0;
  }

  //
  // Special instructions
  //
  alu.rrd8 = function() { // only for (HL)
    var v = read8(hl);
    var av = a.getUnsigned();
    var newHL = ((av & 0x0f) << 4) | (v >> 4);
    var new_a = (av & 0xf0) | (v & 0x0f);

    write8(hl, newHL);
    a.assign(new_a);

    computeFlags8(new_a);
    return new_a;
  }

  alu.rld8 = function() { // only applies to (hl)
    var v = read8(hl);
    var av = a.getUnsigned();
    var newHL = (v << 4) | (av & 0x0f);
    var new_a = (av & 0xf0) | ((v & 0xf0) >> 4);

    write8(hl, newHL);
    a.assign(new_a);

    computeFlags8(new_a);
    return new_a;
  }

  //
  // CPU handlers
  function halt() {
    inHalt = true;
    pc.sub(1); // hold still on this instruction, until an NMI hits
  }

  function disableInterrupt() {
    interruptEnabled = false;
  }

  function enableInterrupt() {
    interruptEnabled = true;
  }



  // INTERUPTS : NMI

  // returns true if we've handled an interupt

  function updateInterupts() {
    if (wasIRQGenerated) {
      if (interruptEnabled) {
        do_8080_interrupt();
      }
      wasIRQGenerated = false;
      return true;
    }
    return false;
  }

  function do_8080_interrupt() {
    sp.add(-2);
    write16(sp.getUnsigned(), pc.getUnsigned());
    let isr = bus.readBlock('int_addr');
    pc.assign(isr);
    return 1;
  }

  function updateMemoryRefresh() {}

  function step() {
    let r = processOpcode();

    if (updateInterupts()) {
      return 12; // arbitrary, non-zero
    }

    return r;
  }

  function processOpcode() {
    var bit;
    var opcode = fetch8()
    var cycles = 1;

    switch (opcode) {
      case 0x0:
        // NOP

        ;
        pc.add(1);
        return 4;


        break;

      case 0x1:
        // LXI @r,@n

        bc.assign(read16(pc.getUnsigned() + (1)));
        pc.add(3);
        return 10;


        break;

      case 0x2:
        // STAX BC

        write8(bc, a);
        pc.add(1);
        return 7;


        break;

      case 0x3:
        // INX @r

        bc.assign(emf.Maths.add_u16u16(bc, 1));
        pc.add(1);
        return 5;


        break;

      case 0x4:
        // INR @r

        b.assign(alu.add_u8u8c(b, 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 5;


        break;

      case 0x5:
        // DCR @r

        b.assign(alu.sub_u8u8b(b, 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 5;


        break;

      case 0x6:
        // MVI @r, #@n

        b.assign(read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 7;


        break;

      case 0x7:
        // RLC

        a.assign(alu.rlc8(a));
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9:
        // DAD @r

        hl.assign(alu.add_u16u16c(hl, bc));
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 10;


        break;

      case 0xa:
        // LDAX (BC)

        a.assign(read8(bc));
        pc.add(1);
        return 7;


        break;

      case 0xb:
        // DCX @r

        bc.assign(emf.Maths.sub_u16u16(bc, 1));
        pc.add(1);
        return 5;


        break;

      case 0xc:
        // INR @r

        c.assign(alu.add_u8u8c(c, 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 5;


        break;

      case 0xd:
        // DCR @r

        c.assign(alu.sub_u8u8b(c, 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 5;


        break;

      case 0xe:
        // MVI @r, #@n

        c.assign(read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 7;


        break;

      case 0xf:
        // RRC

        a.assign(alu.rrc8(a));
        clearFlagH();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x10:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x11:
        // LXI @r,@n

        de.assign(read16(pc.getUnsigned() + (1)));
        pc.add(3);
        return 10;


        break;

      case 0x12:
        // STAX DE

        write8(de, a);
        pc.add(1);
        return 7;


        break;

      case 0x13:
        // INX @r

        de.assign(emf.Maths.add_u16u16(de, 1));
        pc.add(1);
        return 5;


        break;

      case 0x14:
        // INR @r

        d.assign(alu.add_u8u8c(d, 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 5;


        break;

      case 0x15:
        // DCR @r

        d.assign(alu.sub_u8u8b(d, 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 5;


        break;

      case 0x16:
        // MVI @r, #@n

        d.assign(read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 7;


        break;

      case 0x17:
        // RAL

        a.assign(alu.rl8(a, cc_bit_0));
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x18:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x19:
        // DAD @r

        hl.assign(alu.add_u16u16c(hl, de));
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 10;


        break;

      case 0x1a:
        // LDAX DE

        a.assign(read8(de));
        pc.add(1);
        return 7;


        break;

      case 0x1b:
        // DCX @r

        de.assign(emf.Maths.sub_u16u16(de, 1));
        pc.add(1);
        return 5;


        break;

      case 0x1c:
        // INR @r

        e.assign(alu.add_u8u8c(e, 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 5;


        break;

      case 0x1d:
        // DCR @r

        e.assign(alu.sub_u8u8b(e, 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 5;


        break;

      case 0x1e:
        // MVI @r, #@n

        e.assign(read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 7;


        break;

      case 0x1f:
        // RAR

        a.assign(alu.rra8(a, cc_bit_0));
        clearFlagH();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x20:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x21:
        // LXI @r,@n

        hl.assign(read16(pc.getUnsigned() + (1)));
        pc.add(3);
        return 10;


        break;

      case 0x22:
        // SHLD @n

        write16(read16(pc.getUnsigned() + (1)), hl);
        pc.add(3);
        return 16;


        break;

      case 0x23:
        // INX @r

        hl.assign(emf.Maths.add_u16u16(hl, 1));
        pc.add(1);
        return 5;


        break;

      case 0x24:
        // INR @r

        h.assign(alu.add_u8u8c(h, 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 5;


        break;

      case 0x25:
        // DCR @r

        h.assign(alu.sub_u8u8b(h, 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 5;


        break;

      case 0x26:
        // MVI @r, #@n

        h.assign(read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 7;


        break;

      case 0x27:
        // DAA

        a.assign(alu.daa(a, cc_bit_0, cc_bit_1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x28:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x29:
        // DAD @r

        hl.assign(alu.add_u16u16c(hl, hl));
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 10;


        break;

      case 0x2a:
        // LHLD @n

        hl.assign(read16(read16(pc.getUnsigned() + (1))));
        pc.add(3);
        return 16;


        break;

      case 0x2b:
        // DCX @r

        hl.assign(emf.Maths.sub_u16u16(hl, 1));
        pc.add(1);
        return 5;


        break;

      case 0x2c:
        // INR @r

        l.assign(alu.add_u8u8c(l, 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 5;


        break;

      case 0x2d:
        // DCR @r

        l.assign(alu.sub_u8u8b(l, 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 5;


        break;

      case 0x2e:
        // MVI @r, #@n

        l.assign(read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 7;


        break;

      case 0x2f:
        // CMA

        a.assign(alu.complement8(a));
        setFlagH();
        pc.add(1);
        return 4;


        break;

      case 0x30:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x31:
        // LXI @r,@n

        sp.assign(read16(pc.getUnsigned() + (1)));
        pc.add(3);
        return 10;


        break;

      case 0x32:
        // STA @n

        write8(read16(pc.getUnsigned() + (1)), a);
        pc.add(3);
        return 13;


        break;

      case 0x33:
        // INX @r

        sp.assign(emf.Maths.add_u16u16(sp, 1));
        pc.add(1);
        return 5;


        break;

      case 0x34:
        // INR @r
        // INR (HL)

        write8(hl, alu.add_u8u8c(read8(hl), 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 10;


        break;

      case 0x35:
        // DCR @r
        // DCR (HL)

        write8(hl, alu.sub_u8u8b(read8(hl), 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 10;


        break;

      case 0x36:
        // MVI @r, #@n
        // LD (HL),@n

        write8(hl, read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 10;


        break;

      case 0x37:
        // STC

        ;
        clearFlagH();
        setFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x38:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x39:
        // DAD @r

        hl.assign(alu.add_u16u16c(hl, sp));
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 10;


        break;

      case 0x3a:
        // LDA @n

        a.assign(read8(read16(pc.getUnsigned() + (1))));
        pc.add(3);
        return 13;


        break;

      case 0x3b:
        // DCX @r

        sp.assign(emf.Maths.sub_u16u16(sp, 1));
        pc.add(1);
        return 5;


        break;

      case 0x3c:
        // INR @r

        a.assign(alu.add_u8u8c(a, 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 5;


        break;

      case 0x3d:
        // DCR @r

        a.assign(alu.sub_u8u8b(a, 1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 5;


        break;

      case 0x3e:
        // MVI @r, #@n

        a.assign(read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 7;


        break;

      case 0x3f:
        // CMC

        wasHalfCarry = cc_bit_0;
        wasCarry = cc_bit_0 ? 0 : 1;
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x40:
        // MOV @r,@s

        b.assign(b);
        pc.add(1);
        return 5;


        break;

      case 0x41:
        // MOV @r,@s

        b.assign(c);
        pc.add(1);
        return 5;


        break;

      case 0x42:
        // MOV @r,@s

        b.assign(d);
        pc.add(1);
        return 5;


        break;

      case 0x43:
        // MOV @r,@s

        b.assign(e);
        pc.add(1);
        return 5;


        break;

      case 0x44:
        // MOV @r,@s

        b.assign(h);
        pc.add(1);
        return 5;


        break;

      case 0x45:
        // MOV @r,@s

        b.assign(l);
        pc.add(1);
        return 5;


        break;

      case 0x46:
        // MOV @r,@s
        // MOV @r,(HL)

        b.assign(read8(hl));
        pc.add(1);
        return 7;


        break;

      case 0x47:
        // MOV @r,@s

        b.assign(a);
        pc.add(1);
        return 5;


        break;

      case 0x48:
        // MOV @r,@s

        c.assign(b);
        pc.add(1);
        return 5;


        break;

      case 0x49:
        // MOV @r,@s

        c.assign(c);
        pc.add(1);
        return 5;


        break;

      case 0x4a:
        // MOV @r,@s

        c.assign(d);
        pc.add(1);
        return 5;


        break;

      case 0x4b:
        // MOV @r,@s

        c.assign(e);
        pc.add(1);
        return 5;


        break;

      case 0x4c:
        // MOV @r,@s

        c.assign(h);
        pc.add(1);
        return 5;


        break;

      case 0x4d:
        // MOV @r,@s

        c.assign(l);
        pc.add(1);
        return 5;


        break;

      case 0x4e:
        // MOV @r,@s
        // MOV @r,(HL)

        c.assign(read8(hl));
        pc.add(1);
        return 7;


        break;

      case 0x4f:
        // MOV @r,@s

        c.assign(a);
        pc.add(1);
        return 5;


        break;

      case 0x50:
        // MOV @r,@s

        d.assign(b);
        pc.add(1);
        return 5;


        break;

      case 0x51:
        // MOV @r,@s

        d.assign(c);
        pc.add(1);
        return 5;


        break;

      case 0x52:
        // MOV @r,@s

        d.assign(d);
        pc.add(1);
        return 5;


        break;

      case 0x53:
        // MOV @r,@s

        d.assign(e);
        pc.add(1);
        return 5;


        break;

      case 0x54:
        // MOV @r,@s

        d.assign(h);
        pc.add(1);
        return 5;


        break;

      case 0x55:
        // MOV @r,@s

        d.assign(l);
        pc.add(1);
        return 5;


        break;

      case 0x56:
        // MOV @r,@s
        // MOV @r,(HL)

        d.assign(read8(hl));
        pc.add(1);
        return 7;


        break;

      case 0x57:
        // MOV @r,@s

        d.assign(a);
        pc.add(1);
        return 5;


        break;

      case 0x58:
        // MOV @r,@s

        e.assign(b);
        pc.add(1);
        return 5;


        break;

      case 0x59:
        // MOV @r,@s

        e.assign(c);
        pc.add(1);
        return 5;


        break;

      case 0x5a:
        // MOV @r,@s

        e.assign(d);
        pc.add(1);
        return 5;


        break;

      case 0x5b:
        // MOV @r,@s

        e.assign(e);
        pc.add(1);
        return 5;


        break;

      case 0x5c:
        // MOV @r,@s

        e.assign(h);
        pc.add(1);
        return 5;


        break;

      case 0x5d:
        // MOV @r,@s

        e.assign(l);
        pc.add(1);
        return 5;


        break;

      case 0x5e:
        // MOV @r,@s
        // MOV @r,(HL)

        e.assign(read8(hl));
        pc.add(1);
        return 7;


        break;

      case 0x5f:
        // MOV @r,@s

        e.assign(a);
        pc.add(1);
        return 5;


        break;

      case 0x60:
        // MOV @r,@s

        h.assign(b);
        pc.add(1);
        return 5;


        break;

      case 0x61:
        // MOV @r,@s

        h.assign(c);
        pc.add(1);
        return 5;


        break;

      case 0x62:
        // MOV @r,@s

        h.assign(d);
        pc.add(1);
        return 5;


        break;

      case 0x63:
        // MOV @r,@s

        h.assign(e);
        pc.add(1);
        return 5;


        break;

      case 0x64:
        // MOV @r,@s

        h.assign(h);
        pc.add(1);
        return 5;


        break;

      case 0x65:
        // MOV @r,@s

        h.assign(l);
        pc.add(1);
        return 5;


        break;

      case 0x66:
        // MOV @r,@s
        // MOV @r,(HL)

        h.assign(read8(hl));
        pc.add(1);
        return 7;


        break;

      case 0x67:
        // MOV @r,@s

        h.assign(a);
        pc.add(1);
        return 5;


        break;

      case 0x68:
        // MOV @r,@s

        l.assign(b);
        pc.add(1);
        return 5;


        break;

      case 0x69:
        // MOV @r,@s

        l.assign(c);
        pc.add(1);
        return 5;


        break;

      case 0x6a:
        // MOV @r,@s

        l.assign(d);
        pc.add(1);
        return 5;


        break;

      case 0x6b:
        // MOV @r,@s

        l.assign(e);
        pc.add(1);
        return 5;


        break;

      case 0x6c:
        // MOV @r,@s

        l.assign(h);
        pc.add(1);
        return 5;


        break;

      case 0x6d:
        // MOV @r,@s

        l.assign(l);
        pc.add(1);
        return 5;


        break;

      case 0x6e:
        // MOV @r,@s
        // MOV @r,(HL)

        l.assign(read8(hl));
        pc.add(1);
        return 7;


        break;

      case 0x6f:
        // MOV @r,@s

        l.assign(a);
        pc.add(1);
        return 5;


        break;

      case 0x70:
        // MOV @r,@s
        // MOV (HL),@r

        write8(hl, b);
        pc.add(1);
        return 7;


        break;

      case 0x71:
        // MOV @r,@s
        // MOV (HL),@r

        write8(hl, c);
        pc.add(1);
        return 7;


        break;

      case 0x72:
        // MOV @r,@s
        // MOV (HL),@r

        write8(hl, d);
        pc.add(1);
        return 7;


        break;

      case 0x73:
        // MOV @r,@s
        // MOV (HL),@r

        write8(hl, e);
        pc.add(1);
        return 7;


        break;

      case 0x74:
        // MOV @r,@s
        // MOV (HL),@r

        write8(hl, h);
        pc.add(1);
        return 7;


        break;

      case 0x75:
        // MOV @r,@s
        // MOV (HL),@r

        write8(hl, l);
        pc.add(1);
        return 7;


        break;

      case 0x76:
        // MOV @r,@s
        // MOV @r,(HL)
        // MOV (HL),@r
        // HALT

        halt();
        pc.add(1);
        return 7;


        break;

      case 0x77:
        // MOV @r,@s
        // MOV (HL),@r

        write8(hl, a);
        pc.add(1);
        return 7;


        break;

      case 0x78:
        // MOV @r,@s

        a.assign(b);
        pc.add(1);
        return 5;


        break;

      case 0x79:
        // MOV @r,@s

        a.assign(c);
        pc.add(1);
        return 5;


        break;

      case 0x7a:
        // MOV @r,@s

        a.assign(d);
        pc.add(1);
        return 5;


        break;

      case 0x7b:
        // MOV @r,@s

        a.assign(e);
        pc.add(1);
        return 5;


        break;

      case 0x7c:
        // MOV @r,@s

        a.assign(h);
        pc.add(1);
        return 5;


        break;

      case 0x7d:
        // MOV @r,@s

        a.assign(l);
        pc.add(1);
        return 5;


        break;

      case 0x7e:
        // MOV @r,@s
        // MOV @r,(HL)

        a.assign(read8(hl));
        pc.add(1);
        return 7;


        break;

      case 0x7f:
        // MOV @r,@s

        a.assign(a);
        pc.add(1);
        return 5;


        break;

      case 0x80:
        // ADD @r

        a.assign(alu.add_u8u8c(a, b));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x81:
        // ADD @r

        a.assign(alu.add_u8u8c(a, c));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x82:
        // ADD @r

        a.assign(alu.add_u8u8c(a, d));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x83:
        // ADD @r

        a.assign(alu.add_u8u8c(a, e));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x84:
        // ADD @r

        a.assign(alu.add_u8u8c(a, h));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x85:
        // ADD @r

        a.assign(alu.add_u8u8c(a, l));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x86:
        // ADD @r
        // ADD (HL)

        a.assign(alu.add_u8u8c(a, read8(hl)));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 7;


        break;

      case 0x87:
        // ADD @r

        a.assign(alu.add_u8u8c(a, a));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x88:
        // ADC @r

        a.assign(alu.add_u8u8c(a, b, cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x89:
        // ADC @r

        a.assign(alu.add_u8u8c(a, c, cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x8a:
        // ADC @r

        a.assign(alu.add_u8u8c(a, d, cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x8b:
        // ADC @r

        a.assign(alu.add_u8u8c(a, e, cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x8c:
        // ADC @r

        a.assign(alu.add_u8u8c(a, h, cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x8d:
        // ADC @r

        a.assign(alu.add_u8u8c(a, l, cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x8e:
        // ADC @r
        // ADC (HL)

        a.assign(alu.add_u8u8c(a, read8(hl), cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 7;


        break;

      case 0x8f:
        // ADC @r

        a.assign(alu.add_u8u8c(a, a, cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x90:
        // SUB @r

        a.assign(alu.sub_u8u8b(a, b));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x91:
        // SUB @r

        a.assign(alu.sub_u8u8b(a, c));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x92:
        // SUB @r

        a.assign(alu.sub_u8u8b(a, d));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x93:
        // SUB @r

        a.assign(alu.sub_u8u8b(a, e));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x94:
        // SUB @r

        a.assign(alu.sub_u8u8b(a, h));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x95:
        // SUB @r

        a.assign(alu.sub_u8u8b(a, l));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x96:
        // SUB @r
        // SUB (HL)

        a.assign(alu.sub_u8u8b(a, read8(hl)));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 7;


        break;

      case 0x97:
        // SUB @r

        a.assign(alu.sub_u8u8b(a, a));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x98:
        // SBB @r

        a.assign(alu.sub_u8u8b(a, b, cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x99:
        // SBB @r

        a.assign(alu.sub_u8u8b(a, c, cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x9a:
        // SBB @r

        a.assign(alu.sub_u8u8b(a, d, cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x9b:
        // SBB @r

        a.assign(alu.sub_u8u8b(a, e, cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x9c:
        // SBB @r

        a.assign(alu.sub_u8u8b(a, h, cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x9d:
        // SBB @r

        a.assign(alu.sub_u8u8b(a, l, cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x9e:
        // SBB @r
        // SBB A,(HL)

        a.assign(alu.sub_u8u8b(a, read8(hl), cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 7;


        break;

      case 0x9f:
        // SBB @r

        a.assign(alu.sub_u8u8b(a, a, cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xa0:
        // ANA @r

        a.assign(alu.and8(a, b));
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa1:
        // ANA @r

        a.assign(alu.and8(a, c));
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa2:
        // ANA @r

        a.assign(alu.and8(a, d));
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa3:
        // ANA @r

        a.assign(alu.and8(a, e));
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa4:
        // ANA @r

        a.assign(alu.and8(a, h));
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa5:
        // ANA @r

        a.assign(alu.and8(a, l));
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa6:
        // ANA @r
        // ANA (HL)

        a.assign(alu.and8(a, read8(hl)));
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 7;


        break;

      case 0xa7:
        // ANA @r

        a.assign(alu.and8(a, a));
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa8:
        // XRA @r

        a.assign(alu.xor8(a, b));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa9:
        // XRA @r

        a.assign(alu.xor8(a, c));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xaa:
        // XRA @r

        a.assign(alu.xor8(a, d));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xab:
        // XRA @r

        a.assign(alu.xor8(a, e));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xac:
        // XRA @r

        a.assign(alu.xor8(a, h));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xad:
        // XRA @r

        a.assign(alu.xor8(a, l));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xae:
        // XRA @r
        // XRA (HL)

        a.assign(alu.xor8(a, read8(hl)));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 7;


        break;

      case 0xaf:
        // XRA @r

        a.assign(alu.xor8(a, a));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb0:
        // ORA @r

        a.assign(alu.or8(a, b));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb1:
        // ORA @r

        a.assign(alu.or8(a, c));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb2:
        // ORA @r

        a.assign(alu.or8(a, d));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb3:
        // ORA @r

        a.assign(alu.or8(a, e));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb4:
        // ORA @r

        a.assign(alu.or8(a, h));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb5:
        // ORA @r

        a.assign(alu.or8(a, l));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb6:
        // ORA @r
        // ORA (HL)

        a.assign(alu.or8(a, read8(hl)));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 7;


        break;

      case 0xb7:
        // ORA @r

        a.assign(alu.or8(a, a));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb8:
        // CMP @r

        tmp8.assign(alu.sub_u8u8b(a, b));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xb9:
        // CMP @r

        tmp8.assign(alu.sub_u8u8b(a, c));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xba:
        // CMP @r

        tmp8.assign(alu.sub_u8u8b(a, d));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xbb:
        // CMP @r

        tmp8.assign(alu.sub_u8u8b(a, e));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xbc:
        // CMP @r

        tmp8.assign(alu.sub_u8u8b(a, h));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xbd:
        // CMP @r

        tmp8.assign(alu.sub_u8u8b(a, l));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xbe:
        // CMP @r
        // CMP (HL)

        tmp8.assign(alu.sub_u8u8b(a, read8(hl)));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 7;


        break;

      case 0xbf:
        // CMP @r

        tmp8.assign(alu.sub_u8u8b(a, a));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xc0:
        // RET @r

        if (cc_bit_6 == 0) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xc1:
        // POP @r

        bc.assign(read16(sp));
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        if (opcode == 0xf1) xferFlagsByteToCCBits();
        pc.add(1);
        return 10;


        break;

      case 0xc2:
        // J@r @n

        if (cc_bit_6 == 0) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xc3:
        // JMP @n

        pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        pc.add(3);
        return 10;


        break;

      case 0xc4:
        // C@r @n

        if (cc_bit_6 == 0) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 11 + cycles;


        break;

      case 0xc5:
        // PUSH @r

        if (opcode == 0xf5) xferCCBitsToFlagsByte();
        sp.assign(emf.Maths.sub_u16u16(sp, 2));
        write16(sp, bc);
        pc.add(1);
        return 10;


        break;

      case 0xc6:
        // ADI @n

        a.assign(alu.add_u8u8c(a, read8(pc.getUnsigned() + (1))));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(2);
        return 7;


        break;

      case 0xc7:
        // RST @r

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x00, -1));
        pc.add(1);
        return 11;


        break;

      case 0xc8:
        // RET @r

        if (cc_bit_6 == 1) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xc9:
        // RET

        pc.assign(read16(sp) - 1);
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        pc.add(1);
        return 10;


        break;

      case 0xca:
        // J@r @n

        if (cc_bit_6 == 1) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xcb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xcc:
        // C@r @n

        if (cc_bit_6 == 1) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 11 + cycles;


        break;

      case 0xcd:
        // CALL @n

        sp.assign(emf.Maths.sub_u16u16(sp, 2));
        write16(sp, emf.Maths.add_u16u16(pc, 3));
        pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));
        pc.add(3);
        return 17;


        break;

      case 0xce:
        // ACI #@n

        a.assign(alu.add_u8u8c(a, read8(pc.getUnsigned() + (1)), cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(2);
        return 7;


        break;

      case 0xcf:
        // RST @r

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x08, -1));
        pc.add(1);
        return 11;


        break;

      case 0xd0:
        // RET @r

        if (cc_bit_0 == 0) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xd1:
        // POP @r

        de.assign(read16(sp));
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        if (opcode == 0xf1) xferFlagsByteToCCBits();
        pc.add(1);
        return 10;


        break;

      case 0xd2:
        // J@r @n

        if (cc_bit_0 == 0) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xd3:
        // OUT @n

        out8(read8(pc.getUnsigned() + (1)), a);
        pc.add(2);
        return 11;


        break;

      case 0xd4:
        // C@r @n

        if (cc_bit_0 == 0) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 11 + cycles;


        break;

      case 0xd5:
        // PUSH @r

        if (opcode == 0xf5) xferCCBitsToFlagsByte();
        sp.assign(emf.Maths.sub_u16u16(sp, 2));
        write16(sp, de);
        pc.add(1);
        return 10;


        break;

      case 0xd6:
        // SUI #@n

        a.assign(alu.sub_u8u8b(a, read8(pc.getUnsigned() + (1))));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(2);
        return 7;


        break;

      case 0xd7:
        // RST @r

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x10, -1));
        pc.add(1);
        return 11;


        break;

      case 0xd8:
        // RET @r

        if (cc_bit_0 == 1) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xd9:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xda:
        // J@r @n

        if (cc_bit_0 == 1) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xdb:
        // IN @n

        a.assign(in8(read8(pc.getUnsigned() + (1))));
        computeFlags8(a.getUnsigned());
        pc.add(2);
        return 11;


        break;

      case 0xdc:
        // C@r @n

        if (cc_bit_0 == 1) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 11 + cycles;


        break;

      case 0xdd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xde:
        // SBI #@n

        a.assign(alu.sub_u8u8b(a, read8(pc.getUnsigned() + (1)), cc_bit_0));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(2);
        return 11;


        break;

      case 0xdf:
        // RST @r

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x18, -1));
        pc.add(1);
        return 11;


        break;

      case 0xe0:
        // RET @r

        if (cc_bit_2 == 0) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xe1:
        // POP @r

        hl.assign(read16(sp));
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        if (opcode == 0xf1) xferFlagsByteToCCBits();
        pc.add(1);
        return 10;


        break;

      case 0xe2:
        // J@r @n

        if (cc_bit_2 == 0) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xe3:
        // XTHL

        tmp16.assign(hl);
        hl.assign(read16(sp));
        write16(sp, tmp16);
        pc.add(1);
        return 18;


        break;

      case 0xe4:
        // C@r @n

        if (cc_bit_2 == 0) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 11 + cycles;


        break;

      case 0xe5:
        // PUSH @r

        if (opcode == 0xf5) xferCCBitsToFlagsByte();
        sp.assign(emf.Maths.sub_u16u16(sp, 2));
        write16(sp, hl);
        pc.add(1);
        return 10;


        break;

      case 0xe6:
        // ANI #@n

        a.assign(alu.and8(a, read8(pc.getUnsigned() + (1))));
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(2);
        return 7;


        break;

      case 0xe7:
        // RST @r

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x20, -1));
        pc.add(1);
        return 11;


        break;

      case 0xe8:
        // RET @r

        if (cc_bit_2 == 1) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xe9:
        // PCHL

        pc.assign(emf.Maths.add_u16u16(hl, -1));
        pc.add(1);
        return 5;


        break;

      case 0xea:
        // J@r @n

        if (cc_bit_2 == 1) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xeb:
        // XCHG

        tmp16.assign(hl);
        hl.assign(de);
        de.assign(tmp16);
        pc.add(1);
        return 5;


        break;

      case 0xec:
        // C@r @n

        if (cc_bit_2 == 1) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 11 + cycles;


        break;

      case 0xed:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xee:
        // XRA #@n

        a.assign(alu.xor8(a, read8(pc.getUnsigned() + (1))));
        clearFlagH();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(2);
        return 7;


        break;

      case 0xef:
        // RST @r

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x28, -1));
        pc.add(1);
        return 11;


        break;

      case 0xf0:
        // RET @r

        if (cc_bit_7 == 0) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xf1:
        // POP @r

        af.assign(read16(sp));
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        if (opcode == 0xf1) xferFlagsByteToCCBits();
        pc.add(1);
        return 10;


        break;

      case 0xf2:
        // J@r @n

        if (cc_bit_7 == 0) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xf3:
        // DI

        disableInterrupt();
        pc.add(1);
        return 4;


        break;

      case 0xf4:
        // C@r @n

        if (cc_bit_7 == 0) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 11 + cycles;


        break;

      case 0xf5:
        // PUSH @r

        if (opcode == 0xf5) xferCCBitsToFlagsByte();
        sp.assign(emf.Maths.sub_u16u16(sp, 2));
        write16(sp, af);
        pc.add(1);
        return 10;


        break;

      case 0xf6:
        // ORI #@n

        a.assign(alu.or8(a, read8(pc.getUnsigned() + (1))));
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(2);
        return 7;


        break;

      case 0xf7:
        // RST @r

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x30, -1));
        pc.add(1);
        return 11;


        break;

      case 0xf8:
        // RET @r

        if (cc_bit_7 == 1) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xf9:
        // SPHL

        sp.assign(hl);
        pc.add(1);
        return 5;


        break;

      case 0xfa:
        // J@r @n

        if (cc_bit_7 == 1) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xfb:
        // EI

        enableInterrupt();
        pc.add(1);
        return 4;


        break;

      case 0xfc:
        // C@r @n

        if (cc_bit_7 == 1) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 11 + cycles;


        break;

      case 0xfd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xfe:
        // CPI #@n

        tmp8.assign(alu.sub_u8u8b(a, read8(pc.getUnsigned() + (1))));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(2);
        return 7;


        break;

      case 0xff:
        // RST @r

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x38, -1));
        pc.add(1);
        return 11;


        break;

    } // hctiws
    return 1;
  }
  // importEmulatorALU
  // let assign(re ;
  // let write8 ;
  // let assign(em ;
  // let assign(a ;
  // let assign(a ;
  // let assign(r ;
  // let assign(a ;
  // let assign(al ;
  // let assign(r ;
  // let assign(em ;
  // let assign(a ;
  // let assign(a ;
  // let assign(r ;
  // let assign(a ;
  // let assign(re ;
  // let write8 ;
  // let assign(em ;
  // let assign(a ;
  // let assign(a ;
  // let assign(r ;
  // let assign(a ;
  // let assign(al ;
  // let assign(r ;
  // let assign(em ;
  // let assign(a ;
  // let assign(a ;
  // let assign(r ;
  // let assign(a ;
  // let assign(re ;
  // let write16 ;
  // let assign(em ;
  // let assign(a ;
  // let assign(a ;
  // let assign(r ;
  // let assign(a ;
  // let assign(al ;
  // let assign(re ;
  // let assign(em ;
  // let assign(a ;
  // let assign(a ;
  // let assign(r ;
  // let assign(a ;
  // let assign(re ;
  // let write8 ;
  // let assign(em ;
  // let write8 ;
  // let write8 ;
  // let write8 ;
  // let assign(al ;
  // let assign(r ;
  // let assign(em ;
  // let assign(a ;
  // let assign(a ;
  // let assign(r ;
  // let assign(b ;
  // let assign(c ;
  // let assign(d ;
  // let assign(e ;
  // let assign(h ;
  // let assign(l ;
  // let assign(r ;
  // let assign(a ;
  // let assign(b ;
  // let assign(c ;
  // let assign(d ;
  // let assign(e ;
  // let assign(h ;
  // let assign(l ;
  // let assign(r ;
  // let assign(a ;
  // let assign(b ;
  // let assign(c ;
  // let assign(d ;
  // let assign(e ;
  // let assign(h ;
  // let assign(l ;
  // let assign(r ;
  // let assign(a ;
  // let assign(b ;
  // let assign(c ;
  // let assign(d ;
  // let assign(e ;
  // let assign(h ;
  // let assign(l ;
  // let assign(r ;
  // let assign(a ;
  // let assign(b ;
  // let assign(c ;
  // let assign(d ;
  // let assign(e ;
  // let assign(h ;
  // let assign(l ;
  // let assign(r ;
  // let assign(a ;
  // let assign(b ;
  // let assign(c ;
  // let assign(d ;
  // let assign(e ;
  // let assign(h ;
  // let assign(l ;
  // let assign(r ;
  // let assign(a ;
  // let write8 ;
  // let write8 ;
  // let write8 ;
  // let write8 ;
  // let write8 ;
  // let write8 ;
  // let halt ;
  // let write8 ;
  // let assign(b ;
  // let assign(c ;
  // let assign(d ;
  // let assign(e ;
  // let assign(h ;
  // let assign(l ;
  // let assign(r ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(alu. ;
  // let assign(alu. ;
  // let assign(alu. ;
  // let assign(alu. ;
  // let assign(alu. ;
  // let assign(alu. ;
  // let assign(alu. ;
  // let assign(alu. ;
  // let assign(re ;
  // let assign(re ;
  // let assign(em ;
  // let xferFlagsByteToCCBits() ;
  // let assign(em ;
  // let assign(em ;
  // let assign(em ;
  // let xferCCBitsToFlagsByte() ;
  // let assign(em ;
  // let write16 ;
  // let assign(a ;
  // let assign(em ;
  // let write16 ;
  // let assign(em ;
  // let assign(re ;
  // let assign(re ;
  // let assign(em ;
  // let assign(em ;
  // let assign(em ;
  // let assign(em ;
  // let write16 ;
  // let assign(em ;
  // let assign(a ;
  // let assign(em ;
  // let write16 ;
  // let assign(em ;
  // let assign(re ;
  // let assign(re ;
  // let assign(em ;
  // let xferFlagsByteToCCBits() ;
  // let assign(em ;
  // let out8 ;
  // let assign(em ;
  // let xferCCBitsToFlagsByte() ;
  // let assign(em ;
  // let write16 ;
  // let assign(a ;
  // let assign(em ;
  // let write16 ;
  // let assign(em ;
  // let assign(re ;
  // let assign(em ;
  // let assign(i ;
  // let computeFlags8 ;
  // let assign(em ;
  // let assign(a ;
  // let assign(em ;
  // let write16 ;
  // let assign(em ;
  // let assign(re ;
  // let assign(re ;
  // let assign(em ;
  // let xferFlagsByteToCCBits() ;
  // let assign(em ;
  // let assign(hl) ;
  // let assign(re ;
  // let write16 ;
  // let assign(em ;
  // let xferCCBitsToFlagsByte() ;
  // let assign(em ;
  // let write16 ;
  // let assign(a ;
  // let assign(em ;
  // let write16 ;
  // let assign(em ;
  // let assign(re ;
  // let assign(em ;
  // let assign(em ;
  // let assign(hl) ;
  // let assign(de ;
  // let assign(tm ;
  // let assign(em ;
  // let assign(a ;
  // let assign(em ;
  // let write16 ;
  // let assign(em ;
  // let assign(re ;
  // let assign(re ;
  // let assign(em ;
  // let xferFlagsByteToCCBits() ;
  // let assign(em ;
  // let disableInterrupt ;
  // let assign(em ;
  // let xferCCBitsToFlagsByte() ;
  // let assign(em ;
  // let write16 ;
  // let assign(a ;
  // let assign(em ;
  // let write16 ;
  // let assign(em ;
  // let assign(re ;
  // let assign(hl ;
  // let assign(em ;
  // let enableInterrupt ;
  // let assign(em ;
  // let assign(alu. ;
  // let assign(em ;
  // let write16 ;
  // let assign(em ;

  /*
   **
   ** State
   **
   */
  function getState() {
    gsRegisterA.assign(getRegisterValueA());
    gsRegisterB.assign(getRegisterValueB());
    gsRegisterC.assign(getRegisterValueC());
    gsRegisterD.assign(getRegisterValueD());
    gsRegisterE.assign(getRegisterValueE());
    gsRegisterH.assign(getRegisterValueH());
    gsRegisterL.assign(getRegisterValueL());
    gsRegisterPC.assign(getRegisterValuePC());
    gsRegisterSP.assign(getRegisterValueSP());
    return {
      flags: {
        c: getFlagC(),
        b1: getFlagB1(),
        p: getFlagP(),
        v: getFlagV(),
        b3: getFlagB3(),
        h: getFlagH(),
        b5: getFlagB5(),
        z: getFlagZ(),
        s: getFlagS(),
      },

      registers: {
        a: gsRegisterA,
        b: gsRegisterB,
        c: gsRegisterC,
        d: gsRegisterD,
        e: gsRegisterE,
        h: gsRegisterH,
        l: gsRegisterL,
        pc: gsRegisterPC,
        sp: gsRegisterSP,
      },

      state: {
        isBigEndian: isBigEndian,
        inHalt: inHalt,
        interruptEnabled: interruptEnabled,
        wasNMIGenerated: wasNMIGenerated,
        wasIRQGenerated: wasIRQGenerated,
      },
    };
  }

  function setState(newState) {
    // registers:
    if (typeof newState.registers.a !== typeof undefined) {
      setRegisterValueA(newState.registers.a);
    }
    if (typeof newState.registers.b !== typeof undefined) {
      setRegisterValueB(newState.registers.b);
    }
    if (typeof newState.registers.c !== typeof undefined) {
      setRegisterValueC(newState.registers.c);
    }
    if (typeof newState.registers.d !== typeof undefined) {
      setRegisterValueD(newState.registers.d);
    }
    if (typeof newState.registers.e !== typeof undefined) {
      setRegisterValueE(newState.registers.e);
    }
    if (typeof newState.registers.h !== typeof undefined) {
      setRegisterValueH(newState.registers.h);
    }
    if (typeof newState.registers.l !== typeof undefined) {
      setRegisterValueL(newState.registers.l);
    }
    if (typeof newState.registers.pc !== typeof undefined) {
      setRegisterValuePC(newState.registers.pc);
    }
    if (typeof newState.registers.sp !== typeof undefined) {
      setRegisterValueSP(newState.registers.sp);
    }

    // Flags:
    if (typeof newState.flags.c !== typeof undefined) {
      changeFlagC(newState.flags.c);
    }
    if (typeof newState.flags.b1 !== typeof undefined) {
      changeFlagB1(newState.flags.b1);
    }
    if (typeof newState.flags.p !== typeof undefined) {
      changeFlagP(newState.flags.p);
    }
    if (typeof newState.flags.v !== typeof undefined) {
      changeFlagV(newState.flags.v);
    }
    if (typeof newState.flags.b3 !== typeof undefined) {
      changeFlagB3(newState.flags.b3);
    }
    if (typeof newState.flags.h !== typeof undefined) {
      changeFlagH(newState.flags.h);
    }
    if (typeof newState.flags.b5 !== typeof undefined) {
      changeFlagB5(newState.flags.b5);
    }
    if (typeof newState.flags.z !== typeof undefined) {
      changeFlagZ(newState.flags.z);
    }
    if (typeof newState.flags.s !== typeof undefined) {
      changeFlagS(newState.flags.s);
    }

    // state
    if (typeof newState.state.isBigEndian !== typeof undefined) {
      isBigEndian = newState.state.isBigEndian;
    }
    if (typeof newState.state.inHalt !== typeof undefined) {
      inHalt = newState.state.inHalt;
    }
    if (typeof newState.state.interruptEnabled !== typeof undefined) {
      interruptEnabled = newState.state.interruptEnabled;
    }
    if (typeof newState.state.wasNMIGenerated !== typeof undefined) {
      wasNMIGenerated = newState.state.wasNMIGenerated;
    }
    if (typeof newState.state.wasIRQGenerated !== typeof undefined) {
      wasIRQGenerated = newState.state.wasIRQGenerated;
    }
  }


  /*
   **
   ** Expose this API
   **
   */
  return {
    start,
    reset,
    update,
    getState,
    setState,
    getRegisterValueA,
    setRegisterValueA,
    getRegisterValueB,
    setRegisterValueB,
    getRegisterValueC,
    setRegisterValueC,
    getRegisterValueD,
    setRegisterValueD,
    getRegisterValueE,
    setRegisterValueE,
    getRegisterValueH,
    setRegisterValueH,
    getRegisterValueL,
    setRegisterValueL,
    getRegisterValuePC,
    setRegisterValuePC,
    getRegisterValueSP,
    setRegisterValueSP,
    getRegisterValue,
    setRegisterValue,
    setFlagValue,
  }
});