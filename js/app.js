document.addEventListener('DOMContentLoaded', () => {

	new Vue({

		name: 'cortex-tools',

		el: '#cortex-tools',

		data: {
			baseURL:   window.location.href,
			character: null,
			selected:  null,

		},

		computed: {

		},

		/*html*/
		template: `<article id="cortex-tools">
		
			<header class="header">

				<div class="header-collapsed-content">
				</div>

				<div class="header-expanded-content">

					<section class="controls">

						<!-- CHARACTER EDITOR -->
						<character-editor
							ref="characterEditor"
							v-if="character"
							:character="character"
							:selected="selected"
							@update="updateCharacter"
							@select="select"
						></character-editor>

					</section>

					<footer class="footer">

						<div class="footer-logo">
							<a href="https://cortexrpg.com" target="_blank"><img src="images/cortex_community_logo_white.png"></a>
						</div>

						<div class="footer-legal">
								<p>Cortex Prime is the award-winning world-building tabletop RPG system for forging unique, compelling game experiences from a set of modular rules mechanics available at CortexRPG.com </p>
								<p>Cortex is ©️ 2022 Fandom, Inc. Cortex, Cortex Prime, associated logos and trade dress are the trademarks of Fandom, Inc. Iconography used with permission.</p>
								<p>If you wish to publish or sell what you make using this tool, it is your responsibility to ensure you have the proper license or right for any resources used. No rights are granted through the use of this tool.</p>
						</div>

					</footer>

				</div>
				
			</header>

			<main class="main">
			
				<!-- CHARACTER SHEET -->
				<character-sheet
					v-if="character"
					:character="character"
					:selected="selected"
					@addTraitSet="addTraitSet"
					@addTrait="addTrait"
					@select="select"
				></character-sheet>

			</main>

		</article>`,
		
		mounted() {

			this.loadLocal();

		},

		watch: {
			character( character ) {
				pageTitle = 'Cortex Tools';
				if ( character.name && character.name.length ) {
					pageTitle = `${character.name} | ${pageTitle}`;
				}
				document.title = pageTitle;
			},
		},

		methods: {

			async createDefaultCharacter() {

				let character = await fetch( this.baseURL + 'data/cortex_character_default.json' )
				.then( response => response.json() );

				//+ Check for errors

				character.id = crypto.randomUUID();
				character.modified = ( new Date() ).getTime();

				return character;

			},

			updateCharacter( character ) {
				this.character = character;
				this.saveLocal();
			},

			select( selector ) {

				if ( cortexFunctions.arraysMatch( this.selected, selector ) ) {
					this.selected = [];
					return;
				}

				this.selected = selector;

			},

			addTraitSet( location ) {
				this.$refs.characterEditor.addTraitSet( location );
			},

			addTrait( traitSetID, location ) {
				this.$refs.characterEditor.addTrait( traitSetID, location );
			},

			async loadLocal() {

				let character = null;

				let localJSON = localStorage.getItem('cortexToolsData');
				if ( localJSON && localJSON.length ) {

					let localData = JSON.parse(localJSON);
					if ( localData ) {
						character = localData.character;
					}
	
				}

				if ( !character ) {
					character = await this.createDefaultCharacter();
				}

				this.character = character;

			},

			saveLocal() {

				this.character.modified = ( new Date() ).getTime();

				localStorage.setItem('cortexToolsData', JSON.stringify({
					character: this.character,
				}));
			},

		}

	});

});
