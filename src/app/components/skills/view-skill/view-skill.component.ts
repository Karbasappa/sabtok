import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RemoteCallService } from '../../../backend/backend.service'
import { Skill } from '../../../models/skill';

@Component({
  selector: 'app-view-skill',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-skill.component.html',
  styleUrls: ['./view-skill.component.scss']
})
export class ViewSkillComponent implements OnInit {
  skillId!: number;
  skill: Skill | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly remoteService: RemoteCallService
  ) {}

  ngOnInit(): void {
    // Extract the dynamic ':id' route parameter from the URL string path
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.skillId = +idParam;
      this.fetchSkillDetails();
    } else {
      this.isLoading = false;
      this.errorMessage = 'Invalid resource endpoint ID reference identifier mapping.';
    }
  }

  fetchSkillDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Adjust 'skills/' string signature path to match your target backend API mapping layout
    this.remoteService.getData(`skill/${this.skillId}`).subscribe({
      next: (data: Skill) => {
        this.skill = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching skill profile data:', err);
        this.errorMessage = 'Failed to load skill details. The item may no longer exist.';
        this.isLoading = false;
      }
    });
  }

  getCategoryBadgeClass(category?: string): string {
    switch (category?.toUpperCase()) {
      case 'BACKEND': return 'bg-dark text-white';
      case 'FRONTEND': return 'bg-info text-dark';
      case 'DATABASE': return 'bg-warning text-dark';
      case 'DEVOPS': return 'bg-primary text-white';
      default: return 'bg-secondary text-white';
    }
  }
}
