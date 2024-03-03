document.addEventListener('DOMContentLoaded', () => {

	new Vue({

		name: 'cortex-tools',

		el: '#cortex-tools',

		data: {
			character: null,
		},

		computed: {

		},

		/*html*/
		template: `<cortex-character-sheet
			v-if="character"
			:character="character"
			@edited="setCharacter"
		></cortex-character-sheet>`,

		mounted() {

			this.loadLocal();

		},

		methods: {

			createDefaultCharacter() {
				return {
					name: 'NAME',
					description: 'Description',
					distinctions: [
						{
							name: 'Distinction 1',
							value: 8,
							description: 'Trait description',
							sfx: [
								{
									name: 'Hinder',
									description: 'Gain a PP when you switch out this distinction’s d8 for a d4.',
								}
							]
						},
						{
							name: 'Distinction 2',
							value: 8,
							description: 'Trait description',
							sfx: [
								{
									name: 'Hinder',
									description: 'Gain a PP when you switch out this distinction’s d8 for a d4.',
								}
							]
						},
						{
							name: 'Distinction 3',
							value: 8,
							description: 'Trait description',
							sfx: [
								{
									name: 'Hinder',
									description: 'Gain a PP when you switch out this distinction’s d8 for a d4.',
								}
							]
						}
					],
					attributes: [
						{
							name: 'Attribute 1',
							value: 8,
							description: 'Trait description.'
						},
						{
							name: 'Attribute 2',
							value: 8,
							description: 'Trait description.'
						},
						{
							name: 'Attribute 3',
							value: 8,
							description: 'Trait description.'
						}
					],
					sets: [
						{
							name: 'New Trait Group',
							style: 'default',
							page: 1,
							column: 1,
							traits: [
								{
									name: 'New trait',
									value: 6,
									description: 'Trait description',
									column: 1,
								},
								{
									name: 'New trait',
									value: 6,
									description: 'Trait description',
									column: 1,
								},
								{
									name: 'New trait',
									value: 6,
									description: 'Trait description',
									column: 1,
								}
							]
						},
						{
							name: 'New Trait Group',
							style: 'values',
							page: 1,
							column: 1,
							traits: [
								{
									name: 'New trait',
									value: 6,
									description: 'Trait description',
									column: 1,
								},
								{
									name: 'New trait',
									value: 6,
									description: 'Trait description',
									column: 1,
								},
								{
									name: 'New trait',
									value: 6,
									description: 'Trait description',
									column: 1,
								},
								{
									name: 'New trait',
									value: 6,
									description: 'Trait description',
									column: 2,
								},
								{
									name: 'New trait',
									value: 6,
									description: 'Trait description',
									column: 2,
								}
							]
						},
						{
							name: 'New Trait Group',
							style: 'signature-asset',
							page: 1,
							column: 2,
							traits: [
								{
									name: 'New trait',
									value: 6,
									description: 'Trait description',
									column: 1,
								},
								{
									name: 'New trait',
									value: 6,
									description: 'Trait description',
									column: 1,
								},
								{
									name: 'New trait',
									value: 6,
									description: 'Trait description',
									column: 1,
								}
							]
						}
					],
					image: {
						value: '',
						x: 0,
						y: 0,
						zoom: 1
					},
				}
			},

			setCharacter( character ) {
				this.character = character;
				this.saveLocal();
			},

			loadLocal() {

				let character = null;

				let localJSON = localStorage.getItem('cortexCS');
				if ( localJSON && localJSON.length ) {

					let localData = JSON.parse(localJSON);
					if ( localData ) {
						character = localData.character;
					}
	
				}

				if ( !character ) {
					character = this.createDefaultCharacter();
				}

				this.character = character;

			},

			saveLocal() {
				localStorage.setItem('cortexCS', JSON.stringify({
					character: this.character,
				}));
			},

		}

	});

});
