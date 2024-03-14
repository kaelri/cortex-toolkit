Vue.component('traitEditor', {

	props: {
		character:  Object,
		selected:   Array,
		traitSetID: Number,
		traitID:    Number,
	},

	data() {
		return {
			scrollPosition: 'none',
		}
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
				this.setTraitProperty( 'name', name );
			}
		},

		value: {
			get() {
				return this.trait.value;
			},
			set( value ) {
				this.setTraitProperty( 'value', value );
			}
		},

		description: {
			get() {
				return this.trait.description;
			},
			set( description ) {
				this.setTraitProperty( 'description', description );
			}
		},

	},

	/*html*/
	template: `<section :class="{'editor-group': true, 'open': active, 'scroll-at-top': scrollPosition === 'top', 'scroll-at-bottom': scrollPosition === 'bottom', 'no-scroll': scrollPosition === 'none' }">
		<div class="editor-group-inner" @scroll="checkScroll">
	
			<div class="editor-fields">

				<div class="editor-field">
					<label>Trait Name</label>
					<input type="text" v-model="name">
				</div>

				<div class="editor-field">
					<label>Description</label>
					<textarea v-model="description"></textarea>
				</div>

				<!-- SFX -->
				<div class="editor-field">

					<label>SFX</label>

					<sfx-editor
						v-for="(effect, effectID) in trait.sfx"
						:key="traitSetID + '-' + traitID + '-' + effectID"
						:character="character"
						:traitSetID="traitSetID"
						:traitID="traitID"
						:effectID="effectID"
						@update="update"
					></sfx-editor>

					<button @click.prevent="addEffect"><i class="fas fa-plus"></i> Add SFX</button>

				</div>

			</div>

		</div>
	</section>`,

	mounted() {
		this.checkScroll();
	},

	methods: {

		setTraitProperty( key, value ) {

			let character = structuredClone( this.character );
			let s = this.traitSetID;
			let t = this.traitID;

			character.traitSets[s].traits[t][ key ] = value;

			this.update( character );

		},

		addEffect() {

			let character = structuredClone( this.character );
			let s = this.traitSetID;
			let t = this.traitID;

			character.traitSets[s].traits[t].sfx.push({
				name: 'New SFX',
				description: 'SFX description',
			});

			this.update( character );

		},

		update( character ) {
			this.$emit( 'update', character );
		},

		checkScroll() {

			let element = this.$el.querySelector('.editor-group-inner');

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

			if ( distance === max ) {
				this.scrollPosition = 'bottom';
				return;
			}

			this.scrollPosition = 'middle';
			return;

		},

	}

});
