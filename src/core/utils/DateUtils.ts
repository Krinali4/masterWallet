import dateFormat, { masks } from "dateformat";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment-timezone";
export default class DateUtils {
  public static readonly MIN_DOB = new Date(1930, 0, 1);

  public static readonly DEFAULT_DISPLAY_DATE_FORMATE = "MM-DD-YYYY hh:mm A z";
  public static readonly UNLOAD_DISPLAY_DATE_FORMATE = "DD MMMM, YYYY hh:mm a z";
  public static readonly LOAD_DISPLAY_DATE_FORMATE = "DD MMM, YYYY hh:mm a z";
  public static readonly DEFAULT_DISPLAY_DATE_ONLY_FORMATE = "mm-dd-yyyy";
  public static readonly DEFAULT_DISPLAY_TIME_ONLY_FORMATE = "hh:MM TT";


  public static readonly YYMMDD = "YYYY/MM/DD";
  public static readonly YYMMDDANDTIME = "YYYY/MM/DD hh:mm a";
  public static readonly MMDDYYANDTIME = "MM/DD/YYYY hh:mm a";
  public static readonly REWASTE_COMMON_DATE_FORMAT = 'MM/DD/YYYY'


  public static toDisplayMMDDYYANDTIME(date: Date): string {
    return moment
      .tz(date.toString(), moment.tz.guess())
      .format(DateUtils.MMDDYYANDTIME);
  }


  public static toDisplayYYMMDDWithSlashAndTime(date: Date): string {
    return moment
      .tz(date.toString(), moment.tz.guess())
      .format(DateUtils.YYMMDDANDTIME);
  }

  public static toDisplayYYMMDDWithSlash(date: Date): string {
    return moment
      .tz(date.toString(), moment.tz.guess())
      .format(DateUtils.YYMMDD);
  }


  public static toDisplayFormat(date: Date): string {
    return moment
      .tz(date.toString(), moment.tz.guess())
      .format(DateUtils.DEFAULT_DISPLAY_DATE_FORMATE);
  }

  public static toUnloadDisplayFormat(date: Date): string {
    return moment
      .tz(date.toString(), moment.tz.guess())
      .format(DateUtils.UNLOAD_DISPLAY_DATE_FORMATE);
  }

  public static toLoadMoneyDisplayFormat(date: Date): string {
    return moment
      .tz(date.toString(), moment.tz.guess())
      .format(DateUtils.LOAD_DISPLAY_DATE_FORMATE);
  }

  public static toDateOnlyDisplayFormat(date: Date): string {
    return dateFormat(date, DateUtils.DEFAULT_DISPLAY_DATE_ONLY_FORMATE);
  }

  public static toTimeOnlyDisplayFormat(date: Date): string {
    return dateFormat(date, DateUtils.DEFAULT_DISPLAY_TIME_ONLY_FORMATE);
  }

  // Time should be in HH:MM(24 hours) format
  public static HHMMToDate(time: string): Date {
    if (time && time.length > 0) {
      const timeSplit = time.split(":");

      // timeSplit length must be grater than 1 as expecting at least hours and minutes
      if (timeSplit!.length > 1) {
        const date = new Date();
        date.setHours(
          parseInt(timeSplit[0], 0),
          parseInt(timeSplit[1], 0),
          0,
          0
        );
        return date;
      }
    }
    return new Date();
  }

  public static getCurrentDate(): string {
    const currentDate = new Date();

    let date = currentDate.getDate().toString();
    let month = (currentDate.getMonth() + 1).toString();
    const year = currentDate.getFullYear();

    if (date.length === 1) {
      date = "0" + date;
    }

    if (month.length === 1) {
      month = "0" + month;
    }

    const dateString = year + "-" + month + "-" + date;
    return dateString;
  }


  public static getmmddyyyyDate(currentDate: any): string {

    let date = currentDate.date().toString();
    let month = (currentDate.month() + 1).toString();
    const year = currentDate.year();

    if (date.length === 1) {
      date = "0" + date;
    }

    if (month.length === 1) {
      month = "0" + month;
    }

    const dateString = month + "/" + date + "/" + year;
    return dateString;
  }


