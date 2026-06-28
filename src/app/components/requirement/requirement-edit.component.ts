import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RequirementStatus, Requirement } from '../../models/requirement.model';
import { RemoteCallService } from '../../backend/backend.service';
import { RequirementCommentsComponent } from './requirement-comments.component';

@Component({
  selector: 'app-requirement-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,RequirementCommentsComponent],
  templateUrl: './requirement-edit.component.html',
  styleUrls: ['./requirement-edit.component.css']
})
export class RequirementEditComponent implements OnInit {
  requirementForm!: FormGroup;
  requirementId!: string;
  statusOptions: RequirementStatus[] = Object.values(RequirementStatus) as RequirementStatus[];
  
  skillOptions: string[] = ['Java', 'Angular', 'Python'];
  subSkillMapping: { [key: string]: string[] } = {
    'Java': ['Spring Boot', 'Hibernate', 'Microservices', 'JDBC'],
    'Angular': ['RxJS', 'NgRx', 'Angular Material', 'Directives'],
    'Python': ['Django', 'Flask', 'FastAPI', 'Pandas']
  };
  filteredSubSkillOptions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private rm : RemoteCallService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.trackSkillChanges();
    
    // Extract ID from routing parameters
    this.requirementId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.requirementId) {
      this.loadRequirementData(this.requirementId);
    }
  }

  private initForm(): void {
    this.requirementForm = this.fb.group({
      id: [{ value: '', disabled: true }], // ID remains read-only
      description: ['', [Validators.required, Validators.maxLength(500)]],
      skill: ['', Validators.required],
      subSkill: [''],
      userStory: [''],
      epic: [''],
      priority: ['LOW', Validators.required],
      components: [''],
      plannedReleaseDate: ['', Validators.required],
      actualReleaseDate: [''],
      requirementStatus: [RequirementStatus.OPEN as unknown as string, Validators.required]
    });
  }

  private trackSkillChanges(): void {
    this.requirementForm.get('skill')?.valueChanges.subscribe((selectedSkill: string) => {
      this.filteredSubSkillOptions = this.subSkillMapping[selectedSkill] || [];
    });
  }

  private loadRequirementData(id: string): void {

    this.rm.getData('api/v1/requirements/'+id).subscribe(res => {
          // Populate dynamic subskill collection prior to patching value form states
    this.filteredSubSkillOptions = this.subSkillMapping[res.skill] || [];

    // Map fetched records to target active fields group
    this.requirementForm.patchValue(res);
      
    }
    )
    /*
    // Simulated fetch matching your exact JSON scheme backend footprint
    const mockFetchedRequirement: Requirement = {
      id: id,
      description: 'Implement secure login handling logic',
      skill: 'Java',
      subSkill: 'Spring Boot',
      userStory: 'US-402',
      epic: 'EPIC-12',
      priority: 'LOW',
      components: 'Auth Service',
      plannedReleaseDate: '2026-06-28',
      actualReleaseDate: '2026-06-28',
    };

    // Populate dynamic subskill collection prior to patching value form states
    //this.filteredSubSkillOptions = this.subSkillMapping[mockFetchedRequirement.skill] || [];

    // Map fetched records to target active fields group
    this.requirementForm.patchValue(mockFetchedRequirement);
    */
  }

  onSubmit(): void {
    if (this.requirementForm.valid) {
      // Pull form value dataset (combining disabled id value explicitly)
      const updatedRequirement: Requirement = {
        ...this.requirementForm.value,
        id: this.requirementId
      };
      
      console.log('Sending PUT payload updates to backend API:', updatedRequirement);
      // TODO: Connect to backend Service: this.requirementService.update(this.requirementId, updatedRequirement).subscribe(...)
      
      this.navigateBack();
    } else {
      this.requirementForm.markAllAsTouched();
    }
  }

  navigateBack(): void {
    this.router.navigate(['/requirements']);
  }
}
