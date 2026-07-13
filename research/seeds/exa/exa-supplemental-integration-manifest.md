# Post-cutoff supplemental-census integration manifest

Evidence cutoff: 2026-07-11  
Discovery observation date: 2026-07-12  
Inputs: /tmp/exa-competitor-research.md, /tmp/exa-argilla-research.md, /tmp/exa-supplement-a.md, /tmp/exa-supplement-b.md, /tmp/exa-supplement-c.md

## Integration contract

Recommended file: research/corpus/supplemental-adjacent.json.

Keep the cutoff-locked companies.json and 63-record adjacent.json unchanged. The supplemental file is visibly labeled post-cutoff and excluded from core census quotas, industry reciprocal links, strategy scores, buyer evidence, and competitor-response counts.

Recommended top-level shape:

    {
      "schemaVersion": 1,
      "evidenceCutoff": "2026-07-11",
      "observedAt": "2026-07-12",
      "records": [],
      "duplicateInputs": [],
      "relationships": [],
      "unresolved": [],
      "reconciliation": {}
    }

Resolved records retain adj_ IDs so promotion into the core census never changes identity. Each record stores inputRefs, entityKind, canonical name/domain, aliases, the existing primarySegment and businessModelIds enums, entityStatus, sourceReportedStatus, inclusionKind, cutoffTreatment, source candidates, observation candidates, and relationship IDs.

All source candidates were accessed on 2026-07-12. Undated pages remain TIME UNKNOWN. Dated pre-cutoff sources support historical offer context only. Completed acquisitions may render as historical/acquired context. Observation candidates are not canonical until an exact locator is captured; a source title must never substitute for a locator.

Cutoff codes used below:

- U12: undated official page first observed 2026-07-12; TIME UNKNOWN and entityStatus unknown.
- H:YYYY-MM-DD: dated pre-cutoff source; historical offer only and entityStatus unknown.
- ACQ: completed acquisition context; entityStatus acquired_closed.
- CORE: merge into existing cutoff record without replacing existing status, claims, or scores.
- UNRES: explicit research lead; no resolved segment or corpus claim.

## Reconciliation

- Image inputs: 16 -> 16 new supplemental records.
- Named terms A: 8 -> 6 new records, one core merge, one unresolved lead.
- Named terms B: 12 -> 12 new records.
- Named terms C: 14 -> 13 new records, one core merge.
- Total: 50 -> 47 new records + 2 merges + 1 unresolved.
- New record kinds: 44 companies/labs, one brand, one product, one business unit.
- New statuses: 45 unknown and two acquired_closed.
- New segment counts: training_data_workforce 17; expert_talent_network 3; environment_computer_use_runtime 14; eval_observability_assurance 4; post_training_rl_infrastructure 5; agent_ax_services 4; incumbent_bpo_consulting 0.

## Exact 50-input ledger

Columns are tab-separated. The aliases_relations field distinguishes company aliases from product/ownership relationships.

