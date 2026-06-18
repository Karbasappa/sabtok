import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RemoteCallService } from '../../../backend/backend.service';
import { Skill } from '../../../models/skill';

@Component({
  selector: 'app-add-skill',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.scss']
}
)
export class AddSkillComponent implements OnInit {
  errorMessage: string = '';
  isSubmitting: boolean = false;
  // New variables for dynamic categories
  categories: string[] = [];
  isCategoriesLoading: boolean = false;

  constructor(
    private readonly remoteService: RemoteCallService,
    private readonly router: Router
  ) {}

    ngOnInit(): void {
    this.loadCategories();
  }

  onSubmit(form: NgForm): void {
    // Block submission if form constraints fail internally
    if (form.invalid) {
      this.markFormGroupTouched(form);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Map your form fields to match your exact backend structure
    const newSkill: Skill = {
      mainSkill: form.value.mainSkill.trim(),
      subSkill: form.value.subSkill.trim(),
      skillCategory: form.value.skillCategory
    };

    // Replace '/skills' with your actual API endpoint path
    this.remoteService.postStringData('skill/add', JSON.stringify(newSkill)).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.router.navigate(['/skills/add']); // Redirect to the list view on success
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to save skill. Please try again.';
        console.error('Error saving skill:', error);
      }
    });
  }

  // Helper method to catch sneaky submission attempts by highlighting missing fields
  private markFormGroupTouched(form: NgForm): void {
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  }

  loadCategories(): void {
    this.isCategoriesLoading = true;
    
    // 💡 Replace 'skills/categories' with your exact backend API mapping path
    this.remoteService.getData('skill/category').subscribe({
      next: (data: string[]) => {
        this.categories = data;
        this.isCategoriesLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch categories:', err);
        this.errorMessage = 'Could not load skill categories from backend.';
        this.isCategoriesLoading = false;
        // Optional fallback in case your API fails:
        this.categories = ['BACKEND', 'FRONTEND', 'DATABASE', 'DEVOPS', 'OTHER'];
      }
    });
  }
}
