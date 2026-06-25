export class BusinessSchedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isClosed: boolean;
}

export class TimeOff {
  id: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
}