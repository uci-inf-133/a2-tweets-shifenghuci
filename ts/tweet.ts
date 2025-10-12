class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
		if (this.text.startsWith('Just')) {
			return 'completed_event';
		}
		else if (this.text.startsWith('Watch')) {
			return 'live_event';
		}
		else if (this.text.startsWith('Achieved')) {
			return 'achievement';
		}
		else {
			return 'miscellaneous';
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
       //user written content is preceded with dash ("-")
        const dashIndex = this.text.indexOf('-'); // -1 indicate dash not found
	    return dashIndex != -1;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet

        // extract what is betwen "-" and twitter link

        //ex: "Just completed a 7.11 km run - Nice! Running in mot rain 😅🏃🏽‍♀️ https://t.co/8hAIrMxIIQ #Runkeeper"

        //extract out "Nice! Running in mot rain 😅🏃🏽‍♀️"

        //startIndex = indexOf('-') + 1
        //endIndex = indexOf('https://t.co')
        //strip afterward

        const startIndex = this.text.indexOf('-') + 1;
        const endIndex = this.text.indexOf('https://t.co');
        return this.text.substring(startIndex, endIndex).trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}