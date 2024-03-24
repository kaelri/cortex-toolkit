document.addEventListener('DOMContentLoaded', () => {

	app = Vue.createApp({

		name: 'cortex-toolkit',

		data() {
			return {
				characters:   [],
				characterID:  null,
				viewY:        null,
				mode:         'roster',
				submode:      null,
				editing:      null,
			}
		},

		computed: {

			baseURL() {
				return window.location.href;
			},

			characterIndex() {
				return this.characters.findIndex( character => character.id === this.characterID );
			},

			character() {
				return this.characters[ this.characterIndex ];
			},

		},

		/*html*/
		template: `<header class="header">
				<div class="header-inner">
					<nav class="nav-mode">
						<ul>
							<li @click.stop="setMode('roster', null)" :class="{ active: mode === 'roster' }"><div><span class="nav-mode-icon"><i class="fas fa-users"></i></span></div></li>
							<li @click.stop="setMode('character', 'edit')" :class="{ active: mode === 'character' && submode === 'edit', 'disabled': !character }"><div><span class="nav-mode-icon"><i class="fas fa-pencil"></i></span> <span class="nav-mode-label">Create</span></div></li>
							<li @click.stop="setMode('character', 'play')" :class="{ active: mode === 'character' && submode === 'play', 'disabled': !character }"><div><span class="nav-mode-icon"><i class="fas fa-dice"></i></span> <span class="nav-mode-label">Play</span></div></li>
							<li @click.stop="setMode('character', 'print')" :class="{ active: mode === 'character' && submode === 'print', 'disabled': !character }"><div><span class="nav-mode-icon"><i class="fas fa-file"></i></span> <span class="nav-mode-label">Share</span></div></li>
						</ul>
					</nav>
				</div>
			</header>

			<aside class="sidebar">
				<div class="sidebar-inner">
				</div>
			</aside>

			<main class="main" ref="main" @scroll="setViewY"
				@click.stop="clearSelected"
			>
			
				<!-- CHARACTER SHEET -->
				<transition mode="out-in">

					<roster
						v-if="mode === 'roster'"
						:characters="characters"
						@createCharacter="createCharacter"
						@loadCharacter="loadCharacter"
						@deleteCharacter="deleteCharacter"
					></roster>

					<character-sheet
						v-else-if="mode === 'character' && character"
						:submode="submode"
						:character="character"
						:editing="editing"
						:viewY="viewY"
						@selectElement="selectElement"
						@update="updateCharacter"
					></character-sheet>

				</transition>

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
			this.loadLocalData();

		},

		watch: {

			mode() {
				this.setPageTitle();
			},

			characterID() {
				this.setPageTitle();
			}

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
				if ( this.mode === 'character' && this.character && this.character.name.length ) {
					pageTitle = `${this.character.name} - ${pageTitle}`;
				}
				document.title = pageTitle;
			},

			// DATA

			createCharacter() {

				let character = structuredClone( cortexCharacterDefault );

				character.id       = crypto.randomUUID();
				character.modified = ( new Date() ).getTime();

				this.characters.push( character );
				this.characterID = character.id;
				this.setMode( 'character', this.submode ?? 'edit' );

				this.saveLocalData();

			},

			deleteCharacter( id ) {
				
				let c = this.characters.findIndex( character => character.id === id );
				if ( c === -1 ) return;

				this.setMode( 'roster', null );
				this.characterID = null;
				this.characters.splice( c, 1 );
				this.setPageTitle();

				this.saveLocalData();

			},

			loadCharacter( id ) {

				this.characterID = id;

				this.setMode( 'character', this.submode ?? 'edit' );

			},

			updateCharacter( character ) {

				let c = this.characters.findIndex( savedCharacter => savedCharacter.id === character.id );

				if ( c === -1 ) return;

				character.modified = ( new Date() ).getTime();

				this.characters[c] = character;
				this.setPageTitle();

				this.saveLocalData();

			},

			selectElement( selector ) {

				if ( cortexFunctions.arraysMatch( this.editing, selector ) ) {
					this.editing = [];
					return;
				}

				this.editing = selector;

			},

			clearSelected() {
				this.selectElement([]);
			},

			loadLocalData() {

				let characters = [];

				let localJSON = localStorage.getItem('cortexToolkitData');
				if ( localJSON && localJSON.length ) {

					let localData = JSON.parse(localJSON);
					if ( localData && localData.characters ) {
						characters = localData.characters;
					}
	
				}

				this.characters = characters;

			},

			saveLocalData() {

				localStorage.setItem('cortexToolkitData', JSON.stringify({
					characters: this.characters,
				}));
			},

		}

	})
	.component('roster',           Roster )
	.component('character-sheet',  CharacterSheet )
	.component('name-editor',      NameEditor )
	.component('portrait-editor',  PortraitEditor )
	.component('trait-editor',     TraitEditor )
	.component('trait-set-editor', TraitSetEditor )
	.component('sfx-editor',       SfxEditor )
	.mount('#cortex-toolkit');

});
