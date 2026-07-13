import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const manifest = readJson("research/migrations/exa-strategy-evidence.json");
const receiptsById = new Map(manifest.receipts.map((receipt) => [receipt.id, receipt]));
const cell = (candidateId, dimensionId) => manifest.candidates[candidateId].cells[dimensionId];

test("insurance queries preserve the raw packet byte content", () => {
  const receipt = receiptsById.get("rr-insurance-operations-pain-positive");
  assert.equal(receipt.queries[0], '"insurance operations" "pain" buyer procurement official evidence');
  assert.equal(receipt.queries[1], "insurance operations claims underwriting manual work delays errors costs buyer survey insurer 2025 2026");
});

test("receipt domain classes preserve the lane-specific raw disclosures", () => {
  assert.deepEqual(
    receiptsById.get("rr-healthcare-administration-expertsupply-positive").searchedDomainClasses,
    ["regulatory_registry", "company_first_party", "academic_primary"],
  );
  assert.deepEqual(
    receiptsById.get("rr-enterprise-software-support-rightsaccess-positive").searchedDomainClasses,
    ["company_first_party"],
  );
  assert.deepEqual(
    receiptsById.get("rr-public-sector-administration-incumbentpressure-negative").searchedDomainClasses,
    ["buyer_procurement", "company_first_party", "academic_primary", "independent_reporting", "secondary_discovery"],
  );
});

test("audited rubric corrections remain conservative and evidence-specific", () => {
  assert.equal(cell("regulated_financial_operations", "verifierFeasibility").measuredLevel, 2);
  assert.equal(cell("regulated_financial_operations", "expertSupply").measuredLevel, 2);
  assert.equal(cell("insurance_operations", "freshnessBurden").measuredLevel, null);
  assert.deepEqual(cell("insurance_operations", "freshnessBurden").scoreEvidenceKeys, []);
  assert.equal(cell("insurance_operations", "incumbentPressure").measuredLevel, 2);
  assert.deepEqual(cell("insurance_operations", "incumbentPressure").scoreEvidenceKeys, ["insurance_operations:O25"]);
  assert.ok(cell("healthcare_administration", "freshnessBurden").scoreEvidenceKeys.includes("healthcare_administration:O20"));
  assert.equal(cell("public_sector_administration", "verifierFeasibility").measuredLevel, 2);
  assert.ok(cell("public_sector_administration", "freshnessBurden").scoreEvidenceKeys.includes("public_sector_administration:O29"));
});

test("no-public-evidence findings never claim retained score support", () => {
  for (const receipt of manifest.receipts.filter((item) => item.closure === "no_public_evidence")) {
    assert.doesNotMatch(receipt.findings, /retained excerpts.*support|supports the recorded/i, receipt.id);
  }
});
