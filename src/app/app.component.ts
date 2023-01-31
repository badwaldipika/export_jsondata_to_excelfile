import { Component } from '@angular/core';
import { environment } from '../../src/environments/environment';
import * as XLSX from 'xlsx';
import { FileSaverService } from 'ngx-filesaver';
import { RestAPIService } from '../../src/app/services/restapi.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private filersaver: FileSaverService, private restapi: RestAPIService) { }
  title = 'Export to excel Demo';

  async excelExport() {
    debugger
    var response = await this.getData().subscribe({
      next: (response) => {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';

        const worksheet = XLSX.utils.json_to_sheet(response);

        const workbook = {
          Sheets: {
            'testingSheet': worksheet
          },
          SheetNames: ['testingSheet']
        }

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const blobData = new Blob([excelBuffer], { type: EXCEL_TYPE });

        this.filersaver.save(blobData, "demoFile");
      },
      error: (error) => console.error(error)
    });;

  }

  getData(): Observable<any> {
    const requestUrl = `${environment.apiURL}application/list?sort=app_id&order=asc&page=1&per_page=25&filter=`;
    return this.restapi.get<Array<any>>(requestUrl);
  }
}
