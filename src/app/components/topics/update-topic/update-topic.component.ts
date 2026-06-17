import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RemoteCallService } from '../../../backend/backend.service';
import { Topic } from '../../../models/topic';

@Component({
  selector: 'app-update-topic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './update-topic.component.html',
  styleUrls: ['./update-topic.component.scss']
})
export class UpdateTopicComponent implements OnInit {
  topicForm!: FormGroup;
  topicId!: number;
  isSubmitting = false;
  isLoading = true;
  errorMessage = '';
  

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly remoteService: RemoteCallService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.topicId = +idParam;
      this.loadExistingTopic();
    } else {
      this.isLoading = false;
      this.errorMessage = 'Invalid topic reference identifier linked.';
    }
  }

  private initForm(): void {
    this.topicForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(2)]],
      subTopicSet: this.fb.array([])
    });
  }

  get subTopicSet(): FormArray {
    return this.topicForm.get('subTopicSet') as FormArray;
  }

  // 💡 Restored all tracking properties into the Reactive Form schema builder
  private createSubTopicGroup(
    id: number | null = null, 
    name: string = '', 
    notes: string = '',
    noOfAttempts: number = 0,
    passedNumber: number = 0,
    failedNumber: number = 0,
    rating: number = 1
  ): FormGroup {
    return this.fb.group({
      id: [id],
      name: [name, [Validators.required, Validators.minLength(1)]],
      notes: [notes],
      noOfAttempts: [noOfAttempts, [Validators.required, Validators.min(0)]],
      passedNumber: [passedNumber, [Validators.required, Validators.min(0)]],
      failedNumber: [failedNumber, [Validators.required, Validators.min(0)]],
      rating: [rating, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  loadExistingTopic(): void {
    this.isLoading = true;
    this.remoteService.getData(`topic/${this.topicId}`).subscribe({
      next: (data: Topic) => {
        this.topicForm.patchValue({
          id: data.id,
          name: data.name
        });

        // 💡 Populates all raw metrics from the backend list payload
        if (data.subTopicSet && data.subTopicSet.length > 0) {
          data.subTopicSet.forEach((sub: any) => {
            this.subTopicSet.push(
              this.createSubTopicGroup(
                sub.id, 
                sub.name, 
                sub.notes, 
                sub.noOfAttempts || 0, 
                sub.passedNumber || 0, 
                sub.failedNumber || 0, 
                sub.rating || 1
              )
            );
          });
        } else {
          this.addSubTopic();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching topic record:', err);
        this.errorMessage = 'Failed to load existing topic payload data.';
        this.isLoading = false;
      }
    });
  }

  addSubTopic(): void {
    this.subTopicSet.push(this.createSubTopicGroup());
  }

  removeSubTopic(index: number): void {
    if (this.subTopicSet.length > 1) {
      this.subTopicSet.removeAt(index);
    } else {
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

    this.remoteService.putStringData('topic/update', JSON.stringify(this.topicForm.value)).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/topics']);
      },
      error: (err) => {
        console.error('Error executing modification PUT request:', err);
        this.errorMessage = 'Failed to apply configuration revisions to backend server.';
        this.isSubmitting = false;
      }
    });
  }
}
