import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RemoteCallService } from '../../backend/backend.service';
import { SubTopic } from '../../models/sub-topic';

@Component({
  selector: 'app-editable-subtopic',
  standalone: true,
  templateUrl: 'editable-subtopic.component.html',
  styleUrls: ['editable-subtopic.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class EditableSubtopicComponent implements OnInit {
  @Input() subtopic: any | null = null; 
  @Output() saveUpdate = new EventEmitter<SubTopic>();

  editForm!: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder, private rm: RemoteCallService) {}

  ngOnInit(): void {
    console.log('EditableSubtopicComponent initialized with subtopic:', this.subtopic);
    this.initializeForm();
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      name: [this.subtopic.name, [Validators.required, Validators.minLength(2)]],
      noOfAttempts: [this.subtopic.noOfAttempts || 0, [Validators.min(0)]],
      passedNumber: [this.subtopic.passedNumber || 0, [Validators.min(0)]],
      failedNumber: [this.subtopic.failedNumber || 0, [Validators.min(0)]],
      notes: [this.subtopic.notes || ''],
      rating: [this.subtopic.rating || 0, [Validators.min(0), Validators.max(5)]]
    });
  }

  toggleEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editForm.reset({
      name: this.subtopic.name,
      noOfAttempts: this.subtopic.noOfAttempts || 0,
      passedNumber: this.subtopic.passedNumber || 0,
      failedNumber: this.subtopic.failedNumber || 0,
      notes: this.subtopic.notes || '',
      rating: this.subtopic.rating || 0
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) return;

    // Merge form changes with existing audit properties
    const updatedRecord: SubTopic = {
      ...this.subtopic,
      ...this.editForm.value
    };

    this.rm.postStringData('topic/subtopic/save', JSON.stringify(updatedRecord)).subscribe({
      next: (response) => {
        console.log('Subtopic updated successfully:', response);    
      }
    });
    //this.saveUpdate.emit(updatedRecord);
    this.isEditing = false;
  }
}
