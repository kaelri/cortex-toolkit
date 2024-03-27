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
				this.setProperty( 'name', name );
			}
		},

		description: {
			get() {
				return this.traitSet.description;
			},
			set( description ) {
				this.setProperty( 'description', description );
			}
		},

		nounSingular: {
			get() {
				return this.traitSet.nounSingular ?? '';
			},
			set( nounSingular ) {
				this.setProperty( 'nounSingular', nounSingular );
			}
		},

		nounPlural: {
			get() {
				return this.traitSet.nounPlural ?? '';
			},
			set( nounPlural ) {
				this.setProperty( 'nounPlural', nounPlural );
			}
		},

		styleHeader: {
			get() {
				return this.traitSet.custom.cortexToolkit.style.header;
			},
			set( value ) {
				this.setStyle( 'header', value );
			}
		},

		styleBody: {
			get() {
				return this.traitSet.custom.cortexToolkit.style.body;
			},
			set( value ) {
				this.setStyle( 'body', value );
			}
		},

		featureDescription: {
			get() {
				return this.traitSet.custom.cortexToolkit.features.description ?? false;
			},
			set( value ) {
				this.setFeature( 'description', value );
			}
		},

		featureSFX: {
			get() {
				return this.traitSet.custom.cortexToolkit.features.sfx ?? false;
			},
			set( value ) {
				this.setFeature( 'sfx', value );
			}
		},

		featureSubtraits: {
			get() {
				return this.traitSet.custom.cortexToolkit.features.subtraits ?? false;
			},
			set( value ) {
				this.setFeature( 'subtraits', value );
			}
		},

		scrollable() {
			return Boolean(
				this.traitSet.custom.cortexToolkit.features.sfx && this.traitSet.sfx.length > 0
			);
		},

		cssClass() {

			let cssClass = {
				'editor':     true,
				'open':       this.open,
				'scrollable': this.scrollable,
			}

			cssClass[ 'anchor-position-' + this.anchorPosition ] = true;

			return cssClass;

		}

	},

	/*html*/
	template: `<aside :class="cssClass" @click.stop="">

		<div class="editor-arrow"></div>

		<div class="editor-controls">
			<button @click.stop="selectElement([])"><i class="fas fa-times"></i></button>
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
						<select v-model="styleBody">
							<option v-for="option in styleOptions" :value="option.id" :selected="option.id === styleBody">{{ option.label }}</option>
						</select>
					</div>

					<div class="editor-field">
						<label>Description</label>
						<textarea v-model="description"></textarea>
					</div>

					<div class="editor-field">
						<label>Singular Noun</label>
						<input type="text" v-model="nounSingular" placeholder="Trait">
					</div>

					<div class="editor-field">
						<label>Trait Features</label>
						<div class="editor-toggles">

							<div><input type="checkbox" :id="'trait-set-' + traitSetID + '-feature-description'" :true-value="true" :false-value="false" v-model="featureDescription"></div>
							<div><label :for="'trait-set-' + traitSetID + '-feature-description'">Description</label></div>

							<div><input type="checkbox" :id="'trait-set-' + traitSetID + '-feature-subtraits'" :true-value="true" :false-value="false" v-model="featureSubtraits"></div>
							<div><label :for="'trait-set-' + traitSetID + '-feature-subtraits'">Sub-Traits</label></div>

							<div><input type="checkbox" :id="'trait-set-' + traitSetID + '-feature-sfx'" :true-value="true" :false-value="false" v-model="featureSFX"></div>
							<div><label :for="'trait-set-' + traitSetID + '-feature-sfx'">SFX</label></div>

						</div>
					</div>

					<!-- SFX -->
					<div class="editor-field" v-if="traitSet.custom.cortexToolkit.features.sfx">

						<label>Trait Set SFX</label>

						<div class="editor-subgroups">

							<transition-group appear>
								<sfx-editor
									v-for="(effect, effectID) in traitSet.sfx"
									:key="traitSetID + '-' + effectID"
									:character="character"
									:traitSetID="traitSetID"
									:traitID="null"
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
 
		setProperty( key, value ) {

			let character = this.character;
			let s = this.traitSetID;

			character.traitSets[s][ key ] = value;

			this.updateCharacter( character );

		},

		removeTraitSet() {
			this.$emit( 'removeTraitSet', this.traitSetID );
		},

		setFeature( featureID, value ) {

			let s = this.traitSetID;
			
			this.character.traitSets[s].custom.cortexToolkit.features[ featureID ] = value;

			this.updateCharacter( this.character );

		},

		setStyle( styleID, value ) {

			let s = this.traitSetID;
			
			this.character.traitSets[s].custom.cortexToolkit.style[ styleID ] = value;

			this.updateCharacter( this.character );

		},

		addEffect() {

			let character = this.character;
			let s = this.traitSetID;

			character.traitSets[s].sfx.push(
				structuredClone( cortexFunctions.defaultSFX )
			);

			this.updateCharacter( character );

		},

		removeEffect( effectID ) {

			let character = this.character;
			let s = this.traitSetID;
			let f = effectID;

			character.traitSets[s].sfx.splice(f, 1);

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

	}

}
