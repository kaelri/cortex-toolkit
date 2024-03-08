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

		title() {
			return this.name ?? 'Character';
		},

		selectedName() {
			return cortexFunctions.arraysMatch( this.selected, ['name'] );
		},

		selectedTraitSetID() {

			if (
				this.selected
				&& 
				this.selected.length >= 2
				&&
				[ 'trait', 'traitSet' ].includes( this.selected[0] )
			) {
				return this.selected[1];
			}

			return null; // default

		},

		selectedTraitID() {
			if (
				this.selected
				&& 
				this.selected.length >= 3
				&&
				this.selected[0] === 'trait'
			) {
				return this.selected[2];
			}

			return null; // default

		},

		selectedTrait() {

				if (
					this.selectedTraitSetID !== null
					||
					this.selectedTraitID !== null
				) {
					return this.traitSets[ this.selectedTraitSetID ].traits[ this.selectedTraitID ];
				};
	
				return null; // default
	
		},

		selectedTraitName: {
			get() {
				return this.selectedTrait?.name;
			},
			set( content ) {
				this.editContent( content, [ 'traitSet', this.selectedTraitSetID, 'trait', this.selectedTraitID, 'name' ] );
			}
		},

		selectedTraitDescription: {
			get() {
				return this.selectedTrait?.description;
			},
			set( content ) {
				this.editContent( content, [ 'traitSet', this.selectedTraitSetID, 'trait', this.selectedTraitID, 'description' ] );
			}
		},

		// Replace with: computed list of all traits, inc. reference to trait set, and <trait-editor> module

	},

	/*html*/
	template: `<section class="character-editor">

		<nav class="breadcrumbs">
			<ul>
				<li v-text="title" @click.prevent="clearSelected"></li>
				<li v-if="selectedName">Name &amp; Description</li>
				<li v-if="selectedTrait" v-text="selectedTrait.name"></li>
			</ul>
		</nav>

		<!-- NAME & DESCRIPTION -->
		<section :class="{ 'editor-group': true, 'open': selectedName }">

			<div class="editor-fields">

				<div class="editor-field">
					<label>Character Name</label>
					<input type="text" v-model="name" ref="inputName">
				</div>

				<div class="editor-field">
					<label>Description</label>
					<textarea v-model="description"></textarea>
				</div>

			</div>

		</section>
	
		<!-- TRAIT -->
		<section :class="{ 'editor-group': true, 'open': selectedTrait !== null }">

			<div class="editor-fields" v-if="selectedTrait">

				<div class="editor-field">
					<label>Trait Name</label>
					<input type="text" v-model="selectedTraitName">
				</div>

				<div class="editor-field">
					<label>Description</label>
					<textarea v-model="selectedTraitDescription"></textarea>
				</div>

			</div>

		</section>
	
	</section>`,

	watch: {

		name() {
			this.export();
		},

		description() {
			this.export();
		},

	},

	methods: {

		clearSelected() {
			this.$emit('select', []);
		},

		editContent( content, location ) {

			switch ( location[0] ) {
				case 'name':
					this.name = String(content);
					break;
				case 'description':
					this.description = String(content);
					break;
				case 'traitSet':
					let s = location[1];
					let traitSet = this.traitSets[s];
					switch ( location[2] ) {
						case 'name':
							traitSet.name = String(content);
							break;
						case 'trait':
							let t = location[3];
							let trait = traitSet.traits[t];
							switch ( location[4] ) {
								case 'name':
									trait.name = String(content);
									break;
								case 'value':
									trait.value = Number(content);
									break;
								case 'description':
									trait.description = String(content);
									break;
								case 'sfx':
									let f = location[3];
									switch ( location[4] ) {
										case 'name':
											trait.sfx[f].name = String(content);
											break;
										case 'description':
											trait.sfx[f].description = String(content);
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
				id:           this.id,
				modified:     this.modified,
				name:         this.name,
				description:  this.description,
				traitSets:    this.traitSets,
				portrait:     this.portrait,
			}

			this.$emit('edited', character);

		},
		
	}

});
