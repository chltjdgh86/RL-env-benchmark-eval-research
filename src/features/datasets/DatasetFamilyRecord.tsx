import {
  DATASET_ACCESS_LABELS,
  DATASET_ARTIFACT_LABELS,
  DATASET_PROVENANCE_LABELS,
  DATASET_SURFACE_KIND_LABELS,
} from "./dataset-labels"
import type { DatasetFamily } from "./dataset-schema"

type DatasetFamilyRecordProps = {
  readonly family: DatasetFamily
}

function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}

export function DatasetFamilyRecord({ family }: DatasetFamilyRecordProps) {
  return (
    <article className="dataset-family-record" id={`dataset-${family.familyId}`}>
      <header className="dataset-family-record__header">
        <div>
          <p className="kicker">{family.publisher}</p>
          <h4>{family.name}</h4>
        </div>
        <p className="evidence-text">{pluralize(family.surfaces.length, "public surface")}</p>
      </header>
      <p className="dataset-family-record__description">{family.description}</p>
      <dl className="dataset-family-record__metadata">
        <div>
          <dt>Verified</dt>
          <dd>
            <time dateTime={family.verifiedAt}>{family.verifiedAt}</time>
          </dd>
        </div>
        {family.versionNote === null || family.versionNote === undefined ? null : (
          <div>
            <dt>Version</dt>
            <dd>{family.versionNote}</dd>
          </div>
        )}
      </dl>
      <ul className="dataset-surface-list">
        {family.surfaces.map((surface) => (
          <li key={surface.surfaceId}>
            <a href={surface.url} rel="noreferrer" target="_blank">
              {surface.label}
              <span className="visually-hidden"> — opens in a new tab</span>
            </a>
            <span className="evidence-text">
              {DATASET_SURFACE_KIND_LABELS[surface.kind]} · {DATASET_ACCESS_LABELS[surface.access]}{" "}
              · {DATASET_PROVENANCE_LABELS[surface.provenance]} ·{" "}
              {surface.artifacts.map((artifact) => DATASET_ARTIFACT_LABELS[artifact]).join(" · ")} ·{" "}
              {new URL(surface.url).hostname}
            </span>
          </li>
        ))}
      </ul>
    </article>
  )
}
