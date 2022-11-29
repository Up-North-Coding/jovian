# Jupiter Wallet

> :warning: **Project Jovian is currently in beta. Be careful when sending large amounts and notify Up North Coding or Jupiter immediately if you have any problems. This banner will be removed after further production-grade testing is performed.**

React based Jupiter frontend developed by [Up North Coding](www.upnorthcoding.com), winners of the [2022 Jupiter Hackathon](https://blog.gojupiter.tech/jupiter-hackathon-9fae1746bf4c).

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
        <td>October 12</td>
    </tr>
    <tr>
        <td>Blocks</td>
        <td>3 weeks</td>
        <td>November 2</td>
        <td>November 3</td>
    </tr>
        <tr>
        <td>Generators</td>
        <td>2 weeks</td>
        <td>Nov 16</td>
        <td>November 16</td>
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

There's currently an issue with the `notistack` package which has been reported to the appropriate team. The current fix was changed to use a GitHub fork, with the appropriate changes made to Up North Coding's fork.

## License

[MIT](LICENSE)
