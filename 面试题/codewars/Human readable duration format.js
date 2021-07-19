function formatDuration (seconds) {
    if (seconds === 0) return "now";
    let isSecond = seconds % 60 > 1 ? ' seconds' : ' second';

    if (!((seconds / 60) >= 1)) { return `${seconds}${isSecond}` }
    // more than 60 second
    let second = seconds % 60;
    
    let secondStr = second ? ' and ' + second + isSecond : '';
    let minute = Math.floor(seconds / 60);
    let isMinute = minute % 60 > 1 ? ' minutes' : ' minute';

    if (!((minute / 60) >= 1)) { return `${minute}${isMinute}${secondStr}` }
    // more than 60 minute
    let hour = Math.floor(minute / 60);
    let isHour = hour % 24 > 1 ? ' hours' : ' hour';
    minute = minute % 60;
    let andOrPoint = second ? ', ' : ' and ';
    let minuteStr = minute ? andOrPoint + minute + isMinute : '';

    if (!((hour / 24) >= 1)) { return `${hour}${isHour}${minuteStr}${secondStr}` }
    // more than 60 hour
    let day = Math.floor(hour / 24);
    let isDay = day % 365 > 1 ? ' days' : ' day';
    hour = hour % 24;
    andOrPoint = minute || second ? ', ' : ' and ';
    let hourStr = hour ? andOrPoint + hour + isHour : '';
    
    if (!((day / 365) >= 1)) { return `${day}${isDay}${hourStr}${minuteStr}${secondStr}` }
    // mor than 365 day
    let year = Math.floor(day / 365);
    let isYear = year > 1 ? ' years' : ' year';
    day = day % 365;
    andOrPoint = day ? ', ' : ' and ';
    let dayStr = day ? andOrPoint + day + isDay : '';
    
    return `${year}${isYear}${dayStr}${hourStr}${minuteStr}${secondStr}`;
}