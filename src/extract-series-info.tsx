export interface SeriesInfo {
    seriesName: string,
    season?: string,
    episode?: string,
}

// Try to extract data by matching the filename with one of the regexps in the list
// TODO: Find a better way, this doesn't seem optimal
export function extractSeriesInfo(filename: string): SeriesInfo {

    // Each regex in this list must have at least 3 capture groups and the first three must be:
    // - Series name
    // - Season
    // - Episode
    let regexList = [
        /(.*?)\.[sS]([0-9]+)[eE]([0-9]+)\..*?\.srt/,     // Match files of type: Series Name.s00e00.irrelevantstuff.srt
        /(.*?)\s*-\s*([0-9]+)x([0-9]+)\s*-\s*.*?\.srt/ // Match files of type: Series Name - 00x00 - irrelevantstuff.srt
    ];

    for(let regex of regexList) {
        let matches = filename.match(regex);
        if(matches != null) {
            let seriesName = matches[1];
            let season = matches[2];
            let episode = matches[3];
            return { seriesName: seriesName, season: season, episode: episode };
        }
    }

    console.log("no matches");
    return { seriesName: "subtitles" };
}

