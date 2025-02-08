#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0),
                             6.0) - 3.0) - 1.0,  0.0, 1.0);
    rgb *= rgb * (3.0 - 2.0 * rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

vec3 stroke(float axis, float radius, float width, vec3 color) {
  radius = fract(radius + (time * 0.05)) - 0.1;
  float d = step(radius, axis + width * 0.5) - step(radius, axis - width * 0.5);
  return color * clamp(d, 0.0, 1.0);
}

float circleSDF(vec2 uv, float pct) {
  return length(uv - 0.5) * pct;
}

mat2 scale2D (vec2 amt) {
  return mat2 (amt.x, 0.0, 0.0, amt.y);
}

void main () {
  vec2 uv = vUv.xx;
  uv -= vec2(0.5);
  uv *= scale2D(vec2(0.8));
  uv += vec2(0.5);
  vec3 color = vec3(0.0);
  vec3 curCol = hsb2rgb(vec3(1.0, 1.0, 1.0));
  for (float i = 0.0; i < 1.0; i += 0.1) {
    float n = fract(i);
    curCol = hsb2rgb(vec3(n, 1.0, 1.0 - n));
    color += stroke(circleSDF(uv, 1.5), 1.0 - n, 0.1, curCol);
  }
  gl_FragColor = vec4(color, 1.0);
}