function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets
					.map(tweet => {
						return new Tweet(tweet.text, tweet.created_at);
					})
					.filter(tweet => 
						tweet.written === true
					);
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const searchCount = document.getElementById('searchCount'); // edit this span to show how many matched result is returned
	const searchText = document.getElementById('searchText'); //edit this span to show what is the activityType searching

	const searchInput = document.querySelector('input#textFilter');
	const tbody = document.querySelector('tbody#tweetTable');

	searchInput.addEventListener('input', () => {
		searchText.textContent = searchInput.value; // what the user is searching
		searchCount.textContent = 0;
		//as input, search and return all row with fitting activity type and add them to the table
		if(searchText.textContent === ''){ // clear table when searchInput is empty string, else render all matched result
			searchCount.textContent = 0;
			tbody.innerHTML = '';
			console.log('Clear table')
		}
		else {
			console.log("searching...")
			result_tweets = tweet_array.filter(t => t.writtenText.includes(searchText.textContent));
			searchCount.textContent = result_tweets.length;
			console.log(result_tweets);
			let rowNumber = 1;

			let tbodyHTML = '';
			tbodyHTML = result_tweets.map( t => t.getHTMLTableRow(rowNumber++))
									 .join(' ');
			console.log(tbodyHTML);
			
			// batch insert
			tbody.innerHTML = tbodyHTML;
		}
	})
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});