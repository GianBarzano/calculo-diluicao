import { CalculoDiluicaoResultadoTanque } from './CalculoDiluicaoResultadoTanque';
import { ConcentracaoCloroDesejada } from './ConcentracaoCloroDesejada';

export interface CalculoDiluicaoResultado {
  data: Date;
  concentracaoCloroMateriaPrima: number;
  concentracaoCloroDesejada: ConcentracaoCloroDesejada;
  resultadoTanqueList: CalculoDiluicaoResultadoTanque[];
}
