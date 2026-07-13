import type { MouseEvent } from "react"
import { DataTable } from "../../components"
import { SectionIntro } from "../shared/SectionIntro"

function scrollToPart(event: MouseEvent<HTMLAnchorElement>, part: number) {
  event.preventDefault()
  document.getElementById(`guide-part-${part}`)?.scrollIntoView()
}

const contents = [
  "What this industry is",
  "Speaking the language",
  "The value chain",
  "A ten-year history",
  "Who sells RL environments today",
  "The full landscape by segment",
  "How the money works",
  "How deals happen",
  "Where to go deeper",
] as const

type EnvironmentEntry = {
  readonly name: string
  readonly url: string
  readonly blurb: string
}

const environmentPlatforms = [
  {
    name: "Scale AI",
    url: "https://scale.com",
    blurb:
      "managed data, model evaluation, and RL environment services; Meta reported a $13.8B minority investment (not an acquisition).",
  },
  {
    name: "Turing",
    url: "https://www.turing.com",
    blurb:
      "frontier data packs, RL environments, benchmarks, and proprietary data acquisition on top of its developer talent cloud.",
  },
  {
    name: "Micro1",
    url: "https://www.micro1.ai",
    blurb:
      "expert data plus Realm environments and robotics data; announced a $35M Series A at a $500M valuation.",
  },
  {
    name: "Mercor",
    url: "https://www.mercor.com",
    blurb:
      "expert work, hiring, and evaluation marketplace with announced environment capabilities; announced acquiring Deeptune (July 2026, not closed).",
  },
  {
    name: "AfterQuery",
    url: "https://www.afterquery.com",
    blurb:
      "expert data, evaluations, and agent environments; $30M Series A; tasks cited in NVIDIA's Nemotron 3 Ultra technical report.",
  },
  {
    name: "Snorkel AI",
    url: "https://snorkel.ai",
    blurb: "expert-authored datasets, evaluation environments, and benchmarks.",
  },
] as const satisfies readonly EnvironmentEntry[]

const environmentSpecialists = [
  {
    name: "Deeptune",
    url: "https://deeptune.com",
    blurb:
      "high-fidelity code and computer-use training gyms; $43M Series A led by a16z; acquisition by Mercor announced but not closed.",
  },
  {
    name: "Fleet AI",
    url: "https://www.fleetai.com",
    blurb: '"training gyms" where agents practice real work; pivoted from developer tooling.',
  },
  {
    name: "Refresh",
    url: "https://refresh.dev",
    blurb:
      "simulated software worlds with tasks and verifiable rewards for coding, MCP-tool, and computer-use training.",
  },
  {
    name: "Halluminate",
    url: "https://www.halluminate.ai",
    blurb:
      "RL environments for financial-services workflows; built the Westworld task simulators with Yutori.",
  },
  {
    name: "Vibrant Labs",
    url: "https://vibrantlabs.com",
    blurb:
      "hard-task mining, adaptive environments, and verifier design; grew out of the open-source Ragas project.",
  },
  {
    name: "Prime Intellect",
    url: "https://www.primeintellect.ai",
    blurb: "open environment contracts and an environments hub for verifiable-reward training.",
  },
  {
    name: "Chakra Labs",
    url: "https://chakra.dev",
    blurb:
      "Dojo, a collaborative RL environment suite; deterministic, pixel-perfect environments with frame-accurate state control.",
  },
  {
    name: "HUD",
    url: "https://hud.ai",
    blurb:
      "environments that encode domain expertise for training, evaluation, and post-training data.",
  },
  {
    name: "Plato",
    url: "https://plato.so",
    blurb:
      "an applied research lab turning real-world data into simulated environments for agents.",
  },
  {
    name: "Mechanize",
    url: "https://mechanize.work",
    blurb: "environments and evals for frontier coding agents.",
  },
  {
    name: "Bespoke Labs",
    url: "https://bespokelabs.ai",
    blurb: "company-scale RL environments and infrastructure for long-horizon agents.",
  },
  {
    name: "Habitat",
    url: "https://habitat.inc",
    blurb: "environments intended to turn pretrained models into practically useful agents.",
  },
  {
    name: "Cua",
    url: "https://cua.ai",
    blurb: "open-source sandboxes, SDKs, and benchmarks for computer-use agents.",
  },
  {
    name: "BenchFlow",
    url: "https://www.benchflow.ai",
    blurb: "environments for learning and evaluating real computer work.",
  },
  {
    name: "Aviro",
    url: "https://aviro.ai",
    blurb: "training environments for long-running agents.",
  },
  {
    name: "Theta",
    url: "https://thetasoftware.com",
    blurb:
      "synthesizes a customer's first-party data and expert data into business-workflow environments.",
  },
  {
    name: "Quesma",
    url: "https://quesma.com",
    blurb: "simulation environments with multi-hour tasks for agent evaluation and training.",
  },
  {
    name: "Huzzle Labs",
    url: "https://labs.huzzle.com",
    blurb: "long-horizon code, computer-use, and enterprise-workflow environments.",
  },
  {
    name: "Matrices",
    url: "https://matrices.ai",
    blurb: "training environments for LLM agents.",
  },
  {
    name: "hillclimb",
    url: "https://www.hillclimb.com",
    blurb: "automating RL environment creation.",
  },
  {
    name: "Andromede",
    url: "https://andromede.ai",
    blurb: "programmatic generation of RL environments for post-training and evaluation.",
  },
  {
    name: "Calaveras AI",
    url: "https://calaveras.ai",
    blurb: "pre-training datasets and RL environments.",
  },
  { name: "Idler", url: "https://idler.ai", blurb: "RL environments." },
  {
    name: "AIChamp",
    url: "https://aichamp.com",
    blurb: "environments that mirror how a buyer's employees actually work.",
  },
  {
    name: "General Reasoning",
    url: "https://gr.inc",
    blurb: "OpenReward, a platform for serving environments to train and evaluate models.",
  },
  {
    name: "Preference Model",
    url: "https://www.preferencemodel.com",
    blurb: "environments with diverse tasks and robust reward functions.",
  },
  {
    name: "Good Start Labs",
    url: "https://goodstartlabs.com",
    blurb: "game environments that make model capabilities measurable.",
  },
  { name: "Vmax", url: "https://vmax.ai", blurb: "RL-trained open-ended task generators." },
  {
    name: "TrainLoop",
    url: "https://www.trainloop.ai",
    blurb: "expert models for long-horizon tasks.",
  },
] as const satisfies readonly EnvironmentEntry[]

