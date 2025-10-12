function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

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
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});