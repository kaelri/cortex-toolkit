window.cortexFunctions = {

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
		"$schema": "https://cortex.engard.me/data/cortex_character_schema.json",
		"version": 0,
		"id": null,
		"dateCreated": 0,
		"dateModified": 0,
		"dateTouched": 0,
		"name": "Name",
		"description": "Description",
		"pronouns": "",
		"traitSets": [
			{
				"name": "Distinctions",
				"description": "Trait set description",
				"features": [ 'description', 'sfx' ],
				"style": "distinctions",
				"location": "left",
				"noun": "Distinction",
				"traits": [
					{
						"name": "Distinction 1",
						"value": 8,
						"description": "Trait description",
						"hinder": true,
						"sfx": [],
						"subtraits": [],
					},
					{
						"name": "Distinction 2",
						"value": 8,
						"description": "Trait description",
						"hinder": true,
						"sfx": [],
						"subtraits": [],
					},
					{
						"name": "Distinction 3",
						"value": 8,
						"description": "Trait description",
						"hinder": true,
						"sfx": [],
						"subtraits": [],
					}
				],
				"sfx": []
			},
			{
				"name": "Attributes",
				"description": "Trait set description",
				"features": [],
				"style": "default",
				"location": "attributes",
				"noun": "Attribute",
				"traits": [
					{
						"name": "Attribute 1",
						"value": 8,
						"description": "Trait description",
						"sfx": [],
						"subtraits": [],
					}
				],
				"sfx": []
			},
			{
				"name": "New trait set",
				"description": "Trait set description",
				"features": [],
				"style": "default",
				"location": "left",
				"noun": "",
				"traits": [
					{
						"name": "New trait",
						"value": 6,
						"description": "Trait description",
						"sfx": [],
						"subtraits": [],
					}
				],
				"sfx": []
			}
		],
		"portrait": {
			"url": "",
			"alignment": "center"
		}	
	},
	
	defaultTraitSet: {
		name: 'New trait set',
		description: 'Trait set description',
		noun: '',
		features: [],
		style: 'default',
		location: location ?? 'left',
		traits: [],
	},
	
	defaultTrait: {
		name: 'New trait',
		value: 6,
		description: 'Trait description',
		subtraits: [],
		sfx: []
	},
	
	defaultSFX: {
		name: 'New SFX',
		description: 'SFX description',
	},
	
}