  public static startDateValidations(currentDate: Dayjs): string {
    if(!currentDate) { return '' }
    if (!currentDate?.isValid()) { return 'Enter a valid date' }
    let todaysDate = dayjs();
    if (currentDate <= todaysDate) {
      return ""
    } else {
      return "Start date should not be future date."
    }
  }

  public static endDateValidations(currentDate: Dayjs, startDate: Dayjs): string {
    if(!currentDate) { return '' }
    if (!currentDate?.isValid()) { return 'Enter a valid date' }
    let todaysDate = dayjs();
    if (currentDate <= todaysDate) {
      if (startDate > currentDate) {
        return "End date shoud not be previous than start date ."
      } else {
        return ""
      }
    } else {
      return "End date should not be future date."
    }
  }

  public static getCurrentTimeUnixTimestamp(): number {
    return Math.trunc(Date.now() / 1000);
  }

  public static getNoOfYearsBeforeDate(beforeYears: number): Date {
    const date = new Date();
    date.setFullYear(date.getFullYear() - beforeYears);
    return date;
  }

  public static getDDMMYYYYString(date: Date, separator: string): string {
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();

    if (day.length === 1) {
      day = "0" + day;
    }

    if (month.length === 1) {
      month = "0" + month;
    }

    const dateString = day + separator + month + separator + year;
    return dateString;
  }

  public static getYYYYMMDDString(date: Date, separator: string): string {
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();

    if (day.length === 1) {
      day = "0" + day;
    }

    if (month.length === 1) {
      month = "0" + month;
    }

    const dateString = year + separator + month + separator + day;
    return dateString;
  }

  public static getDateFromDDMMYYYY(
    dateText: string,
    separator: string
  ): Date | null {
    if (dateText && separator) {
      const dateSplit = dateText.split(separator);
      if (dateSplit!.length > 2) {
        const date = new Date(
          parseInt(dateSplit[2], 0),
          parseInt(dateSplit[1], 0),
          parseInt(dateSplit[0], 0)
        );
        return date;
      }
    }

    return null;
  }

  public static getDateFromYYYYMMDD(
    dateText: string,
    separator: string
  ): Date | null {
    if (dateText && separator) {
      const dateSplit = dateText.split(separator);
      if (dateSplit!.length > 2) {
        const dateString =
          dateSplit[0] + "-" + dateSplit[1] + "-" + dateSplit[2];
        const date = new Date(dateString);
        return date;
      }
    }

    return null;
  }

  public static getDateTimeDiffFromCurTime(futureTime: Date): number {
    return futureTime.getTime() - new Date().getTime();
  }

  public static getTomorrowDateWithStartTime(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
  }

  public static stringToDate(dateString: string): Date {
    return new Date(dateString.replace(" ", "T"));
  }

  public static dateFormater(date: Date, dateFormate: string): string {
    return dateFormat(date, dateFormate);
  }

  public static getSystemTimeZone(): string {
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    //Temporary fix
    if (timeZone === "Asia/Calcutta") {
      timeZone = "Asia/Kolkata";
    }

    return timeZone;
  }

  public static getMMDDYYYYFromYYYYMMDD(
    dateText: string
  ): string | null | undefined {
    const separator = "-";
    if (dateText && separator) {
      const dateSplit = dateText.split(separator);
      if (dateSplit!.length > 2) {
        const dateString =
          dateSplit[1] + separator + dateSplit[2] + separator + dateSplit[0];
        return dateString;
      }
    }
    return null;
  }

  public static getUTCDate(date: Dayjs) {
    
    const jsDate = date.toDate()
    var now_utc = Date.UTC(jsDate.getUTCFullYear(), jsDate.getUTCMonth(),jsDate.getUTCDate(), jsDate.getUTCHours(),jsDate.getUTCMinutes(), jsDate.getUTCSeconds());
    const nowUTCDt = new Date(now_utc)
    const isoStrDt = nowUTCDt.toISOString()
    console.log(dayjs(date).format('yyyy-MM-dd'))
    return isoStrDt
  }

