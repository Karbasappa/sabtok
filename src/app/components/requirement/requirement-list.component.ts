import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Requirement } from '../../models/requirement.model';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { RemoteCallService } from '../../backend/backend.service';

@Component({
  selector: 'app-requirement-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './requirement-list.component.html',
  styleUrls: ['./requirement-list.component.css']
})
export class RequirementListComponent implements OnInit {
  // Holds raw backend stream
  requirements: Requirement[] = [];
  // Holds data after user filter searches
  filteredRequirements: Requirement[] = [];
  
  searchTerm: string = '';

  constructor(private router: Router, private rem: RemoteCallService){}

  ngOnInit(): void {
    this.loadRequirements();
  }

  loadRequirements(): void {

    this.rem.getData('api/v1/requirements/list').subscribe((res:Requirement[]) => {
        this.requirements = res;
        console.log(this.requirements)
        this.filteredRequirements = [...this.requirements];
    })
    // Mocking your exact JSON footprint layout 
    
    /*
    this.requirements = [
        {
        "createdAt": null,
        "createdBy": null,
        "updatedAt": "2026-06-28T07:36:23.516956",
        "updatedBy": null,
        "status": "A",
        "id": "REQ141954",
        "description": "t",
        "skill": "Java",
        "subSkill": "String",
        "userStory": "",
        "epic": "",
        "priority": "LOW",
        "components": "",
        "plannedReleaseDate": "2026-06-28",
        "actualReleaseDate": "2026-06-28",
        "requirementStatus": "OPEN",
        "comments": []
    }
    ];
   */
    
    
  }

  filterResults(): void {
    if (!this.searchTerm.trim()) {
      this.filteredRequirements = [...this.requirements];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    
  }

  getPriorityBadgeClass(priority: string): string {
    const currentStatus = priority ?? 'LOW';
    switch (currentStatus) {
      case 'HIGH': return 'bg-danger';
      case 'MEDIUM': return 'bg-warning text-dark';
      case 'LOW': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  }

  getStatusBadgeClass(status: string): string {
    const currentStatus = status ?? 'OPEN';
    return currentStatus === 'OPEN' ? 'bg-success' : 'bg-primary';
  }

  onEdit(id: string): void {
    console.log('Routing/Editing payload instance:', id);
     this.router.navigate(['/requirements/edit/' + id]);
  }

  onDelete(id: string): void {
    console.log('Triggering API deletion context hook:', id);
  }
}
