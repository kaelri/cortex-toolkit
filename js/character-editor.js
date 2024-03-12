Vue.component('characterEditor', {

	props: {
		character: Object,
		editable:  Boolean,
		selected:  Array
	},

	data() {
		return {}
	},

	computed: {

		title() {
			return this.character?.name ?? 'Player Character';
		},

		// Flattened list of all traits. Makes repeaters easier.
		allTraits() {

			let allTraits = [];

			if ( !this.character ) return allTraits;

			for ( let s = 0; s < this.character.traitSets.length; s++ ) {
				const traitSet = this.character.traitSets[s];

				for ( let t = 0; t < traitSet.traits.length; t++ ) {
					const trait = traitSet.traits[t];

					allTraits.push({
						traitSetID: s,
						traitID:    t,
					});

				}

			}

			return allTraits;

		},

		selectedType() {

			if (
				!Array.isArray(this.selected)
				||
				this.selected.length < 1
			) {
				return null;
			}

			return this.selected[0];

		},

		selectedTraitSetID() {

			if ( [ 'trait', 'traitSet' ].includes( this.selectedType ) ) {
				return this.selected[1];
			}

			return null; // default

		},

		selectedTraitID() {

			if ( this.selectedType === 'trait' ) {
				return this.selected[2];
			}

			return null; // default

		},

		selectedTraitSet() {

			if ( this.selectedTraitSetID === null ) {
				return null;
			}

			let s = this.selectedTraitSetID;
			return this.character.traitSets[s];

		},

		selectedTrait() {

			if ( this.selectedTraitSetID === null || this.selectedTraitID === null ) {
				return null;
			}

			let s = this.selectedTraitSetID;
			let t = this.selectedTraitID;
			return this.character.traitSets[s].traits[t];

		},

		name: {
			get() {
				return this.character.name;
			},
			set( name ) {
				let character = structuredClone( this.character );
				character.name = name;
				this.update( character );
			}
		},
		
		description: {
			get() {
				return this.character.description;
			},
			set( description ) {
				let character = structuredClone( this.character );
				character.description = description;
				this.update( character );
			}
		},

	},

	/*html*/
	template: `<section class="character-editor">

		<nav class="breadcrumbs">
			<ul>
				<li v-text="title" @click.prevent="clearSelected"></li>
				<li v-if="selectedType === 'name'">Name &amp; Description</li>
				<li v-if="selectedType === 'portrait'">Portrait</li>
				<li v-if="selectedType === 'traitSet' || selectedType === 'trait'" v-text="selectedTraitSet.name"></li>
				<li v-if="selectedType === 'trait'" v-text="selectedTrait.name"></li>
			</ul>
		</nav>

		<div class="editor-groups">

			<!-- NAME & DESCRIPTION -->
			<section :class="{ 'editor-group': true, 'open': selectedType === 'name' }">

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
		
			<!-- TRAITS -->
			<trait-editor
				v-for="item in allTraits"
				:key="item.traitSetID + '-' + item.traitID"
				:selected="selected"
				:character="character"
				:traitSetID="item.traitSetID"
				:traitID="item.traitID"
				@update="update"
			></trait-editor>

		</div>
	
	</section>`,

	watch: {},

	methods: {

		clearSelected() {
			this.$emit('select', []);
		},

		addTraitSet( location ) {

			let character = structuredClone( this.character );

			character.traitSets.push({
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

			this.update( character );

		},

		removeSet( traitSetID ) {

			let character = structuredClone( this.character );

			character.traitSets.splice( traitSetID, 1 );

			this.update( character );

		},
		
		addTrait( traitSetID, location ) {

			let character = structuredClone( this.character );

			character.traitSets[traitSetID].traits.push({
				name: 'New trait',
				value: 6,
				description: 'Trait description',
				location: location ?? 'left'
			});

			this.update( character );

		},

		removeTrait( traitSetID, traitID ) {

			let character = structuredClone( this.character );

			character.traitSets[traitSetID].traits.splice(traitID, 1);

			this.update( character );

		},

		update( character ) {
			this.$emit( 'update', character );
		},
		
	}

});
