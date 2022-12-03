#!/usr/bin/env bash
set -euo pipefail

# deploy contract
echo ">>>>>> Customizing Installing contoller"

dfx canister install --mode=install contoller --argument '("development")'