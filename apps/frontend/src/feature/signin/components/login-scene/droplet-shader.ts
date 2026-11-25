export const DROPLET_VERTEX_SHADER = `#version 300 es
void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}
`;

const FIELD_SOURCE = `
float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * h * k / 6.0;
}

mat2 rotation(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float dropField(vec3 q) {
  float radius = u[2].z;
  float reach = radius * 2.0;
  float away = length(q);
  if (away > reach * 1.25) {
    return away - reach;
  }
  vec3 s = q / radius;
  float time = u[0].z;
  float collapse = smoothstep(0.3, 0.85, u[4].w);
  float d;
  if (u[2].w > 0.5) {
    vec3 r = s;
    r.yz = rotation(0.95 + 0.12 * sin(time * 0.31)) * r.yz;
    r.xz = rotation(time * 0.22) * r.xz;
    d = length(vec2(length(r.xz) - 0.92, r.y)) - 0.34;
    vec3 bead = vec3(cos(time * 0.4), 0.25 * sin(time * 0.7), sin(time * 0.4)) * 0.92;
    d = smin(d, length(r - bead) - 0.2, 0.3);
  } else {
    d = length(s) - (1.0 - 0.45 * collapse);
    vec3 a =vec3(cos(time * 0.31), sin(time * 0.43), 0.5 * sin(time * 0.27)) * (0.9 + 0.34 * sin(time * 0.19));
    vec3 b = vec3(sin(time * 0.23 + 2.0), cos(time * 0.29 + 1.0), 0.4 * cos(time * 0.21)) * (0.84 + 0.4 * sin(time * 0.16 + 1.7));
    vec3 c = vec3(cos(time * 0.17 + 4.0), -abs(sin(time * 0.13 + 0.5)), 0.3 * sin(time * 0.25)) * (0.98 + 0.42 * sin(time * 0.11 + 3.1));
    float drift = 1.0 + 0.5 * collapse;
    d = smin(d, length(s - a * drift) - 0.4, 0.55);
    d = smin(d, length(s - b * drift) - 0.3, 0.5);
    d = smin(d, length(s - c * drift) - 0.2, 0.42);
  }
  d += 0.028 * (1.0 + 6.0 * collapse) * sin(s.x * 3.1 + time * 0.8) * sin(s.y * 2.7 - time * 0.6) * sin(s.z * 2.9 + time * 0.5);
  d += u[3].w * 0.03 * sin(s.y * 7.0 + time * 10.0) * sin(s.x * 5.0 - time * 8.0);
  vec2 press = u[3].xy / radius;
  float pressLength = length(press);
  if (pressLength > 1.0) {
    press /= pressLength;
  }
  vec3 dent = s - vec3(press, sqrt(max(1.0 - dot(press, press), 0.0)));
  d += u[3].z * 0.4 * exp(-dot(dent, dent) / 0.32);
  return d * radius * 0.7;
}

float field(vec3 x) {
  return dropField(x - vec3(u[2].xy, 0.0));
}

vec3 normalAt(vec3 x) {
  vec2 e = vec2(0.0012, -0.0012);
  return normalize(
    e.xyy * field(x + e.xyy) +
    e.yyx * field(x + e.yyx) +
    e.yxy * field(x + e.yxy) +
    e.xxx * field(x + e.xxx)
  );
}
`;

