Vue.component('traitSetEditor', {

	props: {
		character:  Object,
		open:       Boolean,
		traitSetID: Number,
	},

	data() {
		return {
			scrollPosition: 'none',
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

	},

	/*html*/
	template: `<section :class="{'editor': true, 'open': open, 'scrollable': false, 'scroll-at-top': scrollPosition === 'top', 'scroll-at-bottom': scrollPosition === 'bottom', 'no-scroll': scrollPosition === 'none' }">

		<div class="editor-arrow"></div>

		<div class="editor-controls">
			<button @click.stop="select([])"><i class="fas fa-times"></i></button>
			<button class="editor-delete" @click.stop="removeTraitSet"><i class="fas fa-trash"></i></button>
		</div>

		<div class="editor-inner" @scroll="checkScroll">

			<div class="editor-fields">

				<div class="editor-field">
					<label>Trait Set Name</label>
					<input type="text" v-model="name" ref="inputName">
				</div>

				<div class="editor-field">
					<label>Description</label>
					<textarea v-model="description"></textarea>
				</div>

			</div>

		</div>
	</section>`,

	mounted() {

		this.checkScroll();

		if ( this.open ) {
			this.$refs.inputName.focus();
		}
		
	},

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

		setTraitSetProperty( key, value ) {

			let character = structuredClone( this.character );
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

		checkScroll() {

			let element = this.$el.querySelector('.editor-inner');

			let distance = element.scrollTop;
			let max      = element.scrollHeight - element.clientHeight;

			if ( max <= 0 ) {
				this.scrollPosition = 'none';
				return;
			}

			if ( distance === 0 ) {
				this.scrollPosition = 'top';
				return;
			}

			if ( distance >= max ) {
				this.scrollPosition = 'bottom';
				return;
			}

			this.scrollPosition = 'middle';
			return;

		},

	}

});
