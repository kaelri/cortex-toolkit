document.addEventListener('DOMContentLoaded', () => {

	new Vue({

		name: 'cortex-toolkit',

		el: '#cortex-toolkit',

		data: {
			character: null,
			selected:  null,
			viewY:     null,

		},

		computed: {

			baseURL() {
				return window.location.href;
			}

		},

		/*html*/
		template: `<article id="cortex-toolkit">
		
			<header class="header">
				<div class="header-inner">

				</div>
			</header>

			<main class="main" ref="main" @scroll="setViewY">
			
				<!-- CHARACTER SHEET -->
				<character-sheet
					v-if="character"
					:character="character"
					:selected="selected"
					:viewY="viewY"
					@select="select"
					@update="updateCharacter"
				></character-sheet>

			</main>

			<aside class="about">

				<div class="about-logo">
					<a href="https://cortexrpg.com" target="_blank"><img src="images/cortex_community_logo_white.png"></a>
				</div>

				<div class="about-legal">
					<p>Cortex Prime is the award-winning world-building tabletop RPG system for forging unique, compelling game experiences from a set of modular rules mechanics available at CortexRPG.com </p>
					<p>Cortex is ©️ 2022 Fandom, Inc. Cortex, Cortex Prime, associated logos and trade dress are the trademarks of Fandom, Inc. Iconography used with permission.</p>
					<p>If you wish to publish or sell what you make using this tool, it is your responsibility to ensure you have the proper license or right for any resources used. No rights are granted through the use of this tool.</p>
				</div>

			</aside>

		</article>`,
		
		mounted() {

			this.setViewY();
			this.loadLocal();

		},

		watch: {
			character( character ) {
				pageTitle = 'Cortex Toolkit';
				if ( character.name && character.name.length ) {
					pageTitle = `${character.name} | ${pageTitle}`;
				}
				document.title = pageTitle;
			},
		},

		methods: {

			// VIEW

			setViewY( event ) {
				this.viewY = this.$refs.main.scrollTop;
			},

			// MANAGEMENT

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

			async loadLocal() {

				let character = null;

				let localJSON = localStorage.getItem('cortexToolkitData');
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

				localStorage.setItem('cortexToolkitData', JSON.stringify({
					character: this.character,
				}));
			},

		}

	});

});
