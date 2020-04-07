export class Alert {
  public errorOrSuccess: string;
  public title: string;
  public message: string;
  constructor(errorOrSuccess: string, title: string, message: string) {
    this.errorOrSuccess = errorOrSuccess;
    this.title = title;
    this.message = message;
  }
}

export interface AlertObject {
  instance?: Alert;
}
