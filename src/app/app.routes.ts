import { Routes } from '@angular/router';
import { AddSkillComponent } from './components/skills/add-skill/add-skill.component';
import { ListSkillComponent } from './components/skills/list-skill/list-skill.component';
import { ViewSkillComponent } from './components/skills/view-skill/view-skill.component';
import { CreateTopicComponent } from './components/topics/create-topic/create-topic.component';
import { UpdateTopicComponent } from './components/topics/update-topic/update-topic.component';
import { ViewTopicComponent } from './components/topics/view-topic/view-topic.component';
import { TopicListComponent } from './components/topics/topic-list/topic-list.component';

export const routes: Routes = [
     { 
    path: 'skills/add', 
    component: AddSkillComponent 
  },
  { 
    path: 'skills/skill-list', 
    component: ListSkillComponent 
  },
   { path: 'skills/view/:id', component: ViewSkillComponent },
    { path: 'topic/create', component: CreateTopicComponent },
    { path: 'topics/update/:id', component: UpdateTopicComponent },
    { path: 'topics/view/:id', component: ViewTopicComponent },
      { path: 'topics', component: TopicListComponent },
  
];
