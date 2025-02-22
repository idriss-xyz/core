import { VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE } from './shaders';

const createShader = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader => {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Unable to create shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('Could not compile shader: ' + info);
  }
  return shader;
};

const createProgram = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram => {
  const program = gl.createProgram();
  if (!program) throw new Error('Unable to create program');
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error('Could not link program: ' + info);
  }
  return program;
};

export const initWebGL = (canvas: HTMLCanvasElement) => {
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl2', {
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });
  } catch {
    // ignore errors here
  }
  if (!gl) {
    gl = canvas.getContext('webgl', {
      antialias: false,
      preserveDrawingBuffer: false,
    });
  }
  if (!gl) throw new Error('WebGL is not supported in this browser.');

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    FRAGMENT_SHADER_SOURCE,
  );
  const program = createProgram(gl, vertexShader, fragmentShader);

  gl.useProgram(program);

  // Create position and texture coordinate buffers
  const posBuffer = gl.createBuffer();
  if (!posBuffer) throw new Error('Unable to create position buffer');
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.DYNAMIC_DRAW,
  );

  const texBuffer = gl.createBuffer();
  if (!texBuffer) throw new Error('Unable to create texture buffer');
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]),
    gl.STATIC_DRAW,
  );

  const posLoc = gl.getAttribLocation(program, 'a_position');
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const texLoc = gl.getAttribLocation(program, 'a_texCoord');
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
  gl.enableVertexAttribArray(texLoc);
  gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

  return { gl, program, posBuffer };
};
