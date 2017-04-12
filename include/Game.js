var load = function(mods) { return new Game(mods); };

/********************** CLASSE GAME - Gestion de la partie ***************************/
class Game {
	constructor(mods) {
		// Modules
		this.mods = mods;
		// Joueurs
		this.player1 = {};
		this.player2 = {};
		// Statut
		// 1 : En attente, 2 : En cours, 3 : Terminée
		this.status = 1;
		// Terrain
		this.board = null;
	}

	/*************** GESTION DE LA PARTIE **********************/
	// Ajout d'un joueur
	addPlayer(joueurName) {
		if(!this.isFull()) {
			var translator = this.mods.uuid();
			if(typeof this.player1.id == 'undefined') {
				this.player1 = {
					id : translator.new(),
					name : joueurName,
					num : 1,
					color : 'B',
					game : {}
				}
				return this.player1;
			}
			else {
				this.player2 = {
					id : translator.new(),
					name : joueurName,
					num : 2,
					color : 'N',
					game : {}
				}
				return this.player2;
			}
		}
	}

	// Lancement de la partie
	lauchGame() {
		if(this.isFull()) {
			this.status = 2;
			this.initGame();
			this.initBoard();
		}
	}

	// Initialisation des données de jeu pour chaque joueur
	initGame() {
		var game_base = {
			nbTenailles : 0,
			lastStrike : [],
		}
		this.player1.game = game_base;
		this.player2.game = game_base;
	}

	/*************** GESTION DU TERRAIN **********************/
	// Initialisation des données du terrain
	initBoard() {
		this.board = {
			table : [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			],
			// Si playerTurn est à 3, cela signifie que la partie est finie
			playerTurn : 1,
			nbTurns : 1,
			lastStrike : null,
			prolongation : false,
			endGame : {}
		}
	}

