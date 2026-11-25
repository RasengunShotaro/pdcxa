import { SKY_OVERSCAN } from "./sky-frame";
import { CLOUD_RADIANCE_RANGE, VIEW_GLSL } from "./sky-shader-common";
import {
  GALAXY_LATITUDE_EXTENT,
  GALAXY_LONGITUDE_EXTENT,
  GALAXY_RADIANCE_RANGE,
} from "./sky-shader-galaxy";

const NIGHT_GLSL = `
const vec2 NIGHT_PIVOT = vec2(0.5, 0.55);
const float STAR_COUNT_SLOPE = 1.25;
const float STAR_GAIN = 2.4;

vec4 cellRandom(ivec2 cell, uint seed) {
  uvec2 a = pcg2(uvec2(cell + 32768) + seed);
  uvec2 b = pcg2(a + 977u);
  return vec4(vec2(a), vec2(b)) * (1.0 / 4294967295.0);
}

vec3 starTint(float seed) {
  if (seed < 0.07) return vec3(1.00, 0.66, 0.44);
  if (seed < 0.24) return vec3(1.00, 0.88, 0.70);
  if (seed < 0.62) return vec3(0.96, 0.97, 1.00);
  return vec3(0.68, 0.80, 1.00);
}

vec3 starLayer(vec2 point, float cellSize, float presence, vec2 fluxRange, uint seed, float shimmer) {
  vec2 grid = point / cellSize;
  ivec2 cell = ivec2(floor(grid));
  vec4 r = cellRandom(cell, seed);
  if (r.x > presence) return vec3(0.0);
  vec4 r2 = cellRandom(cell, seed + 59u);
  vec2 center = 0.2 + 0.6 * r.yz;
  vec2 offset = (fract(grid) - center) * cellSize * uSun.w;
  float distSquared = dot(offset, offset);
  float rank = mix(pow(fluxRange.x / fluxRange.y, STAR_COUNT_SLOPE), 1.0, r.w);
  float flux = STAR_GAIN * fluxRange.x * pow(rank, -1.0 / STAR_COUNT_SLOPE);
  float t = uFrame.z;
  float wave = sin(t * (1.3 + 3.0 * r2.x) + 6.2832 * r2.y) * sin(t * (0.41 + 1.0 * r2.w) + 6.2832 * r.y);
  flux *= 1.0 + shimmer * wave;
  float core = exp(-distSquared * 2.4);
  float halo = 0.011 / pow(1.0 + distSquared * 0.22, 1.5);
  vec3 tint = mix(vec3(0.93, 0.95, 1.0), starTint(r2.z), 0.3 + 0.6 * smoothstep(0.01, 1.0, flux));
  return tint * flux * (core + halo);
}

vec2 turn(vec2 point, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return vec2(c * point.x - s * point.y, s * point.x + c * point.y);
}

vec3 milkyWay(vec3 rd, out float richness) {
  vec3 center = vec3(0.0, uView.z, -uView.w);
  vec3 up = vec3(0.0, uView.w, uView.z);
  vec3 along = normalize(vec3(1.0, 0.0, 0.0) - up * 0.58);
  vec3 axis = normalize(cross(center, along));
  float lat = asin(clamp(dot(rd, axis), -1.0, 1.0));
  vec3 inPlane = normalize(rd - axis * dot(rd, axis));
  float lon = atan(dot(inPlane, along), dot(inPlane, center));
  vec2 uv = vec2(lon / ${(2 * GALAXY_LONGITUDE_EXTENT).toFixed(2)}, lat / ${(2 * GALAXY_LATITUDE_EXTENT).toFixed(2)}) + 0.5;
  vec4 stored = texture(uGalaxy, clamp(uv, 0.0, 1.0));
  richness = stored.a;
  return stored.rgb * stored.rgb * ${GALAXY_RADIANCE_RANGE.toFixed(2)};
}

vec3 meteor(vec2 screen, vec2 aspect) {
  if (uMeteorState.y <= 0.0) return vec3(0.0);
  float progress = uMeteorState.x;
  vec2 p = screen * aspect;
  vec2 from = uMeteorPath.xy * aspect;
  vec2 to = uMeteorPath.zw * aspect;
  vec2 head = mix(from, to, progress);
  vec2 tail = mix(from, to, max(0.0, progress - 0.38));
  vec2 segment = head - tail;
  float along = clamp(dot(p - tail, segment) / max(dot(segment, segment), 1.0e-8), 0.0, 1.0);
  float dist = length(p - (tail + segment * along));
  float width = 0.55 * uSun.w / uFrame.y;
  float streak = exp(-dist * dist / (2.0 * width * width)) * along * along;
  vec2 toHead = p - head;
  float glow = 0.5 * exp(-dot(toHead, toHead) / (10.0 * width * width));
  vec3 tint = mix(vec3(0.55, 0.95, 0.80), vec3(0.92, 0.95, 1.0), along);
  return tint * (streak + glow) * sin(3.14159265 * progress) * uMeteorState.y * 1.6;
}

vec3 nightScene(vec2 screen, vec3 fixedRay) {
  vec2 aspect = vec2(uFrame.x / uFrame.y, 1.0);
  vec2 turned = turn((screen - NIGHT_PIVOT) * aspect, uPointer.w) / aspect + NIGHT_PIVOT + uPointer.xy;
  vec3 rd = viewRay(turned * 2.0 - 1.0, uView.x);

  float elevation = saturate(fixedRay.y);
  float aboveEdge = max(0.0, elevation - 0.2);
  vec3 sky = mix(vec3(0.0050, 0.0120, 0.0480), vec3(0.0022, 0.0055, 0.0260), smoothstep(0.20, 0.50, elevation));
  sky = mix(sky, vec3(0.0011, 0.0028, 0.0150), smoothstep(0.45, 0.90, elevation));
  float azimuth = atan(fixedRay.x, -fixedRay.z);
  float dawnSide = exp(-pow((azimuth + 0.40) / 0.80, 2.0));
  sky += vec3(0.0050, 0.0190, 0.0500) * exp(-aboveEdge / 0.11) * (0.40 + 0.60 * dawnSide);
  sky += vec3(0.0700, 0.0300, 0.0200) * exp(-aboveEdge / 0.034) * dawnSide;
  sky += vec3(0.0200, 0.0060, 0.0170) * exp(-aboveEdge / 0.070) * dawnSide;
  vec4 ripple = textureLod(uNoise, vec3(azimuth * 0.55 + elevation * 0.35, elevation * 4.2, 0.87), 0.0);
  float greenBand = exp(-pow((elevation - 0.27) / 0.075, 2.0)) * (0.35 + 1.5 * ripple.r * ripple.g);
  float redBand = exp(-pow((elevation - 0.40) / 0.11, 2.0)) * (0.30 + 1.2 * ripple.g);
  sky += vec3(0.0034, 0.0120, 0.0046) * greenBand;
  sky += vec3(0.0042, 0.0012, 0.0014) * redBand;

  float richness;
  sky += milkyWay(rd, richness);

  float shimmer = uPointer.z * (1.6 - elevation);
  vec2 point = turned * uFrame.xy / uSun.w;
  vec4 clustering = textureLod(uNoise, vec3(point / 1100.0, 0.37), 0.0);
  float crowd = 0.45 + 1.1 * clustering.g * clustering.r;
  vec3 stars = starLayer(turn(point, 1.13) + 157.0, 240.0, 0.24, vec2(24.0, 100.0), 41u, shimmer);
  stars += starLayer(turn(point, -0.52) + 71.0, 88.0, 0.27 * crowd, vec2(6.0, 24.0), 17u, shimmer);
  stars += starLayer(turn(point, 0.31) + 13.0, 35.0, 0.27 * crowd, vec2(1.6, 6.0), 3u, shimmer);
  stars += starLayer(turn(point, 0.83) + 311.0, 14.5, (0.22 + 0.16 * richness) * crowd, vec2(0.4, 1.6), 67u, shimmer);
  stars += starLayer(turn(point, -1.07) + 523.0, 6.5, (0.19 + 0.26 * richness) * crowd, vec2(0.12, 0.4), 89u, shimmer * 0.6);
  stars += starLayer(turn(point, 0.47) + 911.0, 4.0, 0.14 * crowd + 0.45 * richness, vec2(0.02, 0.12), 113u, 0.0);
  stars += starLayer(turn(point, -0.21) + 1291.0, 3.0, 0.60 * richness, vec2(0.006, 0.03), 151u, 0.0);
  vec3 extinction = mix(vec3(0.42, 0.34, 0.26), vec3(1.0), smoothstep(0.17, 0.46, elevation));
  return sky + stars * extinction + meteor(vec2(screen.x, 1.0 - screen.y), aspect);
}
`;

