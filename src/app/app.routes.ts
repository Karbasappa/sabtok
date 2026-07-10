import { Routes } from '@angular/router';
import { AddSkillComponent } from './components/skills/add-skill/add-skill.component';
import { SkillLstComponent } from './components/skills/list-skill/list-skill.component';
import { ViewSkillComponent } from './components/skills/view-skill/view-skill.component';
import { CreateTopicComponent } from './components/topic/create.topic.component';
import { TopicListComponent } from './components/topic/topic.list.component';
import { SubtopicEditorComponent } from './components/topic/subtopic/subtopic-editor.component';
import { SkillsDashboardComponent } from './components/skills/skills-dashboard.component';
import { CreateSubTopicComponent } from './components/topic/subtopic/create-subtopic.component';
import { RequirementCreateComponent } from './components/requirement/requirement-create.component';
import { RequirementListComponent } from './components/requirement/requirement-list.component';
import { RequirementEditComponent } from './components/requirement/requirement-edit.component';
import { SubtaskPracticeComponent } from './components/practice/subtask.practice.component';


export const routes: Routes = [
     { 
    path: 'skills/add', 
    component: AddSkillComponent 
  },
  {path:'skills/skill-list', component:SkillLstComponent},
  {path: 'view-skill/:mainSkill', component: ViewSkillComponent},
  {path:'topic/create',component:CreateTopicComponent},
  {path:'topics',component:SkillsDashboardComponent},
  {path: 'topic/edit-subtopic/:id', component: SubtopicEditorComponent },
  {path:'crete-subtopic', component: CreateSubTopicComponent},
  {path:'create-requirement', component: RequirementCreateComponent},
  {path:'requirements', component: RequirementListComponent},
  { path: 'requirements/edit/:id', component: RequirementEditComponent },
  {path:'practice', component: SubtaskPracticeComponent}
];
