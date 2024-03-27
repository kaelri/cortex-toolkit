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

			year() {
				return ( new Date() ).getFullYear();
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
							<li @click.stop="setMode('roster', null)" :class="{ active: mode === 'roster' }"><div><span class="nav-icon"><i class="fas fa-users"></i></span></div></li>
							<li @click.stop="setMode('character', 'edit')" :class="{ active: mode === 'character' && submode === 'edit', 'disabled': !character }"><div><span class="nav-icon"><i class="fas fa-pencil"></i></span> <span class="nav-label">Create</span></div></li>
							<li @click.stop="setMode('character', 'play')" :class="{ active: mode === 'character' && submode === 'play', 'disabled': !character }"><div><span class="nav-icon"><i class="fas fa-dice"></i></span> <span class="nav-label">Play</span></div></li>
							<li @click.stop="setMode('character', 'print')" :class="{ active: mode === 'character' && submode === 'print', 'disabled': !character }"><div><span class="nav-icon"><i class="fas fa-file"></i></span> <span class="nav-label">Share</span></div></li>
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
						@exportCharacter="exportCharacter"
						@deleteCharacter="deleteCharacter"
						@importCharacter="importCharacter"
					></roster>

					<character
						v-else-if="mode === 'character' && character"
						:submode="submode"
						:character="character"
						:editing="editing"
						:viewY="viewY"
						@selectElement="selectElement"
						@updateCharacter="updateCharacter"
						@exportCharacter="exportCharacter"
					></character>

					<article class="about"
						v-else-if="mode === 'about'"
					>

						<h1>About Cortex Toolkit</h1>
						
						<p>Cortex Prime is the award-winning world-building tabletop RPG system for forging unique, compelling game experiences from a set of modular rules mechanics available at <a href="https://www.cortexrpg.com" target="_blank">CortexRPG.com</a>.</p>

						<p>Cortex is ©️ {{year}} Dire Wolf Digital, LLC. Cortex, Cortex Prime, associated logos and trade dress are the trademarks of Dire Wolf Digital, LLC. Iconography used with permission.</p>

						<p>If you wish to publish or sell what you make using this tool, it is your responsibility to ensure you have the proper license or right for any resources used. No rights are granted through the use of this tool.</p>

					</article>

				</transition>

			</main>

			<footer class="footer">
				<div class="footer-inner">

					<div class="footer-colophon">
						<a href="https://www.cortexrpg.com" target="_blank"><img src="images/cortex_prime_logo_light_background.png"></a>
					</div>

					<nav class="footer-nav">
						<ul>
							<li @click.stop="setMode('about', null)" :class="{ active: mode === 'about' }"><div><span class="nav-icon"><i class="far fa-question-circle"></i></span></div></li>
							<li><a href="https://github.com/kaelri/cortex-toolkit" target="_blank" title="View on GitHub"><div><span class="nav-icon"><i class="fab fa-github"></i></span></div></a></li>
						</ul>
					</nav>

				</div>
			</footer>
			
			<div class="legal">
			</div>`,
		
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

				let character = structuredClone( cortexFunctions.defaultCharacter );

				character.id = crypto.randomUUID();

				character.dateCreated  = ( new Date() ).toISOString();
				character.dateModified = ( new Date() ).toISOString();
				character.dateTouched  = ( new Date() ).toISOString();

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

			importCharacter( character, confirm ) {

				character.dateTouched = ( new Date() ).toISOString();

				// Populate custom data sets for this app.
				for (let i = 0; i < character.traitSets.length; i++) {
					const traitSet = character.traitSets[i];

					if ( !traitSet.custom.cortexToolkit ) {
						traitSet.custom.cortexToolkit = structuredClone( cortexFunctions.defaultTraitSet.custom.cortexToolkit );
					}
					
				}

				if ( !character.portrait.custom.cortexToolkit ) {
					character.portrait.custom.cortexToolkit = structuredClone( cortexFunctions.defaultCharacter.portrait.custom.cortexToolkit );
				}

				let c = this.characters.findIndex( existingCharacter => existingCharacter.id === character.id );

				if ( c !== -1 ) {
					this.characters[c] = character;
				} else {
					this.characters.push( character );
				}

				this.saveLocalData();

			},

			loadCharacter( id ) {

				this.characterID = id;

				this.setMode( 'character', this.submode ?? 'edit' );

			},

			exportCharacter( id ) {

				let character = this.characters.find( character => character.id === id );

				let uri = encodeURI("data:application/json;charset=utf-8," + JSON.stringify(character, null, 2))
				.replace(/#/g, '%23');

				let name = character.name.length ? character.name : 'Name';
				let timestamp = ( new Date(character.dateModified) ).getTime();
				name = name.replaceAll( /\s+/g, '_' );
				let filename = `${name}_${timestamp}.cortex.json`;

				let link = document.createElement("a");
				document.body.appendChild(link); // Required for Firefox
				link.setAttribute('href', uri);
				link.setAttribute('download', filename);
				link.click();
				link.remove();

			},

			exportAllCharacters() {

				let uri = encodeURI("data:application/json;charset=utf-8," + JSON.stringify(this.characters))
				.replace(/#/g, '%23');

				let timestamp = ( new Date() ).getTime();
				let filename  = `CortexToolkitData_${timestamp}.json`;

				let link = document.createElement("a");
				document.body.appendChild(link); // Required for Firefox
				link.setAttribute('href', uri);
				link.setAttribute('download', filename);
				link.click();
				link.remove();

			},

			updateCharacter( character ) {

				let c = this.characters.findIndex( savedCharacter => savedCharacter.id === character.id );

				if ( c === -1 ) return;

				character.dateModified = ( new Date() ).toISOString();
				character.dateTouched  = ( new Date() ).toISOString();

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

				let localJSON = localStorage.getItem('cortexToolkitData');
				if ( !localJSON || !localJSON.length ) return;

				let localData = JSON.parse(localJSON);
				if ( !localData || !localData['0.1'] ) return;

				if ( localData['0.1'].characters ) {
					this.characters = localData['0.1'].characters;
				}

			},

			saveLocalData() {

				localStorage.setItem('cortexToolkitData', JSON.stringify({
					'0.1': {
						characters: this.characters,
					}
				}));
			},

			clearLocalData() {
				localStorage.setItem('cortexToolkitData', null);
			}

		}

	})
	.component('roster',           Roster )
	.component('character',        Character )
	.component('name-editor',      NameEditor )
	.component('portrait-editor',  PortraitEditor )
	.component('trait-editor',     TraitEditor )
	.component('trait-set-editor', TraitSetEditor )
	.component('subtrait-editor',  SubtraitEditor )
	.component('sfx-editor',       SfxEditor )
	.mount('#cortex-toolkit');

});