export const SKY_FRAGMENT_GLSL = `#version 300 es
precision highp float;
precision highp int;
precision highp sampler3D;

uniform vec4 uFrame;
uniform vec4 uBlend;
uniform vec4 uPointer;
uniform vec4 uMeteorPath;
uniform vec4 uMeteorState;
uniform sampler3D uNoise;
uniform sampler2D uSky;
uniform sampler2D uPreviousClouds;
uniform sampler2D uNextClouds;
uniform sampler2D uGalaxy;
out vec4 outColor;
${VIEW_GLSL}
${NIGHT_GLSL}
vec4 cloudLayer(sampler2D layer, vec3 rd, float turnAngle) {
  vec3 turned = turnAroundUp(rd, vec2(cos(turnAngle), sin(turnAngle)));
  vec2 uv = rayToNdc(turned, uView.x * ${SKY_OVERSCAN.toFixed(3)}) * 0.5 + 0.5;
  vec4 stored = texture(layer, clamp(uv, 0.0, 1.0));
  return vec4(stored.rgb * stored.rgb * ${CLOUD_RADIANCE_RANGE.toFixed(1)}, stored.a);
}

vec3 filmic(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

vec3 toDisplay(vec3 c) {
  vec3 low = c * 12.92;
  vec3 high = 1.055 * pow(max(c, 0.0), vec3(1.0 / 2.4)) - 0.055;
  return mix(low, high, step(vec3(0.0031308), c));
}

vec3 dayScene(vec2 screen) {
  vec2 view = screen + uPointer.xy;
  vec3 sky = decodeSky(texture(uSky, clamp(view, 0.0, 1.0)).rgb);
  if (uBlend.y <= 0.0) return sky;
  vec3 rd = viewRay(view * 2.0 - 1.0, uView.x);
  vec4 clouds = mix(
    cloudLayer(uPreviousClouds, rd, uBlend.z),
    cloudLayer(uNextClouds, rd, uBlend.w),
    uBlend.x
  );
  return sky * mix(1.0, clouds.a, uBlend.y) + clouds.rgb * uBlend.y;
}


void main() {
  vec2 pixel = gl_FragCoord.xy;
  vec2 screen = pixel / uFrame.xy;

  vec3 color = vec3(0.0);
  if (uFrame.w < 0.999) {
    color += toDisplay(filmic(dayScene(screen))) * (1.0 - uFrame.w);
  }
  if (uFrame.w > 0.001) {
    vec3 night = nightScene(screen, viewRay(screen * 2.0 - 1.0, uView.x));
    color += pow(max(night, 0.0), vec3(1.0 / 2.2)) * uFrame.w;
  }

  uvec2 seed = pcg2(uvec2(pixel));
  vec2 grain = vec2(seed) * (1.0 / 4294967295.0);
  color += (grain.x + grain.y - 1.0) / 255.0;
  outColor = vec4(color, 1.0);
}
`;
