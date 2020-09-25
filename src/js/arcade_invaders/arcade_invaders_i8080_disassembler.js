// arcade_invaders_i8080_disassemble
let arcade_invaders_i8080_disassemble = (function(bus, options) {
  function disassemble(address) {
    return step(bus, address);
  }

  function getAddressText16(address) {
    let label = bus.memory.getLabel(address);
    if (label) {
      return label;
    }
    return emf.utils.hex16(address) + "H"
  }
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

  function start() {
    read8 = bus.memory.read8;
    read16 = bus.memory.read16;
  }

  function step(bus, addr) {
    var dis = new Object();
    dis.instruction = "Unknown opcode";
    dis.byte_length = 1;
    var instr; /* of type uint */
    let pc = new emf.Number(16, 2, addr);
    let opcode = read8(addr);

    switch (opcode) {
      case 0x0:
        // NOP

        dis.byte_length = 1;
        dis.instruction = "NOP";
        return dis;

        break;

      case 0x1:
        // LXI @r,@n

        dis.byte_length = 3;
        dis.instruction = "LXI bc," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0x2:
        // STAX BC

        dis.byte_length = 1;
        dis.instruction = "STAX BC";
        return dis;

        break;

      case 0x3:
        // INX @r

        dis.byte_length = 1;
        dis.instruction = "INX bc";
        return dis;

        break;

      case 0x4:
        // INR @r

        dis.byte_length = 1;
        dis.instruction = "INR b";
        return dis;

        break;

      case 0x5:
        // DCR @r

        dis.byte_length = 1;
        dis.instruction = "DCR b";
        return dis;

        break;

      case 0x6:
        // MVI @r, #@n

        dis.byte_length = 2;
        dis.instruction = "MVI b, #" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x7:
        // RLC

        dis.byte_length = 1;
        dis.instruction = "RLC";
        return dis;

        break;

      case 0x8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x08";
        return dis;
        break;

      case 0x9:
        // DAD @r

        dis.byte_length = 1;
        dis.instruction = "DAD bc";
        return dis;

        break;

      case 0xa:
        // LDAX (BC)

        dis.byte_length = 1;
        dis.instruction = "LDAX (BC)";
        return dis;

        break;

      case 0xb:
        // DCX @r

        dis.byte_length = 1;
        dis.instruction = "DCX bc";
        return dis;

        break;

      case 0xc:
        // INR @r

        dis.byte_length = 1;
        dis.instruction = "INR c";
        return dis;

        break;

      case 0xd:
        // DCR @r

        dis.byte_length = 1;
        dis.instruction = "DCR c";
        return dis;

        break;

      case 0xe:
        // MVI @r, #@n

        dis.byte_length = 2;
        dis.instruction = "MVI c, #" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xf:
        // RRC

        dis.byte_length = 1;
        dis.instruction = "RRC";
        return dis;

        break;

      case 0x10:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x10";
        return dis;
        break;

      case 0x11:
        // LXI @r,@n

        dis.byte_length = 3;
        dis.instruction = "LXI de," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0x12:
        // STAX DE

        dis.byte_length = 1;
        dis.instruction = "STAX DE";
        return dis;

        break;

      case 0x13:
        // INX @r

        dis.byte_length = 1;
        dis.instruction = "INX de";
        return dis;

        break;

      case 0x14:
        // INR @r

        dis.byte_length = 1;
        dis.instruction = "INR d";
        return dis;

        break;

      case 0x15:
        // DCR @r

        dis.byte_length = 1;
        dis.instruction = "DCR d";
        return dis;

        break;

      case 0x16:
        // MVI @r, #@n

        dis.byte_length = 2;
        dis.instruction = "MVI d, #" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x17:
        // RAL

        dis.byte_length = 1;
        dis.instruction = "RAL";
        return dis;

        break;

      case 0x18:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x18";
        return dis;
        break;

      case 0x19:
        // DAD @r

        dis.byte_length = 1;
        dis.instruction = "DAD de";
        return dis;

        break;

      case 0x1a:
        // LDAX DE

        dis.byte_length = 1;
        dis.instruction = "LDAX DE";
        return dis;

        break;

      case 0x1b:
        // DCX @r

        dis.byte_length = 1;
        dis.instruction = "DCX de";
        return dis;

        break;

      case 0x1c:
        // INR @r

        dis.byte_length = 1;
        dis.instruction = "INR e";
        return dis;

        break;

      case 0x1d:
        // DCR @r

        dis.byte_length = 1;
        dis.instruction = "DCR e";
        return dis;

        break;

      case 0x1e:
        // MVI @r, #@n

        dis.byte_length = 2;
        dis.instruction = "MVI e, #" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x1f:
        // RAR

        dis.byte_length = 1;
        dis.instruction = "RAR";
        return dis;

        break;

      case 0x20:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x20";
        return dis;
        break;

      case 0x21:
        // LXI @r,@n

        dis.byte_length = 3;
        dis.instruction = "LXI hl," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0x22:
        // SHLD @n

        dis.byte_length = 3;
        dis.instruction = "SHLD " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0x23:
        // INX @r

        dis.byte_length = 1;
        dis.instruction = "INX hl";
        return dis;

        break;

      case 0x24:
        // INR @r

        dis.byte_length = 1;
        dis.instruction = "INR h";
        return dis;

        break;

      case 0x25:
        // DCR @r

        dis.byte_length = 1;
        dis.instruction = "DCR h";
        return dis;

        break;

      case 0x26:
        // MVI @r, #@n

        dis.byte_length = 2;
        dis.instruction = "MVI h, #" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x27:
        // DAA

        dis.byte_length = 1;
        dis.instruction = "DAA";
        return dis;

        break;

      case 0x28:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x28";
        return dis;
        break;

      case 0x29:
        // DAD @r

        dis.byte_length = 1;
        dis.instruction = "DAD hl";
        return dis;

        break;

      case 0x2a:
        // LHLD @n

        dis.byte_length = 3;
        dis.instruction = "LHLD " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0x2b:
        // DCX @r

        dis.byte_length = 1;
        dis.instruction = "DCX hl";
        return dis;

        break;

      case 0x2c:
        // INR @r

        dis.byte_length = 1;
        dis.instruction = "INR l";
        return dis;

        break;

      case 0x2d:
        // DCR @r

        dis.byte_length = 1;
        dis.instruction = "DCR l";
        return dis;

        break;

      case 0x2e:
        // MVI @r, #@n

        dis.byte_length = 2;
        dis.instruction = "MVI l, #" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x2f:
        // CMA

        dis.byte_length = 1;
        dis.instruction = "CMA";
        return dis;

        break;

      case 0x30:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x30";
        return dis;
        break;

      case 0x31:
        // LXI @r,@n

        dis.byte_length = 3;
        dis.instruction = "LXI sp," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0x32:
        // STA @n

        dis.byte_length = 3;
        dis.instruction = "STA " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0x33:
        // INX @r

        dis.byte_length = 1;
        dis.instruction = "INX sp";
        return dis;

        break;

      case 0x34:
        // INR @r
        // INR (HL)

        dis.byte_length = 1;
        dis.instruction = "INR (HL)";
        return dis;

        break;

      case 0x35:
        // DCR @r
        // DCR (HL)

        dis.byte_length = 1;
        dis.instruction = "DCR (HL)";
        return dis;

        break;

      case 0x36:
        // MVI @r, #@n
        // LD (HL),@n

        dis.byte_length = 2;
        dis.instruction = "LD (HL)," + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x37:
        // STC

        dis.byte_length = 1;
        dis.instruction = "STC";
        return dis;

        break;

      case 0x38:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x38";
        return dis;
        break;

      case 0x39:
        // DAD @r

        dis.byte_length = 1;
        dis.instruction = "DAD sp";
        return dis;

        break;

      case 0x3a:
        // LDA @n

        dis.byte_length = 3;
        dis.instruction = "LDA " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0x3b:
        // DCX @r

        dis.byte_length = 1;
        dis.instruction = "DCX sp";
        return dis;

        break;

      case 0x3c:
        // INR @r

        dis.byte_length = 1;
        dis.instruction = "INR a";
        return dis;

        break;

      case 0x3d:
        // DCR @r

        dis.byte_length = 1;
        dis.instruction = "DCR a";
        return dis;

        break;

      case 0x3e:
        // MVI @r, #@n

        dis.byte_length = 2;
        dis.instruction = "MVI a, #" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x3f:
        // CMC

        dis.byte_length = 1;
        dis.instruction = "CMC";
        return dis;

        break;

      case 0x40:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV b,b";
        return dis;

        break;

      case 0x41:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV b,c";
        return dis;

        break;

      case 0x42:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV b,d";
        return dis;

        break;

      case 0x43:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV b,e";
        return dis;

        break;

      case 0x44:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV b,h";
        return dis;

        break;

      case 0x45:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV b,l";
        return dis;

        break;

      case 0x46:
        // MOV @r,@s
        // MOV @r,(HL)

        dis.byte_length = 1;
        dis.instruction = "MOV b,(HL)";
        return dis;

        break;

      case 0x47:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV b,a";
        return dis;

        break;

      case 0x48:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV c,b";
        return dis;

        break;

      case 0x49:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV c,c";
        return dis;

        break;

      case 0x4a:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV c,d";
        return dis;

        break;

      case 0x4b:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV c,e";
        return dis;

        break;

      case 0x4c:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV c,h";
        return dis;

        break;

      case 0x4d:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV c,l";
        return dis;

        break;

      case 0x4e:
        // MOV @r,@s
        // MOV @r,(HL)

        dis.byte_length = 1;
        dis.instruction = "MOV c,(HL)";
        return dis;

        break;

      case 0x4f:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV c,a";
        return dis;

        break;

      case 0x50:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV d,b";
        return dis;

        break;

      case 0x51:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV d,c";
        return dis;

        break;

      case 0x52:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV d,d";
        return dis;

        break;

      case 0x53:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV d,e";
        return dis;

        break;

      case 0x54:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV d,h";
        return dis;

        break;

      case 0x55:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV d,l";
        return dis;

        break;

      case 0x56:
        // MOV @r,@s
        // MOV @r,(HL)

        dis.byte_length = 1;
        dis.instruction = "MOV d,(HL)";
        return dis;

        break;

      case 0x57:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV d,a";
        return dis;

        break;

      case 0x58:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV e,b";
        return dis;

        break;

      case 0x59:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV e,c";
        return dis;

        break;

      case 0x5a:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV e,d";
        return dis;

        break;

      case 0x5b:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV e,e";
        return dis;

        break;

      case 0x5c:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV e,h";
        return dis;

        break;

      case 0x5d:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV e,l";
        return dis;

        break;

      case 0x5e:
        // MOV @r,@s
        // MOV @r,(HL)

        dis.byte_length = 1;
        dis.instruction = "MOV e,(HL)";
        return dis;

        break;

      case 0x5f:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV e,a";
        return dis;

        break;

      case 0x60:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV h,b";
        return dis;

        break;

      case 0x61:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV h,c";
        return dis;

        break;

      case 0x62:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV h,d";
        return dis;

        break;

      case 0x63:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV h,e";
        return dis;

        break;

      case 0x64:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV h,h";
        return dis;

        break;

      case 0x65:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV h,l";
        return dis;

        break;

      case 0x66:
        // MOV @r,@s
        // MOV @r,(HL)

        dis.byte_length = 1;
        dis.instruction = "MOV h,(HL)";
        return dis;

        break;

      case 0x67:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV h,a";
        return dis;

        break;

      case 0x68:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV l,b";
        return dis;

        break;

      case 0x69:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV l,c";
        return dis;

        break;

      case 0x6a:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV l,d";
        return dis;

        break;

      case 0x6b:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV l,e";
        return dis;

        break;

      case 0x6c:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV l,h";
        return dis;

        break;

      case 0x6d:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV l,l";
        return dis;

        break;

      case 0x6e:
        // MOV @r,@s
        // MOV @r,(HL)

        dis.byte_length = 1;
        dis.instruction = "MOV l,(HL)";
        return dis;

        break;

      case 0x6f:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV l,a";
        return dis;

        break;

      case 0x70:
        // MOV @r,@s
        // MOV (HL),@r

        dis.byte_length = 1;
        dis.instruction = "MOV (HL),b";
        return dis;

        break;

      case 0x71:
        // MOV @r,@s
        // MOV (HL),@r

        dis.byte_length = 1;
        dis.instruction = "MOV (HL),c";
        return dis;

        break;

      case 0x72:
        // MOV @r,@s
        // MOV (HL),@r

        dis.byte_length = 1;
        dis.instruction = "MOV (HL),d";
        return dis;

        break;

      case 0x73:
        // MOV @r,@s
        // MOV (HL),@r

        dis.byte_length = 1;
        dis.instruction = "MOV (HL),e";
        return dis;

        break;

      case 0x74:
        // MOV @r,@s
        // MOV (HL),@r

        dis.byte_length = 1;
        dis.instruction = "MOV (HL),h";
        return dis;

        break;

      case 0x75:
        // MOV @r,@s
        // MOV (HL),@r

        dis.byte_length = 1;
        dis.instruction = "MOV (HL),l";
        return dis;

        break;

      case 0x76:
        // MOV @r,@s
        // MOV @r,(HL)
        // MOV (HL),@r
        // HALT

        dis.byte_length = 1;
        dis.instruction = "HALT";
        return dis;

        break;

      case 0x77:
        // MOV @r,@s
        // MOV (HL),@r

        dis.byte_length = 1;
        dis.instruction = "MOV (HL),a";
        return dis;

        break;

      case 0x78:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV a,b";
        return dis;

        break;

      case 0x79:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV a,c";
        return dis;

        break;

      case 0x7a:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV a,d";
        return dis;

        break;

      case 0x7b:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV a,e";
        return dis;

        break;

      case 0x7c:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV a,h";
        return dis;

        break;

      case 0x7d:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV a,l";
        return dis;

        break;

      case 0x7e:
        // MOV @r,@s
        // MOV @r,(HL)

        dis.byte_length = 1;
        dis.instruction = "MOV a,(HL)";
        return dis;

        break;

      case 0x7f:
        // MOV @r,@s

        dis.byte_length = 1;
        dis.instruction = "MOV a,a";
        return dis;

        break;

      case 0x80:
        // ADD @r

        dis.byte_length = 1;
        dis.instruction = "ADD b";
        return dis;

        break;

      case 0x81:
        // ADD @r

        dis.byte_length = 1;
        dis.instruction = "ADD c";
        return dis;

        break;

      case 0x82:
        // ADD @r

        dis.byte_length = 1;
        dis.instruction = "ADD d";
        return dis;

        break;

      case 0x83:
        // ADD @r

        dis.byte_length = 1;
        dis.instruction = "ADD e";
        return dis;

        break;

      case 0x84:
        // ADD @r

        dis.byte_length = 1;
        dis.instruction = "ADD h";
        return dis;

        break;

      case 0x85:
        // ADD @r

        dis.byte_length = 1;
        dis.instruction = "ADD l";
        return dis;

        break;

      case 0x86:
        // ADD @r
        // ADD (HL)

        dis.byte_length = 1;
        dis.instruction = "ADD (HL)";
        return dis;

        break;

      case 0x87:
        // ADD @r

        dis.byte_length = 1;
        dis.instruction = "ADD a";
        return dis;

        break;

      case 0x88:
        // ADC @r

        dis.byte_length = 1;
        dis.instruction = "ADC b";
        return dis;

        break;

      case 0x89:
        // ADC @r

        dis.byte_length = 1;
        dis.instruction = "ADC c";
        return dis;

        break;

      case 0x8a:
        // ADC @r

        dis.byte_length = 1;
        dis.instruction = "ADC d";
        return dis;

        break;

      case 0x8b:
        // ADC @r

        dis.byte_length = 1;
        dis.instruction = "ADC e";
        return dis;

        break;

      case 0x8c:
        // ADC @r

        dis.byte_length = 1;
        dis.instruction = "ADC h";
        return dis;

        break;

      case 0x8d:
        // ADC @r

        dis.byte_length = 1;
        dis.instruction = "ADC l";
        return dis;

        break;

      case 0x8e:
        // ADC @r
        // ADC (HL)

        dis.byte_length = 1;
        dis.instruction = "ADC (HL)";
        return dis;

        break;

      case 0x8f:
        // ADC @r

        dis.byte_length = 1;
        dis.instruction = "ADC a";
        return dis;

        break;

      case 0x90:
        // SUB @r

        dis.byte_length = 1;
        dis.instruction = "SUB b";
        return dis;

        break;

      case 0x91:
        // SUB @r

        dis.byte_length = 1;
        dis.instruction = "SUB c";
        return dis;

        break;

      case 0x92:
        // SUB @r

        dis.byte_length = 1;
        dis.instruction = "SUB d";
        return dis;

        break;

      case 0x93:
        // SUB @r

        dis.byte_length = 1;
        dis.instruction = "SUB e";
        return dis;

        break;

      case 0x94:
        // SUB @r

        dis.byte_length = 1;
        dis.instruction = "SUB h";
        return dis;

        break;

      case 0x95:
        // SUB @r

        dis.byte_length = 1;
        dis.instruction = "SUB l";
        return dis;

        break;

      case 0x96:
        // SUB @r
        // SUB (HL)

        dis.byte_length = 1;
        dis.instruction = "SUB (HL)";
        return dis;

        break;

      case 0x97:
        // SUB @r

        dis.byte_length = 1;
        dis.instruction = "SUB a";
        return dis;

        break;

      case 0x98:
        // SBB @r

        dis.byte_length = 1;
        dis.instruction = "SBB b";
        return dis;

        break;

      case 0x99:
        // SBB @r

        dis.byte_length = 1;
        dis.instruction = "SBB c";
        return dis;

        break;

      case 0x9a:
        // SBB @r

        dis.byte_length = 1;
        dis.instruction = "SBB d";
        return dis;

        break;

      case 0x9b:
        // SBB @r

        dis.byte_length = 1;
        dis.instruction = "SBB e";
        return dis;

        break;

      case 0x9c:
        // SBB @r

        dis.byte_length = 1;
        dis.instruction = "SBB h";
        return dis;

        break;

      case 0x9d:
        // SBB @r

        dis.byte_length = 1;
        dis.instruction = "SBB l";
        return dis;

        break;

      case 0x9e:
        // SBB @r
        // SBB A,(HL)

        dis.byte_length = 1;
        dis.instruction = "SBB A,(HL)";
        return dis;

        break;

      case 0x9f:
        // SBB @r

        dis.byte_length = 1;
        dis.instruction = "SBB a";
        return dis;

        break;

      case 0xa0:
        // ANA @r

        dis.byte_length = 1;
        dis.instruction = "ANA b";
        return dis;

        break;

      case 0xa1:
        // ANA @r

        dis.byte_length = 1;
        dis.instruction = "ANA c";
        return dis;

        break;

      case 0xa2:
        // ANA @r

        dis.byte_length = 1;
        dis.instruction = "ANA d";
        return dis;

        break;

      case 0xa3:
        // ANA @r

        dis.byte_length = 1;
        dis.instruction = "ANA e";
        return dis;

        break;

      case 0xa4:
        // ANA @r

        dis.byte_length = 1;
        dis.instruction = "ANA h";
        return dis;

        break;

      case 0xa5:
        // ANA @r

        dis.byte_length = 1;
        dis.instruction = "ANA l";
        return dis;

        break;

      case 0xa6:
        // ANA @r
        // ANA (HL)

        dis.byte_length = 1;
        dis.instruction = "ANA (HL)";
        return dis;

        break;

      case 0xa7:
        // ANA @r

        dis.byte_length = 1;
        dis.instruction = "ANA a";
        return dis;

        break;

      case 0xa8:
        // XRA @r

        dis.byte_length = 1;
        dis.instruction = "XRA b";
        return dis;

        break;

      case 0xa9:
        // XRA @r

        dis.byte_length = 1;
        dis.instruction = "XRA c";
        return dis;

        break;

      case 0xaa:
        // XRA @r

        dis.byte_length = 1;
        dis.instruction = "XRA d";
        return dis;

        break;

      case 0xab:
        // XRA @r

        dis.byte_length = 1;
        dis.instruction = "XRA e";
        return dis;

        break;

      case 0xac:
        // XRA @r

        dis.byte_length = 1;
        dis.instruction = "XRA h";
        return dis;

        break;

      case 0xad:
        // XRA @r

        dis.byte_length = 1;
        dis.instruction = "XRA l";
        return dis;

        break;

      case 0xae:
        // XRA @r
        // XRA (HL)

        dis.byte_length = 1;
        dis.instruction = "XRA (HL)";
        return dis;

        break;

      case 0xaf:
        // XRA @r

        dis.byte_length = 1;
        dis.instruction = "XRA a";
        return dis;

        break;

      case 0xb0:
        // ORA @r

        dis.byte_length = 1;
        dis.instruction = "ORA b";
        return dis;

        break;

      case 0xb1:
        // ORA @r

        dis.byte_length = 1;
        dis.instruction = "ORA c";
        return dis;

        break;

      case 0xb2:
        // ORA @r

        dis.byte_length = 1;
        dis.instruction = "ORA d";
        return dis;

        break;

      case 0xb3:
        // ORA @r

        dis.byte_length = 1;
        dis.instruction = "ORA e";
        return dis;

        break;

      case 0xb4:
        // ORA @r

        dis.byte_length = 1;
        dis.instruction = "ORA h";
        return dis;

        break;

      case 0xb5:
        // ORA @r

        dis.byte_length = 1;
        dis.instruction = "ORA l";
        return dis;

        break;

      case 0xb6:
        // ORA @r
        // ORA (HL)

        dis.byte_length = 1;
        dis.instruction = "ORA (HL)";
        return dis;

        break;

      case 0xb7:
        // ORA @r

        dis.byte_length = 1;
        dis.instruction = "ORA a";
        return dis;

        break;

      case 0xb8:
        // CMP @r

        dis.byte_length = 1;
        dis.instruction = "CMP b";
        return dis;

        break;

      case 0xb9:
        // CMP @r

        dis.byte_length = 1;
        dis.instruction = "CMP c";
        return dis;

        break;

      case 0xba:
        // CMP @r

        dis.byte_length = 1;
        dis.instruction = "CMP d";
        return dis;

        break;

      case 0xbb:
        // CMP @r

        dis.byte_length = 1;
        dis.instruction = "CMP e";
        return dis;

        break;

      case 0xbc:
        // CMP @r

        dis.byte_length = 1;
        dis.instruction = "CMP h";
        return dis;

        break;

      case 0xbd:
        // CMP @r

        dis.byte_length = 1;
        dis.instruction = "CMP l";
        return dis;

        break;

      case 0xbe:
        // CMP @r
        // CMP (HL)

        dis.byte_length = 1;
        dis.instruction = "CMP (HL)";
        return dis;

        break;

      case 0xbf:
        // CMP @r

        dis.byte_length = 1;
        dis.instruction = "CMP a";
        return dis;

        break;

      case 0xc0:
        // RET @r

        dis.byte_length = 1;
        dis.instruction = "RET nz";
        return dis;

        break;

      case 0xc1:
        // POP @r

        dis.byte_length = 1;
        dis.instruction = "POP bc";
        return dis;

        break;

      case 0xc2:
        // J@r @n

        dis.byte_length = 3;
        dis.instruction = "Jnz " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xc3:
        // JMP @n

        dis.byte_length = 3;
        dis.instruction = "JMP " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xc4:
        // C@r @n

        dis.byte_length = 3;
        dis.instruction = "Cnz " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xc5:
        // PUSH @r

        dis.byte_length = 1;
        dis.instruction = "PUSH bc";
        return dis;

        break;

      case 0xc6:
        // ADI @n

        dis.byte_length = 2;
        dis.instruction = "ADI " + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xc7:
        // RST @r

        dis.byte_length = 1;
        dis.instruction = "RST 0x00";
        return dis;

        break;

      case 0xc8:
        // RET @r

        dis.byte_length = 1;
        dis.instruction = "RET z";
        return dis;

        break;

      case 0xc9:
        // RET

        dis.byte_length = 1;
        dis.instruction = "RET";
        return dis;

        break;

      case 0xca:
        // J@r @n

        dis.byte_length = 3;
        dis.instruction = "Jz " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xcb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xcb";
        return dis;
        break;

      case 0xcc:
        // C@r @n

        dis.byte_length = 3;
        dis.instruction = "Cz " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xcd:
        // CALL @n

        dis.byte_length = 3;
        dis.instruction = "CALL " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xce:
        // ACI #@n

        dis.byte_length = 2;
        dis.instruction = "ACI #" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xcf:
        // RST @r

        dis.byte_length = 1;
        dis.instruction = "RST 0x08";
        return dis;

        break;

      case 0xd0:
        // RET @r

        dis.byte_length = 1;
        dis.instruction = "RET nc";
        return dis;

        break;

      case 0xd1:
        // POP @r

        dis.byte_length = 1;
        dis.instruction = "POP de";
        return dis;

        break;

      case 0xd2:
        // J@r @n

        dis.byte_length = 3;
        dis.instruction = "Jnc " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xd3:
        // OUT @n

        dis.byte_length = 2;
        dis.instruction = "OUT " + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xd4:
        // C@r @n

        dis.byte_length = 3;
        dis.instruction = "Cnc " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xd5:
        // PUSH @r

        dis.byte_length = 1;
        dis.instruction = "PUSH de";
        return dis;

        break;

      case 0xd6:
        // SUI #@n

        dis.byte_length = 2;
        dis.instruction = "SUI #" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xd7:
        // RST @r

        dis.byte_length = 1;
        dis.instruction = "RST 0x10";
        return dis;

        break;

      case 0xd8:
        // RET @r

        dis.byte_length = 1;
        dis.instruction = "RET c";
        return dis;

        break;

      case 0xd9:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd9";
        return dis;
        break;

      case 0xda:
        // J@r @n

        dis.byte_length = 3;
        dis.instruction = "Jc " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xdb:
        // IN @n

        dis.byte_length = 2;
        dis.instruction = "IN " + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xdc:
        // C@r @n

        dis.byte_length = 3;
        dis.instruction = "Cc " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xdd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xdd";
        return dis;
        break;

      case 0xde:
        // SBI #@n

        dis.byte_length = 2;
        dis.instruction = "SBI #" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xdf:
        // RST @r

        dis.byte_length = 1;
        dis.instruction = "RST 0x18";
        return dis;

        break;

      case 0xe0:
        // RET @r

        dis.byte_length = 1;
        dis.instruction = "RET po";
        return dis;

        break;

      case 0xe1:
        // POP @r

        dis.byte_length = 1;
        dis.instruction = "POP hl";
        return dis;

        break;

      case 0xe2:
        // J@r @n

        dis.byte_length = 3;
        dis.instruction = "Jpo " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xe3:
        // XTHL

        dis.byte_length = 1;
        dis.instruction = "XTHL";
        return dis;

        break;

      case 0xe4:
        // C@r @n

        dis.byte_length = 3;
        dis.instruction = "Cpo " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xe5:
        // PUSH @r

        dis.byte_length = 1;
        dis.instruction = "PUSH hl";
        return dis;

        break;

      case 0xe6:
        // ANI #@n

        dis.byte_length = 2;
        dis.instruction = "ANI #" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xe7:
        // RST @r

        dis.byte_length = 1;
        dis.instruction = "RST 0x20";
        return dis;

        break;

      case 0xe8:
        // RET @r

        dis.byte_length = 1;
        dis.instruction = "RET pe";
        return dis;

        break;

      case 0xe9:
        // PCHL

        dis.byte_length = 1;
        dis.instruction = "PCHL";
        return dis;

        break;

      case 0xea:
        // J@r @n

        dis.byte_length = 3;
        dis.instruction = "Jpe " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xeb:
        // XCHG

        dis.byte_length = 1;
        dis.instruction = "XCHG";
        return dis;

        break;

      case 0xec:
        // C@r @n

        dis.byte_length = 3;
        dis.instruction = "Cpe " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xed:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xed";
        return dis;
        break;

      case 0xee:
        // XRA #@n

        dis.byte_length = 2;
        dis.instruction = "XRA #" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xef:
        // RST @r

        dis.byte_length = 1;
        dis.instruction = "RST 0x28";
        return dis;

        break;

      case 0xf0:
        // RET @r

        dis.byte_length = 1;
        dis.instruction = "RET p";
        return dis;

        break;

      case 0xf1:
        // POP @r

        dis.byte_length = 1;
        dis.instruction = "POP af";
        return dis;

        break;

      case 0xf2:
        // J@r @n

        dis.byte_length = 3;
        dis.instruction = "Jp " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xf3:
        // DI

        dis.byte_length = 1;
        dis.instruction = "DI";
        return dis;

        break;

      case 0xf4:
        // C@r @n

        dis.byte_length = 3;
        dis.instruction = "Cp " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xf5:
        // PUSH @r

        dis.byte_length = 1;
        dis.instruction = "PUSH af";
        return dis;

        break;

      case 0xf6:
        // ORI #@n

        dis.byte_length = 2;
        dis.instruction = "ORI #" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xf7:
        // RST @r

        dis.byte_length = 1;
        dis.instruction = "RST 0x30";
        return dis;

        break;

      case 0xf8:
        // RET @r

        dis.byte_length = 1;
        dis.instruction = "RET m";
        return dis;

        break;

      case 0xf9:
        // SPHL

        dis.byte_length = 1;
        dis.instruction = "SPHL";
        return dis;

        break;

      case 0xfa:
        // J@r @n

        dis.byte_length = 3;
        dis.instruction = "Jm " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xfb:
        // EI

        dis.byte_length = 1;
        dis.instruction = "EI";
        return dis;

        break;

      case 0xfc:
        // C@r @n

        dis.byte_length = 3;
        dis.instruction = "Cm " + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xfd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfd";
        return dis;
        break;

      case 0xfe:
        // CPI #@n

        dis.byte_length = 2;
        dis.instruction = "CPI #" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xff:
        // RST @r

        dis.byte_length = 1;
        dis.instruction = "RST 0x38";
        return dis;

        break;

    } // hctiws
    return dis;
  }
  return {
    start,
    disassemble
  }
});