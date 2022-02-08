import { Component } from '@angular/core';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent {

  pdfSrc = "";
  pageVariable = 1;

  nextPage() {
    this.pageVariable++;
  }

  afterLoadComplete(pdf: any) {
    console.log('after-load-complete');
  }

  pageRendered(e: CustomEvent) {
    console.log('(page-rendered)', e);
  }

  textLayerRendered(e: CustomEvent) {
    console.log('(text-layer-rendered)', e);
  }

  onFileSelected() {
    let $img: any = document.querySelector('#file');

    if (typeof (FileReader) !== 'undefined') {
      let reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };

      reader.readAsArrayBuffer($img.files[0]);
    }
  }

}
