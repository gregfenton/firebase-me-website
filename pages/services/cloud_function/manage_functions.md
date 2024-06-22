
## v1 function groups
You can group your cloud functions as a single entry point which allows you to organise functions into nested collections

The Cloud function compiler can traverse dot notation for nested cloud functions during the build process
where standard dot notation becomes a hyphenated string on the endpoint.

```js
const example = functions.https.onRequest((request, response) => {});
export const groupA = {
    route1: example,
    route2: example 
}
```
if the exports are from a nested file:
```js
export * as groupA from './collection/index.ts'; // or .js
```

which will be accessible through:
> https://<region>-<project-id>.cloudfunctions.net/groupA-route1
> https://<region>-<project-id>.cloudfunctions.net/groupA-route2 


## OnCall 
## OnRequest