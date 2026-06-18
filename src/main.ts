import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// 1. Import AG Grid Registry Modules
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// 2. Register them globally at the application root level
ModuleRegistry.registerModules([AllCommunityModule]);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
