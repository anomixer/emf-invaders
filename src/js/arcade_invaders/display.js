let arcade_invaders_display = (function(bus, options) {
  let sgxSurface;
  let scale = 2; // only 1 and 2 are supported
  let plotMethod = scale == 2 ? plot2tv : plot1;
  let lockedImageData = {};
  let video;
  let width = 224;
  let height = 256;
  let hook = {
    onWrite8: function(addr, data) {
      if (addr >= 0x2400) {
        // Update video memory
        var base = addr - 0x2400;
        var y = ~(((base & 0x1f) * 8) & 0xFF) & 0xFF;
        var x = base >> 5;
        for (var i = 0; i < 8; ++i) {
          plotMethod(x, y, data, i);
        }
      }
    },
    onRead8: function(a, d) {
      return d;
    },
  };

  (function ctor() {
    sgxSurface = sgxskeleton.init(width * scale, height * scale);
  })();

  function plot1(x, y, value, bit) {
    let bt = (value >> bit) & 1;
    y = y - bit;
    let r = 0;
    let g = 0;
    let b = 0;
    if (bt) {
      if (y >= 184 && y <= 238 && x >= 0 && x <= 223) {
        g = 255;
      } else if (y >= 240 && y <= 247 && x >= 16 && x <= 133) {
        g = 255;
      } else if (y >= (247 - 215) && y >= (247 - 184) && x >= 0 && x <= 233) {
        g = b = r = 255;
      } else {
        r = 255;
      }
    }
    let index = (y * width + x) * 4 * scale;

    video.data[index] = r;
    video.data[index + 1] = g;
    video.data[index + 2] = b;
  }


  function plot2tv(x, y, value, bit) {
    let bt = (value >> bit) & 1;
    y = y - bit;
    let r = g = b = 0;
    let r2 = g2 = b2 = 0;
    if (bt) {
      if (y >= 184 && y <= 238 && x >= 0 && x <= 223) {
        g = 255;
        g2 = 225;
      } else if (y >= 240 && y <= 247 && x >= 16 && x <= 133) {
        g = 255;
        g2 = 230;
      } else if (y >= (247 - 215) && y >= (247 - 184) && x >= 0 && x <= 233) {
        g = b = r = 255;
        g2 = b2 = r2 = 234;
      } else {
        r = 255;
        r2 = 220;
      }
    }
    let pitch = 4 * width * scale;
    let index = (y * width * 2 + x) * 4 * scale;

    video.data[index + 0] = video.data[index + 4] = r;
    video.data[index + 1] = video.data[index + 5] = g;
    video.data[index + 2] = video.data[index + 6] = b;

    video.data[index + pitch + 0] = video.data[index + pitch + 4] = r2;
    video.data[index + pitch + 1] = video.data[index + pitch + 5] = g2;
    video.data[index + pitch + 2] = video.data[index + pitch + 6] = b2;
  }


  function plot2std(x, y, value, bit) {
    let bt = (value >> bit) & 1;
    y = y - bit;
    let r = g = b = 0;
    if (bt) {
      if (y >= 184 && y <= 238 && x >= 0 && x <= 223)
        g = 255;
      else if (y >= 240 && y <= 247 && x >= 16 && x <= 133)
        g = 255;
      else if (y >= (247 - 215) && y >= (247 - 184) && x >= 0 && x <= 233) {
        g = b = r = 255;
      } else {
        r = 255;
      }
    }
    let pitch = 4 * width * scale;
    let index = (y * width * 2 + x) * 4 * scale;

    video.data[index + 0] = video.data[index + 4] = video.data[index + pitch + 0] = video.data[index + pitch + 4] = r;
    video.data[index + 1] = video.data[index + 5] = video.data[index + pitch + 1] = video.data[index + pitch + 5] = g;
    video.data[index + 2] = video.data[index + 6] = video.data[index + pitch + 2] = video.data[index + pitch + 6] = b;
  }

  function start() {
    lockSurface();
    clear();
  }

  function clear() {
    for (let i = 0; i < video.data.length; i += 4) {
      video.data[i + 3] = 255;
    }
  }

  function lockSurface() {
    if (!video) {
      sgxSurface.lock(lockedImageData);
      video = lockedImageData.imageData_;
    }
  }

  function render() {
    let ctx = sgxSurface.getDeviceContext();
    ctx.putImageData(video, 0, 0);
  }

  return {
    start,
    render,
    hook,
  }
});