import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemoteCallService } from '../../backend/backend.service';
import { SubtopicEditorComponent } from "../topic/subtopic/subtopic-editor.component";
// IMPORT: Reference your existing standalone editor component

@Component({
  selector: 'app-skills-dashboard',
  standalone: true,
  imports: [CommonModule, SubtopicEditorComponent], // Added to imports array
  templateUrl: './skills-dashboard.component.html',
  styleUrls: ['./skills-dashboard.component.css']
})
export class SkillsDashboardComponent implements OnInit {
  // Query reference to the native <dialog> element in HTML
  @ViewChild('modalElement') modal!: ElementRef<HTMLDialogElement>;

  skillsData: { [key: string]: any[] } = {};
  isLoading = true;
  errorMessage: string | null = null;
  
  // Holds current active subtopic row reference
  selectedSubtopic: any = null;

  expandedSkillNames = new Set<string>();
  expandedTopicIds = new Set<number>();

  constructor(private svc: RemoteCallService) {}

  ngOnInit(): void {
    this.svc.getData('topic/list/skill').subscribe({
      next: (response) => {
        this.skillsData = response;
        this.isLoading = false;
        
        Object.keys(this.skillsData).forEach(skillKey => {
          this.expandedSkillNames.add(skillKey);
        });
      },
      error: (err) => {
        this.errorMessage = 'Failed to load dashboard statistics.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Triggers when a subtopic link is clicked
  onSubtopicClick(subtopic: any): void {
    this.selectedSubtopic = { ...subtopic };
    this.modal.nativeElement.showModal(); // Native browser popup method
  }

  // Safe manual closure hook
  closeModal(): void {
    this.modal.nativeElement.close();
    this.selectedSubtopic = null;
  }

  // Triggers when child component form emits (saved) event successfully
  onEditorSave(updatedSubtopic: any): void {
    console.log('Subtopic saved successfully payload:', updatedSubtopic);
    // Optional: Trigger a grid data re-fetch here if needed
    this.closeModal();
  }

  // --- Pre-existing calculation and layout functions ---
  getSkillRating(topics: any[]): number {
    let totalRating = 0;
    let ratedCount = 0;
    topics.forEach(topic => {
      if (topic.subTopicSet) {
        topic.subTopicSet.forEach((sub: any) => {
          if (sub.rating !== null && sub.rating !== undefined) {
            totalRating += sub.rating;
            ratedCount++;
          }
        });
      }
    });
    return ratedCount > 0 ? Math.round((totalRating / ratedCount) * 10) / 10 : 0;
  }

  getTopicRating(topic: any): number {
    if (!topic.subTopicSet || topic.subTopicSet.length === 0) return 0;
    let totalRating = 0;
    let ratedCount = 0;
    topic.subTopicSet.forEach((sub: any) => {
      if (sub.rating !== null && sub.rating !== undefined) {
        totalRating += sub.rating;
        ratedCount++;
      }
    });
    return ratedCount > 0 ? Math.round((totalRating / ratedCount) * 10) / 10 : 0;
  }

  getStars(rating: number): string[] {
    const rounded = Math.round(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rounded ? '★' : '☆');
    }
    return stars;
  }

  toggleSkill(skillName: string): void {
    if (this.expandedSkillNames.has(skillName)) {
      this.expandedSkillNames.delete(skillName);
    } else {
      this.expandedSkillNames.add(skillName);
    }
  }

  isSkillExpanded(skillName: string): boolean {
    return this.expandedSkillNames.has(skillName);
  }

  toggleTopic(topicId: number): void {
    if (this.expandedTopicIds.has(topicId)) {
      this.expandedTopicIds.delete(topicId);
    } else {
      this.expandedTopicIds.add(topicId);
    }
  }

  isTopicExpanded(topicId: number): boolean {
    return this.expandedTopicIds.has(topicId);
  }
}
