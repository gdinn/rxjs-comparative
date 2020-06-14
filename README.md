# Rxjs and pure JS approaches on concurrent async calls.
This repository showcases the use of different aproaches on concurrent async calls. The frameworks in use are Ionic and Angular.

The goal is to present a loading, get some data, treat possible errors and dismiss the loading without using logic to block the flux.
It is indeed a easy task, but
if the scenario is more complex we start to observe some interesting issues.

Async/await approach:
- Limitation of presenting a loading and being unable to dismiss it after concurrent calls. **
  - In other words, we cant block the flux and wait for simultaneous calls end.
- Callback hell (http://callbackhell.com/).
- Sometimes the UI doesnt get updated (https://github.com/angular/angular/issues/7381)

RxJS approach:
- Promise thingies must become observables, and for this reason a refactoring workload is required.
- Learn the non obvious RxJS way of doing things. 

There are drawbacks on both aproaches but once you got RxJS covered, the result is better since you can do the most varied tasks
with this library.

** Of course we can dismiss the loading with some logic, but that is not the point.

## How to test?
```
git clone https://github.com/gdinn/rxjs-comparative
cd rxjs-comparative
npm install
ionic serve
```

After serving the application, just click on one button at the time to observe the behavior of the loading and the console.

If there are another way to do things that are more efficient, feel free to email me, or pull request into this repository.

Thanks!



