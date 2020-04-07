export interface StatementsRecentlyAnalysed {
  transaction_id: string;
  url: string | object;
  analytics_pdf: string;
  analysis_score: number;
}

export class AnalysisSuccessOrPreviewMessage {
  svg: string;
  message: string;
  analysisPdf;
  constructor(svg, message, analysisPdf) {
    this.svg = svg;
    this.message = message;
    this.analysisPdf = analysisPdf;
  }

  returnAButton(): string {
    if (this.svg.includes("check")) {
      return `<a href="${this.analysisPdf}" type="button" target = "_blank" style="margin-top: 20px; font-size: 2rem;" class="btn btn-secondary" data-dismiss="modal">
              View
        </a>`;
    }
  }

  previewResponse(): string {
    if (this.analysisPdf.includes("preview")) {
      return `
        <div
        id="HoldingAnalysisSuccessMessage"
            style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center"
      >
          <div>
              <img
              class="position-relative u-z-index-3 mx-5"
              src="../../../assets/svg/mockups/${this.svg}"
              alt="Image description"
                />
          </div>
          ${this.message}

      <a routerLink="/billing" style="margin-top: 20px;" class="btn btn-secondary">
            Subscribe Now
      </a>
      </div>`;
    }
  }
}
