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

					<label>Trait Value</label>

					<ul class="editor-values">
						<li
							v-for="value in [4,6,8,10,12]"
							:class="{ 'active': value === trait.value }"
							@click.prevent="toggleTraitValue( value )"
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
						<button class="editor-button editor-button-add editor-button-tertiary" @click.prevent="addEffect"><i class="fas fa-plus"></i> New SFX</button>
					</div>

					<div class="editor-group-remove">
						<button class="editor-button editor-button-remove" @click.prevent="removeTrait"><i class="fas fa-trash"></i> Remove trait</button>
					</div>

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

			if ( distance >= max ) {
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
