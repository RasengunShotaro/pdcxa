export const SKY_RADIANCE_RANGE = 4;
export const CLOUD_RADIANCE_RANGE = 3;

export const FULLSCREEN_VERTEX_GLSL = `#version 300 es
void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}
`;

export const VIEW_GLSL = `
uniform vec4 uView;
uniform vec4 uSun;

float remap(float value, float lowIn, float highIn, float lowOut, float highOut) {
  return lowOut + (value - lowIn) / (highIn - lowIn) * (highOut - lowOut);
}

float saturate(float value) {
  return clamp(value, 0.0, 1.0);
}

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

vec3 turnAroundUp(vec3 v, vec2 turnCosSin) {
  return vec3(
    turnCosSin.x * v.x + turnCosSin.y * v.z,
    v.y,
    turnCosSin.x * v.z - turnCosSin.y * v.x
  );
}

vec3 viewRay(vec2 ndc, float tanHalfFovX) {
  vec3 forward = vec3(0.0, uView.z, -uView.w);
  vec3 up = vec3(0.0, uView.w, uView.z);
  return normalize(vec3(ndc.x * tanHalfFovX, 0.0, 0.0) + up * ndc.y * uView.y + forward);
}

vec2 rayToNdc(vec3 rd, float tanHalfFovX) {
  vec3 forward = vec3(0.0, uView.z, -uView.w);
  vec3 up = vec3(0.0, uView.w, uView.z);
  float depth = max(dot(rd, forward), 1.0e-4);
  return vec2(rd.x / (depth * tanHalfFovX), dot(rd, up) / (depth * uView.y));
}

vec3 decodeSky(vec3 stored) {
  return stored * stored * ${SKY_RADIANCE_RANGE.toFixed(1)};
}
`;

export const ATMOSPHERE_GLSL = `
const float EARTH_RADIUS = 6360.0;
const float ATMOSPHERE_RADIUS = 6460.0;
const float VIEW_ALTITUDE = 0.4;
const vec3 RAYLEIGH = vec3(5.802, 13.558, 33.1) * 1.0e-3;
const float MIE_SCATTER = 2.4e-3;
const float MIE_EXTINCTION = 2.7e-3;
const vec3 OZONE = vec3(0.650, 1.881, 0.085) * 1.0e-3;
const float SKY_EXPOSURE = 9.0;
const float SECOND_BOUNCE = 0.036;

vec3 airDensity(float altitude) {
  return vec3(
    exp(-altitude / 8.0),
    exp(-altitude / 1.2),
    max(0.0, 1.0 - abs(altitude - 25.0) / 15.0)
  );
}

float distanceToShell(vec3 origin, vec3 dir, float radius) {
  float b = dot(origin, dir);
  float c = dot(origin, origin) - radius * radius;
  return -b + sqrt(max(b * b - c, 0.0));
}

vec3 extinctionOf(vec3 depth) {
  return RAYLEIGH * depth.x + MIE_EXTINCTION * depth.y + OZONE * depth.z;
}

vec3 depthToSpace(vec3 origin, vec3 dir) {
  float segment = distanceToShell(origin, dir, ATMOSPHERE_RADIUS) / 8.0;
  vec3 depth = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    vec3 p = origin + dir * segment * (float(i) + 0.5);
    depth += airDensity(length(p) - EARTH_RADIUS) * segment;
  }
  return depth;
}

vec3 sunTransmittance(float altitude, vec3 sun) {
  vec3 origin = vec3(0.0, EARTH_RADIUS + altitude, 0.0);
  return exp(-extinctionOf(depthToSpace(origin, sun)));
}

vec3 skyRadiance(vec3 rd, vec3 sun) {
  vec3 origin = vec3(0.0, EARTH_RADIUS + VIEW_ALTITUDE, 0.0);
  float reach = distanceToShell(origin, rd, ATMOSPHERE_RADIUS);
  float cosAngle = dot(rd, sun);
  float cosSquared = cosAngle * cosAngle;
  float phaseRayleigh = 0.0596831 * (1.0 + cosSquared);
  float g = 0.8;
  float phaseMie = 0.1193662 * ((1.0 - g * g) * (1.0 + cosSquared))
    / ((2.0 + g * g) * pow(1.0 + g * g - 2.0 * g * cosAngle, 1.5));
  vec3 viewDepth = vec3(0.0);
  vec3 radiance = vec3(0.0);
  float previous = 0.0;
  const int STEPS = 32;
  for (int i = 0; i < STEPS; i++) {
    float f = (float(i) + 1.0) / float(STEPS);
    float t = reach * f * f;
    float segment = t - previous;
    vec3 p = origin + rd * (t + previous) * 0.5;
    previous = t;
    vec3 density = airDensity(length(p) - EARTH_RADIUS);
    viewDepth += density * segment * 0.5;
    vec3 transmittance = exp(-extinctionOf(viewDepth + depthToSpace(p, sun)));
    viewDepth += density * segment * 0.5;
    vec3 scatter = RAYLEIGH * density.x * (phaseRayleigh + SECOND_BOUNCE)
      + MIE_SCATTER * density.y * (phaseMie + SECOND_BOUNCE);
    radiance += transmittance * scatter * segment;
  }
  return radiance * SKY_EXPOSURE;
}
`;