	// Vérifie la validité d'un coup
	checkValidityOfStrike(x,y) {
		var c_x = parseInt(x);
		var c_y = parseInt(y);

		// Valeur numérique
		if(!isNaN(c_x) && !isNaN(c_y)) {
			// Valeur entre 0 et 18
			if(c_x >= 0 && c_x <= 18 && c_y >= 0 && c_y <= 18) {
				// Case non occupée
				if(this.board.table[c_x][c_y] == 0) {
					return true;
				}
				else {
					return false;
				}
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	}

	// Joue un coup
	playStrike(x,y) {
		var c_x = parseInt(x);
		var c_y = parseInt(y);

		this.board.table[c_x][c_y] = this.board.playerTurn;
		this.resolveStrike(c_x,c_y);
		this.nextTurn();
	}

	// Passage au tour suivant
	nextTurn() {
		if(this.board.playerTurn == 1) {
			this.board.playerTurn = 2;
		}
		if(this.board.playerTurn == 2) {
			this.board.playerTurn = 1;
			this.board.nbTurns++;
		}
	}

	// Résolution des effets du coup joué
	resolveStrike(x,y) {
		// Vérification Pente
		var align_pent_checks = this.checkAlignment(x,y,this.board.playerTurn,4);
		var has_a_pente =  ((align_pent_checks[0] + align_pent_checks[4] + 1) > 5)
									  || ((align_pent_checks[1] + align_pent_checks[5] + 1) > 5)
									  || ((align_pent_checks[2] + align_pent_checks[6] + 1) > 5)
									  || ((align_pent_checks[3] + align_pent_checks[7] + 1) > 5);
    if(has_a_pente) {
    	// Une pente est détectée, on met fin au jeu
    	this.board.endGame = {
    		winner : this.board.playerTurn,
    		result : this['player' + this.board.playerTurn].name + " a remporté la partie en réalisant une pente."
    	};
    	this.status = 3;
    	//this.reinitGame();
    }

    // Vérification Tenaille
    if(this.status == 2) {
			var other_player = this.board.playerTurn == 1 ? 2 : 1;
	    var align_ten_checks = this.checkAlignment(x,y,other_player,2);
	    this.resolveTenaille(align_ten_checks);
	  }  

	}

	// Résolution d'une tenaille
	resolveTenaille(align_result) {
		var tenailles = 0;
		for(var i = 0; i < align_result.length; i++) {
			if(align_result[i] == 2) {
				switch(i) {
					case 0: if(this.board.table[x-3][y] == this.board.playerTurn) { 
						this.board.table[x-2][y] = 0;
						this.board.table[x-1][y] = 0;
						tenailles++; 
					} 
					break;
					case 1: if(this.board.table[x-3][y+3] == this.board.playerTurn) { 
						this.board.table[x-2][y+2] = 0;
						this.board.table[x-1][y-1] = 0;
						tenailles++; 
					} 
					break;
					case 2: if(this.board.table[x][y+3] == this.board.playerTurn) { 
						this.board.table[x][y+2] = 0;
						this.board.table[x][y+1] = 0;
						tenailles++; 
					} 
					break;
					case 3: if(this.board.table[x+3][y+3] == this.board.playerTurn) { 
						this.board.table[x+2][y+2] = 0;
						this.board.table[x+1][y+1] = 0;
						tenailles++; 
					} 
					break;
					case 4: if(this.board.table[x+3][y] == this.board.playerTurn) { 
						this.board.table[x+2][y] = 0;
						this.board.table[x+1][y] = 0;
						tenailles++; 
					} 
					break;
					case 5: if(this.board.table[x+3][y-3] == this.board.playerTurn) { 
						this.board.table[x+2][y-2] = 0;
						this.board.table[x+1][y-1] = 0;
						tenailles++; 
					} 
					break;
					case 6: if(this.board.table[x][y-3] == this.board.playerTurn) { 
						this.board.table[x][y-2] = 0;
						this.board.table[x][y-1] = 0;
						tenailles++; 
					} 
					break;
					case 7: if(this.board.table[x-3][y-3] == this.board.playerTurn) { 
						this.board.table[x-2][y-2] = 0;
						this.board.table[x-1][y-1] = 0;
						tenailles++; 
					} 
					break;
				}
			}
		}

		// Ajout des tenailles
		if(tenailles > 0) {
			this.getPlayer(this.board.playerTurn).game.nbTenailles += tenailles;
			// Si cinq tenailles, le joueur remporte la victoire
    	this.board.endGame = {
    		winner : this.board.playerTurn,
    		result : this['player' + this.board.playerTurn].name + " a remporté la partie en réussissant à effectuer 5 tenailles."
    	};
    	this.status = 3;
    	//this.reinitGame();
		}
	}

	/*************** METHODES UTILES **********************/
	// La partie est pleine
	isFull() {
		return typeof this.player1.id != 'undefined' && typeof this.player2.id != 'undefined';
	}

	// Récupère les infos joueur par l'id
	getPlayer(idJoueur) {
		if(this.player1.id == idJoueur) 
			return this.player1;
		else if(this.player2.id == idJoueur)
			return this.player2;
		else 
			return false;
	}

	// L'id joueur correspond à un joueur en partie
	isAPlayer(idJoueur) {
		return this.getPlayer(idJoueur) !== false;
	}

	// L'id joueur correspond à un joueur en partie
	isCurrentPlayer(idJoueur) {
		return this.getPlayer(idJoueur).num == this.board.playerTurn;
	}

	// Vérifie les alignements possibles de pions
	checkAlignment(x,y,player,it) {
		var align_pent_checks = [0,0,0,0,0,0,0,0];
		var align_pent_breaks = [false,false,false,false,false,false,false,false];

		for(var i = 1; i <= it; i++) {
			if(x-i >= 0) {
				if(y+i <= 18) {
					if(!align_pent_breaks[1] && this.board.table[x-i][y+i] == player) { align_pent_checks[1] += 1; } else { align_pent_breaks[1] = true; }
				}
				if(y-i >= 0) {
					if(!align_pent_breaks[7] && this.board.table[x-i][y-i] == player) { align_pent_checks[7] += 1; } else { align_pent_breaks[7] = true; }
				}
				if(!align_pent_breaks[0] && this.board.table[x-i][y] == player) { align_pent_checks[0] += 1; } else { align_pent_breaks[0] = true; }

			}
			if(x+i <= 18) {
				if(y-i >= 0) {
					if(!align_pent_breaks[5] && this.board.table[x+i][y-i] == player) { align_pent_checks[5] += 1; } else { align_pent_breaks[5] = true; }
				}
				if(y+i <= 18) {
					if(!align_pent_breaks[3] && this.board.table[x+i][y+i] == player) { align_pent_checks[3] += 1; } else { align_pent_breaks[3] = true; } 
				}
				if(!align_pent_breaks[4] && this.board.table[x+i][y] == player) { align_pent_checks[4] += 1; } else { align_pent_breaks[4] = true; }
			}
			if(y-i >= 0) {
				if(!align_pent_breaks[6] && this.board.table[x][y-i] == player) { align_pent_checks[6] += 1; } else { align_pent_breaks[6] = true; }
			}	
			if(y+i <= 18) {
				if(!align_pent_breaks[2] && this.board.table[x][y+i] == player) { align_pent_checks[2] += 1; } else { align_pent_breaks[2] = true; }
			}	
		}

		return align_pent_checks;
	}

}

/******** EXPORT **********/
exports.load = load;