const PHOTO_SOURCE = `
float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

vec3 photo(vec2 p, float blur) {
  vec2 uv = 0.5 + u[1].zw + p * u[1].xy;
  return textureLod(uPhoto, uv, u[0].w + blur).rgb * mix(1.0, 0.33, u[4].z);
}

float caustic(vec2 uv, float time) {
  vec2 p = mod(uv * 6.2831, 6.2831) - 250.0;
  vec2 i = p;
  float c = 1.0;
  float intensity = 0.005;
  for (int n = 0; n < 4; n++) {
    float t = time * (1.0 - 3.5 / float(n + 1));
    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + t) / intensity), p.y / (cos(i.y + t) / intensity)));
  }
  c /= 4.0;
  c = 1.17 - pow(c, 1.4);
  return pow(abs(c), 8.0);
}

vec4 groundLight(vec2 p) {
  float radius = u[2].z;
  float strength = u[5].z;
  vec2 g = (p - u[5].xy) / radius;
  g.y *= 3.4;
  float reach = dot(g, g);
  float shadow = 0.42 * exp(-reach * 0.7) * min(strength, 1.0);
  float ripple = caustic(g * 0.42 + vec2(0.0, u[0].z * 0.02), u[0].z * 0.35);
  float glow = min(pow(exp(-reach * 2.2) * strength * (0.07 + 0.6 * ripple), 0.5), 0.9);
  vec3 tint = u[6].rgb * mix(1.0, 0.7, u[4].z);
  return vec4(tint * glow, 1.0 - (1.0 - glow) * (1.0 - shadow));
}
`;

const GLASS_SOURCE = `
vec3 spectrum(float w) {
  vec3 band = vec3(w - 0.16, w - 0.5, w - 0.84);
  vec3 color = exp(-band * band * vec3(14.0, 16.0, 14.0));
  color.r += 0.28 * exp(-(w - 1.0) * (w - 1.0) * 40.0);
  return color;
}

vec3 throughGlass(vec3 from, vec3 direction, vec2 scatter, float blur) {
  float depth = min(direction.z, -0.16);
  vec3 hit = from + direction * ((-PLANE - from.z) / depth);
  return photo(hit.xy * CAMERA / (CAMERA + PLANE) + scatter, blur);
}

vec3 studio(vec3 r) {
  vec2 light = u[4].xy;
  float facing = smoothstep(0.0, 0.35, r.z);
  vec2 key = r.xy - light;
  float softbox = smoothstep(0.25, 0.17, abs(key.x)) * smoothstep(0.13, 0.06, abs(key.y));
  softbox *= 1.0 - 0.7 * smoothstep(0.014, 0.004, abs(key.x + 0.03));
  softbox *= 1.0 - 0.7 * smoothstep(0.012, 0.004, abs(key.y - 0.01));
  float glint = pow(max(dot(r, normalize(vec3(light.x + 0.36, light.y - 0.1, 0.8))), 0.0), 1400.0);
  vec2 fill = r.xy - vec2(-light.x * 0.7, -0.6);
  float strip = smoothstep(0.5, 0.15, abs(fill.x)) * smoothstep(0.06, 0.015, abs(fill.y));
  vec3 lights = vec3(1.0, 0.95, 0.88) * softbox * 16.0 + vec3(1.0, 0.86, 0.7) * glint * 90.0 + vec3(0.5, 0.68, 1.0) * strip * 3.5;
  return lights * facing * mix(1.0, 0.38, u[4].z);
}

vec3 shadeGlass(vec3 x, vec3 rd, float seed) {
  vec3 n = normalAt(x);
  float facing = max(dot(n, -rd), 0.0);
  float fresnel = 0.034 + 0.966 * pow(1.0 - facing, 5.0);

  float relax = smoothstep(0.0, 0.5, u[4].w);
  float bend = mix(IOR, 1.0, relax);
  vec3 inside = refract(rd, n, 1.0 / bend);
  vec3 start = x - n * 0.004;
  float travelled = 0.0;
  for (int i = 0; i < 72; i++) {
    float d = -field(start + inside * travelled);
    if (d < 0.00015) {
      break;
    }
    travelled += max(d, 0.0004);
    if (travelled > 1.6) {
      break;
    }
  }
  vec3 leave = start + inside * travelled;
  vec3 leaveNormal = normalAt(leave);
  float grazing = 1.0 - facing;
  float blur = 3.2 * grazing * grazing * (1.0 - relax);
  float spread = (0.0003 + 0.0026 * grazing) * (1.0 - relax);

  vec3 refracted = vec3(0.0);
  vec3 weight = vec3(0.0);
  float trapped = 0.0;
  for (int k = 0; k < 12; k++) {
    float w = (float(k) + seed) / 12.0;
    float ior = bend + (0.5 - w) * 0.085 * (1.0 - relax);
    vec3 enter = refract(rd, n, 1.0 / ior);
    vec3 exit = refract(enter, -leaveNormal, ior);
    if (dot(exit, exit) < 0.00001) {
      exit = reflect(enter, -leaveNormal);
      trapped += 1.0 / 12.0;
    }
    vec3 tint = spectrum(w);
    float turn = float(k) * 2.39996 + seed * 6.2831;
    vec2 scatter = vec2(cos(turn), sin(turn)) * spread * sqrt((float(k) + 0.5) / 12.0);
    refracted += throughGlass(leave, exit, scatter, blur) * tint;
    weight += tint;
  }
  refracted /= weight;
  refracted *= exp(-min(travelled, 0.45) * vec3(0.55, 0.17, 0.1) * (1.0 - relax));
  refracted *= 1.0 + trapped * 0.9;

  vec3 r = reflect(rd, n);
  vec3 sky = photo(r.xy * 0.5 + x.xy * 0.45 + vec2(0.0, 0.14), 4.5) * 1.2;
  vec3 lights = studio(r);
  vec3 reflected = sky + lights;
  vec3 color = mix(refracted, reflected, fresnel * (1.0 - relax));
  color += sky * pow(grazing, 3.0) * 0.55 * (1.0 - relax);
  color += lights * 0.006;
  return color;
}
`;

