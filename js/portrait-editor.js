const PortraitEditor = {

	props: {
		character: Object,
		open:      Boolean,
	},

	data() {
		return {}
	},

	computed: {

		hasImage() {
			return Boolean( this.character.portrait.url.length );
		},

		alignment: {
			get() {
				return this.character.portrait.alignment;
			},
			set( value ) {
				this.setAlignment( value );
			}
		},

	},

	/*html*/
	template: `<aside :class="{ 'editor': true, 'editor-portrait': true, 'open': open, 'scrollable': false, 'anchor-position-top': true }" @click.stop="">

		<div class="editor-arrow"></div>

		<div class="editor-controls">
			<button @click.stop="selectElement([])"><i class="fas fa-times"></i></button>
			<button v-if="hasImage" class="editor-delete" @click.stop="setImageURL('')"><i class="fas fa-trash"></i></button>
		</div>

		<div class="editor-inner">
			<div>

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

					<div class="editor-field" v-if="hasImage">

						<label>Alignment</label>

						<div class="editor-portrait-alignment">
							<div @click.stop="setAlignment('top-left')"      :class="{'active': alignment === 'top-left' }"></div>
							<div @click.stop="setAlignment('top-center')"    :class="{'active': alignment === 'top-center' }"></div>
							<div @click.stop="setAlignment('top-right')"     :class="{'active': alignment === 'top-right' }"></div>
							<div @click.stop="setAlignment('center-left')"   :class="{'active': alignment === 'center-left' }"></div>
							<div @click.stop="setAlignment('center')"        :class="{'active': alignment === 'center' }"></div>
							<div @click.stop="setAlignment('center-right')"  :class="{'active': alignment === 'center-right' }"></div>
							<div @click.stop="setAlignment('bottom-left')"   :class="{'active': alignment === 'bottom-left' }"></div>
							<div @click.stop="setAlignment('bottom-center')" :class="{'active': alignment === 'bottom-center' }"></div>
							<div @click.stop="setAlignment('bottom-right')"  :class="{'active': alignment === 'bottom-right' }"></div>
						</div>

					</div>

				</div>
				
			</div>
		</div>

	</aside>`,

	methods: {

		selectElement( selector ) {
			this.$emit( 'selectElement', selector );
		},

		uploadStart() {
			this.$refs.inputFile.click();
		},

		setImageURL( url ) {
			let character = this.character;
			character.portrait.url = url;
			this.update( character );
		},

		setAlignment( alignment ) {
			let character = this.character;
			character.portrait.alignment = alignment;
			this.update( character );
		},

		uploadProcess( event ) {

			if ( !event.target.files || !event.target.files.length ) {
				this.setImageURL( '' );
				this.setAlignment( 'center' );
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

}
