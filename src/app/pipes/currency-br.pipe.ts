import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyBr'
})
export class CurrencyBrPipe implements PipeTransform {

  transform(value: number): string {
    if (value === null || value === undefined || isNaN(value)) {
      return 'R$ 0,00';
    }

    // Converte para string com 2 casas decimais
    const formattedValue = parseFloat(value.toString()).toFixed(2);

    // Substitui o ponto por vírgula
    const valueWithComma = formattedValue.replace('.', ',');

    return `R$ ${valueWithComma}`;
  }

}
