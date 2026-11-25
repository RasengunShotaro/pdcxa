import { isSoftwareRenderer } from "./sky-frame";
import {
  CLOUD_LAYER_COUNT,
  type ColumnRect,
  type LayerSize,
} from "./sky-layers";
import {
  ATMOSPHERE_FRAGMENT_GLSL,
  NOISE_FRAGMENT_GLSL,
  NOISE_VOLUME_SIZE,
} from "./sky-shader-bake";
import { CLOUD_FRAGMENT_GLSL, CLOUD_VERTEX_GLSL } from "./sky-shader-clouds";
import { FULLSCREEN_VERTEX_GLSL } from "./sky-shader-common";
import { GALAXY_FRAGMENT_GLSL, GALAXY_SIZE } from "./sky-shader-galaxy";
import { SKY_FRAGMENT_GLSL } from "./sky-shader-scene";

const NOISE_SLICES_PER_STEP = 8;

export interface SkyRenderer {
  readonly prepare: () => boolean;
  readonly resizeAtmosphere: (input: {
    readonly atmosphereSize: LayerSize;
    readonly atmosphereUniforms: Float32Array;
  }) => boolean;
  readonly resizeCloudLayers: (layerSize: LayerSize) => boolean;
  readonly renderCloudColumn: (input: {
    readonly layer: number;
    readonly column: ColumnRect;
    readonly uniforms: Float32Array;
  }) => void;
  readonly renderFrame: (input: {
    readonly uniforms: Float32Array;
    readonly previousLayer: number;
    readonly nextLayer: number;
  }) => void;
  readonly destroy: () => void;
}

interface Target {
  readonly texture: WebGLTexture;
  readonly framebuffer: WebGLFramebuffer;
}

const compileShader = ({
  gl,
  type,
  source,
}: {
  readonly gl: WebGL2RenderingContext;
  readonly type: number;
  readonly source: string;
}): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const linkProgram = ({
  gl,
  vertexSource = FULLSCREEN_VERTEX_GLSL,
  fragmentSource,
}: {
  readonly gl: WebGL2RenderingContext;
  readonly vertexSource?: string;
  readonly fragmentSource: string;
}): WebGLProgram | null => {
  const vertex = compileShader({
    gl,
    type: gl.VERTEX_SHADER,
    source: vertexSource,
  });
  const fragment = compileShader({
    gl,
    type: gl.FRAGMENT_SHADER,
    source: fragmentSource,
  });
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  gl.deleteProgram(program);
  return null;
};

const activateProgram = ({
  gl,
  program,
}: {
  readonly gl: WebGL2RenderingContext;
  readonly program: WebGLProgram;
}): void => {
  const activate = gl.useProgram.bind(gl);
  activate(program);
};

interface NoiseBake {
  readonly texture: WebGLTexture;
  readonly advance: () => boolean;
  readonly dispose: () => void;
}

const startNoiseBake = ({
  gl,
  vertexArray,
}: {
  readonly gl: WebGL2RenderingContext;
  readonly vertexArray: WebGLVertexArrayObject;
}): NoiseBake | null => {
  const program = linkProgram({ gl, fragmentSource: NOISE_FRAGMENT_GLSL });
  if (!program) return null;
  const size = NOISE_VOLUME_SIZE;
  const texture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();
  gl.bindTexture(gl.TEXTURE_3D, texture);
  gl.texStorage3D(
    gl.TEXTURE_3D,
    Math.log2(size) + 1,
    gl.RGBA8,
    size,
    size,
    size,
  );
  gl.texParameteri(
    gl.TEXTURE_3D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR,
  );
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.REPEAT);
  const sliceLocation = gl.getUniformLocation(program, "uSlice");
  const progress = { slice: 0, finished: false };

  const finish = (): void => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(framebuffer);
    gl.deleteProgram(program);
    progress.finished = true;
  };

  return {
    texture,
    advance: () => {
      if (progress.finished) return true;
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, size, size);
      activateProgram({ gl, program });
      gl.bindVertexArray(vertexArray);
      const last = Math.min(size, progress.slice + NOISE_SLICES_PER_STEP);
      for (let slice = progress.slice; slice < last; slice += 1) {
        gl.framebufferTextureLayer(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          texture,
          0,
          slice,
        );
        gl.uniform2f(sliceLocation, (slice + 0.5) / size, size);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      progress.slice = last;
      if (last < size) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return false;
      }
      finish();
      gl.bindTexture(gl.TEXTURE_3D, texture);
      gl.generateMipmap(gl.TEXTURE_3D);
      return true;
    },
    dispose: () => {
      if (!progress.finished) finish();
      gl.deleteTexture(texture);
    },
  };
};

