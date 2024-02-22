import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimwhitespace',
})
export class PipesPipe implements PipeTransform {
  transform(value: string): string {
    value = value.toLowerCase().replace(/\/|\#|\\|\(|\)|\`|\s/g, '');
    return value;
  }
}
