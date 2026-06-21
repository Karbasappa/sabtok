import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AgGridAngular } from "ag-grid-angular";
import { RemoteCallService } from "../../backend/backend.service";
import { GridOptions } from "ag-grid-community";
import { SubtopicEditorComponent } from "./subtopic/subtopic-editor.component";
import { SubTopic } from "../../models/sub-topic";
import { TopicViewerComponent } from "./view.topic.component";
import { Topic } from "../../models/topic";

@Component({
    selector: 'app-topic-list',
    templateUrl: 'topic.list.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, AgGridAngular, SubtopicEditorComponent, TopicViewerComponent]
})
export class TopicListComponent {
    selectedTopic: Topic | null = null;
    isTopicSelected = false;
     rowData = [];
        defaultColDef: any = {
            resizable: true,
        };
        rowSelection: any = 'multiple';
        public pagination =true
        public componentsGridOptions: GridOptions | undefined;
        public paginationPageSize = 10;
        columnDefs: any = [
            {headerName: 'Topic Id', field: 'id', filter: true   },
            {headerName: 'skillName', field: 'skillName', filter: true  },
            {headerName: 'name', field: 'name', filter: true  },
            {headerName: 'updatedAt', field: 'updatedAt', filter: true  },
            {headerName: 'updatedBy', field: 'updatedBy', filter: true  }
        ];
    
      constructor(private remoteCallService: RemoteCallService, private router: Router) {
        this.remoteCallService.getData('topic/list').subscribe(
          (response) => {
            this.rowData = response;
          },
          (error) => {
            console.error('Error fetching skills:', error);
          }
        );
       }

    onRowSelected(event: any) {
  // 1. Only execute when a row is actively checked/selected
  if (event.node.isSelected()) {
    const selectedTopic = event.node.data;
    console.log('Selected Topic Data:', selectedTopic);

    // 2. Safely check if the topic has subtopics inside 'subTopicSet'
    if (selectedTopic && selectedTopic.subTopicSet && selectedTopic.subTopicSet.length > 0) {
      
      // Extract the first subtopic item and create a shallow copy reference
      this.selectedTopic = selectedTopic; // This will be passed to the viewer component};
      this.isTopicSelected = true;
      
    }
  }
}

}