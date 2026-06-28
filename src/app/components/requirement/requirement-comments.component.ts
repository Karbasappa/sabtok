import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RemoteCallService } from '../../backend/backend.service';

interface RequirementComment {
  id?: string;
  parentId: string;
  comment: string;
  createdAt?: string | null;
}

@Component({
  selector: 'app-requirement-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'requirement-comments.component.html',
  styleUrls: ['requirement-comments.component.css']
})
export class RequirementCommentsComponent implements OnInit {
  // Input binding link pointing directly to Requirement ID
  @Input() requirementId!: string;
  
  commentForm!: FormGroup;
  commentsList: RequirementComment[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder, 
    private remoteCallService: RemoteCallService
  ) {}

  ngOnInit(): void {
    if (!this.requirementId) {
      console.error('Comments layer initialized missing a valid parent RequirementId connection.');
      return;
    }
    this.initForm();
    this.loadComments();
  }

  private initForm(): void {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  loadComments(): void {
    // Fetches targeting all records indexed under the parent ID reference key
    this.remoteCallService.getData(`api/v1/requirements/comments/${this.requirementId}`).subscribe({
      next: (res: any) => {
        this.commentsList = res;
      },
      error: (err) => console.error('Error rendering comments history matrix:', err)
    });
  }

  onAddComment(): void {
    if (this.commentForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;

    // Construct backend entity template shape matching JPA column configurations
    const newCommentPayload = {
      parentId: this.requirementId,
      comment: this.commentForm.get('comment')?.value
    };

    this.remoteCallService.postStringData(
      'api/v1/requirements/comments/save', 
      JSON.stringify(newCommentPayload)
    ).subscribe({
      next: () => {
        this.commentForm.reset();
        this.isSubmitting = false;
        this.loadComments(); // Refresh local list stream state parameters
      },
      error: (err) => {
        console.error('Failed processing target comment persist pipeline:', err);
        this.isSubmitting = false;
      }
    });
  }
}
