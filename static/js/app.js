$(document).ready(function(){
	
	var api_key = "gtq2s5p4x6qyuxr3wqtmh7qz"
	var games = [];
	var gameId = "";
	var home = "";
	var homeName = "";
	var homeScore = "";
	var away = "";
	var awayName = "";
	var awayScore = "";
	var week = "";

// things to add: make it look pretty, don't send canned requests

function liveData(year, season) {

home = $(games[0]).attr("home");
		away = $(games[0]).attr("away");

			$.ajax({
			type: "GET",
			url: "http://crowd.im/api/livedata.php",
			data: {
				year: year,
				season: season,
				week: week,
				away: away,
				home: home
			}
		}).done(function (data, status, xhr){
			if (data !== "<h1>Not Found</h1>") {
			$(data).find("team").each(function(){
				if ($(this).attr("id") === home) {
					homeName = $(this).attr("name");
					homeScore = $(this).attr("points");
				} else {
					awayName = $(this).attr("name");
					awayScore = $(this).attr("points");
				}
			});
gameId = $(games[0]).attr("id");
		
		if (away !== undefined && home !== undefined) {
			if (!$("#game").length) {
			$("<div id=game><p>" + awayName + " at " + homeName + "</p><p>" + home + ":" + homeScore + "</p><p>" + away + ":" + awayScore + "</p></div>").insertAfter( $("#No") );
		}
		}
	}
		});
	}




	function gameXML(season, today, month, year) {
		$.ajax({
			type: "GET",
			url: "http://crowd.im/api/sportsdata.php",
			data: {
				season: season,
				year: year
			}
		}).done(function (data, status, xhr) {
			$(data).find("game").each(function(){
				var gameDate = $(this).attr("scheduled").slice(0, 10);
				var upYear = parseInt(year) + 1;
				var yearString = upYear.toString();
				var currentDate = yearString + "-" + month + "-" + today;
				if (gameDate === currentDate) {
					if (games.length === 0) {
						games.push(this);
						week = $(this).parent().attr("week");
					}
				}
			});
			sleep(1000);
			liveData("2013", "PST");
		});
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
		gameXML("PRE", "19", "01", "2014");
		sleep(2000);
		gameXML("REG", "19", "01", "2014");
		sleep(2000);
		gameXML("PST", "19", "01", "2013");
	}

	function getQuestion() {
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "http://crowd.im/api/question.php",
			success: function (data, status, xhr){
			var question = data["question"];
			$("<div id=questionDiv><p>" + question.toString() + "</p></div>").insertBefore($("#Yes"));
		}
		});
	}

	function vote(resp) {
		$.ajax({
			type: "POST",
			url: "http://crowd.im/api/vote.php",
			data: {
				response: resp,
				gameId: gameId
			},
			success: function (data, status, xhr) {
				var percent = data["percent_true"];
				var remaining = 100 - percent;
				if (!$("#percentYes").length) {
				$("<div id=wrapper><div id=text>" + percent + "% agree" + "</div><div id=percentYes style=width:" + percent + "%></div><div id=percentNo style=width:" + remaining + "%></div></div>").insertBefore( $(".content") );
				}
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
	getQuestion();
});