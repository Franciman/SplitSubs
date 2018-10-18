export function extractSeriesNameAndEpisode(filename: string): string {
    let regex = /(.*?)(?:(?:\.([sS][0-9]+[eE][0-9]+))| (?:- ([0-9]+x[0-9]+)))?/;
    let matches = filename.match(regex);
    if(matches == null) {
        console.log("no matches");
        return "subtitles";
    }
    else {
        let seriesName = matches[1];
        let episode;
        if(matches[2]) {
            episode = matches[2];
        }
        else if(matches[3]) {
            episode = matches[3];
        }
        else {
            return seriesName;
        }
        console.log(seriesName, episode);

        return `${seriesName}.${episode}`;
    }
}
