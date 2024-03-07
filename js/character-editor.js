Vue.component('characterEditor', {

	props: {
		character: Object,
		editable:  Boolean,
		selected:  Array
	},

	data: function() {
		let data = structuredClone(this.character);
		return data;
	},

	computed: {

	},

	/*html*/
	template: `<section class="character-editor">
	
	</section>`,

	methods: {

		editContent( event, location ) {
			let content = event.target.innerHTML;

			switch ( location[0] ) {
				case 'name':
					this.name = this.sanitizeString(content);
					break;
				case 'description':
					this.description = this.sanitizeString(content);
					break;
				case 'traitSet':
					let s = location[1];
					let traitSet = this.traitSets[s];
					switch ( location[2] ) {
						case 'name':
							traitSet.name = this.sanitizeString(content);
							break;
						case 'trait':
							let t = location[3];
							let trait = traitSet.traits[t];
							switch ( location[4] ) {
								case 'name':
									trait.name = this.sanitizeString(content);
									break;
								case 'value':
									trait.value = Number(content);
									break;
								case 'description':
									trait.description = this.sanitizeString(content);
									break;
								case 'sfx':
									let f = location[3];
									switch ( location[4] ) {
										case 'name':
											trait.sfx[f].name = this.sanitizeString(content);
											break;
										case 'description':
											trait.sfx[f].description = this.sanitizeString(content);
											break;
										default: break;
									}
								default: break;
							}
							traitSet.traits[t] = trait;
							break;
						default: break;
					}
					this.$set(this.traitSets, s, traitSet);
					break;
				default:
					break;
			}

			this.export();

		},

		sanitizeString( value ) {

			value = String(value).trim();

			return value;

		},

		addTraitSet( location ) {

			this.traitSets.push({
				name: 'New trait group',
				style: 'default',
				location: location ?? 'left',
				traits: [
					{
						name: 'New trait',
						value: 6,
						description: 'Trait description',
						location: 'left',
					}
				],
			});

			this.export();

		},

		removeSet( traitSetID ) {

			this.traitSets.splice( traitSetID, 1 );

			this.export();

		},
		
		addTrait( traitSetID, location ) {

			let traitSet = this.traitSets[traitSetID];

			traitSet.traits.push({
				name: 'New trait',
				value: 6,
				description: 'Trait description',
				location: location ?? 'left'
			});

			this.$set(this.traitSets, traitSetID, traitSet);

			this.export();

		},
		
		removeTrait( traitSetID, traitID ) {

			let traitSet = this.traitSets[traitSetID];

			traitSet.traits.splice(traitID, 1);

			this.$set(this.traitSets, traitSetID, traitSet);

			this.export();

		},

		export() {

			let character = {
				name:         this.name,
				description:  this.description,
				traitSets:    this.traitSets,
				portrait:     this.portrait,
			}

			this.$emit('edited', character);

		},
		
	}

});
