## CLAIMS

The original breadth pass was Exa-led. This follow-up closes the eight company-ledger rows whose exact-name receipts were not preserved in the first report, then verifies newly found releases against first-party Hugging Face or GitHub surfaces. Browserbase, OpenPipe, and Predibase have attributable public artifacts; five companies still have no attributable public dataset after exact-name, organization, repository, and canonical-domain checks.

### Newly attributable company releases

| Dataset | Publisher | Public artifact | Access | Description |
|---|---|---|---|---|
| Hacker News corpus | OpenPipe | [Dataset](https://huggingface.co/datasets/OpenPipe/hacker-news) | Open | All Hacker News posts and comments through 1 November 2023. |
| Best HN comment pairs | OpenPipe | [Base release](https://huggingface.co/datasets/OpenPipe/best-hn-comment-pairs), [v1](https://huggingface.co/datasets/OpenPipe/best-hn-comment-pairs-v1), [v2](https://huggingface.co/datasets/OpenPipe/best-hn-comment-pairs-v2) | Open | Versioned pairs of higher- and lower-ranked Hacker News comments for preference and response-quality work. |
| Hacker News scraped stories | OpenPipe | [Base release](https://huggingface.co/datasets/OpenPipe/hacker-news-scraped-stories), [Filtered release](https://huggingface.co/datasets/OpenPipe/hacker-news-scraped-stories-filtered) | Open | Scraped Hacker News story text, with a companion filtered release. |
| arXiv categories | OpenPipe | [Dataset](https://huggingface.co/datasets/OpenPipe/arxiv-categories) | Open | Public arXiv records organized for category-classification work. |
| Deterministic instruction-tuning data | Predibase | [Dataset](https://huggingface.co/datasets/predibase/deterministic_it_dataset) | Open | A deterministic instruction-tuning fixture published by Predibase. |
| CoNLL++ NER | Predibase | [NER release](https://huggingface.co/datasets/predibase/conllpp_ner), [Companion release](https://huggingface.co/datasets/predibase/conllpp) | Open | CoNLL++ named-entity recognition data in two Predibase-packaged variants. |
| Countdown | Predibase | [Dataset](https://huggingface.co/datasets/predibase/countdown) | Open | Number-and-target Countdown reasoning tasks for verifiable training and evaluation. |
| Glaive function calling | Predibase | [Dataset](https://huggingface.co/datasets/predibase/glaive_function_calling) | Open | Function-calling conversations packaged for tool-use fine-tuning. |
| ECT summarization | Predibase | [Dataset](https://huggingface.co/datasets/predibase/ect-summarization) | Open | Text summarization examples packaged by Predibase. |
| Wordle GRPO | Predibase | [Dataset](https://huggingface.co/datasets/predibase/wordle-grpo) | Open | Wordle task records prepared for group-relative policy optimization. |
| Wordle SFT | Predibase | [Dataset](https://huggingface.co/datasets/predibase/wordle-sft) | Open | Wordle demonstrations prepared for supervised fine-tuning. |
| Stagehand Evals | Browserbase | [Evaluation overview](https://www.browserbase.com/blog/evaluating-browser-agents), [Task definitions](https://github.com/browserbase/stagehand/tree/main/packages/evals/tasks), [Evaluation datasets](https://github.com/browserbase/stagehand/tree/main/packages/evals/datasets) | Open | Browser-agent tasks and evaluation fixtures used by Stagehand; Browserbase reports 3,772 human-verified evaluations with traces and scores. |

### Exact-name no-hit receipts

The following companies received exact-name countersearches across Hugging Face, GitHub, benchmark, dataset, data-folder, sample-gallery, and catalog patterns, but no canonical attributable public dataset was found:

- Andromede, Anyscale, hillclimb, Steel, TrainLoop

| Company | Exact-name query receipt | First-party surfaces checked | Outcome |
|---|---|---|---|
| Andromede | `"Andromede AI" dataset benchmark sample Hugging Face GitHub` | `andromede.ai`; exact Hugging Face author lookup; GitHub exact-name results | No attributable public dataset found. |
| Anyscale | `"Anyscale" dataset benchmark agent Hugging Face GitHub` | `anyscale.com`; exact Hugging Face author lookup; GitHub exact-name results | No attributable Anyscale-company dataset found; unrelated “Anyscale Learning For All” records were rejected. |
| hillclimb | `"hillclimb" AI dataset benchmark sample Hugging Face GitHub` | `hillclimb.com`; exact Hugging Face author lookup; GitHub exact-name results | No attributable public dataset found; generic hill-climbing results were rejected. |
| Steel | `"Steel" browser agent dataset benchmark sample Hugging Face GitHub` | `steel.dev`; exact Hugging Face author lookup; GitHub exact-name results | No attributable Steel-company dataset found; material-science and generic “steel” records were rejected. |
| TrainLoop | `"TrainLoop" dataset benchmark sample Hugging Face GitHub` | `trainloop.ai`; the first-party Hugging Face organization; GitHub exact-name results | No public dataset found; the organization exposes no public datasets at the verification date. |

## EXPAND

Recheck the five no-hit companies when their canonical sites or first-party organizations announce a public benchmark, task pack, trajectory corpus, or sample gallery. The absence claim is bounded to public, attributable surfaces visible on 12 July 2026; it is not a claim that private customer or training data do not exist.
