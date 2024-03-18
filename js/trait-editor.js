Vue.component('traitEditor', {

	props: {
		character:  Object,
		open:       Boolean,
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
	template: `<section :class="{'editor': true, 'open': open, 'scrollable': true, 'scroll-at-top': scrollPosition === 'top', 'scroll-at-bottom': scrollPosition === 'bottom', 'no-scroll': scrollPosition === 'none' }">

		<div class="editor-arrow"></div>

		<div class="editor-controls">
			<button @click.stop="select([])"><i class="fas fa-times"></i></button>
			<button class="editor-delete" @click.stop="removeTrait"><i class="fas fa-trash"></i></button>
		</div>

		<div class="editor-inner" @scroll="checkScroll">
	
			<div class="editor-fields">

				<div class="editor-field">
					<label>Trait Name</label>
					<input type="text" v-model="name" ref="inputName">
				</div>

				<div class="editor-field">

					<label>Trait Value</label>

					<ul class="editor-values">
						<li
							v-for="value in [4,6,8,10,12]"
							:class="{ 'active': value === trait.value }"
							@click.stop="toggleTraitValue( value )"
						>
							<span class="c" v-html="getDieDisplayValue(value)"></span>
						</li>
					</ul>

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
						@removeEffect="removeEffect"
					></sfx-editor>

					<div class="editor-subgroup">
						<button class="editor-button editor-button-add editor-button-tertiary" @click.stop="addEffect"><i class="fas fa-plus"></i> New SFX</button>
					</div>

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

		setTraitProperty( key, value ) {

			let character = structuredClone( this.character );
			let s = this.traitSetID;
			let t = this.traitID;

			character.traitSets[s].traits[t][ key ] = value;

			this.update( character );

		},

		toggleTraitValue( value ) {

			if ( value === this.trait.value ) {
				value = null;
			}

			this.setTraitProperty( 'value', value );

		},

		removeTrait() {
			this.$emit( 'removeTrait', this.traitSetID, this.traitID );
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

		removeEffect( effectID ) {

			let character = structuredClone( this.character );
			let s = this.traitSetID;
			let t = this.traitID;
			let f = effectID;

			character.traitSets[s].traits[t].sfx.splice(f, 1);

			this.update( character );

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

			if ( distance >= (max - 1) ) { // slight buffer 
				this.scrollPosition = 'bottom';
				return;
			}

			this.scrollPosition = 'middle';
			return;

		},

		getDieDisplayValue( value ) {
			return cortexFunctions.getDieDisplayValue( value );
		},

	}

});
