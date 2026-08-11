// ============================================================================
// CADDED Software (Civil/Architecture) — Per-Topic Quiz Map (issue #93)
// ----------------------------------------------------------------------------
// The frontend topic-lock flow requires EVERY topic to have its own attached
// QuizQuestions: "Start Topic Quiz" hits /quiz/questions/topic/:topicId and
// returns null (→ 404 → topic locked forever) if a topic has zero questions.
// These are the topic-level gates; section-level chapter quizzes live in
// cadd_civil.ts. Keyed by the EXACT topic title from caddCivilSections (titles
// are course-unique). Four tool-specific questions per topic.
// ============================================================================

export interface CaddCivilTopicQuiz {
  text: string;
  options: string[]; // exactly 4
  correctAnswer: string; // one of options
}

export const caddCivilTopicQuizzes: Record<string, CaddCivilTopicQuiz[]> = {
  'Civil Drawing Setup: Units & Scales': [
    { text: 'Which INSUNITS value makes AutoCAD assume millimetres when a drawing is inserted?', options: ['4', '1', '2', '6'], correctAnswer: '4' },
    { text: 'Civil drawings are drawn at…', options: ['1:1 in model space, with scale set in the viewport', 'Full scale in paper space', '1:100 in model space', 'No fixed scale'], correctAnswer: '1:1 in model space, with scale set in the viewport' },
    { text: 'The system variable that keeps dashed lines readable at the plot scale is…', options: ['LTSCALE', 'DIMSCALE', 'PLINEWID', 'FILEDIA'], correctAnswer: 'LTSCALE' },
    { text: 'The classic "everything inserted 25.4x too big" error between offices is caused by…', options: ['Mismatched INSUNITS/DWGUNITS between files', 'Too many layers', 'A rotated viewport', 'The wrong lineweight'], correctAnswer: 'Mismatched INSUNITS/DWGUNITS between files' },
  ],
  'Layers & Styles for Civil Drawings': [
    { text: 'In the NCS standard, the discipline letter for survey/mapping layers is…', options: ['V', 'C', 'L', 'P'], correctAnswer: 'V' },
    { text: 'Proposed civil work is conventionally shown…', options: ['Solid and bold', 'Dashed and light', 'On layer 0', 'With no linetype'], correctAnswer: 'Solid and bold' },
    { text: 'A named snapshot of layer visibility you can restore in one click is a…', options: ['Layer state', 'Layer filter', 'Layer property', 'Linetype'], correctAnswer: 'Layer state' },
    { text: 'The NCS layer name for an existing major contour is…', options: ['C-TOPO-MAJR-EX', 'V-ROAD-E-PROP', 'C-EASM', 'A-WALL'], correctAnswer: 'C-TOPO-MAJR-EX' },
  ],
  'Site Data: Coordinate Entry & Survey Points': [
    { text: 'A survey point at Northing 1000, Easting 2000 is typed into AutoCAD as…', options: ['2000,1000', '1000,2000', '1000,2000,1000', '2000 only'], correctAnswer: '2000,1000' },
    { text: 'The best way to verify an imported point set is correct is to…', options: ['Check one known benchmark coordinate against the drawing', 'Count the points', 'Zoom extents', 'Trust the import'], correctAnswer: 'Check one known benchmark coordinate against the drawing' },
    { text: 'A .scr script file is played back with the…', options: ['SCRIPT command', 'UNITS command', 'PLOT command', 'LAYER command'], correctAnswer: 'SCRIPT command' },
    { text: 'Smart points that carry a point number, description and raw northing/easting are…', options: ['COGO points', 'Survey markers', 'Nodes', 'Blocks'], correctAnswer: 'COGO points' },
  ],
  'Grids, Boundaries & Drawing Aids': [
    { text: 'Which function key toggles the SNAP cursor?', options: ['F9', 'F8', 'F7', 'F10'], correctAnswer: 'F9' },
    { text: 'Object Snap Tracking (OTRACK) lets you…', options: ['Project a temporary alignment from an existing point to click its intersection', 'Force the cursor to grid increments', 'Lock to horizontal/vertical', 'Zoom to extents'], correctAnswer: 'Project a temporary alignment from an existing point to click its intersection' },
    { text: 'The command that sets the drawing extents the grid fills is…', options: ['LIMITS', 'GRID', 'SNAP', 'PLINE'], correctAnswer: 'LIMITS' },
    { text: 'Why should SNAP be turned off when tracing survey geometry?', options: ['A snapping cursor cannot hit an off-grid point', 'SNAP slows the computer', 'SNAP deletes layers', 'SNAP changes units'], correctAnswer: 'A snapping cursor cannot hit an off-grid point' },
  ],
  'Drafting the Site Boundary': [
    { text: 'A boundary leg "North 45 East, 60.00 m" is best entered as…', options: ['@60.00<45 polar entry', '60.00,45', '45,60.00', 'A freehand click'], correctAnswer: '@60.00<45 polar entry' },
    { text: 'The gap between the last boundary point and the start is the…', options: ['Closure error', 'Setback', 'Easement', 'Culvert'], correctAnswer: 'Closure error' },
    { text: 'The command that reports the polyline area for the deed check is…', options: ['LIST', 'AREA', 'DIST', 'UNITS'], correctAnswer: 'LIST' },
    { text: 'AutoCAD measures angles counter-clockwise from east, while survey descriptions measure from…', options: ['North (quadrant bearings)', 'South', 'The property line', 'True north only'], correctAnswer: 'North (quadrant bearings)' },
  ],
  'Utilities, Setbacks & Zoning Lines': [
    { text: 'The layer convention for a proposed water service line is…', options: ['V-UTIL-WAT-PROP', 'C-TOPO-MAJR-EX', 'A-DOOR', 'S-GRID'], correctAnswer: 'V-UTIL-WAT-PROP' },
    { text: 'The minimum distance a building must keep from the boundary is the…', options: ['Setback', 'Easement', 'Contour interval', 'Overhang'], correctAnswer: 'Setback' },
    { text: 'A building 0.2 m inside its required setback will…', options: ['Fail the plan-check', 'Be approved with a note', 'Auto-correct', 'Only matter at handover'], correctAnswer: 'Fail the plan-check' },
    { text: 'A floodplain boundary on a site plan is often shown as…', options: ['A screened hatch', 'A bold red line', 'A text note only', 'A contour'], correctAnswer: 'A screened hatch' },
  ],
  'Spot Elevations & Contour Lines': [
    { text: 'A point with its ground height, placed at a corner or entrance, is a…', options: ['Spot elevation', 'Benchmark', 'Contour', 'Setback'], correctAnswer: 'Spot elevation' },
    { text: 'The vertical spacing between contour lines is the…', options: ['Contour interval', 'Spot elevation', 'Slope ratio', 'Cut depth'], correctAnswer: 'Contour interval' },
    { text: 'Where contours are close together the ground is…', options: ['Steep', 'Flat', 'Below sea level', 'Infill'], correctAnswer: 'Steep' },
    { text: 'Every fifth (thicker, labelled) contour is an…', options: ['Index contour', 'Spot contour', 'Major grid', 'Ridge line'], correctAnswer: 'Index contour' },
  ],
  'Dimensioning Site Plans': [
    { text: 'The dimension style field that overrides measured distances for a site plan is…', options: ['Linear', 'Angular', 'Radial', 'Ordinate'], correctAnswer: 'Linear' },
    { text: 'To dimension one point from both axes of a common origin you use…', options: ['Ordinate dimensions', 'Angular dimensions', 'Radius dimensions', 'Leader notes'], correctAnswer: 'Ordinate dimensions' },
    { text: 'The plot scale for a site plan is set in…', options: ['The layout viewport scale', 'The UNITS dialog', 'The layer list', 'The grid'], correctAnswer: 'The layout viewport scale' },
    { text: 'Civil dimensions are typically shown in…', options: ['Metres with two decimals', 'Centimetres as integers', 'Kilometres', 'Square units'], correctAnswer: 'Metres with two decimals' },
  ],
  'Drafting Wall Layouts & Room Planning': [
    { text: 'The floor plan tool that draws parallel wall lines at a fixed thickness is…', options: ['MLINE (multiline)', 'PLINE', 'XLINE', 'ARC'], correctAnswer: 'MLINE (multiline)' },
    { text: 'The standard wall thickness for an internal brick partition is typically…', options: ['100-115 mm', '500 mm', '25 mm', '10 mm'], correctAnswer: '100-115 mm' },
    { text: 'A closed loop of walls that becomes a room is shown by…', options: ['Hatching the room area', 'Adding a second wall', 'Deleting the door', 'Zooming out'], correctAnswer: 'Hatching the room area' },
    { text: 'The recommended minimum clearance in front of a door swing is about…', options: ['900 mm', '100 mm', '10 mm', '5 m'], correctAnswer: '900 mm' },
  ],
  'Doors, Windows & Openings': [
    { text: 'The symbol that shows the door swing and opening direction in plan is…', options: ['The door swing arc and leaf line', 'A solid hatch', 'A circle', 'A contour'], correctAnswer: 'The door swing arc and leaf line' },
    { text: 'The standard residential interior door leaf width is typically…', options: ['900 mm', '450 mm', '1.5 m', '50 mm'], correctAnswer: '900 mm' },
    { text: 'A window in plan is shown as…', options: ['A thin double line on the wall with a sill line', 'A solid rectangle', 'A swing arc', 'A contour'], correctAnswer: 'A thin double line on the wall with a sill line' },
    { text: 'The gap a wall leaves for a window is dimensioned by its…', options: ['Rough opening (width and head height)', 'Swing angle', 'Glazing colour', 'Frame material'], correctAnswer: 'Rough opening (width and head height)' },
  ],
  'Furniture & Appliance Layout': [
    { text: 'Furniture in a floor plan is best placed on…', options: ['Its own frozen/thawed layer (A-FFUR)', 'Layer 0', 'The wall layer', 'A contour layer'], correctAnswer: 'Its own frozen/thawed layer (A-FFUR)' },
    { text: 'The 600 mm counter with 450 mm base units is the standard depth of a…', options: ['Kitchen worktop run', 'Bed', 'Wardrobe', 'Stair tread'], correctAnswer: 'Kitchen worktop run' },
    { text: 'The recommended clear walkway between facing kitchen counters is about…', options: ['1000-1200 mm', '300 mm', '50 mm', '5 m'], correctAnswer: '1000-1200 mm' },
    { text: 'Furniture blocks are usually stored…', options: ['In a block library/tool palette', 'As freehand lines', 'On the dimension layer', 'In the title block'], correctAnswer: 'In a block library/tool palette' },
  ],
  'Plan Coordination & Common Mistakes': [
    { text: 'The most common floor-plan coordination mistake is…', options: ['Door and window heights not matching across elevations and sections', 'Too many colours', 'Using too few layers', 'Missing a north arrow'], correctAnswer: 'Door and window heights not matching across elevations and sections' },
    { text: 'Every plan sheet should carry…', options: ['A north arrow, scale bar and match line references', 'A photo', 'A texture map', 'A schedule of layers'], correctAnswer: 'A north arrow, scale bar and match line references' },
    { text: 'When a plan and its reflected ceiling plan disagree, the problem is usually…', options: ['The room boundaries moved', 'The font', 'The lineweight', 'The paper size'], correctAnswer: 'The room boundaries moved' },
    { text: 'The overlay that reveals two floors misaligned is…', options: ['Drawing both floors in one file on separate layers and comparing', 'Printing once', 'Deleting a floor', 'Changing units'], correctAnswer: 'Drawing both floors in one file on separate layers and comparing' },
  ],
  'Creating Sections & Elevations': [
    { text: 'The command that creates a section cut through a building in AutoCAD is…', options: ['SECTION', 'EXTRUDE', 'SLICE', 'AREA'], correctAnswer: 'SECTION' },
    { text: 'The projection of the building as seen from outside is the…', options: ['Elevation', 'Section', 'Plan', 'Detail'], correctAnswer: 'Elevation' },
    { text: 'The floor-to-floor height is measured between…', options: ['Consecutive finished floor levels', 'The top of the parapet and the ground', 'The walls and the roof', 'The door heads'], correctAnswer: 'Consecutive finished floor levels' },
    { text: 'A section line on the plan is drawn with…', options: ['A thick line with arrows showing the cut direction', 'A dashed contour', 'A centre line', 'A text leader'], correctAnswer: 'A thick line with arrows showing the cut direction' },
  ],
  'Hatching, Materials & Annotations': [
    { text: 'The hatch pattern used to show brick in a section is…', options: ['ANSI31 (or brick pattern)', 'DOTS', 'GRASS', 'CROSS'], correctAnswer: 'ANSI31 (or brick pattern)' },
    { text: 'A hatch whose spacing automatically follows the drawing scale is set with…', options: ['Annotative hatching', 'A fixed spacing', 'The colour index', 'A layer filter'], correctAnswer: 'Annotative hatching' },
    { text: 'The symbol that ties a note to a point on the drawing is a…', options: ['Leader with text', 'Dimension', 'Contour', 'Viewport'], correctAnswer: 'Leader with text' },
    { text: 'Text in a civil drawing is conventionally placed…', options: ['Left-aligned, reading left to right, on a text layer', 'Vertical', 'On layer 0', 'Inside the contours'], correctAnswer: 'Left-aligned, reading left to right, on a text layer' },
  ],
  'Title Blocks & Sheet Layouts': [
    { text: 'The standard sheet sizes for civil drawing sets are…', options: ['A0-A4 (ISO) or ANSI A-E', 'Only A4', 'Custom freehand sizes', 'Whatever prints'], correctAnswer: 'A0-A4 (ISO) or ANSI A-E' },
    { text: 'The title block always carries…', options: ['Project name, sheet number, scale, date and revision', 'A schedule of layers', 'A texture', 'The site photos'], correctAnswer: 'Project name, sheet number, scale, date and revision' },
    { text: 'The recommended free space between the drawing and the title block is at least…', options: ['10 mm', '0 mm', '100 mm', 'Half the sheet'], correctAnswer: '10 mm' },
    { text: 'A title block border is drawn on…', options: ['A dedicated border/title layer', 'Layer 0', 'The contour layer', 'The dimension layer'], correctAnswer: 'A dedicated border/title layer' },
  ],
  'Plotting & Scaling for Municipal Submissions': [
    { text: 'The setting that scales a drawing to fit a sheet at a known scale is…', options: ['The layout viewport scale', 'The GRID spacing', 'The LTSCALE only', 'The layer colour'], correctAnswer: 'The layout viewport scale' },
    { text: 'Lineweights in a plotted drawing are controlled by…', options: ['Plot style tables (CTB/STB)', 'The font', 'The snap spacing', 'The hatch angle'], correctAnswer: 'Plot style tables (CTB/STB)' },
    { text: 'The property that scales text and dims to the sheet regardless of viewport scale is…', options: ['Annotative scale', 'Fixed text height', 'The layer freeze', 'The plot stamp'], correctAnswer: 'Annotative scale' },
    { text: 'A municipal submission is usually printed at…', options: ['The scale declared in the title block with the CTB applied', 'The largest possible zoom', '100% always', 'Any scale'], correctAnswer: 'The scale declared in the title block with the CTB applied' },
  ],
  'The 3ds Max Interface & Viewport Navigation': [
    { text: 'The 3ds Max panel on the right that lists the selected object properties is the…', options: ['Command panel', 'Material editor', 'Render setup', 'Track bar'], correctAnswer: 'Command panel' },
    { text: 'The keyboard shortcut to frame the selected object in all viewports is…', options: ['Z (zoom extents selected)', 'W', 'F', 'X'], correctAnswer: 'Z (zoom extents selected)' },
    { text: 'A viewport that shows a shaded, lit view of the model is the…', options: ['Perspective (shaded) viewport', 'Top viewport', 'Wireframe viewport', 'Schematic viewport'], correctAnswer: 'Perspective (shaded) viewport' },
    { text: 'The gizmo that moves, rotates and scales an object is the…', options: ['Transform gizmo', 'Modifier stack', 'Material slot', 'UVW map'], correctAnswer: 'Transform gizmo' },
  ],
  'Primitives, Splines & Editable Polys': [
    { text: 'The 3ds Max primitive used to start most wall volumes is…', options: ['Box', 'Sphere', 'Cone', 'GeoSphere'], correctAnswer: 'Box' },
    { text: 'A curved outline used to create a rail or an extrusion profile is a…', options: ['Spline', 'Box', 'Sphere', 'Grid'], correctAnswer: 'Spline' },
    { text: 'The modifier that lets you edit an object at vertex, edge and polygon level is…', options: ['Editable Poly', 'TurboSmooth', 'UVW Map', 'Lathe'], correctAnswer: 'Editable Poly' },
    { text: 'The modifier that smooths a polygonal mesh into a rounded form is…', options: ['TurboSmooth / MeshSmooth', 'Extrude', 'Bevel', 'Lathe'], correctAnswer: 'TurboSmooth / MeshSmooth' },
  ],
  'Building Shells: Walls, Floors, Roofs': [
    { text: 'The fastest way to build four exterior walls in 3ds Max is…', options: ['Draw a spline rectangle and extrude it to wall height', 'Place four boxes freehand', 'Clone a single face', 'Lathe a circle'], correctAnswer: 'Draw a spline rectangle and extrude it to wall height' },
    { text: 'The tool that hollows a wall volume into a shell with thickness is…', options: ['Shell modifier', 'TurboSmooth', 'Lathe', 'Spherify'], correctAnswer: 'Shell modifier' },
    { text: 'To cut a window opening through a wall you use…', options: ['A boolean subtract or edge polygon deletion', 'The Shell modifier', 'TurboSmooth', 'A material map'], correctAnswer: 'A boolean subtract or edge polygon deletion' },
    { text: 'A flat roof slab is best built as…', options: ['A box the size of the roof', 'A sphere flattened', 'A spline with no thickness', 'A light'], correctAnswer: 'A box the size of the roof' },
  ],
  'Modeling Details: Trim, Moldings & Furniture': [
    { text: 'The modifier that turns a profile spline into a 3D trim or molding along an edge is…', options: ['Bevel Profile', 'TurboSmooth', 'Lathe', 'Spherify'], correctAnswer: 'Bevel Profile' },
    { text: 'The fastest way to make repeated identical windows across a facade is…', options: ['Array/Instance clones', 'Drawing each window fresh', 'A single boolean', 'A material'], correctAnswer: 'Array/Instance clones' },
    { text: 'A table leg repeated four times is best created with…', options: ['Instance cloning so one edit updates all four', 'Four separate boxes', 'A boolean', 'TurboSmooth'], correctAnswer: 'Instance cloning so one edit updates all four' },
    { text: 'The modifier that rounds the edges of a furniture model is…', options: ['Chamfer', 'Lathe', 'Sweep', 'Extrude'], correctAnswer: 'Chamfer' },
  ],
  'The Material Editor & Material Slots': [
    { text: 'The 3ds Max panel where material colours and maps are built is the…', options: ['Material Editor', 'Render Setup', 'Track Bar', 'Command panel'], correctAnswer: 'Material Editor' },
    { text: 'A material shown in one of the sample spheres is stored in a…', options: ['Material slot', 'Viewport', 'Modifier', 'Layer'], correctAnswer: 'Material slot' },
    { text: 'Assigning a material to a selected object is done by…', options: ['Clicking Assign Material to Selection', 'Dragging the object into the editor', 'Re-rendering', 'Saving the scene'], correctAnswer: 'Clicking Assign Material to Selection' },
    { text: 'A material whose properties the viewport shows as a shaded surface is displayed in…', options: ['Realistic/Shaded viewport mode', 'Wireframe mode', 'Bounding box mode', 'Top view'], correctAnswer: 'Realistic/Shaded viewport mode' },
  ],
  'Diffuse, Bump & Specular Maps': [
    { text: 'The map slot that gives a material its base colour and pattern is the…', options: ['Diffuse', 'Bump', 'Specular', 'Opacity'], correctAnswer: 'Diffuse' },
    { text: 'The map slot that fakes surface roughness without adding geometry is the…', options: ['Bump', 'Diffuse', 'Self-illumination', 'Environment'], correctAnswer: 'Bump' },
    { text: 'A bump map is a greyscale image where light pixels…', options: ['Raise the surface (simulated height)', 'Make it transparent', 'Change the colour', 'Add a specular shine'], correctAnswer: 'Raise the surface (simulated height)' },
    { text: 'The map slot that controls the highlight on a glossy surface is the…', options: ['Specular', 'Diffuse', 'Bump', 'Refraction'], correctAnswer: 'Specular' },
  ],
  'UVW Mapping & Real-World Scale': [
    { text: 'The modifier that controls how a texture is laid over a surface is…', options: ['UVW Map', 'TurboSmooth', 'Lathe', 'Bevel'], correctAnswer: 'UVW Map' },
    { text: 'When a floor texture stretches or repeats wrong, the fix is…', options: ['Adjust the UVW mapping tiling/scale', 'Increase the render resolution', 'Change the camera', 'Add more lights'], correctAnswer: 'Adjust the UVW mapping tiling/scale' },
    { text: 'Real-world scale on a UVW map means…', options: ['One texture tile equals a real dimension like 1 m', 'The texture is 100% opaque', 'The map is black and white', 'The scene is at 0,0,0'], correctAnswer: 'One texture tile equals a real dimension like 1 m' },
    { text: 'The UVW map type that wraps a map around a cylinder is…', options: ['Cylindrical', 'Box', 'Planar', 'Face'], correctAnswer: 'Cylindrical' },
  ],
  'Texture Libraries & PBR Materials': [
    { text: 'A PBR material is physically based, meaning its properties match…', options: ['Real-world reflectance and roughness', 'A fixed colour ramp', 'The viewport wireframe', 'The render passes'], correctAnswer: 'Real-world reflectance and roughness' },
    { text: 'The PBR map that stores how rough or smooth a surface is is the…', options: ['Roughness', 'Diffuse', 'Bump', 'Opacity'], correctAnswer: 'Roughness' },
    { text: 'A texture library stores maps as image files whose resolution is measured in…', options: ['Pixels (e.g. 2048x2048)', 'Kilobytes only', 'Layers', 'Polys'], correctAnswer: 'Pixels (e.g. 2048x2048)' },
    { text: 'The correct workflow for a tiling floor texture is…', options: ['Seamless map with UVW tiling set to real-world tile size', 'One giant bitmap stretched over the room', 'A plain colour with no map', 'A bump map only'], correctAnswer: 'Seamless map with UVW tiling set to real-world tile size' },
  ],
  'Daylight, Sun & Sky Systems': [
    { text: 'The 3ds Max system that simulates real sun position for a location and time is…', options: ['Daylight/Sun Positioner', 'Omni light', 'Spot light', 'Free light'], correctAnswer: 'Daylight/Sun Positioner' },
    { text: 'The Daylight system combines the sun with…', options: ['Sky (physical sky dome)', 'A spotlight', 'A skylight only', 'A glow effect'], correctAnswer: 'Sky (physical sky dome)' },
    { text: 'Sun angle in 3ds Max is set by…', options: ['Date, time and geographic location', 'A random seed', 'The render passes', 'The camera height'], correctAnswer: 'Date, time and geographic location' },
    { text: 'The light that gives the soft, even daylight look of an overcast sky is a…', options: ['Skylight', 'Spot light', 'Omni light', 'Target spot'], correctAnswer: 'Skylight' },
  ],
  'Photometric Lights & Shadows': [
    { text: 'Photometric lights are measured in real units called…', options: ['Lumens and candela', 'Pixels', 'Decibels', 'Watt-hours'], correctAnswer: 'Lumens and candela' },
    { text: 'The main reason to use photometric (physical) lights over free lights is…', options: ['Real-world intensity and falloff behave like reality', 'They are faster to render', 'They need no shadows', 'They are invisible'], correctAnswer: 'Real-world intensity and falloff behave like reality' },
    { text: 'Soft shadows are created by…', options: ['A larger light area/shadow softness', 'More render passes', 'A higher exposure', 'A longer focal length'], correctAnswer: 'A larger light area/shadow softness' },
    { text: 'A light that casts no shadow is usually…', options: ['A hidden/shadow-off light for fill only', 'The key light', 'A photometric light', 'A daylight system'], correctAnswer: 'A hidden/shadow-off light for fill only' },
  ],
  'Three-Point Lighting Setup': [
    { text: 'The three lights in a classic three-point setup are…', options: ['Key, fill and rim/back', 'Sun, sky and bounce', 'Spot, omni and target', 'Red, green and blue'], correctAnswer: 'Key, fill and rim/back' },
    { text: 'The brightest light that defines the main look is the…', options: ['Key light', 'Fill light', 'Rim light', 'Skylight'], correctAnswer: 'Key light' },
    { text: 'The light that softens the shadows on the dark side is the…', options: ['Fill light', 'Key light', 'Rim light', 'Bounce only'], correctAnswer: 'Fill light' },
    { text: 'A rim/back light is placed…', options: ['Behind the subject to separate it from the background', 'In front at the camera', 'Under the floor', 'At the horizon'], correctAnswer: 'Behind the subject to separate it from the background' },
  ],
  'Lighting for Exterior vs Interior': [
    { text: 'An exterior night render of a building usually needs…', options: ['Interior lights visible through windows plus a moonlight/ambient', 'Only the sun at noon', 'No lights at all', 'A pure white overburn'], correctAnswer: 'Interior lights visible through windows plus a moonlight/ambient' },
    { text: 'The common mistake in interior daylight renders is…', options: ['Too much overexposure from unadjusted sun intensity', 'Too few materials', 'No camera', 'Wrong resolution'], correctAnswer: 'Too much overexposure from unadjusted sun intensity' },
    { text: 'Interior artificial lighting is best done with…', options: ['Photometric IES lights on the fixtures', 'One giant omni light', 'No lights', 'A daylight system only'], correctAnswer: 'Photometric IES lights on the fixtures' },
    { text: 'A daylight interior at 10:00 vs 16:00 changes mostly in…', options: ['Sun angle, shadow length and colour temperature', 'The material slots', 'The polygon count', 'The camera lens'], correctAnswer: 'Sun angle, shadow length and colour temperature' },
  ],
  'Camera Setup & Composition': [
    { text: 'The focal length that mimics the human eye (about 35-50 mm) avoids…', options: ['Unnatural wide-angle distortion', 'Slow rendering', 'Dark shadows', 'No reflections'], correctAnswer: 'Unnatural wide-angle distortion' },
    { text: 'The rule of thirds in camera composition means…', options: ['Placing the subject off-centre at the third lines', 'Using three lights', 'Three render passes', 'Three viewports'], correctAnswer: 'Placing the subject off-centre at the third lines' },
    { text: 'The 3ds Max camera parameter that sets how much of the scene is framed is the…', options: ['Field of view / focal length', 'Target distance', 'Lens aperture only', 'Camera height'], correctAnswer: 'Field of view / focal length' },
    { text: 'A camera looking straight at a wall should be moved to…', options: ['An angled, three-quarter view for depth', 'Higher than the ceiling', 'Directly behind the camera', 'Inside the wall'], correctAnswer: 'An angled, three-quarter view for depth' },
  ],
  'Render Settings: Resolution & Quality': [
    { text: 'The render setting that controls image sharpness/detail is…', options: ['Resolution (width x height) in pixels', 'The material slots', 'The camera target', 'The scene units'], correctAnswer: 'Resolution (width x height) in pixels' },
    { text: 'A final presentation render is typically at least…', options: ['2000-4000 px on the long side', '400 px', '800 px', '256 px'], correctAnswer: '2000-4000 px on the long side' },
    { text: 'Increasing render quality raises…', options: ['Render time, samples and file size', 'The polygon count', 'The material count', 'The scene units'], correctAnswer: 'Render time, samples and file size' },
    { text: 'The setting that reduces noise (speckles) in a render is…', options: ['More samples per pixel', 'A lower resolution', 'Fewer lights', 'A faster camera'], correctAnswer: 'More samples per pixel' },
  ],
  'V-Ray / Mental Ray Workflow': [
    { text: 'The V-Ray render element that separates light, diffuse and reflection for compositing is…', options: ['Render Elements / passes', 'The material editor', 'The UVW map', 'The track bar'], correctAnswer: 'Render Elements / passes' },
    { text: 'A V-Ray material that reflects its environment and obeys IBL is…', options: ['VRayMtl (physically based)', 'A standard material', 'A matte material', 'A wire material'], correctAnswer: 'VRayMtl (physically based)' },
    { text: 'V-Ray quality is primarily controlled by…', options: ['Image sampler/light cache settings', 'The viewport background', 'The number of cameras', 'The units'], correctAnswer: 'Image sampler/light cache settings' },
    { text: 'The fastest preview of final lighting in V-Ray is a…', options: ['Low-quality test render with few samples', 'Full production render first', 'Viewport wireframe', 'A photo'], correctAnswer: 'Low-quality test render with few samples' },
  ],
  'Post-Production in Photoshop': [
    { text: 'The Photoshop adjustment that corrects a washed-out render is…', options: ['Levels/Curves', 'Crop', 'Rotate', 'Blur'], correctAnswer: 'Levels/Curves' },
    { text: 'Colour grading a render to a warm/cool look is done with…', options: ['Photo Filter / Color Balance', 'The eraser', 'The eyedropper only', 'The brush size'], correctAnswer: 'Photo Filter / Color Balance' },
    { text: 'The layer type that lets render passes blend non-destructively is…', options: ['Adjustment and blend-mode layers', 'The background layer', 'A rasterized layer', 'A path'], correctAnswer: 'Adjustment and blend-mode layers' },
    { text: 'Adding a sky behind a transparent-rendered building uses…', options: ['An alpha/matte pass composited under the sky', 'Painting over the building', 'The blur filter', 'The rotate tool'], correctAnswer: 'An alpha/matte pass composited under the sky' },
  ],
  'The SketchUp Interface & Axes': [
    { text: 'The three coloured axes in SketchUp are…', options: ['Red X, green Y, blue Z', 'Red Z, blue Y, green X', 'All white', 'Black and grey'], correctAnswer: 'Red X, green Y, blue Z' },
    { text: 'When a line snaps to an axis, the line turns…', options: ['The axis colour (red/green/blue)', 'White', 'Black', 'Grey'], correctAnswer: 'The axis colour (red/green/blue)' },
    { text: 'A closed loop of coplanar edges creates a…', options: ['Face', 'Component', 'Group', 'Layer'], correctAnswer: 'Face' },
    { text: 'If a rectangle does not fill with a face, the usual cause is…', options: ['Edges not coplanar or not closed', 'Too many layers', 'The axes are hidden', 'The units are wrong'], correctAnswer: 'Edges not coplanar or not closed' },
  ],
  'Push/Pull, Offset & Follow Me': [
    { text: 'The tool that extrudes a face into a 3D volume is…', options: ['Push/Pull', 'Offset', 'Follow Me', 'Scale'], correctAnswer: 'Push/Pull' },
    { text: 'The tool that copies a shape parallel to itself (like a wall outline) is…', options: ['Offset', 'Push/Pull', 'Follow Me', 'Eraser'], correctAnswer: 'Offset' },
    { text: 'The tool that sweeps a profile along a path (for mouldings and pipes) is…', options: ['Follow Me', 'Push/Pull', 'Offset', 'Orbit'], correctAnswer: 'Follow Me' },
    { text: 'Double-clicking Push/Pull on a face…', options: ['Repeats the last push/pull distance', 'Deletes the face', 'Creates a group', 'Orbits the view'], correctAnswer: 'Repeats the last push/pull distance' },
  ],
  'Groups, Components & Component Instances': [
    { text: 'The key difference between a group and a component is…', options: ['Component instances update together; groups are independent copies', 'Groups update together', 'They are identical', 'Components cannot move'], correctAnswer: 'Component instances update together; groups are independent copies' },
    { text: 'Editing one component instance affects…', options: ['All other instances of that component', 'Only that instance', 'The whole model', 'Nothing'], correctAnswer: 'All other instances of that component' },
    { text: 'The tool that makes an entity reuseable and named is…', options: ['Make Component', 'Make Group', 'Explode', 'Intersect'], correctAnswer: 'Make Component' },
    { text: 'A group is best used when…', options: ['You need a one-off collection that stays independent', 'You need auto-updating repetition', 'You need a schedule', 'You need scenes'], correctAnswer: 'You need a one-off collection that stays independent' },
  ],
  'Styles, Scenes & Viewport Management': [
    { text: 'The SketchUp feature that saves a camera position and a view state is a…', options: ['Scene', 'Layer', 'Component', 'Section cut'], correctAnswer: 'Scene' },
    { text: 'A saved set of edge and face display options (hidden lines, profiles) is a…', options: ['Style', 'Scene', 'Layer', 'Template'], correctAnswer: 'Style' },
    { text: 'Animating between scenes produces…', options: ['A tour/animatic of the model', 'A new model', 'A component', 'A texture'], correctAnswer: 'A tour/animatic of the model' },
    { text: 'Scenes are stored in the…', options: ['Scenes/Outliner panels', 'Extensions warehouse', 'Ruby console', 'Material browser'], correctAnswer: 'Scenes/Outliner panels' },
  ],
  'Groups vs Components: When to Use Each': [
    { text: 'A reception desk used in exactly one model should be…', options: ['A group', 'A component', 'A scene', 'A layer'], correctAnswer: 'A group' },
    { text: 'A door used in 40 places across a project should be…', options: ['A component', 'A group', 'A scene', 'A style'], correctAnswer: 'A component' },
    { text: 'When you edit one component and the other copies do not change, the component was…', options: ['Made unique (Edit > Make Unique)', 'Deleted', 'Hidden', 'Exploded'], correctAnswer: 'Made unique (Edit > Make Unique)' },
    { text: 'An instance of a component resized with Scale stays a component because…', options: ['Scaling affects the instance, not the definition', 'Scale breaks the link', 'Components cannot scale', 'Groups scale instead'], correctAnswer: 'Scaling affects the instance, not the definition' },
  ],
  'Component Library & Dynamic Components': [
    { text: 'The panel that holds the SketchUp component library is the…', options: ['Components panel (Window > Components)', 'Layers panel', 'Scenes panel', 'Ruby console'], correctAnswer: 'Components panel (Window > Components)' },
    { text: 'A Dynamic Component with a Width attribute can…', options: ['Resize its frame and panes when Width changes', 'Only change colour', 'Add a scene', 'Hide the axes'], correctAnswer: 'Resize its frame and panes when Width changes' },
    { text: 'Component attributes are edited in the…', options: ['Component Attributes panel', 'Layers panel', 'Styles panel', 'Outliner'], correctAnswer: 'Component Attributes panel' },
    { text: 'The best place to save a reusable company door is…', options: ['A shared library folder', 'The model file only', 'A scene', 'A style'], correctAnswer: 'A shared library folder' },
  ],
  'Outliner & Layers for Organization': [
    { text: 'The SketchUp panel that shows the model as a tree of groups and components is the…', options: ['Outliner', 'Layers panel', 'Scenes panel', 'Styles panel'], correctAnswer: 'Outliner' },
    { text: 'The SketchUp panel that controls tag/entity visibility is the…', options: ['Tags (formerly Layers) panel', 'Outliner', 'Components panel', 'Ruby console'], correctAnswer: 'Tags (formerly Layers) panel' },
    { text: 'The cleanest way to show only the structure in a plan is…', options: ['Hide the furniture tag/layer', 'Delete the furniture', 'Explode the model', 'Change the style'], correctAnswer: 'Hide the furniture tag/layer' },
    { text: 'The Outliner lets you…', options: ['Select, rename and organise nested groups/components', 'Change units', 'Render', 'Create scenes'], correctAnswer: 'Select, rename and organise nested groups/components' },
  ],
  'Curves, Arcs & Sandbox Terrain': [
    { text: 'The SketchUp tool that draws a smooth curved edge through points is…', options: ['Arc (2/3-point arc)', 'Line', 'Rectangle', 'Follow Me'], correctAnswer: 'Arc (2/3-point arc)' },
    { text: 'The Sandbox tool that creates terrain from a grid of points is…', options: ['From Scratch / From Contours', 'Push/Pull', 'Offset', 'Follow Me'], correctAnswer: 'From Scratch / From Contours' },
    { text: 'The tool that sculpts terrain points to follow contours is…', options: ['Sandbox > Smooth/Stamp/Drape', 'Push/Pull', 'Offset', 'Eraser'], correctAnswer: 'Sandbox > Smooth/Stamp/Drape' },
    { text: 'The Smooth tool in Sandbox…', options: ['Smoothes terrain by averaging point heights', 'Deletes terrain', 'Adds a building', 'Creates a scene'], correctAnswer: 'Smoothes terrain by averaging point heights' },
  ],
  'The Extension Warehouse & Key Extensions': [
    { text: 'The SketchUp plugin marketplace you open from the Extensions menu is the…', options: ['Extension Warehouse', 'Ruby console', 'Components panel', 'Styles panel'], correctAnswer: 'Extension Warehouse' },
    { text: 'The common shared library that plugins such as RoundCorner depend on is…', options: ['TT_Lib / LibFredo6', 'Push/Pull', 'The Outliner', 'A scene'], correctAnswer: 'TT_Lib / LibFredo6' },
    { text: 'The extension used to export SketchUp geometry for 3D printing is…', options: ['SketchUp STL', 'RoundCorner', 'Curviloft', 'Bezier Spline'], correctAnswer: 'SketchUp STL' },
    { text: 'The safety rule when installing extensions is…', options: ['Prefer the curated Warehouse and check the author', 'Install from any popup', 'Install everything at once', 'Never update'], correctAnswer: 'Prefer the curated Warehouse and check the author' },
  ],
  'Ruby Console & Macros': [
    { text: 'The SketchUp built-in scripting console is the…', options: ['Ruby Console', 'Python console', 'JavaScript console', 'Command line'], correctAnswer: 'Ruby Console' },
    { text: 'The Ruby API call that returns the current model is…', options: ['Sketchup.active_model', 'Model.this', 'active_scene', 'UI.model'], correctAnswer: 'Sketchup.active_model' },
    { text: 'The Ruby method that extrudes a face is…', options: ['face.pushpull(distance)', 'face.extrude()', 'face.pull()', 'model.push()'], correctAnswer: 'face.pushpull(distance)' },
    { text: 'The safety rule for testing macros is…', options: ['Test on a copy of the model', 'Test on the live model first', 'Never test', 'Test in the renderer'], correctAnswer: 'Test on a copy of the model' },
  ],
  'Importing/Exporting: DWG, OBJ, 3DS': [
    { text: 'The CAD file format SketchUp imports most cleanly for floor plans is…', options: ['DWG/DXF', 'OBJ', 'FBX', 'PNG'], correctAnswer: 'DWG/DXF' },
    { text: 'The lossless 3D exchange format widely used between 3D apps is…', options: ['OBJ', 'JPG', 'PPT', 'DOCX'], correctAnswer: 'OBJ' },
    { text: 'When importing a DWG floor plan, the first check is…', options: ['Units and scale match the SketchUp template', 'The colours are pretty', 'The file is small', 'The layers are hidden'], correctAnswer: 'Units and scale match the SketchUp template' },
    { text: 'The format best for bringing geometry into 3ds Max from SketchUp is…', options: ['3DS/FBX', 'PDF', 'PNG', 'DOCX'], correctAnswer: '3DS/FBX' },
  ],
  'Modeling Workflow for Rapid Prototyping': [
    { text: 'Rapid prototyping in SketchUp means…', options: ['Building a quick massing model to test an idea, then refining', 'A full detailed model on the first try', 'Never modelling', 'Only rendering'], correctAnswer: 'Building a quick massing model to test an idea, then refining' },
    { text: 'The standard massing-first order is…', options: ['Box the volume, then add openings and detail', 'Add detail first', 'Render before modelling', 'Skip the model'], correctAnswer: 'Box the volume, then add openings and detail' },
    { text: 'The tool that quickly subdivides a box into rooms is…', options: ['Drawing partition lines and Push/Pull', 'The Scale tool', 'A scene', 'The eraser'], correctAnswer: 'Drawing partition lines and Push/Pull' },
    { text: 'A quick client presentation of a massing model is delivered as…', options: ['Scenes and a tour', 'A DWG only', 'A PDF text', 'A schedule'], correctAnswer: 'Scenes and a tour' },
  ],
  'SketchUp Layout Basics': [
    { text: 'The SketchUp application used to lay out models on sheets is…', options: ['LayOut', 'Style Builder', 'Sandbox', 'Ruby Console'], correctAnswer: 'LayOut' },
    { text: 'A SketchUp model is brought into LayOut as…', options: ['A linked viewport', 'A flattened image', 'A text block', 'A schedule'], correctAnswer: 'A linked viewport' },
    { text: 'The file format LayOut documents are saved as…', options: ['.layout', '.skp', '.dwg', '.3ds'], correctAnswer: '.layout' },
    { text: 'Updating the SketchUp model updates…', options: ['The linked viewport after a refresh', 'Nothing', 'Only the text', 'The layout file name'], correctAnswer: 'The linked viewport after a refresh' },
  ],
  'Viewports & Scaled Drawings': [
    { text: 'The LayOut viewport property that makes a drawing print to a real scale is…', options: ['The scale setting (e.g. 1:100)', 'The shadow setting', 'The style', 'The layer'], correctAnswer: 'The scale setting (e.g. 1:100)' },
    { text: 'A viewport locked at 1:50 will…', options: ['Stay at 1:50 regardless of the paper size', 'Drift when moved', 'Rescale automatically', 'Hide the model'], correctAnswer: 'Stay at 1:50 regardless of the paper size' },
    { text: 'The correct viewport scale for a residential floor plan sheet is typically…', options: ['1:100 or 1:50', '1:1', '1:1000', '2:1'], correctAnswer: '1:100 or 1:50' },
    { text: 'To make a viewport show only part of the model you…', options: ['Set the crop region on the viewport', 'Delete geometry', 'Add a scene', 'Change the style'], correctAnswer: 'Set the crop region on the viewport' },
  ],
  'Annotations, Dimensions & Callouts': [
    { text: 'The LayOut tool that measures and labels a distance on a viewport is…', options: ['Dimension', 'Text box', 'Callout', 'Label'], correctAnswer: 'Dimension' },
    { text: 'A leader that points to a feature with a note is a…', options: ['Callout', 'Dimension', 'Viewport', 'Grid'], correctAnswer: 'Callout' },
    { text: 'A dimension label that reads the true model distance is produced by…', options: ['The Dimension tool snapping to model geometry', 'Typing the number by hand', 'A text box', 'A callout'], correctAnswer: 'The Dimension tool snapping to model geometry' },
    { text: 'The circle-with-leader symbol that tags a detail is a…', options: ['Callout', 'Scale', 'Scene', 'Style'], correctAnswer: 'Callout' },
  ],
  'Exporting Presentations & PDFs': [
    { text: 'The standard deliverable exported from LayOut is…', options: ['PDF', 'SKP', 'DWG', 'RUBY'], correctAnswer: 'PDF' },
    { text: 'Vector PDF output keeps…', options: ['Lines sharp at any zoom with small files', 'A raster photo look', 'The file enormous', 'No text selectable'], correctAnswer: 'Lines sharp at any zoom with small files' },
    { text: 'A high-resolution image export for email is…', options: ['PNG or JPG at a controlled pixel size', 'A 1:1 PDF always', 'A .layout file', 'A .skp file'], correctAnswer: 'PNG or JPG at a controlled pixel size' },
    { text: 'The LayOut feature that walks a client through pages full-screen is…', options: ['Presentation mode', 'Export DWG', 'Scene tour', 'Style builder'], correctAnswer: 'Presentation mode' },
  ],
  'The Revit Structure Interface & Template': [
    { text: 'The panel on the left of Revit that lists every view, sheet and family is the…', options: ['Project Browser', 'Properties palette', 'Type selector', 'View cube'], correctAnswer: 'Project Browser' },
    { text: 'A structural project is started from…', options: ['New > Project with the Structural template', 'An empty drawing file', 'A PDF', 'A 3ds Max scene'], correctAnswer: 'New > Project with the Structural template' },
    { text: 'The Ribbon tab you live on for structural elements is…', options: ['Structure (and Steel)', 'Architecture', 'Massing & Site', 'Insert'], correctAnswer: 'Structure (and Steel)' },
    { text: 'A structural template preloads…', options: ['Structural families, dimension styles, title blocks and view templates', 'The completed model', 'A rendering', 'A schedule of employees'], correctAnswer: 'Structural families, dimension styles, title blocks and view templates' },
  ],
  'Levels, Grids & Project Setup': [
    { text: 'In Revit Structure, levels represent…', options: ['Floors/elevations (e.g. 0.000, 3.000)', 'Column lines', 'Roof slopes', 'Room areas'], correctAnswer: 'Floors/elevations (e.g. 0.000, 3.000)' },
    { text: 'Grids are used to locate…', options: ['Columns and bearing walls', 'Doors', 'Furniture', 'Hatches'], correctAnswer: 'Columns and bearing walls' },
    { text: 'The datum that appears as dashed lines with bubbles is a…', options: ['Grid', 'Level', 'Room', 'Viewport'], correctAnswer: 'Grid' },
    { text: 'Setting levels and grids first means…', options: ['Columns and walls snap to a consistent skeleton', 'The render is faster', 'The file is smaller', 'Schedules appear'], correctAnswer: 'Columns and walls snap to a consistent skeleton' },
  ],
  'Structural Columns & Load-Bearing Walls': [
    { text: 'A vertical load-carrying member placed at a grid intersection is a…', options: ['Structural column', 'Curtain wall', 'Door', 'Ramp'], correctAnswer: 'Structural column' },
    { text: 'The Revit tool that places a structural column at a grid intersection is…', options: ['Structure > Column', 'Architecture > Wall', 'Insert > Component', 'View > Grid'], correctAnswer: 'Structure > Column' },
    { text: 'A wall that carries vertical loads down to foundations is a…', options: ['Load-bearing wall', 'Curtain wall', 'Partition', 'Retaining wall'], correctAnswer: 'Load-bearing wall' },
    { text: 'A structural column\'s base and top are set by…', options: ['Base level and top level (with offsets)', 'The wall height', 'The grid length', 'The view scale'], correctAnswer: 'Base level and top level (with offsets)' },
  ],
  'Views: Plans, Elevations & Sections': [
    { text: 'The view that shows a cut slice of the structure (with beams and slabs cut) is a…', options: ['Section view', 'Plan view', 'Elevation view', 'Schedule'], correctAnswer: 'Section view' },
    { text: 'A plan view is created from…', options: ['View > Plan > Structural Plan', 'File > Export', 'A PDF import', 'A rendering'], correctAnswer: 'View > Plan > Structural Plan' },
    { text: 'A section is created by…', options: ['Dropping a section marker through the model', 'Rotating the camera', 'Adding a grid', 'Drawing a wall'], correctAnswer: 'Dropping a section marker through the model' },
    { text: 'The view that shows the outside face of the building is an…', options: ['Elevation view', 'Plan view', 'Section view', 'Sheet'], correctAnswer: 'Elevation view' },
  ],
  'Foundations & Footings': [
    { text: 'The square concrete pad that spreads a single column load is an…', options: ['Isolated footing', 'Strip footing', 'Raft', 'Pile'], correctAnswer: 'Isolated footing' },
    { text: 'The continuous footing under a wall is a…', options: ['Strip footing', 'Pad footing', 'Pile cap', 'Grade beam'], correctAnswer: 'Strip footing' },
    { text: 'A thick slab under the whole building is a…', options: ['Raft foundation', 'Strip footing', 'Isolated footing', 'Pile cap'], correctAnswer: 'Raft foundation' },
    { text: 'The Revit family used to model an isolated footing is…', options: ['Structural foundation (footing)', 'Wall', 'Floor', 'Roof'], correctAnswer: 'Structural foundation (footing)' },
  ],
  'Structural Framing: Beams & Joists': [
    { text: 'A horizontal member that carries loads between columns is a…', options: ['Beam', 'Column', 'Footing', 'Slab'], correctAnswer: 'Beam' },
    { text: 'The Revit tool that places a beam between two columns is…', options: ['Structure > Beam', 'Architecture > Wall', 'View > Grid', 'Insert > Family'], correctAnswer: 'Structure > Beam' },
    { text: 'The closely spaced light members that support the deck are…', options: ['Joists', 'Footings', 'Walls', 'Rebar'], correctAnswer: 'Joists' },
    { text: 'A regular pattern of parallel beams in a bay is created with…', options: ['Beam System', 'Array', 'Copy', 'Mirror'], correctAnswer: 'Beam System' },
  ],
  'Slabs, Floors & Openings': [
    { text: 'The Revit element used to model a structural slab is the…', options: ['Floor (with structural deck/type)', 'Wall', 'Roof', 'Ramp'], correctAnswer: 'Floor (with structural deck/type)' },
    { text: 'The tool that cuts a hole through a slab is…', options: ['Vertical Opening / Shaft', 'Delete', 'Mirror', 'Offset'], correctAnswer: 'Vertical Opening / Shaft' },
    { text: 'The element that cuts the same opening through many levels is a…', options: ['Shaft', 'Wall opening', 'Door', 'Ramp'], correctAnswer: 'Shaft' },
    { text: 'A floor slab is created by…', options: ['Sketching its boundary (Pick Walls for speed)', 'Placing a single point', 'Loading a family', 'Drawing a line'], correctAnswer: 'Sketching its boundary (Pick Walls for speed)' },
  ],
  'Detailing: Notes, Dimensions & Details': [
    { text: 'The element that reads model data (like a beam size) and places it on the drawing is a…', options: ['Tag', 'Dimension', 'Detail line', 'Revision'], correctAnswer: 'Tag' },
    { text: 'A large-scale view cut from a plan with a callout is a…', options: ['Detail view', 'Schedule', 'Sheet', 'Legend'], correctAnswer: 'Detail view' },
    { text: 'The reason tags never go stale is…', options: ['They read the model, so changes update the tag', 'They are typed fresh', 'They are frozen', 'They are hidden'], correctAnswer: 'They read the model, so changes update the tag' },
    { text: 'The 2D drafting elements (insulation hatches, bolt symbols) in a detail are…', options: ['Detail components and detail lines', 'Model walls', 'Structural columns', 'Grids'], correctAnswer: 'Detail components and detail lines' },
  ],
  'Rebar Placement & Cover': [
    { text: 'The concrete cover on rebar primarily protects against…', options: ['Corrosion and fire', 'Over-bending', 'The formwork', 'The slump'], correctAnswer: 'Corrosion and fire' },
    { text: 'The steel that carries the bending tension in a slab is the…', options: ['Main (flexural) steel in the tension zone', 'Distribution steel', 'Stirrups only', 'Chairs'], correctAnswer: 'Main (flexural) steel in the tension zone' },
    { text: 'The steel that spreads loads across the main bars is…', options: ['Distribution steel', 'Main steel', 'Ties', 'Hooks'], correctAnswer: 'Distribution steel' },
    { text: 'In Revit, the distance from concrete face to the outer rebar is set as…', options: ['The cover parameter', 'The bar diameter', 'The spacing', 'The hook length'], correctAnswer: 'The cover parameter' },
  ],
  'Rebar Sets, Shape & Bending': [
    { text: 'The rebar shape code for a straight bar is…', options: ['01', '07', '15', '35'], correctAnswer: '01' },
    { text: 'The rebar shape code for a rectangular stirrup is…', options: ['07', '01', '28', '33'], correctAnswer: '07' },
    { text: 'The tool that fills a beam with a row of identical stirrups is…', options: ['Rebar Set', 'Array', 'Copy', 'Beam System'], correctAnswer: 'Rebar Set' },
    { text: 'The bend radius rule prevents…', options: ['The bar cracking at the bend', 'Rust', 'Long bars', 'Heavy bars'], correctAnswer: 'The bar cracking at the bend' },
  ],
  'Structural Schedules & Quantities': [
    { text: 'The schedule that lists every rebar with mark, shape, length and weight is the…', options: ['Rebar schedule', 'Column schedule', 'Sheet list', 'Room schedule'], correctAnswer: 'Rebar schedule' },
    { text: 'Why a Revit schedule can never disagree with the drawings…', options: ['It reads the model elements', 'It is typed by hand', 'It is an image', 'It is locked by admin'], correctAnswer: 'It reads the model elements' },
    { text: 'A schedule that totals concrete volume per material is a…', options: ['Material takeoff', 'Rebar schedule', 'Viewport schedule', 'Legend'], correctAnswer: 'Material takeoff' },
    { text: 'The schedule field that lets you sum a column of weights is…', options: ['Grand totals on a numeric field', 'The sheet number', 'The view scale', 'The font'], correctAnswer: 'Grand totals on a numeric field' },
  ],
  'Beam-Column Junction Detailing': [
    { text: 'The length of embedment a bar needs to transfer its force is the…', options: ['Development length', 'Cover', 'Clear span', 'Slump'], correctAnswer: 'Development length' },
    { text: 'At a junction, beam bottom bars must…', options: ['Develop their force inside the column core', 'Stop at the face', 'Bend into the slab top', 'Be cut flush'], correctAnswer: 'Develop their force inside the column core' },
    { text: 'When a column is too narrow for the development length, the detailer adds…', options: ['A hook or headed bar', 'Thinner bars', 'A joint filler', 'A cover plate'], correctAnswer: 'A hook or headed bar' },
    { text: 'The junction detail is typically drawn at…', options: ['A large scale (1:10 or 1:5) as a callout', '1:500', 'A schedule', 'An elevation'], correctAnswer: 'A large scale (1:10 or 1:5) as a callout' },
  ],
  'Sheet Setup & Title Blocks': [
    { text: 'The Revit element that carries the drawing border, project name and sheet number is the…', options: ['Title block family', 'Viewport', 'Legend', 'Sheet list'], correctAnswer: 'Title block family' },
    { text: 'A sheet is created with…', options: ['View > Sheet, choosing a title block', 'File > Export', 'A PDF import', 'View > Schedule'], correctAnswer: 'View > Sheet, choosing a title block' },
    { text: 'The schedule that lists every sheet with its number and name is the…', options: ['Sheet list', 'Rebar schedule', 'Room schedule', 'Material takeoff'], correctAnswer: 'Sheet list' },
    { text: 'Sheet numbers follow a discipline pattern like…', options: ['S101, S201 for structural; A101, A201 for architectural', 'Any random numbers', 'Only letters', 'Dates'], correctAnswer: 'S101, S201 for structural; A101, A201 for architectural' },
  ],
  'Placement of Views on Sheets': [
    { text: 'A view dragged onto a sheet becomes a…', options: ['Viewport', 'Title block', 'Grid', 'Detail component'], correctAnswer: 'Viewport' },
    { text: 'The viewport property that must match the title block note is…', options: ['The scale', 'The colour', 'The font', 'The layer'], correctAnswer: 'The scale' },
    { text: 'The best sheet layout practice is…', options: ['The main plan centred, sections/details around it, schedule in a corner', 'Everything overlapping', 'One view per sheet always', 'All views at 1:1'], correctAnswer: 'The main plan centred, sections/details around it, schedule in a corner' },
    { text: 'The tool that arranges multiple viewports into tidy rows is…', options: ['Align/Distribute', 'Copy', 'Array', 'Rotate'], correctAnswer: 'Align/Distribute' },
  ],
  'Drafting Views & Line Weights': [
    { text: 'A pure-2D view with no model geometry is a…', options: ['Drafting view', 'Floor plan', '3D view', 'Section'], correctAnswer: 'Drafting view' },
    { text: 'Cut walls in a section are drawn with…', options: ['A heavy line weight', 'A thin dashed line', 'A centre pattern', 'No line'], correctAnswer: 'A heavy line weight' },
    { text: 'The dash sequence (Solid, Dashed, Hidden) is a…', options: ['Line pattern', 'Line weight', 'Colour', 'Scale'], correctAnswer: 'Line pattern' },
    { text: 'The combined weight + pattern + colour that an element uses is its…', options: ['Line style/subcategory', 'View scale', 'Crop region', 'Revision'], correctAnswer: 'Line style/subcategory' },
  ],
  'Publishing: PDF, DWG & BIM360': [
    { text: 'The export type that keeps lines sharp at any zoom and stays small is…', options: ['Vector PDF', 'JPG', 'PNG', 'BMP'], correctAnswer: 'Vector PDF' },
    { text: 'The DWG export setting that maps Revit line styles to AutoCAD layers is the…', options: ['Layer mapping table in the export setup', 'The font', 'The paper size', 'The view scale'], correctAnswer: 'Layer mapping table in the export setup' },
    { text: 'The cloud platform where the Revit model is shared live with the team is…', options: ['BIM360 (Autodesk Construction Cloud)', 'OneDrive', 'A local folder', 'Email'], correctAnswer: 'BIM360 (Autodesk Construction Cloud)' },
    { text: 'The classic publish mistake is…', options: ['Exporting the wrong sheet/view range', 'Using too many colours', 'Small paper', 'Missing fonts'], correctAnswer: 'Exporting the wrong sheet/view range' },
  ],
  'The Revit Architecture Interface & Template': [
    { text: 'The Ribbon tab with the Wall, Door, Floor and Stair tools is…', options: ['Architecture', 'Structure', 'Massing & Site', 'Annotate'], correctAnswer: 'Architecture' },
    { text: 'A firm architectural template preloads…', options: ['Wall types, door families, title blocks and view templates', 'The building geometry', 'A rendering', 'A schedule of staff'], correctAnswer: 'Wall types, door families, title blocks and view templates' },
    { text: 'The palette that shows a selected wall\'s height, base and type is the…', options: ['Properties palette', 'Project Browser', 'Type selector', 'View cube'], correctAnswer: 'Properties palette' },
    { text: 'A new architectural project starts with…', options: ['New > Project and the Architectural template', 'An empty file', 'A PDF import', 'A 3ds Max scene'], correctAnswer: 'New > Project and the Architectural template' },
  ],
  'Levels, Grids & Project North': [
    { text: 'In architecture, levels define…', options: ['Floors (Ground 0.000, First 3.000)', 'Column lines', 'Room names', 'Roof pitches'], correctAnswer: 'Floors (Ground 0.000, First 3.000)' },
    { text: 'The building orientation that plans are drawn square to is…', options: ['The orientation the plans are dimensioned to', 'True compass north', 'The sun angle', 'The site survey north'], correctAnswer: 'The orientation the plans are dimensioned to' },
    { text: 'The command that rotates the model to align plans with the sheet is…', options: ['Rotate Project North', 'Rotate True North', 'Orbit', 'Mirror'], correctAnswer: 'Rotate Project North' },
    { text: 'Grids in an architectural plan are…', options: ['Vertical datum planes with bubbles', 'Horizontal levels', 'Roof slopes', 'Room tags'], correctAnswer: 'Vertical datum planes with bubbles' },
  ],
  'Wall Types, Layers & Curtain Walls': [
    { text: 'The Edit Assembly dialog of a wall type lists…', options: ['The wall\'s layer stack (functions, materials, thickness)', 'The wall\'s height', 'The door schedule', 'The view scale'], correctAnswer: 'The wall\'s layer stack (functions, materials, thickness)' },
    { text: 'The layer function of the insulation in a wall is…', options: ['Thermal/Air', 'Structure', 'Finish', 'Substrate'], correctAnswer: 'Thermal/Air' },
    { text: 'A wall system built from grid mullions and infill panels is a…', options: ['Curtain wall', 'Basic wall', 'Cavity wall', 'Retaining wall'], correctAnswer: 'Curtain wall' },
    { text: 'The wall property that locks the wall to levels is its…', options: ['Top/Bottom constraints', 'Material', 'Length', 'Colour'], correctAnswer: 'Top/Bottom constraints' },
  ],
  'Opening Tools: Doors, Windows & Wall Openings': [
    { text: 'The element that places an opening with a frame and leaf in a wall is…', options: ['A door/window family', 'The Wall Opening tool', 'A shaft', 'A wall sweep'], correctAnswer: 'A door/window family' },
    { text: 'The tool that cuts a plain rectangular hole with no frame is…', options: ['Wall Opening', 'Door family', 'Window family', 'Shaft'], correctAnswer: 'Wall Opening' },
    { text: 'A door/window placed in a wall automatically…', options: ['Cuts the opening in the host wall', 'Changes the wall height', 'Adds a schedule', 'Creates a level'], correctAnswer: 'Cuts the opening in the host wall' },
    { text: 'Tag on Placement labels a door…', options: ['Immediately with its mark', 'Never', 'Only in 3D', 'On export'], correctAnswer: 'Immediately with its mark' },
  ],
  'Loading & Placing Doors/Windows': [
    { text: 'The command that loads a .rfa door family is…', options: ['Insert > Load Family', 'File > New', 'Home > Import', 'Manage > Purge'], correctAnswer: 'Insert > Load Family' },
    { text: 'The family type (e.g. 0915 x 2134 mm) carries…', options: ['Size, material and performance (fire rating)', 'The wall height', 'The view scale', 'The grid spacing'], correctAnswer: 'Size, material and performance (fire rating)' },
    { text: 'The parameter that sets a window\'s height above the floor is…', options: ['Sill height', 'Head height', 'Width', 'Swing'], correctAnswer: 'Sill height' },
    { text: 'Placing one door and copying it down the corridor keeps…', options: ['The family, type and tag logic', 'Nothing', 'Only the swing', 'Only the height'], correctAnswer: 'The family, type and tag logic' },
  ],
  'System vs Loadable Families': [
    { text: 'A wall is a…', options: ['System family', 'Loadable family', 'In-place family', 'Detail component'], correctAnswer: 'System family' },
    { text: 'A door .rfa is a…', options: ['Loadable family', 'System family', 'Mass family', 'Grid'], correctAnswer: 'Loadable family' },
    { text: 'System families are…', options: ['Duplicated by type, not loaded from files', 'Loaded from .rfa files', 'Always in-place', 'Only 2D'], correctAnswer: 'Duplicated by type, not loaded from files' },
    { text: 'An in-place family is best reserved for…', options: ['Genuine one-off geometry', 'Every door', 'Standard walls', 'Repeated columns'], correctAnswer: 'Genuine one-off geometry' },
  ],
  'Family Editor: Parameters & Types': [
    { text: 'The Family Editor environment is used to…', options: ['Build a family file with parameters and types', 'Render a scene', 'Create a schedule', 'Plot a sheet'], correctAnswer: 'Build a family file with parameters and types' },
    { text: 'Geometry in a family must be constrained to…', options: ['Reference planes driven by parameters', 'The origin only', 'The screen', 'Grid lines'], correctAnswer: 'Reference planes driven by parameters' },
    { text: 'A family with types "0915" and "1212" varies…', options: ['Parameter values like Width and Height', 'The family file', 'The template', 'The wall stack'], correctAnswer: 'Parameter values like Width and Height' },
    { text: 'A parameter shared across many families for scheduling is a…', options: ['Shared parameter', 'Instance parameter', 'Type parameter', 'Reporting parameter'], correctAnswer: 'Shared parameter' },
  ],
  'Schedules: Door & Window Schedules': [
    { text: 'A door schedule lists…', options: ['Every door with mark, type, size, room and fire rating', 'Only door sizes', 'Only door heights', 'Wall thicknesses'], correctAnswer: 'Every door with mark, type, size, room and fire rating' },
    { text: 'A Revit door schedule stays current because…', options: ['It reads the door instances from the model', 'It is retyped each revision', 'It is imported from Excel', 'It is frozen'], correctAnswer: 'It reads the door instances from the model' },
    { text: 'A calculated value in a schedule can compute…', options: ['A new field from existing ones (e.g. area = width x height)', 'A new wall type', 'A new level', 'A new sheet'], correctAnswer: 'A new field from existing ones (e.g. area = width x height)' },
    { text: 'The schedule is placed on a sheet as…', options: ['A live schedule view', 'A flat image', 'A PDF', 'A legend'], correctAnswer: 'A live schedule view' },
  ],
  'Floor Types & Sketching Floors': [
    { text: 'A floor is built from…', options: ['A sketch boundary and a floor type with layers', 'A single click', 'A loaded family', 'A grid line'], correctAnswer: 'A sketch boundary and a floor type with layers' },
    { text: 'The fastest way to sketch a floor boundary matching the walls is…', options: ['Pick Walls', 'Type coordinates', 'Freehand', 'Import a PDF'], correctAnswer: 'Pick Walls' },
    { text: 'A sloped floor uses…', options: ['A slope arrow or shape editing', 'A wall', 'A level change', 'A ramp'], correctAnswer: 'A slope arrow or shape editing' },
    { text: 'The structural layer of the floor type is read by…', options: ['The structural consultant', 'The renderer', 'The title block', 'The grid'], correctAnswer: 'The structural consultant' },
  ],
  'Roofs: Footprint, Extrusion & Sloped': [
    { text: 'The footprint roof method that slopes every boundary edge produces a…', options: ['Roof by Footprint with slope on every edge', 'Roof by Extrusion', 'Roof by Face', 'Sloped glazing'], correctAnswer: 'Roof by Footprint with slope on every edge' },
    { text: 'A curved barrel roof is best made with…', options: ['Roof by Extrusion', 'Roof by Footprint', 'A floor', 'A curtain wall'], correctAnswer: 'Roof by Extrusion' },
    { text: 'A roof built on a mass surface uses…', options: ['Roof by Face', 'Roof by Footprint', 'Roof by Extrusion', 'A gable tool'], correctAnswer: 'Roof by Face' },
    { text: 'The roof pitch on a footprint roof is set…', options: ['Per boundary line as a slope value', 'Once for the whole roof', 'By the extrusion length', 'By the material'], correctAnswer: 'Per boundary line as a slope value' },
  ],
  'Stairs: Runs, Landings & Railings': [
    { text: 'A flat platform joining two stair flights at a change of direction is a…', options: ['Landing', 'Riser', 'Tread', 'Nosing'], correctAnswer: 'Landing' },
    { text: 'Revit flags a riser over code height by…', options: ['Showing the stair in yellow', 'Deleting it', 'Hiding it', 'A sound'], correctAnswer: 'Showing the stair in yellow' },
    { text: 'The tool that attaches a balustrade along the stair edge is…', options: ['Railing', 'Column', 'Grid', 'Floor'], correctAnswer: 'Railing' },
    { text: 'A code-compliant residential riser is approximately…', options: ['150-190 mm', '500 mm', '25 mm', '1 m'], correctAnswer: '150-190 mm' },
  ],
  'Ramps, Railings & Openings': [
    { text: 'The accessibility maximum slope for a ramp is about…', options: ['1:12', '1:1', '45 degrees', 'No limit'], correctAnswer: '1:12' },
    { text: 'A 1:12 ramp needs a landing…', options: ['Every 9 m of run', 'Never', 'At the top only', 'At the bottom only'], correctAnswer: 'Every 9 m of run' },
    { text: 'A railing\'s balusters are the…', options: ['Vertical posts', 'Top rail', 'Handrail', 'Newel caps'], correctAnswer: 'Vertical posts' },
    { text: 'The tool that cuts one opening through many levels is…', options: ['Shaft', 'Vertical Opening', 'Wall Opening', 'Door'], correctAnswer: 'Shaft' },
  ],
  'Material Takeoffs & Room Schedules': [
    { text: 'A schedule that totals material volumes from the model is a…', options: ['Material takeoff', 'Room schedule', 'Sheet list', 'Legend'], correctAnswer: 'Material takeoff' },
    { text: 'A room schedule lists each room with its name, number, area and…', options: ['Level', 'Door type', 'Colour', 'Family'], correctAnswer: 'Level' },
    { text: 'A calculated value can turn room area into…', options: ['Net area, volume or occupancy-based area', 'A wall type', 'A level', 'A sheet'], correctAnswer: 'Net area, volume or occupancy-based area' },
    { text: 'The room element that the schedule reads is placed with…', options: ['The Room tool', 'The Wall tool', 'The Grid tool', 'The Door tool'], correctAnswer: 'The Room tool' },
  ],
  'Views, Sheets & Drafting Setup': [
    { text: 'A saved set of view properties applied to many views is a…', options: ['View template', 'Crop region', 'Title block', 'Schedule'], correctAnswer: 'View template' },
    { text: 'The green frame that trims a view is the…', options: ['Crop region', 'Viewport', 'Scope box', 'Grid'], correctAnswer: 'Crop region' },
    { text: 'Updating a view template updates…', options: ['Every view that uses it', 'No views', 'Only 3D views', 'Only the current view'], correctAnswer: 'Every view that uses it' },
    { text: 'Detail level (Coarse/Medium/Fine) controls…', options: ['How much detail a view shows', 'The render quality', 'The sheet size', 'The font'], correctAnswer: 'How much detail a view shows' },
  ],
  'Coordination: Links, Clash & Interference': [
    { text: 'Another Revit model brought into the current model is a…', options: ['Link', 'Import', 'Group', 'Insert'], correctAnswer: 'Link' },
    { text: 'An interference where two linked-model solids physically overlap is a…', options: ['Two solids occupying the same space', 'Elements too close to install', 'A missing tag', 'A wrong scale'], correctAnswer: 'Two solids occupying the same space' },
    { text: 'A soft clash is…', options: ['Elements too close to install or insulate', 'Two solids overlapping', 'A missing annotation', 'A font issue'], correctAnswer: 'Elements too close to install or insulate' },
    { text: 'The Revit command that tests two linked models for overlaps is…', options: ['Interference Check', 'Copy', 'Mirror', 'Align'], correctAnswer: 'Interference Check' },
  ],
  'Final BIM Delivery & Certification': [
    { text: 'The table on a sheet that logs each issue with a letter is the…', options: ['Revision table', 'Title block only', 'Sheet list', 'Room schedule'], correctAnswer: 'Revision table' },
    { text: 'The professional credential for Revit Architecture/Structure is…', options: ['Autodesk Certified Professional', 'CSWP', 'GDTP', 'NIMS'], correctAnswer: 'Autodesk Certified Professional' },
    { text: 'The delivery package includes the model, the PDF set, the schedules and…', options: ['The coordination/clash report', 'A rendered video only', 'A text file of notes', 'Nothing else'], correctAnswer: 'The coordination/clash report' },
    { text: 'A revision letter (Rev. A, Rev. B) tells the reader…', options: ['What changed and when', 'The sheet number', 'The scale', 'The author\'s name'], correctAnswer: 'What changed and when' },
  ],
};
