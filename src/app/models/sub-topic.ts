export interface SubTopic {
  status: string;
  id?: number;
  name: string;
  topicId?: number;       // Matches Long topicId
  noOfAttempts?: number;  // Matches Long noOfAttempts
  passedNumber?: number;  // Matches Long passedNumber
  failedNumber?: number;  // Matches Long failedNumber
  notes?: string;         // Matches String notes
  rating?: number;        // Matches Integer rating
}
