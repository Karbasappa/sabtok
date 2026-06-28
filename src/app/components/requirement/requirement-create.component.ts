import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Requirement } from '../../models/requirement.model';
import { RemoteCallService } from '../../backend/backend.service';

@Component({
  selector: 'app-requirement-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'requirement-create.component.html',
  styleUrls: ['./requirement-create.component.css']
})
export class RequirementCreateComponent implements OnInit {
  requirementForm!: FormGroup;
    skillOptions = [];
    filteredSubSkillOptions = [];
  constructor(private fb: FormBuilder, private remoteCallService: RemoteCallService) {}

  ngOnInit(): void {
    this.remoteCallService.getData('skill/names').subscribe( res => {
        this.skillOptions = res;
    })
    this.initForm();
  }

  private initForm(): void {
    this.requirementForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(500)]],
      skill: ['', Validators.required],
      subSkill: [''],
      userStory: [''],
      epic: [''],
      priority: ['LOW', Validators.required],
      components: [''],
      plannedReleaseDate: ['', Validators.required],
      actualReleaseDate: [''],
      requirementStatus: ['']
    });
  }

  onSubmit(): void {
    if (this.requirementForm.valid) {
      const newRequirement: Requirement = this.requirementForm.value;
      newRequirement.requirementStatus = 'OPEN';
      console.log('Sending data to backend service:', newRequirement);
      this.remoteCallService.postStringData('api/v1/requirements/save', JSON.stringify(newRequirement))
      .subscribe(res => {
        alert('saved')
      })
    } else {
      this.markFormGroupTouched(this.requirementForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
  getSubSkill() {
    const skill = this.requirementForm.get('skill')?.value;
    this.remoteCallService.getData('skill/subskill/names/'+skill).subscribe( res => {
        this.filteredSubSkillOptions = res;
    })
  }
}
