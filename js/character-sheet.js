Vue.component('characterSheet', {

	props: {
		character: Object,
		selected:  Array
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
	template: `<section class="character-sheet">
	
		<div class="pages">

			<!-- PAGE -->
			<div class="page">
				<div class="page-inner">

					<header :class="{'page-header': true, 'selected': isSelected(['name'])}"
						@click.prevent="select([ 'name' ])"
					>

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

					</header>

					<!-- COLUMNS -->
					<div class="columns">

						<div v-for="pageLocation in ['left', 'right']" :class="'column-' + pageLocation">

							<!-- IMAGE -->
							<div :class="{ 'portrait': true, 'selected': isSelected(['portrait']) }" v-if="pageLocation === 'right'"
								@click.prevent="select([ 'portrait' ])"
							>
								<div class="portrait-circle" width=100% height=100%>
									<img src="" width="110%" draggable="false" class="image"></img>
								</div>
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
											:class="{ 'attribute': true, 'selected': isSelected(['trait', attributesID, a]) }"
											:style="getAttributeStyle( a )"
											@click.prevent="select([ 'trait', attributesID, a ])"
										>

											<span class="c"
												v-html="renderDieValue(attribute.value)"
											></span>

											<div class="attribute-name"
												v-html="attribute.name"
											></div>

										</div>

									</div>

								</div>

								<!-- BUTTON: ADD ATTRIBUTE -->
								<div class="preview-button-container"
									v-if="pageLocation === 'right'"
								>
									<div class="preview-button"
										@click.prevent="addTrait( attributesID )"
									>
										<span><i class="fas fa-plus"></i> New Attribute</span>
									</div>
								</div>

							</div>
								
							<!-- TRAITS -->
							<div :class="'trait-set style-' + traitSet.style"
								v-for="(traitSet, s) in traitSets"
								v-if="traitSet.location === pageLocation"
							>

								<div :class="{'trait-set-header': true, 'selected': isSelected(['traitSet', s])}"
									@click.prevent="select([ 'traitSet', s ])"
								>
									<div v-html="traitSet.name"></div>
								</div>

								<div class="trait-columns">
									<div class="trait-column" v-for="traitSetLocation in ['left', 'right']">

										<div :class="{ 'trait': true, 'selected': isSelected(['trait', s, t]) }"
											v-for="(trait, t) in traitSet.traits"
											v-if="trait.location === traitSetLocation"
											@click.prevent="select([ 'trait', s, t ])"
										>

											<h2 class="trait-title">

												<span class="trait-name"
													v-html="trait.name"
												></span>
											
												<span class="trait-value c"
													v-html="renderDieValue(trait.value)"
												></span>

											</h2>

											<hr>

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

										<!-- BUTTON: ADD TRAIT -->
										<div class="preview-button-container">
											<div class="preview-button"
												@click.prevent="addTrait( s, traitSetLocation )"
											>
												<span><i class="fas fa-plus"></i> New Trait</span>
											</div>
										</div>

									</div> <!-- .trait-column -->
								</div> <!-- .trait-columns -->

							</div>

							<!-- BUTTON: ADD TRAIT SET -->
							<div class="preview-button-container">
								<div class="trait-set-placeholder preview-button"
									@click.prevent="addTraitSet( pageLocation )"
								>
									<span><i class="fas fa-plus"></i> New Trait Set</span>
								</div>
							</div>
							
						</div>

					</div> <!-- .columns -->
				</div> <!-- .page-inner -->
			</div> <!-- .page -->
		</div> <!-- .pages -->
	</section>`,

	methods: {

		isSelected( selector ) {
			return cortexFunctions.arraysMatch( this.selected, selector );
		},

		renderText( text ) {
			text = text.replace( /d\d*(\d)/g, '<span class="c">$1</span>' );
			// text = text.replace( '<span class="c">1(\d)</span>', '<span class="c">$1</span>' );
			text = text.replace( /([^A-Za-z])PP([^A-Za-z])/gi, '$1<span class="pp">PP</span>$2' );
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
		
		addTraitSet( location ) {
			this.$emit( 'addTraitSet', location );
		},

		addTrait( traitSetID, location ) {
			this.$emit( 'addTrait', traitSetID, location );
		},

		select( selector ) {
			this.$emit( 'select', selector );
		}
		
	}

});
