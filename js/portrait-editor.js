Vue.component('portraitEditor', {

	props: {
		character: Object,
		open:      Boolean
	},

	data() {
		return {}
	},

	computed: {

		hasImage() {
			return Boolean( this.character.portrait.url.length );
		}

	},

	/*html*/
	template: `<aside :class="{ 'editor': true, 'editor-character': true, 'open': open, 'scrollable': false }">

		<div class="editor-arrow"></div>

		<div class="editor-controls">
			<button @click.stop="select([])"><i class="fas fa-times"></i></button>
			<button v-if="hasImage" class="editor-delete" @click.stop="setImageURL('')"><i class="fas fa-trash"></i></button>
		</div>

		<div class="editor-inner">

			<div class="editor-fields">

				<div class="editor-field">

					<label>Portrait</label>

					<img class="portrait-preview"
						v-if="hasImage"
						:src="character?.portrait?.url"
						@click.prevent="uploadStart"
					>

					<button
						class="editor-button"
						@click.prevent="uploadStart"
					><i class="fas fa-plus"></i> Upload {{ hasImage ? 'New' : '' }} Image</button>

					<input class="portrait-input" type="file" ref="inputFile" @change="uploadProcess">

				</div>

			</div>

		</div>
	</aside>`,

	methods: {

		select( selector ) {
			this.$emit( 'select', selector );
		},

		uploadStart() {
			this.$refs.inputFile.click();
		},

		setImageURL( url ) {
			let character = structuredClone( this.character );
			character.portrait.url = url;
			this.update( character );
		},

		uploadProcess( event ) {

			if ( !event.target.files || !event.target.files.length ) {
				this.setImageURL( '' );
				return;
			}
			
			let file = event.target.files[0];

			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
			  this.setImageURL( reader.result );
			};
			reader.onerror = (error) => {
			  console.log('Portrait error: ', error);
			};

		},

		update( character ) {
			this.$emit( 'update', character );
		}

	}

});
