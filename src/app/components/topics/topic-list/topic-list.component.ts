import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RemoteCallService } from '../../../backend/backend.service';
import { Topic } from '../../../models/topic';

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss']
})
export class TopicListComponent implements OnInit {
  topics: Topic[] = [];
  filteredTopics: Topic[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';

  constructor(private readonly remoteService: RemoteCallService) {}

  ngOnInit(): void {
    this.fetchTopics();
  }

  fetchTopics(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.remoteService.getData('topic/list').subscribe({
      next: (data: Topic[]) => {
        this.topics = data;
        this.filteredTopics = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching topics list:', err);
        this.errorMessage = 'Failed to load topic inventory from the server.';
        this.isLoading = false;
      }
    });
  }

  // Frontend filter to quickly search through loaded topics by name
  filterTopics(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTopics = this.topics;
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredTopics = this.topics.filter(topic => 
      topic.name.toLowerCase().includes(term) ||
      topic.subTopicSet?.some(sub => sub.name.toLowerCase().includes(term))
    );
  }

  onDeleteTopic(id?: number): void {
    if (!id) return;
    if (confirm('Are you sure you want to permanently delete this topic and all its nested sub-topics?')) {
      this.remoteService.putStringData(`topics/delete/${id}`, '').subscribe({
        next: () => {
          this.fetchTopics(); // Automatically hot-reloads data grid table on success
        },
        error: (err) => {
          console.error('Error executing delete request:', err);
          alert('Failed to delete topic. Please check backend integration constraints.');
        }
      });
    }
  }
}
