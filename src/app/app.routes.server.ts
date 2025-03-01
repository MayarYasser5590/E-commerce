import { RenderMode, ServerRoute } from '@angular/ssr';
import path from 'path';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'details/:id',
    renderMode: RenderMode.Server
  }
];
