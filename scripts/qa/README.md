# QA contracts

## Claim-scope rendering

Each pre-integration feature owns `src/features/<scope>/claim-scope.json` with exactly
`scope`, `modulePaths`, and `expectedClaimIds`. Every entry in `modulePaths` is an
executable render-adapter module inside that same feature directory. It exports a
synchronous `renderClaimScope()` function returning the feature's claim-bearing React
tree under representative test inputs.

`check-rendered-claims.mjs` imports every declared module, server-renders those adapters,
and compares observed `data-claim-id` values with `expectedClaimIds`. A marker counts only
when its element has nonempty rendered text. This makes the pre-integration gate inspect
observed markup while the final integrated browser and semantic audits remain Todo 11's
responsibility.
