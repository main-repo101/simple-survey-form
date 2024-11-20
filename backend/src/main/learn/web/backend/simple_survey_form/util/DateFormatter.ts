export class DateFormatter {
    private date: Date;

    constructor(date?: Date) {
        this.date = date ?? new Date(); //REM: Use the provided date or current date
    }

    public format(format: string): string {
        const pad = (num: number) => num.toString().padStart(2, "0");
        const hours = this.date.getHours();

        const replacements: Record<string, string> = {
            "YYYY": this.date.getFullYear().toString(), //REM: Year
            "MM": pad(this.date.getMonth() + 1), //REM: Month (1-based)
            "dd": pad(this.date.getDate()), //REM: Day of the month
            "hh": pad(hours % 12 || 12), //REM: 12-hour format
            "mm": pad(this.date.getMinutes()), //REM: Minutes
            "ss": pad(this.date.getSeconds()), //REM: Seconds
            "x": hours >= 12 ? "PM" : "AM", //REM: AM/PM
        };

        return format.replace(/YYYY|MM|dd|hh|mm|ss|x/g, match => replacements[match]);
    }
}

export default DateFormatter;