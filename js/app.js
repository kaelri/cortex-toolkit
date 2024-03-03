document.addEventListener('DOMContentLoaded', () => {

	new Vue({

		name: 'cortex-tools',

		el: '#cortex-tools',

		data: {
			baseURL: window.location.href,
			character: null,
		},

		computed: {

		},

		/*html*/
		template: `<article id="cortex-tools">
		
			<header></header>
			
			<!-- CHARACTER SHEET -->
			<character-sheet
				v-if="character"
				:character="character"
				:editable="true"
				@edited="setCharacter"
			></character-sheet>

			<!-- FOOTER -->
			<footer>
				<div id="disclaimer">
					<div id="logo" class="non-serialized">
						<a href="https://cortexrpg.com" target="_blank"><img src="images/Community_Cortex_PRIMED_BY_LBG.png"></a>
					</div>
					<div id="legal"> 
						<p>Cortex Prime is the award-winning world-building tabletop RPG system for forging unique, compelling game experiences from a set of modular rules mechanics available at CortexRPG.com </p>
						<p>Cortex is ©️ 2022 Fandom, Inc. Cortex, Cortex Prime, associated logos and trade dress are the trademarks of Fandom, Inc. Iconography used with permission.</p>
						<p>If you wish to publish or sell what you make using this tool, it is your responsibility to ensure you have the proper license or right for any resources used. No rights are granted through the use of this tool.</p>
					</div>
				</div>
			</footer>
			
		</article>`,
		
		mounted() {

			this.loadLocal();

		},

		methods: {

			async createDefaultCharacter() {

				let character = await fetch( this.baseURL + 'data/cortex_character_default.json' )
				.then( response => response.json() );

				//+ Check for errors

				// character.id = crypto.randomUUID();

				return character;

			},

			setCharacter( character ) {
				this.character = character;
				this.saveLocal();
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
				localStorage.setItem('cortexToolsData', JSON.stringify({
					character: this.character,
				}));
			},

		}

	});

});