const segments = [
  {
    core: "Appen, TELUS Digital, Sama, iMerit, CloudFactory, Surge AI, Labelbox, Toloka, DataAnnotation, Scale AI, Micro1, Turing.",
    description:
      "Managed production of labeled and expert-created data — the industry's oldest segment.",
    name: "Training-data workforce",
    newer:
      "Kled AI, Luel, Proximal, Idler, Calaveras AI, Andromede, Rise Data Labs, Encord, Cortex AI, Praxis, David AI, Protege, Datacurve, Truveta, Snorkel AI, Sepal AI (acquired by Mercor).",
  },
  {
    core: "Prolific, Handshake, Invisible Technologies, Outlier, Alignerr, Mindrift, G2i, Catalant, GLG, Mercor, AfterQuery.",
    description:
      "Marketplaces that recruit, vet, and deploy domain experts — increasingly toward AI data work.",
    name: "Expert talent networks",
    newer: "AIChamp, hillclimb, Verita AI.",
  },
  {
    core: "Browserbase, E2B, Daytona, Modal, Prime Intellect, Steel, Browser Use, Kernel, Scrapybara, Fleet AI, Deeptune, Refresh, Halluminate.",
    description:
      "Simulated workplaces for agents, plus the sandboxes and browser infrastructure they run on. The most crowded frontier segment.",
    name: "Environments, computer use & runtime",
    newer:
      "Chakra Labs (Dojo), Habitat, Cua, BenchFlow, Aviro, Theta, Quesma, Huzzle Labs, Bespoke Labs, Mechanize, HUD, Plato, Matrices.",
  },
  {
    core: "LangSmith, Braintrust, Arize AI, Langfuse, Patronus AI, Giskard, Galileo, Confident AI, Maxim AI, Vibrant Labs.",
    description:
      "Tools and services for testing, monitoring, and independently assuring model and agent behavior.",
    name: "Evals, observability & assurance",
    newer: "Gray Swan, Vals AI, Andon Labs, Arena, Argilla (acquired by Hugging Face).",
  },
  {
    core: "NVIDIA NeMo, Amazon Bedrock AgentCore, Google Vertex AI, Azure AI Foundry, Together AI, Fireworks AI, Anyscale, Predibase, OpenPipe.",
    description:
      "The compute-side platforms for fine-tuning and RL — dominated by hyperscalers and inference clouds.",
    name: "Post-training & RL infrastructure",
    newer: "Vmax, General Reasoning (OpenReward), Preference Model, Good Start Labs, TrainLoop.",
  },
  {
    core: "Accenture, Deloitte, PwC, QuantumBlack (McKinsey), BCG X, IBM Consulting, Slalom, Thoughtworks, Palantir.",
    description: "Consultancies selling agentic transformation to enterprises.",
    name: "Agent & AX services",
    newer: "Champ AI, Haladir, Phinity Labs, Kairos.",
  },
  {
    core: "TaskUs, Concentrix, Genpact, Wipro, Cognizant, Teleperformance, Capgemini, EXL, TTEC.",
    description:
      "The outsourcing giants whose labor businesses both feed and compete with AI data work.",
    name: "Incumbent BPO & consulting",
    newer: null,
  },
] as const

