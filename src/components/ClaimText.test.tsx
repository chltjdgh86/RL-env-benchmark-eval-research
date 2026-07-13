import { render, within } from "@testing-library/react"
import { axe } from "jest-axe"
import { ClaimText } from "./ClaimText"
import { SHOWCASE_EVIDENCE_CLAIMS, SHOWCASE_EVIDENCE_INDEX } from "./showcase-evidence-fixtures"

describe("ClaimText", () => {
  it("renders the statement and deduplicated plain external source links", () => {
    const { container } = render(
      <ClaimText claim={SHOWCASE_EVIDENCE_CLAIMS.contested} index={SHOWCASE_EVIDENCE_INDEX} />,
    )

    const statement = within(document.body).getByText(SHOWCASE_EVIDENCE_CLAIMS.contested.statement)
    const article = statement.parentElement
    expect(article).not.toBeNull()
    if (article === null) throw new Error("Claim article was not rendered")

    const links = within(article).getAllByRole("link")
    expect(links).toHaveLength(2)
    expect(links.map((link) => link.textContent)).toEqual([
      "Subject-controlled regulatory fixture (opens in new tab)",
      "Independent reporting fixture (opens in new tab)",
    ])
    expect(links[0]).toHaveAttribute("href", "https://example.com/src_showcase-regulatory")
    expect(links[1]).toHaveAttribute("href", "https://example.com/src_showcase-reporting")
    for (const link of links) {
      expect(link).toHaveAttribute("rel", "noreferrer")
      expect(link).toHaveAttribute("target", "_blank")
    }

    expect(container.querySelector("details")).toBeNull()
    expect(container.querySelector(".evidence-tag-set")).toBeNull()
    expect(container).not.toHaveTextContent("Permalink to")
    expect(container).not.toHaveTextContent("src_showcase-regulatory")
    expect(container).not.toHaveTextContent("obs_showcase-regulatory")
    expect(container).not.toHaveTextContent("SUPPORTS")
    expect(container.querySelector('[aria-label*="clm_showcase"]')).toBeNull()
  })

  it("has no automated accessibility violations", async () => {
    const { container } = render(
      <ClaimText claim={SHOWCASE_EVIDENCE_CLAIMS.supported} index={SHOWCASE_EVIDENCE_INDEX} />,
    )
    expect((await axe(container)).violations).toEqual([])
  })
})
