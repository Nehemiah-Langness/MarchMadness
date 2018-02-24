var analysis = (function(){
    var random = function (max) {
        return Math.random() * max;
    }

    var compare = function (team1, team2) {
        team1.score = random(team1.rank);
        team2.score = random(team2.rank);

        if (team1.score < team2.score)
            return team1;
        if (team1.score > team2.score)
            return team2;

        if (team1.rank < team2.rank)
            return team1;
        if (team1.rank > team2.rank)
            return team2;

        return (random(100) < 50) ? team1 : team2;
    }

    var match = function (team1, team2){
        var winner = compare(team1, team2);
        var loser = (winner.team == team1.team) ? team2 : team1;

        return {
            team1: team1,
            team2: team2,
            winner: winner,
            loser: loser
        }
    }

    var splitIntoMatches = function(teams) {
        var matches = [];
        for (var i = 0; i+1 < teams.length; i+=2) {
            matches.push(match(teams[i], teams[i+1]));
        }

        return matches;
    }

    var analyze = function(matches) {
        var rounds = [];
        rounds.push({round: rounds.length, results: matches});
        while (matches.length > 1){
            matches = splitIntoMatches(matches.map(function (matches) { return matches.winner; }));
            rounds.push({round: rounds.length, results: matches});
        }
        return {
            rounds: rounds,
            winner: matches[0].winner
        }
    }

    return {
        run:analyze,
        buildMatches: splitIntoMatches
    }
}());

var htmlHelper = (function(){
    var image = function (team) {
        return "<img src='" + team.icon + "' alt='logo' class='team-logo'>"
    }

    var renderHeader = function (round){
        return "<span class='h3'>Round "+ (round.round + 1)  +"</span><hr/>";
    }

    var renderTeam = function(team){
        return "<div class='team'>"+
                    image(team) + 
                    "<span data-toggle='popover' "+
                        "title='" + team.team + "' "+
                        "data-placement='bottom' "+
                        "data-trigger='hover' "+
                        "data-html='true' "+
                        "data-content='<img src=\"" + team.icon + "\" height=\"60px\"><br/><b>Rank</b>: " + team.rank + "'>" 
                            + team.team + "</span>" +
                "</div>"
    };

    var match = function (matchResults){
        var top = matchResults.team1.team.length < matchResults.team2.team.length ? matchResults.team1 : matchResults.team2;
        var bottom = matchResults.team1.team.length < matchResults.team2.team.length ? matchResults.team2 : matchResults.team1;

        return "<div class='match'>" + 
                    "<div class='clearfix'>"+
                        "<div class='float-left'>" +
                            renderTeam(top) +
                        "</div>"+
                        "<div class='float-right'"+ 
                            "<span data-toggle='popover' "+
                                "title='" + matchResults.winner.team + "' "+
                                "data-placement='bottom' "+
                                "data-trigger='hover' "+
                                "data-html='true' "+
                                "data-content='<img src=\"" + matchResults.winner.icon + "\" height=\"60px\"><br/><b>Rank</b>: " + matchResults.winner.rank + "'>"  +
                                fa.new("trophy") + " " + image(matchResults.winner) +
                            "</span>" +
                        "</div>" + 
                    "</div>" +
                    "<hr/>" +
                    renderTeam(bottom) +
                "</div>";
    }

    var renderWinner = function(team) {
        return "<div class='text-center'><div class='winner'><span class='h2'>" + fa.new("trophy") + " <img src='" + team.icon +"' alt='logo' class='team-logo'> </br>" + team.team + "</span></div></div><br/>";
    }

    return {
        logo: image,
        roundHeader: renderHeader,
        match: match,
        winner: renderWinner
    }
}());