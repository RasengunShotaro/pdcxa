import { SKY_OVERSCAN } from "./sky-frame";
import {
  ATMOSPHERE_GLSL,
  CLOUD_RADIANCE_RANGE,
  VIEW_GLSL,
} from "./sky-shader-common";

export const CLOUD_VERTEX_GLSL = `#version 300 es
precision highp float;

uniform sampler2D uSky;
flat out vec3 vSunColor;
flat out vec3 vSkyHigh;
flat out vec3 vSkyLow;
${VIEW_GLSL}
${ATMOSPHERE_GLSL}
void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
  vSunColor = sunTransmittance(3.0, uSun.xyz);
  vSkyHigh = decodeSky(textureLod(uSky, vec2(0.5, 0.94), 0.0).rgb);
  vSkyLow = decodeSky(textureLod(uSky, vec2(0.5, 0.05), 0.0).rgb);
}
`;

export const CLOUD_FRAGMENT_GLSL = `#version 300 es
precision highp float;
precision highp int;
precision highp sampler3D;

uniform vec4 uFrame;
uniform vec4 uTurn;
uniform sampler3D uNoise;
uniform sampler2D uSky;
flat in vec3 vSunColor;
flat in vec3 vSkyHigh;
flat in vec3 vSkyLow;
out vec4 outColor;
${VIEW_GLSL}
const float NOISE_SIZE = 128.0;
const float CLOUD_BASE = 1300.0;
const float CLOUD_TOP = 6600.0;
const float MAX_DISTANCE = 44000.0;
const float BASE_TILE = 13500.0;
const float DETAIL_TILE = 2300.0;
const float WEATHER_TILE = 63000.0;
const float CLEAR_NEAR = 2300.0;
const float CLEAR_FAR = 4400.0;
const float EXTINCTION = 0.030;
const float DENSITY_GAIN = 2.3;
const float LUMPS = 0.80;
const float SUN_GAIN = 1.12;
const float SKY_GAIN = 0.62;
const int MAX_ITERATIONS = 640;
const int LIGHT_STEPS = 6;

float gradientNoiseOffset(vec2 pixel) {
  return fract(52.9829189 * fract(dot(pixel, vec2(0.06711056, 0.00583715))));
}

vec4 sampleNoise(vec3 uvw, float lod) {
  vec3 grid = uvw * NOISE_SIZE + 0.5;
  vec3 cell = floor(grid);
  vec3 f = grid - cell;
  vec3 smoothF = f * f * (3.0 - 2.0 * f);
  grid = cell + mix(smoothF, f, saturate(lod));
  return textureLod(uNoise, (grid - 0.5) / NOISE_SIZE, lod);
}

float lodFor(float footprint, float tile) {
  return max(0.0, log2(footprint * NOISE_SIZE / tile));
}

vec3 windOffset() {
  return vec3(uFrame.z * uTurn.z, 0.0, uFrame.z * uTurn.z * 0.35);
}

float coverageAt(vec3 p) {
  vec2 drifted = (p + windOffset()).xz;
  vec4 weather = textureLod(uNoise, vec3(drifted / WEATHER_TILE, 0.31), 0.0);
  float fields = weather.r * 0.75 + weather.g * 0.25;
  float cover = smoothstep(0.27, 0.66, fields);
  return cover * smoothstep(CLEAR_NEAR, CLEAR_FAR, length(p.xz));
}

float cloudTop(float coverage) {
  return mix(0.22, 1.0, smoothstep(0.08, 0.72, coverage));
}

float cloudShape(vec3 p, float coverage, float footprint, float detail) {
  float height = (p.y - CLOUD_BASE) / (CLOUD_TOP - CLOUD_BASE);
  float top = cloudTop(coverage);
  if (height <= 0.0 || height >= top || coverage <= 0.004) return 0.0;
  vec3 q = p + windOffset();
  q.xz += height * vec2(170.0, 60.0);
  float profile = smoothstep(0.0, 0.04, height) * (1.0 - smoothstep(top * 0.3, top, height));
  vec4 n = sampleNoise(q / BASE_TILE, lodFor(footprint, BASE_TILE));
  float billows = n.g * 0.625 + n.b * 0.25 + n.a * 0.125;
  float base = remap(n.r, billows - 1.0, 1.0, 0.0, 1.0);
  float amount = coverage * profile;
  float edge = smoothstep(0.0, 0.2, amount);
  if (detail <= 0.0) {
    return saturate(remap(base, 1.0 - amount, 1.0, 0.0, 1.0) * DENSITY_GAIN) * edge;
  }
  float rise = uFrame.z * uFrame.w;
  vec3 mq = q / BASE_TILE * 3.3 + vec3(0.19, -rise * 0.3, 0.0);
  vec4 m = sampleNoise(mq, lodFor(footprint, BASE_TILE / 3.3));
  float lumps = m.g * 0.7 + m.b * 0.3;
  if (base + (lumps - 0.5) * LUMPS + 0.22 <= 1.0 - amount) return 0.0;
  vec3 dq = q / DETAIL_TILE + vec3(0.0, -rise, 0.0);
  vec4 d = sampleNoise(dq, lodFor(footprint, DETAIL_TILE));
  float wisps = d.g * 0.625 + d.b * 0.25 + d.a * 0.125;
  wisps = mix(1.0 - wisps, wisps, saturate(height * 4.0));
  vec4 f = sampleNoise(dq * 3.7 + 0.37, lodFor(footprint, DETAIL_TILE / 3.7));
  float fringe = f.g * 0.5 + f.b * 0.3 + f.a * 0.2;
  vec4 e = sampleNoise(dq * 12.7 + 0.61, lodFor(footprint, DETAIL_TILE / 12.7));
  float frays = e.b * 0.6 + e.a * 0.4;
  float field = base + (lumps - 0.5) * LUMPS + (wisps - 0.5) * 0.36 + (fringe - 0.5) * 0.20 + (frays - 0.5) * 0.10;
  float shape = remap(field, 1.0 - amount, 1.0, 0.0, 1.0) * edge;
  return saturate(shape * DENSITY_GAIN);
}

float henyeyGreenstein(float cosAngle, float g) {
  float g2 = g * g;
  return (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * cosAngle, 1.5);
}

float opticalDepthToSun(vec3 p, vec3 sun, float coverage, float footprint) {
  float depth = 0.0;
  float stepLength = 70.0;
  vec3 q = p;
  for (int i = 0; i < LIGHT_STEPS; i++) {
    q += sun * stepLength;
    depth += cloudShape(q, coverage, footprint + stepLength * 0.5, i < 2 ? 1.0 : 0.0) * stepLength;
    stepLength *= 1.65;
  }
  return depth * EXTINCTION;
}

vec4 marchClouds(vec3 viewDir, vec2 pixel, vec3 skyBehind) {
  vec3 rd = turnAroundUp(viewDir, uTurn.xy);
  vec3 sun = turnAroundUp(uSun.xyz, uTurn.xy);
  float pixelAngle = 2.0 * uView.y / uFrame.y;
  float climb = max(rd.y, 0.02);
  float tNear = CLOUD_BASE / climb;
  float tFar = min(CLOUD_TOP / climb, MAX_DISTANCE);
  if (tNear >= tFar) return vec4(0.0, 0.0, 0.0, 1.0);

  float t = tNear;
  float transmittance = 1.0;
  vec3 scattered = vec3(0.0);
  float depthSum = 0.0;
  float cosAngle = dot(rd, sun);
  float away = 1.0 - saturate(cosAngle);
  bool started = false;

  for (int i = 0; i < MAX_ITERATIONS; i++) {
    if (t > tFar || transmittance < 0.03) break;
    vec3 p = rd * t;
    float footprint = t * pixelAngle;
    float fine = clamp(footprint * 3.0, 10.0, 70.0);
    float coverage = coverageAt(p);
    float height = (p.y - CLOUD_BASE) / (CLOUD_TOP - CLOUD_BASE);
    if (coverage <= 0.004) {
      t += fine * 4.0;
      continue;
    }
    if (height >= cloudTop(coverage)) {
      t += fine * 2.0;
      continue;
    }
    if (!started) {
      started = true;
      t += fine * gradientNoiseOffset(pixel);
      continue;
    }
    float shape = cloudShape(p, coverage, footprint, 1.0);
    if (shape > 0.0) {
      float depth = opticalDepthToSun(p, sun, coverage, footprint);
      float light = 0.0;
      float gain = 1.0;
      float thinning = 1.0;
      float spread = 1.0;
      for (int octave = 0; octave < 4; octave++) {
        float phase = mix(
          henyeyGreenstein(cosAngle, 0.8 * spread),
          henyeyGreenstein(cosAngle, -0.26 * spread),
          0.46
        );
        light += gain * exp(-depth * thinning) * phase;
        gain *= 0.52;
        thinning *= 0.4;
        spread *= 0.5;
      }
      float powder = 1.0 - exp(-depth * 2.4 - shape * 1.6);
      light *= mix(1.0, 0.45 + 0.9 * powder, 0.5 * away);
      float open = 0.3 + 0.7 * pow(saturate(height / cloudTop(coverage)), 0.8);
      vec3 tinted = mix(vSkyLow * 0.8 + vec3(0.05, 0.055, 0.06), vSkyHigh * 1.5, height);
      float tintLuma = dot(tinted, vec3(0.2126, 0.7152, 0.0722));
      vec3 ambient = mix(tinted, vec3(tintLuma) * vec3(0.94, 0.98, 1.07), 0.7) * open;
      vec3 radiance = vSunColor * light * SUN_GAIN + ambient * SKY_GAIN;
      float stepTransmittance = exp(-shape * EXTINCTION * fine);
      float weight = transmittance * (1.0 - stepTransmittance);
      scattered += weight * radiance;
      depthSum += weight * t;
      transmittance *= stepTransmittance;
    }
    t += fine;
  }

  float opening = clamp((transmittance - 0.03) / 0.97, 0.0, 1.0);
  float opacity = 1.0 - transmittance;
  if (opacity <= 0.0005) return vec4(0.0, 0.0, 0.0, 1.0);
  float clarity = exp(-(depthSum / opacity) * 0.000042);
  vec3 clouds = scattered * clarity + skyBehind * 1.05 * opacity * (1.0 - clarity);
  return vec4(clouds * (1.0 - opening) / opacity, opening);
}

void main() {
  vec2 pixel = gl_FragCoord.xy;
  vec2 ndc = pixel / uFrame.xy * 2.0 - 1.0;
  vec2 skyUv = clamp(vec2(ndc.x * ${SKY_OVERSCAN.toFixed(3)}, ndc.y) * 0.5 + 0.5, 0.0, 1.0);
  vec3 skyBehind = decodeSky(texture(uSky, skyUv).rgb);
  vec4 clouds = marchClouds(viewRay(ndc, uView.x * ${SKY_OVERSCAN.toFixed(3)}), pixel, skyBehind);
  float grain = gradientNoiseOffset(pixel + 17.0) - 0.5;
  vec3 stored = sqrt(clamp(clouds.rgb / ${CLOUD_RADIANCE_RANGE.toFixed(1)}, 0.0, 1.0));
  outColor = vec4(stored + grain / 255.0, clouds.a);
}
`;
