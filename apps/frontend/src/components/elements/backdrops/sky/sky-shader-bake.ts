import {
  ATMOSPHERE_GLSL,
  SKY_RADIANCE_RANGE,
  VIEW_GLSL,
} from "./sky-shader-common";

export const NOISE_VOLUME_SIZE = 128;

export const NOISE_FRAGMENT_GLSL = `#version 300 es
precision highp float;
precision highp int;

uniform vec2 uSlice;
out vec4 outColor;

uvec3 pcg(uvec3 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  return v;
}

vec3 cellHash(ivec3 cell, int period, uint seed) {
  ivec3 wrapped = ((cell % period) + period) % period;
  uvec3 h = pcg(uvec3(wrapped) + seed);
  return vec3(h) * (1.0 / 4294967295.0);
}

float gradientNoise(vec3 p, int period, uint seed) {
  ivec3 i = ivec3(floor(p));
  vec3 f = fract(p);
  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float result = 0.0;
  for (int z = 0; z <= 1; z++) {
    for (int y = 0; y <= 1; y++) {
      for (int x = 0; x <= 1; x++) {
        ivec3 corner = ivec3(x, y, z);
        vec3 gradient = cellHash(i + corner, period, seed) * 2.0 - 1.0;
        vec3 weight = mix(1.0 - u, u, vec3(corner));
        result += dot(gradient, f - vec3(corner)) * weight.x * weight.y * weight.z;
      }
    }
  }
  return result;
}

float worley(vec3 p, int period, uint seed) {
  ivec3 i = ivec3(floor(p));
  vec3 f = fract(p);
  float nearest = 1.0e4;
  for (int z = -1; z <= 1; z++) {
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        ivec3 offset = ivec3(x, y, z);
        vec3 point = vec3(offset) + cellHash(i + offset, period, seed);
        vec3 delta = point - f;
        nearest = min(nearest, dot(delta, delta));
      }
    }
  }
  return 1.0 - min(sqrt(nearest), 1.0);
}

float perlinFbm(vec3 p, int frequency) {
  float sum = 0.0;
  float amplitude = 1.0;
  float total = 0.0;
  int f = frequency;
  for (int octave = 0; octave < 5; octave++) {
    sum += amplitude * gradientNoise(p * float(f), f, 11u + uint(octave));
    total += amplitude;
    amplitude *= 0.5;
    f *= 2;
  }
  return sum / total * 1.9;
}

float worleyFbm(vec3 p, int frequency, uint seed) {
  return worley(p * float(frequency), frequency, seed) * 0.625
    + worley(p * float(frequency * 2), frequency * 2, seed + 1u) * 0.25
    + worley(p * float(frequency * 4), frequency * 4, seed + 2u) * 0.125;
}

void main() {
  vec3 p = vec3(gl_FragCoord.xy / uSlice.y, uSlice.x);
  float billow = abs(mix(1.0, perlinFbm(p, 4), 0.5) * 2.0 - 1.0);
  float low = worleyFbm(p, 4, 101u);
  float mid = worleyFbm(p, 8, 211u);
  float high = worley(p * 16.0, 16, 307u) * 0.7 + worley(p * 32.0, 32, 311u) * 0.3;
  float shape = low + billow * (1.0 - low);
  outColor = clamp(vec4(shape, low, mid, high), 0.0, 1.0);
}
`;

export const ATMOSPHERE_FRAGMENT_GLSL = `#version 300 es
precision highp float;
precision highp int;

uniform vec4 uFrame;
out vec4 outColor;
${VIEW_GLSL}
${ATMOSPHERE_GLSL}
void main() {
  vec2 ndc = gl_FragCoord.xy / uFrame.xy * 2.0 - 1.0;
  vec3 physical = skyRadiance(viewRay(ndc, uView.x), uSun.xyz);
  float luma = dot(physical, vec3(0.2126, 0.7152, 0.0722));
  vec3 vivid = max(mix(vec3(luma), physical, 1.38), 0.0);
  vec3 radiance = pow(vivid, vec3(1.55, 1.26, 1.0));
  outColor = vec4(sqrt(clamp(radiance / ${SKY_RADIANCE_RANGE.toFixed(1)}, 0.0, 1.0)), 1.0);
}
`;
