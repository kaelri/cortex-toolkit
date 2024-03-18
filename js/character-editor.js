Vue.component('characterEditor', {

	props: {
		character: Object,
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
			return this.character.traitSets[s] ?? null;

		},

		selectedTrait() {

			if ( this.selectedTraitSetID === null || this.selectedTraitID === null ) {
				return null;
			}

			let s = this.selectedTraitSetID;
			let t = this.selectedTraitID;
			return this.character.traitSets[s].traits[t] ?? null;

		},

		name: {
			get() {
				return this.character.name;
			},
			set( name ) {
				this.setCharacterProperty( 'name', name );
			}
		},
		
		description: {
			get() {
				return this.character.description;
			},
			set( description ) {
				this.setCharacterProperty( 'description', description );
			}
		},

	},

	/*html*/
	template: `<section class="character-editor">

		<nav class="breadcrumbs">
			<ul>

				<!-- HOME -->
				<li v-text="title" @click.prevent="clearSelected"></li>

				<!-- NAME & DESCRIPTION -->
				<li v-if="selectedType === 'name'">Name &amp; Description</li>

				<!-- PORTRAIT -->
				<li v-if="selectedType === 'portrait'">Portrait</li>

				<!-- TRAIT SET -->
				<li v-if="selectedType === 'traitSet'" v-text="selectedTraitSet.name"></li>

				<!-- TRAIT -->
				<li v-if="selectedType === 'trait'" v-text="selectedTraitSet.name" @click.prevent="select([ 'traitSet', selectedTraitSetID ])"></li>
				<li v-if="selectedType === 'trait'" v-text="selectedTrait.name"></li>
			</ul>
		</nav>

		<div class="editor-groups">

			<!-- NAME & DESCRIPTION -->
			<section :class="{ 'editor-group': true, 'open': selectedType === 'name', 'no-scroll': true }">

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
		
			<!-- TRAIT SETS -->
			<trait-set-editor
				v-for="(traitSet, traitSetID) in character.traitSets"
				:key="traitSetID"
				:selected="selected"
				:character="character"
				:traitSetID="traitSetID"
				@update="update"
				@removeTraitSet="removeTraitSet"
			></trait-set-editor>

			<!-- TRAITS -->
			<trait-editor
				v-for="item in allTraits"
				:key="item.traitSetID + '-' + item.traitID"
				:selected="selected"
				:character="character"
				:traitSetID="item.traitSetID"
				:traitID="item.traitID"
				@update="update"
				@removeTrait="removeTrait"
			></trait-editor>

		</div>
	
	</section>`,

	watch: {},

	methods: {

		isSelected( selector ) {
			return cortexFunctions.arraysMatch( this.selected, selector );
		},

		clearSelected() {
			this.$emit('select', []);
		},

		select( selector ) {
			this.$emit('select', selector);
		},

		setCharacterProperty( key, value ) {
			let character = structuredClone( this.character );
			character[ key ] = value;
			this.update( character );
		},

		addTraitSet( location ) {

			let character = structuredClone( this.character );

			character.traitSets.push({
				name: 'New trait set',
				description: 'Trait set description',
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

			let newTraitSetID = character.traitSets.length - 1;
			this.$emit('select', [ 'traitSet', traitSetID ]);

		},

		removeTraitSet( traitSetID ) {

			if ( this.isSelected(['traitSet', traitSetID]) ) {
				this.clearSelected();
			}

			let character = structuredClone( this.character );

			character.traitSets.splice(traitSetID, 1);

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
			
			let newTraitID = character.traitSets[traitSetID].traits.length - 1;
			this.$emit('select', [ 'trait', traitSetID, newTraitID ]);

		},

		removeTrait( traitSetID, traitID ) {

			// If we’re removing the trait that is currently selected, switch to the previous trait, or the parent trait set if no other traits remain.
			if ( this.isSelected(['trait', traitSetID, traitID]) ) {
				if ( this.character.traitSets[traitSetID].traits.length > 1) {
					this.select([ 'trait', traitSetID, traitID - 1 ]);
				} else {
					this.select( 'traitSet', traitSetID );
				}
			}

			let character = structuredClone( this.character );

			character.traitSets[traitSetID].traits.splice(traitID, 1);

			this.update( character );

		},

		update( character ) {
			this.$emit( 'update', character );
		},
		
	}

});
