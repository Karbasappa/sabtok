export interface SubTopic {
  status: string;
  id?: number;
  name: string;
  topicId?: number;
  priority?:string;
  category?:string;       // Matches Long topicId
  noOfAttempts?: number;  // Matches Long noOfAttempts
  passedNumber?: number;  // Matches Long passedNumber
  failedNumber?: number;  // Matches Long failedNumber
  notes?: string;         // Matches String notes
  rating?: number;
  attempts?: Attempts []        // Matches Integer rating
}

export class Attempts {
   id: string | undefined;
   subTopicId: number | undefined;
   attemptsEnum?: AttemptsEnum;
   marksScored?: number;
   totalMarks?: number;
   comments?: string;
   result?: string;

}

export enum AttemptsEnum {
  CODE_PRACTICE,THEROY,EXAM, REVIEW
}