  public static getStartDateISOString(startDt: Dayjs|null) {
    let startDtStr = ''
    if(startDt) {
        startDtStr = startDt.startOf('date').toISOString()
    }
    console.log('start of date:'+startDtStr)
    return startDtStr
  }

  public static getEndDateISOString(endDt: Dayjs|null) {
    let endDtStr = ''
    if(endDt) {
      endDtStr = endDt.endOf('date').toISOString()
    }
    console.log('end of date:'+endDtStr)
    return endDtStr
  }

  public static toISOString(dt: Dayjs|null) {
    let endDtStr = ''
    if(dt) {
      endDtStr = dt.toISOString()
    }
    console.log('date toISOString:'+endDtStr)
    return endDtStr
  }

  public static getDisplayDate(dateObj: Dayjs|null) {
    let dateStr = ''
    if(dateObj) {
      dateStr = dateObj.format(DateUtils.REWASTE_COMMON_DATE_FORMAT)
    }
    console.log('getDisplayDate :'+dateStr)
    return dateStr
  }

  public static getDisplayDateFromISOString(isoString: string|null) {
    let dateStr = ''
    if(isoString && isoString.length > 0) {
      const converedToDate = dayjs(isoString)
      dateStr = (converedToDate) ? converedToDate.format(DateUtils.REWASTE_COMMON_DATE_FORMAT) : ''
    }
    console.log('getDisplayDateFromISOString :'+dateStr)
    return dateStr
  }

  public static lastWeekDateRange() {
    let currentDt = dayjs()
    const startDate = currentDt.subtract(7, 'days').startOf('date')
    const endDate = startDate.add(7, 'days').endOf('date')
    const sDate = DateUtils.getStartDateISOString(startDate)
    const eDate = DateUtils.getEndDateISOString(endDate)
    const d = new Date();
    let diff = d.getTimezoneOffset();
    return {
      gte:sDate,
      lte:eDate,
      timeZoneOffset: diff
    }
  }

  public static lastMonthDateRange() {
    let currentDt = dayjs()
    let currentMonthStart = currentDt.startOf('month')
    const startDate = currentMonthStart.subtract(1, 'month')
    const endDate = startDate.endOf('month')
    const sDate = DateUtils.getStartDateISOString(startDate)
    const eDate = DateUtils.getEndDateISOString(endDate)
    const d = new Date();
    let diff = d.getTimezoneOffset();
    return {
      gte:sDate,
      lte:eDate,
      timeZoneOffset: diff
    }
  }

  public static lastSixMonthDateRange() {
    let currentDt = dayjs()
    let currentMonthStart = currentDt.startOf('month')
    const startDate = currentMonthStart.subtract(6, 'month')
    const endDate = startDate.add(6, 'month').endOf('month')
    const sDate = DateUtils.getStartDateISOString(startDate)
    const eDate = DateUtils.getEndDateISOString(endDate)
    const d = new Date();
    let diff = d.getTimezoneOffset();
    return {
      gte:sDate,
      lte:eDate,
      timeZoneOffset: diff
    }
  }

  public static lastYearDateRange() {
    let currentDt = dayjs()
    let currentYear = currentDt.year()
    const startDate = dayjs(`01/01/${currentYear-10}`,'MM/DD/YYYY').startOf('date')
    // const endDate = dayjs(`12/31/${currentYear-1}`,'MM/DD/YYYY').endOf('month')
    const endDate = currentDt
    
    const d = new Date();
    let diff = d.getTimezoneOffset();

    const sDate = DateUtils.getStartDateISOString(startDate)
    const eDate = DateUtils.getEndDateISOString(endDate)
    //DateUtils.getEndDateISOString(endDate)
    //DateUtils.toISOString(endDate)
    return {
      gte:sDate,
      lte:eDate,
      timeZoneOffset: diff
    }
  }

  
}
