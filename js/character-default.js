const cortexCharacterDefault = {
	"$schema": "https://cortex.engard.me/data/cortex_character_schema.json",
	"version": 0,
	"id": null,
	"created": 0,
	"modified": 0,
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
			]
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
			]
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
			]
		}
	],
	"portrait": {
		"url": "",
		"alignment": "center"
	}	
}
