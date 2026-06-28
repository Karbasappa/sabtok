import { Component } from "@angular/core";
import { SubTopic } from "../../../models/sub-topic";
import { RemoteCallService } from "../../../backend/backend.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-create-subtopic',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './create-subtopic.component.html',
  styleUrls: ['./create-subtopic.component.css']
})
export class CreateSubTopicComponent {

    topicNames:Record<string, number> = {};

     topic: SubTopic = {
    name: 'string reverse',
    topicId: 0,
    noOfAttempts: 0,
    passedNumber: 0,
  };

  constructor(private remoteService: RemoteCallService) {}

  ngOnInit(): void {

    this.remoteService.getData('topic/list/topic-names-ids').subscribe({
      next: (result) => {
        this.topicNames = result;
      },
      error: (err) => {
        console.error('Error fetching topic names:', err);
      }
    });
  }


  addSubtopic(): void {
    const passed = this.topic.passedNumber || 0;
    const failed = this.topic.failedNumber || 0;
    this.topic.noOfAttempts = passed + failed;
    this.remoteService.postStringData('topic/subtopic/add', JSON.stringify(this.topic))
      .subscribe((response: SubTopic) => {
        alert('saved sub topic '+response.id);
      });
    console.log('Saved Data:', JSON.stringify(this.topic));
  }
}