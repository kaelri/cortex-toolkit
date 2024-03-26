const Roster = {

	props: {
		characters: Array,
	},

	computed: {

		charactersSorted() {
			return this.characters.sort((a, b) => {

				let aDate = Math.max( a.dateModified, a.dateTouched );
				let bDate = Math.max( b.dateModified, b.dateTouched );

				aDate - bDate

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
						@click.stop="importCharacterStart"
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

						<div :class="'roster-item-portrait alignment-' + character.portrait.alignment"
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
									<span><i class="fas fa-plus"></i> Load</span>
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
			<input class="roster-input" type="file" ref="inputFile" @change="importCharacter" multiple>

		</div>
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

		importCharacterStart() {
			this.$refs.inputFile.click();
		},

		importCharacter( event ) {

			if ( !event.target.files || !event.target.files.length ) {
				return;
			}

			for (let i = 0; i < event.target.files.length; i++) {
				const file = event.target.files[i];
				
				let reader = new FileReader();
				reader.readAsText(file);
				reader.onload = () => {

					let character = JSON.parse( reader.result );

					this.$emit('importCharacter', character);

				};
				reader.onerror = (error) => {
					console.error('Import error: ', error);
				};

			}

		},

		renderDate( timestamp ) {
			return window.cortexFunctions.renderDate(timestamp);
		},

	}

}
