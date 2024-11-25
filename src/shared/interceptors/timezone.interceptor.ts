import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TimezoneInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return this.convertDates(data);
      }),
    );
  }

  private convertDates(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (data instanceof Date) {
      return new Date(data.getTime() + 5 * 60 * 60 * 1000);
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.convertDates(item));
    }

    if (typeof data === 'object') {
      const newData = {};
      for (const key in data) {
        if (data[key] instanceof Date) {
          newData[key] = new Date(data[key].getTime() + 5 * 60 * 60 * 1000);
        } else if (typeof data[key] === 'object') {
          newData[key] = this.convertDates(data[key]);
        } else {
          newData[key] = data[key];
        }
      }
      return newData;
    }

    return data;
  }
}
