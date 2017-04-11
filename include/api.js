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
            res.send({
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

    mods.app.get("/test/:x/:y", function(req, res) {
        console.log(global.GAME.checkValidityOfStrike(req.params.x, req.params.y));
    });    
};



/******** EXPORT **********/
exports.load = load;