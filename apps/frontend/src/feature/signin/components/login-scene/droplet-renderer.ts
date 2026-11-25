import {
  DROPLET_FRAGMENT_SHADER,
  DROPLET_VERTEX_SHADER,
} from "./droplet-shader";

export interface DropletRenderer {
  readonly draw: (uniforms: Float32Array<ArrayBuffer>) => void;
  readonly dispose: () => void;
}

interface CompileInput {
  readonly gl: WebGL2RenderingContext;
  readonly type: number;
  readonly source: string;
}

const シェーダーをコンパイルする = ({
  gl,
  type,
  source,
}: CompileInput): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(
      "GLSL のコンパイルに失敗しました",
      gl.getShaderInfoLog(shader),
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const 雫のプログラムを作る = (
  gl: WebGL2RenderingContext,
): WebGLProgram | null => {
  const vertex = シェーダーをコンパイルする({
    gl,
    type: gl.VERTEX_SHADER,
    source: DROPLET_VERTEX_SHADER,
  });
  const fragment = シェーダーをコンパイルする({
    gl,
    type: gl.FRAGMENT_SHADER,
    source: DROPLET_FRAGMENT_SHADER,
  });
  if (!vertex || !fragment) {
    return null;
  }
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("GLSL のリンクに失敗しました", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
};

interface RendererInput {
  readonly canvas: HTMLCanvasElement;
  readonly image: ImageBitmap;
}

export const 雫の描画器を作る = ({
  canvas,
  image,
}: RendererInput): DropletRenderer | null => {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    powerPreference: "high-performance",
  });
  if (!gl) {
    return null;
  }
  const program = 雫のプログラムを作る(gl);
  if (!program) {
    return null;
  }
  const vertexArray = gl.createVertexArray();
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.SRGB8_ALPHA8,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    image,
  );
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const anisotropy = gl.getExtension("EXT_texture_filter_anisotropic");
  if (anisotropy) {
    gl.texParameterf(gl.TEXTURE_2D, anisotropy.TEXTURE_MAX_ANISOTROPY_EXT, 8);
  }
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  const uniformLocation = gl.getUniformLocation(program, "u");
  const photoLocation = gl.getUniformLocation(program, "uPhoto");
  const { useProgram: activateProgram } = gl;
  activateProgram.call(gl, program);

  return {
    draw: (uniforms) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.bindVertexArray(vertexArray);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(photoLocation, 0);
      gl.uniform4fv(uniformLocation, uniforms);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose: () => {
      gl.deleteTexture(texture);
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(program);
    },
  };
};
