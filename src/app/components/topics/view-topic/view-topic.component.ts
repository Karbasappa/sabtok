import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RemoteCallService } from '../../../backend/backend.service';
import { Topic } from '../../../models/topic';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-view-topic',
  standalone: true,
  imports: [CommonModule, RouterModule,AgGridAngular],
  templateUrl: './view-topic.component.html',
  styleUrls: ['./view-topic.component.scss']
})
export class ViewTopicComponent implements OnInit {
  topicId!: number;
  topic: Topic | null = null;
   subTopics: any[] = [];
      defaultColDef: any = {
          resizable: true,
      };
      rowSelection: any = 'multiple';
      public pagination =true
      public componentsGridOptions:GridOptions | undefined;
      public paginationPageSize = 10;
       columnDefs: any = [
      {headerName: 'Topic Id', field: 'topicId', filter: true   },
      {headerName: 'Topic Name', field: 'name', filter: true  },
       {headerName: 'Rating', field: 'rating', filter: true  }
    ];
  

  constructor(
    private readonly route: ActivatedRoute,
    private readonly remoteService: RemoteCallService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.topicId = +idParam;
      this.fetchTopicDetails();
    }
  }

  fetchTopicDetails(): void {
    this.remoteService.getData(`topic/${this.topicId}`).subscribe({
      next: (data: Topic) => {
        this.topic = data;
          this.subTopics = data.subTopicSet;  
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
             this.router.navigate(['/topics/update/' + this.topicId]);
         }
}
