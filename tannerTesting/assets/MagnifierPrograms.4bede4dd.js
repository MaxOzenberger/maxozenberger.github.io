import{e as he,a as ue}from"./ProgramTemplate.058b26d9.js";import{b,n as de}from"./WGLContainer.53e4a52c.js";import{f as St,P as ce,U as te,Q as me,R as _e,S as pe,g as P,T as z,t as K,s as ee,V as fe,k as ge,W as Ft,X as ve,Y as tt,Z as Et,a as E,z as G,$ as ye,h as At,a0 as we,L as T,a1 as C,a2 as xe,a3 as be,a4 as Me,E as Te,a5 as p,a6 as g,a7 as q,a8 as H,a9 as kt,aa as ze,n as ie,p as De,ab as Se,ac as ne,ad as _t,ae as pt,af as se,ag as dt,ah as $e,ai as Ie,aj as Ce,ak as Re,al as Pe,am as et,an as Fe,ao as Tt,ap as Ee,aq as Ae,H as it,ar as Vt}from"./index.3255d2a5.js";import{o as ke,e as Ve,i as Le}from"./cimAnalyzer.2e975d1d.js";import{o as Oe}from"./fontUtils.a84c0faf.js";import{c as Ne}from"./Rasterizer.f4189955.js";import{e as w,z as Lt,y as Ot,j as Be,U as Ue,V as Ge}from"./definitions.1d569ae6.js";import{u as qe,_ as nt,p as He,l as We,n as Nt,r as Ze,I as Ye,f as st,s as Bt,d as Ut,i as Xe,o as Qe,m as je,T as Je}from"./color.18cd4954.js";import{t as x}from"./Rect.e8e4d18d.js";import{P as ct,G as $t,L as zt,R as L,M as Ke,D as ti}from"./enums.3c1fa5b5.js";import{E as It}from"./Texture.d66dc1cb.js";import{o as ei}from"./floatRGBA.7b501bd7.js";import{e as Gt}from"./GeometryUtils.ccd3b111.js";import{c as ii}from"./imageutils.2b310abc.js";import{d as I}from"./enums.9a5c29c3.js";import{e as ni}from"./Matcher.19c09547.js";import{s as si}from"./CircularArray.e19cffa8.js";import{T as ai}from"./webgl-debug.bb689b12.js";import{t as oi}from"./ComputedAttributeStorage.6996e7f3.js";const ri={background:{"background.frag":`#ifdef PATTERN
uniform lowp float u_opacity;
uniform lowp sampler2D u_texture;
varying mediump vec4 v_tlbr;
varying mediump vec2 v_tileTextureCoord;
#else
uniform lowp vec4 u_color;
#endif
#ifdef ID
varying mediump vec4 v_id;
#endif
void main() {
#ifdef PATTERN
mediump vec2 normalizedTextureCoord = mod(v_tileTextureCoord, 1.0);
mediump vec2 samplePos = mix(v_tlbr.xy, v_tlbr.zw, normalizedTextureCoord);
lowp vec4 color = texture2D(u_texture, samplePos);
gl_FragColor = u_opacity * color;
#else
gl_FragColor = u_color;
#endif
#ifdef ID
if (gl_FragColor.a < 1.0 / 255.0) {
discard;
}
gl_FragColor = v_id;
#endif
}`,"background.vert":`precision mediump float;
attribute vec2 a_pos;
#ifdef ID
uniform mediump vec4 u_id;
varying mediump vec4 v_id;
#endif
uniform highp mat3 u_dvsMat3;
uniform mediump float u_coord_range;
uniform mediump float u_depth;
#ifdef PATTERN
uniform mediump mat3 u_pattern_matrix;
varying mediump vec2 v_tileTextureCoord;
uniform mediump vec4 u_tlbr;
uniform mediump vec2 u_mosaicSize;
varying mediump vec4 v_tlbr;
#endif
void main() {
gl_Position = vec4((u_dvsMat3 * vec3(u_coord_range * a_pos, 1.0)).xy, u_depth, 1.0);
#ifdef PATTERN
v_tileTextureCoord = (u_pattern_matrix * vec3(a_pos, 1.0)).xy;
v_tlbr             = u_tlbr / u_mosaicSize.xyxy;
#endif
#ifdef ID
v_id = u_id / 255.0;
#endif
}`},circle:{"circle.frag":`precision lowp float;
varying lowp vec4 v_color;
varying lowp vec4 v_stroke_color;
varying mediump float v_blur;
varying mediump float v_stroke_width;
varying mediump float v_radius;
varying mediump vec2 v_offset;
#ifdef ID
varying mediump vec4 v_id;
#endif
void main()
{
mediump float dist = length(v_offset);
mediump float alpha = smoothstep(0.0, -v_blur, dist - 1.0);
lowp float color_mix_ratio = v_stroke_width < 0.01 ? 0.0 : smoothstep(-v_blur, 0.0, dist - v_radius / (v_radius + v_stroke_width));
gl_FragColor = alpha * mix(v_color, v_stroke_color, color_mix_ratio);
#ifdef ID
if (gl_FragColor.a < 1.0 / 255.0) {
discard;
}
gl_FragColor = v_id;
#endif
}`,"circle.vert":`precision mediump float;
attribute vec2 a_pos;
#pragma header
varying lowp vec4 v_color;
varying lowp vec4 v_stroke_color;
varying mediump float v_blur;
varying mediump float v_stroke_width;
varying mediump float v_radius;
varying mediump vec2 v_offset;
#ifdef ID
uniform mediump vec4 u_id;
varying mediump vec4 v_id;
#endif
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform mediump vec2 u_circleTranslation;
uniform mediump float u_depth;
uniform mediump float u_antialiasingWidth;
void main()
{
#pragma main
v_color = color * opacity;
v_stroke_color = stroke_color * stroke_opacity;
v_stroke_width = stroke_width;
v_radius = radius;
v_blur = max(blur, u_antialiasingWidth / (radius + stroke_width));
mediump vec2 offset = vec2(mod(a_pos, 2.0) * 2.0 - 1.0);
v_offset = offset;
#ifdef ID
v_id = u_id / 255.0;
#endif
mediump vec3 pos = u_dvsMat3 * vec3(a_pos * 0.5, 1.0) + u_displayMat3 * vec3((v_radius + v_stroke_width) * offset + u_circleTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth, 1.0);
}`},fill:{"fill.frag":`precision lowp float;
#ifdef PATTERN
uniform lowp sampler2D u_texture;
varying mediump vec2 v_tileTextureCoord;
varying mediump vec4 v_tlbr;
#endif
#ifdef ID
varying mediump vec4 v_id;
#endif
varying lowp vec4 v_color;
vec4 mixColors(vec4 color1, vec4 color2) {
float compositeAlpha = color2.a + color1.a * (1.0 - color2.a);
vec3 compositeColor = color2.rgb + color1.rgb * (1.0 - color2.a);
return vec4(compositeColor, compositeAlpha);
}
void main()
{
#ifdef PATTERN
mediump vec2 normalizedTextureCoord = fract(v_tileTextureCoord);
mediump vec2 samplePos = mix(v_tlbr.xy, v_tlbr.zw, normalizedTextureCoord);
lowp vec4 color = texture2D(u_texture, samplePos);
gl_FragColor = v_color[3] * color;
#else
gl_FragColor = v_color;
#endif
#ifdef ID
if (gl_FragColor.a < 1.0 / 255.0) {
discard;
}
gl_FragColor = v_id;
#endif
}`,"fill.vert":`precision mediump float;
attribute vec2 a_pos;
#pragma header
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform mediump float u_depth;
uniform mediump vec2 u_fillTranslation;
#ifdef PATTERN
#include <util/util.glsl>
uniform mediump vec2 u_mosaicSize;
uniform mediump float u_patternFactor;
varying mediump vec2 v_tileTextureCoord;
varying mediump vec4 v_tlbr;
#endif
#ifdef ID
uniform mediump vec4 u_id;
varying mediump vec4 v_id;
#endif
varying lowp vec4 v_color;
void main()
{
#pragma main
v_color = color * opacity;
#ifdef ID
v_id = u_id / 255.0;
#endif
#ifdef PATTERN
float patternWidth = nextPOT(tlbr.z - tlbr.x);
float patternHeight = nextPOT(tlbr.w - tlbr.y);
float scaleX = 1.0 / (patternWidth * u_patternFactor);
float scaleY = 1.0 / (patternHeight * u_patternFactor);
mat3 patterMat = mat3(scaleX, 0.0,    0.0,
0.0,    -scaleY, 0.0,
0.0,    0.0,    1.0);
v_tileTextureCoord = (patterMat * vec3(a_pos, 1.0)).xy;
v_tlbr             = tlbr / u_mosaicSize.xyxy;
#endif
vec3 pos = u_dvsMat3 * vec3(a_pos, 1.0) + u_displayMat3 * vec3(u_fillTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth, 1.0);
}`},icon:{"icon.frag":`precision mediump float;
uniform lowp sampler2D u_texture;
#ifdef SDF
uniform lowp vec4 u_color;
uniform lowp vec4 u_outlineColor;
#endif
varying mediump vec2 v_tex;
varying lowp float v_opacity;
varying mediump vec2 v_size;
varying lowp vec4 v_color;
#ifdef SDF
varying mediump flaot v_halo_width;
#endif
#ifdef ID
varying mediump vec4 v_id;
#endif
#include <util/encoding.glsl>
vec4 mixColors(vec4 color1, vec4 color2) {
float compositeAlpha = color2.a + color1.a * (1.0 - color2.a);
vec3 compositeColor = color2.rgb + color1.rgb * (1.0 - color2.a);
return vec4(compositeColor, compositeAlpha);
}
void main()
{
#ifdef SDF
lowp vec4 fillPixelColor = v_color;
float d = rgba2float(texture2D(u_texture, v_tex)) - 0.5;
const float softEdgeRatio = 0.248062016;
float size = max(v_size.x, v_size.y);
float dist = d * softEdgeRatio * size;
fillPixelColor *= clamp(0.5 - dist, 0.0, 1.0);
if (v_halo_width > 0.25) {
lowp vec4 outlinePixelColor = u_outlineColor;
const float outlineLimitRatio = (16.0 / 86.0);
float clampedOutlineSize = softEdgeRatio * min(v_halo_width, outlineLimitRatio * max(v_size.x, v_size.y));
outlinePixelColor *= clamp(0.5 - (abs(dist) - clampedOutlineSize), 0.0, 1.0);
gl_FragColor = v_opacity * mixColors(fillPixelColor, outlinePixelColor);
}
else {
gl_FragColor = v_opacity * fillPixelColor;
}
#else
lowp vec4 texColor = texture2D(u_texture, v_tex);
gl_FragColor = v_opacity * texColor;
#endif
#ifdef ID
if (gl_FragColor.a < 1.0 / 255.0) {
discard;
}
gl_FragColor = v_id;
#endif
}`,"icon.vert":`attribute vec2 a_pos;
attribute vec2 a_vertexOffset;
attribute vec4 a_texAngleRange;
attribute vec4 a_levelInfo;
attribute float a_opacityInfo;
#pragma header
#ifdef ID
uniform mediump vec4 u_id;
varying mediump vec4 v_id;
#endif
varying lowp vec4 v_color;
#ifdef SDF
varying mediump float v_halo_width;
#endif
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform highp mat3 u_displayViewMat3;
uniform mediump vec2 u_iconTranslation;
uniform vec2 u_mosaicSize;
uniform mediump float u_depth;
uniform mediump float u_mapRotation;
uniform mediump float u_level;
uniform lowp float u_keepUpright;
uniform mediump float u_fadeDuration;
varying mediump vec2 v_tex;
varying lowp float v_opacity;
varying mediump vec2 v_size;
const float C_OFFSET_PRECISION = 1.0 / 8.0;
const float C_256_TO_RAD = 3.14159265359 / 128.0;
const float C_DEG_TO_RAD = 3.14159265359 / 180.0;
const float tileCoordRatio = 1.0 / 8.0;
uniform highp float u_time;
void main()
{
#pragma main
v_color = color;
v_opacity = opacity;
#ifdef SDF
v_halo_width = halo_width;
#endif
float modded = mod(a_opacityInfo, 128.0);
float targetOpacity = (a_opacityInfo - modded) / 128.0;
float startOpacity = modded / 127.0;
float interpolatedOpacity = clamp(startOpacity + 2.0 * (targetOpacity - 0.5) * u_time / u_fadeDuration, 0.0, 1.0);
v_opacity *= interpolatedOpacity;
mediump float a_angle         = a_levelInfo[1];
mediump float a_minLevel      = a_levelInfo[2];
mediump float a_maxLevel      = a_levelInfo[3];
mediump vec2 a_tex            = a_texAngleRange.xy;
mediump float delta_z = 0.0;
mediump float rotated = mod(a_angle + u_mapRotation, 256.0);
delta_z += (1.0 - step(u_keepUpright, 0.0)) * step(64.0, rotated) * (1.0 - step(192.0, rotated));
delta_z += 1.0 - step(a_minLevel, u_level);
delta_z += step(a_maxLevel, u_level);
delta_z += step(v_opacity, 0.0);
vec2 offset = C_OFFSET_PRECISION * a_vertexOffset;
v_size = abs(offset);
#ifdef SDF
offset = (120.0 / 86.0) * offset;
#endif
mediump vec3 pos = u_dvsMat3 * vec3(a_pos, 1.0) + u_displayViewMat3 * vec3(size * offset, 0.0) + u_displayMat3 * vec3(u_iconTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth + delta_z, 1.0);
#ifdef ID
v_id = u_id / 255.0;
#endif
v_tex = a_tex.xy / u_mosaicSize;
}`},line:{"line.frag":`precision lowp float;
varying mediump vec2 v_normal;
varying highp float v_accumulatedDistance;
varying mediump float v_lineHalfWidth;
varying lowp vec4 v_color;
varying mediump float v_blur;
#if defined (PATTERN) || defined(SDF)
varying mediump vec4 v_tlbr;
varying mediump vec2 v_patternSize;
varying mediump float v_widthRatio;
uniform sampler2D u_texture;
uniform mediump float u_antialiasing;
#endif
#ifdef SDF
#include <util/encoding.glsl>
#endif
#ifdef ID
varying mediump vec4 v_id;
#endif
void main()
{
mediump float fragDist = length(v_normal) * v_lineHalfWidth;
lowp float alpha = clamp((v_lineHalfWidth - fragDist) / v_blur, 0.0, 1.0);
#ifdef PATTERN
mediump float relativeTexX = fract(v_accumulatedDistance / (v_patternSize.x * v_widthRatio));
mediump float relativeTexY = 0.5 + v_normal.y * v_lineHalfWidth / (v_patternSize.y * v_widthRatio);
mediump vec2 texCoord = mix(v_tlbr.xy, v_tlbr.zw, vec2(relativeTexX, relativeTexY));
lowp vec4 color = texture2D(u_texture, texCoord);
gl_FragColor = alpha * v_color[3] * color;
#elif defined(SDF)
mediump float relativeTexX = fract((v_accumulatedDistance * 0.5) / (v_patternSize.x * v_widthRatio));
mediump float relativeTexY =  0.5 + 0.25 * v_normal.y;
mediump vec2 texCoord = mix(v_tlbr.xy, v_tlbr.zw, vec2(relativeTexX, relativeTexY));
mediump float d = rgba2float(texture2D(u_texture, texCoord)) - 0.5;
float dist = d * (v_lineHalfWidth + u_antialiasing / 2.0);
gl_FragColor = alpha * clamp(0.5 - dist, 0.0, 1.0) * v_color;
#else
gl_FragColor = alpha * v_color;
#endif
#ifdef ID
if (gl_FragColor.a < 1.0 / 255.0) {
discard;
}
gl_FragColor = v_id;
#endif
}`,"line.vert":`precision mediump float;
attribute vec2 a_pos;
attribute vec4 a_extrude_offset;
attribute vec4 a_dir_normal;
attribute vec2 a_accumulatedDistance;
#pragma header
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform highp mat3 u_displayViewMat3;
uniform mediump float u_zoomFactor;
uniform mediump vec2 u_lineTranslation;
uniform mediump float u_antialiasing;
uniform mediump float u_depth;
varying mediump vec2 v_normal;
varying highp float v_accumulatedDistance;
const float scale = 1.0 / 31.0;
const mediump float tileCoordRatio = 8.0;
#if defined (SDF)
const mediump float sdfPatternHalfWidth = 15.5;
#endif
#if defined (PATTERN) || defined(SDF)
uniform mediump vec2 u_mosaicSize;
varying mediump vec4 v_tlbr;
varying mediump vec2 v_patternSize;
varying mediump float v_widthRatio;
#endif
#ifdef ID
uniform mediump vec4 u_id;
varying mediump vec4 v_id;
#endif
varying lowp vec4 v_color;
varying mediump float v_lineHalfWidth;
varying mediump float v_blur;
void main()
{
#pragma main
v_color = color * opacity;
v_blur = blur + u_antialiasing;
v_normal = a_dir_normal.zw * scale;
#if defined (PATTERN) || defined(SDF)
v_tlbr          = tlbr / u_mosaicSize.xyxy;
v_patternSize   = vec2(tlbr.z - tlbr.x, tlbr.y - tlbr.w);
#if defined (PATTERN)
v_widthRatio = width / v_patternSize.y;
#else
v_widthRatio = width / sdfPatternHalfWidth / 2.0;
#endif
#endif
v_lineHalfWidth = (width + u_antialiasing) * 0.5;
mediump vec2 dir = a_dir_normal.xy * scale;
mediump vec2 offset_ = a_extrude_offset.zw * scale * offset;
mediump vec2 dist = v_lineHalfWidth * scale * a_extrude_offset.xy;
mediump vec3 pos = u_dvsMat3 * vec3(a_pos + offset_ * tileCoordRatio / u_zoomFactor, 1.0) + u_displayViewMat3 * vec3(dist, 0.0) + u_displayMat3 * vec3(u_lineTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth, 1.0);
#if defined (PATTERN) || defined(SDF)
v_accumulatedDistance = a_accumulatedDistance.x * u_zoomFactor / tileCoordRatio + dot(dir, dist + offset_);
#endif
#ifdef ID
v_id = u_id / 255.0;
#endif
}`},outline:{"outline.frag":`varying lowp vec4 v_color;
varying mediump vec2 v_normal;
#ifdef ID
varying mediump vec4 v_id;
#endif
void main()
{
lowp float dist = abs(v_normal.y);
lowp float alpha = smoothstep(1.0, 0.0, dist);
gl_FragColor = alpha * v_color;
#ifdef ID
if (gl_FragColor.a < 1.0 / 255.0) {
discard;
}
gl_FragColor = v_id;
#endif
}`,"outline.vert":`attribute vec2 a_pos;
attribute vec2 a_offset;
attribute vec2 a_xnormal;
#pragma header
varying lowp vec4 v_color;
#ifdef ID
uniform mediump vec4 u_id;
varying mediump vec4 v_id;
#endif
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform mediump vec2 u_fillTranslation;
uniform mediump float u_depth;
uniform mediump float u_outline_width;
varying lowp vec2 v_normal;
const float scale = 1.0 / 15.0;
void main()
{
#pragma main
v_color = color * opacity;
#ifdef ID
v_id = u_id / 255.0;
#endif
v_normal = a_xnormal;
mediump vec2 dist = u_outline_width * scale * a_offset;
mediump vec3 pos = u_dvsMat3 * vec3(a_pos, 1.0) + u_displayMat3 * vec3(dist + u_fillTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth, 1.0);
}`},text:{"text.frag":`uniform lowp sampler2D u_texture;
varying lowp vec2 v_tex;
varying lowp vec4 v_color;
varying mediump float v_edgeWidth;
varying mediump float v_edgeDistance;
#ifdef ID
varying mediump vec4 v_id;
#endif
void main()
{
lowp float dist = texture2D(u_texture, v_tex).a;
mediump float alpha = smoothstep(v_edgeDistance - v_edgeWidth, v_edgeDistance + v_edgeWidth, dist);
gl_FragColor = alpha * v_color;
#ifdef ID
if (gl_FragColor.a < 1.0 / 255.0) {
discard;
}
gl_FragColor = v_id;
#endif
}`,"text.vert":`attribute vec2 a_pos;
attribute vec2 a_vertexOffset;
attribute vec4 a_texAngleRange;
attribute vec4 a_levelInfo;
attribute float a_opacityInfo;
#pragma header
varying lowp vec4 v_color;
#ifdef ID
uniform mediump vec4 u_id;
varying mediump vec4 v_id;
#endif
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform highp mat3 u_displayViewMat3;
uniform mediump vec2 u_textTranslation;
uniform vec2 u_mosaicSize;
uniform mediump float u_depth;
uniform mediump float u_mapRotation;
uniform mediump float u_level;
uniform lowp float u_keepUpright;
uniform mediump float u_fadeDuration;
varying lowp vec2 v_tex;
const float offsetPrecision = 1.0 / 8.0;
const mediump float edgePos = 0.75;
uniform mediump float u_antialiasingWidth;
varying mediump float v_edgeDistance;
varying mediump float v_edgeWidth;
uniform lowp float u_halo;
const float sdfFontScale = 1.0 / 24.0;
const float sdfPixel = 3.0;
uniform highp float u_time;
void main()
{
#pragma main
if (u_halo > 0.5)
{
v_color = halo_color * opacity;
halo_width *= sdfPixel;
halo_blur *= sdfPixel;
}
else
{
v_color = color * opacity;
halo_width = 0.0;
halo_blur = 0.0;
}
float modded = mod(a_opacityInfo, 128.0);
float targetOpacity = (a_opacityInfo - modded) / 128.0;
float startOpacity = modded / 127.0;
float interpolatedOpacity = clamp(startOpacity + 2.0 * (targetOpacity - 0.5) * u_time / u_fadeDuration, 0.0, 1.0);
v_color *= interpolatedOpacity;
mediump float a_angle       = a_levelInfo[1];
mediump float a_minLevel    = a_levelInfo[2];
mediump float a_maxLevel    = a_levelInfo[3];
mediump vec2 a_tex          = a_texAngleRange.xy;
mediump float a_visMinAngle    = a_texAngleRange.z;
mediump float a_visMaxAngle    = a_texAngleRange.w;
mediump float delta_z = 0.0;
mediump float angle = mod(a_angle + u_mapRotation, 256.0);
if (a_visMinAngle < a_visMaxAngle)
{
delta_z += (1.0 - step(u_keepUpright, 0.0)) * (step(a_visMaxAngle, angle) + (1.0 - step(a_visMinAngle, angle)));
}
else
{
delta_z += (1.0 - step(u_keepUpright, 0.0)) * (step(a_visMaxAngle, angle) * (1.0 - step(a_visMinAngle, angle)));
}
delta_z += 1.0 - step(a_minLevel, u_level);
delta_z += step(a_maxLevel, u_level);
delta_z += step(v_color[3], 0.0);
v_tex = a_tex.xy / u_mosaicSize;
#ifdef ID
v_id = u_id / 255.0;
#endif
v_edgeDistance = edgePos - halo_width / size;
v_edgeWidth = (u_antialiasingWidth + halo_blur) / size;
mediump vec3 pos = u_dvsMat3 * vec3(a_pos, 1.0) + sdfFontScale * u_displayViewMat3 * vec3(offsetPrecision * size * a_vertexOffset, 0.0) + u_displayMat3 * vec3(u_textTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth + delta_z, 1.0);
}`},util:{"encoding.glsl":`const vec4 rgba2float_factors = vec4(
255.0 / (256.0),
255.0 / (256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0 * 256.0)
);
float rgba2float(vec4 rgba) {
return dot(rgba, rgba2float_factors);
}`,"util.glsl":`float nextPOT(in float x) {
return pow(2.0, ceil(log2(abs(x))));
}`}};function li(n){let t=ri;return n.split("/").forEach(e=>{t&&(t=t[e])}),t}const hi=new he(li);function Mn(n){return hi.resolveIncludes(n)}const Tn={shaders:{vertexShader:b("bitBlit/bitBlit.vert"),fragmentShader:b("bitBlit/bitBlit.frag")},attributes:new Map([["a_pos",0],["a_tex",1]])};class mt{constructor(t,e){this._width=0,this._height=0,this._free=[],this._width=t,this._height=e,this._free.push(new x(0,0,t,e))}get width(){return this._width}get height(){return this._height}allocate(t,e){if(t>this._width||e>this._height)return new x;let i=null,s=-1;for(let o=0;o<this._free.length;++o){const a=this._free[o];t<=a.width&&e<=a.height&&(i===null||a.y<=i.y&&a.x<=i.x)&&(i=a,s=o)}return i===null?new x:(this._free.splice(s,1),i.width<i.height?(i.width>t&&this._free.push(new x(i.x+t,i.y,i.width-t,e)),i.height>e&&this._free.push(new x(i.x,i.y+e,i.width,i.height-e))):(i.width>t&&this._free.push(new x(i.x+t,i.y,i.width-t,i.height)),i.height>e&&this._free.push(new x(i.x,i.y+e,t,i.height-e))),new x(i.x,i.y,t,e))}release(t){for(let e=0;e<this._free.length;++e){const i=this._free[e];if(i.y===t.y&&i.height===t.height&&i.x+i.width===t.x)i.width+=t.width;else if(i.x===t.x&&i.width===t.width&&i.y+i.height===t.y)i.height+=t.height;else if(t.y===i.y&&t.height===i.height&&t.x+t.width===i.x)i.x=t.x,i.width+=t.width;else{if(t.x!==i.x||t.width!==i.width||t.y+t.height!==i.y)continue;i.y=t.y,i.height+=t.height}this._free.splice(e,1),this.release(t)}this._free.push(t)}}const ui=256,di=n=>Math.floor(n/256);function ci(n){const t=new Set;for(const e of n)t.add(di(e));return t}function mi(n,t,e){return n.has(t)||n.set(t,e().then(()=>{n.delete(t)}).catch(i=>{n.delete(t),ce(i)})),n.get(t)}const _i=n=>({rect:new x(0,0,0,0),page:0,metrics:{left:0,width:0,height:0,advance:0,top:0},code:n,sdf:!0});class pi{constructor(t,e,i){this.width=0,this.height=0,this._dirties=[],this._glyphData=[],this._currentPage=0,this._glyphCache={},this._textures=[],this._rangePromises=new Map,this.width=t,this.height=e,this._glyphSource=i,this._binPack=new mt(t-4,e-4),this._glyphData.push(new Uint8Array(t*e)),this._dirties.push(!0),this._textures.push(null),this._initDecorationGlyph()}dispose(){this._binPack=null;for(const t of this._textures)t&&t.dispose();this._textures.length=0,this._glyphData.length=0}_initDecorationGlyph(){const t=[117,149,181,207,207,181,149,117],e=[];for(let s=0;s<t.length;s++){const o=t[s];for(let a=0;a<11;a++)e.push(o)}const i={metrics:{width:5,height:2,left:0,top:0,advance:0},bitmap:new Uint8Array(e)};this._recordGlyph(i)}async getGlyphItems(t,e,i){const s=this._getGlyphCache(t);return await this._fetchRanges(t,e,i),e.map(o=>this._getMosaicItem(s,t,o))}bind(t,e,i,s){const o=this._getTexture(t,i);o.setSamplingMode(e),this._dirties[i]&&(o.setData(this._glyphData[i]),this._dirties[i]=!1),t.bindTexture(o,s)}_getGlyphCache(t){return this._glyphCache[t]||(this._glyphCache[t]={}),this._glyphCache[t]}_getTexture(t,e){return this._textures[e]||(this._textures[e]=new It(t,{pixelFormat:ct.ALPHA,dataType:$t.UNSIGNED_BYTE,width:this.width,height:this.height},new Uint8Array(this.width*this.height))),this._textures[e]}_invalidate(){this._dirties[this._currentPage]=!0}async _fetchRanges(t,e,i){const s=ci(e),o=[];s.forEach(a=>{o.push(this._fetchRange(t,a,i))}),await Promise.all(o)}async _fetchRange(t,e,i){if(e>ui)return;const s=t+e;return mi(this._rangePromises,s,()=>this._glyphSource.getRange(t,e,i))}_getMosaicItem(t,e,i){if(!t[i]){const s=this._glyphSource.getGlyph(e,i);if(!s||!s.metrics)return _i(i);const o=this._recordGlyph(s),a=this._currentPage,r=s.metrics;t[i]={rect:o,page:a,metrics:r,code:i,sdf:!0},this._invalidate()}return t[i]}_recordGlyph(t){const e=t.metrics;let i;if(e.width===0)i=new x(0,0,0,0);else{const o=e.width+6,a=e.height+2*3;i=this._binPack.allocate(o,a),i.isEmpty&&(this._dirties[this._currentPage]||(this._glyphData[this._currentPage]=null),this._currentPage=this._glyphData.length,this._glyphData.push(new Uint8Array(this.width*this.height)),this._dirties.push(!0),this._textures.push(null),this._initDecorationGlyph(),this._binPack=new mt(this.width-4,this.height-4),i=this._binPack.allocate(o,a));const r=this._glyphData[this._currentPage],l=t.bitmap;let h,u;if(l)for(let c=0;c<a;c++){h=o*c,u=this.width*(i.y+c)+i.x;for(let d=0;d<o;d++)r[u+d]=l[h+d]}St("esri-glyph-debug")&&this._showDebugPage(r)}return i}_showDebugPage(t){const e=document.createElement("canvas"),i=e.getContext("2d"),s=new ImageData(this.width,this.height),o=s.data;e.width=this.width,e.height=this.height,e.style.border="1px solid black";for(let a=0;a<t.length;++a)o[4*a+0]=t[a],o[4*a+1]=0,o[4*a+2]=0,o[4*a+3]=255;i.putImageData(s,0,0),document.body.appendChild(e)}}class fi{constructor(t){for(this._metrics=[],this._bitmaps=[];t.next();)switch(t.tag()){case 1:{const e=t.getMessage();for(;e.next();)switch(e.tag()){case 3:{const i=e.getMessage();let s,o,a,r,l,h,u;for(;i.next();)switch(i.tag()){case 1:s=i.getUInt32();break;case 2:o=i.getBytes();break;case 3:a=i.getUInt32();break;case 4:r=i.getUInt32();break;case 5:l=i.getSInt32();break;case 6:h=i.getSInt32();break;case 7:u=i.getUInt32();break;default:i.skip()}i.release(),s&&(this._metrics[s]={width:a,height:r,left:l,top:h,advance:u},this._bitmaps[s]=o);break}default:e.skip()}e.release();break}default:t.skip()}}getMetrics(t){return this._metrics[t]}getBitmap(t){return this._bitmaps[t]}}class gi{constructor(){this._ranges=[]}getRange(t){return this._ranges[t]}addRange(t,e){this._ranges[t]=e}}class vi{constructor(t){this._glyphInfo={},this._baseURL=t}getRange(t,e,i){const s=this._getFontStack(t);if(s.getRange(e))return Promise.resolve();const o=256*e,a=o+255,r=this._baseURL.replace("{fontstack}",t).replace("{range}",o+"-"+a);return te(r,{responseType:"array-buffer",...i}).then(l=>{s.addRange(e,new fi(new me(new Uint8Array(l.data),new DataView(l.data))))})}getGlyph(t,e){const i=this._getFontStack(t);if(!i)return;const s=Math.floor(e/256);if(s>256)return;const o=i.getRange(s);return o?{metrics:o.getMetrics(e),bitmap:o.getBitmap(e)}:void 0}_getFontStack(t){let e=this._glyphInfo[t];return e||(e=this._glyphInfo[t]=new gi),e}}const W=1e20;class yi{constructor(t){this._svg=null,this.size=t;const e=document.createElement("canvas");e.width=e.height=t,this._context=e.getContext("2d"),this._gridOuter=new Float64Array(t*t),this._gridInner=new Float64Array(t*t),this._f=new Float64Array(t),this._d=new Float64Array(t),this._z=new Float64Array(t+1),this._v=new Int16Array(t)}dispose(){this._context=this._gridOuter=this._gridInner=this._f=this._d=this._z=this._v=null,this._svg&&(document.body.removeChild(this._svg),this._svg=null)}draw(t,e,i=31){this._initSVG();const s=this.createSVGString(t);return new Promise((o,a)=>{const r=new Image;r.src="data:image/svg+xml; charset=utf8, "+encodeURIComponent(s),r.onload=()=>{r.onload=null,this._context.clearRect(0,0,this.size,this.size),this._context.drawImage(r,0,0,this.size,this.size);const h=this._context.getImageData(0,0,this.size,this.size),u=new Uint8Array(this.size*this.size*4);for(let c=0;c<this.size*this.size;c++){const d=h.data[4*c+3]/255;this._gridOuter[c]=d===1?0:d===0?W:Math.max(0,.5-d)**2,this._gridInner[c]=d===1?W:d===0?0:Math.max(0,d-.5)**2}this._edt(this._gridOuter,this.size,this.size),this._edt(this._gridInner,this.size,this.size);for(let c=0;c<this.size*this.size;c++){const d=this._gridOuter[c]-this._gridInner[c];ei(.5-d/(2*i),u,4*c)}o(u)};const l=e&&e.signal;l&&_e(l,()=>a(pe()))})}_initSVG(){if(!this._svg){const t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttribute("style","position: absolute;"),t.setAttribute("width","0"),t.setAttribute("height","0"),t.setAttribute("aria-hidden","true"),t.setAttribute("role","presentation"),document.body.appendChild(t),this._svg=t}return this._svg}createSVGString(t){const e=this._initSVG(),i=document.createElementNS("http://www.w3.org/2000/svg","path");i.setAttribute("d",t),e.appendChild(i);const s=i.getBBox(),o=s.width/s.height,a=this.size/2;let r,l,h,u;if(o>1){l=r=a/s.width;const _=a*(1/o);h=this.size/4,u=a-_/2}else r=l=a/s.height,h=a-a*o/2,u=this.size/4;const c=-s.x*r+h,d=-s.y*l+u;i.setAttribute("style",`transform: matrix(${r}, 0, 0, ${l}, ${c}, ${d})`);const m=`<svg style="fill:red;" height="${this.size}" width="${this.size}" xmlns="http://www.w3.org/2000/svg">${e.innerHTML}</svg>`;return e.removeChild(i),m}_edt(t,e,i){const s=this._f,o=this._d,a=this._v,r=this._z;for(let l=0;l<e;l++){for(let h=0;h<i;h++)s[h]=t[h*e+l];this._edt1d(s,o,a,r,i);for(let h=0;h<i;h++)t[h*e+l]=o[h]}for(let l=0;l<i;l++){for(let h=0;h<e;h++)s[h]=t[l*e+h];this._edt1d(s,o,a,r,e);for(let h=0;h<e;h++)t[l*e+h]=Math.sqrt(o[h])}}_edt1d(t,e,i,s,o){i[0]=0,s[0]=-W,s[1]=+W;for(let a=1,r=0;a<o;a++){let l=(t[a]+a*a-(t[i[r]]+i[r]*i[r]))/(2*a-2*i[r]);for(;l<=s[r];)r--,l=(t[a]+a*a-(t[i[r]]+i[r]*i[r]))/(2*a-2*i[r]);r++,i[r]=a,s[r]=l,s[r+1]=+W}for(let a=0,r=0;a<o;a++){for(;s[r+1]<a;)r++;e[a]=(a-i[r])*(a-i[r])+t[i[r]]}}}function O(n){return n&&n.type==="static"}class Ct{constructor(t,e,i=0){this._mosaicPages=[],this._maxItemSize=0,this._currentPage=0,this._pageWidth=0,this._pageHeight=0,this._mosaicRects=new Map,this._spriteCopyQueue=[],this.pixelRatio=1,(t<=0||e<=0)&&console.error("Sprites mosaic defaultWidth and defaultHeight must be greater than zero!"),this._pageWidth=t,this._pageHeight=e,i>0&&(this._maxItemSize=i),this.pixelRatio=window.devicePixelRatio||1,this._binPack=new mt(this._pageWidth,this._pageHeight);const s=Math.floor(this._pageWidth),o=Math.floor(this._pageHeight);this._mosaicPages.push({mosaicsData:{type:"static",data:new Uint32Array(s*o)},size:[this._pageWidth,this._pageHeight],dirty:!0,texture:void 0})}getWidth(t){return t>=this._mosaicPages.length?-1:this._mosaicPages[t].size[0]}getHeight(t){return t>=this._mosaicPages.length?-1:this._mosaicPages[t].size[1]}getPageTexture(t){return t<this._mosaicPages.length?this._mosaicPages[t].texture:null}has(t){return this._mosaicRects.has(t)}get itemCount(){return this._mosaicRects.size}getSpriteItem(t){return this._mosaicRects.get(t)}addSpriteItem(t,e,i,s,o,a,r=1){if(this._mosaicRects.has(t))return this._mosaicRects.get(t);let l,h,u;if(O(i))[l,h,u]=this._allocateImage(e[0],e[1]);else{l=new x(0,0,e[0],e[1]),h=this._mosaicPages.length;const d=void 0;this._mosaicPages.push({mosaicsData:i,size:[e[0]+2*w,e[1]+2*w],dirty:!0,texture:d})}if(l.width<=0||l.height<=0)return null;const c={rect:l,width:e[0],height:e[1],sdf:o,simplePattern:a,pixelRatio:r,page:h};return this._mosaicRects.set(t,c),O(i)&&this._copy({rect:l,spriteSize:e,spriteData:i.data,page:h,pageSize:u,repeat:s,sdf:o}),c}hasItemsToProcess(){return this._spriteCopyQueue.length!==0}processNextItem(){const t=this._spriteCopyQueue.pop();t&&this._copy(t)}getSpriteItems(t){const e={};for(const i of t)e[i]=this.getSpriteItem(i);return e}getMosaicItemPosition(t){const e=this.getSpriteItem(t),i=e&&e.rect;if(!i)return null;i.width=e.width,i.height=e.height;const s=e.width,o=e.height,a=w,r=this._mosaicPages[e.page];return{size:[e.width,e.height],tl:[(i.x+a)/r[0],(i.y+a)/r[1]],br:[(i.x+a+s)/r[0],(i.y+a+o)/r[1]],page:e.page}}bind(t,e,i=0,s=0){const o=this._mosaicPages[i],a=o.mosaicsData;let r=o.texture;r||(r=wi(t,o.size),o.texture=r),r.setSamplingMode(e),O(a)?(t.bindTexture(r,s),o.dirty&&(r.setData(new Uint8Array(a.data.buffer)),r.generateMipmap())):(a.data.bindFrame(t,r,s),r.generateMipmap()),o.dirty=!1}static _copyBits(t,e,i,s,o,a,r,l,h,u,c){let d=s*e+i,m=l*a+r;if(c){m-=a;for(let _=-1;_<=u;_++,d=((_+u)%u+s)*e+i,m+=a)for(let f=-1;f<=h;f++)o[m+f]=t[d+(f+h)%h]}else for(let _=0;_<u;_++){for(let f=0;f<h;f++)o[m+f]=t[d+f];d+=e,m+=a}}_copy(t){if(t.page>=this._mosaicPages.length)return;const e=this._mosaicPages[t.page],i=e.mosaicsData;if(!O(e.mosaicsData))throw new P("mapview-invalid-resource","unsuitable data type!");const s=t.spriteData,o=i.data;o&&s||console.error("Source or target images are uninitialized!"),Ct._copyBits(s,t.spriteSize[0],0,0,o,t.pageSize[0],t.rect.x+w,t.rect.y+w,t.spriteSize[0],t.spriteSize[1],t.repeat),e.dirty=!0}_allocateImage(t,e){t+=2*w,e+=2*w;const i=Math.max(t,e);if(this._maxItemSize&&this._maxItemSize<i){const o=2**Math.ceil(Gt(t)),a=2**Math.ceil(Gt(e)),r=new x(0,0,t,e);return this._mosaicPages.push({mosaicsData:{type:"static",data:new Uint32Array(o*a)},size:[o,a],dirty:!0,texture:void 0}),[r,this._mosaicPages.length-1,[o,a]]}const s=this._binPack.allocate(t,e);if(s.width<=0){const o=this._mosaicPages[this._currentPage];return!o.dirty&&O(o.mosaicsData)&&(o.mosaicsData.data=null),this._currentPage=this._mosaicPages.length,this._mosaicPages.push({mosaicsData:{type:"static",data:new Uint32Array(this._pageWidth*this._pageHeight)},size:[this._pageWidth,this._pageHeight],dirty:!0,texture:void 0}),this._binPack=new mt(this._pageWidth,this._pageHeight),this._allocateImage(t,e)}return[s,this._currentPage,[this._pageWidth,this._pageHeight]]}dispose(){this._binPack=null;for(const t of this._mosaicPages){const e=t.texture;e&&e.dispose();const i=t.mosaicsData;O(i)||i.data.destroy()}this._mosaicPages=null,this._mosaicRects.clear()}}function wi(n,t){return new It(n,{pixelFormat:ct.RGBA,dataType:$t.UNSIGNED_BYTE,width:t[0],height:t[1]},null)}function ae(n){return z(n.frameDurations.reduce((t,e)=>t+e,0))}function xi(n){const{width:t,height:e}=n;return{frameDurations:n.frameDurations.reverse(),getFrame:i=>{const s=n.frameDurations.length-1-i;return n.getFrame(s)},width:t,height:e}}function bi(n,t){const{width:e,height:i,getFrame:s}=n,o=t/ae(n);return{frameDurations:n.frameDurations.map(a=>z(a*o)),getFrame:s,width:e,height:i}}function Mi(n,t){const{width:e,height:i,getFrame:s}=n,o=n.frameDurations.slice(),a=o.shift();return o.unshift(z(a+t)),{frameDurations:o,getFrame:s,width:e,height:i}}function qt(n,t){const{width:e,height:i,getFrame:s}=n,o=n.frameDurations.slice(),a=o.pop();return o.push(z(a+t)),{frameDurations:o,getFrame:s,width:e,height:i}}class Ti{constructor(t,e,i,s){this._animation=t,this._repeatType=i,this._onFrameData=s,this._direction=1,this._currentFrame=0,this.timeToFrame=this._animation.frameDurations[this._currentFrame];let o=0;for(;e>o;)o+=this.timeToFrame,this.nextFrame();const a=this._animation.getFrame(this._currentFrame);this._onFrameData(a)}nextFrame(){if(this._currentFrame+=this._direction,this._direction>0){if(this._currentFrame===this._animation.frameDurations.length)switch(this._repeatType){case I.None:this._currentFrame-=this._direction;break;case I.Loop:this._currentFrame=0;break;case I.Oscillate:this._currentFrame-=this._direction,this._direction=-1}}else if(this._currentFrame===-1)switch(this._repeatType){case I.None:this._currentFrame-=this._direction;break;case I.Loop:this._currentFrame=this._animation.frameDurations.length-1;break;case I.Oscillate:this._currentFrame-=this._direction,this._direction=1}this.timeToFrame=this._animation.frameDurations[this._currentFrame];const t=this._animation.getFrame(this._currentFrame);this._onFrameData(t)}}function zi(n,t,e,i){let s,{repeatType:o}=t;if(o==null&&(o=I.Loop),t.reverseAnimation===!0&&(n=xi(n)),t.duration!=null&&(n=bi(n,z(1e3*t.duration))),t.repeatDelay!=null){const a=1e3*t.repeatDelay;o===I.Loop?n=qt(n,z(a)):o===I.Oscillate&&(n=Mi(qt(n,z(a/2)),z(a/2)))}if(t.startTimeOffset!=null)s=z(1e3*t.startTimeOffset);else if(t.randomizeStartTime!=null){const a=ke(e),r=82749913,l=t.randomizeStartSeed!=null?t.randomizeStartSeed:r,h=Ve(a,l);s=z(h*ae(n))}else s=z(0);return new Ti(n,s,o,i)}function Di(n,t,e,i){const s=t.playAnimation==null||t.playAnimation,o=zi(n,t,e,i);let a,r=o.timeToFrame;function l(){a=s?setTimeout(()=>{o.nextFrame(),r=o.timeToFrame,l()},r):void 0}return l(),{remove:()=>{s&&clearTimeout(a)}}}const Dt=document.createElement("canvas"),at=Dt.getContext("2d");function Si(n,t,e){Dt.width=t,Dt.height=e;const i=[],s=n.frameDurations.length;for(let o=0;o<s;o++){const a=n.getFrame(o);at.clearRect(0,0,t,e),a instanceof ImageData?at.drawImage(ii(a),0,0,t,e):at.drawImage(a,0,0,t,e),i.push(at.getImageData(0,0,t,e))}return{width:t,height:e,frameDurations:n.frameDurations,getFrame:o=>i[o]}}class $i{constructor(t,e,i,s){this._animation=t,this._frameData=null;const o=a=>{this._frameData=a,e.requestRender()};this.frameCount=this._animation.frameDurations.length,this.width=this._animation.width,this.height=this._animation.height,this._playHandle=Di(this._animation,i,s,o)}destroy(){this._playHandle.remove()}bindFrame(t,e,i){t.bindTexture(e,i),K(this._frameData)||(e.updateData(0,w,w,this._frameData.width,this._frameData.height,this._frameData),this._frameData=null)}}function Ii(n){switch(n.type){case"esriSMS":return`${n.style}.${n.path}`;case"esriSLS":return`${n.style}.${n.cap}`;case"esriSFS":return`${n.style}`;case"esriPFS":case"esriPMS":return n.imageData?`${n.imageData}${n.width}${n.height}`:`${n.url}${n.width}${n.height}`;default:return"mosaicHash"in n?n.mosaicHash:JSON.stringify(n)}}const Ht=ye(),Wt="arial-unicode-ms-regular",gt=126,oe=ee.getLogger("esri.views.2d.engine.webgl.TextureManager");function Zt(n,t){const e=Math.round(G(t)*window.devicePixelRatio),i=e>=128?2:4;return Math.min(n,e*i)}const vt=(n,t,e)=>oe.error(new P(n,t,e));class Rt{static fromMosaic(t,e){return new Rt(t,e.page,e.sdf)}constructor(t,e,i){this.mosaicType=t,this.page=e,this.sdf=i}}class zn{constructor(t,e,i){this._requestRender=t,this.resourceManager=e,this._allowNonPowerOfTwo=i,this._invalidFontsMap=new Map,this._sdfConverter=new yi(gt),this._bindingInfos=new Array,this._hashToBindingIndex=new Map,this._ongoingRasterizations=new Map,this._imageRequestQueue=new fe({concurrency:10,process:async(s,o)=>{ge(o);try{return await te(s,{responseType:"image",signal:o})}catch(a){throw Ft(a)?a:new P("mapview-invalid-resource",`Could not fetch requested resource at ${s}`,a)}}}),this._spriteMosaic=new Ct(2048,2048,500),this._glyphSource=new vi(`${ve.fontsUrl}/{fontstack}/{range}.pbf`),this._glyphMosaic=new pi(1024,1024,this._glyphSource),this._rasterizer=new Ne(e)}dispose(){this._spriteMosaic.dispose(),this._glyphMosaic.dispose(),this._rasterizer.dispose(),this._sdfConverter.dispose(),this._spriteMosaic=null,this._glyphMosaic=null,this._sdfConverter=null,this._hashToBindingIndex.clear(),this._hashToBindingIndex=null,this._bindingInfos=null,this._ongoingRasterizations.clear(),this._ongoingRasterizations=null,this._imageRequestQueue.clear(),this._imageRequestQueue=null}get sprites(){return this._spriteMosaic}get glyphs(){return this._glyphMosaic}async rasterizeItem(t,e,i,s){if(K(t))return vt("mapview-null-resource","Unable to rasterize null resource"),null;switch(t.type){case"text":case"esriTS":{const o=await this._rasterizeText(t,i,s);return o.forEach(a=>this._setTextureBinding(nt.GLYPH,a)),{glyphMosaicItems:o}}default:{if(qe(t))return vt("mapview-invalid-type",`MapView does not support symbol type: ${t.type}`,t),null;const o=await this._rasterizeSpriteSymbol(t,e,s);return ni(o)&&o&&this._setTextureBinding(nt.SPRITE,o),{spriteMosaicItem:o}}}}bindTextures(t,e,i,s=!1){if(i.textureBinding===0)return;const o=this._bindingInfos[i.textureBinding-1],a=o.page,r=s?zt.LINEAR_MIPMAP_LINEAR:zt.LINEAR;switch(o.mosaicType){case nt.SPRITE:{const l=this.sprites.getWidth(a),h=this.sprites.getHeight(a),u=tt(Ht,l,h);return this._spriteMosaic.bind(t,r,a,Ot),e.setUniform1i("u_texture",Ot),void e.setUniform2fv("u_mosaicSize",u)}case nt.GLYPH:{const l=this.glyphs.width,h=this.glyphs.height,u=tt(Ht,l,h);return this._glyphMosaic.bind(t,r,a,Lt),e.setUniform1i("u_texture",Lt),void e.setUniform2fv("u_mosaicSize",u)}default:oe.error("mapview-texture-manager",`Cannot handle unknown type ${o.mosaicType}`)}}_hashMosaic(t,e){return 1|t<<1|(e.sdf?1:0)<<2|e.page<<3}_setTextureBinding(t,e){const i=this._hashMosaic(t,e);if(!this._hashToBindingIndex.has(i)){const s=Rt.fromMosaic(t,e),o=this._bindingInfos.length+1;this._hashToBindingIndex.set(i,o),this._bindingInfos.push(s)}e.textureBinding=this._hashToBindingIndex.get(i)}async _rasterizeText(t,e,i){let s,o;if("cim"in t){const l=t;s=l.fontName,o=l.text}else{const l=t;s=Oe(l.font),o=l.text}const a=this._invalidFontsMap.has(s),r=e||He(Le(o)[0]);try{return await this._glyphMosaic.getGlyphItems(a?Wt:s,r,i)}catch{return vt("mapview-invalid-resource",`Couldn't find font ${s}. Falling back to Arial Unicode MS Regular`),this._invalidFontsMap.set(s,!0),this._glyphMosaic.getGlyphItems(Wt,r,i)}}async _rasterizeSpriteSymbol(t,e,i){if(We(t))return;const s=Ii(t);if(this._spriteMosaic.has(s))return this._spriteMosaic.getSpriteItem(s);if(Nt(t)||Ze(t)&&!Ye(t))return this._handleAsyncResource(s,t,i);const o=Be,a=this._rasterizer.rasterizeJSONResource(t,o);if(a){const{size:r,image:l,sdf:h,simplePattern:u,rasterizationScale:c}=a;return this._addItemToMosaic(s,r,{type:"static",data:l},st(t),h,u,c)}return new P("TextureManager","unrecognized or null rasterized image")}async _handleAsyncResource(t,e,i){if(this._ongoingRasterizations.has(t))return this._ongoingRasterizations.get(t);let s;s=Nt(e)?this._handleSVG(e,t,i):this._handleImage(e,t,i),this._ongoingRasterizations.set(t,s);try{await s,this._ongoingRasterizations.delete(t)}catch{this._ongoingRasterizations.delete(t)}return s}async _handleSVG(t,e,i){const s=[gt,gt],o=await this._sdfConverter.draw(t.path,i);return this._addItemToMosaic(e,s,{type:"static",data:new Uint32Array(o.buffer)},!1,!0,!0)}async _handleGIFOrPNG(t,e,i){const s=Bt(t);await this.resourceManager.fetchResource(s,i);let o=this.resourceManager.getResource(s);if(K(o))return new P("mapview-invalid-resource",`Could not fetch requested resource at ${s}.`);let a=o.width,r=o.height;if(o instanceof HTMLImageElement){t.type==="esriPMS"&&(a=Math.round(Zt(o.width,Ut(t))),r=Math.round(o.height*(a/o.width)));const c="cim"in t?t.cim.colorSubstitutions:void 0,{size:d,sdf:m,image:_}=this._rasterizer.rasterizeImageResource(a,r,o,c);return this._addItemToMosaic(e,d,{type:"static",data:_},st(t),m,!1)}this._allowNonPowerOfTwo||(a=Et(o.width+2*w)-2*w,r=Et(o.height+2*w)-2*w),a===o.width&&r===o.height||(o=Si(o,a,r));const l=t.animatedSymbolProperties||{},h=t.objectId,u=new $i(o,this._requestRender,l,h);return this._addItemToMosaic(e,[u.width,u.height],{type:"animated",data:u},st(t),!1,!1)}async _handleImage(t,e,i){var o;if(Xe(t)||Qe(t))return this._handleGIFOrPNG(t,e,i);const s=Bt(t);try{let a;const r=this.resourceManager.getResource(s);if(E(r)&&r instanceof HTMLImageElement)a=r;else{const{data:_}=await this._imageRequestQueue.push(s,{...i});a=_}if(je(s)){if("width"in t&&"height"in t)a.width=G(t.width),a.height=G(t.height);else if("cim"in t){const _=t.cim;a.width=G((o=_.width)!=null?o:_.scaleX*_.size),a.height=G(_.size)}}if(!a.width||!a.height)return null;let l=a.width,h=a.height;t.type==="esriPMS"&&(l=Math.round(Zt(a.width,Ut(t))),h=Math.round(a.height*(l/a.width)));const u="cim"in t?t.cim.colorSubstitutions:void 0,{size:c,sdf:d,image:m}=this._rasterizer.rasterizeImageResource(l,h,a,u);return this._addItemToMosaic(e,c,{type:"static",data:m},st(t),d,!1)}catch(a){if(!Ft(a))return new P("mapview-invalid-resource",`Could not fetch requested resource at ${s}. ${a.message}`)}}_addItemToMosaic(t,e,i,s,o,a,r){return this._spriteMosaic.addSpriteItem(t,e,i,s,o,a,r)}}const Dn={shaders:{vertexShader:b("stencil/stencil.vert"),fragmentShader:b("stencil/stencil.frag")},attributes:new Map([["a_pos",0]])},Ci=n=>n.replace("-","_").toUpperCase(),Yt=n=>`#define ${Ci(n)}
`;function Xt(n){return{attributes:new Map([["a_pos",0],["a_tex",1]]),shaders:{vertexShader:Yt(n)+b("blend/blend.vert"),fragmentShader:Yt(n)+b("blend/blend.frag")}}}const Qt=ee.getLogger("esri.views.2d.engine.webgl.effects.blendEffects.BlendEffect");class Sn{constructor(){this._size=[0,0]}dispose(t){this._backBufferTexture=At(this._backBufferTexture),this._quad=At(this._quad)}draw(t,e,i,s,o){const{context:a,drawPhase:r}=t;if(this._setupShader(a),s&&s!=="normal"&&r!==Je.LABEL)return void this._drawBlended(t,e,i,s,o);const l=Xt("normal"),h=a.programCache.acquire(l.shaders.vertexShader,l.shaders.fragmentShader,l.attributes);if(!h)return void Qt.error(new P("mapview-BlendEffect",'Error creating shader program for blend mode "normal"'));a.useProgram(h),e.setSamplingMode(i),a.bindTexture(e,0),h.setUniform1i("u_layerTexture",0),h.setUniform1f("u_opacity",o),a.setBlendingEnabled(!0),a.setBlendFunction(L.ONE,L.ONE_MINUS_SRC_ALPHA);const u=this._quad;u.draw(),u.unbind(),h.dispose()}_drawBlended(t,e,i,s,o){const{context:a,state:r,pixelRatio:l,inFadeTransition:h}=t,{size:u}=r,c=a.getBoundFramebufferObject();let d,m;if(E(c)){const A=c.descriptor;d=A.width,m=A.height}else d=Math.round(l*u[0]),m=Math.round(l*u[1]);this._createOrResizeTexture(t,d,m);const _=this._backBufferTexture;c.copyToTexture(0,0,d,m,0,0,_),a.setStencilTestEnabled(!1),a.setStencilWriteMask(0),a.setBlendingEnabled(!0),a.setDepthTestEnabled(!1),a.setDepthWriteEnabled(!1);const f=Xt(s),y=a.programCache.acquire(f.shaders.vertexShader,f.shaders.fragmentShader,f.attributes);if(!y)return void Qt.error(new P("mapview-BlendEffect",`Error creating shader program for blend mode ${s}`));a.useProgram(y),_.setSamplingMode(i),a.bindTexture(_,0),y.setUniform1i("u_backbufferTexture",0),e.setSamplingMode(i),a.bindTexture(e,1),y.setUniform1i("u_layerTexture",1),y.setUniform1f("u_opacity",o),y.setUniform1f("u_inFadeOpacity",h?1:0),a.setBlendFunction(L.ONE,L.ZERO);const v=this._quad;v.draw(),v.unbind(),y.dispose(),a.setBlendFunction(L.ONE,L.ONE_MINUS_SRC_ALPHA)}_setupShader(t){this._quad||(this._quad=new de(t,[-1,-1,1,-1,-1,1,1,1]))}_createOrResizeTexture(t,e,i){const{context:s}=t;this._backBufferTexture!==null&&e===this._size[0]&&i===this._size[1]||(this._backBufferTexture?this._backBufferTexture.resize(e,i):this._backBufferTexture=new It(s,{target:Ke.TEXTURE_2D,pixelFormat:ct.RGBA,internalFormat:ct.RGBA,dataType:$t.UNSIGNED_BYTE,wrapMode:ti.CLAMP_TO_EDGE,samplingMode:zt.LINEAR,flipped:!1,width:e,height:i}),this._size[0]=e,this._size[1]=i)}}const $n={shaders:{vertexShader:b("highlight/textured.vert"),fragmentShader:b("highlight/highlight.frag")},attributes:new Map([["a_position",0],["a_texcoord",1]])},In={shaders:{vertexShader:b("highlight/textured.vert"),fragmentShader:b("highlight/blur.frag")},attributes:new Map([["a_position",0],["a_texcoord",1]])},M=St("esri-2d-profiler");class Cn{constructor(t,e){if(this._events=new we,this._entries=new Map,this._timings=new si(10),this._currentContainer=null,this._currentPass=null,this._currentBrush=null,this._currentSummary=null,!M)return;this._ext=ai(t.gl,{}),this._debugOutput=e;const i=t.gl;if(this.enableCommandLogging){for(const s in i)if(typeof i[s]=="function"){const o=i[s],a=s.includes("draw");i[s]=(...r)=>(this._events.emit("command",{container:this._currentContainer,pass:this._currentPass,brush:this._currentBrush,method:s,args:r,isDrawCommand:a}),this._currentSummary&&(this._currentSummary.commands++,a&&this._currentSummary.drawCommands++),o.apply(i,r))}}}get enableCommandLogging(){return!(typeof M=="object"&&M.disableCommands)}recordContainerStart(t){M&&(this._currentContainer=t)}recordContainerEnd(){M&&(this._currentContainer=null)}recordPassStart(t){M&&(this._currentPass=t,this._initSummary())}recordPassEnd(){M&&(this._currentPass=null,this._emitSummary())}recordBrushStart(t){M&&(this._currentBrush=t)}recordBrushEnd(){M&&(this._currentBrush=null)}recordStart(t){if(M&&E(this._ext)){if(this._entries.has(t)){const i=this._entries.get(t),s=this._ext.resultAvailable(i.query),o=this._ext.disjoint();if(s&&!o){const a=this._ext.getResult(i.query)/1e6;let r=0;if(E(this._timings.enqueue(a))){const u=this._timings.entries,c=u.length;let d=0;for(const m of u)d+=m;r=d/c}const l=a.toFixed(2),h=r?r.toFixed(2):"--";this.enableCommandLogging?(console.groupCollapsed(`Frame report for ${t}, ${l} ms (${h} last 10 avg)
${i.commandsLen} Commands (${i.drawCommands} draw)`),console.log("RenderPass breakdown: "),console.table(i.summaries),console.log("Commands: ",i.commands),console.groupEnd()):console.log(`Frame report for ${t}, ${l} ms (${h} last 10 avg)`),this._debugOutput.innerHTML=`${l} (${h})`}for(const a of i.handles)a.remove();this._ext.deleteQuery(i.query),this._entries.delete(t)}const e={name:t,query:this._ext.createQuery(),commands:[],commandsLen:0,drawCommands:0,summaries:[],handles:[]};this.enableCommandLogging&&(e.handles.push(this._events.on("command",i=>{e.commandsLen++,e.commands.push(i),i.isDrawCommand&&e.drawCommands++})),e.handles.push(this._events.on("summary",i=>{e.summaries.push(i)}))),this._ext.beginTimeElapsed(e.query),this._entries.set(t,e)}}recordEnd(t){M&&E(this._ext)&&this._entries.has(t)&&this._ext.endTimeElapsed()}_initSummary(){this.enableCommandLogging&&(this._currentSummary={container:this._currentContainer,pass:this._currentPass,drawCommands:0,commands:0})}_emitSummary(){this.enableCommandLogging&&this._currentSummary&&this._events.emit("summary",this._currentSummary)}}const ot=2,S=1,Q=0,j=1,J=2;class Ri{constructor(t,e,i){this._debugMap=new Map,this._width=t*i,this._height=e*i,this._pixelRatio=i;const s=Math.ceil(this._width/S),o=Math.ceil(this._height/S);this._cols=s,this._rows=o,this._cells=oi.create(s*o)}insertMetrics(t){const e=this._hasCollision(t);return e===Q&&this._markMetrics(t),e}getCellId(t,e){return t+e*this._cols}has(t){return this._cells.has(t)}hasRange(t,e){return this._cells.hasRange(t,e)}set(t){this._cells.set(t)}setRange(t,e){this._cells.setRange(t,e)}_collide(t,e,i,s){const o=t-i/2,a=e-s/2,r=o+i,l=a+s;if(r<0||l<0||o>this._width||a>this._height)return j;const h=T(Math.floor(o/S),0,this._cols),u=T(Math.floor(a/S),0,this._rows),c=T(Math.ceil(r/S),0,this._cols),d=T(Math.ceil(l/S),0,this._rows);for(let m=u;m<=d;m++)for(let _=h;_<=c;_++){const f=this.getCellId(_,m);if(this.has(f))return J}return Q}_mark(t,e,i,s,o){const a=t-i/2,r=e-s/2,l=a+i,h=r+s,u=T(Math.floor(a/S),0,this._cols),c=T(Math.floor(r/S),0,this._rows),d=T(Math.ceil(l/S),0,this._cols),m=T(Math.ceil(h/S),0,this._rows);for(let _=c;_<=m;_++)for(let f=u;f<=d;f++){const y=this.getCellId(f,_);this._debugMap.set(y,o),this.set(y)}return!1}_hasCollision(t){const e=t.id;let i=0,s=0;t.save();do{const o=t.boundsCount;i+=o;for(let a=0;a<o;a++){const r=t.boundsComputedAnchorX(a),l=t.boundsComputedAnchorY(a),h=(t.boundsWidth(a)+ot)*this._pixelRatio,u=(t.boundsHeight(a)+ot)*this._pixelRatio;switch(this._collide(r,l,h,u)){case J:return J;case j:s++}}}while(t.peekId()===e&&t.next());return t.restore(),i===s?j:Q}_markMetrics(t){const e=t.id;t.save();do{const i=t.boundsCount;for(let s=0;s<i;s++){const o=t.boundsComputedAnchorX(s),a=t.boundsComputedAnchorY(s),r=(t.boundsWidth(s)+ot)*this._pixelRatio,l=(t.boundsHeight(s)+ot)*this._pixelRatio;this._mark(o,a,r,l,t.id)}}while(t.peekId()===e&&t.next());t.restore()}}const Pi=Math.PI;function re(n,t){switch(t.transformationType){case C.Additive:return Fi(n,t);case C.Constant:return Ei(t,n);case C.ClampedLinear:return Ai(n,t);case C.Proportional:return ki(n,t);case C.Stops:return Vi(n,t);case C.RealWorldSize:return Li(n,t);case C.Identity:return n;case C.Unknown:return null}}function D(n,t){return typeof n=="number"?n:re(t,n)}function Fi(n,t){return n+(D(t.minSize,n)||t.minDataValue)}function Ei(n,t){const e=n.stops;let i=e&&e.length&&e[0].size;return i==null&&(i=n.minSize),D(i,t)}function Ai(n,t){const e=t.minDataValue,i=t.maxDataValue,s=(n-e)/(i-e),o=D(t.minSize,n),a=D(t.maxSize,n);return n<=e?o:n>=i?a:o+s*(a-o)}function ki(n,t){const e=n/t.minDataValue,i=D(t.minSize,n),s=D(t.maxSize,n);let o=null;return o=e*i,T(o,i,s)}function Vi(n,t){const[e,i,s]=Oi(n,t.cache.ipData);if(e===i)return D(t.stops[e].size,n);{const o=D(t.stops[e].size,n);return o+(D(t.stops[i].size,n)-o)*s}}function Li(n,t){const e=xe[t.valueUnit],i=D(t.minSize,n),s=D(t.maxSize,n),{valueRepresentation:o}=t;let a=null;return a=o==="area"?2*Math.sqrt(n/Pi)/e:o==="radius"||o==="distance"?2*n/e:n/e,T(a,i,s)}function Oi(n,t){if(!t)return;let e=0,i=t.length-1;return t.some((s,o)=>n<s?(i=o,!0):(e=o,!1)),[e,i,(n-t[e])/(t[i]-t[e])]}const yt=254,rt=255,Z=0;function N(n,t){const e=[];n.forEachTile(i=>e.push(i)),e.sort((i,s)=>i.instanceId-s.instanceId),e.forEach(i=>{E(i.labelMetrics)&&i.isReady&&t(i,i.labelMetrics.getCursor())})}function Ni(n){return n.layer&&(n.layer.type==="feature"||n.layer.type==="csv"||n.layer.type==="geojson"||n.layer.type==="ogc-feature"||n.layer.type==="stream"||n.layer.type==="subtype-group"||n.layer.type==="wfs")}function Bi(n){return t=>G(re(t,n))}function Ui(n){const t=n!=null&&"visualVariables"in n&&n.visualVariables;if(!t)return null;for(const e of t)if(e.type==="size")return Bi(e);return null}function Gi(n){for(const t of n){const e="featureReduction"in t&&t.featureReduction&&"labelingInfo"in t.featureReduction?t.featureReduction:void 0,i=[...t.labelingInfo||[],...(e==null?void 0:e.labelingInfo)||[]];if(!(!t.labelsVisible||!i.length)&&i.some(s=>s.deconflictionStrategy==="none"))return!0}return!1}function qi(n,t){var l;if(!Ni(t))return;const e=t.layer.type==="subtype-group"?t.layer.sublayers.items:[t.layer],i=t.layer.geometryType,s=!Gi(e),o={};if(t.layer.type!=="subtype-group"){if(((l=t.tileRenderer)==null?void 0:l.type)==="heatmap")return;const h=Ui(t.layer.renderer);o[0]=h}const a=t.tileRenderer;if(K(a))return;const r=t.layer.visible&&!t.suspended;n.push({tileRenderer:a,vvEvaluators:o,deconflictionEnabled:s,geometryType:i,visible:r})}class Hi{run(t,e,i){const s=[];for(let o=t.length-1;o>=0;o--)qi(s,t[o]);this._transformMetrics(s),this._runCollision(s,e,i)}_runCollision(t,e,i){const[s,o]=e.state.size,a=new Ri(s,o,e.pixelRatio);for(const{tileRenderer:r,deconflictionEnabled:l,visible:h}of t){const u=r.featuresView.attributeView;l?h?(this._prepare(r),this._collideVisible(a,r,i),this._collideInvisible(a,r)):N(r,(c,d)=>{for(;d.nextId();)u.setLabelMinZoom(d.id,rt)}):N(r,(c,d)=>{for(;d.nextId();)u.setLabelMinZoom(d.id,Z),h&&a.insertMetrics(d)})}}_isFiltered(t,e,i){const s=e.getFilterFlags(t),o=!i.hasFilter||!!(s&Ue),a=K(i.featureEffect)||i.featureEffect.excludedLabelsVisible||!!(s&Ge);return!(o&&a)}_prepare(t){const e=t.featuresView.attributeView,i=new Set;N(t,(s,o)=>{for(;o.nextId();)if(!i.has(o.id)){if(i.add(o.id),this._isFiltered(o.id,e,t.layerView)){e.setLabelMinZoom(o.id,yt);continue}e.getLabelMinZoom(o.id)!==Z?e.setLabelMinZoom(o.id,rt):e.setLabelMinZoom(o.id,Z)}})}_collideVisible(t,e,i){const s=e.featuresView.attributeView,o=new Set;N(e,(a,r)=>{for(;r.nextId();)if(!o.has(r.id))if(a.key.level===i){if(s.getLabelMinZoom(r.id)===0)switch(t.insertMetrics(r)){case j:break;case J:s.setLabelMinZoom(r.id,yt),o.add(r.id);break;case Q:s.setLabelMinZoom(r.id,Z),o.add(r.id)}}else s.setLabelMinZoom(r.id,yt)})}_collideInvisible(t,e){const i=e.featuresView.attributeView,s=new Set;N(e,(o,a)=>{for(;a.nextId();)if(!s.has(a.id)&&i.getLabelMinZoom(a.id)===rt)switch(t.insertMetrics(a)){case j:break;case J:i.setLabelMinZoom(a.id,rt),s.add(a.id);break;case Q:i.setLabelMinZoom(a.id,Z),s.add(a.id)}})}_transformMetrics(t){for(const{tileRenderer:e,geometryType:i,vvEvaluators:s}of t)N(e,(o,a)=>{const r=e.featuresView.attributeView,l=o.transforms.labelMat2d;l[4]=Math.round(l[4]),l[5]=Math.round(l[5]);const h=i==="polyline";for(;a.next();){const u=a.boundsCount,c=a.anchorX,d=a.anchorY;let m=a.size;const _=s[0];if(E(_)){const v=_(r.getVVSize(a.id));m=isNaN(v)||v==null||v===1/0?m:v}const f=a.directionX*(m/2),y=a.directionY*(m/2);for(let v=0;v<u;v++){let A=c,ft=a.anchorY;if(h){let k=A+a.boundsX(v)+f,V=ft+a.boundsY(v)+y;k=l[0]*k+l[2]*V+l[4],V=l[1]*k+l[3]*V+l[5],a.setBoundsComputedAnchorX(v,Math.floor(k)),a.setBoundsComputedAnchorY(v,Math.floor(V))}else{A=l[0]*c+l[2]*d+l[4],ft=l[1]*c+l[3]*d+l[5];const k=A+a.boundsX(v)+f,V=ft+a.boundsY(v)+y;a.setBoundsComputedAnchorX(v,k),a.setBoundsComputedAnchorY(v,V)}}}})}}const Wi=32;let F=class extends be(H){constructor(n){super(n),this._applyVisibilityPassThrottled=Me(this._applyVisibilityPass,Wi,this),this.lastUpdateId=-1,this.updateRequested=!1,this.view=null}initialize(){this.collisionEngine=new Hi}destroy(){this.collisionEngine=null,this._applyVisibilityPassThrottled=Te(this._applyVisibilityPassThrottled)}get updating(){return St("esri-2d-log-updating")&&console.log(`Updating LabelManager ${this.updateRequested}:
-> updateRequested: ${this.updateRequested}`),this.updateRequested}update(n){this._applyVisibilityPassThrottled(n)}viewChange(){this.requestUpdate()}requestUpdate(){var n;this.updateRequested||(this.updateRequested=!0,(n=this.view)==null||n.requestUpdate())}processUpdate(n){this._set("updateParameters",n),this.updateRequested&&(this.updateRequested=!1,this.update(n))}_applyVisibilityPass(n){const t=this.view;if(t)try{const e=t.featuresTilingScheme.getClosestInfoForScale(n.state.scale).level;this.collisionEngine.run(t.allLayerViews.items,n,e)}catch{}}};p([g()],F.prototype,"updateRequested",void 0),p([g({readOnly:!0})],F.prototype,"updateParameters",void 0),p([g()],F.prototype,"updating",null),p([g()],F.prototype,"view",void 0),F=p([q("esri.views.2d.layers.labels.LabelManager")],F);const Rn=F,lt="esri-zoom-box",ht={container:`${lt}__container`,overlay:`${lt}__overlay`,background:`${lt}__overlay-background`,box:`${lt}__outline`},wt={zoom:"Shift",counter:"Ctrl"};let Y=class extends H{constructor(n){super(n),this._container=null,this._overlay=null,this._backgroundShape=null,this._boxShape=null,this._box={x:0,y:0,width:0,height:0},this._rafId=null,this._handles=null,this._redraw=this._redraw.bind(this)}destroy(){this.view=null}set view(n){this._handles&&this._handles.forEach(t=>{t.remove()}),this._handles=null,this._destroyOverlay(),this._set("view",n),n&&(n.on("drag",[wt.zoom],t=>this._handleDrag(t,1),kt.INTERNAL),n.on("drag",[wt.zoom,wt.counter],t=>this._handleDrag(t,-1),kt.INTERNAL))}_start(){this._createContainer(),this._createOverlay(),this.navigation.begin()}_update(n,t,e,i){this._box.x=n,this._box.y=t,this._box.width=e,this._box.height=i,this._rafId||(this._rafId=requestAnimationFrame(this._redraw))}_end(n,t,e,i,s){const o=this.view,a=o.toMap(ze(n+.5*e,t+.5*i));let r=Math.max(e/o.width,i/o.height);s===-1&&(r=1/r),this._destroyOverlay(),this.navigation.end(),o.goTo({center:a,scale:o.scale*r})}_updateBox(n,t,e,i){const s=this._boxShape;s.setAttributeNS(null,"x",""+n),s.setAttributeNS(null,"y",""+t),s.setAttributeNS(null,"width",""+e),s.setAttributeNS(null,"height",""+i),s.setAttributeNS(null,"class",ht.box)}_updateBackground(n,t,e,i){this._backgroundShape.setAttributeNS(null,"d",this._toSVGPath(n,t,e,i,this.view.width,this.view.height))}_createContainer(){const n=document.createElement("div");n.className=ht.container,this.view.root.appendChild(n),this._container=n}_createOverlay(){const n=this.view.width,t=this.view.height,e=document.createElementNS("http://www.w3.org/2000/svg","path");e.setAttributeNS(null,"d","M 0 0 L "+n+" 0 L "+n+" "+t+" L 0 "+t+" Z"),e.setAttributeNS(null,"class",ht.background);const i=document.createElementNS("http://www.w3.org/2000/svg","rect"),s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),s.setAttributeNS(null,"class",ht.overlay),s.appendChild(e),s.appendChild(i),this._container.appendChild(s),this._backgroundShape=e,this._boxShape=i,this._overlay=s}_destroyOverlay(){this._container&&this._container.parentNode&&this._container.parentNode.removeChild(this._container),this._container=this._backgroundShape=this._boxShape=this._overlay=null}_toSVGPath(n,t,e,i,s,o){const a=n+e,r=t+i;return"M 0 0 L "+s+" 0 L "+s+" "+o+" L 0 "+o+" ZM "+n+" "+t+" L "+n+" "+r+" L "+a+" "+r+" L "+a+" "+t+" Z"}_handleDrag(n,t){const e=n.x,i=n.y,s=n.origin.x,o=n.origin.y;let a,r,l,h;switch(e>s?(a=s,l=e-s):(a=e,l=s-e),i>o?(r=o,h=i-o):(r=i,h=o-i),n.action){case"start":this._start();break;case"update":this._update(a,r,l,h);break;case"end":this._end(a,r,l,h,t)}n.stopPropagation()}_redraw(){if(!this._rafId||(this._rafId=null,!this._overlay))return;const{x:n,y:t,width:e,height:i}=this._box;this._updateBox(n,t,e,i),this._updateBackground(n,t,e,i),this._rafId=requestAnimationFrame(this._redraw)}};p([g()],Y.prototype,"navigation",void 0),p([g()],Y.prototype,"view",null),Y=p([q("esri.views.2d.navigation.ZoomBox")],Y);const Zi=Y;class R{constructor(t){this._gain=t,this.lastValue=void 0,this.filteredDelta=void 0}update(t){if(this.hasLastValue()){const e=this.computeDelta(t);this._updateDelta(e)}this.lastValue=t}reset(){this.lastValue=void 0,this.filteredDelta=void 0}hasLastValue(){return this.lastValue!==void 0}hasFilteredDelta(){return this.filteredDelta!==void 0}computeDelta(t){return this.lastValue===void 0?NaN:t-this.lastValue}_updateDelta(t){this.filteredDelta!==void 0?this.filteredDelta=(1-this._gain)*this.filteredDelta+this._gain*t:this.filteredDelta=t}}class Pt{constructor(t,e,i){this._initialVelocity=t,this._stopVelocity=e,this._friction=i,this._duration=Math.abs(Math.log(Math.abs(this._initialVelocity)/this._stopVelocity)/Math.log(1-this._friction))}get duration(){return this._duration}isFinished(t){return t>this.duration}get friction(){return this._friction}value(t){return this.valueFromInitialVelocity(this._initialVelocity,t)}valueDelta(t,e){const i=this.value(t);return this.value(t+e)-i}valueFromInitialVelocity(t,e){e=Math.min(e,this.duration);const i=1-this.friction;return t*(i**e-1)/Math.log(i)}}class Yi extends Pt{constructor(t,e,i,s,o){super(t,e,i),this._sceneVelocity=s,this.direction=o}value(t){return super.valueFromInitialVelocity(this._sceneVelocity,t)}}class Xi{constructor(t=300,e=12,i=.84){this._minimumInitialVelocity=t,this._stopVelocity=e,this._friction=i,this.enabled=!0,this._time=new R(.6),this._screen=[new R(.4),new R(.4)],this._scene=[new R(.6),new R(.6),new R(.6)],this._tmpDirection=ie()}add(t,e,i){if(this.enabled){if(this._time.hasLastValue()&&this._time.computeDelta(i)<.015)return;this._screen[0].update(t[0]),this._screen[1].update(t[1]),this._scene[0].update(e[0]),this._scene[1].update(e[1]),this._scene[2].update(e[2]),this._time.update(i)}}reset(){this._screen[0].reset(),this._screen[1].reset(),this._scene[0].reset(),this._scene[1].reset(),this._scene[2].reset(),this._time.reset()}evaluateMomentum(){if(!this.enabled||!this._screen[0].hasFilteredDelta()||!this._time.hasFilteredDelta())return null;const t=this._screen[0].filteredDelta,e=this._screen[1].filteredDelta,i=t==null||e==null?0:Math.sqrt(t*t+e*e),s=this._time.filteredDelta,o=s==null||i==null?0:i/s;return Math.abs(o)<this._minimumInitialVelocity?null:this.createMomentum(o,this._stopVelocity,this._friction)}createMomentum(t,e,i){var a,r,l;De(this._tmpDirection,(a=this._scene[0].filteredDelta)!=null?a:0,(r=this._scene[1].filteredDelta)!=null?r:0,(l=this._scene[2].filteredDelta)!=null?l:0);const s=Se(this._tmpDirection);s>0&&ne(this._tmpDirection,this._tmpDirection,1/s);const o=this._time.filteredDelta;return new Yi(t,e,i,o==null?0:s/o,this._tmpDirection)}}let B=class extends H{constructor(n){super(n),this.animationTime=0,this.momentumEstimator=new Xi(500,6,.92),this.momentum=null,this.tmpMomentum=ie(),this.momentumFinished=!1,this.viewpoint=new _t({targetGeometry:new pt,scale:0,rotation:0}),this._previousDrag=null,se(()=>this.momentumFinished,()=>this.navigation.stop())}begin(n,t){this.navigation.begin(),this.momentumEstimator.reset(),this.addToEstimator(t),this._previousDrag=t}update(n,t){this.addToEstimator(t);let e=t.center.x,i=t.center.y;const s=this._previousDrag;e=s?s.center.x-e:-e,i=s?i-s.center.y:i,n.viewpoint=dt(this.viewpoint,n.viewpoint,[e||0,i||0]),this._previousDrag=t}end(n,t){this.addToEstimator(t);const e=n.navigation.momentumEnabled;this.momentum=e?this.momentumEstimator.evaluateMomentum():null,this.animationTime=0,this.momentum&&this.onAnimationUpdate(n),this._previousDrag=null,this.navigation.end()}addToEstimator(n){const t=n.center.x,e=n.center.y,i=$e(-t,e),s=Ie(-t,e,0);this.momentumEstimator.add(i,s,.001*n.timestamp)}onAnimationUpdate(n){var t;(t=this.navigation.animationManager)==null||t.animateContinous(n.viewpoint,(e,i)=>{const{momentum:s,animationTime:o,tmpMomentum:a}=this,r=.001*i;if(!(this.momentumFinished=!s||s.isFinished(o))){const l=s.valueDelta(o,r);ne(a,s.direction,l),dt(e,e,a),n.constraints.constrainByGeometry(e)}this.animationTime+=r})}stopMomentumNavigation(){this.momentum&&(this.momentumEstimator.reset(),this.momentum=null,this.navigation.stop())}};p([g()],B.prototype,"momentumFinished",void 0),p([g()],B.prototype,"viewpoint",void 0),p([g()],B.prototype,"navigation",void 0),B=p([q("esri.views.2d.navigation.actions.Pan")],B);const Qi=B;class le{constructor(t=2.5,e=.01,i=.95,s=12){this._minimumInitialVelocity=t,this._stopVelocity=e,this._friction=i,this._maxVelocity=s,this.enabled=!0,this.value=new R(.8),this.time=new R(.3)}add(t,e){if(this.enabled&&e!=null){if(this.time.hasLastValue()){if(this.time.computeDelta(e)<.01)return;if(this.value.hasFilteredDelta()){const i=this.value.computeDelta(t);this.value.filteredDelta*i<0&&this.value.reset()}}this.time.update(e),this.value.update(t)}}reset(){this.value.reset(),this.time.reset()}evaluateMomentum(){if(!this.enabled||!this.value.hasFilteredDelta()||!this.time.hasFilteredDelta())return null;let t=this.value.filteredDelta/this.time.filteredDelta;return t=T(t,-this._maxVelocity,this._maxVelocity),Math.abs(t)<this._minimumInitialVelocity?null:this.createMomentum(t,this._stopVelocity,this._friction)}createMomentum(t,e,i){return new Pt(t,e,i)}}class ji extends le{constructor(t=3,e=.01,i=.95,s=12){super(t,e,i,s)}add(t,e){const i=this.value.lastValue;if(i!=null){let s=t-i;for(;s>Math.PI;)s-=2*Math.PI;for(;s<-Math.PI;)s+=2*Math.PI;t=i+s}super.add(t,e)}}class Ji extends Pt{constructor(t,e,i){super(t,e,i)}value(t){const e=super.value(t);return Math.exp(e)}valueDelta(t,e){const i=super.value(t),s=super.value(t+e)-i;return Math.exp(s)}}class Ki extends le{constructor(t=2.5,e=.01,i=.95,s=12){super(t,e,i,s)}add(t,e){super.add(Math.log(t),e)}createMomentum(t,e,i){return new Ji(t,e,i)}}let U=class extends H{constructor(n){super(n),this._animationTime=0,this._momentumFinished=!1,this._previousAngle=0,this._previousRadius=0,this._previousCenter=null,this._rotationMomentumEstimator=new ji(.6,.15,.95),this._rotationDirection=1,this._startAngle=0,this._startRadius=0,this._updateTimestamp=null,this._zoomDirection=1,this._zoomMomentumEstimator=new Ki,this._zoomOnly=null,this.zoomMomentum=null,this.rotateMomentum=null,this.viewpoint=new _t({targetGeometry:new pt,scale:0,rotation:0}),this.addHandles(se(()=>this._momentumFinished,()=>this.navigation.stop()))}begin(n,t){this.navigation.begin(),this._rotationMomentumEstimator.reset(),this._zoomMomentumEstimator.reset(),this._zoomOnly=null,this._previousAngle=this._startAngle=t.angle,this._previousRadius=this._startRadius=t.radius,this._previousCenter=t.center,this._updateTimestamp=null,n.constraints.rotationEnabled&&this.addToRotateEstimator(0,t.timestamp),this.addToZoomEstimator(t,1)}update(n,t){this._updateTimestamp===null&&(this._updateTimestamp=t.timestamp);const e=t.angle,i=t.radius,s=t.center,o=Math.abs(180*(e-this._startAngle)/Math.PI),a=Math.abs(i-this._startRadius),r=this._startRadius/i;if(this._previousRadius&&this._previousCenter){const l=i/this._previousRadius;let h=180*(e-this._previousAngle)/Math.PI;this._rotationDirection=h>=0?1:-1,this._zoomDirection=l>=1?1:-1,n.constraints.rotationEnabled?(this._zoomOnly===null&&t.timestamp-this._updateTimestamp>200&&(this._zoomOnly=a-o>0),this._zoomOnly===null||this._zoomOnly?h=0:this.addToRotateEstimator(e-this._startAngle,t.timestamp)):h=0,this.addToZoomEstimator(t,r),this.navigation.setViewpoint([s.x,s.y],1/l,h,[this._previousCenter.x-s.x,s.y-this._previousCenter.y])}this._previousAngle=e,this._previousRadius=i,this._previousCenter=s}end(n){this.rotateMomentum=this._rotationMomentumEstimator.evaluateMomentum(),this.zoomMomentum=this._zoomMomentumEstimator.evaluateMomentum(),this._animationTime=0,(this.rotateMomentum||this.zoomMomentum)&&this.onAnimationUpdate(n),this.navigation.end()}addToRotateEstimator(n,t){this._rotationMomentumEstimator.add(n,.001*t)}addToZoomEstimator(n,t){this._zoomMomentumEstimator.add(t,.001*n.timestamp)}canZoomIn(n){const t=n.scale,e=n.constraints.effectiveMaxScale;return e===0||t>e}canZoomOut(n){const t=n.scale,e=n.constraints.effectiveMinScale;return e===0||t<e}onAnimationUpdate(n){var t;(t=this.navigation.animationManager)==null||t.animateContinous(n.viewpoint,(e,i)=>{const s=!this.canZoomIn(n)&&this._zoomDirection>1||!this.canZoomOut(n)&&this._zoomDirection<1,o=!this.rotateMomentum||this.rotateMomentum.isFinished(this._animationTime),a=s||!this.zoomMomentum||this.zoomMomentum.isFinished(this._animationTime),r=.001*i;if(this._momentumFinished=o&&a,!this._momentumFinished){const l=this.rotateMomentum?Math.abs(this.rotateMomentum.valueDelta(this._animationTime,r))*this._rotationDirection*180/Math.PI:0;let h=this.zoomMomentum?Math.abs(this.zoomMomentum.valueDelta(this._animationTime,r)):1;const u=et(),c=et();if(this._previousCenter){tt(u,this._previousCenter.x,this._previousCenter.y),Ce(c,n.size,n.padding),Re(u,u,c);const{constraints:d,scale:m}=n,_=m*h;h<1&&!d.canZoomInTo(_)?(h=m/d.effectiveMaxScale,this.zoomMomentum=null,this.rotateMomentum=null):h>1&&!d.canZoomOutTo(_)&&(h=m/d.effectiveMinScale,this.zoomMomentum=null,this.rotateMomentum=null),Pe(e,n.viewpoint,h,l,u,n.size),n.constraints.constrainByGeometry(e)}}this._animationTime+=r})}stopMomentumNavigation(){(this.rotateMomentum||this.zoomMomentum)&&(this.rotateMomentum&&(this._rotationMomentumEstimator.reset(),this.rotateMomentum=null),this.zoomMomentum&&(this._zoomMomentumEstimator.reset(),this.zoomMomentum=null),this.navigation.stop())}};p([g()],U.prototype,"_momentumFinished",void 0),p([g()],U.prototype,"viewpoint",void 0),p([g()],U.prototype,"navigation",void 0),U=p([q("esri.views.2d.navigation.actions.Pinch")],U);const tn=U,xt=et(),jt=et();let X=class extends H{constructor(n){super(n),this._previousCenter=et(),this.viewpoint=new _t({targetGeometry:new pt,scale:0,rotation:0})}begin(n,t){this.navigation.begin(),tt(this._previousCenter,t.center.x,t.center.y)}update(n,t){const{state:{size:e,padding:i}}=n;tt(xt,t.center.x,t.center.y),Fe(jt,e,i),n.viewpoint=Tt(this.viewpoint,n.state.paddedViewState.viewpoint,Ee(jt,this._previousCenter,xt)),Ae(this._previousCenter,xt)}end(){this.navigation.end()}};p([g()],X.prototype,"viewpoint",void 0),p([g()],X.prototype,"navigation",void 0),X=p([q("esri.views.2d.actions.Rotate")],X);const en=X,ut=10,Jt=1,bt=new _t({targetGeometry:new pt}),Mt=[0,0],Kt=250;let $=class extends H{constructor(n){super(n),this._endTimer=null,this._lastEventTimestamp=null,this.animationManager=null,this.interacting=!1}initialize(){this.pan=new Qi({navigation:this}),this.rotate=new en({navigation:this}),this.pinch=new tn({navigation:this}),this.zoomBox=new Zi({view:this.view,navigation:this})}destroy(){this.pan=it(this.pan),this.rotate=it(this.rotate),this.pinch=it(this.pinch),this.zoomBox=it(this.zoomBox),this.animationManager=null}begin(){this._set("interacting",!0)}end(){this._lastEventTimestamp=performance.now(),this._startTimer(Kt)}async zoom(n,t=this._getDefaultAnchor()){if(this.stop(),this.begin(),this.view.constraints.snapToZoom&&this.view.constraints.effectiveLODs)return n<1?this.zoomIn(t):this.zoomOut(t);this.setViewpoint(t,n,0,[0,0])}async zoomIn(n){const t=this.view,e=t.constraints.snapToNextScale(t.scale);return this._zoomToScale(e,n)}async zoomOut(n){const t=this.view,e=t.constraints.snapToPreviousScale(t.scale);return this._zoomToScale(e,n)}setViewpoint(n,t,e,i){this.begin(),this.view.state.viewpoint=this._scaleRotateTranslateViewpoint(this.view.viewpoint,n,t,e,i),this.end()}setViewpointImmediate(n,t=0,e=[0,0],i=this._getDefaultAnchor()){this.view.state.viewpoint=this._scaleRotateTranslateViewpoint(this.view.viewpoint,i,n,t,e)}continousRotateClockwise(){var t;const n=this.get("view.viewpoint");(t=this.animationManager)==null||t.animateContinous(n,e=>{Tt(e,e,-Jt)})}continousRotateCounterclockwise(){var t;const n=this.get("view.viewpoint");(t=this.animationManager)==null||t.animateContinous(n,e=>{Tt(e,e,Jt)})}resetRotation(){this.view.rotation=0}continousPanLeft(){this._continuousPan([-ut,0])}continousPanRight(){this._continuousPan([ut,0])}continousPanUp(){this._continuousPan([0,ut])}continousPanDown(){this._continuousPan([0,-ut])}stop(){var n;this.pan.stopMomentumNavigation(),(n=this.animationManager)==null||n.stop(),this.end(),this._endTimer!==null&&(clearTimeout(this._endTimer),this._endTimer=null,this._set("interacting",!1))}_continuousPan(n){var e;const t=this.view.viewpoint;(e=this.animationManager)==null||e.animateContinous(t,i=>{dt(i,i,n),this.view.constraints.constrainByGeometry(i)})}_startTimer(n){return this._endTimer!==null||(this._endTimer=setTimeout(()=>{var e;this._endTimer=null;const t=performance.now()-((e=this._lastEventTimestamp)!=null?e:0);t<Kt?this._endTimer=this._startTimer(t):this._set("interacting",!1)},n)),this._endTimer}_getDefaultAnchor(){const{size:n,padding:{left:t,right:e,top:i,bottom:s}}=this.view;return Mt[0]=.5*(n[0]-e+t),Mt[1]=.5*(n[1]-s+i),Mt}async _zoomToScale(n,t=this._getDefaultAnchor()){const{view:e}=this,{constraints:i,scale:s,viewpoint:o,size:a,padding:r}=e,l=i.canZoomInTo(n),h=i.canZoomOutTo(n);if(!(n<s&&!l||n>s&&!h))return Vt(bt,o,n/s,0,t,a,r),i.constrainByGeometry(bt),e.goTo(bt,{animate:!0})}_scaleRotateTranslateViewpoint(n,t,e,i,s){const{view:o}=this,{size:a,padding:r,constraints:l,scale:h,viewpoint:u}=o,c=h*e,d=l.canZoomInTo(c),m=l.canZoomOutTo(c);return(e<1&&!d||e>1&&!m)&&(e=1),dt(u,u,s),Vt(n,u,e,i,t,a,r),l.constrainByGeometry(n)}};p([g()],$.prototype,"animationManager",void 0),p([g({type:Boolean,readOnly:!0})],$.prototype,"interacting",void 0),p([g()],$.prototype,"pan",void 0),p([g()],$.prototype,"pinch",void 0),p([g()],$.prototype,"rotate",void 0),p([g()],$.prototype,"view",void 0),p([g()],$.prototype,"zoomBox",void 0),$=p([q("esri.views.2d.navigation.MapViewNavigation")],$);const Pn=$,nn={shaders:{vertexShader:b("magnifier/magnifier.vert"),fragmentShader:b("magnifier/magnifier.frag")},attributes:new Map([["a_pos",0]])};function Fn(n){return ue(n,nn)}export{zn as J,Sn as _,In as a,Fn as b,nn as c,Tn as e,Cn as i,Mn as n,Dn as r,$n as t,Rn as u,Pn as y};
