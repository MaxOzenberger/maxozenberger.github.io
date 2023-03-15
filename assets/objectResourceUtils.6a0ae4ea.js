import{ic as tt,a5 as d,p as fe,n as _,a as p,m as K,ai as ee,iS as Ft,_ as ot,r as Bt,jm as _e,h5 as Gt,hb as at,ha as he,ab as rt,ac as Be,h6 as kt,fq as Ut,f as Wt,t as we,nH as jt,nI as Ht,nJ as $e,cw as Ge,s as qt,nK as Yt,e2 as it,U as Xt,j as Jt,aR as nt,g as Kt,ka as ke,l9 as st,ne as ge,c8 as Zt,gd as Qt,hq as Ue,hh as eo,hi as We,nL as je,iW as to}from"./index.3255d2a5.js";import{e as lt}from"./mat3f64.9180efcb.js";import{o as ct,e as oo}from"./mat4f64.9070f685.js";import{i as ve,c as He,u as ao,x as Ne,L as ro,O as qe,E as io}from"./BufferView.32a50625.js";import{t as no,r as so,f as Ye,e as lo}from"./vec33.e7ec8171.js";import{m as co,n as uo,o as Y,r as k,a as mo,b as po,c as Xe,e as ho,t as vo,i as fo,f as go,d as xo}from"./DefaultMaterial_COLOR_GAMMA.e47429cc.js";import{t as Se}from"./resourceUtils.41b277ed.js";import{t as To}from"./NestedMap.2ac03b78.js";import{r as dt}from"./Version.3df17f25.js";import{t as bo}from"./requestImageUtils.828b299e.js";import{s as X}from"./Attribute.98e6fe67.js";import{u as C,n as B,e as se}from"./basicInterfaces.f8f3b23b.js";import{j as u,k as yo,aY as Co,aZ as Je,w as h,C as wo,a_ as Mo,aT as $o,F as Pe,o as O,g as ut,B as te,x as oe,a$ as ae,aF as re,f as U,y as W,ar as So,b0 as Re,b1 as mt,b2 as L,a5 as Ao,a6 as Oo,aS as Lo,b3 as ne,b4 as _o,a1 as ie,al as No,a2 as pt,b5 as Po,a3 as ht,b6 as Ro,b7 as Eo,au as b,b8 as Ee,at as Do,a4 as Vo,an as vt,ao as De,as as Ke,am as Io,b9 as le,z as zo,d as ft,aW as gt,ba as xt,u as xe,aq as Tt,aR as bt,m as yt,D as Te,bb as Ct,av as wt,b as be,bc as Mt,aj as Fo,bd as Bo,N as Go,s as ko,t as $t,h as Uo,i as Wo,E as jo,O as Ho,Q as qo,R as Yo,H as Xo,I as Jo,aK as Ko,J as Zo,ai as Qo,p as ue,T as ea,U as ta,G as St,v as At}from"./VertexColor.glsl.e3d82815.js";import{T as oa}from"./InterleavedLayout.a42ad5fa.js";import{o as a,b as J,W as aa,c as ra,A as ia,h as na,l as sa,d as la,_ as ca,f as da,S as ua}from"./OrderIndependentTransparency.43c6e481.js";import{O as T}from"./VertexAttribute.34e3daf1.js";import{o as ma,r as pa}from"./doublePrecisionUtils.d6c628ce.js";import{r as z}from"./symbolColorUtils.aa5ba02e.js";import{I as Ze,D as Qe,E as Ae}from"./enums.3c1fa5b5.js";function ha(e,t){const o=e.fragment;switch(o.code.add(a`struct ShadingNormalParameters {
vec3 normalView;
vec3 viewDirection;
} shadingParams;`),t.doubleSidedMode){case $.None:o.code.add(a`vec3 shadingNormal(ShadingNormalParameters params) {
return normalize(params.normalView);
}`);break;case $.View:o.code.add(a`vec3 shadingNormal(ShadingNormalParameters params) {
return dot(params.normalView, params.viewDirection) > 0.0 ? normalize(-params.normalView) : normalize(params.normalView);
}`);break;case $.WindingOrder:o.code.add(a`vec3 shadingNormal(ShadingNormalParameters params) {
return gl_FrontFacing ? normalize(params.normalView) : normalize(-params.normalView);
}`);break;default:tt(t.doubleSidedMode);case $.COUNT:}}var $;(function(e){e[e.None=0]="None",e[e.View=1]="View",e[e.WindingOrder=2]="WindingOrder",e[e.COUNT=3]="COUNT"})($||($={}));function Ot(e){e.vertex.code.add(a`vec4 offsetBackfacingClipPosition(vec4 posClip, vec3 posWorld, vec3 normalWorld, vec3 camPosWorld) {
vec3 camToVert = posWorld - camPosWorld;
bool isBackface = dot(camToVert, normalWorld) > 0.0;
if (isBackface) {
posClip.z += 0.0000003 * posClip.w;
}
return posClip;
}`)}class va extends yo{constructor(){super(...arguments),this.instancedDoublePrecision=!1}}function Lt(e,t){t.instanced&&t.instancedDoublePrecision&&(e.attributes.add(T.MODELORIGINHI,"vec3"),e.attributes.add(T.MODELORIGINLO,"vec3"),e.attributes.add(T.MODEL,"mat3"),e.attributes.add(T.MODELNORMAL,"mat3"));const o=e.vertex;t.instancedDoublePrecision&&(o.include(Co,t),o.uniforms.add(new Je("viewOriginHi",(r,n)=>ma(fe(me,n.camera.viewInverseTransposeMatrix[3],n.camera.viewInverseTransposeMatrix[7],n.camera.viewInverseTransposeMatrix[11]),me))),o.uniforms.add(new Je("viewOriginLo",(r,n)=>pa(fe(me,n.camera.viewInverseTransposeMatrix[3],n.camera.viewInverseTransposeMatrix[7],n.camera.viewInverseTransposeMatrix[11]),me)))),o.code.add(a`
    vec3 calculateVPos() {
      ${t.instancedDoublePrecision?"return model * localPosition().xyz;":"return localPosition().xyz;"}
    }
    `),o.code.add(a`
    vec3 subtractOrigin(vec3 _pos) {
      ${t.instancedDoublePrecision?a`
          vec3 originDelta = dpAdd(viewOriginHi, viewOriginLo, -modelOriginHi, -modelOriginLo);
          return _pos - originDelta;`:"return vpos;"}
    }
    `),o.code.add(a`
    vec3 dpNormal(vec4 _normal) {
      ${t.instancedDoublePrecision?"return normalize(modelNormal * _normal.xyz);":"return normalize(_normal.xyz);"}
    }
    `),t.output===h.Normal&&(wo(o),o.code.add(a`
    vec3 dpNormalView(vec4 _normal) {
      ${t.instancedDoublePrecision?"return normalize((viewNormal * vec4(modelNormal * _normal.xyz, 1.0)).xyz);":"return normalize((viewNormal * _normal).xyz);"}
    }
    `)),t.hasVertexTangents&&o.code.add(a`
    vec4 dpTransformVertexTangent(vec4 _tangent) {
      ${t.instancedDoublePrecision?"return vec4(modelNormal * _tangent.xyz, _tangent.w);":"return _tangent;"}

    }
    `)}d([u()],va.prototype,"instancedDoublePrecision",void 0);const me=_();function fa(e){e.vertex.code.add(a`
    vec4 decodeSymbolColor(vec4 symbolColor, out int colorMixMode) {
      float symbolAlpha = 0.0;

      const float maxTint = 85.0;
      const float maxReplace = 170.0;
      const float scaleAlpha = 3.0;

      if (symbolColor.a > maxReplace) {
        colorMixMode = ${a.int(z.Multiply)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxReplace);
      } else if (symbolColor.a > maxTint) {
        colorMixMode = ${a.int(z.Replace)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxTint);
      } else if (symbolColor.a > 0.0) {
        colorMixMode = ${a.int(z.Tint)};
        symbolAlpha = scaleAlpha * symbolColor.a;
      } else {
        colorMixMode = ${a.int(z.Multiply)};
        symbolAlpha = 0.0;
      }

      return vec4(symbolColor.r, symbolColor.g, symbolColor.b, symbolAlpha);
    }
  `)}function _t(e,t){t.hasSymbolColors?(e.include(fa),e.attributes.add(T.SYMBOLCOLOR,"vec4"),e.varyings.add("colorMixMode","mediump float"),e.vertex.code.add(a`int symbolColorMixMode;
vec4 getSymbolColor() {
return decodeSymbolColor(symbolColor, symbolColorMixMode) * 0.003921568627451;
}
void forwardColorMixMode() {
colorMixMode = float(symbolColorMixMode) + 0.5;
}`)):(e.fragment.uniforms.add(new Mo("colorMixMode",o=>$o[o.colorMixMode])),e.vertex.code.add(a`vec4 getSymbolColor() { return vec4(1.0); }
void forwardColorMixMode() {}`))}function ga(e){e.fragment.code.add(a`
    #define discardOrAdjustAlpha(color) { if (color.a < ${a.float(Pe)}) { discard; } }
  `)}function j(e,t){xa(e,t,new O("textureAlphaCutoff",o=>o.textureAlphaCutoff))}function xa(e,t,o){const r=e.fragment;switch(t.alphaDiscardMode!==C.Mask&&t.alphaDiscardMode!==C.MaskBlend||r.uniforms.add(o),t.alphaDiscardMode){case C.Blend:return e.include(ga);case C.Opaque:r.code.add(a`void discardOrAdjustAlpha(inout vec4 color) {
color.a = 1.0;
}`);break;case C.Mask:r.code.add(a`#define discardOrAdjustAlpha(color) { if (color.a < textureAlphaCutoff) { discard; } else { color.a = 1.0; } }`);break;case C.MaskBlend:e.fragment.code.add(a`#define discardOrAdjustAlpha(color) { if (color.a < textureAlphaCutoff) { discard; } }`)}}function Nt(e,t){const{vertex:o,fragment:r}=e,n=t.hasModelTransformation;n&&o.uniforms.add(new ut("model",c=>p(c.modelTransformation)?c.modelTransformation:ct));const i=t.hasColorTexture&&t.alphaDiscardMode!==C.Opaque;switch(t.output){case h.Depth:case h.Shadow:case h.ShadowHighlight:case h.ShadowExcludeHighlight:case h.ObjectAndLayerIdColor:te(o,t),e.include(oe,t),e.include(ae,t),e.include(re,t),e.include(Ao,t),e.include(W,t),e.include(Oo,t),Lo(e),e.varyings.add("depth","float"),i&&r.uniforms.add(new U("tex",c=>c.texture)),o.code.add(a`
          void main(void) {
            vpos = calculateVPos();
            vpos = subtractOrigin(vpos);
            vpos = addVerticalOffset(vpos, localOrigin);
            gl_Position = transformPositionWithDepth(proj, view, ${n?"model,":""} vpos, nearFar, depth);
            forwardTextureCoordinates();
            forwardObjectAndLayerIdColor();
          }
        `),e.include(j,t),r.code.add(a`
          void main(void) {
            discardBySlice(vpos);
            ${i?a`
                    vec4 texColor = texture2D(tex, ${t.hasColorTextureTransform?a`colorUV`:a`vuv0`});
                    discardOrAdjustAlpha(texColor);`:""}
            ${t.output===h.ObjectAndLayerIdColor?a`outputObjectAndLayerIdColor();`:a`outputDepth(depth);`}
          }
        `);break;case h.Normal:te(o,t),e.include(oe,t),e.include(Re,t),e.include(mt,t),e.include(ae,t),e.include(re,t),i&&r.uniforms.add(new U("tex",c=>c.texture)),e.varyings.add("vPositionView","vec3"),o.code.add(a`
          void main(void) {
            vpos = calculateVPos();
            vpos = subtractOrigin(vpos);
            ${t.normalType===L.Attribute?a`
            vNormalWorld = dpNormalView(vvLocalNormal(normalModel()));`:""}
            vpos = addVerticalOffset(vpos, localOrigin);
            gl_Position = transformPosition(proj, view, ${n?"model,":""} vpos);
            forwardTextureCoordinates();
          }
        `),e.include(W,t),e.include(j,t),r.code.add(a`
          void main() {
            discardBySlice(vpos);
            ${i?a`
                    vec4 texColor = texture2D(tex, ${t.hasColorTextureTransform?a`colorUV`:a`vuv0`});
                    discardOrAdjustAlpha(texColor);`:""}

            ${t.normalType===L.ScreenDerivative?a`
                vec3 normal = screenDerivativeNormal(vPositionView);`:a`
                vec3 normal = normalize(vNormalWorld);
                if (gl_FrontFacing == false) normal = -normal;`}
            gl_FragColor = vec4(vec3(0.5) + 0.5 * normal, 1.0);
          }
        `);break;case h.Highlight:te(o,t),e.include(oe,t),e.include(ae,t),e.include(re,t),i&&r.uniforms.add(new U("tex",c=>c.texture)),o.code.add(a`
          void main(void) {
            vpos = calculateVPos();
            vpos = subtractOrigin(vpos);
            vpos = addVerticalOffset(vpos, localOrigin);
            gl_Position = transformPosition(proj, view, ${n?"model,":""} vpos);
            forwardTextureCoordinates();
          }
        `),e.include(W,t),e.include(j,t),e.include(So,t),r.code.add(a`
          void main() {
            discardBySlice(vpos);
            ${i?a`
                    vec4 texColor = texture2D(tex, ${t.hasColorTextureTransform?a`colorUV`:a`vuv0`});
                    discardOrAdjustAlpha(texColor);`:""}
            outputHighlight();
          }
        `)}}function Ta(e,t){const o=e.fragment;if(t.hasVertexTangents?(e.attributes.add(T.TANGENT,"vec4"),e.varyings.add("vTangent","vec4"),t.doubleSidedMode===$.WindingOrder?o.code.add(a`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = gl_FrontFacing ? vTangent.w : -vTangent.w;
vec3 tangent = normalize(gl_FrontFacing ? vTangent.xyz : -vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`):o.code.add(a`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = vTangent.w;
vec3 tangent = normalize(vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`)):(e.extensions.add("GL_OES_standard_derivatives"),o.code.add(a`mat3 computeTangentSpace(vec3 normal, vec3 pos, vec2 st) {
vec3 Q1 = dFdx(pos);
vec3 Q2 = dFdy(pos);
vec2 stx = dFdx(st);
vec2 sty = dFdy(st);
float det = stx.t * sty.s - sty.t * stx.s;
vec3 T = stx.t * Q2 - sty.t * Q1;
T = T - normal * dot(normal, T);
T *= inversesqrt(max(dot(T,T), 1.e-10));
vec3 B = sign(det) * cross(normal, T);
return mat3(T, B, normal);
}`)),t.textureCoordinateType!==ne.None){e.include(_o,t);const r=t.supportsTextureAtlas?t.hasWebGL2Context?ie.None:ie.Size:ie.None;o.uniforms.add(t.pbrTextureBindType===No.Pass?pt("normalTexture",n=>n.textureNormal,r):Po("normalTexture",n=>n.textureNormal,r)),o.code.add(a`
    vec3 computeTextureNormal(mat3 tangentSpace, vec2 uv) {
      vtc.uv = uv;
      ${t.supportsTextureAtlas?a`vtc.size = ${ht(t,"normalTexture")};`:""}
      vec3 rawNormal = textureLookup(normalTexture, vtc).rgb * 2.0 - 1.0;
      return tangentSpace * rawNormal;
    }
  `)}}function Ve(e,t){const o=e.fragment;t.receiveAmbientOcclusion?(o.uniforms.add(pt("ssaoTex",(r,n)=>n.ssaoHelper.colorTexture,t.hasWebGL2Context?ie.None:ie.InvSize)),o.constants.add("blurSizePixelsInverse","float",1/Ro),o.code.add(a`
      float evaluateAmbientOcclusionInverse() {
        vec2 ssaoTextureSizeInverse = ${ht(t,"ssaoTex",!0)};
        return texture2D(ssaoTex, gl_FragCoord.xy * blurSizePixelsInverse * ssaoTextureSizeInverse).a;
      }

      float evaluateAmbientOcclusion() {
        return 1.0 - evaluateAmbientOcclusionInverse();
      }
    `)):o.code.add(a`float evaluateAmbientOcclusionInverse() { return 1.0; }
float evaluateAmbientOcclusion() { return 0.0; }`)}function Ie(e){e.constants.add("ambientBoostFactor","float",Eo)}function ze(e){e.uniforms.add(new O("lightingGlobalFactor",(t,o)=>o.lighting.globalFactor))}function Pt(e,t){const o=e.fragment;switch(e.include(Ve,t),t.pbrMode!==b.Disabled&&e.include(Ee,t),e.include(Do,t),e.include(Vo),o.code.add(a`
    const float GAMMA_SRGB = 2.1;
    const float INV_GAMMA_SRGB = 0.4761904;
    ${t.pbrMode===b.Disabled?"":"const vec3 GROUND_REFLECTANCE = vec3(0.2);"}
  `),Ie(o),ze(o),vt(o),o.code.add(a`
    float additionalDirectedAmbientLight(vec3 vPosWorld) {
      float vndl = dot(${t.spherical?a`normalize(vPosWorld)`:a`vec3(0.0, 0.0, 1.0)`}, mainLightDirection);
      return smoothstep(0.0, 1.0, clamp(vndl * 2.5, 0.0, 1.0));
    }
  `),De(o),o.code.add(a`vec3 evaluateAdditionalLighting(float ambientOcclusion, vec3 vPosWorld) {
float additionalAmbientScale = additionalDirectedAmbientLight(vPosWorld);
return (1.0 - ambientOcclusion) * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor * mainLightIntensity;
}`),t.pbrMode){case b.Disabled:case b.WaterOnIntegratedMesh:case b.Water:e.include(Ke,t),o.code.add(a`vec3 evaluateSceneLighting(vec3 normalWorld, vec3 albedo, float shadow, float ssao, vec3 additionalLight)
{
vec3 mainLighting = evaluateMainLighting(normalWorld, shadow);
vec3 ambientLighting = calculateAmbientIrradiance(normalWorld, ssao);
vec3 albedoLinear = pow(albedo, vec3(GAMMA_SRGB));
vec3 totalLight = mainLighting + ambientLighting + additionalLight;
totalLight = min(totalLight, vec3(PI));
vec3 outColor = vec3((albedoLinear / PI) * totalLight);
return pow(outColor, vec3(INV_GAMMA_SRGB));
}`);break;case b.Normal:case b.Schematic:o.code.add(a`const float fillLightIntensity = 0.25;
const float horizonLightDiffusion = 0.4;
const float additionalAmbientIrradianceFactor = 0.02;
vec3 evaluateSceneLightingPBR(vec3 normal, vec3 albedo, float shadow, float ssao, vec3 additionalLight, vec3 viewDir, vec3 normalGround, vec3 mrr, vec3 _emission, float additionalAmbientIrradiance)
{
vec3 viewDirection = -viewDir;
vec3 h = normalize(viewDirection + mainLightDirection);
PBRShadingInfo inputs;
inputs.NdotL = clamp(dot(normal, mainLightDirection), 0.001, 1.0);
inputs.NdotV = clamp(abs(dot(normal, viewDirection)), 0.001, 1.0);
inputs.NdotH = clamp(dot(normal, h), 0.0, 1.0);
inputs.VdotH = clamp(dot(viewDirection, h), 0.0, 1.0);
inputs.NdotNG = clamp(dot(normal, normalGround), -1.0, 1.0);
vec3 reflectedView = normalize(reflect(viewDirection, normal));
inputs.RdotNG = clamp(dot(reflectedView, normalGround), -1.0, 1.0);
inputs.albedoLinear = pow(albedo, vec3(GAMMA_SRGB));
inputs.ssao = ssao;
inputs.metalness = mrr[0];
inputs.roughness = clamp(mrr[1] * mrr[1], 0.001, 0.99);`),o.code.add(a`inputs.f0 = (0.16 * mrr[2] * mrr[2]) * (1.0 - inputs.metalness) + inputs.albedoLinear * inputs.metalness;
inputs.f90 = vec3(clamp(dot(inputs.f0, vec3(50.0 * 0.33)), 0.0, 1.0));
inputs.diffuseColor = inputs.albedoLinear * (vec3(1.0) - inputs.f0) * (1.0 - inputs.metalness);`),t.useFillLights?o.uniforms.add(new Io("hasFillLights",(r,n)=>n.enableFillLights)):o.constants.add("hasFillLights","bool",!1),o.code.add(a`vec3 ambientDir = vec3(5.0 * normalGround[1] - normalGround[0] * normalGround[2], - 5.0 * normalGround[0] - normalGround[2] * normalGround[1], normalGround[1] * normalGround[1] + normalGround[0] * normalGround[0]);
ambientDir = ambientDir != vec3(0.0)? normalize(ambientDir) : normalize(vec3(5.0, -1.0, 0.0));
inputs.NdotAmbDir = hasFillLights ? abs(dot(normal, ambientDir)) : 1.0;
vec3 mainLightIrradianceComponent = inputs.NdotL * (1.0 - shadow) * mainLightIntensity;
vec3 fillLightsIrradianceComponent = inputs.NdotAmbDir * mainLightIntensity * fillLightIntensity;
vec3 ambientLightIrradianceComponent = calculateAmbientIrradiance(normal, ssao) + additionalLight;
inputs.skyIrradianceToSurface = ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;
inputs.groundIrradianceToSurface = GROUND_REFLECTANCE * ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;`),o.uniforms.add([new O("lightingSpecularStrength",(r,n)=>n.lighting.mainLight.specularStrength),new O("lightingEnvironmentStrength",(r,n)=>n.lighting.mainLight.environmentStrength)]),o.code.add(a`vec3 horizonRingDir = inputs.RdotNG * normalGround - reflectedView;
vec3 horizonRingH = normalize(viewDirection + horizonRingDir);
inputs.NdotH_Horizon = dot(normal, horizonRingH);
vec3 mainLightRadianceComponent = lightingSpecularStrength * normalDistribution(inputs.NdotH, inputs.roughness) * mainLightIntensity * (1.0 - shadow);
vec3 horizonLightRadianceComponent = lightingEnvironmentStrength * normalDistribution(inputs.NdotH_Horizon, min(inputs.roughness + horizonLightDiffusion, 1.0)) * mainLightIntensity * fillLightIntensity;
vec3 ambientLightRadianceComponent = lightingEnvironmentStrength * calculateAmbientRadiance(ssao) + additionalLight;
inputs.skyRadianceToSurface = ambientLightRadianceComponent + mainLightRadianceComponent + horizonLightRadianceComponent;
inputs.groundRadianceToSurface = GROUND_REFLECTANCE * (ambientLightRadianceComponent + horizonLightRadianceComponent) + mainLightRadianceComponent;
inputs.averageAmbientRadiance = ambientLightIrradianceComponent[1] * (1.0 + GROUND_REFLECTANCE[1]);`),o.code.add(a`
        vec3 reflectedColorComponent = evaluateEnvironmentIllumination(inputs);
        vec3 additionalMaterialReflectanceComponent = inputs.albedoLinear * additionalAmbientIrradiance;
        vec3 emissionComponent = pow(_emission, vec3(GAMMA_SRGB));
        vec3 outColorLinear = reflectedColorComponent + additionalMaterialReflectanceComponent + emissionComponent;
        ${t.pbrMode===b.Schematic?a`vec3 outColor = pow(max(vec3(0.0), outColorLinear - 0.005 * inputs.averageAmbientRadiance), vec3(INV_GAMMA_SRGB));`:a`vec3 outColor = pow(blackLevelSoftCompression(outColorLinear, inputs), vec3(INV_GAMMA_SRGB));`}
        return outColor;
      }
    `);break;case b.Terrain:case b.TerrainWithWater:e.include(Ke,t),o.code.add(a`const float roughnessTerrain = 0.5;
const float specularityTerrain = 0.5;
const vec3 fresnelReflectionTerrain = vec3(0.04);
vec3 evaluateTerrainLighting(vec3 n, vec3 c, float shadow, float ssao, vec3 al, vec3 vd, vec3 nup) {
vec3 viewDirection = -vd;
vec3 h = normalize(viewDirection + mainLightDirection);
float NdotL = clamp(dot(n, mainLightDirection), 0.001, 1.0);
float NdotV = clamp(abs(dot(n, viewDirection)), 0.001, 1.0);
float NdotH = clamp(dot(n, h), 0.0, 1.0);
float NdotNG = clamp(dot(n, nup), -1.0, 1.0);
vec3 albedoLinear = pow(c, vec3(GAMMA_SRGB));
float lightness = 0.3 * albedoLinear[0] + 0.5 * albedoLinear[1] + 0.2 * albedoLinear[2];
vec3 f0 = (0.85 * lightness + 0.15) * fresnelReflectionTerrain;
vec3 f90 =  vec3(clamp(dot(f0, vec3(50.0 * 0.33)), 0.0, 1.0));
vec3 mainLightIrradianceComponent = (1. - shadow) * NdotL * mainLightIntensity;
vec3 ambientLightIrradianceComponent = calculateAmbientIrradiance(n, ssao) + al;
vec3 ambientSky = ambientLightIrradianceComponent + mainLightIrradianceComponent;
vec3 indirectDiffuse = ((1.0 - NdotNG) * mainLightIrradianceComponent + (1.0 + NdotNG ) * ambientSky) * 0.5;
vec3 outDiffColor = albedoLinear * (1.0 - f0) * indirectDiffuse / PI;
vec3 mainLightRadianceComponent = normalDistribution(NdotH, roughnessTerrain) * mainLightIntensity;
vec2 dfg = prefilteredDFGAnalytical(roughnessTerrain, NdotV);
vec3 specularColor = f0 * dfg.x + f90 * dfg.y;
vec3 specularComponent = specularityTerrain * specularColor * mainLightRadianceComponent;
vec3 outColorLinear = outDiffColor + specularComponent;
vec3 outColor = pow(outColorLinear, vec3(INV_GAMMA_SRGB));
return outColor;
}`);break;default:tt(t.pbrMode);case b.COUNT:}}function ba(e){e.vertex.uniforms.add(new le("colorTextureTransformMatrix",t=>p(t.colorTextureTransformMatrix)?t.colorTextureTransformMatrix:K())),e.varyings.add("colorUV","vec2"),e.vertex.code.add(a`void forwardColorUV(){
colorUV = (colorTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)}function ya(e){e.vertex.uniforms.add(new le("normalTextureTransformMatrix",t=>p(t.normalTextureTransformMatrix)?t.normalTextureTransformMatrix:K())),e.varyings.add("normalUV","vec2"),e.vertex.code.add(a`void forwardNormalUV(){
normalUV = (normalTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)}function Ca(e){e.vertex.uniforms.add(new le("emissiveTextureTransformMatrix",t=>p(t.emissiveTextureTransformMatrix)?t.emissiveTextureTransformMatrix:K())),e.varyings.add("emissiveUV","vec2"),e.vertex.code.add(a`void forwardEmissiveUV(){
emissiveUV = (emissiveTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)}function wa(e){e.vertex.uniforms.add(new le("occlusionTextureTransformMatrix",t=>p(t.occlusionTextureTransformMatrix)?t.occlusionTextureTransformMatrix:K())),e.varyings.add("occlusionUV","vec2"),e.vertex.code.add(a`void forwardOcclusionUV(){
occlusionUV = (occlusionTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)}function Ma(e){e.vertex.uniforms.add(new le("metallicRoughnessTextureTransformMatrix",t=>p(t.metallicRoughnessTextureTransformMatrix)?t.metallicRoughnessTextureTransformMatrix:K())),e.varyings.add("metallicRoughnessUV","vec2"),e.vertex.code.add(a`void forwardMetallicRoughnessUV(){
metallicRoughnessUV = (metallicRoughnessTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)}function ye(e){e.include(zo),e.code.add(a`
    vec3 mixExternalColor(vec3 internalColor, vec3 textureColor, vec3 externalColor, int mode) {
      // workaround for artifacts in OSX using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      vec3 internalMixed = internalColor * textureColor;
      vec3 allMixed = internalMixed * externalColor;

      if (mode == ${a.int(z.Multiply)}) {
        return allMixed;
      }
      if (mode == ${a.int(z.Ignore)}) {
        return internalMixed;
      }
      if (mode == ${a.int(z.Replace)}) {
        return externalColor;
      }

      // tint (or something invalid)
      float vIn = rgb2v(internalMixed);
      vec3 hsvTint = rgb2hsv(externalColor);
      vec3 hsvOut = vec3(hsvTint.x, hsvTint.y, vIn * hsvTint.z);
      return hsv2rgb(hsvOut);
    }

    float mixExternalOpacity(float internalOpacity, float textureOpacity, float externalOpacity, int mode) {
      // workaround for artifacts in OSX using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      float internalMixed = internalOpacity * textureOpacity;
      float allMixed = internalMixed * externalOpacity;

      if (mode == ${a.int(z.Ignore)}) {
        return internalMixed;
      }
      if (mode == ${a.int(z.Replace)}) {
        return externalOpacity;
      }

      // multiply or tint (or something invalid)
      return allMixed;
    }
  `)}function $a(e){const t=new ft,{vertex:o,fragment:r,varyings:n}=t;return te(o,e),t.include(gt),n.add("vpos","vec3"),t.include(re,e),t.include(Lt,e),t.include(xt,e),e.hasColorTextureTransform&&t.include(ba),e.output!==h.Color&&e.output!==h.Alpha||(e.hasNormalTextureTransform&&t.include(ya),e.hasEmissionTextureTransform&&t.include(Ca),e.hasOcclusionTextureTransform&&t.include(wa),e.hasMetallicRoughnessTextureTransform&&t.include(Ma),xe(o,e),t.include(Re,e),t.include(oe,e),e.normalType===L.Attribute&&e.offsetBackfaces&&t.include(Ot),t.include(Ta,e),t.include(mt,e),e.instancedColor&&t.attributes.add(T.INSTANCECOLOR,"vec4"),n.add("localvpos","vec3"),t.include(ae,e),t.include(Tt,e),t.include(_t,e),t.include(bt,e),o.uniforms.add(new yt("externalColor",i=>i.externalColor)),n.add("vcolorExt","vec4"),e.hasMultipassTerrain&&n.add("depth","float"),e.hasModelTransformation&&o.uniforms.add(new ut("model",i=>p(i.modelTransformation)?i.modelTransformation:ct)),o.code.add(a`
      void main(void) {
        forwardNormalizedVertexColor();
        vcolorExt = externalColor;
        ${e.instancedColor?"vcolorExt *= instanceColor;":""}
        vcolorExt *= vvColor();
        vcolorExt *= getSymbolColor();
        forwardColorMixMode();

        if (vcolorExt.a < ${a.float(Pe)}) {
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
        } else {
          vpos = calculateVPos();
          localvpos = vpos - view[3].xyz;
          vpos = subtractOrigin(vpos);
          ${e.normalType===L.Attribute?a`vNormalWorld = dpNormal(vvLocalNormal(normalModel()));`:""}
          vpos = addVerticalOffset(vpos, localOrigin);
          ${e.hasVertexTangents?"vTangent = dpTransformVertexTangent(tangent);":""}
          gl_Position = transformPosition(proj, view, ${e.hasModelTransformation?"model,":""} vpos);
          ${e.normalType===L.Attribute&&e.offsetBackfaces?"gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);":""}
        }

        ${e.hasMultipassTerrain?"depth = (view * vec4(vpos, 1.0)).z;":""}
        forwardLinearDepth();
        forwardTextureCoordinates();
        ${e.hasColorTextureTransform?a`forwardColorUV();`:""}
        ${e.hasNormalTextureTransform?a`forwardNormalUV();`:""}
        ${e.hasEmissionTextureTransform?a`forwardEmissiveUV();`:""}
        ${e.hasOcclusionTextureTransform?a`forwardOcclusionUV();`:""}
        ${e.hasMetallicRoughnessTextureTransform?a`forwardMetallicRoughnessUV();`:""}
      }
    `)),e.output===h.Alpha&&(t.include(W,e),t.include(j,e),t.include(Te,e),r.uniforms.add([new O("opacity",i=>i.opacity),new O("layerOpacity",i=>i.layerOpacity)]),e.hasColorTexture&&r.uniforms.add(new U("tex",i=>i.texture)),r.include(ye),r.code.add(a`
      void main() {
        discardBySlice(vpos);
        ${e.hasMultipassTerrain?"terrainDepthTest(gl_FragCoord, depth);":""}
        ${e.hasColorTexture?a`
                vec4 texColor = texture2D(tex, ${e.hasColorTextureTransform?a`colorUV`:a`vuv0`});
                ${e.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
                discardOrAdjustAlpha(texColor);`:a`vec4 texColor = vec4(1.0);`}
        ${e.hasVertexColors?a`float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:a`float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));`}
        gl_FragColor = vec4(opacity_);
      }
    `)),e.output===h.Color&&(t.include(W,e),t.include(Pt,e),t.include(Ve,e),t.include(j,e),t.include(e.instancedDoublePrecision?Ct:wt,e),t.include(Te,e),xe(r,e),r.uniforms.add([o.uniforms.get("localOrigin"),new be("ambient",i=>i.ambient),new be("diffuse",i=>i.diffuse),new O("opacity",i=>i.opacity),new O("layerOpacity",i=>i.layerOpacity)]),e.hasColorTexture&&r.uniforms.add(new U("tex",i=>i.texture)),t.include(Mt,e),t.include(Ee,e),r.include(ye),t.include(ha,e),Ie(r),ze(r),De(r),r.code.add(a`
      void main() {
        discardBySlice(vpos);
        ${e.hasMultipassTerrain?"terrainDepthTest(gl_FragCoord, depth);":""}
        ${e.hasColorTexture?a`
                vec4 texColor = texture2D(tex, ${e.hasColorTextureTransform?a`colorUV`:a`vuv0`});
                ${e.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
                discardOrAdjustAlpha(texColor);`:a`vec4 texColor = vec4(1.0);`}
        shadingParams.viewDirection = normalize(vpos - cameraPosition);
        ${e.normalType===L.ScreenDerivative?a`
                vec3 normal = screenDerivativeNormal(localvpos);`:a`
                shadingParams.normalView = vNormalWorld;
                vec3 normal = shadingNormal(shadingParams);`}
        ${e.pbrMode===b.Normal?"applyPBRFactors();":""}
        float ssao = evaluateAmbientOcclusionInverse();
        ssao *= getBakedOcclusion();

        vec3 posWorld = vpos + localOrigin;

        float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
        float shadow = ${e.receiveShadows?"readShadowMap(vpos, linearDepth)":e.spherical?"lightingGlobalFactor * (1.0 - additionalAmbientScale)":"0.0"};

        vec3 matColor = max(ambient, diffuse);
        ${e.hasVertexColors?a`
                vec3 albedo = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:a`
                vec3 albedo = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));`}
        ${e.hasNormalTexture?a`
                mat3 tangentSpace = ${e.hasVertexTangents?"computeTangentSpace(normal);":"computeTangentSpace(normal, vpos, vuv0);"}
                vec3 shadingNormal = computeTextureNormal(tangentSpace, vuv0);`:a`vec3 shadingNormal = normal;`}
        vec3 normalGround = ${e.spherical?a`normalize(posWorld);`:a`vec3(0.0, 0.0, 1.0);`}

        ${e.snowCover?a`
                float snow = smoothstep(0.5, 0.55, dot(normal, normalGround));
                albedo = mix(albedo, vec3(1), snow);
                shadingNormal = mix(shadingNormal, normal, snow);
                ssao = mix(ssao, 1.0, snow);`:""}

        vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;

        ${e.pbrMode===b.Normal||e.pbrMode===b.Schematic?a`
                float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
                ${e.snowCover?a`
                        mrr = mix(mrr, vec3(0.0, 1.0, 0.04), snow);
                        emission = mix(emission, vec3(0.0), snow);`:""}

                vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, shadingParams.viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:a`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
        gl_FragColor = highlightSlice(vec4(shadedColor, opacity_), vpos);
        ${e.transparencyPassType===J.Color?a`gl_FragColor = premultiplyAlpha(gl_FragColor);`:""}
      }
    `)),t.include(Nt,e),t}const Sa=Object.freeze(Object.defineProperty({__proto__:null,build:$a},Symbol.toStringTag,{value:"Module"}));class Aa extends Bo{constructor(){super(...arguments),this.isSchematic=!1,this.usePBR=!1,this.mrrFactors=ee(0,1,.5),this.hasVertexColors=!1,this.hasSymbolColors=!1,this.doubleSided=!1,this.doubleSidedType="normal",this.cullFace=B.Back,this.emissiveFactor=ee(0,0,0),this.instancedDoublePrecision=!1,this.normalType=L.Attribute,this.receiveSSAO=!0,this.receiveShadows=!0,this.castShadows=!0,this.shadowMappingEnabled=!1,this.ambient=ee(.2,.2,.2),this.diffuse=ee(.8,.8,.8),this.externalColor=Ft(1,1,1,1),this.colorMixMode="multiply",this.opacity=1,this.layerOpacity=1,this.origin=_(),this.hasSlicePlane=!1,this.hasSliceHighlight=!0,this.offsetTransparentBackfaces=!1,this.vvSizeEnabled=!1,this.vvSizeMinSize=[1,1,1],this.vvSizeMaxSize=[100,100,100],this.vvSizeOffset=[0,0,0],this.vvSizeFactor=[1,1,1],this.vvSizeValue=[1,1,1],this.vvColorEnabled=!1,this.vvColorValues=[0,0,0,0,0,0,0,0],this.vvColorColors=[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],this.vvSymbolAnchor=[0,0,0],this.vvSymbolRotationMatrix=lt(),this.vvOpacityEnabled=!1,this.vvOpacityValues=[],this.vvOpacityOpacities=[],this.transparent=!1,this.writeDepth=!0,this.customDepthTest=se.Less,this.textureAlphaMode=C.Blend,this.textureAlphaCutoff=Go,this.textureAlphaPremultiplied=!1,this.hasOccludees=!1,this.renderOccluded=ko.Occlude}}class yr extends Fo{constructor(){super(...arguments),this.origin=_(),this.slicePlaneLocalOrigin=this.origin}}class ce extends Uo{initializeConfiguration(t,o){o.hasWebGL2Context=t.rctx.type===Bt.WEBGL2,o.spherical=t.viewingMode===_e.Global,o.doublePrecisionRequiresObfuscation=t.rctx.driverTest.doublePrecisionRequiresObfuscation.result,o.textureCoordinateType=o.hasColorTexture||o.hasMetallicRoughnessTexture||o.hasEmissionTexture||o.hasOcclusionTexture||o.hasNormalTexture?ne.Default:ne.None,o.objectAndLayerIdColorInstanced=o.instanced}initializeProgram(t){return this._initializeProgram(t,ce.shader)}_initializeProgram(t,o){return new Wo(t.rctx,o.get().build(this.configuration),jo)}_convertDepthTestFunction(t){return t===se.Lequal?Ze.LEQUAL:Ze.LESS}_makePipeline(t,o){const r=this.configuration,n=t===J.NONE,i=t===J.FrontFace;return aa({blending:r.output!==h.Color&&r.output!==h.Alpha||!r.transparent?null:n?ra:ia(t),culling:Oa(r)?na(r.cullFace):null,depthTest:{func:sa(t,this._convertDepthTestFunction(r.customDepthTest))},depthWrite:(n||i)&&r.writeDepth?la:null,colorWrite:ca,stencilWrite:r.hasOccludees?Ho:null,stencilTest:r.hasOccludees?o?qo:Yo:null,polygonOffset:n||i?null:da(r.enableOffset)})}initializePipeline(){return this._occludeePipelineState=this._makePipeline(this.configuration.transparencyPassType,!0),this._makePipeline(this.configuration.transparencyPassType,!1)}getPipelineState(t,o){return o?this._occludeePipelineState:super.getPipelineState(t,o)}}function Oa(e){return e.cullFace!==B.None||!e.hasSlicePlane&&!e.transparent&&!e.doubleSidedMode}ce.shader=new $t(Sa,()=>ot(()=>import("./DefaultMaterial.glsl.c68dee87.js"),["assets/DefaultMaterial.glsl.c68dee87.js","assets/mat4f64.9070f685.js","assets/VertexColor.glsl.e3d82815.js","assets/index.3255d2a5.js","assets/index.e51050de.css","assets/requestImageUtils.828b299e.js","assets/OrderIndependentTransparency.43c6e481.js","assets/enums.3c1fa5b5.js","assets/basicInterfaces.f8f3b23b.js","assets/Texture.d66dc1cb.js","assets/VertexArrayObject.ad007c8f.js","assets/Util.3efb1a6b.js","assets/triangle.1c8f4155.js","assets/sphere.67ec4acb.js","assets/mat3f64.9180efcb.js","assets/quatf64.1dc83f1c.js","assets/lineSegment.1a0fd96e.js","assets/Indices.27b9c798.js","assets/VertexAttribute.34e3daf1.js","assets/doublePrecisionUtils.d6c628ce.js","assets/quat.eb7bbc3a.js","assets/vec3f32.4d8dc001.js","assets/BufferView.32a50625.js","assets/VertexElementDescriptor.5da9dfe9.js","assets/symbolColorUtils.aa5ba02e.js","assets/vec33.e7ec8171.js","assets/DefaultMaterial_COLOR_GAMMA.e47429cc.js","assets/types.bf551170.js","assets/Version.3df17f25.js","assets/resourceUtils.41b277ed.js","assets/NestedMap.2ac03b78.js","assets/Attribute.98e6fe67.js","assets/InterleavedLayout.a42ad5fa.js"]));class m extends Xo{constructor(){super(...arguments),this.output=h.Color,this.alphaDiscardMode=C.Opaque,this.doubleSidedMode=$.None,this.pbrMode=b.Disabled,this.cullFace=B.None,this.transparencyPassType=J.NONE,this.normalType=L.Attribute,this.textureCoordinateType=ne.None,this.customDepthTest=se.Less,this.spherical=!1,this.hasVertexColors=!1,this.hasSymbolColors=!1,this.hasVerticalOffset=!1,this.hasSlicePlane=!1,this.hasSliceHighlight=!0,this.hasColorTexture=!1,this.hasMetallicRoughnessTexture=!1,this.hasEmissionTexture=!1,this.hasOcclusionTexture=!1,this.hasNormalTexture=!1,this.hasScreenSizePerspective=!1,this.hasVertexTangents=!1,this.hasOccludees=!1,this.hasMultipassTerrain=!1,this.hasModelTransformation=!1,this.offsetBackfaces=!1,this.vvSize=!1,this.vvColor=!1,this.receiveShadows=!1,this.receiveAmbientOcclusion=!1,this.textureAlphaPremultiplied=!1,this.instanced=!1,this.instancedColor=!1,this.objectAndLayerIdColorInstanced=!1,this.instancedDoublePrecision=!1,this.doublePrecisionRequiresObfuscation=!1,this.writeDepth=!0,this.transparent=!1,this.enableOffset=!0,this.cullAboveGround=!1,this.snowCover=!1,this.hasColorTextureTransform=!1,this.hasEmissionTextureTransform=!1,this.hasNormalTextureTransform=!1,this.hasOcclusionTextureTransform=!1,this.hasMetallicRoughnessTextureTransform=!1}}d([u({count:h.COUNT})],m.prototype,"output",void 0),d([u({count:C.COUNT})],m.prototype,"alphaDiscardMode",void 0),d([u({count:$.COUNT})],m.prototype,"doubleSidedMode",void 0),d([u({count:b.COUNT})],m.prototype,"pbrMode",void 0),d([u({count:B.COUNT})],m.prototype,"cullFace",void 0),d([u({count:J.COUNT})],m.prototype,"transparencyPassType",void 0),d([u({count:L.COUNT})],m.prototype,"normalType",void 0),d([u({count:ne.COUNT})],m.prototype,"textureCoordinateType",void 0),d([u({count:se.COUNT})],m.prototype,"customDepthTest",void 0),d([u()],m.prototype,"spherical",void 0),d([u()],m.prototype,"hasVertexColors",void 0),d([u()],m.prototype,"hasSymbolColors",void 0),d([u()],m.prototype,"hasVerticalOffset",void 0),d([u()],m.prototype,"hasSlicePlane",void 0),d([u()],m.prototype,"hasSliceHighlight",void 0),d([u()],m.prototype,"hasColorTexture",void 0),d([u()],m.prototype,"hasMetallicRoughnessTexture",void 0),d([u()],m.prototype,"hasEmissionTexture",void 0),d([u()],m.prototype,"hasOcclusionTexture",void 0),d([u()],m.prototype,"hasNormalTexture",void 0),d([u()],m.prototype,"hasScreenSizePerspective",void 0),d([u()],m.prototype,"hasVertexTangents",void 0),d([u()],m.prototype,"hasOccludees",void 0),d([u()],m.prototype,"hasMultipassTerrain",void 0),d([u()],m.prototype,"hasModelTransformation",void 0),d([u()],m.prototype,"offsetBackfaces",void 0),d([u()],m.prototype,"vvSize",void 0),d([u()],m.prototype,"vvColor",void 0),d([u()],m.prototype,"receiveShadows",void 0),d([u()],m.prototype,"receiveAmbientOcclusion",void 0),d([u()],m.prototype,"textureAlphaPremultiplied",void 0),d([u()],m.prototype,"instanced",void 0),d([u()],m.prototype,"instancedColor",void 0),d([u()],m.prototype,"objectAndLayerIdColorInstanced",void 0),d([u()],m.prototype,"instancedDoublePrecision",void 0),d([u()],m.prototype,"doublePrecisionRequiresObfuscation",void 0),d([u()],m.prototype,"writeDepth",void 0),d([u()],m.prototype,"transparent",void 0),d([u()],m.prototype,"enableOffset",void 0),d([u()],m.prototype,"cullAboveGround",void 0),d([u()],m.prototype,"snowCover",void 0),d([u()],m.prototype,"hasColorTextureTransform",void 0),d([u()],m.prototype,"hasEmissionTextureTransform",void 0),d([u()],m.prototype,"hasNormalTextureTransform",void 0),d([u()],m.prototype,"hasOcclusionTextureTransform",void 0),d([u()],m.prototype,"hasMetallicRoughnessTextureTransform",void 0),d([u({constValue:!0})],m.prototype,"hasVvInstancing",void 0),d([u({constValue:!1})],m.prototype,"useCustomDTRExponentForWater",void 0),d([u({constValue:!1})],m.prototype,"supportsTextureAtlas",void 0),d([u({constValue:!0})],m.prototype,"useFillLights",void 0);function La(e){const t=new ft,{vertex:o,fragment:r,varyings:n}=t;return te(o,e),t.include(gt),n.add("vpos","vec3"),t.include(re,e),t.include(Lt,e),t.include(xt,e),e.output!==h.Color&&e.output!==h.Alpha||(xe(t.vertex,e),t.include(Re,e),t.include(oe,e),e.offsetBackfaces&&t.include(Ot),e.instancedColor&&t.attributes.add(T.INSTANCECOLOR,"vec4"),n.add("vNormalWorld","vec3"),n.add("localvpos","vec3"),e.hasMultipassTerrain&&n.add("depth","float"),t.include(ae,e),t.include(Tt,e),t.include(_t,e),t.include(bt,e),o.uniforms.add(new yt("externalColor",i=>i.externalColor)),n.add("vcolorExt","vec4"),o.code.add(a`
        void main(void) {
          forwardNormalizedVertexColor();
          vcolorExt = externalColor;
          ${e.instancedColor?"vcolorExt *= instanceColor;":""}
          vcolorExt *= vvColor();
          vcolorExt *= getSymbolColor();
          forwardColorMixMode();

          if (vcolorExt.a < ${a.float(Pe)}) {
            gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          } else {
            vpos = calculateVPos();
            localvpos = vpos - view[3].xyz;
            vpos = subtractOrigin(vpos);
            vNormalWorld = dpNormal(vvLocalNormal(normalModel()));
            vpos = addVerticalOffset(vpos, localOrigin);
            gl_Position = transformPosition(proj, view, vpos);
            ${e.offsetBackfaces?"gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);":""}
          }
          ${e.hasMultipassTerrain?a`depth = (view * vec4(vpos, 1.0)).z;`:""}
          forwardLinearDepth();
          forwardTextureCoordinates();
        }
      `)),e.output===h.Alpha&&(t.include(W,e),t.include(j,e),t.include(Te,e),r.uniforms.add([new O("opacity",i=>i.opacity),new O("layerOpacity",i=>i.layerOpacity)]),e.hasColorTexture&&r.uniforms.add(new U("tex",i=>i.texture)),r.include(ye),r.code.add(a`
      void main() {
        discardBySlice(vpos);
        ${e.hasMultipassTerrain?a`terrainDepthTest(gl_FragCoord, depth);`:""}
        ${e.hasColorTexture?a`
                vec4 texColor = texture2D(tex, ${e.hasColorTextureTransform?a`colorUV`:a`vuv0`});
                ${e.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
                discardOrAdjustAlpha(texColor);`:a`vec4 texColor = vec4(1.0);`}
        ${e.hasVertexColors?a`float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:a`float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));`}

        gl_FragColor = vec4(opacity_);
      }
    `)),e.output===h.Color&&(t.include(W,e),t.include(Pt,e),t.include(Ve,e),t.include(j,e),t.include(e.instancedDoublePrecision?Ct:wt,e),t.include(Te,e),xe(t.fragment,e),vt(r),Ie(r),ze(r),r.uniforms.add([o.uniforms.get("localOrigin"),o.uniforms.get("view"),new be("ambient",i=>i.ambient),new be("diffuse",i=>i.diffuse),new O("opacity",i=>i.opacity),new O("layerOpacity",i=>i.layerOpacity)]),e.hasColorTexture&&r.uniforms.add(new U("tex",i=>i.texture)),t.include(Mt,e),t.include(Ee,e),r.include(ye),t.extensions.add("GL_OES_standard_derivatives"),De(r),r.code.add(a`
      void main() {
        discardBySlice(vpos);
        ${e.hasMultipassTerrain?a`terrainDepthTest(gl_FragCoord, depth);`:""}
        ${e.hasColorTexture?a`
                vec4 texColor = texture2D(tex, ${e.hasColorTextureTransform?a`colorUV`:a`vuv0`});
                ${e.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
                discardOrAdjustAlpha(texColor);`:a`vec4 texColor = vec4(1.0);`}
        vec3 viewDirection = normalize(vpos - cameraPosition);
        ${e.pbrMode===b.Normal?"applyPBRFactors();":""}
        float ssao = evaluateAmbientOcclusionInverse();
        ssao *= getBakedOcclusion();

        float additionalAmbientScale = additionalDirectedAmbientLight(vpos + localOrigin);
        vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
        ${e.receiveShadows?"float shadow = readShadowMap(vpos, linearDepth);":e.spherical?"float shadow = lightingGlobalFactor * (1.0 - additionalAmbientScale);":"float shadow = 0.0;"}
        vec3 matColor = max(ambient, diffuse);
        ${e.hasVertexColors?a`
                vec3 albedo = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:a`
                vec3 albedo = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));`}
        ${e.snowCover?a`albedo = mix(albedo, vec3(1), 0.9);`:a``}
        ${a`
            vec3 shadingNormal = normalize(vNormalWorld);
            albedo *= 1.2;
            vec3 viewForward = vec3(view[0][2], view[1][2], view[2][2]);
            float alignmentLightView = clamp(dot(viewForward, -mainLightDirection), 0.0, 1.0);
            float transmittance = 1.0 - clamp(dot(viewForward, shadingNormal), 0.0, 1.0);
            float treeRadialFalloff = vColor.r;
            float backLightFactor = 0.5 * treeRadialFalloff * alignmentLightView * transmittance * (1.0 - shadow);
            additionalLight += backLightFactor * mainLightIntensity;`}
        ${e.pbrMode===b.Normal||e.pbrMode===b.Schematic?e.spherical?a`vec3 normalGround = normalize(vpos + localOrigin);`:a`vec3 normalGround = vec3(0.0, 0.0, 1.0);`:a``}
        ${e.pbrMode===b.Normal||e.pbrMode===b.Schematic?a`
                float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
                ${e.snowCover?a`
                        mrr = vec3(0.0, 1.0, 0.04);
                        emission = vec3(0.0);`:""}

                vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:a`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
        gl_FragColor = highlightSlice(vec4(shadedColor, opacity_), vpos);
        ${e.transparencyPassType===J.Color?a`gl_FragColor = premultiplyAlpha(gl_FragColor);`:a``}
      }
    `)),t.include(Nt,e),t}const _a=Object.freeze(Object.defineProperty({__proto__:null,build:La},Symbol.toStringTag,{value:"Module"}));class Me extends ce{initializeConfiguration(t,o){super.initializeConfiguration(t,o),o.hasMetallicRoughnessTexture=!1,o.hasEmissionTexture=!1,o.hasOcclusionTexture=!1,o.hasNormalTexture=!1,o.hasModelTransformation=!1,o.normalType=L.Attribute,o.doubleSidedMode=$.WindingOrder,o.hasVertexTangents=!1}initializeProgram(t){return this._initializeProgram(t,Me.shader)}}Me.shader=new $t(_a,()=>ot(()=>import("./RealisticTree.glsl.5d76b22d.js"),["assets/RealisticTree.glsl.5d76b22d.js","assets/VertexColor.glsl.e3d82815.js","assets/index.3255d2a5.js","assets/index.e51050de.css","assets/requestImageUtils.828b299e.js","assets/OrderIndependentTransparency.43c6e481.js","assets/enums.3c1fa5b5.js","assets/basicInterfaces.f8f3b23b.js","assets/Texture.d66dc1cb.js","assets/VertexArrayObject.ad007c8f.js","assets/Util.3efb1a6b.js","assets/mat4f64.9070f685.js","assets/triangle.1c8f4155.js","assets/sphere.67ec4acb.js","assets/mat3f64.9180efcb.js","assets/quatf64.1dc83f1c.js","assets/lineSegment.1a0fd96e.js","assets/Indices.27b9c798.js","assets/VertexAttribute.34e3daf1.js","assets/doublePrecisionUtils.d6c628ce.js","assets/quat.eb7bbc3a.js","assets/vec3f32.4d8dc001.js","assets/BufferView.32a50625.js","assets/VertexElementDescriptor.5da9dfe9.js","assets/symbolColorUtils.aa5ba02e.js","assets/vec33.e7ec8171.js","assets/DefaultMaterial_COLOR_GAMMA.e47429cc.js","assets/types.bf551170.js","assets/Version.3df17f25.js","assets/resourceUtils.41b277ed.js","assets/NestedMap.2ac03b78.js","assets/Attribute.98e6fe67.js","assets/InterleavedLayout.a42ad5fa.js"]));class Ce extends Jo{constructor(t){super(t,Ra),this.supportsEdges=!0,this._configuration=new m,this._vertexBufferLayout=Ea(this.parameters)}isVisibleForOutput(t){return t!==h.Shadow&&t!==h.ShadowExcludeHighlight&&t!==h.ShadowHighlight||this.parameters.castShadows}isVisible(){const t=this.parameters;if(!super.isVisible()||t.layerOpacity===0)return!1;const{instanced:o,hasVertexColors:r,hasSymbolColors:n,vvColorEnabled:i}=t,c=p(o)&&o.includes("color"),l=t.colorMixMode==="replace",s=t.opacity>0,f=t.externalColor&&t.externalColor[3]>0;return r&&(c||i||n)?!!l||s:r?l?f:s:c||i||n?!!l||s:l?f:s}getConfiguration(t,o){return this._configuration.output=t,this._configuration.hasNormalTexture=!!this.parameters.normalTextureId,this._configuration.hasColorTexture=!!this.parameters.textureId,this._configuration.hasVertexTangents=this.parameters.hasVertexTangents,this._configuration.instanced=!!this.parameters.instanced,this._configuration.instancedDoublePrecision=this.parameters.instancedDoublePrecision,this._configuration.vvSize=this.parameters.vvSizeEnabled,this._configuration.hasVerticalOffset=p(this.parameters.verticalOffset),this._configuration.hasScreenSizePerspective=p(this.parameters.screenSizePerspective),this._configuration.hasSlicePlane=this.parameters.hasSlicePlane,this._configuration.hasSliceHighlight=this.parameters.hasSliceHighlight,this._configuration.alphaDiscardMode=this.parameters.textureAlphaMode,this._configuration.normalType=this.parameters.normalType,this._configuration.transparent=this.parameters.transparent,this._configuration.writeDepth=this.parameters.writeDepth,p(this.parameters.customDepthTest)&&(this._configuration.customDepthTest=this.parameters.customDepthTest),this._configuration.hasOccludees=this.parameters.hasOccludees,this._configuration.cullFace=this.parameters.hasSlicePlane?B.None:this.parameters.cullFace,this._configuration.hasMultipassTerrain=o.multipassTerrain.enabled,this._configuration.cullAboveGround=o.multipassTerrain.cullAboveGround,this._configuration.hasModelTransformation=p(this.parameters.modelTransformation),t!==h.Color&&t!==h.Alpha||(this._configuration.hasVertexColors=this.parameters.hasVertexColors,this._configuration.hasSymbolColors=this.parameters.hasSymbolColors,this.parameters.treeRendering?this._configuration.doubleSidedMode=$.WindingOrder:this._configuration.doubleSidedMode=this.parameters.doubleSided&&this.parameters.doubleSidedType==="normal"?$.View:this.parameters.doubleSided&&this.parameters.doubleSidedType==="winding-order"?$.WindingOrder:$.None,this._configuration.instancedColor=p(this.parameters.instanced)&&this.parameters.instanced.includes("color"),this._configuration.receiveShadows=this.parameters.receiveShadows&&this.parameters.shadowMappingEnabled,this._configuration.receiveAmbientOcclusion=!!o.ssaoHelper.active&&this.parameters.receiveSSAO,this._configuration.vvColor=this.parameters.vvColorEnabled,this._configuration.textureAlphaPremultiplied=!!this.parameters.textureAlphaPremultiplied,this._configuration.pbrMode=this.parameters.usePBR?this.parameters.isSchematic?b.Schematic:b.Normal:b.Disabled,this._configuration.hasMetallicRoughnessTexture=!!this.parameters.metallicRoughnessTextureId,this._configuration.hasEmissionTexture=!!this.parameters.emissiveTextureId,this._configuration.hasOcclusionTexture=!!this.parameters.occlusionTextureId,this._configuration.offsetBackfaces=!(!this.parameters.transparent||!this.parameters.offsetTransparentBackfaces),this._configuration.transparencyPassType=o.transparencyPassType,this._configuration.enableOffset=o.camera.relativeElevation<ua,this._configuration.snowCover=this.hasSnowCover(o),this._configuration.hasColorTextureTransform=!!this.parameters.colorTextureTransformMatrix,this._configuration.hasNormalTextureTransform=!!this.parameters.normalTextureTransformMatrix,this._configuration.hasEmissionTextureTransform=!!this.parameters.emissiveTextureTransformMatrix,this._configuration.hasOcclusionTextureTransform=!!this.parameters.occlusionTextureTransformMatrix,this._configuration.hasMetallicRoughnessTextureTransform=!!this.parameters.metallicRoughnessTextureTransformMatrix),this._configuration}hasSnowCover(t){return p(t.weather)&&t.weatherVisible&&t.weather.type==="snowy"&&t.weather.snowCover==="enabled"}intersect(t,o,r,n,i,c){if(p(this.parameters.verticalOffset)){const l=r.camera;fe(Le,o[12],o[13],o[14]);let s=null;switch(r.viewingMode){case _e.Global:s=at(et,Le);break;case _e.Local:s=Gt(et,Ia)}let f=0;const v=he(za,Le,l.eye),x=rt(v),w=Be(v,v,1/x);let g=null;this.parameters.screenSizePerspective&&(g=kt(s,w)),f+=Ko(l,x,this.parameters.verticalOffset,g!=null?g:0,this.parameters.screenSizePerspective),Be(s,s,f),Ut(Oe,s,r.transform.inverseRotation),n=he(Da,n,Oe),i=he(Va,i,Oe)}Zo(t,r,n,i,Qo(r.verticalOffset),c)}requiresSlot(t,o){return o===h.Color||o===h.Alpha||o===h.Depth||o===h.Normal||o===h.Shadow||o===h.ShadowHighlight||o===h.ShadowExcludeHighlight||o===h.Highlight||o===h.ObjectAndLayerIdColor?t===(this.parameters.transparent?this.parameters.writeDepth?ue.TRANSPARENT_MATERIAL:ue.TRANSPARENT_DEPTH_WRITE_DISABLED_MATERIAL:ue.OPAQUE_MATERIAL)||t===ue.DRAPED_MATERIAL:!1}createGLMaterial(t){return new Na(t)}createBufferWriter(){return new ea(this._vertexBufferLayout)}}class Na extends ta{constructor(t){super({...t,...t.material.parameters})}_updateShadowState(t){t.shadowMap.enabled!==this._material.parameters.shadowMappingEnabled&&this._material.setParameters({shadowMappingEnabled:t.shadowMap.enabled})}_updateOccludeeState(t){t.hasOccludees!==this._material.parameters.hasOccludees&&this._material.setParameters({hasOccludees:t.hasOccludees})}beginSlot(t){this._output!==h.Color&&this._output!==h.Alpha||(this._updateShadowState(t),this._updateOccludeeState(t));const o=this._material.parameters;this.updateTexture(o.textureId);const r=t.camera.viewInverseTransposeMatrix;return fe(o.origin,r[3],r[7],r[11]),this._material.setParameters(this.textureBindParameters),this.ensureTechnique(o.treeRendering?Me:ce,t)}}class Pa extends Aa{constructor(){super(...arguments),this.initTextureTransparent=!1,this.treeRendering=!1,this.hasVertexTangents=!1}}const Ra=new Pa;function Ea(e){const t=oa().vec3f(T.POSITION).vec3f(T.NORMAL),o=e.textureId||e.normalTextureId||e.metallicRoughnessTextureId||e.emissiveTextureId||e.occlusionTextureId;return e.hasVertexTangents&&t.vec4f(T.TANGENT),o&&t.vec2f(T.UV0),e.hasVertexColors&&t.vec4u8(T.COLOR),e.hasSymbolColors&&t.vec4u8(T.SYMBOLCOLOR),Wt("enable-feature:objectAndLayerId-rendering")&&t.vec4u8(T.OBJECTANDLAYERIDCOLOR),t}const Da=_(),Va=_(),Ia=ee(0,0,1),et=_(),Oe=_(),Le=_(),za=_();function Q(e){if(we(e))return null;const t=p(e.offset)?e.offset:jt,o=p(e.rotation)?e.rotation:0,r=p(e.scale)?e.scale:Ht,n=$e(1,0,0,0,1,0,t[0],t[1],1),i=$e(Math.cos(o),-Math.sin(o),0,Math.sin(o),Math.cos(o),0,0,0,1),c=$e(r[0],0,0,0,r[1],0,0,0,1),l=K();return Ge(l,i,c),Ge(l,n,l),l}class Fa{constructor(){this.geometries=new Array,this.materials=new Array,this.textures=new Array}}class Ba{constructor(t,o,r){this.name=t,this.lodThreshold=o,this.pivotOffset=r,this.stageResources=new Fa,this.numberOfVertices=0}}const I=qt.getLogger("esri.views.3d.layers.graphics.objectResourceUtils");async function Ga(e,t){var i;const o=await ka(e,t),r=await qa((i=o.textureDefinitions)!=null?i:{},t);let n=0;for(const c in r)if(r.hasOwnProperty(c)){const l=r[c];n+=l!=null&&l.image?l.image.width*l.image.height*4:0}return{resource:o,textures:r,size:n+Yt(o)}}async function ka(e,t){const o=p(t)&&t.streamDataRequester;if(o)return Ua(e,o,t);const r=await it(Xt(e,Jt(t)));if(r.ok===!0)return r.value.data;nt(r.error),Rt(r.error)}async function Ua(e,t,o){const r=await it(t.request(e,"json",o));if(r.ok===!0)return r.value;nt(r.error),Rt(r.error.details.url)}function Rt(e){throw new Kt("",`Request for object resource failed: ${e}`)}function Wa(e){const t=e.params,o=t.topology;let r=!0;switch(t.vertexAttributes||(I.warn("Geometry must specify vertex attributes"),r=!1),t.topology){case"PerAttributeArray":break;case"Indexed":case null:case void 0:{const i=t.faces;if(i){if(t.vertexAttributes)for(const c in t.vertexAttributes){const l=i[c];l&&l.values?(l.valueType!=null&&l.valueType!=="UInt32"&&(I.warn(`Unsupported indexed geometry indices type '${l.valueType}', only UInt32 is currently supported`),r=!1),l.valuesPerElement!=null&&l.valuesPerElement!==1&&(I.warn(`Unsupported indexed geometry values per element '${l.valuesPerElement}', only 1 is currently supported`),r=!1)):(I.warn(`Indexed geometry does not specify face indices for '${c}' attribute`),r=!1)}}else I.warn("Indexed geometries must specify faces"),r=!1;break}default:I.warn(`Unsupported topology '${o}'`),r=!1}e.params.material||(I.warn("Geometry requires material"),r=!1);const n=e.params.vertexAttributes;for(const i in n)n[i].values||(I.warn("Geometries with externally defined attributes are not yet supported"),r=!1);return r}function ja(e,t){var y;const o=new Array,r=new Array,n=new Array,i=new To,c=e.resource,l=dt.parse(c.version||"1.0","wosr");Xa.validate(l);const s=c.model.name,f=c.model.geometries,v=(y=c.materialDefinitions)!=null?y:{},x=e.textures;let w=0;const g=new Map;for(let S=0;S<f.length;S++){const A=f[S];if(!Wa(A))continue;const P=Ya(A),F=A.params.vertexAttributes,G=[];for(const M in F){const D=F[M],q=D.values;G.push([M,new X(q,D.valuesPerElement,!0)])}const R=[];if(A.params.topology!=="PerAttributeArray"){const M=A.params.faces;for(const D in M)R.push([D,M[D].values])}const N=P.texture,E=x&&x[N];if(E&&!g.has(N)){const{image:M,params:D}=E,q=new St(M,D);r.push(q),g.set(N,q)}const H=g.get(N),V=H?H.id:void 0,de=P.material;let Z=i.get(de,N);if(we(Z)){const M=v[de.substring(de.lastIndexOf("/")+1)].params;M.transparency===1&&(M.transparency=0);const D=E&&E.alphaChannelUsage,q=M.transparency>0||D==="transparency"||D==="maskAndTransparency",zt=E?Et(E.alphaChannelUsage):void 0,Fe={ambient:ke(M.diffuse),diffuse:ke(M.diffuse),opacity:1-(M.transparency||0),transparent:q,textureAlphaMode:zt,textureAlphaCutoff:.33,textureId:V,initTextureTransparent:!0,doubleSided:!0,cullFace:B.None,colorMixMode:M.externalColorMixMode||"tint",textureAlphaPremultiplied:!!E&&!!E.params.preMultiplyAlpha};p(t)&&t.materialParamsMixin&&Object.assign(Fe,t.materialParamsMixin),Z=new Ce(Fe),i.set(de,N,Z)}n.push(Z);const It=new At(Z,G,R);w+=R.position?R.position.length:0,o.push(It)}return{engineResources:[{name:s,stageResources:{textures:r,materials:n,geometries:o},pivotOffset:c.model.pivotOffset,numberOfVertices:w,lodThreshold:null}],referenceBoundingBox:Ha(o)}}function Ha(e){const t=st();return e.forEach(o=>{const r=o.boundingInfo;p(r)&&(ge(t,r.bbMin),ge(t,r.bbMax))}),t}async function qa(e,t){const o=[];for(const i in e){const c=e[i],l=c.images[0].data;if(!l){I.warn("Externally referenced texture data is not yet supported");continue}const s=c.encoding+";base64,"+l,f="/textureDefinitions/"+i,v=c.channels==="rgba"?c.alphaChannelUsage||"transparency":"none",x={noUnpackFlip:!0,wrap:{s:Qe.REPEAT,t:Qe.REPEAT},preMultiplyAlpha:Et(v)!==C.Opaque},w=p(t)&&t.disableTextures?Promise.resolve(null):bo(s,t);o.push(w.then(g=>({refId:f,image:g,params:x,alphaChannelUsage:v})))}const r=await Promise.all(o),n={};for(const i of r)n[i.refId]=i;return n}function Et(e){switch(e){case"mask":return C.Mask;case"maskAndTransparency":return C.MaskBlend;case"none":return C.Opaque;default:return C.Blend}}function Ya(e){const t=e.params;return{id:1,material:t.material,texture:t.texture,region:t.texture}}const Xa=new dt(1,2,"wosr");async function Ja(e,t){const o=Dt(Zt(e));if(o.fileType==="wosr"){const x=await(t.cache?t.cache.loadWOSR(o.url,t):Ga(o.url,t)),{engineResources:w,referenceBoundingBox:g}=ja(x,t);return{lods:w,referenceBoundingBox:g,isEsriSymbolResource:!1,isWosr:!0}}const r=await(t.cache?t.cache.loadGLTF(o.url,t,!!t.usePBR):co(new uo(t.streamDataRequester),o.url,t,t.usePBR)),n=Qt(r.model.meta,"ESRI_proxyEllipsoid"),i=r.meta.isEsriSymbolResource&&p(n)&&r.meta.uri.includes("/RealisticTrees/");i&&!r.customMeta.esriTreeRendering&&(r.customMeta.esriTreeRendering=!0,tr(r,n));const c=!!t.usePBR,l=r.meta.isEsriSymbolResource?{usePBR:c,isSchematic:!1,treeRendering:i,mrrFactors:[0,1,.2]}:{usePBR:c,isSchematic:!1,treeRendering:!1,mrrFactors:[0,1,.5]},s={...t.materialParamsMixin,treeRendering:i},{engineResources:f,referenceBoundingBox:v}=Vt(r,l,s,t.skipHighLods&&o.specifiedLodIndex==null?{skipHighLods:!0}:{skipHighLods:!1,singleLodIndex:o.specifiedLodIndex});return{lods:f,referenceBoundingBox:v,isEsriSymbolResource:r.meta.isEsriSymbolResource,isWosr:!1}}function Dt(e){const t=e.match(/(.*\.(gltf|glb))(\?lod=([0-9]+))?$/);return t?{fileType:"gltf",url:t[1],specifiedLodIndex:t[4]!=null?Number(t[4]):null}:e.match(/(.*\.(json|json\.gz))$/)?{fileType:"wosr",url:e,specifiedLodIndex:null}:{fileType:"unknown",url:e,specifiedLodIndex:null}}function Vt(e,t,o,r){const n=e.model,i=new Array,c=new Map,l=new Map,s=n.lods.length,f=st();return n.lods.forEach((v,x)=>{const w=r.skipHighLods===!0&&(s>1&&x===0||s>3&&x===1)||r.skipHighLods===!1&&r.singleLodIndex!=null&&x!==r.singleLodIndex;if(w&&x!==0)return;const g=new Ba(v.name,v.lodThreshold,[0,0,0]);v.parts.forEach(y=>{const S=w?new Ce({}):Ka(n,y,g,t,o,c,l),{geometry:A,vertexCount:P}=Za(y,p(S)?S:new Ce({})),F=A.boundingInfo;p(F)&&x===0&&(ge(f,F.bbMin),ge(f,F.bbMax)),p(S)&&(g.stageResources.geometries.push(A),g.numberOfVertices+=P)}),w||i.push(g)}),{engineResources:i,referenceBoundingBox:f}}function Ka(e,t,o,r,n,i,c){const l=t.material+(t.attributes.normal?"_normal":"")+(t.attributes.color?"_color":"")+(t.attributes.texCoord0?"_texCoord0":"")+(t.attributes.tangent?"_tangent":""),s=e.materials.get(t.material),f=p(t.attributes.texCoord0),v=p(t.attributes.normal);if(we(s))return null;const x=Qa(s.alphaMode);if(!i.has(l)){if(f){const R=(N,E=!1)=>{if(p(N)&&!c.has(N)){const H=e.textures.get(N);if(p(H)){const V=H.data;c.set(N,new St(Se(V)?V.data:V,{...H.parameters,preMultiplyAlpha:!Se(V)&&E,encoding:Se(V)&&p(V.encoding)?V.encoding:void 0}))}}};R(s.textureColor,x!==C.Opaque),R(s.textureNormal),R(s.textureOcclusion),R(s.textureEmissive),R(s.textureMetallicRoughness)}const g=s.color[0]**(1/Y),y=s.color[1]**(1/Y),S=s.color[2]**(1/Y),A=s.emissiveFactor[0]**(1/Y),P=s.emissiveFactor[1]**(1/Y),F=s.emissiveFactor[2]**(1/Y),G=p(s.textureColor)&&f?c.get(s.textureColor):null;i.set(l,new Ce({...r,transparent:x===C.Blend,customDepthTest:se.Lequal,textureAlphaMode:x,textureAlphaCutoff:s.alphaCutoff,diffuse:[g,y,S],ambient:[g,y,S],opacity:s.opacity,doubleSided:s.doubleSided,doubleSidedType:"winding-order",cullFace:s.doubleSided?B.None:B.Back,hasVertexColors:!!t.attributes.color,hasVertexTangents:!!t.attributes.tangent,normalType:v?L.Attribute:L.ScreenDerivative,castShadows:!0,receiveSSAO:!0,textureId:p(G)?G.id:void 0,colorMixMode:s.colorMixMode,normalTextureId:p(s.textureNormal)&&f?c.get(s.textureNormal).id:void 0,textureAlphaPremultiplied:p(G)&&!!G.params.preMultiplyAlpha,occlusionTextureId:p(s.textureOcclusion)&&f?c.get(s.textureOcclusion).id:void 0,emissiveTextureId:p(s.textureEmissive)&&f?c.get(s.textureEmissive).id:void 0,metallicRoughnessTextureId:p(s.textureMetallicRoughness)&&f?c.get(s.textureMetallicRoughness).id:void 0,emissiveFactor:[A,P,F],mrrFactors:[s.metallicFactor,s.roughnessFactor,r.mrrFactors[2]],isSchematic:!1,colorTextureTransformMatrix:Q(s.colorTextureTransform),normalTextureTransformMatrix:Q(s.normalTextureTransform),occlusionTextureTransformMatrix:Q(s.occlusionTextureTransform),emissiveTextureTransformMatrix:Q(s.emissiveTextureTransform),metallicRoughnessTextureTransformMatrix:Q(s.metallicRoughnessTextureTransform),...n}))}const w=i.get(l);if(o.stageResources.materials.push(w),f){const g=y=>{p(y)&&o.stageResources.textures.push(c.get(y))};g(s.textureColor),g(s.textureNormal),g(s.textureOcclusion),g(s.textureEmissive),g(s.textureMetallicRoughness)}return w}function Za(e,t){const o=e.attributes.position.count,r=er(e.indices||o,e.primitiveType),n=k(ve,o);no(n,e.attributes.position,e.transform);const i=[[T.POSITION,new X(n.typedBuffer,n.elementCount,!0)]],c=[[T.POSITION,r]];if(p(e.attributes.normal)){const l=k(ve,o);Ue(pe,e.transform),so(l,e.attributes.normal,pe),i.push([T.NORMAL,new X(l.typedBuffer,l.elementCount,!0)]),c.push([T.NORMAL,r])}if(p(e.attributes.tangent)){const l=k(He,o);Ue(pe,e.transform),mo(l,e.attributes.tangent,pe),i.push([T.TANGENT,new X(l.typedBuffer,l.elementCount,!0)]),c.push([T.TANGENT,r])}if(p(e.attributes.texCoord0)){const l=k(ao,o);po(l,e.attributes.texCoord0),i.push([T.UV0,new X(l.typedBuffer,l.elementCount,!0)]),c.push([T.UV0,r])}if(p(e.attributes.color)){const l=k(Ne,o);if(e.attributes.color.elementCount===4)e.attributes.color instanceof He?Xe(l,e.attributes.color,255):e.attributes.color instanceof Ne?ho(l,e.attributes.color):e.attributes.color instanceof ro&&Xe(l,e.attributes.color,1/256);else{vo(l,255,255,255,255);const s=new qe(l.buffer,0,4);e.attributes.color instanceof ve?Ye(s,e.attributes.color,255):e.attributes.color instanceof qe?lo(s,e.attributes.color):e.attributes.color instanceof io&&Ye(s,e.attributes.color,1/256)}i.push([T.COLOR,new X(l.typedBuffer,l.elementCount,!0)]),c.push([T.COLOR,r])}return{geometry:new At(t,i,c),vertexCount:o}}const pe=lt();function Qa(e){switch(e){case"BLEND":return C.Blend;case"MASK":return C.Mask;case"OPAQUE":case null:case void 0:return C.Opaque}}function er(e,t){switch(t){case Ae.TRIANGLES:return xo(e);case Ae.TRIANGLE_STRIP:return go(e);case Ae.TRIANGLE_FAN:return fo(e)}}function tr(e,t){for(let o=0;o<e.model.lods.length;++o){const r=e.model.lods[o];for(const n of r.parts){const i=n.attributes.normal;if(we(i))return;const c=n.attributes.position,l=c.count,s=_(),f=_(),v=_(),x=k(Ne,l),w=k(ve,l),g=eo(oo(),n.transform);for(let y=0;y<l;y++){c.getVec(y,f),i.getVec(y,s),We(f,f,n.transform),he(v,f,t.center),je(v,v,t.radius);const S=v[2],A=rt(v),P=Math.min(.45+.55*A*A,1);je(v,v,t.radius),g!==null&&We(v,v,g),at(v,v),o+1!==e.model.lods.length&&e.model.lods.length>1&&to(v,v,s,S>-1?.2:Math.min(-4*S-3.8,1)),w.setVec(y,v),x.set(y,0,255*P),x.set(y,1,255*P),x.set(y,2,255*P),x.set(y,3,255)}n.attributes.normal=w,n.attributes.color=x}}}var Cr=Object.freeze(Object.defineProperty({__proto__:null,fetch:Ja,gltfToEngineResources:Vt,parseUrl:Dt},Symbol.toStringTag,{value:"Module"}));export{Ce as E,La as I,$a as Q,yr as a,Q as c,ha as e,Ie as h,$ as i,Ve as n,Cr as o,Pt as p,Ja as t,ze as u};
