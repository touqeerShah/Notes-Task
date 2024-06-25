 export function convertToEndOfDay(date:Date) {
    let endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); // Set the time to 11:59:59 PM
    return endDate;
}