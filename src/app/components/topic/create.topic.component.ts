import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Topic } from "../../models/topic";
import { SubTopic } from "../../models/sub-topic";
import { RemoteCallService } from "../../backend/backend.service";


@Component({
  selector: 'app-create-topic',
  standalone: true,
  templateUrl: 'create.topic.component.html',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  styleUrls: ['./create.topic.component.scss']
})
export class CreateTopicComponent implements OnInit {

    topicForm: FormGroup;
    skills : string[] = [];

  constructor(private fb: FormBuilder, private remorteCallService: RemoteCallService) {
    this.topicForm = this.fb.group({
      id: [undefined],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      skillName : ['', [Validators.required, Validators.maxLength(200)]],
      subTopicSet: this.fb.array([])
    });

    // start with one empty subtopic
    this.addSubtopic();
    this.topicForm.valueChanges.subscribe(() => {
      // reactive side-effects could be placed here
    });
  }
    ngOnInit(): void {
        this.remorteCallService.getData('skill/names').subscribe({
            next: (skills) => {
                this.skills = skills;
            },
            error: (err) => {
                console.error('Error fetching skills for topic creation:', err);
            }
        });
    }

  get name(): FormControl {
    return this.topicForm.get('name') as FormControl;
  }
  get skillName(): FormControl {
    return this.topicForm.get('skillName') as FormControl;
  }
  get subTopicSet(): FormArray {
    return this.topicForm.get('subTopicSet') as FormArray;
  }

  private newSubTopic(s?: Partial<SubTopic>) {
    return this.fb.group({
      id: [s?.id ?? null],
      name: [s?.name ?? '', [Validators.required, Validators.maxLength(200)]],
      notes: [s?.notes ?? '', Validators.maxLength(2000)],
      noOfAttempts: [s?.noOfAttempts ?? '', Validators.maxLength(2000)],
      passedNumber: [s?.passedNumber ?? '', Validators.maxLength(2000)],
      failedNumber: [s?.failedNumber ?? '', Validators.maxLength(2000)],
      rating: [s?.rating ?? '', Validators.maxLength(2000)]
    });
  }

  addSubtopic(defaultVal?: Partial<SubTopic>) {
    this.subTopicSet.push(this.newSubTopic(defaultVal));
  }

  addTemplate() {
    const templates: SubTopic[] = [
      {
        name: 'Generics and Type Erasure', notes: 'Understand how generics work and their runtime limitations.',
        status: ""
      },
    ];
    templates.forEach(t => this.addSubtopic(t));
  }

  removeSubtopic(index: number) {
    this.subTopicSet.removeAt(index);
  }

  canSubmit(): boolean {
    return false;// Ensure form is valid and at least one subtopic exists
    //return this.topicForm.valid && this.subTopicSet.length > 0;
  }

  submit() {
    if (!this.canSubmit()) {
      this.topicForm.markAllAsTouched();
      return;
    }

    const payload: Topic = {
      id: this.topicForm.value.id,
      name: this.name.value.trim(),
      subTopicSet: this.subTopicSet.controls.map(ctrl => {
        const v = ctrl.value;
        return {
          name: (v.name || '').trim(),
          notes: (v.notes || '').trim()
        } as SubTopic;
      })
    };

    this.remorteCallService.postStringData('', JSON.stringify(payload)).subscribe({
      next: (created) => {
        alert('Topic created successfully.');
        console.log('Created Topic:', created);
        // optionally reset or navigate
      },
      error: (err) => {
        console.error(err);
        alert('Failed to create topic: ' + (err?.message ?? err));
      }
    });
  }

  // helper for template access
  controls() {
    return this.subTopicSet.controls;
  }

  addTopic(){
    this.remorteCallService.postStringData('topic/add', JSON.stringify(this.topicForm.value)).subscribe({
      next: (created) => {
        alert('Topic created successfully.');
        console.log('Created Topic:', created);
        // optionally reset or navigate
      },
      error: (err) => {
        console.error(err);
        alert('Failed to create topic: ' + (err?.message ?? err));
      }
    });
  }
}