## Resolution

Resolved 12/12 leads. No matches in `companies.json` or `adjacent.json`; therefore every `duplicateOf` is `null`. `unresolved` is empty.

| Lead | Canonical official source | Primary segment | Status / confidence |
|---|---|---|---|
| Proximal | [Proximal](https://www.proximal.ai/blog/proximal) | `training_data_workforce` | active / high |
| Idler | [Idler](https://idler.ai/) | `training_data_workforce` | active / medium |
| Calaveras | [Calaveras AI](https://calaveras.ai/) | `training_data_workforce` | active / high |
| BenchFlow | [BenchFlow](https://www.benchflow.ai/about) | `environment_computer_use_runtime` | active / high |
| Vmax | [Vmax](https://vmax.ai/team/propel) | `post_training_rl_infrastructure` | active / high |
| Andromede | [Andromede](https://andromede.ai/) | `training_data_workforce` | active / high |
| Aviro | [Aviro](https://aviro.ai/) | `environment_computer_use_runtime` | active / high |
| AIChamp | [AIChamp](https://aichamp.com/) | `expert_talent_network` | active / high |
| General Reasoning | [General Reasoning](https://www.gr.inc/releases/introducing-openreward) | `post_training_rl_infrastructure` | active / high |
| Champ | [Champ AI](https://champ.ai/) | `agent_ax_services` | active / medium |
| Haladir | [Haladir](https://haladir.com/) | `agent_ax_services` | active / high |
| Hillclimb | [hillclimb](https://www.hillclimb.com/) | `expert_talent_network` | active / medium |

Collision findings:

- AIChamp (`aichamp.com`) and Champ AI (`champ.ai`, also `champ.cx`) are separate entities.
- Andromede (`andromede.ai`) is distinct from Andromède (`andromede.fr`) and AndromedAI (`andromed.ai`).
- Hillclimb’s newer-looking site is `hillclimb.com`; `hillclimb.ing` remains live and YC-linked with older content.
- Haladir’s current first-party positioning is logistics automation; its RL-environment work is secondary.
- Where no dedicated corporate-status page exists, `officialStatusUrl` uses the live first-party homepage.

```json
{
  "resolved": [
    {
      "lead": "Proximal",
      "canonicalName": "Proximal",
      "originDomain": "https://www.proximal.ai",
      "aliases": ["Proximal Labs"],
      "officialOfferUrl": "https://www.proximal.ai/blog/proximal",
      "officialStatusUrl": "https://www.proximal.ai/",
      "sourceTitle": "Announcing Proximal",
      "sourceDate": "2026-02-18",
      "observedExcerpt": "Proximal is a new data company.",
      "primarySegment": "training_data_workforce",
      "businessModelIds": [
        "managed_data_bpo",
        "proprietary_data_acquisition"
      ],
      "entityStatus": "active",
      "caveat": "Resolved to proximal.ai and FrontierSWE, not unrelated Proximal entities; no public pricing or delivery contract is described.",
      "confidence": "high",
      "duplicateOf": null
    },
    {
      "lead": "Idler",
      "canonicalName": "Idler",
      "originDomain": "https://idler.ai",
      "aliases": [],
      "officialOfferUrl": "https://idler.ai/",
      "officialStatusUrl": "https://idler.ai/",
      "sourceTitle": "Idler",
      "sourceDate": null,
      "observedExcerpt": "rl environments",
      "primarySegment": "training_data_workforce",
      "businessModelIds": ["expert_environment_services"],
      "entityStatus": "active",
      "caveat": "The first-party site is sparse; coding-specific detail is corroborated by Y Combinator, while delivery mechanics remain undisclosed.",
      "confidence": "medium",
      "duplicateOf": null
    },
    {
      "lead": "Calaveras",
      "canonicalName": "Calaveras AI",
      "originDomain": "https://calaveras.ai",
      "aliases": ["Calaveras"],
      "officialOfferUrl": "https://calaveras.ai/",
      "officialStatusUrl": "https://calaveras.ai/",
      "sourceTitle": "Calaveras AI",
      "sourceDate": null,
      "observedExcerpt": "We provide pre-training datasets and RL environments.",
      "primarySegment": "training_data_workforce",
      "businessModelIds": [
        "managed_data_bpo",
        "expert_environment_services",
        "proprietary_data_acquisition"
      ],
      "entityStatus": "active",
      "caveat": "Resolved to calaveras.ai, not geographic or wine results; customer claims on the page are first-party and not independently verified.",
      "confidence": "high",
      "duplicateOf": null
    },
    {
      "lead": "BenchFlow",
      "canonicalName": "BenchFlow",
      "originDomain": "https://www.benchflow.ai",
      "aliases": [],
      "officialOfferUrl": "https://www.benchflow.ai/about",
      "officialStatusUrl": "https://www.benchflow.ai/",
      "sourceTitle": "About — BenchFlow",
      "sourceDate": null,
      "observedExcerpt": "We build the environments AI agents need to learn — and be evaluated on — real computer work, not static prompts.",
      "primarySegment": "environment_computer_use_runtime",
      "businessModelIds": [
        "eval_observability_saas",
        "runtime_infrastructure"
      ],
      "entityStatus": "active",
      "caveat": "Resolved to benchflow.ai and its matching GitHub organization; the site does not state pricing, so model IDs describe product form.",
      "confidence": "high",
      "duplicateOf": null
    },
    {
      "lead": "Vmax",
      "canonicalName": "Vmax",
      "originDomain": "https://vmax.ai",
      "aliases": ["Vmax AI"],
      "officialOfferUrl": "https://vmax.ai/team/propel",
      "officialStatusUrl": "https://vmax.ai/",
      "sourceTitle": "PROPEL: Breaking the Solver Bottleneck in Task-Generator RL",
      "sourceDate": "2026-06-10",
      "observedExcerpt": "The approach we are taking at Vmax is to train an open-ended task generator with RL.",
      "primarySegment": "post_training_rl_infrastructure",
      "businessModelIds": ["runtime_infrastructure"],
      "entityStatus": "active",
      "caveat": "Resolved to vmax.ai, not Dell VMAX or unrelated brands; public materials describe an applied research system, not a packaged commercial SKU.",
      "confidence": "high",
      "duplicateOf": null
    },
    {
      "lead": "Andromede",
      "canonicalName": "Andromede",
      "originDomain": "https://andromede.ai",
      "aliases": ["Andromede AI"],
      "officialOfferUrl": "https://andromede.ai/",
      "officialStatusUrl": "https://andromede.ai/",
      "sourceTitle": "Andromede – RL data lab for frontier agents",
      "sourceDate": null,
      "observedExcerpt": "Programmatic generation of RL environments for post-training and evaluation.",
      "primarySegment": "training_data_workforce",
      "businessModelIds": ["expert_environment_services"],
      "entityStatus": "active",
      "caveat": "The unaccented andromede.ai entity is distinct from France's Andromède and andromed.ai; public access is partner-gated.",
      "confidence": "high",
      "duplicateOf": null
    },
    {
      "lead": "Aviro",
      "canonicalName": "Aviro",
      "originDomain": "https://aviro.ai",
      "aliases": [],
      "officialOfferUrl": "https://aviro.ai/",
      "officialStatusUrl": "https://aviro.ai/",
      "sourceTitle": "Aviro",
      "sourceDate": "2026-06-22",
      "observedExcerpt": "We build training environments for the next generation of long-running agents.",
      "primarySegment": "environment_computer_use_runtime",
      "businessModelIds": [
        "expert_environment_services",
        "runtime_infrastructure"
      ],
      "entityStatus": "active",
      "caveat": "Resolved to aviro.ai, not unrelated health or antivirus entities; the site provides no public deployment or pricing detail.",
      "confidence": "high",
      "duplicateOf": null
    },
    {
      "lead": "AIChamp",
      "canonicalName": "AIChamp",
      "originDomain": "https://aichamp.com",
      "aliases": ["AI Champ"],
      "officialOfferUrl": "https://aichamp.com/",
      "officialStatusUrl": "https://aichamp.com/",
      "sourceTitle": "Engineering RL Environments with Deep Industry Authority - AIChamp",
      "sourceDate": "2024-01-23",
      "observedExcerpt": "We train AI agents to operate in the same environment as your employees.",
      "primarySegment": "expert_talent_network",
      "businessModelIds": [
        "managed_data_bpo",
        "expert_marketplace",
        "expert_environment_services"
      ],
      "entityStatus": "active",
      "caveat": "AIChamp at aichamp.com is separate from Champ AI Systems at champ.ai and champ.cx.",
      "confidence": "high",
      "duplicateOf": null
    },
    {
      "lead": "General Reasoning",
      "canonicalName": "General Reasoning",
      "originDomain": "https://gr.inc",
      "aliases": ["GR"],
      "officialOfferUrl": "https://www.gr.inc/releases/introducing-openreward",
      "officialStatusUrl": "https://gr.inc/",
      "sourceTitle": "Introducing OpenReward | General Reasoning",
      "sourceDate": "2026-03-24",
      "observedExcerpt": "OpenReward is a platform for serving environments to train and evaluate language models.",
      "primarySegment": "post_training_rl_infrastructure",
      "businessModelIds": ["runtime_infrastructure"],
      "entityStatus": "active",
      "caveat": "Resolved to the company at gr.inc, not the generic phrase; OpenReward was a public beta on the cited date.",
      "confidence": "high",
      "duplicateOf": null
    },
    {
      "lead": "Champ",
      "canonicalName": "Champ AI",
      "originDomain": "https://champ.ai",
      "aliases": [
        "Champ",
        "Champ AI Systems, Inc."
      ],
      "officialOfferUrl": "https://champ.ai/",
      "officialStatusUrl": "https://champ.ai/",
      "sourceTitle": "Champ AI - AI Agents for Operations Teams",
      "sourceDate": "2026-06-26",
      "observedExcerpt": "Champ is an AI Operations Platform that automates your complex workflows end-to-end.",
      "primarySegment": "agent_ax_services",
      "businessModelIds": ["runtime_infrastructure"],
      "entityStatus": "active",
      "caveat": "Bare “Champ” is ambiguous. This is Champ AI Systems; champ.cx is the same operator, while AIChamp at aichamp.com is separate.",
      "confidence": "medium",
      "duplicateOf": null
    },
    {
      "lead": "Haladir",
      "canonicalName": "Haladir",
      "originDomain": "https://haladir.com",
      "aliases": [],
      "officialOfferUrl": "https://haladir.com/",
      "officialStatusUrl": "https://haladir.com/",
      "sourceTitle": "Haladir: Operational Superintelligence for Global Logistics",
      "sourceDate": "2026-06-21",
      "observedExcerpt": "Haladir is the decisional AI layer for logistics.",
      "primarySegment": "agent_ax_services",
      "businessModelIds": [
        "expert_environment_services",
        "runtime_infrastructure"
      ],
      "entityStatus": "active",
      "caveat": "The first-party homepage centers logistics decisional AI; RL-environment and post-training work is secondary, so the segment follows the current public offer.",
      "confidence": "high",
      "duplicateOf": null
    },
    {
      "lead": "Hillclimb",
      "canonicalName": "hillclimb",
      "originDomain": "https://www.hillclimb.com",
      "aliases": ["Hillclimb"],
      "officialOfferUrl": "https://www.hillclimb.com/",
      "officialStatusUrl": "https://www.hillclimb.com/",
      "sourceTitle": "hillclimb",
      "sourceDate": null,
      "observedExcerpt": "Automating RL environment creation",
      "primarySegment": "expert_talent_network",
      "businessModelIds": [
        "managed_data_bpo",
        "expert_marketplace",
        "expert_environment_services"
      ],
      "entityStatus": "active",
      "caveat": "hillclimb.com appears newer; hillclimb.ing remains live and YC-linked with an older copy, so canonical-domain confidence is lower.",
      "confidence": "medium",
      "duplicateOf": null
    }
  ],
  "unresolved": [],
  "deduplication": {
    "companiesJsonMatches": [],
    "adjacentJsonMatches": []
  }
}
```

## Exa calls used

`web_search_exa`, `numResults: 8`:

1. `Official company or product named Proximal in AI software engineering agents, coding benchmarks, reinforcement learning environments, or SWE training data; identify the exact official website and current offering, excluding unrelated healthcare and crypto companies.`
2. `Official company or product named Idler in AI software engineering agents, coding benchmarks, reinforcement learning environments, or SWE training data; identify the exact official website and current offering, excluding unrelated idle games and software utilities.`
3. `Official company or product named Calaveras in AI software engineering agents, coding benchmarks, reinforcement learning environments, or SWE training data; identify the exact official website and current offering, excluding county, wine, and geographic results.`
4. `Official BenchFlow AI company or open-source product for agent evaluation, benchmarks, workflows, or reinforcement learning environments; identify official website, organization, current offering, and status.`
5. `Official company or product named Vmax or VMAX in AI software engineering agents, coding benchmarks, reinforcement learning environments, or SWE training data; identify exact official website and current offering, excluding Dell EMC, vehicles, fitness, and advertising.`
6. `Official AI company or product named Andromede or Andromède focused on long-horizon reasoning, agent training, evaluations, reinforcement learning environments, or benchmarks; identify exact official website and current offering, excluding astronomy and unrelated firms.`
7. `Official AI company or product named Aviro focused on long-horizon reasoning, agent training, evaluations, reinforcement learning environments, or benchmarks; identify exact official website and current offering, excluding antivirus, healthcare, and unrelated firms.`
8. `Official AIChamp or AI Champ company or product focused on long-horizon reasoning, agent training, evaluations, reinforcement learning environments, or benchmarks; identify exact official website and current offering, excluding competitions and generic AI champion references.`
9. `Official company named General Reasoning focused on AI long-horizon reasoning, agent training, reinforcement learning environments, or benchmarks; identify official website, current offering, and status, excluding generic discussion of general reasoning.`
10. `Official company or product named Champ focused on AI long-horizon reasoning, agent training, reinforcement learning environments, or benchmarks; identify exact official website and current offering, excluding sports champions, customer support software, and unrelated startups.`
11. `Official AI company or product named Haladir focused on long-horizon reasoning, agent training, evaluations, reinforcement learning environments, or benchmarks; identify exact official website and current offering, including spelling variants, excluding unrelated fantasy references.`
12. `Official AI company or product named Hillclimb or Hill Climb focused on long-horizon reasoning, agent training, evaluations, reinforcement learning environments, or benchmarks; identify exact official website and current offering, excluding games, motorsport, and generic optimization.`

`web_fetch_exa`, `maxCharacters: 6000`:

1. `["https://www.proximal.ai/","https://www.proximal.ai/blog/proximal","https://idler.ai/","https://calaveras.ai/","https://www.benchflow.ai/","https://www.benchflow.ai/about"]`
2. `["https://vmax.ai/","https://vmax.ai/team/propel","https://andromede.ai/","https://aviro.ai/","https://aichamp.com/"]`
3. `["https://gr.inc/","https://www.gr.inc/releases/introducing-openreward","https://champ.ai/","https://www.champ.cx/","https://haladir.com/","https://www.hillclimb.com/","https://hillclimb.ing/"]`

`web_search_exa`, `numResults: 6`, collision checks:

1. `Determine whether AIChamp at aichamp.com and Champ AI at champ.ai or champ.cx are separate companies. Prefer first-party identity evidence and identify which domains belong to each company.`
2. `Determine the relationship and current canonical status of hillclimb.com and hillclimb.ing for the AI training-data and RL-environment company hillclimb. Prefer first-party and Y Combinator evidence.`
3. `Disambiguate Proximal at proximal.ai, the AI coding-data and FrontierSWE company, from unrelated Proximal companies. Identify its official name, aliases, domain, and current offer from first-party sources.`
4. `Disambiguate Idler at idler.ai, the reinforcement-learning environments company for coding models, from unrelated Idler products. Identify official name, domain, and current offer.`
5. `Disambiguate Vmax at vmax.ai, the open-ended reinforcement-learning and automated environment-construction research lab, from Dell VMAX and unrelated brands. Identify official name and current offer.`
6. `Disambiguate Andromede at andromede.ai, the RL data lab for frontier agents, including Andromede versus Andromède spelling and unrelated companies. Identify official name, domain, and current offer.`