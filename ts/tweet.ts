class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
		if (this.text.startsWith('Just') && !this.text.startsWith('Just linked')) {
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
        const dashIndex: number = this.text.indexOf('-'); // -1 indicate dash not found
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

        const startIndex: number = this.text.indexOf('-') + 1;
        const endIndex: number = this.text.indexOf('https://t.co');
        return this.text.substring(startIndex, endIndex).trim();
    }

    get systemText():string {
        // return sytem generated part of the text
        return this.text.replace(this.writtenText, "").trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        // extraction rule: The activity is generally behind "a", if distance unit "mi" or "km" is presence, then it is behind the distance unit
        

        let tokens = this.systemText.split(" ");

        const a_index: number = tokens.indexOf("a");
        tokens = tokens.slice(a_index+1);

        const dash_index: number | -1 = tokens.indexOf("-");
        const with_index: number | -1 = tokens.indexOf("with");

        tokens = dash_index !== -1 ? tokens.slice(0, dash_index) : tokens;
        tokens = with_index !== -1 ? tokens.slice(0, with_index) : tokens;

        const mi_index: number | -1 = tokens.indexOf("mi");
        const km_index: number | -1 = tokens.indexOf("km");

        if (mi_index !== -1) {
            return tokens.slice(mi_index+1).join(" ");
        }
        else if (km_index !== -1){
            return tokens.slice(km_index+1).join(" ");
        }
        else {
            // the activities is not measured by distance
            const in_index = tokens.indexOf("in");

            return tokens.slice(0, in_index).join(" ");
        }


        // //Idea: Have list of diciotnary and check for hitting keyword

        // const longer_activities_string: string[] = ['nordic walk', 'strength workout', 'chair ride']; // these are longer string which might also trigger shorter string, so filter them first
        // const activities : string[] = ['run', 'walk', 'bike', 'yoga', 'workout', 'Freestyle', 'meditation', 'ski', 'skate', 'swim', 'row', 'pilates', 'hike', 'activity', 'sports', 'dance', 'boxing'];
        
        // const acc = [...longer_activities_string, ...activities];
        // if (acc.find( a => this.systemText.includes(a)) === undefined) {
        //     console.log(this.systemText);
        // }
        // return acc.find( a => this.systemText.includes(a)) || ""; // return the first element that is included in system_text or return empty string
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet

        // Idea: look for mi/km, then distance is the token before it. Remeber to convert to miles
        // 1 mi = 1.609 km

        const km2mi:number = 1 / 1609;

        const tokens: string[] = this.systemText.split(" ");

        if (tokens.includes("mi")){
            return Number(tokens.at(tokens.indexOf("mi")-1));
        }
        else if (tokens.includes("km")) {
            return Number(tokens.at(tokens.indexOf("km")-1)) * km2mi;
        }

        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}