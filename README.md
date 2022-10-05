# Jupiter Wallet

React based Jupiter frontend developed by Up North Coding, winners of the [2022 Jupiter Hackathon](https://blog.gojupiter.tech/jupiter-hackathon-9fae1746bf4c).

For development inquiries contact: sales@upnorthcoding.com

## What is Jovian?

Jovian is the term that encompasses all things "Jupiter". It is the adjective form of Jupiter.

<br />

<img align="left" src="src/assets/logo512.png" alt="Jupiter Logo" height="200px"/>
<img align="left" src="src/assets/unc_large.png" alt="Up North Coding Logo" height="220px"/>

<br clear="left" />

## Release Targets

**Start Date: April 6th, 2022**

<table>
    <tr>
        <td>Component</td>
        <td>Date</td>
        <td>ETA</td>
        <td>Actual</td>
    </tr>
    <tr>
        <td>Login Page</td>
        <td>5 weeks</td>
        <td>May 11</td>
        <td>April 27</td>
    </tr>
        <tr>
        <td>Dashboard</td>
        <td>14 weeks</td>
        <td>August 17</td>
        <td>August 17</td>
    </tr>
        <tr>
        <td>Portfolio Page</td>
        <td>2 weeks</td>
        <td>August 31</td>
        <td>August 31</td>
    </tr>
        <tr>
        <td>Transactions</td>
        <td>2 weeks</td>
        <td>September 14</td>
        <td>September 13</td>
    </tr>
        <tr>
        <td>DEX</td>
        <td>3 weeks</td>
        <td>October 5</td>
        <td>October 5</td>
    </tr>
        <tr>
        <td>Peers</td>
        <td>1 week</td>
        <td>October 12</td>
        <td>-</td>
    </tr>
    <tr>
        <td>Blocks</td>
        <td>3 weeks</td>
        <td>November 2</td>
        <td>-</td>
    </tr>
        <tr>
        <td>Generators</td>
        <td>2 weeks</td>
        <td>Nov 16</td>
        <td>-</td>
</table>

## Usage

**Install deps**

```sh
yarn install

yarn husky_setup
```

**Start**

```sh
yarn start
```

**To run the local web proxy for issuing API requests**

```sh
yarn proxy
```

**Build**

```sh
yarn build
```

**Test**

```sh
yarn test
```

or (for end to end tests):

```sh
yarn test:cypress
```

## Dev Notes

There's currently an issue with the `notistack` package which has been reported to the appropriate team. For now, to workaround the issue, replace the existing class export in `/node_modules/notistack/dist/index.d.ts` with the following (note that `render()` is missing in the original):

```js
export class SnackbarProvider extends React.Component<SnackbarProviderProps> {
    enqueueSnackbar: ProviderContext['enqueueSnackbar'];

    closeSnackbar: ProviderContext['closeSnackbar'];

    render(): ReactNode;
}
```

## Styling

**Mobile Goals**

- Absolute minimum width is 360px

## Dangling Questions

**Accessibility**

Does the wallet need to support accessibility? This wasn't originally discussed/quoted but it appears it might have legal repercussions so might be worth Sigwo Technologies' consideration.

**Img Standards Support**

Review commonly set image sizes/attributes.

## License

[MIT](LICENSE)
