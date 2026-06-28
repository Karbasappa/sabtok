import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Requirement } from '../../models/requirement.model';
import { Router, RouterModule } from '@angular/router';
import { RemoteCallService } from '../../backend/backend.service';
import { RequirementCommentsComponent } from '../requirement/requirement-comments.component';

@Component({
  selector: 'app-requirement-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RequirementCommentsComponent],
  templateUrl: './requirement-list.component.html',
  styleUrls: ['./requirement-list.component.css']
})
export class RequirementListComponent implements OnInit {

   public Math = Math; 
  requirements: Requirement[] = [];
  filteredRequirements: Requirement[] = [];
  searchTerm: string = '';
  expandedRequirementIds: Set<string> = new Set<string>();

  // Pagination State Matrix Parameters
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  constructor(private router: Router, private rem: RemoteCallService){}

  ngOnInit(): void {
    this.loadRequirements();
  }

  loadRequirements(): void {
    // Call the paginated endpoint with dynamic page tracking configuration states
    const url = `api/v1/requirements/list-page?page=${this.currentPage}&size=${this.pageSize}`;
    
    this.rem.getData(url).subscribe((res: any) => {
        // Spring Data Page object encapsulates arrays inside 'content'
        this.requirements = res.content || [];
        this.totalElements = res.totalElements || 0;
        this.totalPages = res.totalPages || 0;
        
        this.filterResults();
    });
  }

  filterResults(): void {
    if (!this.searchTerm.trim()) {
      this.filteredRequirements = [...this.requirements];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredRequirements = this.requirements.filter(req => 
      (req.id?.toLowerCase().includes(term)) ||
      (req.description?.toLowerCase().includes(term)) ||
      (req.skill?.toLowerCase().includes(term)) ||
      (req.subSkill?.toLowerCase().includes(term))
    );
  }

  // Navigation Event Handling Listeners
  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.expandedRequirementIds.clear(); // Safe state purge on shift
      this.loadRequirements();
    }
  }

  getPriorityBadgeClass(priority: string): string {
    const currentStatus = priority ?? 'LOW';
    switch (currentStatus.toUpperCase()) {
      case 'HIGH': return 'bg-danger';
      case 'MEDIUM': return 'bg-warning text-dark';
      case 'LOW': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  }

  getStatusBadgeClass(status: string): string {
    const currentStatus = status ?? 'OPEN';
    return currentStatus.toUpperCase() === 'OPEN' ? 'bg-success' : 'bg-primary';
  }

  toggleComments(requirementId: string): void {
    if (this.expandedRequirementIds.has(requirementId)) {
      this.expandedRequirementIds.delete(requirementId);
    } else {
      this.expandedRequirementIds.add(requirementId);
    }
  }

  isCommentsExpanded(requirementId: string): boolean {
    return this.expandedRequirementIds.has(requirementId);
  }

  onEdit(id: string): void {
     this.router.navigate(['/requirements/edit/' + id]);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this requirement?')) {
      this.rem.getData(`api/v1/requirements/delete/${id}`).subscribe(() => {
        this.loadRequirements();
      });
    }
  }
}
