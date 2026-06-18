import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RemoteCallService } from '../../../backend/backend.service';
import { Skill } from '../../../models/skill';

@Component({
  selector: 'app-list-skill',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-skill.component.html',
  styleUrls: ['./list-skill.component.scss']
})
export class ListSkillComponent implements OnInit {
  skills: Skill[] = [];
  isLoading: boolean = true;

  constructor(private readonly remoteService: RemoteCallService) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.isLoading = true;
    this.remoteService.getData('skill/list').subscribe({
      next: (data: Skill[]) => {
        this.skills = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching skills:', err);
        this.isLoading = false;
      }
    });
  }

  // Maps individual Skill Categories into different Bootstrap alert colors dynamically
  getCategoryBadgeClass(category: string): string {
    switch (category?.toUpperCase()) {
      case 'BACKEND': return 'bg-dark text-white';
      case 'FRONTEND': return 'bg-info text-dark';
      case 'DATABASE': return 'bg-warning text-dark';
      case 'DEVOPS': return 'bg-purple text-white'; // Custom scss class or fallback
      default: return 'bg-secondary text-white';
    }
  }

  onDeleteSkill(id?: number): void {
    if (!id) return;
    if (confirm('Are you sure you want to permanently delete this skill?')) {
      // Assuming your service supports delete operations or replace with putStringData mapping
      this.remoteService.putStringData(`skills/delete/${id}`, '').subscribe({
        next: () => this.loadSkills(), // Refresh list on success
        error: (err) => console.error('Error deleting skill:', err)
      });
    }
  }
}