const createTarget = ({
  gl,
  size,
  internalFormat,
}: {
  readonly gl: WebGL2RenderingContext;
  readonly size: LayerSize;
  readonly internalFormat: number;
}): Target | null => {
  const texture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texStorage2D(gl.TEXTURE_2D, 1, internalFormat, size.width, size.height);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );
  const complete =
    gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  if (complete) {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  if (complete) return { texture, framebuffer };
  gl.deleteFramebuffer(framebuffer);
  gl.deleteTexture(texture);
  return null;
};

const deleteTargets = ({
  gl,
  targets,
}: {
  readonly gl: WebGL2RenderingContext;
  readonly targets: readonly Target[];
}): void => {
  for (const target of targets) {
    gl.deleteFramebuffer(target.framebuffer);
    gl.deleteTexture(target.texture);
  }
};

const bakeGalaxy = ({
  gl,
  vertexArray,
  internalFormat,
}: {
  readonly gl: WebGL2RenderingContext;
  readonly vertexArray: WebGLVertexArrayObject;
  readonly internalFormat: number;
}): WebGLTexture | null => {
  const program = linkProgram({ gl, fragmentSource: GALAXY_FRAGMENT_GLSL });
  const target = createTarget({ gl, size: GALAXY_SIZE, internalFormat });
  if (!program || !target) return null;
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
  gl.viewport(0, 0, GALAXY_SIZE.width, GALAXY_SIZE.height);
  activateProgram({ gl, program });
  gl.bindVertexArray(vertexArray);
  gl.uniform2f(
    gl.getUniformLocation(program, "uSize"),
    GALAXY_SIZE.width,
    GALAXY_SIZE.height,
  );
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(target.framebuffer);
  gl.deleteProgram(program);
  return target.texture;
};

const isTarget = (target: Target | null): target is Target => target !== null;

