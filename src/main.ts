import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense("Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCekx0Rnxbf1x1ZFRHalhSTnRdUiweQnxTdEBjXX5YcXVRRWJeWUV+W0lfag==")

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
