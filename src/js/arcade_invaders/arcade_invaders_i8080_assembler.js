// arcade_invaders_i8080_assemble
let arcade_invaders_i8080_assemble = (function(bus, options) {
  let equateMap = {};
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
   ** Equates table
   **
   */
  function clearEquateMap() {
    equateMap = {};
  }

  function setEquateValue(name, value) {
    name = name.toLowerCase();
    equateMap[name] = value;
  }

  function getEquateValue(name) {
    name = name.toLowerCase();
    return equateMap[name];
  }

  function getEquateMap(n) {
    return equateMap;
  }


  /*
   **
   ** The real work...
   **
   */
  function start() {
    read8 = bus.memory.read8;
    read16 = bus.memory.read16;
  }

  function assemble(str) {
    let pattern = null;
    let matched;
    let pc = new emf.Number(16); // TODO: Remove the need for this
    // NOP

    if ((matched = str.match(/NOP/i)) != null) {
      let rt = {
        pattern: "00000000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LXI @r,@n

    if ((matched = str.match(/LXI\s+bc\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00000001nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // STAX BC

    if ((matched = str.match(/STAX\s+BC/i)) != null) {
      let rt = {
        pattern: "00000010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INX @r

    if ((matched = str.match(/INX\s+bc/i)) != null) {
      let rt = {
        pattern: "00000011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INR @r

    if ((matched = str.match(/INR\s+b/i)) != null) {
      let rt = {
        pattern: "00000100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DCR @r

    if ((matched = str.match(/DCR\s+b/i)) != null) {
      let rt = {
        pattern: "00000101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MVI @r, #@n

    if ((matched = str.match(/MVI\s+b\s*,\s*\s+#(\w+)/i)) != null) {
      let rt = {
        pattern: "00000110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RLC

    if ((matched = str.match(/RLC/i)) != null) {
      let rt = {
        pattern: "00000111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DAD @r

    if ((matched = str.match(/DAD\s+bc/i)) != null) {
      let rt = {
        pattern: "00001001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LDAX (BC)

    if ((matched = str.match(/LDAX\s+\s*\(\s*BC\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "00001010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DCX @r

    if ((matched = str.match(/DCX\s+bc/i)) != null) {
      let rt = {
        pattern: "00001011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INR @r

    if ((matched = str.match(/INR\s+c/i)) != null) {
      let rt = {
        pattern: "00001100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DCR @r

    if ((matched = str.match(/DCR\s+c/i)) != null) {
      let rt = {
        pattern: "00001101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MVI @r, #@n

    if ((matched = str.match(/MVI\s+c\s*,\s*\s+#(\w+)/i)) != null) {
      let rt = {
        pattern: "00001110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RRC

    if ((matched = str.match(/RRC/i)) != null) {
      let rt = {
        pattern: "00001111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LXI @r,@n

    if ((matched = str.match(/LXI\s+de\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00010001nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // STAX DE

    if ((matched = str.match(/STAX\s+DE/i)) != null) {
      let rt = {
        pattern: "00010010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INX @r

    if ((matched = str.match(/INX\s+de/i)) != null) {
      let rt = {
        pattern: "00010011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INR @r

    if ((matched = str.match(/INR\s+d/i)) != null) {
      let rt = {
        pattern: "00010100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DCR @r

    if ((matched = str.match(/DCR\s+d/i)) != null) {
      let rt = {
        pattern: "00010101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MVI @r, #@n

    if ((matched = str.match(/MVI\s+d\s*,\s*\s+#(\w+)/i)) != null) {
      let rt = {
        pattern: "00010110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RAL

    if ((matched = str.match(/RAL/i)) != null) {
      let rt = {
        pattern: "00010111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DAD @r

    if ((matched = str.match(/DAD\s+de/i)) != null) {
      let rt = {
        pattern: "00011001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LDAX DE

    if ((matched = str.match(/LDAX\s+DE/i)) != null) {
      let rt = {
        pattern: "00011010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DCX @r

    if ((matched = str.match(/DCX\s+de/i)) != null) {
      let rt = {
        pattern: "00011011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INR @r

    if ((matched = str.match(/INR\s+e/i)) != null) {
      let rt = {
        pattern: "00011100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DCR @r

    if ((matched = str.match(/DCR\s+e/i)) != null) {
      let rt = {
        pattern: "00011101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MVI @r, #@n

    if ((matched = str.match(/MVI\s+e\s*,\s*\s+#(\w+)/i)) != null) {
      let rt = {
        pattern: "00011110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RAR

    if ((matched = str.match(/RAR/i)) != null) {
      let rt = {
        pattern: "00011111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LXI @r,@n

    if ((matched = str.match(/LXI\s+hl\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00100001nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // SHLD @n

    if ((matched = str.match(/SHLD\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "00100010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // INX @r

    if ((matched = str.match(/INX\s+hl/i)) != null) {
      let rt = {
        pattern: "00100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INR @r

    if ((matched = str.match(/INR\s+h/i)) != null) {
      let rt = {
        pattern: "00100100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DCR @r

    if ((matched = str.match(/DCR\s+h/i)) != null) {
      let rt = {
        pattern: "00100101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MVI @r, #@n

    if ((matched = str.match(/MVI\s+h\s*,\s*\s+#(\w+)/i)) != null) {
      let rt = {
        pattern: "00100110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // DAA

    if ((matched = str.match(/DAA/i)) != null) {
      let rt = {
        pattern: "00100111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DAD @r

    if ((matched = str.match(/DAD\s+hl/i)) != null) {
      let rt = {
        pattern: "00101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LHLD @n

    if ((matched = str.match(/LHLD\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "00101010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // DCX @r

    if ((matched = str.match(/DCX\s+hl/i)) != null) {
      let rt = {
        pattern: "00101011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INR @r

    if ((matched = str.match(/INR\s+l/i)) != null) {
      let rt = {
        pattern: "00101100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DCR @r

    if ((matched = str.match(/DCR\s+l/i)) != null) {
      let rt = {
        pattern: "00101101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MVI @r, #@n

    if ((matched = str.match(/MVI\s+l\s*,\s*\s+#(\w+)/i)) != null) {
      let rt = {
        pattern: "00101110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // CMA

    if ((matched = str.match(/CMA/i)) != null) {
      let rt = {
        pattern: "00101111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LXI @r,@n

    if ((matched = str.match(/LXI\s+sp\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00110001nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // STA @n

    if ((matched = str.match(/STA\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "00110010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // INX @r

    if ((matched = str.match(/INX\s+sp/i)) != null) {
      let rt = {
        pattern: "00110011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INR @r
    // INR (HL)

    if ((matched = str.match(/INR\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "00110100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DCR @r
    // DCR (HL)

    if ((matched = str.match(/DCR\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "00110101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MVI @r, #@n
    // LD (HL),@n

    if ((matched = str.match(/LD\s+\s*\(\s*HL\s*\)\s*\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00110110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // STC

    if ((matched = str.match(/STC/i)) != null) {
      let rt = {
        pattern: "00110111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DAD @r

    if ((matched = str.match(/DAD\s+sp/i)) != null) {
      let rt = {
        pattern: "00111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LDA @n

    if ((matched = str.match(/LDA\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "00111010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // DCX @r

    if ((matched = str.match(/DCX\s+sp/i)) != null) {
      let rt = {
        pattern: "00111011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INR @r

    if ((matched = str.match(/INR\s+a/i)) != null) {
      let rt = {
        pattern: "00111100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DCR @r

    if ((matched = str.match(/DCR\s+a/i)) != null) {
      let rt = {
        pattern: "00111101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MVI @r, #@n

    if ((matched = str.match(/MVI\s+a\s*,\s*\s+#(\w+)/i)) != null) {
      let rt = {
        pattern: "00111110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // CMC

    if ((matched = str.match(/CMC/i)) != null) {
      let rt = {
        pattern: "00111111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+b\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01000000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+b\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01000001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+b\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01000010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+b\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01000011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+b\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01000100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+b\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01000101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s
    // MOV @r,(HL)

    if ((matched = str.match(/MOV\s+b\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01000110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+b\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01000111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+c\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01001000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+c\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01001001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+c\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01001010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+c\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01001011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+c\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01001100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+c\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01001101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s
    // MOV @r,(HL)

    if ((matched = str.match(/MOV\s+c\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01001110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+c\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01001111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+d\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01010000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+d\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01010001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+d\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01010010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+d\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01010011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+d\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01010100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+d\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01010101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s
    // MOV @r,(HL)

    if ((matched = str.match(/MOV\s+d\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01010110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+d\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01010111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+e\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01011000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+e\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01011001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+e\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01011010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+e\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01011011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+e\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01011100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+e\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01011101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s
    // MOV @r,(HL)

    if ((matched = str.match(/MOV\s+e\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01011110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+e\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01011111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+h\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01100000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+h\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01100001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+h\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01100010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+h\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+h\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01100100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+h\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01100101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s
    // MOV @r,(HL)

    if ((matched = str.match(/MOV\s+h\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01100110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+h\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01100111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+l\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01101000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+l\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+l\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01101010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+l\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01101011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+l\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01101100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+l\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01101101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s
    // MOV @r,(HL)

    if ((matched = str.match(/MOV\s+l\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01101110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+l\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01101111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s
    // MOV (HL),@r

    if ((matched = str.match(/MOV\s+\s*\(\s*HL\s*\)\s*\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01110000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s
    // MOV (HL),@r

    if ((matched = str.match(/MOV\s+\s*\(\s*HL\s*\)\s*\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01110001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s
    // MOV (HL),@r

    if ((matched = str.match(/MOV\s+\s*\(\s*HL\s*\)\s*\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01110010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s
    // MOV (HL),@r

    if ((matched = str.match(/MOV\s+\s*\(\s*HL\s*\)\s*\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01110011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s
    // MOV (HL),@r

    if ((matched = str.match(/MOV\s+\s*\(\s*HL\s*\)\s*\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01110100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s
    // MOV (HL),@r

    if ((matched = str.match(/MOV\s+\s*\(\s*HL\s*\)\s*\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01110101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s
    // MOV @r,(HL)
    // MOV (HL),@r
    // HALT

    if ((matched = str.match(/HALT/i)) != null) {
      let rt = {
        pattern: "01110110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s
    // MOV (HL),@r

    if ((matched = str.match(/MOV\s+\s*\(\s*HL\s*\)\s*\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01110111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+a\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01111000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+a\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+a\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01111010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+a\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01111011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+a\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01111100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+a\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01111101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s
    // MOV @r,(HL)

    if ((matched = str.match(/MOV\s+a\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01111110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // MOV @r,@s

    if ((matched = str.match(/MOV\s+a\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01111111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD @r

    if ((matched = str.match(/ADD\s+b/i)) != null) {
      let rt = {
        pattern: "10000000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD @r

    if ((matched = str.match(/ADD\s+c/i)) != null) {
      let rt = {
        pattern: "10000001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD @r

    if ((matched = str.match(/ADD\s+d/i)) != null) {
      let rt = {
        pattern: "10000010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD @r

    if ((matched = str.match(/ADD\s+e/i)) != null) {
      let rt = {
        pattern: "10000011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD @r

    if ((matched = str.match(/ADD\s+h/i)) != null) {
      let rt = {
        pattern: "10000100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD @r

    if ((matched = str.match(/ADD\s+l/i)) != null) {
      let rt = {
        pattern: "10000101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD @r
    // ADD (HL)

    if ((matched = str.match(/ADD\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10000110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD @r

    if ((matched = str.match(/ADD\s+a/i)) != null) {
      let rt = {
        pattern: "10000111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC @r

    if ((matched = str.match(/ADC\s+b/i)) != null) {
      let rt = {
        pattern: "10001000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC @r

    if ((matched = str.match(/ADC\s+c/i)) != null) {
      let rt = {
        pattern: "10001001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC @r

    if ((matched = str.match(/ADC\s+d/i)) != null) {
      let rt = {
        pattern: "10001010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC @r

    if ((matched = str.match(/ADC\s+e/i)) != null) {
      let rt = {
        pattern: "10001011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC @r

    if ((matched = str.match(/ADC\s+h/i)) != null) {
      let rt = {
        pattern: "10001100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC @r

    if ((matched = str.match(/ADC\s+l/i)) != null) {
      let rt = {
        pattern: "10001101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC @r
    // ADC (HL)

    if ((matched = str.match(/ADC\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10001110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC @r

    if ((matched = str.match(/ADC\s+a/i)) != null) {
      let rt = {
        pattern: "10001111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB @r

    if ((matched = str.match(/SUB\s+b/i)) != null) {
      let rt = {
        pattern: "10010000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB @r

    if ((matched = str.match(/SUB\s+c/i)) != null) {
      let rt = {
        pattern: "10010001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB @r

    if ((matched = str.match(/SUB\s+d/i)) != null) {
      let rt = {
        pattern: "10010010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB @r

    if ((matched = str.match(/SUB\s+e/i)) != null) {
      let rt = {
        pattern: "10010011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB @r

    if ((matched = str.match(/SUB\s+h/i)) != null) {
      let rt = {
        pattern: "10010100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB @r

    if ((matched = str.match(/SUB\s+l/i)) != null) {
      let rt = {
        pattern: "10010101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB @r
    // SUB (HL)

    if ((matched = str.match(/SUB\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10010110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB @r

    if ((matched = str.match(/SUB\s+a/i)) != null) {
      let rt = {
        pattern: "10010111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBB @r

    if ((matched = str.match(/SBB\s+b/i)) != null) {
      let rt = {
        pattern: "10011000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBB @r

    if ((matched = str.match(/SBB\s+c/i)) != null) {
      let rt = {
        pattern: "10011001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBB @r

    if ((matched = str.match(/SBB\s+d/i)) != null) {
      let rt = {
        pattern: "10011010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBB @r

    if ((matched = str.match(/SBB\s+e/i)) != null) {
      let rt = {
        pattern: "10011011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBB @r

    if ((matched = str.match(/SBB\s+h/i)) != null) {
      let rt = {
        pattern: "10011100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBB @r

    if ((matched = str.match(/SBB\s+l/i)) != null) {
      let rt = {
        pattern: "10011101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBB @r
    // SBB A,(HL)

    if ((matched = str.match(/SBB\s+A\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10011110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBB @r

    if ((matched = str.match(/SBB\s+a/i)) != null) {
      let rt = {
        pattern: "10011111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ANA @r

    if ((matched = str.match(/ANA\s+b/i)) != null) {
      let rt = {
        pattern: "10100000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ANA @r

    if ((matched = str.match(/ANA\s+c/i)) != null) {
      let rt = {
        pattern: "10100001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ANA @r

    if ((matched = str.match(/ANA\s+d/i)) != null) {
      let rt = {
        pattern: "10100010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ANA @r

    if ((matched = str.match(/ANA\s+e/i)) != null) {
      let rt = {
        pattern: "10100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ANA @r

    if ((matched = str.match(/ANA\s+h/i)) != null) {
      let rt = {
        pattern: "10100100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ANA @r

    if ((matched = str.match(/ANA\s+l/i)) != null) {
      let rt = {
        pattern: "10100101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ANA @r
    // ANA (HL)

    if ((matched = str.match(/ANA\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10100110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ANA @r

    if ((matched = str.match(/ANA\s+a/i)) != null) {
      let rt = {
        pattern: "10100111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XRA @r

    if ((matched = str.match(/XRA\s+b/i)) != null) {
      let rt = {
        pattern: "10101000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XRA @r

    if ((matched = str.match(/XRA\s+c/i)) != null) {
      let rt = {
        pattern: "10101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XRA @r

    if ((matched = str.match(/XRA\s+d/i)) != null) {
      let rt = {
        pattern: "10101010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XRA @r

    if ((matched = str.match(/XRA\s+e/i)) != null) {
      let rt = {
        pattern: "10101011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XRA @r

    if ((matched = str.match(/XRA\s+h/i)) != null) {
      let rt = {
        pattern: "10101100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XRA @r

    if ((matched = str.match(/XRA\s+l/i)) != null) {
      let rt = {
        pattern: "10101101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XRA @r
    // XRA (HL)

    if ((matched = str.match(/XRA\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10101110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XRA @r

    if ((matched = str.match(/XRA\s+a/i)) != null) {
      let rt = {
        pattern: "10101111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ORA @r

    if ((matched = str.match(/ORA\s+b/i)) != null) {
      let rt = {
        pattern: "10110000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ORA @r

    if ((matched = str.match(/ORA\s+c/i)) != null) {
      let rt = {
        pattern: "10110001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ORA @r

    if ((matched = str.match(/ORA\s+d/i)) != null) {
      let rt = {
        pattern: "10110010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ORA @r

    if ((matched = str.match(/ORA\s+e/i)) != null) {
      let rt = {
        pattern: "10110011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ORA @r

    if ((matched = str.match(/ORA\s+h/i)) != null) {
      let rt = {
        pattern: "10110100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ORA @r

    if ((matched = str.match(/ORA\s+l/i)) != null) {
      let rt = {
        pattern: "10110101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ORA @r
    // ORA (HL)

    if ((matched = str.match(/ORA\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10110110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ORA @r

    if ((matched = str.match(/ORA\s+a/i)) != null) {
      let rt = {
        pattern: "10110111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CMP @r

    if ((matched = str.match(/CMP\s+b/i)) != null) {
      let rt = {
        pattern: "10111000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CMP @r

    if ((matched = str.match(/CMP\s+c/i)) != null) {
      let rt = {
        pattern: "10111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CMP @r

    if ((matched = str.match(/CMP\s+d/i)) != null) {
      let rt = {
        pattern: "10111010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CMP @r

    if ((matched = str.match(/CMP\s+e/i)) != null) {
      let rt = {
        pattern: "10111011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CMP @r

    if ((matched = str.match(/CMP\s+h/i)) != null) {
      let rt = {
        pattern: "10111100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CMP @r

    if ((matched = str.match(/CMP\s+l/i)) != null) {
      let rt = {
        pattern: "10111101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CMP @r
    // CMP (HL)

    if ((matched = str.match(/CMP\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10111110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CMP @r

    if ((matched = str.match(/CMP\s+a/i)) != null) {
      let rt = {
        pattern: "10111111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r

    if ((matched = str.match(/RET\s+nz/i)) != null) {
      let rt = {
        pattern: "11000000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // POP @r

    if ((matched = str.match(/POP\s\s*\\s*\+\s*\s*bc/i)) != null) {
      let rt = {
        pattern: "11000001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // J@r @n

    if ((matched = str.match(/Jnz\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11000010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // JMP @n

    if ((matched = str.match(/JMP\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11000011nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // C@r @n

    if ((matched = str.match(/Cnz\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11000100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // PUSH @r

    if ((matched = str.match(/PUSH\s\s*\\s*\+\s*\s*bc/i)) != null) {
      let rt = {
        pattern: "11000101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADI @n

    if ((matched = str.match(/ADI\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11000110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x00/i)) != null) {
      let rt = {
        pattern: "11000111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r

    if ((matched = str.match(/RET\s+z/i)) != null) {
      let rt = {
        pattern: "11001000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET

    if ((matched = str.match(/RET/i)) != null) {
      let rt = {
        pattern: "11001001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // J@r @n

    if ((matched = str.match(/Jz\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11001010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // C@r @n

    if ((matched = str.match(/Cz\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11001100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // CALL @n

    if ((matched = str.match(/CALL\s\s*\\s*\+\s*\s*\s*\\s*\(\s*\s*\w\s*\\s*\+\s*\s*\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "11001101nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // ACI #@n

    if ((matched = str.match(/ACI\s+#(\w+)/i)) != null) {
      let rt = {
        pattern: "11001110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x08/i)) != null) {
      let rt = {
        pattern: "11001111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r

    if ((matched = str.match(/RET\s+nc/i)) != null) {
      let rt = {
        pattern: "11010000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // POP @r

    if ((matched = str.match(/POP\s\s*\\s*\+\s*\s*de/i)) != null) {
      let rt = {
        pattern: "11010001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // J@r @n

    if ((matched = str.match(/Jnc\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11010010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // OUT @n

    if ((matched = str.match(/OUT\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11010011nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // C@r @n

    if ((matched = str.match(/Cnc\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11010100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // PUSH @r

    if ((matched = str.match(/PUSH\s\s*\\s*\+\s*\s*de/i)) != null) {
      let rt = {
        pattern: "11010101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUI #@n

    if ((matched = str.match(/SUI\s+#(\w+)/i)) != null) {
      let rt = {
        pattern: "11010110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x10/i)) != null) {
      let rt = {
        pattern: "11010111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r

    if ((matched = str.match(/RET\s+c/i)) != null) {
      let rt = {
        pattern: "11011000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // J@r @n

    if ((matched = str.match(/Jc\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11011010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // IN @n

    if ((matched = str.match(/IN\s\s*\+\s*\s*\(\s*\w\s*\+\s*\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11011011nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // C@r @n

    if ((matched = str.match(/Cc\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11011100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // SBI #@n

    if ((matched = str.match(/SBI\s+#(\w+)/i)) != null) {
      let rt = {
        pattern: "11011110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x18/i)) != null) {
      let rt = {
        pattern: "11011111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r

    if ((matched = str.match(/RET\s+po/i)) != null) {
      let rt = {
        pattern: "11100000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // POP @r

    if ((matched = str.match(/POP\s\s*\\s*\+\s*\s*hl/i)) != null) {
      let rt = {
        pattern: "11100001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // J@r @n

    if ((matched = str.match(/Jpo\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11100010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // XTHL

    if ((matched = str.match(/XTHL/i)) != null) {
      let rt = {
        pattern: "11100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // C@r @n

    if ((matched = str.match(/Cpo\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11100100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // PUSH @r

    if ((matched = str.match(/PUSH\s\s*\\s*\+\s*\s*hl/i)) != null) {
      let rt = {
        pattern: "11100101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ANI #@n

    if ((matched = str.match(/ANI\s+#(\w+)/i)) != null) {
      let rt = {
        pattern: "11100110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x20/i)) != null) {
      let rt = {
        pattern: "11100111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r

    if ((matched = str.match(/RET\s+pe/i)) != null) {
      let rt = {
        pattern: "11101000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // PCHL

    if ((matched = str.match(/PCHL/i)) != null) {
      let rt = {
        pattern: "11101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // J@r @n

    if ((matched = str.match(/Jpe\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11101010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // XCHG

    if ((matched = str.match(/XCHG/i)) != null) {
      let rt = {
        pattern: "11101011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // C@r @n

    if ((matched = str.match(/Cpe\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11101100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // XRA #@n

    if ((matched = str.match(/XRA\s+#(\w+)/i)) != null) {
      let rt = {
        pattern: "11101110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x28/i)) != null) {
      let rt = {
        pattern: "11101111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r

    if ((matched = str.match(/RET\s+p/i)) != null) {
      let rt = {
        pattern: "11110000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // POP @r

    if ((matched = str.match(/POP\s\s*\\s*\+\s*\s*af/i)) != null) {
      let rt = {
        pattern: "11110001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // J@r @n

    if ((matched = str.match(/Jp\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11110010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // DI

    if ((matched = str.match(/DI/i)) != null) {
      let rt = {
        pattern: "11110011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // C@r @n

    if ((matched = str.match(/Cp\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11110100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // PUSH @r

    if ((matched = str.match(/PUSH\s\s*\\s*\+\s*\s*af/i)) != null) {
      let rt = {
        pattern: "11110101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ORI #@n

    if ((matched = str.match(/ORI\s+#(\w+)/i)) != null) {
      let rt = {
        pattern: "11110110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x30/i)) != null) {
      let rt = {
        pattern: "11110111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r

    if ((matched = str.match(/RET\s+m/i)) != null) {
      let rt = {
        pattern: "11111000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SPHL

    if ((matched = str.match(/SPHL/i)) != null) {
      let rt = {
        pattern: "11111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // J@r @n

    if ((matched = str.match(/Jm\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11111010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // EI

    if ((matched = str.match(/EI/i)) != null) {
      let rt = {
        pattern: "11111011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // C@r @n

    if ((matched = str.match(/Cm\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11111100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // CPI #@n

    if ((matched = str.match(/CPI\s+#(\w+)/i)) != null) {
      let rt = {
        pattern: "11111110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x38/i)) != null) {
      let rt = {
        pattern: "11111111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    return pattern;
  }
  return {
    clearEquateMap,
    setEquateValue,
    getEquateMap,
    getEquateValue,

    start,
    assemble
  }
});