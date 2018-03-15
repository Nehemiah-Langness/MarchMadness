var analysis = (function(){
    
    var random = function (max) {
        return Math.random() * max;
    }

    var compare = function (team1, team2) {
        team1.score = (random(team1.rank));
        team2.score = (random(team2.rank));

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

    function addRankingInformation(matchData, matches) {
        var list = [];
        var rankIndex = 0;
        for (var index = 0; index < matches.length; index++){
            list.push({
                team: matches[index].team1,
                rank: matchData.rankings[rankIndex++]
            });

            list.push({
                team: matches[index].team2,
                rank: matchData.rankings[rankIndex++]
            });
        }
        return list;
    }

    var analyze = function(matchData) {
        var matches = splitIntoMatches(
                    addRankingInformation(matchData, matchData.q1)
            .concat(addRankingInformation(matchData, matchData.q3))
            .concat(addRankingInformation(matchData, matchData.q2))
            .concat(addRankingInformation(matchData, matchData.q4))
        );

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

    var getAllTeams = function (iterations, index) {
        return iterations.selectMany(function(iteration) { return iteration.results[index]});
    }

    var condense = function (iterations, modeLevel) {
        var filtered = iterations.map(function(item) { return item;});
        var totalPlaces = iterations[0].results.length

        var placing = totalPlaces - 1;
        
        while (placing >= 0){
            var mode = getAllTeams(filtered, placing).mode(modeLevel);
            var likelyhood = mode.occurances / filtered.length;
            for (var i = 0; i < filtered.length; i++){
                if (!filtered[i].results[placing].includes(mode.item)){
                    filtered.splice(i, 1);
                    i--;
                } else {
                    if (!filtered[i].chances)
                        filtered[i].chances = [];

                    var roundIndex = totalPlaces - placing - 1;
                    if (!filtered[i].chances[roundIndex])
                        filtered[i].chances[roundIndex] = 1;
                    filtered[i].chances[roundIndex] *= likelyhood;
                }
            }
            placing--;
        }
        return filtered;
    }

    var condenseMultiple = function (iterations) {
        var maxAttempts = 50;
        var attempt = 0;
        var modeLevel = 0;
        while (iterations.length > 1 && attempt < maxAttempts){
            var prevLength = iterations.length;
            iterations = condense(iterations, modeLevel);

            if (iterations.length == prevLength) {
                if (modeLevel + 1 < iterations[0].results.length)
                    modeLevel++;
                else
                    break;
            }
                
            attempt++;
        }
        var best = iterations[0];
        best.roundMin = best.chances.min();
        best.overallChance = best.chances.slice(0, -1).reduce(function (current, next) { return current*next}, 1);
        return best;
    }

    var runMultiple = function(count, matches){
        var iterations = [];
        for (var i = 0; i < count; i++)
            iterations.push(analyze(matches));

        return iterations;
    }

    return {
        runOnce: analyze,
        buildMatches: splitIntoMatches,
        average: getAllTeams,
        condense: condenseMultiple,
        run: runMultiple
    }
}());