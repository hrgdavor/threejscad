'use strict';
const test = require('ava');

const parseParams = require('../lib/parser.js');
const printParams = require('../lib/printer.js');
const {parseOne, parseComment, parseDef} = parseParams

const sampleParams = [
  {name:'width',caption:'Width', type:'int', initial:145},
  {name:'height',caption:'height', type:'int', initial:100},
  {name:'division',caption:'Number of rows (== columns)', type:'int', initial:4},
  {name:'bottomPieceHeight',caption:'Water space(mm)', type:'int', initial:20},

{name:'group1',caption:'Wall thickness', type:'group'},
  {name:'thickOut',caption:'Vertical outside', type:'number', initial:0.8},
  {name:'thickIn',caption:'Vertical inside', type:'number', initial:0.8},
  {name:'thickBottom',caption:'Bottom', type:'number', initial:0.8},
]

const sampleScript = `function main({// @jscad-params
  width=145, // Width
  height=100,
  division=4,// Number of rows (== columns)
  bottomPieceHeight=20,// Water space(mm)

/* Wall thickness :group1 */
  thickOut=0.8, //Vertical outside
  
  thickIn=0.8,// Vertical inside
  thickBottom=0.8,//Bottom
}){`

const sampleScript2 = `function main({// @jscad-params
  width=145,            // Width 
  height=100,           // height
  division=4,           // Number of rows (== columns)
  bottomPieceHeight=20, // Water space(mm)

// Wall thickness :group1
  thickOut=0.8,    // Vertical outside
  thickIn=0.8,     // Vertical inside
  thickBottom=0.8, // Bottom
})`

var inputTest = `const jscad = require('@jscad...');

var x = 1

${sampleScript}
	var a = 1

	return circle()
}
`

test('multiple params', t => {
	t.deepEqual( parseParams(inputTest), sampleParams)
});

test('CURRENT multiple params', t => {
	t.deepEqual( parseParams(sampleScript2), sampleParams)
});


test('line comment', t => {
	t.deepEqual( parseComment('// Width '), {caption:'Width'})
});

test('block comment', t => {
	t.deepEqual( parseComment('/* Width */'), {caption:'Width'})
});

test('comment with data', t => {
 	t.deepEqual( parseComment('/* Password {type:"password"}*/'), {caption:'Password', options:{type:'password'}})
});


test('param without init value', t => {
	t.deepEqual( parseDef('width'), {name:'width', type:'text'})
});

test('param int', t => {
	t.deepEqual( parseDef('age=1,'), {name:'age', type:'int', initial:1})
});

test('param float', t => {
	t.deepEqual( parseDef('angle=1.0,'), {name:'angle', type:'number', initial:1})
});

test('proeprty float', t => {
	t.deepEqual( parseDef('angle:1.0,'), {name:'angle', type:'number', initial:1})
});

test('param checkbox', t => {
	t.deepEqual( parseDef('bigorsmall=true,'), {name:'bigorsmall', type:'checkbox', checked:true})
	t.deepEqual( parseDef('bigorsmall=false,'), {name:'bigorsmall', type:'checkbox', checked:false})
});

test('param text', t => {
	t.deepEqual( parseDef('name,'), {name:'name', type:'text'})
});


function testBothDir(t,line1, line2,def){
	t.deepEqual(parseOne(line1, line2),def)
}

test('param checkbox with initial value', t => {
	testBothDir(t,
			'// Big? {type:"checkbox"}',
			'bigorsmall=20,',
		{name: 'bigorsmall', type: 'checkbox', checked: true, initial: 20, caption: 'Big?'}
	)
});

test('param color', t => {
	testBothDir(t,
			'// Color? {type:"color"}',
			'color=\'#FFB431\'',
		{ name: 'color', type: 'color', initial: '#FFB431', caption: 'Color?' }
	)
});

test('param date', t => {
	testBothDir(t,
			'// Birthday? {type:"date"}',
			'birthday',
		{name: 'birthday', type: 'date', caption: 'Birthday?'}
	)
});

test('param email', t => {
	testBothDir(t,
			'// Email Address? {type:"email"}',
			'address',
		{name: 'address', type: 'email', caption: 'Email Address?'}
	)
});

test('param password', t => {
	testBothDir(t,
			'// Secret? {type:"password"}',
			'password',
		{name: 'password', type: 'password', caption: 'Secret?'}
	)
});

test('param slider', t => {
	testBothDir(t,
			'// How many? {type:"slider", min:2, max:10}',
			'count',
		{name: 'count', type: 'slider', min: 2, max: 10, caption: 'How many?'}
	)
});

test('param url', t => {
	testBothDir(t,
			'// Web page URL? {type:"url"}',
			'webpage',
		{name: 'webpage', type: 'url', caption: 'Web page URL?'}
	)
});

test('param choice', t => {
	testBothDir(t,
			`// Rounded edges {type:'choice', values: [0, 1], captions: ['No', 'Yes (slow!)']}`,
			'rounded=0',
		{ name: 'rounded', type: 'choice', caption: 'Rounded edges', values: [0, 1], captions: ['No', 'Yes (slow!)'], initial: 0 }
	)
});


/*

DONE (extracted from var name and initial value)
int	{name: 'age', type: 'int', initial: 20, caption: 'Age?'}	integer value
number	{name: 'angle', type: 'number', initial: 2.5, step: 0.5, caption: 'Angle?'}	float value
float	{name: 'angle', type: 'number', initial: 2.5, step: 0.5, caption: 'Angle?'}	float value
checkbox	{name: 'bigorsmall', type: 'checkbox', checked: true, caption: 'Big?'}	if checked true, else false
text	{name: 'name', type: 'text', caption: 'Name?'}	string value

DONE (but need data in comment)
checkbox	{name: 'bigorsmall', type: 'checkbox', checked: true, initial: 20, caption: 'Big?'}	if checked 20, else false
color	{ name: 'color', type: 'color', initial: '#FFB431', caption: 'Color?' }	“#rrggbb”, use html2rgb() to convert
date	{name: 'birthday', type: 'date', caption: 'Birthday?'}	“YYYY-MM-DD”
email	{name: 'address', type: 'email', caption: 'Email Address?'}	string value
password	{name: 'password', type: 'password', caption: 'Secret?'}	string value
slider	{name: 'count', type: 'slider', min: 2, max: 10, caption: 'How many?'}	float value
url	{name: 'webpage', type: 'url', caption: 'Web page URL?'}	string value
choice { name: 'rounded', type: 'choice', caption: 'Rounded edges', values: [0, 1], captions: ['No', 'Yes (slow!)'], initial: 0 }

TODO
group	{ name: 'balloon', type: 'group', caption: 'Balloons' }	none, only displayed

*/
