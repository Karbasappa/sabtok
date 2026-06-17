import { SubTopic } from "./sub-topic";

export interface Topic {

     id?: number;              // Optional for new creations, required for updates
  name: string;             // e.g., "Advanced Java Core Features"
  subTopicSet: SubTopic[];  // Array containing the nested children rows
}
