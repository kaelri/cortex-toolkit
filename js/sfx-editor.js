Vue.component('sfxEditor', {

	props: {
		character:  Object,
		selected:   Array,
		traitSetID: Number,
		traitID:    Number,
		effectID:   Number,
	},

	data() {
		return {}
	},

	computed: {

		effect() {
			let s = this.traitSetID;
			let t = this.traitID;
			let f = this.effectID;
			return this.character.traitSets[s].traits[t].sfx[f];
		},

		selector() {
			return [ 'sfx', this.traitSetID, this.traitID, this.effectID ];
		},

		name: {
			get() {
				return this.effect.name;
			},
			set( name ) {
				this.setEffectProperty( 'name', name );
			}
		},

		description: {
			get() {
				return this.effect.description;
			},
			set( description ) {
				this.setEffectProperty( 'description', description );
			}
		},

	},

	/*html*/
	template: `<section class="editor-subgroup">
	
		<div class="editor-fields">

			<div class="editor-field">
				<label>SFX Name</label>
				<input type="text" v-model="name">
			</div>

			<div class="editor-field">
				<label>SFX Description</label>
				<textarea v-model="description"></textarea>
			</div>

		</div>

	</section>`,

	methods: {

		setEffectProperty( key, value ) {

			let character = structuredClone( this.character );
			let s = this.traitSetID;
			let t = this.traitID;
			let f = this.effectID;

			character.traitSets[s].traits[t].sfx[f][ key ] = value;

			this.update( character );

		},

		update( character ) {
			this.$emit( 'update', character );
		},

	}

});
