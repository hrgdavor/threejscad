# threejscad
Attempt to combine JSCAD([OpenJSCAD](https://github.com/jscad/OpenJSCAD.org)) and THREE.js and explore what else can be done with JSCAD models. 

Issues created based on threejscad explorations
 - [ ] [805](https://github.com/jscad/OpenJSCAD.org/issues/805) Allow scripts to cache geometries when parameters change
 - [ ] [806](https://github.com/jscad/OpenJSCAD.org/issues/806) (may be impossible because regl has no real suport for webgl2) Improve regl-renderer to better reuse same geometry with different location or color
 - [x] [813](https://github.com/jscad/OpenJSCAD.org/issues/813) Improve regl-renderer to use less power (skip repaint when not needed)
 - [ ] [818](https://github.com/jscad/OpenJSCAD.org/issues/818) Move render to worker and use offscreen-canvas (transferControlToOffscreen)
 - [ ] [856](https://github.com/jscad/OpenJSCAD.org/issues/856) reimagine transforms to be more open to more rich geometry behaviors

Discussions
 - [845](https://github.com/jscad/OpenJSCAD.org/discussions/845) Typed Arrays usage and conversion
 - [883](https://github.com/jscad/OpenJSCAD.org/discussions/883) V1 -> V2 migration guide
 - [900](https://github.com/jscad/OpenJSCAD.org/discussions/900) multiple workers
 - [899](https://github.com/jscad/OpenJSCAD.org/discussions/899) segments abuse and segmetns/precision

PR's
 - [ ] [869](https://github.com/jscad/OpenJSCAD.org/pull/869) Performance improvement for measure bounding box
 - [ ] [859](https://github.com/jscad/OpenJSCAD.org/pull/859) clone utility / immutability
 - [ ] [866](https://github.com/jscad/OpenJSCAD.org/pull/866) change applyTransforms and transform functions to clone geometry
 - [x] [878](https://github.com/jscad/OpenJSCAD.org/pull/878) performance, use webgl2 as default context
 - [x] [891](https://github.com/jscad/OpenJSCAD.org/pull/891) developer friendly syntax for getParameterDefinitions
 - [x] [897](https://github.com/jscad/OpenJSCAD.org/pull/897) fix [#114](https://github.com/jscad/OpenJSCAD.org/issues/114)
 - [x] [886](https://github.com/jscad/OpenJSCAD.org/pull/886) fix [885](https://github.com/jscad/OpenJSCAD.org/issues/885) TypeError: Cannot read property 'isClosed' ...

New feature proposal:
 - [x] [875](https://github.com/jscad/OpenJSCAD.org/discussions/875) developer friendly syntax for getParameterDefinitions
 - [ ] [858](https://github.com/jscad/OpenJSCAD.org/discussions/858) New connectors proposal 
 - [ ] [837](https://github.com/jscad/OpenJSCAD.org/discussions/837) Feature proposal for openscad website url scheme
 - [x] Integration with cadhub [893](https://github.com/jscad/OpenJSCAD.org/discussions/893)
