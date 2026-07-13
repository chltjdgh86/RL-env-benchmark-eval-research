import { render, within } from "@testing-library/react"
import { researchCorpus, researchIndex } from "../../data/research"
import { CorpusClaim } from "./CorpusClaim"

describe("CorpusClaim", () => {
  it("renders claim text and one plain source link per source without audit UI", () => {
    const claim = researchCorpus.claims.find((candidate) => candidate.evidenceLinks.length > 0)
    if (claim === undefined) throw new Error("The research corpus has no evidenced claim")

    render(<CorpusClaim claimId={claim.claimId} index={researchIndex} />)

    const statement = within(document.body).getByText(claim.statement)
    const article = statement.parentElement
    expect(article).not.toBeNull()
    if (article === null) throw new Error("Claim article was not rendered")

    const sourceIds = [...new Set(claim.evidenceLinks.map((link) => link.sourceId))]
    const links = within(article).getAllByRole("link")
    expect(links).toHaveLength(sourceIds.length)
    for (const sourceId of sourceIds) {
      const source = researchIndex.sourcesById.get(sourceId)
      expect(source).toBeDefined()
      if (source === undefined) continue
      expect(within(article).getByRole("link", { name: source.title })).toHaveAttribute(
        "href",
        source.canonicalUrl,
      )
    }
    expect(article.querySelector(".claim-sources")).not.toBeNull()
    expect(article.querySelector("details")).toBeNull()
    expect(article.querySelector(".evidence-tags")).toBeNull()
  })
})
