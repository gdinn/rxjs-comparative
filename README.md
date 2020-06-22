# RxJS and pure JS comparison.

This repository showcases the use of different aproaches on concurrent asynchronous calls. The frameworks in use are Ionic and Angular.

The goal is to present a loading, get some data, treat the result, treat possible errors and dismiss the loading without using logic to block the flux.

What will happens is that both aproaches are similar in the flux, but very different on handling the data.

The data handling on RxJS is more granular than the pure JS, but requires a steeper work curve.

When working with angular, learn RxJS is very useful because angular use several modules that works with observables.

## Async/await

**Pros**

* Simpler to learn
* Most of JS libs supports promises

**Cons**

- Sometimes the UI doesnt get updated (https://github.com/angular/angular/issues/7381)
- Difficult to control more complex fluxes with cancelation, for example (only example in mind that does not envolve streams)
- Cannot handle streams

## RxJS approach:

**Pros**

* Can handle streams in a bunch of ways (skipping, debouncing, buffering, etc)
* Low impact considering the benefit
* Granular control over the flux

**Cons**

* Promises will have better support on RxJS if converted to observables, and therefore a workload is required.
* Learn the non obvious RxJS way of doing things.
* Could lead to memory leaks if the streams werent unsubscribed

## Conclusion

There are drawbacks on both aproaches but once you got RxJS covered, it will give you more control over the flux with the possibility to handle streams.

## Interesting links

* https://dev.to/avatsaev/simple-state-management-in-angular-with-only-services-and-rxjs-41p8
* https://auth0.com/blog/javascript-promises-vs-rxjs-observables/
* https://medium.com/javascript-everyday/javascript-theory-promise-vs-observable-d3087bc1239a

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
