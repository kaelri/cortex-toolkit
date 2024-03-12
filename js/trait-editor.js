Vue.component('traitEditor', {

	props: {
		character:  Object,
		selected:   Array,
		traitSetID: Number,
		traitID:    Number,
	},

	data() {
		return {}
	},

	computed: {

		trait() {
			let s = this.traitSetID;
			let t = this.traitID;
			return this.character.traitSets[s].traits[t];
		},

		selector() {
			return [ 'trait', this.traitSetID, this.traitID ];
		},

		active() {
			return cortexFunctions.arraysMatch( this.selected, this.selector );
		},

		name: {
			get() {
				return this.trait.name;
			},
			set( name ) {

				let character = structuredClone( this.character );
				let s = this.traitSetID;
				let t = this.traitID;

				character.traitSets[s].traits[t].name = name;

				this.update( character );

			}
		},

		value: {
			get() {
				return this.trait.value;
			},
			set( value ) {

				let character = structuredClone( this.character );
				let s = this.traitSetID;
				let t = this.traitID;

				character.traitSets[s].traits[t].value = value;

				this.update( character );
				
			}
		},

		description: {
			get() {
				return this.trait.description;
			},
			set( description ) {
				
				let character = structuredClone( this.character );
				let s = this.traitSetID;
				let t = this.traitID;

				character.traitSets[s].traits[t].description = description;

				this.update( character );
				
			}
		},

	},

	/*html*/
	template: `<section :class="{ 'editor-group': true, 'open': active }">
	
		<div class="editor-fields">

			<div class="editor-field">
				<label>Trait Name</label>
				<input type="text" v-model="name">
			</div>

			<div class="editor-field">
				<label>Description</label>
				<textarea v-model="description"></textarea>
			</div>

		</div>

	</section>`,

	methods: {

		update( character ) {
			this.$emit( 'update', character );
		},

	}

});
