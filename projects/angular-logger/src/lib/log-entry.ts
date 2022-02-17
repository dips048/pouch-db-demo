import { LogLevel } from "./logger.service";

export class LogEntry {

  constructor(
    public entryDate: Date = new Date(),
    public message: string = "",
    public level: LogLevel = LogLevel.All,
    public extraInfo: any[] = [],
    public logWithDate: boolean = true
  ) {}

  buildLogString(): string {
    let ret: string = "";
    if(this.logWithDate) {
      ret = new Date() + " - ";
    }
    ret += "Type: " + this.level;
    ret += " - Message: " + this.message;
    if(this.extraInfo.length) {
      ret += " - Extra Info: " + this.formatParams(this.extraInfo);
    }
    return ret;
  }

  private formatParams(params: any[]) : string {
    let ret: string = params.join(",");
    if(params.some(p => typeof p == "object")) {
      ret = "";
      for (let item of params) {
        ret += JSON.stringify(item) + ",";
      }
    }
    return ret;
  }
}
