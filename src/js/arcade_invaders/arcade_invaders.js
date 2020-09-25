/*
 **
 ** EMF Machine : auto-gen : arcade_invaders
 **
 */
function emfarcade_invaders(options) {
  options = options || {};
  options.cpu = options.cpu || {};
  options.cpu.directMemory = typeof options.cpu.directMemory === typeof undefined ? true : options.cpu.directMemory
  options.cpu.directIORQ = typeof options.cpu.directIORQ === typeof undefined ? true : options.cpu.directIORQ
  options.cpu.directFetch = typeof options.cpu.directFetch === typeof undefined ? true : options.cpu.directFetch
  options.memory = options.memory || {};
  // 

  /*
   **
   ** Create the machine
   **
   */
  let m = {};
  m.name = "arcade_invaders";
  m.description = "";

  /*
   **
   ** Create the bus
   **
   */
  m.bus = new emf.bus({
    reset: function() {
      m.bus.setHigh('int');
      m.bus.setHigh('vidint');
      m.bus.setHigh('reset');
    }
  });

  /*
   **
   ** Add everything in the device object
   **
   */
  m.device = {};
  m.device.cpu = {};
  m.device.cpu.name = "i8080";
  m.device.cpu.getState = function() {
    let state = m.device.cpu.emulate.getState();
    Object.keys(state.registers).map((r) => state.registers[r] = state.registers[r].getUnsigned());
    return state;
  }
  m.device.cpu.setState = function(json) {
    return m.device.cpu.emulate.setState(json);
  }
  m.device.cpu.emulate = new arcade_invaders_i8080_emulator(m.bus, options.cpu);
  m.device.cpu.disassemble = new arcade_invaders_i8080_disassemble(m.bus, options.cpu);
  m.device.cpu.assemble = new arcade_invaders_i8080_assemble(m.bus, options.cpu);
  m.device.memory = new arcade_invaders_memory(m.bus, options.memory);
  m.device.display = new arcade_invaders_display(m.bus, options.display);
  m.device.iorq = new arcade_invaders_iorq(m.bus, options.iorq);
  m.device.vidint = new arcade_invaders_vidint(m.bus, options.vidint);

  /*
   **
   ** Attach devices to the bus
   **
   */
  m.bus.cpu = m.device.cpu;
  m.bus.memory = m.device.memory;
  m.bus.display = m.device.display;
  m.bus.iorq = m.device.iorq;
  m.bus.vidint = m.device.vidint;

  /*
   **
   ** State
   **
   */
  m.state = {};
  m.state.cpu = {};
  m.state.display = {};
  m.state.iorq = {};
  m.state.vidint = {};

  /*
   **
   ** Clocks
   **
   */
  m.bus.clock = {};
  m.clock = {};
  m.clock.cpu = new arcade_invaders_clock_cpu(m, options);
  m.bus.clock.cpu = m.clock.cpu;
  m.clock.timer = new arcade_invaders_clock_timer(m, options);
  m.bus.clock.timer = m.clock.timer;

  /*
   **
   ** Construction complete - initialisation methods
   **
   */
  m.start = function() {
    let processed = {};
    m.bus.reset();
    if (m.bus.cpu.emulate.start) processed.cpu = m.bus.cpu.emulate.start(m.bus.cpu, arguments);
    if (m.bus.cpu.disassemble.start) processed.cpu = m.bus.cpu.disassemble.start(m.bus.cpu, arguments);
    if (m.bus.cpu.assemble.start) processed.cpu = m.bus.cpu.assemble.start(m.bus.cpu, arguments);
    if (m.bus.memory.start) processed.memory = m.bus.memory.start(m.bus.memory, arguments);
    if (m.bus.display.start) processed.display = m.bus.display.start(m.bus.display, arguments);
    if (m.bus.iorq.start) processed.iorq = m.bus.iorq.start(m.bus.iorq, arguments);
    if (m.bus.vidint.start) processed.vidint = m.bus.vidint.start(m.bus.vidint, arguments);
    if (m.clock.cpu.start) m.clock.cpu.start(m.clock.cpu, arguments);
    if (m.clock.timer.start) m.clock.timer.start(m.clock.timer, arguments);
    return processed;
  };
  m.reset = function() {
    let processed = {};
    m.bus.reset();
    if (m.bus.cpu.emulate.reset) processed.cpu = m.bus.cpu.emulate.reset(m.bus.cpu, arguments);
    if (m.bus.cpu.disassemble.reset) processed.cpu = m.bus.cpu.disassemble.reset(m.bus.cpu, arguments);
    if (m.bus.cpu.assemble.reset) processed.cpu = m.bus.cpu.assemble.reset(m.bus.cpu, arguments);
    if (m.bus.memory.reset) processed.memory = m.bus.memory.reset(m.bus.memory, arguments);
    if (m.bus.display.reset) processed.display = m.bus.display.reset(m.bus.display, arguments);
    if (m.bus.iorq.reset) processed.iorq = m.bus.iorq.reset(m.bus.iorq, arguments);
    if (m.bus.vidint.reset) processed.vidint = m.bus.vidint.reset(m.bus.vidint, arguments);
    if (m.clock.cpu.reset) m.clock.cpu.reset(m.clock.cpu, arguments);
    if (m.clock.timer.reset) m.clock.timer.reset(m.clock.timer, arguments);
    return processed;
  };
  m.getState = function() {
    let processed = {};
    if (m.bus.cpu.emulate.getState) processed.cpu = m.bus.cpu.emulate.getState(m.bus.cpu, arguments);
    if (m.bus.cpu.disassemble.getState) processed.cpu = m.bus.cpu.disassemble.getState(m.bus.cpu, arguments);
    if (m.bus.cpu.assemble.getState) processed.cpu = m.bus.cpu.assemble.getState(m.bus.cpu, arguments);
    if (m.bus.memory.getState) processed.memory = m.bus.memory.getState(m.bus.memory, arguments);
    if (m.bus.display.getState) processed.display = m.bus.display.getState(m.bus.display, arguments);
    if (m.bus.iorq.getState) processed.iorq = m.bus.iorq.getState(m.bus.iorq, arguments);
    if (m.bus.vidint.getState) processed.vidint = m.bus.vidint.getState(m.bus.vidint, arguments);
    if (m.clock.cpu.getState) m.clock.cpu.getState(m.clock.cpu, arguments);
    if (m.clock.timer.getState) m.clock.timer.getState(m.clock.timer, arguments);
    return processed;
  };
  m.setState = function() {
    let processed = {};
    if (m.bus.cpu.emulate.setState) processed.cpu = m.bus.cpu.emulate.setState(m.bus.cpu, arguments);
    if (m.bus.cpu.disassemble.setState) processed.cpu = m.bus.cpu.disassemble.setState(m.bus.cpu, arguments);
    if (m.bus.cpu.assemble.setState) processed.cpu = m.bus.cpu.assemble.setState(m.bus.cpu, arguments);
    if (m.bus.memory.setState) processed.memory = m.bus.memory.setState(m.bus.memory, arguments);
    if (m.bus.display.setState) processed.display = m.bus.display.setState(m.bus.display, arguments);
    if (m.bus.iorq.setState) processed.iorq = m.bus.iorq.setState(m.bus.iorq, arguments);
    if (m.bus.vidint.setState) processed.vidint = m.bus.vidint.setState(m.bus.vidint, arguments);
    if (m.clock.cpu.setState) m.clock.cpu.setState(m.clock.cpu, arguments);
    if (m.clock.timer.setState) m.clock.timer.setState(m.clock.timer, arguments);
    return processed;
  };
  m.update = function(how) {
    let processed = {};
    processed.cpu = m.device.cpu.emulate.update(how);
    return processed;
  };


  /*
   **
   ** Device-specific options - essentially globals
   **
   */
  m.options = {};
  m.options.disassemble = {};
  m.options.disassemble.widthColumnHex = 12;
  m.options.disassemble.widthColumnInstruction = 14;

  return m;
}