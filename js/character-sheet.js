const CharacterSheet = {

	props: {
		submode:   String,
		character: Object,
		editing:   Array,
		viewY:     Number,
	},

	computed: {

		name() {
			return this.character?.name ?? '';
		},

		description() {
			return this.character?.description ?? '';
		},

		portrait() {
			return this.character?.portrait ?? null;
		},

		traitSets() {
			return this.character?.traitSets ?? [];
		},

		distinctions() {
			return this.traitSets.find( traitSet => traitSet.style === 'distinctions' );
		},

		attributes() {
			return this.traitSets.find( traitSet => traitSet.location === 'attributes' )?.traits || [];
		},

		attributesID() {
			return this.traitSets.findIndex( traitSet => traitSet.location === 'attributes' );
		}

	},

	/*html*/
	template: `<section :class="'character-sheet submode-' + submode">
	
		<!-- BUTTON: ADD ATTRIBUTE -->
		<transition appear>
		<div class="preview-button-container"
			v-show="submode === 'print'"
		>
			<div class="preview-button"
				@click.stop="print"
			>
				<span><i class="fas fa-print"></i> Print</span>
			</div>
			<div class="preview-button preview-button-export"
				@click.stop="exportCharacter"
			>
				<span><i class="fas fa-download"></i> Export</span>
			</div>
		</div>
		</transition>

		<div class="pages">

			<!-- PAGE -->
			<div class="page">
				<div class="page-inner">

					<header class="page-header">

						<div :class="{'page-header-inner': true, 'selected': isSelected(['name'])}"
							@click.stop="selectElement([ 'name' ])"
						>
							<div>

								<!-- CHARACTER NAME -->
								<div class="title-container">

									<div class="title"
										v-html="name"
									></div>

									<div class="title-decoration">
										<svg height="4" width="100%"><line x1="0" y1="0" x2="10000" y2="0" style="stroke:#C50852;stroke-width:4pt"/></svg>
									</div>

								</div>

								<!-- CHARACTER DESCRIPTION -->
								<div class="subtitle">
									<span v-html="renderText(description)"></span>
								</div>

							</div>
						</div>

						<transition name="editor" appear>
							<name-editor
								:character="character"
								:open="isSelected(['name'])"
								v-show="submode === 'edit' && isSelected(['name'])"
								@selectElement="selectElement"
								@updateCharacter="updateCharacter"
							></name-editor>
						</transition>

					</header>

					<!-- COLUMNS -->
					<div class="columns">

						<div v-for="pageLocation in ['left', 'right']" :class="'column-' + pageLocation">

							<!-- PORTRAIT -->
							<div class="portrait" v-if="pageLocation === 'right'">

								<div :class="{ 'portrait-inner': true, 'selected': isSelected(['portrait']) }"
									@click.stop="selectElement([ 'portrait' ])"
								>
									<div :class="'portrait-circle portrait-alignment-' + portrait.alignment" width="100%" height="100%" :style="'background-image: url(' + portrait.url + ');'"></div>
								</div>

								<transition name="editor" appear>
									<portrait-editor
										:character="character"
										:open="isSelected(['portrait'])"
										v-show="submode === 'edit' && isSelected(['portrait'])"
										@selectElement="selectElement"
										@updateCharacter="updateCharacter"
									></portrait-editor>
								</transition>
	
							</div>

							<!-- ATTRIBUTES -->
							<div :class="{ 'attributes': true, 'vertical': attributes.length > 5 }" v-if="pageLocation === 'right'">

								<div class="attributes-grid">

									<div class="attribute-curve" xmlns="http://www.w3.org/2000/svg"
										:style="'display: ' + ( attributes.length >= 2 ? 'block' : 'none' ) + ';'"
										v-if="pageLocation === 'right'"
									>
										<svg viewBox="0 0 62 62" width="62mm" height="30mm" preserveAspectRatio="xMidYMid slice">
											<path d="M -17 -25 A 32 32 0 0 0 79 0" stroke="#C50852" stroke-width="0.5mm" fill="transparent" vector-effect="non-scaling-stroke"/>
										</svg>

									</div>

									<div class="attributes-items"
										v-if="pageLocation === 'right'"
									>
										<div v-for="( attribute, a ) in attributes"
											class="attribute"
											:style="getAttributeStyle( a )"
										>

											<div class="attribute-inner"
												:class="{ 'attribute-inner': true, 'selected': isSelected(['trait', attributesID, a]) }"
												@click.stop="selectElement([ 'trait', attributesID, a ])"
											>

												<span class="c"
													v-html="renderDieValue(attribute.value)"
												></span>

												<div class="attribute-name"
													v-html="attribute.name"
												></div>

											</div>

											<transition name="editor" appear>
												<trait-editor
													:character="character"
													:open="isSelected(['trait', attributesID, a])"
													v-show="submode === 'edit' && isSelected(['trait', attributesID, a])"
													:traitSetID="attributesID"
													:traitID="a"
													:viewY="viewY"
													@selectElement="selectElement"
													@updateCharacter="updateCharacter"
													@removeTrait="removeTrait"
												></trait-editor>
											</transition>

										</div>

									</div>

								</div>

								<!-- BUTTON: ADD ATTRIBUTE -->
								<transition appear>
								<div class="preview-button-container"
									v-show="submode === 'edit'"
									v-if="pageLocation === 'right'"
								>
									<div class="preview-button"
										@click.stop="addTrait( attributesID )"
									>
										<span><i class="fas fa-plus"></i> Attribute</span>
									</div>
								</div>
								</transition>

							</div>
								
							<!-- TRAIT SETS -->
							<template v-for="(traitSet, s) in traitSets" :key="s">
							
							<div :class="'trait-set trait-set-style-' + traitSet.style"
								v-if="traitSet.location === pageLocation"
							>

								<div class="trait-set-header">

									<transition appear>
										<div :class="{'trait-set-header-inner': true, 'selected': isSelected(['traitSet', s])}"
											@click.stop="selectElement([ 'traitSet', s ])"
										>
											<div v-html="traitSet.name"></div>
										</div>
									</transition>

									<transition name="editor" appear>
										<trait-set-editor
											:character="character"
											:open="isSelected(['traitSet', s])"
											v-show="submode === 'edit' && isSelected(['traitSet', s])"
											:traitSetID="s"
											:viewY="viewY"
											@selectElement="selectElement"
											@updateCharacter="updateCharacter"
											@removeTraitSet="removeTraitSet"
										></trait-set-editor>
									</transition>

								</div>

								<div class="trait-columns">
									<div class="trait-column" v-for="traitSetLocation in ['left', 'right']">

										<template v-for="(trait, t) in traitSet.traits" :key="t">
											<div class="trait"
													v-if="trait.location === traitSetLocation"
												>

												<transition name="trait" appear>
													<div :class="{ 'trait-inner': true, 'selected': isSelected(['trait', s, t]) }"
														@click.stop="selectElement([ 'trait', s, t ])"
													>

														<h2 class="trait-title">

															<span class="trait-name"
																v-html="trait.name"
															></span>
														
															<div class="trait-value">
																<span :class="{ 'c': true, 'active': trait.value === 4 }" >4</span>
																<span :class="{ 'c': true, 'active': trait.value === 6 }" >6</span>
																<span :class="{ 'c': true, 'active': trait.value === 8 }" >8</span>
																<span :class="{ 'c': true, 'active': trait.value === 10 }">0</span>
																<span :class="{ 'c': true, 'active': trait.value === 12 }">2</span>
															</div>

														</h2>

														<div
															class="trait-description"
															v-html="renderText(trait.description)"
														></div>

														<ul class="trait-sfx" v-if="trait.sfx && trait.sfx.length">
															<li v-for="(sfx, s) in trait.sfx">

																<span class="trait-sfx-name"
																	v-html="sfx.name"
																></span>:

																<span class="trait-sfx-description"
																	v-html="renderText(sfx.description)"
																></span>

															</li>
														</ul>

													</div>
												</transition>

												<transition name="editor" appear>
													<trait-editor
														:character="character"
														:open="isSelected(['trait', s, t])"
														v-show="submode === 'edit' && isSelected(['trait', s, t])"
														:traitSetID="s"
														:traitID="t"
														:viewY="viewY"
														@selectElement="selectElement"
														@updateCharacter="updateCharacter"
														@removeTrait="removeTrait"
													></trait-editor>
												</transition>

											</div>
										</template>

										<!-- BUTTON: ADD TRAIT -->
										<transition appear>
										<div class="preview-button-container"
											v-show="submode === 'edit'"
										>
											<div class="preview-button"
												@click.stop="addTrait( s, traitSetLocation )"
											>
												<span><i class="fas fa-plus"></i> {{ traitSet.noun && traitSet.noun.length ? traitSet.noun : 'Trait' }}</span>
											</div>
										</div>
										</transition>

									</div> <!-- .trait-column -->
								</div> <!-- .trait-columns -->

							</div>
							</template>

							<!-- BUTTON: ADD TRAIT SET -->
							<transition appear>
							<div class="preview-button-container"
								v-show="submode === 'edit'"
							>
								<div class="preview-button"
									@click.stop="addTraitSet( pageLocation )"
								>
									<span><i class="fas fa-plus"></i> Trait Set</span>
								</div>
							</div>
							</transition>
							
						</div>

					</div> <!-- .columns -->
				</div> <!-- .page-inner -->
			</div> <!-- .page -->
		</div> <!-- .pages -->
	</section>`,

	methods: {

		// PRESENTATION

		isSelected( selector ) {
			return cortexFunctions.arraysMatch( this.editing, selector );
		},

		renderText( text ) {
			text = text.replace( /d\d*(\d)/g, '<span class="c">$1</span>' );
			// text = text.replace( '<span class="c">1(\d)</span>', '<span class="c">$1</span>' );
			text = text.replace( /([^A-Za-z])PP([^A-Za-z])/gi, '$1<span class="pp">PP</span>$2' );
			text = text.replace( "\n", '<br>' );
			return text;
		},

		renderDieValue( value ) {
			return cortexFunctions.getDieDisplayValue( value );
		},

		getAttributeStyle( a ) {

			let top    = 7;
			let left   = 8;
			let right  = left + 61;
			let height = 10;

			let alpha;

			if ( this.attributes.length === 1 ) {
				alpha = .5;
			} else {
				alpha = a / ( this.attributes.length - 1 );
			}

			let x = (right - left) * alpha + left + 3.5;
			let y = Math.sin(alpha * Math.PI) * height + top - 3;
			
			return `left: ${x}mm; top: ${y}mm;`;

		},
		
		// SELECTING

		selectElement( selector ) {
			if ( this.submode === 'edit' ) {
				this.$emit( 'selectElement', selector );
			}
		},

		clearSelected() {
			this.$emit('selectElement', []);
		},

		// EDITING

		addTraitSet( location ) {

			let character = this.character;

			character.traitSets.push({
				name: 'New trait set',
				description: 'Trait set description',
				style: 'default',
				location: location ?? 'left',
				traits: [
					{
						name: 'New trait',
						value: 6,
						description: 'Trait description',
						location: 'left',
						sfx: [],
					}
				],
			});

			this.updateCharacter( character );

			let newTraitSetID = character.traitSets.length - 1;
			this.selectElement([ 'traitSet', newTraitSetID ]);

		},

		removeTraitSet( traitSetID ) {

			// if ( this.isSelected(['traitSet', traitSetID]) ) {
				this.clearSelected();
			// }

			let character = this.character;

			character.traitSets.splice(traitSetID, 1);

			this.updateCharacter( character );

		},
		
		addTrait( traitSetID, location ) {

			let character = this.character;
			let traitSet = character.traitSets[traitSetID];
			let noun = ( traitSet.noun && traitSet.noun.length ) ? traitSet.noun : 'Trait';

			character.traitSets[traitSetID].traits.push({
				name: 'New ' + noun,
				value: 6,
				description: 'Trait description',
				location: location ?? 'left',
				sfx: [],
			});

			this.updateCharacter( character );
			
			let newTraitID = character.traitSets[traitSetID].traits.length - 1;
			this.selectElement([ 'trait', traitSetID, newTraitID ]);

		},

		removeTrait( traitSetID, traitID ) {

			/*// If we’re removing the trait that is currently selected, switch to the previous trait, or the parent trait set if no other traits remain.
			if ( this.isSelected(['trait', traitSetID, traitID]) ) {
				if ( this.character.traitSets[traitSetID].traits.length > 1) {
					this.selectElement([ 'trait', traitSetID, traitID - 1 ]);
				} else {
					this.select( 'traitSet', traitSetID );
				}
			} else {*/
				this.clearSelected();
			/*}*/

			setTimeout( () => {
				let character = this.character;
				character.traitSets[traitSetID].traits.splice(traitID, 1);
				this.updateCharacter( character );
			}, 200 );

		},

		updateCharacter( character ) {
			this.$emit( 'updateCharacter', character );
		},

		exportCharacter() {
			this.$emit('exportCharacter', this.character.id);
		},

		print() {
			window.print();
		}

	}

}
