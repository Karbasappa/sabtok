import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topic-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view.topic.component.html',
  styleUrls: ['./view.topic.component.css']
})
export class TopicViewerComponent {
  // Input accepts your Topic JSON structure
  @Input() topic: any = null;

  isCopied = false;

  copyToClipboard() {
    if (!this.topic) return;
    
    const jsonString = JSON.stringify(this.topic, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      this.isCopied = true;
      setTimeout(() => this.isCopied = false, 2000);
    });
  }
}
