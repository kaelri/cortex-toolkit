const TraitEditor = {

	props: {
		character:  Object,
		traitSetID: Number,
		traitID:    Number,
		open:       Boolean,
		viewY:      Number,
	},

	data() {
		return {
			scrollPosition: 'none',
			anchorPosition: 'top',
		}
	},

	computed: {

		traitSet() {
			let s = this.traitSetID;
			return this.character.traitSets[s];
		},

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

		hinder: {
			get() {
				return this.trait?.hinder ?? false;
			},
			set( hinder ) {
				this.setTraitProperty( 'hinder', hinder );
			}
		},

		scrollable() {
			return Boolean(
				( this.traitSet.features.includes('sfx') && this.trait.sfx.length > 0 )
				||
				( this.traitSet.features.includes('subtraits') && this.trait.subtraits.length > 0 )
			);
		},

		cssClass() {

			let cssClass = {
				'editor': true,
				'open': this.open,
				'scrollable': this.scrollable
			}

			cssClass[ 'anchor-position-' + this.anchorPosition ] = true;

			if ( this.scrollable ) {
				cssClass[ 'scroll-position-' + this.scrollPosition ] = true;
			}

			return cssClass;

		}

	},

	/*html*/
	template: `<aside :class="cssClass" @click.stop="">

		<div class="editor-arrow"></div>

		<div class="editor-controls">
			<button @click.stop="selectElement([])"><i class="fas fa-times"></i></button>
			<button class="editor-delete" @click.stop="removeTrait"><i class="fas fa-trash"></i></button>
		</div>

		<div class="editor-inner">
			<div @scroll="checkScrollPosition">
	
				<div class="editor-fields">

					<div class="editor-field">
						<label>Trait Name</label>
						<input type="text" v-model="name" ref="inputName">
					</div>

					<div class="editor-field">

						<label>Value</label>

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

					<div class="editor-field" v-if="traitSet.features.includes('description')">
						<label>Description</label>
						<textarea v-model="description"></textarea>
					</div>

					<!-- SUBTRAITS -->
					<div class="editor-field" v-if="traitSet.features.includes('subtraits')">

						<label>Subtraits</label>

						<div class="editor-subgroups">

							<transition-group appear>
								<subtrait-editor
									v-for="(subtrait, subtraitID) in trait.subtraits"
									:key="traitSetID + '-' + traitID + '-' + subtraitID"
									:character="character"
									:traitSetID="traitSetID"
									:traitID="traitID"
									:subtraitID="subtraitID"
									@updateCharacter="updateCharacter"
									@removeSubtrait="removeSubtrait"
								></subtrait-editor>
							</transition-group>

						</div>

						<div class="editor-button-container">
							<div class="editor-button-container-inner">
								<div class="editor-button" @click.stop="addSubtrait">
									<span><i class="fas fa-plus"></i> New Subtrait</span>
								</div>
							</div>
						</div>

					</div>

					<!-- SFX -->
					<div class="editor-field" v-if="traitSet.features.includes('sfx')">

						<label>SFX</label>

						<div class="editor-field">
							<div class="editor-toggles">
								<div><input type="checkbox" :id="'trait-' + traitSetID + '-' + traitID + '-hinder'" :true-value="true" :false-value="false" v-model="hinder"></div>
								<div><label :for="'trait-' + traitSetID + '-' + traitID + '-hinder'">Can Hinder</label></div>
							</div>
						</div>

						<div class="editor-subgroups">

							<transition-group appear>
								<sfx-editor
									v-for="(effect, effectID) in trait.sfx"
									:key="traitSetID + '-' + traitID + '-' + effectID"
									:character="character"
									:traitSetID="traitSetID"
									:traitID="traitID"
									:effectID="effectID"
									@updateCharacter="updateCharacter"
									@removeEffect="removeEffect"
								></sfx-editor>
							</transition-group>

						</div>

						<div class="editor-button-container">
							<div class="editor-button-container-inner">
								<div class="editor-button" @click.stop="addEffect">
									<span><i class="fas fa-plus"></i> New SFX</span>
								</div>
							</div>
						</div>

					</div>

				</div>

			</div>
		</div>

	</aside>`,

	mounted() {

		this.checkAnchorPosition();
		this.checkScrollPosition();

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

		selectElement( selector ) {
			this.$emit( 'selectElement', selector );
		},

		async focusFirstInput() {
			await Vue.nextTick();
			this.$refs.inputName.focus();
		},
 
		setTraitProperty( key, value ) {

			let character = this.character;
			let s = this.traitSetID;
			let t = this.traitID;

			character.traitSets[s].traits[t][ key ] = value;

			this.updateCharacter( character );

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

			let character = this.character;
			let s = this.traitSetID;
			let t = this.traitID;

			character.traitSets[s].traits[t].sfx.push({
				name: 'New SFX',
				description: 'SFX description',
			});

			this.updateCharacter( character );

		},

		removeEffect( effectID ) {

			let character = this.character;
			let s = this.traitSetID;
			let t = this.traitID;
			let f = effectID;

			character.traitSets[s].traits[t].sfx.splice(f, 1);

			this.updateCharacter( character );

		},

		addSubtrait() {

			let character = this.character;
			let s = this.traitSetID;
			let t = this.traitID;

			character.traitSets[s].traits[t].subtraits.push({
				name: 'New Subtrait',
				value: 6
			});

			this.updateCharacter( character );

		},

		removeSubtrait( subtraitID ) {

			let character = this.character;
			let s = this.traitSetID;
			let t = this.traitID;
			let u = subtraitID;

			character.traitSets[s].traits[t].sfx.splice(u, 1);

			this.updateCharacter( character );

		},

		updateCharacter( character ) {
			this.$emit( 'updateCharacter', character );
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

		checkScrollPosition() {

			let element = this.$el.querySelector('.editor-inner > div');

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

};
