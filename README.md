# Moongoose-Client
An axios client with simple throttling controls that wraps service calls in rxjs observables

### Installation
```
npm install moongoose-client
```
If you use typescript then you'll also need
```
npm install --save-dev @types/node
```

### Usage
app.ts
```
import { Config, MGClient } from "Moongoose-Client";

// This example will make 10 service calls every 10 seconds before throttling.
// When throttling occurs, the client will check every 250 milliseconds to see if it can make the next service calls
// Service calls will be put on hold indefinately until they're able to be called.
const config: Config = {
    callsResetAfterMilliseconds: 10000,
    maxCalls: 10,
    retryCallInMilliseconds: 250
}
MGClient.initialize(config);

MGClient.get<String>("https://facebook.com").subscribe(result => console.log(result));

```
### Troubleshooting
Any issues are likely import and export issues from commonjs/module conversion issues.  
You can develop using module syntax, but at the end of the day it needs to build into commonjs.  
Try modifying your project as follows.  
  
package.json
```
{  "type": "commonjs" }
```
tsconfig.js
```
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "lib": [
      "ES2021"
    ]
  }
}
```

### (Maintainers) How to push a new version
```
npm login
npm run build
npm publish
```