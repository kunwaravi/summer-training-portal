// ============================================================================
// CADDED Software (Mechanical) — Per-Topic Quiz Map (issue #94)
// ----------------------------------------------------------------------------
// The frontend topic-lock flow requires EVERY topic to have its own attached
// QuizQuestions: "Start Topic Quiz" hits /quiz/questions/topic/:topicId and
// returns null (→ 404 → topic locked forever) if a topic has zero questions.
// These are the topic-level gates; section-level chapter quizzes live in
// cadd_mech.ts. Keyed by the EXACT topic title from caddMechSections (titles
// are course-unique). Four tool-specific questions per topic.
// ============================================================================

export interface CaddMechTopicQuiz {
  text: string;
  options: string[]; // exactly 4
  correctAnswer: string; // one of options
}

export const caddMechTopicQuizzes: Record<string, CaddMechTopicQuiz[]> = {
  // ── WEEK 1 — AutoCAD Workspace, Units & Layers ────────────────────────────
  'The AutoCAD Interface & Model Space': [
    { text: 'Which area of the AutoCAD screen is where you build geometry at true 1:1 scale?', options: ['Model Space', 'Paper Space', 'The ViewCube', 'The ribbon'], correctAnswer: 'Model Space' },
    { text: 'Pressing Z then Enter then E runs which action?', options: ['Zoom Extents', 'Zoom to 0.5', 'Explode the drawing', 'Z-rotate the view'], correctAnswer: 'Zoom Extents' },
    { text: 'Where does AutoCAD echo what it is doing and ask for points and distances?', options: ['The command line', 'The status bar balloons', 'The Options dialog', 'The Properties palette'], correctAnswer: 'The command line' },
    { text: 'The tool used only for 3D navigation at the top-right of the screen is the…', options: ['ViewCube', 'Navigation bar', 'Application Menu', 'Quick Access Toolbar'], correctAnswer: 'ViewCube' },
  ],
  'Drawing Units & Coordinate Entry': [
    { text: 'Which typed command opens the Drawing Units dialog?', options: ['UN', 'LA', 'ST', 'PL'], correctAnswer: 'UN' },
    { text: 'In AutoCAD, @40,0 means…', options: ['40 units right of the last point', '40 units up from the origin', 'Absolute 40,0', '40 units at 40 degrees'], correctAnswer: '40 units right of the last point' },
    { text: 'In AutoCAD, the polar entry @50<45 represents…', options: ['50 units at 45 degrees', '50 units right, 45 up', 'X=50 angle 45 degrees from origin', '45 units at 50 degrees'], correctAnswer: '50 units at 45 degrees' },
    { text: 'Which key toggles Dynamic Input so you can type distances at the cursor?', options: ['F12', 'F8', 'F3', 'F7'], correctAnswer: 'F12' },
  ],
  'Layers, Properties & Object Organization': [
    { text: 'Which command opens the Layer Properties Manager?', options: ['LA', 'LT', 'UN', 'ML'], correctAnswer: 'LA' },
    { text: 'Hidden edges in a mechanical drawing should use which linetype?', options: ['HIDDEN', 'CENTER', 'Continuous', 'DASHED2'], correctAnswer: 'HIDDEN' },
    { text: 'The lightbulb icon on a layer row does what?', options: ['Turns the layer visibility on or off', 'Deletes the layer', 'Freezes the layer', 'Locks the layer'], correctAnswer: 'Turns the layer visibility on or off' },
    { text: 'Which palette opens with Ctrl+1 to inspect one object\'s layer and geometry?', options: ['Properties', 'Layers', 'Design Center', 'Command Line'], correctAnswer: 'Properties' },
  ],
  'The Grid, Snap, Ortho & Precision Input': [
    { text: 'Which drafting setting forces the cursor to jump on a fixed spacing?', options: ['SNAP (F9)', 'GRID (F7)', 'ORTHO (F8)', 'POLAR (F10)'], correctAnswer: 'SNAP (F9)' },
    { text: 'ORTHO mode restricts the cursor so drawn segments are…', options: ['Perfectly horizontal or vertical', 'At 45 degrees', 'Snapped to grid points', 'At any angle'], correctAnswer: 'Perfectly horizontal or vertical' },
    { text: 'Object Snap (F3) snaps to geometric points on existing geometry. The four snaps most professionals keep enabled are…', options: ['Endpoint, midpoint, centre, intersection', 'Nearest, tangent, perpendicular, extension', 'Quadrant, node, apparent, parallel', 'All of them always'], correctAnswer: 'Endpoint, midpoint, centre, intersection' },
    { text: 'Which dialog (SE) configures grid, snap, polar, and object snap together?', options: ['Drafting Settings', 'Drawing Units', 'Options', 'Layer Properties Manager'], correctAnswer: 'Drafting Settings' },
  ],

  // ── WEEK 2 — 2D Drawing & Editing Commands in AutoCAD ─────────────────────
  'The Essential Draw Commands: Line, Polyline, Circle, Arc': [
    { text: 'Why is POLYLINE usually better than LINE for a part outline?', options: ['It creates one continuous object that selects, offsets and edits as a whole', 'It is faster to type', 'It auto-dimensions', 'It cannot be edited'], correctAnswer: 'It creates one continuous object that selects, offsets and edits as a whole' },
    { text: 'The CIRCLE option that creates a circle tangent to two objects at a given radius is…', options: ['T', '2P', '3P', 'D'], correctAnswer: 'T' },
    { text: 'Arcs are drawn by default in which direction?', options: ['Counter-clockwise from start to end', 'Clockwise from start to end', 'From the centre outward', 'Whichever the mouse moves'], correctAnswer: 'Counter-clockwise from start to end' },
    { text: 'Inside POLYLINE, the option to set the segment width is…', options: ['W', 'A', 'C', 'L'], correctAnswer: 'W' },
  ],
  'Editing: Trim, Extend, Offset, Mirror': [
    { text: 'The quick way to make TRIM act like EXTEND while working is…', options: ['Hold Shift while picking', 'Press F8', 'Type EX first', 'Press Esc'], correctAnswer: 'Hold Shift while picking' },
    { text: 'The OFFSET workflow asks you to enter a distance, pick the object, then…', options: ['Click the side to offset toward', 'Type the new length', 'Select a boundary', 'Press Enter twice'], correctAnswer: 'Click the side to offset toward' },
    { text: 'When MIRROR asks "Erase source objects?", when do you answer Yes?', options: ['When the original is truly redundant', 'Always', 'Never', 'When the layer is locked'], correctAnswer: 'When the original is truly redundant' },
    { text: 'EXTEND with Edge mode set to Extend will…', options: ['Extend lines even when they do not physically meet the boundary', 'Refuse to work', 'Extend only to the grid', 'Cut the boundary'], correctAnswer: 'Extend lines even when they do not physically meet the boundary' },
  ],
  'Fillets, Chamfers & Object Snaps': [
    { text: 'A classic FILLET failure is a sharp corner because…', options: ['The radius was still set to 0', 'The lines were too long', 'Ortho was off', 'The layer was frozen'], correctAnswer: 'The radius was still set to 0' },
    { text: 'The CHAMFER option that sets two distances along the two edges is…', options: ['D', 'A', 'P', 'M'], correctAnswer: 'D' },
    { text: 'Which object snap override typed at the prompt forces snapping to an endpoint?', options: ['END', 'INT', 'MID', 'PER'], correctAnswer: 'END' },
    { text: 'Machined internal corners need a radius because…', options: ['A cutter cannot reach a sharp internal corner', 'It looks nicer', 'It saves material', 'The drawing standard requires it'], correctAnswer: 'A cutter cannot reach a sharp internal corner' },
  ],
  'Polylines, Splines & Construction Geometry': [
    { text: 'Inside POLYLINE, which key switches to arc mode?', options: ['A', 'S', 'C', 'W'], correctAnswer: 'A' },
    { text: 'Why do machinists prefer polyline arcs over splines?', options: ['Arc-based geometry machines predictably with standard tools', 'Splines cannot be selected', 'Splines are always broken', 'Arcs are faster to type'], correctAnswer: 'Arc-based geometry machines predictably with standard tools' },
    { text: 'Construction geometry that must never print is best managed by…', options: ['A dedicated CONSTRUCTION layer frozen before plotting', 'Putting it on layer 0', 'Deleting it after use', 'A dashed linetype on any layer'], correctAnswer: 'A dedicated CONSTRUCTION layer frozen before plotting' },
    { text: 'Centre lines should use which linetype so the pattern shows at any scale?', options: ['CENTER', 'HIDDEN', 'Continuous', 'PHANTOM'], correctAnswer: 'CENTER' },
  ],

  // ── WEEK 3 — Dimensions, Annotations & Plotting ───────────────────────────
  'Linear, Aligned & Angular Dimensions': [
    { text: 'Which command (DLI) measures a horizontal or vertical distance between two points?', options: ['Linear', 'Aligned', 'Angular', 'Radius'], correctAnswer: 'Linear' },
    { text: 'An inclined edge needs its true length shown. Which dimension type is correct?', options: ['Aligned (DAL)', 'Linear (DLI)', 'Angular (DAN)', 'Ordinate'], correctAnswer: 'Aligned (DAL)' },
    { text: 'The tool that chains several measurements along a row is…', options: ['Continue (DCO)', 'Baseline (DBA)', 'Quick (QDIM)', 'Radius'], correctAnswer: 'Continue (DCO)' },
    { text: 'Baseline dimensioning every hole from one datum edge is preferred on production drawings because…', options: ['Errors do not accumulate hole-to-hole', 'It uses less space', 'It looks modern', 'It auto-tolerances'], correctAnswer: 'Errors do not accumulate hole-to-hole' },
  ],
  'Dimension Styles & Text Annotations': [
    { text: 'Which command opens the Dimension Style Manager?', options: ['D', 'ST', 'LA', 'UN'], correctAnswer: 'D' },
    { text: 'Appending "mm" to every dimension automatically is set on which tab of the style?', options: ['Primary Units suffix', 'Text tab', 'Lines tab', 'Fit tab'], correctAnswer: 'Primary Units suffix' },
    { text: 'Multiline Text (T/MT) is used for…', options: ['Free-form notes like material and general tolerances', 'Linear dimensions', 'Angles', 'Hatching'], correctAnswer: 'Free-form notes like material and general tolerances' },
    { text: 'Why is formatting through a dimension style better than formatting each dimension by hand?', options: ['One style change updates every dimension that uses it', 'Hand formatting is illegal', 'Styles are faster to type', 'Styles cannot be changed'], correctAnswer: 'One style change updates every dimension that uses it' },
  ],
  'Leaders, Multileaders & Tolerances': [
    { text: 'The command that creates an arrow, landing line and attached text as one managed object is…', options: ['MULTILEADER (MLD)', 'TEXT (T)', 'LEADER freehand', 'DIM (D)'], correctAnswer: 'MULTILEADER (MLD)' },
    { text: 'The command that opens the Geometric Tolerance dialog for feature-control frames is…', options: ['TOL', 'TOLER', 'GD&T', 'MLD'], correctAnswer: 'TOL' },
    { text: 'To show a ± tolerance automatically on every linear dimension you set system variables…', options: ['DIMTOL and DIMTOLJ', 'DIMTXT and DIMDEC', 'DIMASZ and DIMEXO', 'DIMCLRD and DIMCLRE'], correctAnswer: 'DIMTOL and DIMTOLJ' },
    { text: 'A leader note like "2x Ø6 H7 +0.012/0" tells the machinist…', options: ['Two holes, Ø6 H7, upper deviation +0.012, lower 0', 'Two holes of random size', 'A threaded hole M6', 'A 2 mm chamfer'], correctAnswer: 'Two holes, Ø6 H7, upper deviation +0.012, lower 0' },
  ],
  'Layouts, Viewports & Plotting to Scale': [
    { text: 'Which command creates a viewport on a layout?', options: ['MVIEW (MV)', 'PLOT', 'INSERT', 'VPORTS'], correctAnswer: 'MVIEW (MV)' },
    { text: 'Setting a viewport to half scale is done by zooming inside it with…', options: ['1/2XP', '0.5Z', 'H', '1:2'], correctAnswer: '1/2XP' },
    { text: 'The title block and sheet furniture belong in…', options: ['Paper space at 1:1 sheet scale', 'Model space at any scale', 'A separate DWG', 'The BOM'], correctAnswer: 'Paper space at 1:1 sheet scale' },
    { text: 'Which PLOT setting should you choose for real production output?', options: ['Layout plot area with an explicit 1:1 or 1:2 scale', 'Fit to paper', 'Window with no scale', 'Model tab'], correctAnswer: 'Layout plot area with an explicit 1:1 or 1:2 scale' },
  ],

  // ── WEEK 4 — Blocks, Templates & Drafting Productivity ───────────────────
  'Creating & Inserting Blocks': [
    { text: 'Which command opens the Block Definition dialog?', options: ['B (BLOCK)', 'I (INSERT)', 'BE (BLOCKEDIT)', 'X (EXPLODE)'], correctAnswer: 'B (BLOCK)' },
    { text: 'The block option that removes the source geometry and replaces it with a block reference is…', options: ['Convert to Block', 'Retain', 'Delete', 'Explode'], correctAnswer: 'Delete' },
    { text: 'The "Convert to Block" vs "Retain" choice concerns…', options: ['What happens to the source geometry after creating the block', 'The base point', 'The scale', 'The layer'], correctAnswer: 'What happens to the source geometry after creating the block' },
    { text: 'Editing the block definition so every insert updates is done in…', options: ['BEDIT', 'PEDIT', 'ATTEDIT', 'INSERT'], correctAnswer: 'BEDIT' },
  ],
  'Attributes & Dynamic Blocks': [
    { text: 'Which command defines an attribute inside a block?', options: ['ATTDEF', 'ATTEDIT', 'ATTEXT', 'BEDIT'], correctAnswer: 'ATTDEF' },
    { text: 'The attribute\'s TAG is…', options: ['The field name of the attribute', 'The prompt the user sees', 'The default value', 'The block name'], correctAnswer: 'The field name of the attribute' },
    { text: 'A dynamic block is made adjustable inside BEDIT by adding…', options: ['Parameters then actions', 'More attributes', 'More blocks', 'Layers'], correctAnswer: 'Parameters then actions' },
    { text: 'Which command extracts attribute data from blocks to a file?', options: ['ATTEXT', 'ATTEDIT', 'ATTDEF', 'EXPORT'], correctAnswer: 'ATTEXT' },
  ],
  'Design Center, Tool Palettes & Reuse': [
    { text: 'Design Center (DC) lets you browse a DWG on disk and drag in its…', options: ['Blocks, layers, dimension styles, layouts and linetypes', 'Only its text', 'Only its hatches', 'Its history'], correctAnswer: 'Blocks, layers, dimension styles, layouts and linetypes' },
    { text: 'Which tool opens the tabbed trays of one-click insert tools?', options: ['Tool Palettes (TP)', 'Design Center (DC)', 'Data Extraction', 'Content Explorer'], correctAnswer: 'Tool Palettes (TP)' },
    { text: 'Why is dragging a block from a library better than copy-pasting geometry?', options: ['Copy-paste creates anonymous duplicate geometry and loses block intelligence', 'Copy-paste is illegal', 'Blocks cannot be copied', 'It is faster to draw again'], correctAnswer: 'Copy-paste creates anonymous duplicate geometry and loses block intelligence' },
    { text: 'A shared palette file that the whole team can carry has the extension…', options: ['.xtp', '.dwg', '.dwt', '.csv'], correctAnswer: '.xtp' },
  ],
  'Templates, Standards & Drafting Workflow': [
    { text: 'A file pre-loaded with standard layers, styles and a title block, saved for new jobs, is a…', options: ['Drawing Template (.dwt)', 'Block library (.dwg)', 'Tool palette (.xtp)', 'Layout (.dwg)'], correctAnswer: 'Drawing Template (.dwt)' },
    { text: 'Starting every new job from the same template gives…', options: ['Consistency across the office without recreating standards', 'Larger file sizes', 'Faster plotting only', 'Automatic tolerances'], correctAnswer: 'Consistency across the office without recreating standards' },
    { text: 'The safest treatment of a master template file is…', options: ['Read-only master data you never overwrite', 'Deleted after use', 'Stored inside the project folder', 'Edited by everyone'], correctAnswer: 'Read-only master data you never overwrite' },
    { text: 'Which standard governs title-block content such as drawing number and revision?', options: ['ISO 7200', 'ASME Y14.5', 'ISO 9001', 'DIN 5480'], correctAnswer: 'ISO 7200' },
  ],

  // ── WEEK 5 — SolidWorks Sketching & Geometric Constraints ────────────────
  'The Sketch Environment & Sketch Entities': [
    { text: 'Before drawing a sketch you must first choose a…', options: ['Plane (Front, Top or Right)', 'Material', 'Origin point', 'Dimension style'], correctAnswer: 'Plane (Front, Top or Right)' },
    { text: 'A centre rectangle is useful because it automatically applies…', options: ['Symmetry relations about a centreline', 'Corner fillets', 'Equal edge lengths only', 'Colour'], correctAnswer: 'Symmetry relations about a centreline' },
    { text: 'Which sketch entity is best for a smooth ergonomic handle profile?', options: ['Spline', 'Slot', 'Centre rectangle', 'Polygon'], correctAnswer: 'Spline' },
    { text: 'The bracket outline should be sketched on which plane before extruding its depth?', options: ['Top plane', 'A plane perpendicular to the depth direction', 'Any plane', 'The right plane only'], correctAnswer: 'A plane perpendicular to the depth direction' },
  ],
  'Geometric Relations: Equal, Tangent, Coincident': [
    { text: 'Which relation fixes a point to lie on another entity, like a line endpoint on a circle?', options: ['Coincident', 'Equal', 'Tangent', 'Midpoint'], correctAnswer: 'Coincident' },
    { text: 'Two arcs must always have the same radius. The best relation is…', options: ['Equal', 'Tangent', 'Coincident', 'Horizontal'], correctAnswer: 'Equal' },
    { text: 'Which relation makes a line touch a circle at exactly one point?', options: ['Tangent', 'Equal', 'Midpoint', 'Perpendicular'], correctAnswer: 'Tangent' },
    { text: 'Drawing a line from an existing endpoint usually auto-creates which relation?', options: ['Coincident', 'Tangent', 'Symmetric', 'Perpendicular'], correctAnswer: 'Coincident' },
  ],
  'Fully-Defined Sketches & Dimensioning': [
    { text: 'A fully defined sketch shows its entities in which colour?', options: ['Black', 'Blue', 'Red', 'Grey'], correctAnswer: 'Black' },
    { text: 'A dimension that sets the value and is stored as a parameter is called…', options: ['Driving', 'Driven', 'Reference', 'Annotation'], correctAnswer: 'Driving' },
    { text: 'The tool that lets you name a dimension so equations can reference it is the…', options: ['Dimension PropertyManager', 'Equations dialog only', 'FeatureManager', 'Material dialog'], correctAnswer: 'Dimension PropertyManager' },
    { text: 'A rectangle drawn with Smart Dimension lengths 60 and 40 is still blue because…', options: ['No corner is anchored to the origin (or fixed)', 'The lengths are wrong', 'It needs a fillet', 'The plane is wrong'], correctAnswer: 'No corner is anchored to the origin (or fixed)' },
  ],
  'Sketches, Reference Geometry & Planes': [
    { text: 'Which reference geometry lets you sketch a boss exactly 25 mm above a face?', options: ['An offset plane', 'An axis', 'A coordinate system', 'A sketch point'], correctAnswer: 'An offset plane' },
    { text: 'The dashed, centreline-style entity inside a sketch that guides relations but is not part of the solid is…', options: ['Construction geometry', 'A reference plane', 'A sketch block', 'A dimension'], correctAnswer: 'Construction geometry' },
    { text: 'Which reference geometry is used for revolved patterns and circular mates?', options: ['An axis', 'A plane', 'A coordinate system', 'A point'], correctAnswer: 'An axis' },
    { text: 'Toggle sketch entities to construction style with…', options: ['ALT+C', 'F8', 'Ctrl+B', 'Esc'], correctAnswer: 'ALT+C' },
  ],

  // ── WEEK 6 — Parametric Features: Extrude, Revolve & Loft ────────────────
  'Extruded Bosses & Cuts': [
    { text: 'The default Extrude end condition that extends a fixed distance is…', options: ['Blind', 'Up To Surface', 'Mid Plane', 'Through All'], correctAnswer: 'Blind' },
    { text: 'A hole that must go right through the part uses the Extruded Cut end condition…', options: ['Through All', 'Blind', 'Up To Vertex', 'Up To Body'], correctAnswer: 'Through All' },
    { text: 'The wall draft on an extruded boss is set in the…', options: ['Boss-Extrude PropertyManager', 'Sketch', 'Material', 'Render'], correctAnswer: 'Boss-Extrude PropertyManager' },
    { text: 'Mid Plane extrusion extends…', options: ['Equally on both sides of the sketch plane', 'Only upward', 'To the first face', 'Through everything'], correctAnswer: 'Equally on both sides of the sketch plane' },
  ],
  'Revolved Features & Symmetry': [
    { text: 'What must a revolve sketch contain for the feature to work?', options: ['A centreline acting as the axis', 'A closed circle', 'Two profiles', 'A construction point'], correctAnswer: 'A centreline acting as the axis' },
    { text: 'A revolve fails when…', options: ['The sketch crosses the axis', 'The sketch is on the right plane', 'The angle is 360', 'There is one profile'], correctAnswer: 'The sketch crosses the axis' },
    { text: 'A groove for an O-ring is best created with…', options: ['Revolved Cut', 'Extruded Cut', 'Loft', 'Sweep'], correctAnswer: 'Revolved Cut' },
    { text: 'The revolve angle for a full symmetric part is…', options: ['360 degrees', '180 degrees', '90 degrees', '45 degrees'], correctAnswer: '360 degrees' },
  ],
  'Lofts, Sweeps & Complex Geometry': [
    { text: 'A loft blends how many profiles into a smooth solid?', options: ['Two or more', 'Exactly one', 'Zero', 'A circle and a line only'], correctAnswer: 'Two or more' },
    { text: 'A sweep requires a profile and a…', options: ['Path', 'Centreline', 'Datum plane', 'Material'], correctAnswer: 'Path' },
    { text: 'Guide curves in a sweep control…', options: ['The profile\'s size and shape along the path', 'The path direction only', 'The colour', 'The material thickness'], correctAnswer: 'The profile\'s size and shape along the path' },
    { text: 'Lofts twist unexpectedly when…', options: ['The start points of the profiles are not aligned', 'The profiles have equal segments', 'There are two profiles', 'The path is straight'], correctAnswer: 'The start points of the profiles are not aligned' },
  ],
  'Feature Order, Rollback & Design Intent': [
    { text: 'The green bar you drag to return the model to an earlier state is the…', options: ['Rollback bar', 'Rebuild bar', 'History slider', 'Feature tree'], correctAnswer: 'Rollback bar' },
    { text: 'A fillet added BEFORE a later cut will be…', options: ['Partially removed by the cut', 'Unaffected', 'Duplicated', 'Moved to the top'], correctAnswer: 'Partially removed by the cut' },
    { text: 'Suppressed features in the FeatureManager tree are marked with…', options: ['(S)', '(F)', '(D)', '(X)'], correctAnswer: '(S)' },
    { text: 'A model that encodes rules (symmetry, pattern, fillet-last) rather than individual faces shows good…', options: ['Design intent', 'Rendering', 'Colouring', 'File size'], correctAnswer: 'Design intent' },
  ],

  // ── WEEK 7 — SolidWorks Assemblies & Mates ────────────────────────────────
  'The Assembly Environment & Component Insertion': [
    { text: 'An assembly file uses which extension?', options: ['.sldasm', '.sldprt', '.slddrw', '.dwg'], correctAnswer: '.sldasm' },
    { text: 'The (f) suffix next to a component in the tree means it is…', options: ['Fixed', 'Floating', 'Fully mated', 'Failed'], correctAnswer: 'Fixed' },
    { text: 'Which component should be fixed to the origin first?', options: ['The base or housing', 'The smallest part', 'The last part', 'The fastener'], correctAnswer: 'The base or housing' },
    { text: 'A part that still drags freely after mating is likely…', options: ['Under-constrained (mates missing)', 'Over-constrained', 'Fixed', 'Suppressed'], correctAnswer: 'Under-constrained (mates missing)' },
  ],
  'Standard Mates: Coincident, Concentric, Distance': [
    { text: 'Which standard mate makes two planar faces flush?', options: ['Coincident', 'Concentric', 'Distance', 'Tangent'], correctAnswer: 'Coincident' },
    { text: 'The mate that aligns two cylindrical faces so a shaft sits in a bore is…', options: ['Concentric', 'Coincident', 'Width', 'Path'], correctAnswer: 'Concentric' },
    { text: 'Holding two faces exactly 5 mm apart is done with…', options: ['A Distance mate', 'A Coincident mate', 'A Cam mate', 'A Width mate'], correctAnswer: 'A Distance mate' },
    { text: 'A Distance mate with value zero behaves like a coincident mate but…', options: ['Stays editable as a distance', 'Cannot be deleted', 'Locks rotation', 'Adds a spring'], correctAnswer: 'Stays editable as a distance' },
  ],
  'Advanced Mates & Mechanical Constraints': [
    { text: 'Which mechanical mate links rotation to translation, like a lead screw?', options: ['Screw', 'Gear', 'Cam', 'Path'], correctAnswer: 'Screw' },
    { text: 'A gear pair with a 1:2 ratio means…', options: ['The driven gear turns twice per driver turn', 'The driver turns twice', 'The gears are the same size', 'No rotation is coupled'], correctAnswer: 'The driven gear turns twice per driver turn' },
    { text: 'Which advanced mate centres a component between two faces?', options: ['Width', 'Symmetry', 'Profile Centre', 'Limits'], correctAnswer: 'Width' },
    { text: 'Capping a hinge\'s travel at 110 degrees uses a mate with…', options: ['A Limits range', 'A Gear ratio', 'A Width constraint', 'A Tangent'], correctAnswer: 'A Limits range' },
  ],
  'Assembly Motion, Interference & Exploded Views': [
    { text: 'Which mode gives forces and velocities for springs and motors?', options: ['Motion Analysis', 'Animation', 'Static', 'Rendering'], correctAnswer: 'Motion Analysis' },
    { text: 'The tool that lists every overlapping pair of faces in an assembly is…', options: ['Interference Detection', 'Mate Diagnostics', 'Measure', 'Section View'], correctAnswer: 'Interference Detection' },
    { text: 'The best way to test whether mates work is…', options: ['Drag the handle and watch the mechanism', 'Read the tree', 'Rebuild', 'Export a PDF'], correctAnswer: 'Drag the handle and watch the mechanism' },
    { text: 'An exploded view is mainly used to…', options: ['Document assembly order and service steps', 'Check strength', 'Reduce file size', 'Replace a drawing'], correctAnswer: 'Document assembly order and service steps' },
  ],

  // ── WEEK 8 — Configurations & Design Tables ───────────────────────────────
  'Configurations: Variations of One Model': [
    { text: 'Which tab of the FeatureManager lists configurations?', options: ['ConfigurationManager', 'PropertyManager', 'DimensionManager', 'Materials tab'], correctAnswer: 'ConfigurationManager' },
    { text: 'When you edit a dimension in one configuration, the other configurations…', options: ['Keep their own values unless you choose otherwise', 'All update', 'Are deleted', 'Are locked'], correctAnswer: 'Keep their own values unless you choose otherwise' },
    { text: 'A feature greyed out with (S) in one configuration is…', options: ['Suppressed in that configuration', 'Fixed', 'Broken', 'Hidden from rendering'], correctAnswer: 'Suppressed in that configuration' },
    { text: 'The "This Configuration / All Configurations / Specify Configurations" choice appears in…', options: ['The Modify dialog when editing a dimension', 'The Material dialog', 'The rebuild dialog', 'The BOM'], correctAnswer: 'The Modify dialog when editing a dimension' },
  ],
  'Design Tables in Excel & Equations': [
    { text: 'In a design table, each ROW represents…', options: ['One configuration', 'One dimension', 'One part', 'One drawing'], correctAnswer: 'One configuration' },
    { text: 'Which design-table cell controls whether a feature is included?', options: ['$STATE@Feature = S or U', '$DIM@Feature = 0', 'QTY = 2', '$COMMENT = x'], correctAnswer: '$STATE@Feature = S or U' },
    { text: 'Dimensions driven by a design table appear greyed in the normal Modify dialog because…', options: ['The spreadsheet owns them', 'They are broken', 'They are hidden', 'The part is read-only'], correctAnswer: 'The spreadsheet owns them' },
    { text: 'To make the design table feed a BOM with catalogue codes you add…', options: ['$PARTNUMBER and $COMMENT columns', 'More sketches', 'More materials', 'A configuration table'], correctAnswer: '$PARTNUMBER and $COMMENT columns' },
  ],
  'Global Variables & Equations': [
    { text: 'Where are global variables defined?', options: ['The Equations dialog', 'The FeatureManager tree', 'The Sketch', 'The BOM'], correctAnswer: 'The Equations dialog' },
    { text: 'An equation referencing a dimension uses…', options: ['The dimension\'s name in quotes, e.g. "Plate-Length"', 'The colour', 'The feature name only', 'The part number'], correctAnswer: 'The dimension\'s name in quotes, e.g. "Plate-Length"' },
    { text: 'The equation "Overall-Length = Inside-Length + 2*Wall" encodes…', options: ['A design rule that rebuilds both dimensions together', 'A fixed number', 'A material property', 'A configuration'], correctAnswer: 'A design rule that rebuilds both dimensions together' },
    { text: 'An equation showing red with an error usually means…', options: ['A referenced dimension was renamed or deleted', 'The part is too big', 'The material is wrong', 'Units are mixed'], correctAnswer: 'A referenced dimension was renamed or deleted' },
  ],
  'Drawing Views from Configurations': [
    { text: 'Which panel supplies drag-and-drop drawing views from a part?', options: ['The View Palette', 'The BOM', 'The Design Library', 'The PropertyManager'], correctAnswer: 'The View Palette' },
    { text: 'A drawing view can be set to show a specific configuration in…', options: ['The View PropertyManager Configuration section', 'The title block', 'The BOM', 'The dimension style'], correctAnswer: 'The View PropertyManager Configuration section' },
    { text: 'The VBA call that points a view at a configuration is…', options: ['swView.SetConfigurationName "L50"', 'swView.Config = "L50"', 'swModel.Configure "L50"', 'swView.ShowConfig 50'], correctAnswer: 'swView.SetConfigurationName "L50"' },
    { text: 'Catalogue drawings with several sizes use…', options: ['One model, per-configuration views and a size table', 'A separate model per size', 'A screenshot', 'An animation'], correctAnswer: 'One model, per-configuration views and a size table' },
  ],

  // ── WEEK 9 — CATIA Sketcher & Part Design Workbench ───────────────────────
  'The CATIA Sketcher: Profile & Constraint Tools': [
    { text: 'Which Sketcher toolbar draws a chain of connected lines and arcs in one gesture?', options: ['Profile', 'Circle', 'Spline', 'Axis'], correctAnswer: 'Profile' },
    { text: 'The sketch entity used as a revolve axis is created with…', options: ['The Axis tool', 'The Spline tool', 'The Dimension tool', 'The Point tool'], correctAnswer: 'The Axis tool' },
    { text: 'The Isoconstraint button in CATIA…', options: ['Auto-dimensions a sketch with sensible constraints', 'Deletes all constraints', 'Adds fillets', 'Splits the sketch'], correctAnswer: 'Auto-dimensions a sketch with sensible constraints' },
    { text: 'A CATIA sketch marked as "2/5" constraints defined means…', options: ['Two of five constraints still needed before it is fully defined', 'Two constraints are broken', 'Five sketches exist', 'The sketch is over-defined'], correctAnswer: 'Two of five constraints still needed before it is fully defined' },
  ],
  'Part Design: Pad, Pocket & Drafted Filleted Pad': [
    { text: 'Which feature removes material in CATIA Part Design?', options: ['Pocket', 'Pad', 'Shaft', 'Boss'], correctAnswer: 'Pocket' },
    { text: 'The POCKET limit that stops at the first wall it meets is…', options: ['Up to next', 'Dimension', 'Up to last', 'Mirrored'], correctAnswer: 'Up to next' },
    { text: 'A one-click moulded feature with pad, draft and fillet is the…', options: ['Drafted Filleted Pad', 'Multi-pad', 'Boss', 'Rib'], correctAnswer: 'Drafted Filleted Pad' },
    { text: 'A PAD fails with "Sketch is not closed". The cause is…', options: ['An open profile outline', 'The sketch has too many constraints', 'Wrong units', 'The plane is hidden'], correctAnswer: 'An open profile outline' },
  ],
  'Shaft, Groove & Revolution Features': [
    { text: 'Which feature revolves a closed profile around an axis to ADD material?', options: ['Shaft', 'Groove', 'Pocket', 'Revolve Cut'], correctAnswer: 'Shaft' },
    { text: 'An O-ring groove is best made with…', options: ['Groove', 'Shaft', 'Pocket', 'Pad'], correctAnswer: 'Groove' },
    { text: 'The Shaft Definition dialog needs an axis that…', options: ['Lives in the sketch or is a selectable straight line', 'Is always Z', 'Is the part origin', 'Does not exist'], correctAnswer: 'Lives in the sketch or is a selectable straight line' },
    { text: 'A partial flange is made by setting the Shaft/Groove…', options: ['Angular limit below 360 degrees', 'Length to zero', 'Mirror extent on', 'Draft to 45 degrees'], correctAnswer: 'Angular limit below 360 degrees' },
  ],
  'Hole, Thread & Reference Features': [
    { text: 'A CATIA Hole feature is started from…', options: ['A sketch point, then the Hole Definition dialog', 'A sketched circle', 'A 3D cylinder', 'The Shaft tool'], correctAnswer: 'A sketch point, then the Hole Definition dialog' },
    { text: 'The Hole type that auto-selects a standard clearance fit is…', options: ['Hole with clearance', 'Simple', 'Tapered', 'Counterbored'], correctAnswer: 'Hole with clearance' },
    { text: 'Threading in the Hole dialog pulls size and pitch from…', options: ['Standard tables such as ISO', 'The drawing scale', 'The part colour', 'A free text field'], correctAnswer: 'Standard tables such as ISO' },
    { text: 'Reference features like planes, axes and points are used to…', options: ['Anchor sketches and patterns', 'Add material', 'Render the part', 'Write the BOM'], correctAnswer: 'Anchor sketches and patterns' },
  ],

  // ── WEEK 10 — CATIA Surface Creation & Editing ────────────────────────────
  'Wireframe Geometry: Points, Lines, Curves': [
    { text: 'Which Point creation method encodes "40% along the edge"?', options: ['On curve', 'Coordinates', 'Between', 'Tangent on curve'], correctAnswer: 'On curve' },
    { text: 'The exact conic curve (ellipse, parabola) used in place of a spline is…', options: ['Conic', 'Helix', 'Spline', 'Projected curve'], correctAnswer: 'Conic' },
    { text: 'A helix is defined by…', options: ['An axis, pitch and height', 'Two points', 'Three fit points', 'A radius only'], correctAnswer: 'An axis, pitch and height' },
    { text: 'Why do professionals perfect the wireframe before building surfaces?', options: ['Surface quality is decided by the guiding curves', 'Wireframe is faster to render', 'Surfaces are random', 'Points are cheaper'], correctAnswer: 'Surface quality is decided by the guiding curves' },
  ],
  'Creating Surfaces: Extrude, Revolve, Sweep': [
    { text: 'Which surface command pulls a curve in a direction with limit lengths?', options: ['Extrude', 'Revolve', 'Sweep', 'Fill'], correctAnswer: 'Extrude' },
    { text: 'A revolved surface requires a profile and…', options: ['An axis', 'A guide', 'Two profiles', 'A fillet'], correctAnswer: 'An axis' },
    { text: 'A hose of constant radius along a path is a…', options: ['Circle sweep', 'Profile sweep', 'Line sweep', 'Loft'], correctAnswer: 'Circle sweep' },
    { text: 'A drafted straight panel is best built with a…', options: ['Line sweep', 'Circle sweep', 'Fill', 'Blend'], correctAnswer: 'Line sweep' },
  ],
  'Surface Editing: Trim, Split, Join': [
    { text: 'Which command cuts TWO intersecting surfaces and keeps chosen pieces?', options: ['Trim', 'Split', 'Join', 'Heal'], correctAnswer: 'Trim' },
    { text: 'SPLIT differs from TRIM because Split…', options: ['Does not cut the cutting element', 'Cuts both surfaces', 'Only works in 2D', 'Merges surfaces'], correctAnswer: 'Does not cut the cutting element' },
    { text: 'Before a fillet, multiple surfaces should be…', options: ['Joined into one connected surface', 'Split', 'Deleted', 'Exploded'], correctAnswer: 'Joined into one connected surface' },
    { text: 'Join\'s Check connexity option verifies…', options: ['That the edges actually connect without gaps', 'That surfaces are parallel', 'That the part is symmetric', 'That the material is correct'], correctAnswer: 'That the edges actually connect without gaps' },
  ],
  'Fillets, Blends & Surface Continuity': [
    { text: 'A variable fillet lets you…', options: ['Set different radii at different points along an edge', 'Only use one radius', 'Change the part material', 'Reverse the normals'], correctAnswer: 'Set different radii at different points along an edge' },
    { text: 'Which continuity class shares the same tangent direction?', options: ['G1', 'G0', 'G2', 'G3'], correctAnswer: 'G1' },
    { text: 'Class-A automotive surfaces require at least…', options: ['G2 curvature continuity', 'G0 contact', 'G1 tangency', 'No continuity'], correctAnswer: 'G2 curvature continuity' },
    { text: 'When a fillet radius is too large for the gap, you use…', options: ['A Blend surface', 'A Split', 'A Heal', 'A Thick surface'], correctAnswer: 'A Blend surface' },
  ],

  // ── WEEK 11 — Generative Shape Design Studio ─────────────────────────────
  'The GSD Workbench & Design Workflow': [
    { text: 'From the Start menu, the surface-modelling workbench is reached via…', options: ['Shape → Generative Shape Design', 'Part Design', 'Drafting', 'Assembly'], correctAnswer: 'Shape → Generative Shape Design' },
    { text: 'GSD groups its topology into…', options: ['Hybrid Bodies', 'Configurations', 'Design Tables', 'Layers'], correctAnswer: 'Hybrid Bodies' },
    { text: 'The correct GSD surface workflow is…', options: ['Wireframe → surfaces → trim/split/join → fillets → analyse → thicken/sew', 'Thicken first', 'Analyse before wireframe', 'Sew before trim'], correctAnswer: 'Wireframe → surfaces → trim/split/join → fillets → analyse → thicken/sew' },
    { text: 'Surface analysis in GSD should be done…', options: ['At every step, not just at the end', 'Only when the part is finished', 'Never', 'After rendering'], correctAnswer: 'At every step, not just at the end' },
  ],
  'Advanced Surfaces: Lofts, Fills & Blends': [
    { text: 'The loft option that controls how points on adjacent sections line up is…', options: ['Coupling', 'Spline', 'Pitch', 'Offset'], correctAnswer: 'Coupling' },
    { text: 'Which command caps an opening with a surface through its boundary curves?', options: ['Fill', 'Loft', 'Extrude', 'Split'], correctAnswer: 'Fill' },
    { text: 'A blend can match tangency or curvature at…', options: ['Both boundaries', 'Only one boundary', 'Neither', 'The spine'], correctAnswer: 'Both boundaries' },
    { text: 'The element that steers a loft\'s main direction is the…', options: ['Spine', 'Coupling', 'Section', 'Guide'], correctAnswer: 'Spine' },
  ],
  'Control Points, Styling & Curve Editing': [
    { text: 'Dragging a spline\'s control polygon points…', options: ['Changes the curve\'s shape by feel', 'Changes the material', 'Adds dimensions', 'Deletes fit points'], correctAnswer: 'Changes the curve\'s shape by feel' },
    { text: 'The radiating short lines that show a curve\'s bend are the…', options: ['Curvature combs', 'Control handles', 'Fit points', 'Construction lines'], correctAnswer: 'Curvature combs' },
    { text: 'Which workbench gives true control-point SURFACE sculpting?', options: ['FreeStyle', 'Sketcher', 'Part Design', 'Drafting'], correctAnswer: 'FreeStyle' },
    { text: 'A localised kink in the curvature comb means…', options: ['A kink in the surface the curve will create', 'The curve is perfect', 'A dimension is wrong', 'The material changed'], correctAnswer: 'A kink in the surface the curve will create' },
  ],
  'Healing, Checking & Surface Quality': [
    { text: 'Which command closes micro-gaps up to a merge distance?', options: ['Heal', 'Split', 'Trim', 'Join'], correctAnswer: 'Heal' },
    { text: 'The Connect Checker reports…', options: ['G0/G1/G2 status plus gap and angle at a shared edge', 'Wall thickness', 'Material density', 'BOM quantity'], correctAnswer: 'G0/G1/G2 status plus gap and angle at a shared edge' },
    { text: 'Curvature Analysis shades the surface so that…', options: ['Smooth colour bands mean a smooth shape', 'Red means aluminium', 'Colours show layers', 'Bands show the BOM'], correctAnswer: 'Smooth colour bands mean a smooth shape' },
    { text: 'A 0.03 mm gap at a seam is invisible but will appear on a machined part as…', options: ['A witness line', 'Nothing', 'A stronger edge', 'A colour change'], correctAnswer: 'A witness line' },
  ],

  // ── WEEK 12 — Draft Analysis & Product Engineering ───────────────────────
  'Draft Analysis & Parting Lines': [
    { text: 'In Draft Analysis, a face parallel to the pull direction (0 degrees) shows as…', options: ['Yellow/neutral', 'Green/positive', 'Red/negative', 'Blue/positive'], correctAnswer: 'Yellow/neutral' },
    { text: 'Typical moulded draft angles are…', options: ['0.5 to 3 degrees', '10 to 20 degrees', '45 degrees', '90 degrees'], correctAnswer: '0.5 to 3 degrees' },
    { text: 'The parting line usually sits at…', options: ['The largest projected silhouette, hidden in a groove or sharp edge', 'The exact centre of the part', 'Anywhere convenient', 'The smallest feature'], correctAnswer: 'The largest projected silhouette, hidden in a groove or sharp edge' },
    { text: 'After adding draft, the correct next step is…', options: ['Re-run Draft Analysis to confirm red turned green', 'Publish the drawing', 'Skip the check', 'Run a motion study'], correctAnswer: 'Re-run Draft Analysis to confirm red turned green' },
  ],
  'The Draft Tool: Adding Draft to Faces': [
    { text: 'The feature that adds taper to faces around a fixed element is the…', options: ['Draft Angle feature', 'Shell feature', 'Chamfer', 'Thick Surface'], correctAnswer: 'Draft Angle feature' },
    { text: 'The neutral element of a draft is…', options: ['What does not move — usually the base plane', 'The pull direction', 'The parting line', 'The material'], correctAnswer: 'What does not move — usually the base plane' },
    { text: 'Drafting the WRONG side of a face creates…', options: ['An undercut instead of a release', 'A thicker wall', 'A shell', 'A smooth finish'], correctAnswer: 'An undercut instead of a release' },
    { text: 'A taper that changes along a rib\'s length is best done with…', options: ['Variable angle draft', 'Face draft', 'Chamfer', 'Shell'], correctAnswer: 'Variable angle draft' },
  ],
  'Thickness Analysis & Wall Conditions': [
    { text: 'In Thickness Analysis, a too-thick boss typically shows as…', options: ['Red/yellow outside the healthy range', 'Green', 'The material colour', 'Invisible'], correctAnswer: 'Red/yellow outside the healthy range' },
    { text: 'A thick wall causes a cosmetic…', options: ['Sink mark', 'Flash', 'Warpage from thin walls', 'Short shot'], correctAnswer: 'Sink mark' },
    { text: 'The quickest way to get even walls is…', options: ['The Shell feature', 'More ribs', 'A thicker extrusion', 'A larger draft'], correctAnswer: 'The Shell feature' },
    { text: 'A rib\'s thickness should be about ___ of the wall to avoid its own sink mark.', options: ['60%', '150%', '200%', '10%'], correctAnswer: '60%' },
  ],
  'Packaging, Clearance & Engineering Constraints': [
    { text: 'A packaging envelope is best checked against the design with…', options: ['A simplified blocking model the real parts must not exceed', 'A rendering', 'The BOM', 'The material'], correctAnswer: 'A simplified blocking model the real parts must not exceed' },
    { text: 'The check that verifies minimum gaps between parts is the…', options: ['Clearance check', 'Interference check only', 'Draft analysis', 'Section view'], correctAnswer: 'Clearance check' },
    { text: 'A bolt you cannot fit a spanner on violates which constraint class?', options: ['Service access', 'Thermal', 'Manufacturing', 'Cost'], correctAnswer: 'Service access' },
    { text: 'Cumulative tolerances across an assembly are analysed with…', options: ['A tolerance stack-up', 'A draft check', 'A rendering', 'The BOM'], correctAnswer: 'A tolerance stack-up' },
  ],

  // ── WEEK 13 — CNC Axis Systems & Coordinate Frames ────────────────────────
  'CNC Machine Types & Axes (X, Y, Z)': [
    { text: 'A machine with an automatic tool changer is called a…', options: ['Machining centre', 'Lathe', 'Grinder', 'Press'], correctAnswer: 'Machining centre' },
    { text: 'On a CNC lathe, the two main axes are…', options: ['X (radius/diameter) and Z (length)', 'X and Y', 'Y and Z', 'A and B'], correctAnswer: 'X (radius/diameter) and Z (length)' },
    { text: 'A 5-axis machine adds to X/Y/Z two…', options: ['Rotary axes', 'Vertical spindles', 'Extra feedrates', 'Coolant channels'], correctAnswer: 'Rotary axes' },
    { text: 'CNC axes follow which hand rule for orientation?', options: ['Right-hand rule', 'Left-hand rule', 'Clock rule', 'No rule'], correctAnswer: 'Right-hand rule' },
  ],
  'The Work Coordinate System & Machine Zero': [
    { text: 'The position the machine calibrates to at power-up is…', options: ['Machine zero (home)', 'Part zero', 'Work offset 1', 'The tool changer'], correctAnswer: 'Machine zero (home)' },
    { text: 'Which registers store the distance from machine zero to part zero?', options: ['Work offsets G54-G59', 'Feedrates', 'Spindle speeds', 'Tool tables'], correctAnswer: 'Work offsets G54-G59' },
    { text: 'Which G-code addresses machine coordinates directly, cancelling work offsets?', options: ['G53', 'G54', 'G28', 'G90'], correctAnswer: 'G53' },
    { text: 'The golden rule for coordinate systems is…', options: ['Machine coordinates for safe motion, work coordinates for cutting', 'Always machine coordinates', 'Always work coordinates', 'Never use offsets'], correctAnswer: 'Machine coordinates for safe motion, work coordinates for cutting' },
  ],
  'Part Zero, Offsets & Workholding': [
    { text: 'Part zero on a mill is usually placed at…', options: ['The bottom-left corner of the stock', 'The centre of the sky', 'Machine home', 'A random corner'], correctAnswer: 'The bottom-left corner of the stock' },
    { text: 'The register that stores each tool\'s length for G43 is the…', options: ['Tool length offset (H-code)', 'Work offset (G54)', 'Cutter comp (D-code)', 'Spindle speed'], correctAnswer: 'Tool length offset (H-code)' },
    { text: 'The physical restraint that holds the stock on a mill is the…', options: ['Workholding (vise/clamps/fixture)', 'Offset table', 'Tool magazine', 'Spindle'], correctAnswer: 'Workholding (vise/clamps/fixture)' },
    { text: 'The document that links the program to the physical setup (offsets, tools, workholding) is the…', options: ['Setup sheet', 'BOM', 'Revision table', 'Transmittal'], correctAnswer: 'Setup sheet' },
  ],
  'Units, Feedrate & Spindle Speeds': [
    { text: 'Which G-code sets inch units?', options: ['G20', 'G21', 'G90', 'G17'], correctAnswer: 'G20' },
    { text: 'Spindle RPM is derived from…', options: ['Cutting speed and tool diameter', 'Feed per tooth', 'The part length', 'Coolant pressure'], correctAnswer: 'Cutting speed and tool diameter' },
    { text: 'The feedrate for a cutter is calculated as…', options: ['RPM x flutes x chip per tooth', 'RPM x diameter', 'Cutting speed x depth', 'Step-over x RPM'], correctAnswer: 'RPM x flutes x chip per tooth' },
    { text: 'Feeding too slowly makes the tool…', options: ['Rub and overheat instead of cut', 'Cut faster', 'Cool down', 'Move in the wrong direction'], correctAnswer: 'Rub and overheat instead of cut' },
  ],

  // ── WEEK 14 — G-Code Commands & Canned Cycles ─────────────────────────────
  'G-Code Structure: Blocks, Words & Modes': [
    { text: 'A BLOCK in G-code is…', options: ['One line of the program', 'A whole program', 'A tool', 'A file'], correctAnswer: 'One line of the program' },
    { text: 'Which word sets the feedrate?', options: ['F', 'S', 'T', 'H'], correctAnswer: 'F' },
    { text: 'A MODAL G-code…', options: ['Stays active until replaced by another code in its group', 'Works for one block only', 'Is non-standard', 'Cancels itself'], correctAnswer: 'Stays active until replaced by another code in its group' },
    { text: 'The block N020 G01 Z-2 keeps the X and Y from the previous block because…', options: ['Coordinates are modal', 'Z is modal', 'N numbers are modal', 'G01 resets them'], correctAnswer: 'Coordinates are modal' },
  ],
  'G00, G01, G02/G03: Motion Commands': [
    { text: 'G00 rapid traverse moves the tool…', options: ['As fast as the machine allows, often on a dog-leg path', 'In a straight line at feedrate', 'In a circle', 'Only in Z'], correctAnswer: 'As fast as the machine allows, often on a dog-leg path' },
    { text: 'Which code cuts a straight line at the programmed feedrate?', options: ['G01', 'G00', 'G02', 'G03'], correctAnswer: 'G01' },
    { text: 'G03 is a…', options: ['Counter-clockwise arc', 'Clockwise arc', 'Rapid move', 'Dwell'], correctAnswer: 'Counter-clockwise arc' },
    { text: 'Which G-code selects the XY plane so I and J mean X and Y offsets?', options: ['G17', 'G18', 'G19', 'G20'], correctAnswer: 'G17' },
  ],
  'Canned Cycles: G81-G89 Drilling': [
    { text: 'G81 X25 Y25 Z-25 R5 F150 will…', options: ['Drill at (25,25) to depth 25, retracting to 5 mm above', 'Rapid home', 'Tap a thread', 'Ream the hole'], correctAnswer: 'Drill at (25,25) to depth 25, retracting to 5 mm above' },
    { text: 'Which cycle PECKS in steps to clear chips on deep holes?', options: ['G83', 'G81', 'G84', 'G85'], correctAnswer: 'G83' },
    { text: 'Which cycle reverses the spindle at the bottom to unwind a tap?', options: ['G84', 'G81', 'G83', 'G82'], correctAnswer: 'G84' },
    { text: 'After the last hole of a canned cycle you must…', options: ['Cancel with G80', 'Re-run G81', 'Change the feedrate', 'Nothing'], correctAnswer: 'Cancel with G80' },
  ],
  'Tool Length, Cutter Compensation & G90/G91': [
    { text: 'Forgetting G43 after a tool change causes…', options: ['Every Z value wrong by the whole tool length', 'Nothing', 'A units error', 'A feed error'], correctAnswer: 'Every Z value wrong by the whole tool length' },
    { text: 'Which code shifts the path left of the programmed direction?', options: ['G41', 'G42', 'G40', 'G43'], correctAnswer: 'G41' },
    { text: 'Cutter compensation must be engaged on…', options: ['A straight lead-in move', 'An arc', 'A rapid plunge', 'Mid-contour'], correctAnswer: 'A straight lead-in move' },
    { text: 'G91 makes coordinates…', options: ['Incremental from the current position', 'Absolute from part zero', 'Metric', 'Rotary'], correctAnswer: 'Incremental from the current position' },
  ],

  // ── WEEK 15 — M-Code & Machine Control ────────────────────────────────────
  'M-Codes: Spindle, Coolant & Program Control': [
    { text: 'Which M-code stops the spindle?', options: ['M05', 'M03', 'M04', 'M06'], correctAnswer: 'M05' },
    { text: 'The M-code that stops the program for an operator action and requires Cycle Start is…', options: ['M00', 'M01', 'M02', 'M30'], correctAnswer: 'M00' },
    { text: 'M30 does what?', options: ['Ends the program and rewinds it for the next part', 'Stops with a pause', 'Turns coolant on', 'Loads a tool'], correctAnswer: 'Ends the program and rewinds it for the next part' },
    { text: 'T02 M06 does what?', options: ['Loads tool 2 into the spindle', 'Sets feedrate 2', 'Moves to tool-change home', 'Starts spindle at speed 2'], correctAnswer: 'Loads tool 2 into the spindle' },
  ],
  'The Program Format & Safe Startup': [
    { text: 'Comments in a Fanuc program are written…', options: ['Inside parentheses ( ... )', 'After a #', 'Inside quotes', 'On the next line'], correctAnswer: 'Inside parentheses ( ... )' },
    { text: 'The universal "safe line" at the top of a program is…', options: ['G90 G21 G40 G80 G49', 'G00 Z0', 'M30', 'G28 G91 Z0'], correctAnswer: 'G90 G21 G40 G80 G49' },
    { text: 'Why run a first-run in Single Block mode?', options: ['Each block is confirmed before it executes', 'It is faster', 'It cuts better', 'It is required by G-code'], correctAnswer: 'Each block is confirmed before it executes' },
    { text: 'The program header should carry…', options: ['Part number, revision, tools, setup summary', 'Only the program number', 'Only the date', 'The operator\'s name'], correctAnswer: 'Part number, revision, tools, setup summary' },
  ],
  'Subprograms, Loops & Macros': [
    { text: 'M98 P1000 L4 calls subprogram O1000…', options: ['Four times', 'Once', 'A thousand times', 'Until stopped'], correctAnswer: 'Four times' },
    { text: 'The command that returns from a subprogram is…', options: ['M99', 'M98', 'M30', 'M00'], correctAnswer: 'M99' },
    { text: 'In Fanuc Macro B, #2 = #1 / 2 performs…', options: ['Arithmetic on variables', 'A tool change', 'A rapid move', 'A file save'], correctAnswer: 'Arithmetic on variables' },
    { text: 'A program that machines every size in a family by editing one variable is called…', options: ['Parametric / macro-parametric', 'A canned cycle', 'A subprogram call', 'A fixture'], correctAnswer: 'Parametric / macro-parametric' },
  ],
  'Machine Setup, Zero Return & Safety': [
    { text: 'G28 G91 Z0 performs…', options: ['An incremental return of Z to machine home', 'A drill cycle', 'A tool change', 'A feed change'], correctAnswer: 'An incremental return of Z to machine home' },
    { text: 'A misaligned stock clamped in the vise causes…', options: ['Tapered walls relative to the axes', 'Nothing', 'Longer cycle time', 'A cleaner finish'], correctAnswer: 'Tapered walls relative to the axes' },
    { text: 'A Z-axis drive alarm most likely means…', options: ['The axis hit something or the servo faulted', 'The tool is worn', 'Coolant is low', 'The program ended'], correctAnswer: 'The axis hit something or the servo faulted' },
    { text: 'Before pressing Cycle Start on a new program you should verify…', options: ['Stock, tool, H offset, work offset, rapids low, feedhold ready', 'Only the stock', 'Only the tool', 'The BOM'], correctAnswer: 'Stock, tool, H offset, work offset, rapids low, feedhold ready' },
  ],

  // ── WEEK 16 — Toolpath Planning & Simulation ──────────────────────────────
  'Choosing Tools & Feeds for Material': [
    { text: 'The tool with a hemispherical tip for 3D contouring is the…', options: ['Ball end mill', 'Face mill', 'Drill', 'Reamer'], correctAnswer: 'Ball end mill' },
    { text: 'Steel (1045) compared to aluminium typically needs…', options: ['Lower speed and lower feed', 'Higher speed', 'The same speeds', 'No coolant'], correctAnswer: 'Lower speed and lower feed' },
    { text: 'The sideways bite of each pass (40-70% of diameter for roughing) is the…', options: ['Step-over', 'Step-down', 'Chip load', 'Feed per tooth'], correctAnswer: 'Step-over' },
    { text: 'A spotting drill is used to…', options: ['Make an accurate centre before the real drill', 'Spot-weld', 'Finish walls', 'Cut keyways'], correctAnswer: 'Make an accurate centre before the real drill' },
  ],
  'Roughing vs Finishing Strategies': [
    { text: 'The roughing phase aims to…', options: ['Remove bulk material fast, leaving stock for finishing', 'Produce the final surface', 'Drill holes', 'Deburr edges'], correctAnswer: 'Remove bulk material fast, leaving stock for finishing' },
    { text: 'Adaptive / high-efficiency roughing keeps…', options: ['A constant chip load with a wide step-over and shallow cut', 'A full-width deep cut', 'The spindle off', 'The tool still'], correctAnswer: 'A constant chip load with a wide step-over and shallow cut' },
    { text: 'Finishing passes use a small step-over of about…', options: ['5-15% of tool diameter', '60% of tool diameter', '100% of tool diameter', '50% of step-down'], correctAnswer: '5-15% of tool diameter' },
    { text: 'Climb milling (cutter rotating into the feed direction) leaves…', options: ['A cleaner edge in most materials', 'A rougher edge', 'More heat', 'A burr on top'], correctAnswer: 'A cleaner edge in most materials' },
  ],
  'Simulating & Verifying the Toolpath': [
    { text: 'The simulation result where the tool cuts deeper than the part is called…', options: ['Gouging', 'Chatter', 'Burning', 'Drift'], correctAnswer: 'Gouging' },
    { text: 'Simulation can catch a rapid move that…', options: ['Drives into material', 'Is too slow', 'Uses too little coolant', 'Changes the units'], correctAnswer: 'Drives into material' },
    { text: 'Over-cut zones in a Compare-to-model map are highlighted…', options: ['Red', 'Blue', 'Green', 'Black'], correctAnswer: 'Red' },
    { text: 'An air pass before the first real cut means…', options: ['Running the toolpath above the part to prove the moves', 'Cutting with no tool', 'Turning the air off', 'A dry run without coolant'], correctAnswer: 'Running the toolpath above the part to prove the moves' },
  ],
  'Post-Processing & Machine-Specific Code': [
    { text: 'The post-processor\'s job is to…', options: ['Translate CAM toolpaths into one machine\'s G-code dialect', 'Design the part', 'Select the material', 'Run the machine'], correctAnswer: 'Translate CAM toolpaths into one machine\'s G-code dialect' },
    { text: 'Different controls like Fanuc and Siemens need different posts because…', options: ['They speak slightly different G-code dialects', 'They cut different metals', 'They have different colours', 'They use different units only'], correctAnswer: 'They speak slightly different G-code dialects' },
    { text: 'A post that silently omits G43 would cause…', options: ['Wrong Z depths from missing tool-length offsets', 'A faster cut', 'A better finish', 'Nothing'], correctAnswer: 'Wrong Z depths from missing tool-length offsets' },
    { text: 'Verifying a new post is best done by…', options: ['Posting a known-good program and diffing the output', 'Running it on a scrap part', 'Emailing it to the shop', 'Deleting the old post'], correctAnswer: 'Posting a known-good program and diffing the output' },
  ],

  // ── WEEK 17 — Multi-Part Assembly Project ─────────────────────────────────
  'Planning a Multi-Part Mechanical Project': [
    { text: 'The planning document that lists parts and quantities BEFORE modelling is the…', options: ['BOM', 'GD&T frame', 'Motion study', 'Setup sheet'], correctAnswer: 'BOM' },
    { text: 'The overall size budget the product must fit inside is called the…', options: ['Packaging envelope', 'Parting line', 'Tolerance zone', 'Stock block'], correctAnswer: 'Packaging envelope' },
    { text: 'The nominal dimension at a shaft-to-bore interface is…', options: ['The contract between the two parts', 'A suggestion', 'The parting line', 'A fillet radius'], correctAnswer: 'The contract between the two parts' },
    { text: 'The best modelling order for a project is…', options: ['Base, then interfaces, then moving parts, then fasteners', 'Fasteners first', 'Moving parts before the base', 'Any random order'], correctAnswer: 'Base, then interfaces, then moving parts, then fasteners' },
  ],
  'Modeling Mating Components for Assembly': [
    { text: 'The first dimension when modelling a shaft should be…', options: ['The bearing journal — the interface', 'The overall length', 'The handle', 'The material'], correctAnswer: 'The bearing journal — the interface' },
    { text: 'Keeping the bore and journal diameters in agreement across two parts is done with…', options: ['Shared global variables or equations', 'Copying one part twice', 'Trial and error', 'Two independent dimensions'], correctAnswer: 'Shared global variables or equations' },
    { text: 'A clearance fit at an interface means…', options: ['The journal is slightly smaller than the bore', 'They are identical', 'The journal is bigger', 'There is no fit'], correctAnswer: 'The journal is slightly smaller than the bore' },
    { text: 'Modelling parts in isolation and hoping they fit is a mistake because…', options: ['Interface dimensions drift between the parts', 'Parts auto-adjust', 'It always works', 'It is faster'], correctAnswer: 'Interface dimensions drift between the parts' },
  ],
  'Building the Assembly & Checking Fits': [
    { text: 'The first component to insert and fix is…', options: ['The base or housing', 'The smallest fastener', 'The crank', 'Any part'], correctAnswer: 'The base or housing' },
    { text: 'A cover on a housing given only a Coincident face mate still…', options: ['Can rotate — needs a second mate to stop rotation', 'Is fully locked', 'Cannot move at all', 'Falls through'], correctAnswer: 'Can rotate — needs a second mate to stop rotation' },
    { text: 'An intentional interference (press fit) should be…', options: ['Excluded from the interference report and confirmed as the plan value', 'Deleted from the model', 'Reported as a bug', 'Ignored forever'], correctAnswer: 'Excluded from the interference report and confirmed as the plan value' },
    { text: 'A component that must move but cannot is…', options: ['Over-mated', 'Under-mated', 'Fixed', 'Suppressed'], correctAnswer: 'Over-mated' },
  ],
  'Motion, Tolerances & Adjustability': [
    { text: 'The chain where tolerances add across parts is called the…', options: ['Tolerance stack-up', 'Parting line', 'Motion study', 'BOM'], correctAnswer: 'Tolerance stack-up' },
    { text: 'Slotted holes in a design allow…', options: ['Positioning then clamping on the bench', 'Nothing', 'Faster drafting', 'Thinner walls'], correctAnswer: 'Positioning then clamping on the bench' },
    { text: 'The cheap alternative to tightening every tolerance when a stack-up overruns is…', options: ['A clearance or adjustment feature on one critical part', 'More material', 'A bigger motor', 'Tighter tolerances on everything'], correctAnswer: 'A clearance or adjustment feature on one critical part' },
    { text: 'Which tool finds a collision that only occurs mid-travel?', options: ['Motion study with interference during motion', 'A static interference check', 'Draft analysis', 'A section view'], correctAnswer: 'Motion study with interference during motion' },
  ],

  // ── WEEK 18 — Production Drawings & GD&T ──────────────────────────────────
  'From 3D Model to 2D Production Drawing': [
    { text: 'The drawing views placed from a 3D model are ___ to the model.', options: ['Associative', 'Static', 'Independent', 'Disconnected'], correctAnswer: 'Associative' },
    { text: 'The view set that communicates a part best is…', options: ['Front, Top, Right plus Isometric', 'Only Front', 'Only Isometric', 'Any single view'], correctAnswer: 'Front, Top, Right plus Isometric' },
    { text: 'A tiny clearance chamfer unreadable at 1:1 should be shown in…', options: ['A detail view at a larger scale', 'The BOM', 'A note only', 'The title block'], correctAnswer: 'A detail view at a larger scale' },
    { text: 'A dimension with no individual tolerance is governed by…', options: ['The general tolerance note in the title block', 'The GD&T frame', 'The material', 'Nothing'], correctAnswer: 'The general tolerance note in the title block' },
  ],
  'Section Views, Detail Views & Break Views': [
    { text: 'To reveal a blind hole\'s depth you use…', options: ['A Section View', 'A Break View', 'An Isometric only', 'A BOM'], correctAnswer: 'A Section View' },
    { text: 'An offset section passes through…', options: ['Several features at once via a stepped cutting plane', 'Only one feature', 'Nothing', 'The origin only'], correctAnswer: 'Several features at once via a stepped cutting plane' },
    { text: 'A 500 mm shaft is made readable on an A3 sheet with…', options: ['A Break View', 'A Section View', 'A detail view', 'More isometrics'], correctAnswer: 'A Break View' },
    { text: 'The label "A 4:1" on a detail view means…', options: ['Detail A is magnified 4 times', 'Section A is cut 4 times', 'Revision A, page 4', 'Four views exist'], correctAnswer: 'Detail A is magnified 4 times' },
  ],
  'Geometric Dimensioning & Tolerancing (GD&T)': [
    { text: 'Which GD&T standard governs the language?', options: ['ASME Y14.5 / ISO 1101', 'ISO 7200', 'DIN 5480', 'ASME B36.10'], correctAnswer: 'ASME Y14.5 / ISO 1101' },
    { text: 'Flatness, straightness, circularity and cylindricity are which group?', options: ['Form (no datums)', 'Orientation', 'Location', 'Runout'], correctAnswer: 'Form (no datums)' },
    { text: 'The cylindrical tolerance zone for a hole position is indicated by…', options: ['The Ø prefix on the tolerance', 'The A datum', 'The leader arrow', 'The scale'], correctAnswer: 'The Ø prefix on the tolerance' },
    { text: 'The rectangular zone of a box ± dimension is replaced by which GD&T zone?', options: ['A cylindrical position zone', 'A flatness zone', 'A runout zone', 'A profile zone'], correctAnswer: 'A cylindrical position zone' },
  ],
  'Datum References & Feature Control Frames': [
    { text: 'A datum is…', options: ['A theoretically exact point, axis or plane for measurement', 'A dimension value', 'A line on the drawing', 'A material'], correctAnswer: 'A theoretically exact point, axis or plane for measurement' },
    { text: 'In the frame A B C, the SECONDARY datum B…', options: ['Fixes orientation and position next', 'Fixes everything first', 'Is optional always', 'Is the part number'], correctAnswer: 'Fixes orientation and position next' },
    { text: 'The datum order should match…', options: ['How the part is set up on the machine/CMM', 'Alphabetical order', 'Part size', 'Material hardness'], correctAnswer: 'How the part is set up on the machine/CMM' },
    { text: 'A frame with only datums A B…', options: ['Leaves one constraint looser than A B C', 'Is invalid', 'Is tighter than A B C', 'Cancels the tolerance'], correctAnswer: 'Leaves one constraint looser than A B C' },
  ],

  // ── WEEK 19 — Bill of Materials & Documentation ───────────────────────────
  'Creating the Bill of Materials': [
    { text: 'A BOM placed on an assembly drawing is anchored to…', options: ['The title block', 'The top-left corner of the sheet', 'Anywhere', 'The isometric view'], correctAnswer: 'The title block' },
    { text: 'If the assembly gains a part, a LINKED BOM will…', options: ['Gain a row automatically', 'Stay unchanged', 'Delete a row', 'Crash'], correctAnswer: 'Gain a row automatically' },
    { text: 'Which BOM column carries the part\'s identifying code?', options: ['Part Number', 'Qty', 'Material', 'Note'], correctAnswer: 'Part Number' },
    { text: 'A BOM out of sync with the assembly causes…', options: ['Wrong purchasing and production kitting', 'Nothing', 'Faster drafting', 'Better renders'], correctAnswer: 'Wrong purchasing and production kitting' },
  ],
  'Balloons, Item Numbers & Linked Properties': [
    { text: 'The tool that labels each component with its BOM item number is…', options: ['Balloon', 'Dimension', 'Leader', 'Callout'], correctAnswer: 'Balloon' },
    { text: 'Auto-balloon places…', options: ['A balloon for every component in one operation', 'Only one balloon', 'Dimensions', 'Hatching'], correctAnswer: 'A balloon for every component in one operation' },
    { text: 'BOM rows come from…', options: ['The parts\' file properties', 'Typed text', 'The drawing title', 'The view name'], correctAnswer: 'The parts\' file properties' },
    { text: 'To track cost and supplier in the BOM you add…', options: ['Custom properties mapped to columns', 'More balloons', 'More views', 'More colours'], correctAnswer: 'Custom properties mapped to columns' },
  ],
  'Exporting Drawings: PDF, DWG, DXF': [
    { text: 'The format to send anyone for VIEWING that keeps text stable is…', options: ['PDF with embedded fonts', 'DWG only', 'DXF only', 'PNG screenshot'], correctAnswer: 'PDF with embedded fonts' },
    { text: 'Exporting a drawing to DWG is for…', options: ['Someone who must edit it', 'Viewing only', 'Cutting', 'Emailing'], correctAnswer: 'Someone who must edit it' },
    { text: 'For a waterjet, you export the cutting outlines as…', options: ['DXF at 1:1 with closed polylines on a clear layer', 'PDF at A4', 'A native CAD file', 'A JPEG'], correctAnswer: 'DXF at 1:1 with closed polylines on a clear layer' },
    { text: 'Checking a critical dimension after export protects against…', options: ['A wrong scale baked into the file', 'Missing fonts', 'Layer colours', 'A missing title block'], correctAnswer: 'A wrong scale baked into the file' },
  ],
  'Documentation: Drawing Sets & Revisions': [
    { text: 'One product is delivered as…', options: ['A drawing set: assembly, per-part sheets, exploded view, notes', 'A single PDF', 'The model only', 'A chat message'], correctAnswer: 'A drawing set: assembly, per-part sheets, exploded view, notes' },
    { text: 'The rule of revision control is…', options: ['A drawing that changes gets a new revision; never edit in place', 'Edit in place freely', 'Revisions are optional', 'Delete old drawings'], correctAnswer: 'A drawing that changes gets a new revision; never edit in place' },
    { text: 'The revision table records…', options: ['Rev letter, date, description, approval', 'Only the date', 'The file size', 'The CAD version'], correctAnswer: 'Rev letter, date, description, approval' },
    { text: 'Old revision PDFs should be…', options: ['Archived, never overwritten', 'Deleted', 'Renamed final2', 'Printed'], correctAnswer: 'Archived, never overwritten' },
  ],

  // ── WEEK 20 — Final Submission & Design Review ────────────────────────────
  'The Complete Mechanical Design Workflow': [
    { text: 'The gate at the sketch stage is…', options: ['The sketch is fully defined', 'The sketch is colourful', 'The sketch is fast', 'The sketch is big'], correctAnswer: 'The sketch is fully defined' },
    { text: 'Catching a problem at the sketch stage costs a minute; catching it at the drawing stage costs…', options: ['A day', 'The same', 'Less', 'Nothing'], correctAnswer: 'A day' },
    { text: 'The workflow is best described as…', options: ['A feedback loop, walking gates until release', 'A one-pass list', 'Random', 'Optional'], correctAnswer: 'A feedback loop, walking gates until release' },
    { text: 'Choosing revolve for symmetry and loft for transitions is…', options: ['Selecting the feature that encodes the design rule', 'Slower', 'A rendering choice', 'Random'], correctAnswer: 'Selecting the feature that encodes the design rule' },
  ],
  'Design Review: Checking Against Requirements': [
    { text: 'The review document maps each requirement to…', options: ['Where it is met and the evidence', 'A colour', 'A person', 'A budget'], correctAnswer: 'Where it is met and the evidence' },
    { text: 'A requirement with no supporting evidence is…', options: ['A risk or action item', 'Automatically met', 'Ignored', 'Deleted'], correctAnswer: 'A risk or action item' },
    { text: '"The lid opens" needs which evidence?', options: ['A motion study over its travel', 'A rendering', 'The BOM', 'The material'], correctAnswer: 'A motion study over its travel' },
    { text: 'The review meeting includes…', options: ['Drafter, designer, manufacturing and quality', 'Only the designer', 'Only the customer', 'Only the manager'], correctAnswer: 'Drafter, designer, manufacturing and quality' },
  ],
  'Delivering the Final Package': [
    { text: 'A professional submission contains…', options: ['Models, drawing set, BOM, analysis, exports, and a transmittal', 'Only the model', 'Only the PDF', 'A zip of screenshots'], correctAnswer: 'Models, drawing set, BOM, analysis, exports, and a transmittal' },
    { text: 'The test of a well-packaged folder is…', options: ['A stranger can find any file in seconds', 'The files are sorted by size', 'The folder is empty', 'The names are short'], correctAnswer: 'A stranger can find any file in seconds' },
    { text: 'The file name "CRANK-1045_REV-B.sldprt" follows…', options: ['Part-number and revision naming discipline', 'No rule', 'Alphabetical order', 'A random convention'], correctAnswer: 'Part-number and revision naming discipline' },
    { text: 'The document that legally lists what was delivered at a revision is the…', options: ['Transmittal sheet', 'BOM', 'Drawing', 'Motion study'], correctAnswer: 'Transmittal sheet' },
  ],
  'Professional Certification & Career Paths': [
    { text: 'The entry credential for AutoCAD drafting roles is…', options: ['Autodesk Certified Professional: AutoCAD', 'CSWP', 'GDTP', 'NIMS'], correctAnswer: 'Autodesk Certified Professional: AutoCAD' },
    { text: 'CSWP stands for…', options: ['Certified SolidWorks Professional', 'Certified Steel Worker Program', 'Civil Structural Work Permit', 'CAD SolidWorks Performance'], correctAnswer: 'Certified SolidWorks Professional' },
    { text: 'NIMS credentials cover…', options: ['CNC machining operations and programming', 'GD&T only', 'AutoCAD only', 'Project management'], correctAnswer: 'CNC machining operations and programming' },
    { text: 'Recruiters value the course project because…', options: ['A portfolio of finished work demonstrates the workflow', 'It has a certificate', 'It is cheap', 'It uses many tools'], correctAnswer: 'A portfolio of finished work demonstrates the workflow' },
  ],
};
