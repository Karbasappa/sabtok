import { Component, OnInit } from "@angular/core";
import { RemoteCallService } from "../../backend/backend.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EditableSubtopicComponent } from "./editable-subtopic.component";
import { Topic } from "../../models/topic";
import { SubTopic } from "../../models/sub-topic";

@Component({
    selector: 'app-subtask-practice',
    templateUrl: './subtask.practice.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, EditableSubtopicComponent]
})
export class SubtaskPracticeComponent implements OnInit {
    public skills: any[] = [];
    public topics: Topic[] = [];
    public topic: Topic | null = null;
    public selectedSubTopic: SubTopic | null = null;

    constructor(private rmCall: RemoteCallService) {}

    ngOnInit(): void {
        this.rmCall.getData('skill/list').subscribe({
            next: (response) => {
                this.skills = response;
            },
            error: (err) => console.error('Failed to load skills:', err)
        });
    }

    getTopics(mainSkill: string): void {
        this.topic = null;
        this.selectedSubTopic = null;
        this.rmCall.getData(`topic/list/${mainSkill}`).subscribe({
            next: (response) => {
                this.topics = response;
            },
            error: (err) => console.error('Failed to load topics:', err)
        });
    }

    getSubTopics(topicId: string): void {
        this.selectedSubTopic = null;
        this.rmCall.getData(`topic/${topicId}`).subscribe({
            next: (response) => {
                this.topic = response;
            },
            error: (err) => console.error('Failed to load subtopics:', err)
        });
    }

    // Direct object binding via ngModel simplifies this logic completely
    editSubtopic(subtopic: SubTopic): void {
        this.selectedSubTopic = subtopic;
    }

    // Handles the (saveUpdate) output event from the editable form component
    onSubtopicSaved(updatedSubtopic: SubTopic): void {
        // Convert the updated subtopic to FormData because postData expects FormData
        const form = new FormData();
        form.append('id', String(updatedSubtopic.id));
        form.append('name', updatedSubtopic.name ?? '');
        form.append('status', updatedSubtopic.status ?? '');
        form.append('noofattempts', String(updatedSubtopic.noOfAttempts ?? ''));
        form.append('passednumber', String(updatedSubtopic.passedNumber ?? ''));
        form.append('failednumber', String(updatedSubtopic.failedNumber ?? ''));
        form.append('notes', updatedSubtopic.notes ?? '');

        // Change the URL endpoint path ('subtopic/update') to match your backend API routing
        this.rmCall.postData(`subtopic/update`, form).subscribe({
            next: (response) => {
                alert('Subtopic details saved successfully!');
                this.selectedSubTopic = updatedSubtopic;
                
                // Update the local array state so changes are reflected in the UI instantly
                if (this.topic && this.topic.subTopicSet) {
                    const idx = this.topic.subTopicSet.findIndex(st => st.id === updatedSubtopic.id);
                    if (idx !== -1) {
                        this.topic.subTopicSet[idx] = updatedSubtopic;
                    }
                }
            },
            error: (err) => {
                console.error('Failed to persist subtopic updates on server:', err);
                alert('Error saving data. Please try again.');
            }
        });
    }
}