function PartHeading({ number, title }: { readonly number: number; readonly title: string }) {
  return (
    <header className="guide-part__header">
      <p className="kicker">Part {number}</p>
      <h2>{title}</h2>
    </header>
  )
}

export function FieldGuidePage() {
  return (
    <article aria-labelledby="guide-title" className="feature-page guide-page">
      <SectionIntro
        eyebrow="00 · Start here"
        title="The post-training economy, explained"
        titleId="guide-title"
      >
        <p>
          A plain-language guide to the industry that supplies training data, expert labor, RL
          environments, and evaluations to AI labs — who the players are, how the money works, and
          how to read the evidence. Facts reflect public evidence {"as"} of 11 July 2026;
          private-company figures are company-reported unless noted.
        </p>
      </SectionIntro>

      <nav aria-label="Field guide contents">
        <p className="kicker">Contents</p>
        <ol className="guide-contents">
          {contents.map((title, index) => (
            <li key={title}>
              <a
                href={`#guide-part-${index + 1}`}
                onClick={(event) => scrollToPart(event, index + 1)}
              >
                {index + 1} {title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="guide-part-1">
        <PartHeading number={1} title="What this industry is" />
        <p>
          Training a large AI model doesn't end when the model finishes reading the internet. The
          second phase — <strong>post-training</strong> — is where a raw model is turned into
          something useful and safe: it learns from human feedback, practices tasks, and gets
          measured against tests. Labs like OpenAI, Anthropic, and Google can't produce all of those
          inputs themselves, so a supplier industry has grown up around them.
        </p>
        <p>That industry sells four broad things:</p>
        <ul>
          <li>
            <strong>Signal data</strong> — demonstrations, preference judgments, and expert-written
            examples that teach a model what good output looks like. This is the descendant of data
            labeling.
          </li>
          <li>
            <strong>RL environments</strong> — simulated software worlds (a fake bank back-office, a
            replica CRM, a sandboxed desktop) where an AI agent can practice multi-step work and be
            automatically graded. Think of them {"as"} flight simulators for AI agents.
          </li>
          <li>
            <strong>Evaluations and assurance</strong> — held-out tests, benchmarks, and third-party
            reviews that tell a buyer whether an agent is actually good enough to deploy.
          </li>
          <li>
            <strong>Expert labor</strong> — networks of doctors, lawyers, engineers, and analysts
            recruited to create the data, judge the outputs, and design the tasks above.
          </li>
        </ul>
        <p>
          Demand comes primarily from frontier AI labs, and increasingly from enterprises and
          governments that want independent proof before deploying agents. Bespoke RL environments
          became a visibly in-demand category in 2026, though the size and margins of the category
          remain publicly unresolved.
        </p>
      </section>

      <section id="guide-part-2">
        <PartHeading number={2} title="Speaking the language" />
        <p>
          Nine terms cover most conversations. The first four are <em>techniques</em>; the rest are
          <em> markets</em>.
        </p>
        <DataTable caption="Nine terms, and what they are not">
          <thead>
            <tr>
              <th scope="col">Term</th>
              <th scope="col">What it is</th>
              <th scope="col">What it is not</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">RLHF</th>
              <td>
                Reinforcement learning from human feedback: humans rank model outputs, and the model
                is trained toward the preferred ones.
              </td>
              <td>Not a company category — a technique many vendors supply data for.</td>
            </tr>
            <tr>
              <th scope="row">RLAIF</th>
              <td>The same idea, but with an AI model providing the feedback instead of humans.</td>
              <td>
                Not a replacement for human data everywhere; it changes the provenance of the
                signal.
              </td>
            </tr>
            <tr>
              <th scope="row">DPO</th>
              <td>
                Direct Preference Optimization: a math shortcut that trains on preference data
                directly, without a separate reward model.
              </td>
              <td>
                Not a data category at all — an optimization method. Preference data feeds it.
              </td>
            </tr>
            <tr>
              <th scope="row">RLVR</th>
              <td>
                RL with verifiable rewards: the model is graded by a checkable outcome (tests pass,
                the ledger balances) instead of human opinion.
              </td>
              <td>Not opinion-based scoring; it needs tasks with objectively checkable results.</td>
            </tr>
            <tr>
              <th scope="row">RL environment</th>
              <td>
                A resettable simulated workplace exposing state, actions, observations, tasks,
                logging, and verification — where agents train.
              </td>
              <td>Not a benchmark. This distinction matters constantly; see below.</td>
            </tr>
            <tr>
              <th scope="row">Benchmark</th>
              <td>
                A held-out suite of tasks plus a scoring protocol — where agents are measured.
                WebArena, OSWorld, and tau-bench are familiar examples.
              </td>
              <td>
                Not training material. If a model trains on it, it stops being a valid measure.
              </td>
            </tr>
            <tr>
              <th scope="row">Computer use</th>
              <td>
                Agents operating real software through the screen — clicking, typing, navigating —
                rather than through APIs.
              </td>
              <td>
                Not just chat: evaluating it requires checking actions and end state, not final
                text.
              </td>
            </tr>
            <tr>
              <th scope="row">Evals &amp; assurance</th>
              <td>
                The service business of testing models and agents, increasingly {"as"} an
                independent third party informing deployment decisions.
              </td>
              <td>Not the same {"as"} observability dashboards, though vendors bundle both.</td>
            </tr>
            <tr>
              <th scope="row">AX</th>
              <td>
                An ambiguous term: "agent experience" (making software usable by agents) or agentic
                transformation consulting, depending on who's talking.
              </td>
              <td>Not settled vocabulary — always ask which meaning is intended.</td>
            </tr>
          </tbody>
        </DataTable>
        <p>
          The single most useful distinction for a newcomer: an <strong>environment</strong> is
          where an agent practices; a <strong>benchmark</strong> is where it takes the exam. Vendors
          sell both, often in one bundle, but buyers pay for them for different reasons — capability
          gains versus decision-grade evidence.
        </p>
      </section>

      <section id="guide-part-3">
        <PartHeading number={3} title="The value chain" />
        <p>
          The industry's segments feed each other in a rough pipeline. Money and data flow one way;
          credibility flows back.
        </p>
        <ol>
          <li>
            <strong>Expert data operations → preference signal.</strong> Expert-created
            demonstrations and rankings become the raw material for RLHF and related training.
          </li>
          <li>
            <strong>Preference signal → optimization.</strong> That preference data is consumed by
            training methods like DPO — the data market and the algorithm are separate layers.
          </li>
          <li>
            <strong>RL environments → verifiable rewards.</strong> Stateful environments expose
            checkable outcomes that serve {"as"} automatic grading during training (RLVR).
          </li>
          <li>
            <strong>Verifiers → evaluation &amp; assurance.</strong> The same verifiers and hidden
            task suites support formal evaluation — though whether a test measures what it claims
            still requires independent review.
          </li>
          <li>
            <strong>Computer use → evaluation &amp; assurance.</strong> Screen-operating agents
            force evaluation to grade actions and resulting state, not just text output.
          </li>
          <li>
            <strong>Evaluation → transformation consulting.</strong> Evaluation evidence informs
            enterprise decisions about deploying agents; consultancies sell the organizational
            change that follows.
          </li>
        </ol>
      </section>

      <section id="guide-part-4">
        <PartHeading number={4} title="A ten-year history in six beats" />
        <DataTable caption="Six beats, 2016–2026">
          <thead>
            <tr>
              <th scope="col">When</th>
              <th scope="col">What changed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">2016</th>
              <td>
                Scale launches {"as"} "an API for human labor." The founding commercial unit of the
                industry is the managed labeling task.
              </td>
            </tr>
            <tr>
              <th scope="row">2022</th>
              <td>
                Anthropic's helpful-and-harmless research formalizes RLHF: human preference becomes
                a standard post-training input, and a market for preference data follows.
              </td>
            </tr>
            <tr>
              <th scope="row">2023</th>
              <td>
                DPO shows preference data can be used without a separate reward model. Separately,
                WebArena and successors (OSWorld, tau-bench) move evaluation from static Q&amp;A to
                interactive, stateful tasks with held-out scoring.
              </td>
            </tr>
            <tr>
              <th scope="row">2024–25</th>
              <td>
                Talent marketplaces (Mercor, Micro1, Turing) pivot hard into expert data and
                evaluation for labs. "RL environments" emerges {"as"} a named commercial category.
              </td>
            </tr>
            <tr>
              <th scope="row">Early 2026</th>
              <td>
                Industry interviews (Epoch AI) report active frontier-lab demand for bespoke RL
                environments — while leaving category size and margins unresolved.
              </td>
            </tr>
            <tr>
              <th scope="row">Mid 2026</th>
              <td>
                OpenAI, Anthropic, and the UK government publish materials establishing demand for
                third-party evaluation and assurance — the newest layer of the market.
              </td>
            </tr>
          </tbody>
        </DataTable>
      </section>

      <section id="guide-part-5">
        <PartHeading number={5} title="Who sells RL environments today" />
        <p>
          Selling simulated workplaces where agents train and get graded is the industry's newest
          commercial layer. Two kinds of companies sell them: broad data-and-talent platforms that
          added environment lines, and specialists founded for it. Funding figures are
          company-announced; most customer claims are self-reported.
        </p>
        <h3>Data-and-talent platforms with environment offers</h3>
        <ul>
          {environmentPlatforms.map((company) => (
            <li key={company.name}>
              <a href={company.url} rel="noreferrer" target="_blank">
                {company.name}
              </a>{" "}
              — {company.blurb}
            </li>
          ))}
        </ul>
        <h3>Environment specialists</h3>
        <ul>
          {environmentSpecialists.map((company) => (
            <li key={company.name}>
              <a href={company.url} rel="noreferrer" target="_blank">
                {company.name}
              </a>{" "}
              — {company.blurb}
            </li>
          ))}
        </ul>
        <p>
          Descriptions for the younger specialists come from their own public materials and have the
          usual self-reporting caveats. Browse every company with sources on the{" "}
          <a href="#/companies">Companies page</a>.
        </p>
      </section>

      <section id="guide-part-6">
        <PartHeading number={6} title="The full landscape by segment" />
        <p>
          The market organizes into seven segments. "Core" names are established players; "Newer"
          names are earlier-stage companies whose status is less settled — most are young startups
          whose offers are known mainly from their own sites.{" "}
          <a href="#/companies">Browse the full landscape →</a>
        </p>
        <ol className="guide-segments">
          {segments.map((segment) => (
            <li key={segment.name}>
              <h3>{segment.name}</h3>
              <p>{segment.description}</p>
              <p>
                <span>Core</span> {segment.core}
              </p>
              {segment.newer === null ? null : (
                <p>
                  <span>Newer</span> {segment.newer}
                </p>
              )}
            </li>
          ))}
        </ol>
        <p>
          Two structural observations from the map. First,{" "}
          <strong>segment boundaries are soft</strong>: most companies straddle two or three
          business models (a talent network that also builds environments, an eval-tools company
          that also sells data). Second, <strong>consolidation has started</strong>: Mercor–Sepal
          (closed), Hugging Face–Argilla (closed), Mercor–Deeptune (announced), and repeated pivots
          of adjacent startups into the environment category.
        </p>
      </section>

      <section id="guide-part-7">
        <PartHeading number={7} title="How the money works: seven business models" />
        <p>
          Almost every company in the map runs one or more of these seven models. Each has a
          different margin structure and — critically — a different unit that makes comparisons
          honest.
        </p>
        <DataTable caption="Seven models, seven margin structures">
          <thead>
            <tr>
              <th scope="col">Model</th>
              <th scope="col">Contribution margin ≈</th>
              <th scope="col">Compare on</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "managed_data_bpo",
                "Managed data / BPO",
                "price − creator payout − review − rework − runtime − support",
                "Accepted artifact",
              ],
              [
                "expert_marketplace",
                "Expert marketplace",
                "buyer spend − expert payout − payments − trust & safety",
                "Gross marketplace spend",
              ],
              [
                "employee_bpo",
                "Employee BPO",
                "revenue − payroll − facilities − management − idle capacity",
                "Managed employee-hour",
              ],
              [
                "expert_environment_services",
                "Expert environment services",
                "milestone revenue − expert time − engineering − review − compute",
                "Accepted environment milestone",
              ],
              [
                "eval_observability_saas",
                "Eval / observability SaaS",
                "subscriptions + usage − judge inference − storage − support",
                "Trace, run, or seat",
              ],
              [
                "runtime_infrastructure",
                "Runtime infrastructure",
                "usage revenue − compute − browser/proxy/network − orchestration",
                "Runtime minute or session",
              ],
              [
                "proprietary_data_acquisition",
                "Proprietary data acquisition",
                "license revenue − rights − cleaning − security − provenance",
                "Licensed asset or dataset",
              ],
            ].map(([id, model, formula, unit]) => (
              <tr key={id}>
                <th scope="row">{model}</th>
                <td className="tabular-figure">{formula}</td>
                <td>{unit}</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>

      <section id="guide-part-8">
        <PartHeading number={8} title="How deals happen" />
        <p>
          Public case material is consistent with a five-step sales motion for bespoke data and
          environment work. It is a pattern, not a law.
        </p>
        <ol className="guide-steps">
          <li>
            <strong>Technical relationship.</strong> Founder-level or researcher-level contact
            precedes formal procurement.
          </li>
          <li>
            <strong>Diagnostic or sample.</strong> A bounded diagnostic under NDA turns "our model
            is bad at X" into an inspectable task specification.
          </li>
          <li>
            <strong>Paid pilot.</strong> A narrow paid pilot tests acceptance criteria before{" "}
            {"any"} larger commitment.
          </li>
          <li>
            <strong>Acceptance proof.</strong> Held-out results and buyer sign-off create the
            evidence that justifies expansion.
          </li>
          <li>
            <strong>Embedded expansion.</strong> Forward-deployed teams and adjacent work grow only
            after the initial proof clears review.
          </li>
        </ol>
        <p>
          The practical implication: this is milestone-gated services selling, not product-led
          growth. Revenue concentrates with whoever survives the acceptance gate.
        </p>
      </section>

      <section id="guide-part-9">
        <PartHeading number={9} title="Where to go deeper" />
        <p>
          Every statement in this guide is backed by the atlas's evidence layer. The deeper routes:
        </p>
        <ul className="guide-links">
          <li>
            <a href="#/companies">Companies</a> — the unified company landscape
          </li>
        </ul>

        <h3>External reading</h3>
        <ul className="guide-links">
          <li>
            <a href="https://arxiv.org/abs/2204.05862">
              Anthropic — Training a Helpful and Harmless Assistant with RLHF (2022)
            </a>
            : the paper that made human preference a standard training input.
          </li>
          <li>
            <a href="https://arxiv.org/abs/2305.18290">Direct Preference Optimization (2023)</a> —
            the shortcut that reshaped how preference data gets used.
          </li>
          <li>
            <a href="https://arxiv.org/abs/2307.13854">WebArena</a>,{" "}
            <a href="https://arxiv.org/abs/2404.07972">OSWorld</a>,{" "}
            <a href="https://arxiv.org/abs/2406.12045">tau-bench</a> — the benchmarks that moved
            evaluation into interactive, stateful territory.
          </li>
          <li>
            <a href="https://huggingface.co/openenv">OpenEnv</a> — the emerging open standard for
            what an RL environment must provide.
          </li>
          <li>
            <a href="https://epoch.ai/gradient-updates/state-of-rl-envs">
              Epoch AI — The State of RL Environments (2026)
            </a>
            : the best independent read on category demand and its open questions.
          </li>
          <li>
            <a href="https://openai.com/index/trustworthy-third-party-evaluations-foundations/">
              OpenAI — Foundations for Trustworthy Third-Party Evaluations (2026)
            </a>
          </li>
          <li>
            <a href="https://www.gov.uk/government/publications/trusted-third-party-ai-assurance-roadmap/trusted-third-party-ai-assurance-roadmap">
              UK Government — Trusted Third-Party AI Assurance Roadmap
            </a>
          </li>
          <li>
            <a href="https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027">
              Gartner — 40%+ of agentic AI projects canceled by 2027
            </a>
          </li>
        </ul>
      </section>
    </article>
  )
}
