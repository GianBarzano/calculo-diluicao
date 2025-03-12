import { CalculoDiluicaoResultado } from './CalculoDiluicaoResultado';
import { ConcentracaoCloroDesejada } from './ConcentracaoCloroDesejada';
import { Tanque } from './Tanque';

/**
 * Classe responsável por fazer o cálculo de diluição da matéria prima para alcançar
 *  a concentração de cloro desejada
 */
export class CalculoDiluicao {
  constructor(
    private readonly _concentracaoCloroMateriaPrima: number,
    private readonly _concentracaoCloroDesejada: ConcentracaoCloroDesejada,
    private readonly _tanques: Tanque[]
  ) {}

  /**
   * Arredonda o valor para 50 litros
   * Ex: 1123 arredonda para 1100.
   *     1125 arredonda para 1150
   * @param valor
   */
  private _arredondarValor(valor: number): number {
    const restoDivisao50 = valor % 50;

    if (restoDivisao50 < 25) {
      return valor - restoDivisao50;
    }

    return valor - restoDivisao50 + 50;
  }

  /**
   * Calcula o valor de água e matéria prima para a diluição desejada
   * Fórmula: C1 * V1 = C2 * V2, onde:
   *  - C1: Concentração de cloro da matéria prima
   *  - V1: Quantidade de matéria prima
   *  - C2: Concentração de cloro desejada após diluição
   *  - V2: Volume de água do tanque de diluição
   * @param tanque
   * @returns
   */
  private _calcularValorParaTanque(tanque: Tanque): CalculoDiluicaoResultado {
    // Aplica fórmula V1 = (C2 * V2) / C1
    const volumeMateriaPrima =
      (this._concentracaoCloroDesejada * tanque) /
      this._concentracaoCloroMateriaPrima;

    const volumeMateriaPrimaArredondada =
      this._arredondarValor(volumeMateriaPrima);

    const resultadoTanque = <CalculoDiluicaoResultado>{
      tanque,
      volumeMateriaPrima: volumeMateriaPrimaArredondada,
      volumeAgua: tanque - volumeMateriaPrimaArredondada,
    };

    return resultadoTanque;
  }

  public calcular(): CalculoDiluicaoResultado[] {
    return this._tanques.map((tanque) => this._calcularValorParaTanque(tanque));
  }
}
