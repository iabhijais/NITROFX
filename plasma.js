// ──────────────────────────────────────────────────────
// PLASMA BACKGROUND — Zero-dependency WebGL2 version
// No external library needed. Pure browser APIs.
// ──────────────────────────────────────────────────────

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertexSrc = `#version 300 es
precision highp float;
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentSrc = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;

  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y));
    p.z -= 4.;
    S = p;
    d = p.y-T;

    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05);
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T));
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4;
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }

  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);

  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));

  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export function initPlasma(containerId, options = {}) {
  const containerEl = document.getElementById(containerId);
  if (!containerEl) {
    console.warn('Plasma: container not found:', containerId);
    return;
  }

  const {
    color = '#f6f4fa',
    speed = 1,
    direction = 'pingpong',
    scale = 1,
    opacity = 1
  } = options;

  const useCustomColor = color ? 1.0 : 0.0;
  const customColorRgb = color ? hexToRgb(color) : [1, 1, 1];
  const directionMultiplier = direction === 'reverse' ? -1.0 : 1.0;

  try {
    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.touchAction = 'auto';
    canvas.style.userSelect = 'none';
    containerEl.appendChild(canvas);

    const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) {
      console.warn('Plasma: WebGL2 not supported');
      return;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
    if (!vs || !fs) return;

    const program = createProgram(gl, vs, fs);
    if (!program) return;

    // Full-screen triangle (covers entire viewport with a single triangle)
    const positions = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTime = gl.getUniformLocation(program, 'iTime');
    const uRes = gl.getUniformLocation(program, 'iResolution');
    const uSpeedLoc = gl.getUniformLocation(program, 'uSpeed');
    const uDir = gl.getUniformLocation(program, 'uDirection');
    const uScaleLoc = gl.getUniformLocation(program, 'uScale');
    const uOpacityLoc = gl.getUniformLocation(program, 'uOpacity');
    const uCustomColorLoc = gl.getUniformLocation(program, 'uCustomColor');
    const uUseCustomColorLoc = gl.getUniformLocation(program, 'uUseCustomColor');

    gl.useProgram(program);
    gl.uniform1f(uSpeedLoc, speed * 0.4);
    gl.uniform1f(uDir, directionMultiplier);
    gl.uniform1f(uScaleLoc, scale);
    gl.uniform1f(uOpacityLoc, opacity);
    gl.uniform3f(uCustomColorLoc, customColorRgb[0], customColorRgb[1], customColorRgb[2]);
    gl.uniform1f(uUseCustomColorLoc, useCustomColor);

    let lastWidth = 0, lastHeight = 0;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : 1.5);
      const rect = containerEl.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));

      if (Math.abs(w - lastWidth) < 10 && Math.abs(h - lastHeight) < 150) return;

      lastWidth = w;
      lastHeight = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(containerEl);
    setSize();

    const t0 = performance.now();
    const loop = (t) => {
      let timeValue = (t - t0) * 0.001;

      gl.useProgram(program);

      if (direction === 'pingpong') {
        const dur = 10;
        const seg = timeValue % dur;
        const isForward = Math.floor(timeValue / dur) % 2 === 0;
        const u = seg / dur;
        const smooth = u * u * (3 - 2 * u);
        timeValue = isForward ? smooth * dur : (1 - smooth) * dur;
        gl.uniform1f(uDir, 1.0);
        gl.uniform1f(uTime, timeValue);
      } else {
        gl.uniform1f(uTime, timeValue);
      }

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    console.log('✅ Plasma background initialized successfully');
  } catch (e) {
    console.warn('Plasma: WebGL2 init failed', e);
  }
}

// Auto-expose globally as fallback
window.initPlasma = initPlasma;
