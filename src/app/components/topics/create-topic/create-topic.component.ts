import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RemoteCallService } from '../../../backend/backend.service';
import { Topic } from '../../../models/topic';
import { Skill } from '../../../models/skill'; 

@Component({
  selector: 'app-create-topic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.scss']
})
export class CreateTopicComponent implements OnInit {
  topicForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
 // New properties for dynamic Skill loading
  skills = [];
  isSkillsLoading = false;
  constructor(
    private readonly fb: FormBuilder,
    private readonly remoteService: RemoteCallService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSkills();
  }

  // Initialize form structure
  private initForm(): void {
    this.topicForm = this.fb.group({
      skillId: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      subTopicSet: this.fb.array([]) // Array to hold child sub-topics
    });

    // Automatically seed one empty sub-topic row on page load
    this.addSubTopic();
  }

  // Getter for easy template loop access to the FormArray
  get subTopicSet(): FormArray {
    return this.topicForm.get('subTopicSet') as FormArray;
  }

  // Creates a clean Sub-Topic FormGroup instance
  private createSubTopicGroup(): FormGroup {
  return this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    notes: ['']
  });
}

  // Append a new dynamic input row
  addSubTopic(): void {
    this.subTopicSet.push(this.createSubTopicGroup());
  }

  // Remove a row by its layout array index
  removeSubTopic(index: number): void {
    if (this.subTopicSet.length > 1) {
      this.subTopicSet.removeAt(index);
    } else {
      // Clear value if it's the last remaining row
      this.subTopicSet.at(0).reset();
    }
  }

  onSubmit(): void {
    if (this.topicForm.invalid) {
      this.topicForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const newTopic: Topic = this.topicForm.value;

    // Hits your Spring Boot @PostMapping endpoints on '/api/topics'
    this.remoteService.postStringData('topic/add', JSON.stringify(newTopic)).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/topics']); // Redirect to full inventory on success
      },
      error: (err) => {
        console.error('Error saving nested topic layout:', err);
        this.errorMessage = 'Failed to save the topic hierarchy structure. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  loadSkills(): void {
    this.isSkillsLoading = true;
    this.remoteService.getData('skill/names').subscribe({
      next: (data) => {
        this.skills = data;
        this.isSkillsLoading = false;
      },
      error: (err) => {
        console.error('Error fetching skills list:', err);
        this.errorMessage = 'Failed to load skill domains for the dropdown picker.';
        this.isSkillsLoading = false;
      }
    });
  }
}
