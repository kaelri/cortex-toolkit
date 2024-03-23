document.addEventListener('DOMContentLoaded', () => {

	app = Vue.createApp({

		name: 'cortex-toolkit',

		data() {
			return {
				characters: [],
				character:  null,
				viewY:      null,
				mode:       'character',
				submode:    'edit',
				editing:    null,
			}
		},

		computed: {

			baseURL() {
				return window.location.href;
			}

		},

		/*html*/
		template: `<header class="header">
				<div class="header-inner">
					<nav class="nav-mode">
						<ul>
							<li @click.stop="setMode('roster', null)" :class="{ active: mode === 'roster' }"><div><span class="nav-mode-icon"><i class="fas fa-users"></i></span></div></li>
							<li @click.stop="setMode('character', 'edit')" :class="{ active: mode === 'character' && submode === 'edit', 'disabled': !character }"><div><span class="nav-mode-icon"><i class="fas fa-pencil"></i></span> Create</div></li>
							<li @click.stop="setMode('character', 'play')" :class="{ active: mode === 'character' && submode === 'play', 'disabled': !character }"><div><span class="nav-mode-icon"><i class="fas fa-dice"></i></span> Play</div></li>
							<li @click.stop="setMode('character', 'print')" :class="{ active: mode === 'character' && submode === 'print', 'disabled': !character }"><div><span class="nav-mode-icon"><i class="fas fa-file"></i></span> Print</div></li>
						</ul>
					</nav>
				</div>
			</header>

			<aside class="sidebar">
				<div class="sidebar-inner">
				</div>
			</aside>

			<main class="main" ref="main" @scroll="setViewY">
			
				<!-- CHARACTER SHEET -->
				<transition-group appear>

					<character-sheet
						v-if="mode === 'character' && character"
						:submode="submode"
						:character="character"
						:editing="editing"
						:viewY="viewY"
						@selectElement="selectElement"
						@update="updateCharacter"
					></character-sheet>



				</transition-group>

			</main>

			<footer class="footer">

				<div class="about-logo">
					<a href="https://cortexrpg.com" target="_blank"><img src="images/cortex_community_logo_white.png"></a>
				</div>

				<div class="about-legal">
					<p>Cortex Prime is the award-winning world-building tabletop RPG system for forging unique, compelling game experiences from a set of modular rules mechanics available at CortexRPG.com </p>
					<p>Cortex is ©️ 2022 Fandom, Inc. Cortex, Cortex Prime, associated logos and trade dress are the trademarks of Fandom, Inc. Iconography used with permission.</p>
					<p>If you wish to publish or sell what you make using this tool, it is your responsibility to ensure you have the proper license or right for any resources used. No rights are granted through the use of this tool.</p>
				</div>

			</footer>`,
		
		mounted() {

			this.setViewY();
			this.loadLocal();

		},

		methods: {

			// VIEW

			setMode( mode, submode ) {
				if ( mode === 'character' && !this.character ) return;
				this.mode    = mode;
				this.submode = submode;
			},

			setViewY() {
				this.viewY = this.$refs.main.scrollTop;
			},

			setPageTitle() {
				pageTitle = 'Cortex Toolkit';
				if (this.character && this.character.name.length ) {
					pageTitle = `${this.character.name} - ${pageTitle}`;
				}
				document.title = pageTitle;
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
				this.setPageTitle();
			},

			selectElement( selector ) {

				if ( cortexFunctions.arraysMatch( this.editing, selector ) ) {
					this.editing = [];
					return;
				}

				this.editing = selector;

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
				this.setPageTitle();

			},

			saveLocal() {

				this.character.modified = ( new Date() ).getTime();

				localStorage.setItem('cortexToolkitData', JSON.stringify({
					character: this.character,
				}));
			},

		}

	})
	.component('character-sheet',  CharacterSheet )
	.component('name-editor',      NameEditor )
	.component('portrait-editor',  PortraitEditor )
	.component('trait-editor',     TraitEditor )
	.component('trait-set-editor', TraitSetEditor )
	.component('sfx-editor',       SfxEditor )
	.mount('#cortex-toolkit');

});
