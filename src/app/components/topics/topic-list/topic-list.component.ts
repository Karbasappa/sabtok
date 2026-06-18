import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RemoteCallService } from '../../../backend/backend.service';
import { Topic } from '../../../models/topic';
import { AgGridAngular } from "ag-grid-angular";
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [CommonModule,RouterOutlet, RouterModule, AgGridAngular,FormsModule],
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss']
})
export class TopicListComponent implements OnInit {
 
   rowData = [];
    defaultColDef: any = {
        resizable: true,
    };
    rowSelection: any = 'multiple';
    public pagination =true
    public componentsGridOptions:GridOptions | undefined;
    public paginationPageSize = 10;
     columnDefs: any = [
		{headerName: 'Topic Id', field: 'id', filter: true   },
        {headerName: 'Topic Name', field: 'name', filter: true  }
	];

  constructor(
    private readonly remoteService: RemoteCallService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
     this.remoteService.getData('topic/list').subscribe({
      next: (data) => {
        this.rowData = data;
      }
    });
  }

   onRowSelected(event: any) {
        //   window.alert(
        //       'row ' +
         //        event.node.data.rowNo +
         //        ' selected = ' +
          //       event.node.isSelected()
         //    );
             this.router.navigate(['/topics/view/' + event.node.data.id]);
         }

}
