import { CalculoDiluicaoResultado } from './CalculoDiluicaoResultado';
import { CalculoDiluicaoResultadoTanque } from './CalculoDiluicaoResultadoTanque';
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
   * Arredonda o valor para 100 litros
   * Ex: 1150 arredonda para 1100.
   *     1149 arredonda para 1100
   * @param valor
   */
  private _arredondarValor(valor: number): number {
    const restoDivisao = valor % 100;

    if (restoDivisao < 50) {
      return valor - restoDivisao;
    }

    return valor - restoDivisao + 100;
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
  private _calcularValorParaTanque(
    tanque: Tanque
  ): CalculoDiluicaoResultadoTanque {
    // Aplica fórmula V1 = (C2 * V2) / C1
    const volumeMateriaPrima =
      (this._concentracaoCloroDesejada * tanque) /
      this._concentracaoCloroMateriaPrima;

    const volumeMateriaPrimaArredondada =
      this._arredondarValor(volumeMateriaPrima);

    const resultadoTanque = <CalculoDiluicaoResultadoTanque>{
      tanque,
      volumeMateriaPrima: volumeMateriaPrimaArredondada,
      volumeAgua: tanque - volumeMateriaPrimaArredondada,
    };

    return resultadoTanque;
  }

  public calcular(): CalculoDiluicaoResultado {
    return <CalculoDiluicaoResultado>{
      data: new Date(),
      concentracaoCloroMateriaPrima: this._concentracaoCloroMateriaPrima,
      concentracaoCloroDesejada: this._concentracaoCloroDesejada,
      resultadoTanqueList: this._tanques.map((tanque) =>
        this._calcularValorParaTanque(tanque)
      ),
    };
  }
}
