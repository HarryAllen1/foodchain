# Foodchain

## Running the Ledger

This project only runs on Linux/WSL and requires Docker.

<details>
<summary>
WSL Setup
</summary>

If you are using WSL, you must enable `systemd`. Open `/etc/wsl.conf` and add the following under the `boot` key:

```toml
systemd=true
```

The whole thing should look roughly like:

```toml
[boot]
systemd=true
```

</details>

Install Nodejs, pnpm, and Docker.

Install dependencies with `pnpm i`

Then, run `pnpm start:contract`.

## Running the Web App
