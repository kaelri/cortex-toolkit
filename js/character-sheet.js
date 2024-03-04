Vue.component('characterSheet', {

	props: {
		character: Object,
		editable:  Boolean
	},

	data: function() {
		let data = structuredClone(this.character);
		return data;
	},

	/*html*/
	template: `<article class="character-sheet">
	
		<div class="pages">

			<!-- PAGE -->
			<div id="page-1" class="page">
				<div class="content">

					<!-- CHARACTER NAME -->
					<div class="row" id="name">

						<div class="title character-name"
							v-html="name"
							contenteditable
							@blur="editContent( $event, ['name'] )"
						></div>

						<div class="ruler">
							<svg height="4" width="100%"><line x1="0" y1="0" x2="10000" y2="0" style="stroke:#C50852;stroke-width:4pt"/></svg>
						</div>

					</div>

					<!-- LEFT COLUMN -->
					<div class="left">

						<!-- CHARACTER DESCRIPTION -->
						<div id="description"
							v-html="description"
							contenteditable
							@blur="editContent( $event, ['description'] )"
						></div>

						<!-- DISTINCTIONS -->
						<div id="distinctions" class="trait-group">

							<div class="trait-group-header">Distinctions</div>

							<div class="traits">
								<div class="trait" v-for="(distinction, d) in distinctions">

									<h2 class="inline"
										v-html="distinction.name"
										contenteditable
										@blur="editContent( $event, ['distinctions', d, 'name'] )"
									></h2>
									
									<h2>
										<span class="c"
											v-html="distinction.value"
											contenteditable
											@blur="editContent( $event, ['distinctions', d, 'value'] )"
										></span>
									</h2>

									<hr>

									<div v-html="distinction.description"
										contenteditable
									></div>

									<ul class="distinction-sfx" v-if="distinction.sfx.length">

										<li v-for="(sfx, s) in distinction.sfx">

											<span class="sfx-name"
												v-html="sfx.name"
												contenteditable
												@blur="editContent( $event, ['distinctions', d, 'sfx', s, 'name'] )"
											></span>:

											<span class="sfx-description"
												v-html="sfx.description"
												contenteditable
												@blur="editContent( $event, ['distinctions', d, 'sfx', s, 'description'] )"
											></span>

										</li>

									</ul>

								</div>
							</div>

						</div>

						<!-- TRAITS -->
						<div :class="'trait-group ' + set.style"
							v-for="(set, s) in sets"
							v-if="set.column === 1"
						>

							<div id="context-menu-button" class="no-print"></div>

							<div class="trait-group-header"
								v-html="set.name"
								contenteditable
								@blur="editContent( $event, ['set', s, 'name'] )"
							></div>

							<div class="traits" v-for="column in 2">

								<div class="trait" v-for="(trait, t) in set.traits" v-if="trait.column === column">

									<div id="remove-item" class="no-print"
										@click.prevent="removeTrait(s,t)"
									></div>

									<h2 class="inline"
										v-html="trait.name"
										contenteditable
										@blur="editContent( $event, ['set', s, 'trait', t, 'name'] )"
									></h2>
									
									<h2>
										<span class="c"
											v-html="trait.value"
											contenteditable
											@blur="editContent( $event, ['set', s, 'trait', t, 'name'] )"
										></span>
									</h2>

									<hr>

									<div
										v-html="trait.description"
										contenteditable
										@blur="editContent( $event, ['set', s, 'trait', t, 'description'] )"
									></div>

								</div>

								<!-- BUTTON: ADD TRAIT -->
								<div id="trait-placeholder" class="add-item no-print"
									@click.prevent="addTrait( s, column )"
								></div>

							</div>

						</div>

						<!-- BUTTON: ADD TRAIT GROUP -->
						<div id="trait-group-placeholder" class="add-item no-print"
							@click.prevent="addSet(1)"
						></div>
						
					</div>

					<!-- RIGHT COLUMN -->
					<div class="right">

						<!-- IMAGE -->
						<div id="portrait">
							<div id="circle" width=100% height=100%>
								<div id="edit-image" class="no-print"></div>
								<img src="" width="110%" draggable="false" id="image"></img>
							</div>
						</div>

						<!-- ATTRIBUTES -->
						<div id="attribute-curve" xmlns="http://www.w3.org/2000/svg" :style="'display: ' + ( attributes.length >= 2 ? 'block' : 'none' ) + ';'">
							<svg viewBox="0 0 62 62" width="62mm" height="30mm" preserveAspectRatio="xMidYMid slice">
								<path d="M -17 -25 A 32 32 0 0 0 79 0" stroke="#C50852" stroke-width="0.5mm" fill="transparent" vector-effect="non-scaling-stroke"/>
							</svg>
						</div>

						<div id="attributes" :class="{ 'vertical': attributes.length > 5 }">
							<div v-for="( attribute, a ) in attributes"
								:class="{ 'attribute': true, 'vertical': attributes.length > 5 }"
								:style="getAttributeStyle( a )"
							>

								<span class="c"
									v-html="attribute.value"
									contenteditable
									@blur="editContent( $event, ['attributes', a, 'value'] )"
								></span>

								<div
									v-html="attribute.name"
									contenteditable
									@blur="editContent( $event, ['attributes', a, 'name'] )"
								></div>

								<div id="remove-item" class="no-print"
									@click.prevent="removeAttribute(a)"
								></div>

							</div>

							<!-- BUTTON: ADD ATTRIBUTE -->
							<div id="attribute-placeholder" class="add-item no-print"
								@click.prevent="addAttribute()"
							></div>
							
						</div>

						<!-- TRAITS -->
						<div :class="'trait-group ' + set.style"
							v-for="(set, s) in sets"
							v-if="set.column === 2"
						>

							<div id="context-menu-button" class="no-print"></div>

							<div class="trait-group-header"
								v-html="set.name"
								contenteditable
								@blur="editContent( $event, ['set', s, 'name'] )"
							></div>

							<div class="traits" v-for="column in 2">

								<div class="trait" v-for="(trait, t) in set.traits" v-if="trait.column === column">

									<div id="remove-item" class="no-print"
										@click.prevent="removeTrait(s,t)"
									></div>

									<h2 class="inline"
										v-html="trait.name"
										contenteditable
										@blur="editContent( $event, ['set', s, 'trait', t, 'name'] )"
									></h2>
									
									<h2>
										<span class="c"
											v-html="trait.value"
											contenteditable
											@blur="editContent( $event, ['set', s, 'trait', t, 'name'] )"
										></span>
									</h2>

									<hr>

									<div
										v-html="trait.description"
										contenteditable
										@blur="editContent( $event, ['set', s, 'trait', t, 'description'] )"
									></div>

								</div>

								<!-- BUTTON: ADD TRAIT -->
								<div id="trait-placeholder" class="add-item no-print"
									@click.prevent="addTrait( s, column )"
								></div>

							</div>

						</div>

						<!-- BUTTON: ADD TRAIT GROUP -->
						<div id="trait-group-placeholder" class="add-item no-print"
							@click.prevent="addSet(2)"
						></div>

					</div>

				</div> <!-- .content -->
			</div> <!-- .page -->
		</div> <!-- .pages -->
	</article>`,

	methods: {

		export() {
			return {
				name:         this.name,
				description:  this.description,
				distinctions: this.distinctions,
				attributes:   this.attributes,
				sets:         this.sets,
				image:        this.image,
			}
		},

		editContent( event, location ) {
			let content = event.target.innerText;

			switch ( location[0] ) {
				case 'name':
					this.name = this.sanitizeString(content);
					break;
				case 'description':
					this.description = this.sanitizeString(content);
					break;
				case 'distinctions':
					let d = location[1];
					let distinction = this.distinctions[d];
					switch ( location[2] ) {
						case 'name':
							distinction.name = this.sanitizeString(content);
							break;
						case 'value':
							distinction.name = Number(content);
							break;
						case 'description':
							distinction.name = this.sanitizeString(content);
							break;
						case 'sfx':
							let s = location[3];
							switch ( location[4] ) {
								case 'name':
									distinction.sfx[s].name = this.sanitizeString(content);
									break;
								case 'description':
									distinction.sfx[s].description = this.sanitizeString(content);
									break;
								default: break;
							}
						default: break;
					}
					this.$set(this.distinctions, d, distinction);
					break;
				case 'attributes':
					let a = location[1];
					let attribute = this.attributes[a];
					switch ( location[2] ) {
						case 'name':
							attribute.name = this.sanitizeString(content);
							break;
						case 'value':
							attribute.name = Number(content);
							break;
						case 'description':
							attribute.name = this.sanitizeString(content);
							break;
						default: break;
					}
					this.$set(this.attributes, a, attribute);
					break;
				case 'set':
					let s = location[1];
					let set = this.sets[s];
					switch ( location[2] ) {
						case 'name':
							set.name = this.sanitizeString(content);
							break;
						case 'trait':
							let t = location[3];
							let trait = set.traits[t];
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
								default: break;
							}
							set.traits[t] = trait;
							break;
						default: break;
					}
					this.$set(this.sets, s, set);
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
		
		addSet( columnID ) {

			this.sets.push({
				name: 'New trait group',
				style: 'default',
				column: columnID,
				traits: [
					{
						name: 'New trait',
						value: 6,
						description: 'Trait description',
						column: 1
					}
				],
			});

			this.$emit('edited', this.export() );

		},
		
		addTrait( setID, columnID ) {

			let set = this.sets[setID];

			set.traits.push({
				name: 'New trait',
				value: 6,
				description: 'Trait description',
				column: columnID
			});

			this.$set(this.sets, setID, set);

			this.$emit('edited', this.export() );

		},
		
		removeTrait( setID, traitID ) {

			let set = this.sets[setID];

			set.traits.splice(traitID, 1);

			this.$set(this.sets, setID, set);

			this.$emit('edited', this.export() );

		},
		
		addAttribute() {

			this.attributes.push({
				name: 'Attribute',
				value: 8,
				description: 'Description'
			});

			this.$emit('edited', this.export() );

		},
		
		removeAttribute( attributeID ) {

			this.attributes.splice(attributeID, 1);

			this.$emit('edited', this.export() );

		},

	}

});
