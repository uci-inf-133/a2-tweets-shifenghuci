function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	// Log #numberTweets
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;


	// Log #firstDate & #lastDate
	// sort tweet_array by creation time from earliest to latest
	const tweet_array_ascend_by_time = tweet_array.sort(
		function(t1, t2) {
			return t1.time - t2.time
		}
	);

	first_tweet = tweet_array_ascend_by_time[0];
	last_tweet = tweet_array_ascend_by_time[tweet_array.length - 1];

	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}
	
	// fill first date
	document.getElementById('firstDate').innerText = first_tweet.time.toLocaleDateString('en-US', options);

	//fill last date
	document.getElementById('lastDate').innerText = last_tweet.time.toLocaleDateString('en-US', options);

	// Log span.completedEvents, span.liveEvents, span.achievements, span.miscellaneous, span.written
	const total_count = tweet_array.length;

	let counts = {
		completed_event:0,
		live_event:0,
		achievement:0,
		miscellaneous:0,
		written:0,
	}

	tweet_array.forEach( tweet => {
		counts[tweet.source]++;
		if (tweet.written) {
			counts['written']++;
		}
	});

	const formathPercentage = precentage => {
		return (math.format(precentage * 100, 
			{notation: 'fixed', precision: 2,}
		) + '%')
	}


	// fill in statistics
	document.querySelectorAll('span.completedEvents').forEach(s => s.innerText = counts.completed_event);
	document.querySelector('span.completedEventsPct').innerText = formathPercentage(counts.completed_event / total_count);

	document.querySelector('span.liveEvents').innerText = counts.live_event;
	document.querySelector('span.liveEventsPct').innerText = formathPercentage(counts.live_event / total_count);

	document.querySelector('span.achievements').innerText = counts.achievement;
	document.querySelector('span.achievementsPct').innerText = formathPercentage(counts.achievement / total_count);

	document.querySelector('span.miscellaneous').innerText = counts.achievement;
	document.querySelector('span.miscellaneousPct').innerText = formathPercentage(counts.miscellaneous / total_count);

	document.querySelector('span.written').innerText = counts.written;
	document.querySelector('span.writtenPct').innerText = formathPercentage(counts.written / counts.completed_event);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});