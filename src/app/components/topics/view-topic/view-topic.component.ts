import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RemoteCallService } from '../../../backend/backend.service';
import { Topic } from '../../../models/topic';

@Component({
  selector: 'app-view-topic',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-topic.component.html',
  styleUrls: ['./view-topic.component.scss']
})
export class ViewTopicComponent implements OnInit {
  topicId!: number;
  topic: Topic | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly remoteService: RemoteCallService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.topicId = +idParam;
      this.fetchTopicDetails();
    } else {
      this.isLoading = false;
      this.errorMessage = 'Invalid topic identification parameter reference mapping.';
    }
  }

  fetchTopicDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.remoteService.getData(`topic/${this.topicId}`).subscribe({
      next: (data: Topic) => {
        this.topic = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading detailed topic hierarchy view:', err);
        this.errorMessage = 'Failed to load topic specifications. It may have been relocated or deleted.';
        this.isLoading = false;
      }
    });
  }
}
