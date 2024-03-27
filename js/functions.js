const cortexFunctions = {

	arraysMatch: function( a, b ) {
		if ( !Array.isArray(a) || !Array.isArray(b) ) return false;
		if ( a.length !== b.length ) return false;
		for (let i = 0; i < a.length; i++) {
			if ( a[i] !== b[i] ) return false;
		}
		return true;
	},

	getDieDisplayValue: function( dieValue ) {
		switch ( dieValue ) {
			case 4:  return '4';
			case 6:  return '6';
			case 8:  return '8';
			case 10: return '0';
			case 12: return '2';
			default: return '';
		}
	},

	renderDate( timestamp ) {
		let date = new Date( timestamp );
		return date.toLocaleString();
	},

	defaultCharacter: {
		'$schema': 'https://cortex.engard.me/schema/0.1/character.schema.json',
		'version': '0.1',
		'id': '',
		'dateCreated': '',
		'dateModified': '',
		'dateTouched': '',
		'name': 'Name',
		'game': '',
		'description': 'Description',
		'pronouns': '',
		'traitSets': [
			{
				'name': 'Distinctions',
				'description': 'Trait set description',
				'nounSingular': 'Distinction',
				'nounPlural': 'Distinctions',
				'traits': [
					{
						'name': 'Distinction 1',
						'value': 8,
						'description': 'Trait description',
						'traits': [],
						'sfx': [ 'hinder' ],
						'tags': [],
						'custom': {},
					},
					{
						'name': 'Distinction 2',
						'value': 8,
						'description': 'Trait description',
						'traits': [],
						'sfx': [ 'hinder' ],
						'tags': [],
						'custom': {},
					},
					{
						'name': 'Distinction 3',
						'value': 8,
						'description': 'Trait description',
						'traits': [],
						'sfx': [ 'hinder' ],
						'tags': [],
						'custom': {},
					}
				],
				'sfx': [],
				'tags': [],
				'custom': {
					'cortexToolkit': {
						'features': {
							'description': true,
							'sfx': true,
							'subtraits': false
						},
						'location': 'left',
						'style': {
							'header': 'distinctions',
							'body': 'distinctions',
						}
					}
				},
			},
			{
				'name': 'Attributes',
				'description': '',
				'nounSingular': 'Attribute',
				'nounPlural': 'Attributes',
				'traits': [
					{
						'name': 'Attribute 1',
						'value': 8,
						'description': 'Trait description',
						'traits': [],
						'sfx': [],
						'tags': [],
						'custom': {},
					}
				],
				'sfx': [],
				'tags': [],
				'custom': {
					'cortexToolkit': {
						'features': {
							'description': false,
							'sfx': false,
							'subtraits': false
						},
						'location': 'attributes',
						'style': {
							'header': 'attributes',
							'body': 'attributes',
						}
					}
				},
			},
			{
				'name': 'New trait set',
				'description': 'Trait set description',
				'nounSingular': '',
				'nounPlural': '',
				'traits': [
					{
						'name': 'New trait',
						'value': 6,
						'description': 'Trait description',
						'traits': [],
						'sfx': [],
						'tags': [],
						'custom': {},
					}
				],
				'sfx': [],
				'tags': [],
				'custom': {
					'cortexToolkit': {
						'features': {
							'description': false,
							'sfx': false,
							'subtraits': false
						},
						'location': 'left',
						'style': {
							'header': 'default',
							'body': 'default',
						}
					}
				},
			}
		],
		'portrait': {
			'url': '',
			'alt': '',
			'tags': [],
			'custom': {
				'cortexToolkit': {
					'alignment': 'top-center'
				}
			}
		},
		'plotPoints': 0,
		'notes': '',
		'tags': [],
		'custom': {
			'cortexToolkit': {
				'style': {
					'hasAttributes': true,
				}
			}
		}
	},
	
	defaultTraitSet: {
		name: 'New trait set',
		description: 'Trait set description',
		nounSingular: '',
		nounPlural: '',
		traits: [],
		sfx: [],
		tags: [],
		custom: {
			'cortexToolkit': {
				features: {
					description: false,
					sfx: false,
					subtraits: false
				},
				location: 'left',
				style: {
					header: 'default',
					body: 'default',
				}
			}
		}
	},
	
	defaultTrait: {
		name: 'New trait',
		value: 6,
		description: 'Trait description',
		traits: [],
		sfx: [],
		tags: [],
		custom: {}
	},
	
	defaultSFX: {
		name: 'New SFX',
		description: 'SFX description',
		tags: [],
		custom: {}
	},
	
}
