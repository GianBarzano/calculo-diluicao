import { Component } from '@angular/core';
import { Tanque } from '../../domain/Tanque';
import { ConcentracaoCloroDesejada } from '../../domain/ConcentracaoCloroDesejada';
import { CalculoDiluicao } from '../../domain/CalculoDiluicao';
import { CalculoDiluicaoResultado } from '../../domain/CalculoDiluicaoResultado';
import { AlertServiceService } from '../../services/alert-service/alert-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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

  /**
   * Realiza validações e o cálculo de manipulação
   * @returns
   */
  private _calcularResultado(): boolean {
    if (this.form.concentracaoCloroMateriaPrima <= 0) {
      this._alertServiceService.warning({
        message: 'Por favor, informe a concentração de cloro da matéria prima!',
      });
      return false;
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
      return false;
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
    return true;
  }

  private _formatFileDate(date: Date): string {
    return date
      .toLocaleString()
      .replaceAll(' ', '_')
      .replaceAll('/', '_')
      .replaceAll(':', '_')
      .replaceAll(',', '');
  }

  /**
   * Gera o pdf do resultado e compartilha via api nativa
   */
  private async _gerarPdfECompartilhar(): Promise<void> {
    const prObterElemento = new Promise<HTMLElement>((res, rej) => {
      const intervalSearchEl = setInterval(() => {
        const data = document.getElementById('resultado');
        console.log('interval data', data);
        if (data != null) {
          clearInterval(intervalSearchEl);
          res(data);
        }
      }, 500);
    });

    const data = await prObterElemento;
    html2canvas(data).then((canvas) => {
      const imgWidth = 80;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF

      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(
        `calculo_manipulacao_${this._formatFileDate(this.resultado!.data)}.pdf`
      ); // Generated PDF
    });
  }

  public async onBtnCalcularClick() {
    if (this._calcularResultado()) {
      await this._gerarPdfECompartilhar();
    }
  }
}
