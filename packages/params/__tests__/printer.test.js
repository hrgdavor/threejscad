'use strict';
const test = require('ava');

const sampleParams = [
  {name:'width',caption:'Width', type:'int', initial:145},
  {name:'height',caption:'height', type:'int', initial:100},

{name:'group1',caption:'Wall thickness', type:'group'},
  {name:'thickOut',caption:'Vertical outside', type:'number', initial:0.8},
  { name: 'rounded', type: 'choice', caption: 'Rounded edges', values: [0, 1], captions: ['No', 'Yes (slow!)'], initial: 0 },
]

const sampleScript = `function main({
  // Width
  width=145,
  height=100,

// Wall thickness :group1
  // Vertical outside
  thickOut=0.8,
  // Rounded edges {type:'choice', values: [0, 1], captions: ['No', 'Yes (slow!)']}
  'rounded=0',
}){`


test('CURRENT xxx', t => {
	t.deepEqual( 1,1)
});