input_id	input_term	action	entity_id	entity_kind	canonical_name	aliases_relations	canonical_domain	primary_segment	business_models	inclusion_kind	persist_status	reported_status	source_date	cutoff	source_urls	observation_candidate
img_01_bespoke-labs	Bespoke Labs	ADD	adj_bespoke-labs	company	Bespoke Labs	aliases=BespokeLabs.AI;Bespoke Labs AI	https://bespokelabs.ai	environment_computer_use_runtime	expert_environment_services,runtime_infrastructure	direct_supplier	unknown	active		U12	https://bespokelabs.ai/	Bespoke Labs builds company-scale RL environments and infrastructure to let frontier labs and enterprises train long-horizon agents for production.
img_02_mechanize	Mechanize	ADD	adj_mechanize	company	Mechanize	alias=Mechanize, Inc.	https://www.mechanize.work	environment_computer_use_runtime	expert_environment_services	direct_supplier	unknown	active		U12	https://www.mechanize.work/	We build environments and evals for frontier coding agents.
img_03_sepal-ai	Sepal AI	ADD	adj_sepal-ai	company	Sepal AI	aliases=Sepal;SepalAI | acquired_by=co_mercor	https://sepal.dev	training_data_workforce	managed_data_bpo	direct_supplier	acquired_closed	acquired		ACQ	https://sepal.dev/	Big news: Sepal AI has been acquired by Mercor!
img_04_hud	HUD	ADD	adj_hud	company	HUD	aliases=HUD AI;Human Union Data	https://www.hud.ai	environment_computer_use_runtime	runtime_infrastructure,expert_marketplace,expert_environment_services	direct_supplier	unknown	active		U12	https://www.hud.ai/	Encode your expertise into environments to train and evaluate models, and create the post-training data that aligns AI to your work.
img_05_plato	Plato	ADD	adj_plato	company	Plato	alias=Plato.so	https://plato.so	environment_computer_use_runtime	runtime_infrastructure,expert_environment_services	direct_supplier	unknown	active		U12	https://plato.so/landing/	Plato is an applied research lab that transforms real-world data into simulated environments for training and evaluating agents.
img_06_matrices	Matrices	ADD	adj_matrices	company	Matrices	alias=Matrices AI	https://matrices.ai	environment_computer_use_runtime	expert_environment_services	direct_supplier	unknown	active		U12	https://matrices.ai/;https://matrices.ai/careers	Training Environments for LLM Agents
img_07_encord	Encord	ADD	adj_encord	company	Encord	alias=Encord AI | product=Encord Index	https://encord.com	training_data_workforce	managed_data_bpo,eval_observability_saas	direct_supplier	unknown	active		U12	https://encord.com/physical-ai/	Build and curate the multimodal datasets that autonomous systems, robotics and world models depend on.
img_08_cortex-ai	Cortex AI	ADD	adj_cortex-ai	company	Cortex AI	aliases=Cortex Robot;Cortex AI Robot	https://cortexrobot.ai	training_data_workforce	proprietary_data_acquisition,managed_data_bpo	direct_supplier	unknown	active		U12	https://cortexrobot.ai/ego/;https://cortexrobot.ai/	We capture and produce the world's most diverse egocentric data to accelerate embodied AI into real-world deployment.
img_09_praxis-ai	Praxis AI	ADD	adj_praxis-ai	company	Praxis AI	aliases=Praxis;Praxis Robotics	https://www.praxisrobotics.io	training_data_workforce	proprietary_data_acquisition,managed_data_bpo	direct_supplier	unknown	active		U12	https://www.praxisrobotics.io/;https://www.ycombinator.com/companies/praxis-ai-2	Great machines will be forged by human intuition.
img_10_arena	Arena	ADD	adj_arena	company	Arena	alias=LMArena | originated_from=LMSYS Chatbot Arena	https://arena.ai	eval_observability_assurance	eval_observability_saas,expert_environment_services	direct_supplier	unknown	active	2025-09-16	H:2025-09-16	https://arena.ai/blog/ai-evaluations/;https://arena.ai/blog/lmarena-is-now-arena/	This service offers enterprises, model labs, and developers comprehensive evaluation services grounded in real-world human feedback, showing how models actually perform in practice.
img_11_david-ai	David AI	ADD	adj_david-ai	company	David AI	aliases=David AI Labs;David AI Labs, Inc.	https://www.withdavid.ai	training_data_workforce	proprietary_data_acquisition,managed_data_bpo	direct_supplier	unknown	active		U12	https://www.withdavid.ai/	We develop audio datasets with the same rigor researchers bring to models.
img_12_protege	Protege	ADD	adj_protege	company	Protege	aliases=Protégé;withProtege	https://withprotege.ai	training_data_workforce	proprietary_data_acquisition,expert_marketplace	direct_supplier	unknown	active	2026-02-19	H:2026-02-19	https://withprotege.ai/model-builders;https://withprotege.ai/	Real-world data created by natural human activity.
img_13_datacurve	Datacurve	ADD	adj_datacurve	company	Datacurve	aliases=DataCurve;Datacurve AI	https://datacurve.ai	training_data_workforce	proprietary_data_acquisition,managed_data_bpo,expert_environment_services	direct_supplier	unknown	active		U12	https://datacurve.ai/products;https://datacurve.ai/	Prebuilt datasets, curated for signal, reviewed for quality, and structured to drop into your training stack without translation work.
img_14_truveta	Truveta	ADD	adj_truveta	company	Truveta	products=Truveta Data;Truveta Intelligence	https://www.truveta.com	training_data_workforce	proprietary_data_acquisition	direct_supplier	unknown	active		U12	https://www.truveta.com/truveta-data/;https://www.truveta.com/	Get the most complete, timely, and representative view of US patient care
img_15_snorkel-ai	Snorkel AI	ADD	adj_snorkel-ai	company	Snorkel AI	alias=Snorkel | product=Snorkel Flow	https://snorkel.ai	training_data_workforce	managed_data_bpo,eval_observability_saas,expert_environment_services	direct_supplier	unknown	active	2026-04-24	H:2026-04-24	https://snorkel.ai/data-development/;https://snorkel.ai/company/	Snorkel builds the human expert-authored datasets, evaluation environments, and benchmarks calibrated to push the limits of frontier model capability.
img_16_argilla	Argilla	ADD	adj_argilla	company	Argilla	aliases=Argilla.io;Argilla S.L.U. | acquired_by=Hugging Face	https://argilla.io	training_data_workforce	eval_observability_saas	substitute	acquired_closed	acquired_maintenance	2024-06-13	ACQ:2024-06-13	https://argilla.io/blog/argilla-joins-hugggingface/;https://github.com/argilla-io/argilla/;https://argilla.io/	This acquisition means we’ll be doubling down on empowering the community to build and collaborate on high quality datasets
