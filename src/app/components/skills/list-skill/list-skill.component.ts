import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RemoteCallService } from '../../../backend/backend.service'; 
import { GridOptions } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';


@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,AgGridAngular],
  templateUrl: './list-skill.component.html'
})
export class SkillLstComponent implements OnInit {

   rowData = [];
    defaultColDef: any = {
        resizable: true,
    };
    rowSelection: any = 'multiple';
    public pagination =true
    public componentsGridOptions: GridOptions | undefined;
    public paginationPageSize = 10;
    columnDefs: any = [
		{headerName: 'Skill Id', field: 'id', filter: true   },
        {headerName: 'mainSkill', field: 'mainSkill', filter: true  },
        {headerName: 'subSkill', field: 'subSkill', filter: true  },
        {headerName: 'skillCategory', field: 'skillCategory', filter: true  },
        {headerName: 'rating', field: 'rating', filter: true  }
	];

  constructor(private remoteCallService: RemoteCallService, private router: Router) { }

  ngOnInit(): void {
    this.remoteCallService.getData('skill/list').subscribe(
      (response) => {
        this.rowData = response;
      },
      (error) => {
        console.error('Error fetching skills:', error);
      }
    );
  }

   onRowSelected(event: any) {
        //   window.alert(
        //       'row ' +
         //        event.node.data.rowNo +
         //        ' selected = ' +
          //       event.node.isSelected()
         //    );
             this.router.navigate(['/view-skill/' + event.node.data.mainSkill]);
         }

      
  
}
