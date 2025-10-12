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
	let completed_count = 0;
	let live_count = 0;
	let achievements_count = 0;
	let miscellaneous_count = 0;
	let written_count = 0;

	const isWritten = text_content => {
		//user written content is preceded with dash ("-")
		return text_content.includes('-');
	}
	tweet_array.forEach( tweet => {
		const text_content = tweet.text;
		
		if (text_content.startsWith('Just')) {
			completed_count++;
			if (isWritten(text_content)){
				written_count++;
			}
		}
		else if (text_content.startsWith('Watch')) {
			live_count++;
		}
		else if (text_content.startsWith('Achieved')) {
			achievements_count++;
		}
		else {
			miscellaneous_count++;
		}
	});

	const formathPercentage = precentage => {
		return (math.format(precentage * 100, 
			{notation: 'fixed', precision: 2,}
		) + '%')
	}
	document.querySelectorAll('span.completedEvents').forEach(s => s.innerText = completed_count);
	document.querySelector('span.completedEventsPct').innerText = formathPercentage(completed_count / total_count);

	document.querySelector('span.liveEvents').innerText = live_count;
	document.querySelector('span.liveEventsPct').innerText = formathPercentage(live_count / total_count);

	document.querySelector('span.achievements').innerText = achievements_count;
	document.querySelector('span.achievementsPct').innerText = formathPercentage(achievements_count / total_count);

	document.querySelector('span.miscellaneous').innerText = achievements_count;
	document.querySelector('span.miscellaneousPct').innerText = formathPercentage(miscellaneous_count / total_count);

	document.querySelector('span.written').innerText = written_count;
	document.querySelector('span.writtenPct').innerText = formathPercentage(written_count / completed_count);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});