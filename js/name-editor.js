Vue.component('nameEditor', {

	props: {
		character: Object,
		open: Boolean
	},

	data() {
		return {}
	},

	computed: {

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
	template: `<aside :class="{ 'editor': true, 'editor-character': true, 'open': open, 'scrollable': false }">

		<div class="editor-arrow"></div>

		<div class="editor-controls">
			<button @click.stop="select([])"><i class="fas fa-times"></i></button>
		</div>

		<div class="editor-inner">

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

		</div>
	</aside>`,

	watch: {
		open( isOpen, wasOpen ) {
			if ( isOpen && !wasOpen ) {
				this.$refs.inputName.focus();
			}
		}
	},

	methods: {

		select( selector ) {
			this.$emit( 'select', selector );
		},

		setCharacterProperty( key, value ) {
			let character = structuredClone( this.character );
			character[ key ] = value;
			this.update( character );
		},

		update( character ) {
			this.$emit( 'update', character );
		}

	}

});
