const Roster = {

	props: {
		characters: Array,
	},

	data() {
		return {
			showImportConfirm: false,
			importQueue:       [],
			importBuffer:      null,
		};
	},

	computed: {

		charactersSorted() {
			return this.characters.sort((a, b) => {

				let aDate = Math.max( ( new Date(a.dateCreated)).getTime(), ( new Date(a.dateModified)).getTime(), ( new Date(a.dateTouched) ).getTime() );
				let bDate = Math.max( ( new Date(b.dateCreated)).getTime(), ( new Date(b.dateModified)).getTime(), ( new Date(b.dateTouched) ).getTime() );

				return bDate - aDate;

			});
		}

	},

	/*html*/
	template: `<section class="roster">
		<div class="roster-inner">
	
			<!-- BUTTON: ADD/IMPORT CHARACTER -->
			<div class="roster-button-container">
				<div class="roster-button-container-inner">

					<div class="roster-button"
						@click.stop="createCharacter"
					>
						<span><i class="fas fa-plus"></i> New Character</span>
					</div>

					<div class="roster-button roster-button-import"
						@click.stop="importStart"
					>
						<span><i class="fas fa-upload"></i> Import Character</span>
					</div>

				</div>
			</div>

			<!-- CHARACTER LIST -->
			<ul class="roster-list">

				<transition-group appear>
				<li class="roster-item"
					v-for="character in charactersSorted" :key="character.id"
				>

					<div>

						<div :class="'roster-item-portrait alignment-' + character.portrait.custom.cortexToolkit.alignment"
							:style="'background-image: url(' + character.portrait.url + ');'"
							@click.stop="loadCharacter( character.id )"
						>
							<div class="roster-item-portrait-placeholder" v-if="!character.portrait.url.length"><i class="fas fa-user"></i></div>
						</div>

					</div>

					<div>

						<h3 class="roster-item-name" v-text="character.name"
							@click.stop="loadCharacter( character.id )"
						></h3>
						
						<div class="roster-description" v-text="character.description"></div>

						<div class="roster-date">
							<span class="roster-date-label">Last modified: </span>
							<span v-html="renderDate(character.dateModified)"></span>
						</div>

						<div class="roster-item-button-container">
							<div class="roster-item-button-container-inner">

								<!-- LOAD -->
								<div class="roster-item-button"
									@click.stop="loadCharacter( character.id )"
								>
									<span><i class="fas fa-eye"></i> Open</span>
								</div>

								<!-- EXPORT -->
								<div class="roster-item-button roster-button-export"
									@click.stop="exportCharacter( character.id )"
								>
									<span><i class="fas fa-download"></i> Export</span>
								</div>

								<!-- DELETE -->
								<div class="roster-item-button roster-button-delete"
									@click.stop="deleteCharacter( character.id )"
								>
									<span><i class="fas fa-trash"></i> Delete</span>
								</div>

							</div>
						</div>

					</div>

				</li>
				</transition-group>

			</ul>

			<!-- BUTTON: ADD/IMPORT CHARACTER -->
			<!-- <div class="roster-button-container">
				<div class="roster-button-container-inner">

					<div class="roster-button"
						@click.stop="createCharacter"
					>
						<span><i class="fas fa-plus"></i> New Character</span>
					</div>

					<div class="roster-button roster-button-import"
						@click.stop="importCharacterStart"
					>
						<span><i class="fas fa-upload"></i> Import Character</span>
					</div>

				</div>
			</div> -->

			<!-- FILE INPUT -->
			<input class="roster-input" type="file" ref="inputFile" @change="importGetUploads" multiple>

		</div>
			
		<transition>
		<div class="modal-veil" v-show="showImportConfirm" @click.stop="importCancel()"></div>
		</transition>

		<transition>
		<aside class="modal" v-if="showImportConfirm">
			<div class="modal-close" @click.prevent="importCancel()"><i class="fas fa-times"></i></div>
			<div class="modal-inner">

				<p>A character with this ID already exists. Do you want to replace it?</p>

				<div class="modal-import-details">
					<div>
						<p>
							<span class="modal-import-prefix">Replace this…</span><br>
							{{importBuffer.oldCharacter.name}}<br>
							<span class="modal-import-date">{{renderDate( importBuffer.oldCharacter.dateModified )}}</span>
						</p>
					</div>
					<div>
						<p>
							<span class="modal-import-prefix">…with this?</span><br>
							{{importBuffer.newCharacter.name}}<br>
							<span class="modal-import-date">{{renderDate( importBuffer.newCharacter.dateModified )}} <span class="modal-import-date-suffix">({{ getRelativeDateLabel(importBuffer.oldCharacter.dateModified, importBuffer.newCharacter.dateModified) }})</span></span>
						</p>
					</div>
				</div>

				<div class="modal-button-container">
					<div class="modal-button-container-inner">
						<div class="modal-button modal-button-yes" @click.stop="importConfirm()">
							<span><i class="fas fa-check"></i> Import</span>
						</div>
						<div class="modal-button modal-button-no" @click.stop="importCancel()">
							<span><i class="fas fa-times"></i> Cancel</span>
						</div>
					</div>
				</div>

			</div>
		</aside>
		</transition>
		
	</section>`,

	methods: {

		createCharacter() {
			this.$emit('createCharacter');
		},

		loadCharacter( characterID ) {
			this.$emit('loadCharacter', characterID);
		},

		exportCharacter( characterID ) {
			this.$emit('exportCharacter', characterID);
		},

		deleteCharacter( characterID ) {
			this.$emit('deleteCharacter', characterID);
		},

		importStart() {
			this.$refs.inputFile.click();
		},

		importGetUploads( event ) {

			if ( !event.target.files || !event.target.files.length ) {
				return;
			}

			for (let i = 0; i < event.target.files.length; i++) {
				const file = event.target.files[i];
				
				let reader = new FileReader();
				reader.readAsText(file);
				reader.onload = () => {

					let character = JSON.parse( reader.result );

					this.importQueue.push( character );

					this.importNextQueueItem();

				};
				reader.onerror = (error) => {
					console.error('Import error: ', error);
				};

			}

		},

		importNextQueueItem() {

			if ( !this.importQueue.length || this.importBuffer !== null ) return;

			let newCharacter = this.importQueue.shift();

			let c = this.characters.findIndex( existingCharacter => existingCharacter.id === newCharacter.id );

			this.importBuffer = {
				newCharacter:      newCharacter,
				oldCharacterIndex: c,
				oldCharacter:      null
			}

			if ( c !== -1 ) {

				this.importBuffer.oldCharacter = this.characters[ c ];
				this.showImportConfirm = true;

			} else {

				// Skip the confirmation step if the character doesn’t already exist.
				this.importConfirm( newCharacter );

			}

		},

		async importCancel() {

			this.showImportConfirm     = false;
			this.importBuffer          = null;
			this.$refs.inputFile.value = null;

			await Vue.nextTick();
			this.importNextQueueItem();

		},

		async importConfirm() {

			let character = this.importBuffer.newCharacter;

			this.showImportConfirm     = false;
			this.importBuffer          = null;
			this.$refs.inputFile.value = null;

			// Convert timestamps to strings.
			let dateProperties = [ 'dateCreated', 'dateModified' ];
			for (let i = 0; i < dateProperties.length; i++) {
				const property = dateProperties[i];

				if ( typeof property === 'number' ) {
					character[property] = ( new Date(character[property]) ).toISOString();
				}
				
			}
			
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

			this.$emit('importCharacter', character );

			await Vue.nextTick();
			this.importNextQueueItem();

		},

		renderDate( timestamp ) {
			return window.cortexFunctions.renderDate(timestamp);
		},

		getRelativeDateLabel( date1, date2 ) {
			date1 = new Date(date1).getTime();
			date2 = new Date(date2).getTime();
			if ( date2 > date1 ) return 'newer';
			if ( date2 < date1 ) return 'older';
			return 'same age';
		},

	}

}
