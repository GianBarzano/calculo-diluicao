import { Component } from '@angular/core';
import { Tanque } from '../../domain/Tanque';
import { ConcentracaoCloroDesejada } from '../../domain/ConcentracaoCloroDesejada';
import { CalculoDiluicao } from '../../domain/CalculoDiluicao';
import { CalculoDiluicaoResultado } from '../../domain/CalculoDiluicaoResultado';
import { AlertServiceService } from '../../services/alert-service/alert-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calculo-diluicao',
  imports: [CommonModule, FormsModule],
  templateUrl: './calculo-diluicao.component.html',
  styleUrl: './calculo-diluicao.component.less',
})
export class CalculoDiluicaoComponent {
  public readonly ConcentracaoCloroDesejadaCtrl = ConcentracaoCloroDesejada;
  public readonly TanqueCtrl = Tanque;
  public form = {
    concentracaoCloroMateriaPrima: 0,
    concentracaoCloroDesejada: ConcentracaoCloroDesejada.AGUA_SANITARIA,
    tanques: {
      CINCO: true,
      DESESSETE: true,
      VINTE: true,
    },
  };
  public resultado?: CalculoDiluicaoResultado;

  constructor(private _alertServiceService: AlertServiceService) {}

  public onBtnCalcularClick() {
    if (this.form.concentracaoCloroMateriaPrima <= 0) {
      this._alertServiceService.warning({
        message: 'Por favor, informe a concentração de cloro da matéria prima!',
      });
      return;
    }

    if (
      !(
        this.form.tanques.CINCO ||
        this.form.tanques.DESESSETE ||
        this.form.tanques.VINTE
      )
    ) {
      this._alertServiceService.warning({
        message: 'Por favor, selecione pelo menos um tanque de diluição!',
      });
      return;
    }

    // Monta lista de tanques
    const tanques = <Tanque[]>[];

    if (this.form.tanques.CINCO) {
      tanques.push(Tanque.CINCO);
    }
    if (this.form.tanques.DESESSETE) {
      tanques.push(Tanque.DESESSETE);
    }
    if (this.form.tanques.VINTE) {
      tanques.push(Tanque.VINTE);
    }

    // Calcula resultado
    const calculoDiluicao = new CalculoDiluicao(
      this.form.concentracaoCloroMateriaPrima,
      this.form.concentracaoCloroDesejada,
      tanques
    );
    this.resultado = calculoDiluicao.calcular();
  }
}
