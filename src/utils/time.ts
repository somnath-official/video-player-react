export const toHumanRaedableFormat = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    // Format the time as HH:MM:SS
    let formattedTime = ''

    if (hours > 0) formattedTime += `${hours}:`
    if (minutes > 0) formattedTime += `${minutes}:`
    else formattedTime += '0:'

    if (remainingSeconds < 10) formattedTime += `0${remainingSeconds}`
    else formattedTime += `${remainingSeconds}`

    return formattedTime
}