export const createSkyRenderer = (
  canvas: HTMLCanvasElement,
): SkyRenderer | null => {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance",
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) return null;
  const rendererInfo = gl.getExtension("WEBGL_debug_renderer_info");
  const rendererName: unknown = rendererInfo
    ? gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL)
    : "";
  if (typeof rendererName === "string" && isSoftwareRenderer(rendererName)) {
    return null;
  }
  const frameProgram = linkProgram({ gl, fragmentSource: SKY_FRAGMENT_GLSL });
  const cloudProgram = linkProgram({
    gl,
    vertexSource: CLOUD_VERTEX_GLSL,
    fragmentSource: CLOUD_FRAGMENT_GLSL,
  });
  const atmosphereProgram = linkProgram({
    gl,
    fragmentSource: ATMOSPHERE_FRAGMENT_GLSL,
  });
  if (!frameProgram || !cloudProgram || !atmosphereProgram) return null;
  const vertexArray = gl.createVertexArray();
  const noiseBake = startNoiseBake({ gl, vertexArray });
  if (!noiseBake) return null;
  const noise = noiseBake.texture;
  const skyFormat = gl.getExtension("EXT_color_buffer_float")
    ? gl.RGBA16F
    : gl.RGBA8;

  const locate = (program: WebGLProgram) => (name: string) =>
    gl.getUniformLocation(program, name);
  const frameAt = locate(frameProgram);
  const cloudAt = locate(cloudProgram);
  const atmosphereAt = locate(atmosphereProgram);
  const state: {
    destroyed: boolean;
    layers: readonly Target[];
    layerSize: LayerSize;
    sky: Target | null;
    galaxy: WebGLTexture | null;
  } = {
    destroyed: false,
    layers: [],
    layerSize: { width: 0, height: 0 },
    sky: null,
    galaxy: null,
  };

  const bakeAtmosphere = ({
    target,
    size,
    uniforms,
  }: {
    readonly target: Target;
    readonly size: LayerSize;
    readonly uniforms: Float32Array;
  }): void => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
    gl.viewport(0, 0, size.width, size.height);
    activateProgram({ gl, program: atmosphereProgram });
    gl.bindVertexArray(vertexArray);
    gl.uniform4fv(atmosphereAt("uFrame"), uniforms, 0, 4);
    gl.uniform4fv(atmosphereAt("uView"), uniforms, 4, 4);
    gl.uniform4fv(atmosphereAt("uSun"), uniforms, 8, 4);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  return {
    prepare: () =>
      !state.destroyed && !gl.isContextLost() && noiseBake.advance(),
    resizeAtmosphere: ({ atmosphereSize, atmosphereUniforms }) => {
      if (state.destroyed || gl.isContextLost()) return false;
      if (state.sky) deleteTargets({ gl, targets: [state.sky] });
      state.sky = createTarget({
        gl,
        size: atmosphereSize,
        internalFormat: skyFormat,
      });
      if (!state.sky) return false;
      bakeAtmosphere({
        target: state.sky,
        size: atmosphereSize,
        uniforms: atmosphereUniforms,
      });
      return true;
    },
    resizeCloudLayers: (layerSize) => {
      if (state.destroyed || gl.isContextLost()) return false;
      deleteTargets({ gl, targets: state.layers });
      state.layers = [];
      const layers = Array.from({ length: CLOUD_LAYER_COUNT }, () =>
        createTarget({ gl, size: layerSize, internalFormat: gl.RGBA8 }),
      ).filter(isTarget);
      if (layers.length !== CLOUD_LAYER_COUNT) {
        deleteTargets({ gl, targets: layers });
        return false;
      }
      state.layers = layers;
      state.layerSize = layerSize;
      return true;
    },
    renderCloudColumn: ({ layer, column, uniforms }) => {
      const target = state.layers[layer];
      if (state.destroyed || gl.isContextLost() || !target || !state.sky) {
        return;
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
      gl.viewport(0, 0, state.layerSize.width, state.layerSize.height);
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(column.x, 0, column.width, state.layerSize.height);
      activateProgram({ gl, program: cloudProgram });
      gl.bindVertexArray(vertexArray);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_3D, noise);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, state.sky.texture);
      gl.uniform1i(cloudAt("uNoise"), 0);
      gl.uniform1i(cloudAt("uSky"), 1);
      gl.uniform4fv(cloudAt("uFrame"), uniforms, 0, 4);
      gl.uniform4fv(cloudAt("uView"), uniforms, 4, 4);
      gl.uniform4fv(cloudAt("uSun"), uniforms, 8, 4);
      gl.uniform4fv(cloudAt("uTurn"), uniforms, 12, 4);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.disable(gl.SCISSOR_TEST);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },
    renderFrame: ({ uniforms, previousLayer, nextLayer }) => {
      if (state.destroyed || gl.isContextLost()) return;
      const nightShare = uniforms[3] ?? 0;
      if (nightShare > 0 && !state.galaxy) {
        state.galaxy = bakeGalaxy({
          gl,
          vertexArray,
          internalFormat: skyFormat,
        });
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      activateProgram({ gl, program: frameProgram });
      gl.bindVertexArray(vertexArray);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_3D, noise);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, state.sky?.texture ?? null);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(
        gl.TEXTURE_2D,
        state.layers[previousLayer]?.texture ?? null,
      );
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, state.layers[nextLayer]?.texture ?? null);
      gl.uniform1i(frameAt("uNoise"), 0);
      gl.uniform1i(frameAt("uSky"), 1);
      gl.uniform1i(frameAt("uPreviousClouds"), 2);
      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, state.galaxy);
      gl.uniform1i(frameAt("uNextClouds"), 3);
      gl.uniform1i(frameAt("uGalaxy"), 4);
      gl.uniform4fv(frameAt("uFrame"), uniforms, 0, 4);
      gl.uniform4fv(frameAt("uView"), uniforms, 4, 4);
      gl.uniform4fv(frameAt("uSun"), uniforms, 8, 4);
      gl.uniform4fv(frameAt("uBlend"), uniforms, 12, 4);
      gl.uniform4fv(frameAt("uPointer"), uniforms, 16, 4);
      gl.uniform4fv(frameAt("uMeteorPath"), uniforms, 20, 4);
      gl.uniform4fv(frameAt("uMeteorState"), uniforms, 24, 4);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    destroy: () => {
      if (state.destroyed) return;
      state.destroyed = true;
      deleteTargets({ gl, targets: state.layers });
      if (state.sky) deleteTargets({ gl, targets: [state.sky] });
      noiseBake.dispose();
      gl.deleteTexture(state.galaxy);
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(frameProgram);
      gl.deleteProgram(cloudProgram);
      gl.deleteProgram(atmosphereProgram);
    },
  };
};
