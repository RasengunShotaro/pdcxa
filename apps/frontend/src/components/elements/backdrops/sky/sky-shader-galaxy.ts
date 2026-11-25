export const GALAXY_SIZE = { width: 4096, height: 1536 } as const;
export const GALAXY_LONGITUDE_EXTENT = 1.6;
export const GALAXY_LATITUDE_EXTENT = 0.6;
export const GALAXY_RADIANCE_RANGE = 0.25;

export const GALAXY_FRAGMENT_GLSL = `#version 300 es
precision highp float;
precision highp int;

uniform vec2 uSize;
out vec4 outColor;

const float CORE_LONGITUDE = -0.42;

uvec2 pcg2(uvec2 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * 1664525u;
  v.y += v.x * 1664525u;
  v ^= v >> 16u;
  v.x += v.y * 1664525u;
  v.y += v.x * 1664525u;
  v ^= v >> 16u;
  return v;
}

vec2 latticeGradient(ivec2 cell) {
  uvec2 h = pcg2(uvec2(cell + 32768));
  float angle = float(h.x) * (6.2831853 / 4294967295.0);
  return vec2(cos(angle), sin(angle));
}

float gradientNoise(vec2 p) {
  ivec2 i = ivec2(floor(p));
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(latticeGradient(i), f);
  float b = dot(latticeGradient(i + ivec2(1, 0)), f - vec2(1.0, 0.0));
  float c = dot(latticeGradient(i + ivec2(0, 1)), f - vec2(0.0, 1.0));
  float d = dot(latticeGradient(i + ivec2(1, 1)), f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p, int octaves) {
  float sum = 0.0;
  float amplitude = 0.5;
  for (int octave = 0; octave < octaves; octave++) {
    sum += amplitude * gradientNoise(p);
    p = mat2(1.6, 1.2, -1.2, 1.6) * p + 17.3;
    amplitude *= 0.5;
  }
  return sum;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  float lon = (uv.x - 0.5) * 2.0 * ${GALAXY_LONGITUDE_EXTENT.toFixed(2)};
  float rawLat = (uv.y - 0.5) * 2.0 * ${GALAXY_LATITUDE_EXTENT.toFixed(2)};
  float lat = rawLat - 0.11 * fbm(vec2(lon * 0.8, 3.1), 3);
  float fromCore = lon - CORE_LONGITUDE;
  vec2 g = vec2(lon, lat);

  float bulge = exp(-fromCore * fromCore / 0.10 - lat * lat / 0.013);
  float reach = 0.30 + 0.70 * exp(-abs(fromCore) / 0.95);
  float thickness = 0.055 + 0.050 * exp(-fromCore * fromCore / 0.45);
  float disk = exp(-sqrt(lat * lat + 0.0006) / thickness) * reach;
  float outer = exp(-lat * lat / 0.075) * reach * 0.20;

  float clouds = 0.5 + fbm(g * vec2(3.0, 6.0) + 7.1, 7);
  float mottle = 1.0 + 0.9 * fbm(g * vec2(17.0, 29.0) + 41.0, 6);
  float glow = (disk * (0.25 + 1.15 * clouds * clouds) + bulge * (0.7 + 1.6 * clouds)) * mottle + outer;

  vec2 q = vec2(lon * 4.6, lat * 8.5);
  vec2 warp = vec2(fbm(q + 3.7, 5), fbm(q + 11.9, 5));
  float field = fbm(q + warp * 1.5 + 23.0, 9);
  float rift = exp(-pow((lat - 0.018 * sin(lon * 3.1 + 1.0)) / (0.024 + 0.046 * reach), 2.0));
  float dust = smoothstep(-0.16, 0.34, field) * rift * 1.7;
  float tendrils = fbm(q * 2.7 + warp * 2.4 + 51.0, 8);
  dust += smoothstep(0.02, 0.40, tendrils) * exp(-lat * lat / 0.026) * 1.0;
  float specks = fbm(q * 7.0 + 77.0, 6);
  dust += smoothstep(0.10, 0.42, specks) * exp(-lat * lat / 0.012) * 0.6;
  vec3 absorbed = exp(-dust * vec3(1.15, 1.45, 1.95));

  float warmth = clamp(bulge * 1.6 + disk * 0.30, 0.0, 1.0);
  vec3 tint = mix(vec3(0.52, 0.70, 1.00), vec3(1.00, 0.84, 0.62), warmth);
  float emission = fbm(g * vec2(9.0, 14.0) + 31.0, 4);
  vec3 nebulae = vec3(1.00, 0.22, 0.38) * smoothstep(0.30, 0.46, emission) * disk * 1.1;
  vec3 light = (tint * glow + nebulae) * absorbed * 0.058;
  float richness = clamp(glow * absorbed.g * 0.85, 0.0, 1.0);
  outColor = vec4(sqrt(clamp(light / ${GALAXY_RADIANCE_RANGE.toFixed(2)}, 0.0, 1.0)), richness);
}
`;
