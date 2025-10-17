function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});


	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	// remember to set to const after debugging
	const activity_statistics = {}; // {activityName:string, count:number, maxDistance:number, minDistance:number}

	for (const t of tweet_array){
		const entry = activity_statistics[t.activityType];
		if (entry === undefined) {
			//create new entries
			activity_statistics[t.activityType] = {count:1, maxDistance:t.distance, minDistance:t.distance};
			continue;
		}
		else {
			entry.count += 1;
			entry.maxDistance = Math.max(entry.maxDistance, t.distance);
			entry.minDistance = Math.min(entry.minDistance, t.distance);
		}
	}

	// how many different activities got logged?
	document.getElementById('numberActivities').innerText = Object.keys(activity_statistics).length;

	// sort the entries by values, which is count of activities
	const top_three_most_frequent = Array.from(Object.entries(activity_statistics)) // built array from key-value pairs, which turn into [key, value]
									.sort(([a, a_stat], [b, b_stat]) => b_stat.count - a_stat.count) // b_count - a_count, larger value indicate b has more count than a
									.slice(0,3);
								
	// which are the top three most frequent logged activities?
	document.getElementById('firstMost').innerText = top_three_most_frequent[0][0];
	document.getElementById('secondMost').innerText = top_three_most_frequent[1][0];
	document.getElementById('thirdMost').innerText = top_three_most_frequent[2][0];

	sort_by_distance = top_three_most_frequent.sort(([a, a_stat], [b, b_stat]) => b_stat.maxDistance - a_stat.maxDistance)

	// what is the longest activity by distance?
	document.getElementById('longestActivityType').innerText = sort_by_distance[0][0];

	// what is the shortest activity by distance?
	document.getElementById('shortestActivityType').innerText = sort_by_distance[2][0];

	// weekday or weekend longer by distance?
	tweet_array.forEach( t => {
		let onSaturday = t.time.getDay() === 6; // let keyword make this only available in this block
		let onSunday = t.time.getDay() === 0; 

		if (onSaturday || onSunday) { 
			totalDistance_weekend += t.distance;
		}
		else {
			totalDistance_weekday += t.distance;
		}
	})

	document.getElementById('weekdayOrWeekendLonger') = totalDistance_weekday

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});