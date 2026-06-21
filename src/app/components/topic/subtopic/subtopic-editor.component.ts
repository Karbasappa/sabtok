import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RemoteCallService } from '../../../backend/backend.service';
import { SubTopic } from '../../../models/sub-topic';
import { Topic } from '../../../models/topic';

@Component({
  selector: 'app-subtopic-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subtopic-editor.component.html',
  styleUrls: ['./subtopic-editor.component.css']
})
export class SubtopicEditorComponent implements OnChanges, OnInit {
  @Input() subtopic?: SubTopic | null = null;
  @Input() showDelete = true; 
  @Output() saved = new EventEmitter<SubTopic>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<number>(); 

  form: FormGroup;
  saving = false;
  deleting = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private svc: RemoteCallService) {
    this.form = this.createForm();
  }

  // ADDED: Template getters for concise error checking
  get name() { return this.form.get('name')!; }
  get rating() { return this.form.get('rating')!; }

  ngOnInit(): void {
    this.svc.getData('topic/'+this.subtopic?.topicId).subscribe({
      next: (result: Topic) => {
        console.log('Fetched data for topic 20:', result);
        //if (Array.isArray(result) && result.length > 0) {
          //const topic20 = result.find(t => t.id === 20);
          console.log('Topic 20 data:', result);
          //if (topic20 && topic20.subTopicSet && topic20.subTopicSet.length > 0) {
            this.form.patchValue(result.subTopicSet[0]);
         // }
       // }
      },
      error: (err) => {
        this.error = 'Failed to load backend data.';
        console.error(err);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['subtopic']) {
      this.patchForm(this.subtopic ?? null);
    }
  }

  // ALIGNED: Form actions matching template naming
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.saved.emit(this.form.getRawValue());
  }

  cancel() {
    this.cancelled.emit();
  }

  remove() {
    const id = this.form.get('id')?.value;
    if (id) {
      this.deleting = true;
      this.deleted.emit(id);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(300)]],
      topicId: [null],
      noOfAttempts: [null, [Validators.min(0)]],
      passedNumber: [null, [Validators.min(0)]],
      failedNumber: [null, [Validators.min(0)]],
      notes: [''],
      rating: [null, [Validators.min(0), Validators.max(5)]]
    });
  }

  private patchForm(s: SubTopic | null) {
    if (!s) {
      this.form.reset();
    } else {
      this.form.patchValue(s);
    }
  }
}
