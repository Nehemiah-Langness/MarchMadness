var htmlHelper = (function(){
    var image = function (team) {
        return "<img src='" + team.icon + "' alt='logo' class='team-logo'>"
    }

    var renderText = function(text){
        return $('<div>').text(text).html().replace("'", "&#39;").replace('"', "&#34;");
    }

    var renderHeader = function (round, likelyhood){
        return "<a href='#' onclick='return false;' class='text-dark'><span class='h3' data-toggle='collapse' data-target='[data-id=\"round-" + round.round + "\"]'>" + fa.new("angle-double-down") + " Round "+ (round.round + 1) + " - " + (likelyhood ? (Math.round(likelyhood * 100)) + "% Occurance" : "") +"</span></a><hr/>";
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

    var renderTeam = function(team, winner, other){
        return "<div class='clearfix match-result' style='" + (team.color? "background-color: " + team.color + "; color: #fff;": "" ) +"' " + renderPopover(team) + ">"+
                    "<div class='float-left'>" +
                        "<div class='team'>"+
                            image(team) + 
                            " " + (team.nickname ? renderText(team.nickname) : renderText(team.team)) +
                        "</div>" +
                    "</div>"+
                    (winner.team == team.team ?
                    "<div class='float-right'>"+ 
                        (winner.rank > other.rank ? "<span data-content='Upset' data-placement='top' data-toggle='popover' data-trigger='hover'>" + fa.new("exclamation") + "</span> ": "") +
                        "<span data-content='Winner' data-placement='top' data-toggle='popover' data-trigger='hover'>" + fa.new("trophy") + "</span> " +
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
                    renderTeam(top, matchResults.winner, bottom) +
                    "<hr/>" +
                    renderTeam(bottom, matchResults.winner, top) +
                "</div>";
    }

    var renderWinner = function(team, likelyhood) {
        return "<div class='text-center'>"+
                    "<div class='winner' style='"+ (team.color ? "background-color:" + team.color + "; color: #fff;" : "") +"'>"+
                        
                        "<span class='h2'>" + fa.new("trophy") + " <img src='" + team.icon +"' alt='logo' class='team-logo'> " + 
                            (Math.round(likelyhood * 100)) + "% <br/>" + 
                        
                            renderText(team.team) + "<br/>" + 
                            renderText(team.nickname) + 
                        "</span>" + 
                    "</div>" + 
                "</div>";
    }

    return {
        logo: image,
        roundHeader: renderHeader,
        match: match,
        winner: renderWinner
    }
}());