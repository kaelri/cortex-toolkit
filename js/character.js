const Character = {

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

		pronouns() {
			return this.character?.pronouns ?? '';
		},

		portrait() {
			return this.character?.portrait ?? null;
		},

		traitSets() {
			return this.character?.traitSets ?? [];
		},

		attributes() {
			return this.traitSets.find( traitSet => traitSet.custom.cortexToolkit.location === 'attributes' )?.traits || [];
		},

		attributesID() {
			return this.traitSets.findIndex( traitSet => traitSet.custom.cortexToolkit.location === 'attributes' );
		}

	},

	/*html*/
	template: `<section :class="'character-sheet submode-' + submode">
	
		<!-- BUTTON: ADD ATTRIBUTE -->
		<transition appear>
		<div class="preview-button-container"
			v-show="submode === 'print'"
		>
			<div class="preview-button-container-inner">
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
								<div class="character-meta">
						
									<div class="character-pronouns" v-if="pronouns.length">
										<span v-html="renderText(pronouns)"></span>
									</div>

									<div class="character-description" v-if="description.length">
										<span v-html="renderText(description)"></span>
									</div>
			
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
									<div :class="'portrait-circle portrait-alignment-' + portrait.custom.cortexToolkit.alignment" width="100%" height="100%" :style="'background-image: url(' + portrait.url + ');'">
										<div class="portrait-placeholder" v-if="!portrait.url.length"><i class="fas fa-user"></i></div>
									</div>
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
							<div :class="{ 'attributes': true, 'vertical': attributes.length > 5 }" v-if="pageLocation === 'right' && attributesID > -1">

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
									<div class="preview-button-container-inner">
										<div class="preview-button"
											@click.stop="addTrait( attributesID )"
										>
											<span><i class="fas fa-plus"></i> Attribute</span>
										</div>
									</div>
								</div>
								</transition>

							</div>
								
							<!-- TRAIT SETS -->
							<template v-for="(traitSet, s) in traitSets" :key="s">
							
							<div :class="getTraitSetClasses(traitSet)"
								v-if="traitSet.custom.cortexToolkit.location === pageLocation"
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

								<div class="trait-set-body">

									<div class="trait-list">

										<template v-for="(trait, t) in traitSet.traits" :key="t">
											<div :class="getTraitClasses(trait)">

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
															v-if="traitSet.custom.cortexToolkit.features.description"
															v-html="renderText(trait.description)"
														></div>

														<ul class="subtraits" v-if="traitSet.custom.cortexToolkit.features.subtraits && trait.traits.length">
															<li class="subtrait" v-for="(subtrait, u) in trait.traits">

																<span class="subtrait-name"
																	v-html="subtrait.name"
																></span>
															
																<div class="subtrait-value">
																	<span :class="{ 'c': true, 'active': subtrait.value === 4 }" >4</span>
																	<span :class="{ 'c': true, 'active': subtrait.value === 6 }" >6</span>
																	<span :class="{ 'c': true, 'active': subtrait.value === 8 }" >8</span>
																	<span :class="{ 'c': true, 'active': subtrait.value === 10 }">0</span>
																	<span :class="{ 'c': true, 'active': subtrait.value === 12 }">2</span>
																</div>

															</li>
														</ul>

														<ul class="trait-sfx" v-if="traitSet.custom.cortexToolkit.features.sfx && ( trait.sfx.length )">
															<li v-if="trait.hinder">

															</li>
															<li v-for="(sfx, s) in trait.sfx">

																<template v-if="sfx === 'hinder'">

																	<span class="trait-sfx-name">Hinder</span>:

																	<span class="trait-sfx-description"
																		v-html="renderText('Gain a PP when you switch out this ' + ( traitSet.nounSingular && traitSet.nounSingular.length ? traitSet.nounSingular.toLowerCase() : 'trait' ) + '’s d' + trait.value + ' for a d4.')"
																	></span>

																</template>

																<template v-else>

																	<span class="trait-sfx-name"
																		v-html="sfx.name"
																	></span>:

																	<span class="trait-sfx-description"
																		v-html="renderText(sfx.description)"
																	></span>

																</template>

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

									</div> <!-- .trait-list -->

									<!-- BUTTON: ADD TRAIT -->
									<transition appear>
									<div class="preview-button-container"
										v-show="submode === 'edit'"
									>
										<div class="preview-button-container-inner">
											<div class="preview-button"
												@click.stop="addTrait( s, traitSetLocation )"
											>
												<span><i class="fas fa-plus"></i> {{ traitSet.nounSingular && traitSet.nounSingular.length ? traitSet.nounSingular : 'Trait' }}</span>
											</div>
										</div>
									</div>
									</transition>

									<ul class="sfx" v-if="traitSet.custom.cortexToolkit.features.sfx && traitSet.sfx.length">
										<li v-for="(sfx, s) in traitSet.sfx">

											<span class="sfx-name"
												v-html="sfx.name"
											></span>:

											<span class="sfx-description"
												v-html="renderText(sfx.description)"
											></span>

										</li>
									</ul>

								</div> <!-- .traits -->

							</div>
							</template>

							<!-- BUTTON: ADD TRAIT SET -->
							<transition appear>
							<div class="preview-button-container"
								v-show="submode === 'edit'"
							>
								<div class="preview-button-container-inner">
									<div class="preview-button"
										@click.stop="addTraitSet( pageLocation )"
									>
										<span><i class="fas fa-plus"></i> Trait Set</span>
									</div>
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

		getTraitSetClasses( traitSet ) {

			let classes = {
				'trait-set': true
			}

			classes[ 'trait-set-style-' + traitSet.custom.cortexToolkit.style.body ] = true;

			if ( traitSet?.custom?.cortexToolkit?.features?.description ) {
				classes[ 'trait-set-has-feature-description' ] = true;
			}

			if ( traitSet?.custom?.cortexToolkit?.features?.sfx ) {
				classes[ 'trait-set-has-feature-sfx' ] = true;
			}

			if ( traitSet?.custom?.cortexToolkit?.features?.subtraits ) {
				classes[ 'trait-set-has-feature-subtraits' ] = true;
			}

			return classes;

		},

		getTraitClasses( trait ) {

			let classes = {
				'trait': true
			}

			if ( trait?.description?.length ) {
				classes['trait-has-description'] = true;
			}

			if ( trait?.sfx?.length ) {
				classes['trait-has-sfx'] = true;
			}

			if ( trait?.traits?.length ) {
				classes['trait-has-subtraits'] = true;
			}

			return classes;

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

			let traitSet = structuredClone( cortexFunctions.defaultTraitSet );
			traitSet.custom.cortexToolkit.location = location ?? 'left';
			traitSet.traits.push( structuredClone( cortexFunctions.defaultTrait ) );

			character.traitSets.push( traitSet );

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
		
		addTrait( traitSetID ) {

			let character = this.character;
			let traitSet = character.traitSets[traitSetID];
			let noun = ( traitSet.nounSingular && traitSet.nounSingular.length ) ? traitSet.nounSingular : 'Trait';

			let trait = structuredClone( cortexFunctions.defaultTrait );
			trait.name = 'New ' + noun;

			character.traitSets[traitSetID].traits.push(trait);

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
