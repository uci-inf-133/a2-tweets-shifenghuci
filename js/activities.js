function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const activities = tweet_array
		.filter(tweet => tweet.activityType !== 'unknown') // only convert for completed event
		.map(tweet => ({ // map each to activity statistics
			activityType: tweet.activityType,
			distance: tweet.distance,
			dayOfWeek: tweet.time.getDay()
		}));

	// plot #1: activity vs count
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activities
	  },
	  width: innerWidth * 0.8, // responsive to window size
	  height: innerHeight * 0.6,
	  mark: 'bar', // What type of graph?
	  encoding: { //what to put on x and y axis?
		x: {
			field: 'activityType',
			type: 'nominal', // categorical data
			title: 'Activity' // xTitle
		},
		y: {
			aggregate: 'count', // aggregate on the 'count' field
			type: 'quantitative', //numerical data
			title: 'Count' // yTitle
		}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	activityCount = {};
	activities.forEach(t => {
		activityCount[t.activityType] = (activityCount[t.activityType] || 0) + 1; // undefined || 0 will return 0, this is called short-circuit
	});
	
	const top3_by_distance = Object.entries(activityCount)
		.sort(([a, a_count], [b, b_count]) => b_count - a_count) //sort by higher count, notice this use the spread syntax
		.slice(0, 3) // select first three
		.map(x => x[0]) // preserve only the activityType

	const top3_data = activities.filter(x => top3_by_distance.includes(x.activityType)); // select subset of activities which have one of the three activityType

	const dayString = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	// map index to String to clear visualization
	top3_data.forEach( t => {
		t.dayOfWeek = dayString[t.dayOfWeek]
	})

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	// plot 2: 
	distance_day_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A plot of the distances by day of the week for all of the three most tweeted-about activities.",
	  "data": {
	    "values": top3_data
	  },
	  width: innerWidth * 0.8, // responsive to window size
	  height: innerHeight * 0.6,
	  mark: "point",
	  encoding: {
		x: {
			field: 'dayOfWeek',
			type: 'ordinal', //order by day
			title: "time (day)",
			sort: dayString
		},
		y:{
			field: 'distance',
			type: 'quantitative',
			title: 'Distance'
		},
		color:{
			field: 'activityType',
			type: 'nominal',
			title: 'Activity'

		}
	  }
	};
	vegaEmbed('#activityVis', distance_day_vis_spec, {actions:false});

	const aggregate_btn = document.getElementById('aggregate');

	let isAggregated = false; //default not aggregated

	aggregate_btn.addEventListener('click', () => {
		if (!isAggregated){
			// change btn text
			aggregate_btn.innerText = "Show All Activities";

			// change encoding
			distance_day_vis_spec.encoding.y = {
				aggregate: 'mean',
				field: 'distance',
				type: 'quantitative',
				title: 'Mean distance'
			}
		}
		else {
			isAggregated = true;
			// change btn text
			aggregate_btn.innerText = "Show Mean";

			// change encoding
			distance_day_vis_spec.encoding.y = {
				field: 'distance',
				type: 'quantitative',
				title: 'Distance'
			}
		}

		isAggregated = !isAggregated;
		// finally, rerender
		vegaEmbed('#activityVis', distance_day_vis_spec, {actions:false});
	})



	document.getElementById('numberActivities').innerText = Object.entries(activityCount).length;
	// which are the top three most frequent logged activities?
	document.getElementById('firstMost').innerText = 'run';
	document.getElementById('secondMost').innerText = 'walk';
	document.getElementById('thirdMost').innerText = 'bike';

	// what is the longest activity by distance?
	document.getElementById('longestActivityType').innerText = 'run'

	// what is the shortest activity by distance?
	document.getElementById('shortestActivityType').innerText = 'walk';

	// weekday or weekend longer by average distance?
	document.getElementById('weekdayOrWeekendLonger').innerText = "weekend";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
}); 