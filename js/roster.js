const Roster = {

	props: {
		characters: Array,
	},

	computed: {

		charactersSorted() {
			return this.characters.sort((a, b) => b.modified - a.modified);
		}

	},

	/*html*/
	template: `<section class="roster">
		<div class="roster-inner">
	
			<!-- BUTTON: ADD CHARACTER -->
			<div class="roster-button-container" v-if="characters.length >= 3">
				<div class="roster-button"
					@click.stop="createCharacter"
				>
					<span><i class="fas fa-plus"></i> New Character</span>
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
						</div>

					</div>

					<div>

						<h3 class="roster-item-name" v-text="character.name"
							@click.stop="loadCharacter( character.id )"
						></h3>
						
						<div class="roster-description" v-text="character.description"></div>

						<div class="roster-date">
							<span class="roster-date-label">Last modified: </span>
							<span v-html="renderDate(character.modified)"></span>
						</div>

						<div class="roster-item-button-container">

							<!-- LOAD -->
							<div class="roster-item-button"
								@click.stop="loadCharacter( character.id )"
							>
								<span><i class="fas fa-plus"></i> Load</span>
							</div>

							<!-- DELETE -->
							<div class="roster-item-button roster-delete"
								@click.stop="deleteCharacter( character.id )"
							>
								<span><i class="fas fa-trash"></i> Delete</span>
							</div>

						</div>

					</div>

				</li>
				</transition-group>

			</ul>

			<!-- BUTTON: ADD CHARACTER -->
			<div class="roster-button-container">
				<div class="roster-button"
					@click.stop="createCharacter"
				>
					<span><i class="fas fa-plus"></i> New Character</span>
				</div>
			</div>

		</div>
	</section>`,

	methods: {

		createCharacter() {
			this.$emit('createCharacter');
		},

		loadCharacter( characterID ) {
			this.$emit('loadCharacter', characterID);
		},

		deleteCharacter( characterID ) {
			this.$emit('deleteCharacter', characterID);
		},

		renderDate( timestamp ) {
			return window.cortexFunctions.renderDate(timestamp);
		},

	}

}
