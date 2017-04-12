/********************** API JAVASCRIPT ***************************/

var load = function(mods) {

    /*********** CONNEXION AU JEU *************/
    mods.app.get("/connect/:joueurName", function(req, res) {
        // Ajout à la partie
        if(global.GAME.status == 1 && !global.GAME.isFull()) {
            var player = global.GAME.addPlayer(req.params.joueurName);
            if(global.GAME.isFull())
                global.GAME.lauchGame();
        }
        // Partie pleine
        else {
            res.sendStatus(401);
        }

        // Renvoi des données joueur
        if(player) {
            res.json({
                idJoueur : player.id,
                code : 200,
                nomJoueur : player.name,
                numJoueur : player.num
            });
        }

    });      

    /*********** PLACEMENT D'UN PION *************/
    mods.app.get("/play/:x/:y/:idJoueur", function(req, res) {
        if(global.GAME.isAPlayer(req.params.idJoueur)) {
            if(global.GAME.isCurrentPlayer(req.params.idJoueur)) {
                if(global.GAME.checkValidityOfStrike(req.params.y, req.params.x)) {
                    global.GAME.playStrike(req.params.y, req.params.x);
                    res.json({
                        code : 200
                    });
                }
                // Coup non valide
                else {
                    res.sendStatus(406);
                }
            }
            // Pas le tour du joueur
            else {
                res.sendStatus(401);
            }
        }
        // Joueur non-valide
        else {
            res.sendStatus(401);
        }

    });  

    /*********** PLACEMENT D'UN PION *************/
    mods.app.get("/turn/:idJoueur", function(req, res) {
        if(global.GAME.isAPlayer(req.params.idJoueur)) {
            var player = global.GAME.getPlayer(req.params.idJoueur);
            res.json({
                status : player.num == global.GAME.board.playerTurn ? 1 : 0,
                tableau : global.GAME.board.table,
                nbTenaillesJ1 : global.GAME.player1.game.nbTenailles,
                nbTenaillesJ2 : global.GAME.player2.game.nbTenailles,
                dernierCoupX : global.GAME.board.lastStrike == null ? null : global.GAME.board.lastStrike[0],
                dernierCoupY : global.GAME.board.lastStrike == null ? null : global.GAME.board.lastStrike[1],
                prolongation : global.GAME.board.prolongation,
                finPartie : typeof global.GAME.board.endGame.winner != 'undefined' ? true : false,
                detailFinPartie : typeof global.GAME.board.endGame.winner != 'undefined' ? global.GAME.board.endGame.result : false,
                numTour : global.GAME.board.nbTurns,
                code : 200
            });
        }
        // Joueur non-valide
        else {
            res.sendStatus(401);
        }

    });  

    mods.app.get("/test/:x/:y", function(req, res) {
        console.log(global.GAME.checkValidityOfStrike(req.params.x, req.params.y));
    });    
};



/******** EXPORT **********/
exports.load = load;