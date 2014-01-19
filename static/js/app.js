$(document).ready(function(){
	
	var api_key = "gtq2s5p4x6qyuxr3wqtmh7qz"

	function gameXML(season, today, month, year) {
		$.ajax({
			type: "GET",
			url: "http://crowd.im/api/sportsdata.php",
			data: {
				season: season,
				year: year
			}
		}).done(function(data, status, xhr) {
			console.log('done');
			var done = gameFromXML(data, today, month, year);
			return done;
		});
	}

	function gameFromXML(seasonXML, today, month, year) {
		var games = [];
		console.log('gameXML');
		$(seasonXML).find("game").each(function(){
			var gameDate = $(this).attr("scheduled").slice(0, 10);
			var upYear = parseInt(year) + 1;
			var yearString = upYear.toString();
			var currentDate = yearString + "-" + month + "-" + today;
			console.log("g " + gameDate);
			console.log("c " + currentDate);
			if (gameDate === currentDate) {
				console.log('yay');
				games.push(this);
			}
		});
		return games;
	}

	function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

	function getCurrentGames() {
		var preGames = gameXML("PRE", "19", "01", "2014");
		sleep(1000);
		var regGames = gameXML("REG", "19", "01", "2014");
		sleep(1000);
		var pstGames = gameXML("PST", "19", "01", "2013");
		sleep(1000);
		console.log(pstGames.length);
	}

	function vote(resp) {
		$.ajax({
			type: "POST",
			url: "http://crowd.im/api/vote.php",
			data: {
				response: resp
			},
			success: function (data, status, xhr) {
				var percent = data["percent_true"];
				var remaining = 100 - percent;
				$("<div id=percentYes style=width:" + percent + "%><p id=percentYesLabel>" + percent + "% of users voted Yes</p></div><div id=percentNo style=width:" + remaining + "%><p id=percentNoLabel>" + remaining + "% of users voted No</p></div>").insertBefore( $("#Yes") );
			}
		});
	}

	$("#No").click(function(){
		vote(0);
	});

	$("#Yes").click(function(){
		vote(1);
	});

	getCurrentGames();
});

