const TraitSetEditor = {

	props: {
		character:  Object,
		traitSetID: Number,
		open:       Boolean,
		viewY:      Number,
	},

	data() {
		return {
			scrollPosition: 'none',
			anchorPosition: 'top',
			styleOptions: [
				{ id: 'default',              label: 'Default' },
				{ id: 'two-columns-compact',  label: 'Two Columns (Compact)' },
				{ id: 'two-columns-detailed', label: 'Two Columns (Detailed)' },
				{ id: 'distinctions',         label: 'Distinctions' },
				{ id: 'attributes',           label: 'Attributes' },
				{ id: 'assets',               label: 'Assets' },
				{ id: 'resources',            label: 'Resources' },
				{ id: 'stress',               label: 'Stress' },
			]
		}
	},

	computed: {

		traitSet() {
			let s = this.traitSetID;
			return this.character.traitSets[s];
		},

		name: {
			get() {
				return this.traitSet.name;
			},
			set( name ) {
				this.setTraitSetProperty( 'name', name );
			}
		},

		description: {
			get() {
				return this.traitSet.description;
			},
			set( description ) {
				this.setTraitSetProperty( 'description', description );
			}
		},

		style: {
			get() {
				return this.traitSet.style;
			},
			set( style ) {
				this.setTraitSetProperty( 'style', style );
			}
		},

		cssClass() {

			let cssClass = {
				'editor': true,
				'open': this.open,
				'scrollable': false,
			}

			cssClass[ 'anchor-position-' + this.anchorPosition ] = true;

			return cssClass;

		}

	},

	/*html*/
	template: `<aside :class="cssClass" @click.stop="">

		<div class="editor-arrow"></div>

		<div class="editor-controls">
			<button @click.stop="selectCharacterPart([])"><i class="fas fa-times"></i></button>
			<button class="editor-delete" @click.stop="removeTraitSet"><i class="fas fa-trash"></i></button>
		</div>

		<div class="editor-inner">
			<div>

				<div class="editor-fields">

					<div class="editor-field">
						<label>Trait Set Name</label>
						<input type="text" v-model="name" ref="inputName">
					</div>

					<div class="editor-field" v-if="traitSet.location !== 'attributes'">
						<label>Style</label>
						<select v-model="style">
							<option v-for="option in styleOptions" :value="option.id" :selected="option.id === style">{{ option.label }}</option>
						</select>
					</div>

					<div class="editor-field">
						<label>Description</label>
						<textarea v-model="description"></textarea>
					</div>

				</div>

			</div>
		</div>

	</aside>`,

	mounted() {

		this.checkAnchorPosition();

		if ( this.open ) {
			this.focusFirstInput();
		}

	},

	watch: {

		character() {
			this.checkAnchorPosition();
		},

		viewY() {
			this.checkAnchorPosition();
		},
		
		open( isOpen, wasOpen ) {
			if ( isOpen && !wasOpen ) {
				this.focusFirstInput();
			}
		}

	},

	methods: {

		selectCharacterPart( selector ) {
			this.$emit( 'selectCharacterPart', selector );
		},

		async focusFirstInput() {
			await Vue.nextTick();
			this.$refs.inputName.focus();
		},
 
		setTraitSetProperty( key, value ) {

			let character = this.character;
			let s = this.traitSetID;

			character.traitSets[s][ key ] = value;

			this.update( character );

		},

		removeTraitSet() {
			this.$emit( 'removeTraitSet', this.traitSetID );
		},

		update( character ) {
			this.$emit( 'update', character );
		},

		checkAnchorPosition() {
			
			let windowHeight = (window.innerHeight || html.clientHeight);
			let traitPosition = this.$el.parentElement.getBoundingClientRect();
			let traitMidpoint = traitPosition.top + (traitPosition.height / 2); 

			if ( traitMidpoint < (windowHeight / 2) ) {
				this.anchorPosition = 'top';
			} else {
				this.anchorPosition = 'bottom';
			}

		},

	}

}
