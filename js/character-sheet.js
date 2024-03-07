Vue.component('characterSheet', {

	props: {
		character: Object,
		editable:  Boolean
	},

	data: function() {
		let data = structuredClone(this.character);
		return data;
	},

	computed: {

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
	template: `<section class="character-sheet">
	
		<div class="pages">

			<!-- PAGE -->
			<div class="page">
				<div class="page-inner">

					<!-- CHARACTER NAME -->
					<div class="title-container">

						<div class="title"
							v-html="name"
							contenteditable
							@blur="editContent( $event, ['name'] )"
						></div>

						<div class="title-decoration">
							<svg height="4" width="100%"><line x1="0" y1="0" x2="10000" y2="0" style="stroke:#C50852;stroke-width:4pt"/></svg>
						</div>

					</div>

					<!-- CHARACTER DESCRIPTION -->
					<div class="subtitle"
						v-html="description"
						contenteditable
						@blur="editContent( $event, ['description'] )"
					></div>

					<!-- COLUMNS -->
					<div class="columns">

						<div v-for="pageLocation in ['left', 'right']" :class="'column-' + pageLocation">

							<!-- IMAGE -->
							<div class="portrait" v-if="pageLocation === 'right'">
								<div class="portrait-circle" width=100% height=100%>
									<div class="edit-image"></div>
									<img src="" width="110%" draggable="false" class="image"></img>
								</div>
							</div>

							<!-- ATTRIBUTES -->
							<div class="attribute-curve" xmlns="http://www.w3.org/2000/svg"
								:style="'display: ' + ( attributes.length >= 2 ? 'block' : 'none' ) + ';'"
								v-if="pageLocation === 'right'"
							>
								<svg viewBox="0 0 62 62" width="62mm" height="30mm" preserveAspectRatio="xMidYMid slice">
									<path d="M -17 -25 A 32 32 0 0 0 79 0" stroke="#C50852" stroke-width="0.5mm" fill="transparent" vector-effect="non-scaling-stroke"/>
								</svg>
							</div>

							<div :class="{ 'attributes': true, 'vertical': attributes.length > 5 }"
								v-if="pageLocation === 'right'"
							>
								<div v-for="( attribute, a ) in attributes"
									:class="{ 'attribute': true, 'vertical': attributes.length > 5 }"
									:style="getAttributeStyle( a )"
								>

									<span class="c"
										v-html="attribute.value"
										contenteditable
										@blur="editContent( $event, ['traitSet', attributesID, 'trait', a,'value'] )"
									></span>

									<div
										v-html="attribute.name"
										contenteditable
										@blur="editContent( $event, ['traitSet', attributesID, 'trait', a,'name'] )"
									></div>

									<div class="remove-item"
										@click.prevent="removeTrait( attributesID, a)"
									></div>

								</div>

								<!-- BUTTON: ADD ATTRIBUTE -->
								<div class="attribute-placeholder add-item"
									@click.prevent="addTrait( attributesID )"
								></div>
								
							</div>

							<!-- TRAITS -->
							<div :class="'trait-group style-' + traitSet.style"
								v-for="(traitSet, s) in traitSets"
								v-if="traitSet.location === pageLocation"
							>

								<div class="trait-group-header"
									v-html="traitSet.name"
									contenteditable
									@blur="editContent( $event, ['traitSet', s, 'name'] )"
								></div>

								<div class="trait-columns">
									<div class="trait-column" v-for="traitSetLocation in ['left', 'right']">

										<div class="trait" v-for="(trait, t) in traitSet.traits" v-if="trait.location === traitSetLocation">

											<div class="remove-item"
												@click.prevent="removeTrait(s,t)"
											></div>

											<h2 class="trait-title">

												<span class="trait-name"
													v-html="trait.name"
													contenteditable
													@blur="editContent( $event, ['traitSet', s, 'trait', t, 'name'] )"
												></span>
											
												<span class="trait-value c"
													v-html="trait.value"
													contenteditable
													@blur="editContent( $event, ['traitSet', s, 'trait', t, 'value'] )"
												></span>

											</h2>

											<hr>

											<div
												class="trait-description"
												v-html="trait.description"
												contenteditable
												@blur="editContent( $event, ['traitSet', s, 'trait', t, 'description'] )"
											></div>

											<ul class="trait-sfx" v-if="trait.sfx && trait.sfx.length">
												<li v-for="(sfx, s) in trait.sfx">

													<span class="trait-sfx-name"
														v-html="sfx.name"
														contenteditable
														@blur="editContent( $event, ['traitSets', t, 'sfx', s, 'name'] )"
													></span>:

													<span class="trait-sfx-description"
														v-html="sfx.description"
														contenteditable
														@blur="editContent( $event, ['traitSets', t, 'sfx', s, 'description'] )"
													></span>

												</li>
											</ul>

										</div>

										<!-- BUTTON: ADD TRAIT -->
										<div class="trait-placeholder add-item"
											@click.prevent="addTrait( s, traitSetLocation )"
										></div>

									</div> <!-- .trait-column -->
								</div> <!-- .trait-columns -->

							</div>

							<!-- BUTTON: ADD TRAIT GROUP -->
							<div class="trait-group-placeholder add-item"
								@click.prevent="addSet( pageLocation )"
							></div>
							
						</div>

					</div> <!-- .columns -->
				</div> <!-- .page-inner -->
			</div> <!-- .page -->
		</div> <!-- .pages -->
	</section>`,

	methods: {

		export() {
			return {
				name:         this.name,
				description:  this.description,
				traitSets:    this.traitSets,
				image:        this.image,
			}
		},

		editContent( event, location ) {
			let content = event.target.innerHTML;

			switch ( location[0] ) {
				case 'name':
					this.name = this.sanitizeString(content);
					break;
				case 'description':
					this.description = this.sanitizeString(content);
					break;
				case 'traitSet':
					let s = location[1];
					let traitSet = this.traitSets[s];
					switch ( location[2] ) {
						case 'name':
							traitSet.name = this.sanitizeString(content);
							break;
						case 'trait':
							let t = location[3];
							let trait = traitSet.traits[t];
							switch ( location[4] ) {
								case 'name':
									trait.name = this.sanitizeString(content);
									break;
								case 'value':
									trait.value = Number(content);
									break;
								case 'description':
									trait.description = this.sanitizeString(content);
									break;
								case 'sfx':
									let f = location[3];
									switch ( location[4] ) {
										case 'name':
											trait.sfx[f].name = this.sanitizeString(content);
											break;
										case 'description':
											trait.sfx[f].description = this.sanitizeString(content);
											break;
										default: break;
									}
								default: break;
							}
							traitSet.traits[t] = trait;
							break;
						default: break;
					}
					this.$set(this.traitSets, s, traitSet);
					break;
				default:
					break;
			}

			this.$emit('edited', this.export() );

		},

		sanitizeString( value ) {

			value = String(value).trim();

			return value;

		},

		getAttributeStyle( a ) {

			let cssLeft, cssTop;

			if ( this.attributes.length === 1 ) {

				cssLeft = ((115 + 176) * 0.5 + 3.5) + 'mm'        
				cssTop  = '120mm'

			} else {

				let alpha = a / (this.attributes.length-1);

				let left = 115;
				let right = 176;
				let height = 10;
				let top = 107.5;
				
				let x = (right - left) * alpha + left + 3.5
				cssLeft = x + 'mm'
				
				let y =  Math.sin(alpha * 3.1415926535) * height + top - 3
				cssTop = y + 'mm'
			}

			return `left: ${cssLeft}; top: ${cssTop};`;

		},
		
		addSet( location ) {

			this.traitSets.push({
				name: 'New trait group',
				style: 'default',
				location: location ?? 'left',
				traits: [
					{
						name: 'New trait',
						value: 6,
						description: 'Trait description',
						location: 'left',
					}
				],
			});

			this.$emit('edited', this.export() );

		},
		
		addTrait( traitSetID, location ) {

			let traitSet = this.traitSets[traitSetID];

			traitSet.traits.push({
				name: 'New trait',
				value: 6,
				description: 'Trait description',
				location: location ?? 'left'
			});

			this.$set(this.traitSets, traitSetID, traitSet);

			this.$emit('edited', this.export() );

		},
		
		removeTrait( traitSetID, traitID ) {

			let traitSet = this.traitSets[traitSetID];

			traitSet.traits.splice(traitID, 1);

			this.$set(this.traitSets, traitSetID, traitSet);

			this.$emit('edited', this.export() );

		},
		
	}

});