export const DROPLET_FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform vec4 u[7];
uniform sampler2D uPhoto;
out vec4 outColor;

const float CAMERA = 2.6;
const float PLANE = 1.15;
const float IOR = 1.45;
${FIELD_SOURCE}
${PHOTO_SOURCE}
${GLASS_SOURCE}
vec3 shoulder(vec3 c) {
  vec3 over = max(c - 0.82, 0.0);
  return min(c, 0.82) + 0.18 * (1.0 - exp(-over / 0.18));
}

vec3 encode(vec3 c) {
  vec3 low = c * 12.92;
  vec3 high = 1.055 * pow(max(c, 0.0), vec3(1.0 / 2.4)) - 0.055;
  return mix(low, high, step(0.0031308, c));
}

void main() {
  vec2 resolution = u[0].xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * resolution) / resolution.y;
  float pixel = 1.0 / resolution.y;
  float seed = hash(gl_FragCoord.xy);
  vec3 ro = vec3(0.0, 0.0, CAMERA);
  vec3 rd = normalize(vec3(p, -CAMERA));

  float t = CAMERA - 0.75;
  float nearest = 1000.0;
  bool hit = false;
  for (int i = 0; i < 64; i++) {
    float d = field(ro + rd * t);
    if (d < 0.0004) {
      hit = true;
      t += d;
      t += field(ro + rd * t);
      break;
    }
    nearest = min(nearest, d);
    t += d;
    if (t > CAMERA + 0.75) {
      break;
    }
  }

  if (hit) {
    vec3 x = ro + rd * t;
    vec3 color = encode(shoulder(shadeGlass(x, rd, seed)));
    color += (seed - 0.5) / 255.0;
    float keep = 1.0 - smoothstep(0.72, 1.0, u[4].w);
    outColor = vec4(color * keep, keep);
    return;
  }

  vec4 ground = groundLight(p);
  vec3 glow = encode(shoulder(photo(p + vec2(0.0, 0.12), 4.5) * 1.5));
  float rim = 1.0 - smoothstep(0.0, pixel * 1.6, nearest);
  float halo = max(rim * 0.7, exp(-nearest * 55.0) * 0.1);
  float around = 1.0 - smoothstep(0.35, 0.9, u[4].w);
  outColor = vec4(glow * halo + ground.rgb * (1.0 - halo), halo + ground.a * (1.0 - halo)) * around;
}
`;
