import { Component, Input, OnInit } from '@angular/core';

export interface SubTopic {
  id: number;
  name: string;
  status: string;
  noofattempts: number | null;
  passednumber: number | null;
  failednumber: number | null;
  notes: string;
}

export interface SkillTopic {
  id: number;
  name: string;
  skillname: string;
  updatedat: string;
  status: string;
  subtopicset: SubTopic[];
}

@Component({
  selector: 'app-skill-grid',
  templateUrl: 'skill-grid.component.html',
  styleUrls: ['skill-grid.component.css']
})
export class SkillGridComponent implements OnInit {
  // Input property to accept the "java" or any other skill array
  @Input() topics: SkillTopic[] = [];
  
  // Track expanded row IDs
  expandedRows: Set<number> = new Set<number>();

  ngOnInit(): void {}

  // Toggle row expansion
  toggleRow(topicId: number): void {
    if (this.expandedRows.has(topicId)) {
      this.expandedRows.delete(topicId);
    } else {
      this.expandedRows.add(topicId);
    }
  }

  isRowExpanded(topicId: number): boolean {
    return this.expandedRows.has(topicId);
  }

  // Helper method to format success rate percentage
  getSuccessRate(subtopic: SubTopic): string {
    const passed = subtopic.passednumber || 0;
    const failed = subtopic.failednumber || 0;
    const total = passed + failed;
    
    if (total === 0) return 'N/A';
    return `${Math.round((passed / total) * 100)}%`;
  }
}
