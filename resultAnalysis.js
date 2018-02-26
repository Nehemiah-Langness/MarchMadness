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
            winner: matches[0].winner,
            results: getRankings(rounds)
        }
    }

    var getRankings = function(rounds){
        var added = [];
        var results = []
        for (var i = rounds.length-1; i >= 0; i--){
            rounds[i].results.forEach(function (match) {
                if (!added.includes(match.winner.team)){
                    if (!results[(rounds.length-1) - i])
                        results[(rounds.length-1) - i] = [];
                    results[(rounds.length-1) - i].push(match.winner.team);
                    added.push(match.winner.team)
                }
                if (!added.includes(match.loser.team)){
                    if (!results[(rounds.length) - i])
                        results[(rounds.length) - i] = [];
                    results[(rounds.length) - i].push(match.loser.team);
                    added.push(match.loser.team)
                }
            });
        }
        return results;
    }

    var getAverage = function (iterations, index) {
        var all = iterations.selectMany(function(iteration) { return iteration.results[index]});

        return all;
    }

    var condense = function (iterations) {
        var filtered = iterations.map(function(item) { return item;});
        var placing = 0;
        while (placing < iterations[0].results.length){
            var mostCommon = getAverage(filtered, placing).mode();
            for (var i = 0; i < filtered.length; i++){
                if (!filtered[i].results[placing].includes(mostCommon)){
                    filtered.splice(i, 1);
                    i--;
                }
            }
            placing++;
        }

        return filtered;
    }

    var condenseMultiple = function (iterations) {
        var maxAttempts = 50;
        var attempt = 0;
        while (iterations.length > 1 && attempt < maxAttempts){
            iterations = condense(iterations);
            attempt++;
        }
        return iterations[0];
    }

    return {
        run:analyze,
        buildMatches: splitIntoMatches,
        average: getAverage,
        condense: condenseMultiple
    }
}());

var htmlHelper = (function(){
    var image = function (team) {
        return "<img src='" + team.icon + "' alt='logo' class='team-logo'>"
    }

    var renderText = function(text){
        var safe = $('<div>').text(text).html().replace("'", "&#39;").replace('"', "&#34;");
        return safe;
    }

    var renderHeader = function (round){
        return "<span class='h3'>Round "+ (round.round + 1)  +"</span><hr/>";
    }

    var renderPopover = function(team){
        return "data-toggle='popover' "+
            "title='" + renderText(team.team) + "' "+
            "data-placement='bottom' "+
            "data-trigger='hover' "+
            "data-html='true' "+
            "data-content='"+
                "<img src=\"" + team.icon + "\" height=\"60px\"><br/>" +
                "<b>Rank</b>: " + team.rank + "<br/>" +
                "<b>Location</b>: " + renderText(team.location) + "<br/>"+ 
                "<b>Teamname</b>: " + renderText(team.nickname) + "<br/>"+ 
            "'";
    }

    var renderTeam = function(team, winner){
        return "<div class='clearfix match-result' style='" + (team.color? "background-color: " + team.color + ";": "" ) +"' " + renderPopover(team) + ">"+
                    "<div class='float-left'>" +
                        "<div class='team' style='" + (team.color? "color: #fff;": "" ) +"'>"+
                            image(team) + 
                            " " + (team.nickname ? renderText(team.nickname) : renderText(team.team)) +
                        "</div>" +
                    "</div>"+
                    (winner.team == team.team ?
                    "<div class='float-right'>"+ 
                            fa.new("trophy") +
                    "</div>" : "") + 
                "</div>";
    };

    var match = function (matchResults){
        var team1 = matchResults.team1;
        var team2 = matchResults.team2;

        var team1Display = (team1.nickname ? team1.nickname : team1.team);
        var team2Display = (team2.nickname ? team2.nickname : team2.team);

        var top = team1Display.length < team2Display.length ? team1 : team2;
        var bottom = team1Display.length < team2Display.length ? team2 : team1;

        return "<div class='match' data-teams='" + renderText(team1.team).toLowerCase() + ":" + renderText(team2.team).toLowerCase() + ":" + renderText(team1.nickname).toLowerCase() + ":" + renderText(team2.nickname).toLowerCase() + "'>" + 
                    renderTeam(top, matchResults.winner) +
                    "<hr/>" +
                    renderTeam(bottom, matchResults.winner) +
                "</div>";
    }

    var renderWinner = function(team) {
        return "<div class='text-center'><div class='winner' style='"+ (team.color ? "background-color:" + team.color + "; color: #fff;" : "") +"'><span class='h2'>" + fa.new("trophy") + " <img src='" + team.icon +"' alt='logo' class='team-logo'> </br>" + renderText(team.team) + "</span></div></div><br/>";
    }

    return {
        logo: image,
        roundHeader: renderHeader,
        match: match,
        winner: renderWinner
    }
}());