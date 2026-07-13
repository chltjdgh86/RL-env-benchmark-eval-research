const DIMENSIONS = [
  "pain",
  "willingnessToPay",
  "rightsAccess",
  "verifierFeasibility",
  "expertSupply",
  "freshnessBurden",
  "incumbentPressure",
];

const WEIGHTS = {
  pain: 20,
  willingnessToPay: 20,
  rightsAccess: 15,
  verifierFeasibility: 15,
  expertSupply: 10,
  freshnessBurden: 10,
  incumbentPressure: 10,
};

const TERMINAL_CLOSURES = new Set([
  "evidence_found",
  "no_public_evidence",
  "rights_blocker",
  "duplicate",
  "dead",
]);

const asArray = (value) => (Array.isArray(value) ? value : []);

export const computeVerticalScore = (strategy) => DIMENSIONS.reduce(
  (total, dimensionId) => total + Number(strategy?.dimensionCells?.[dimensionId]?.convertedScore ?? 0) * WEIGHTS[dimensionId],
  0,
) / 5;

export const compareVerticalCandidates = (left, right) => {
  const fields = [
    [computeVerticalScore(left), computeVerticalScore(right)],
    [left?.dimensionCells?.willingnessToPay?.convertedScore, right?.dimensionCells?.willingnessToPay?.convertedScore],
    [left?.dimensionCells?.rightsAccess?.convertedScore, right?.dimensionCells?.rightsAccess?.convertedScore],
    [left?.dimensionCells?.verifierFeasibility?.convertedScore, right?.dimensionCells?.verifierFeasibility?.convertedScore],
    [left?.dimensionCells?.freshnessBurden?.convertedScore, right?.dimensionCells?.freshnessBurden?.convertedScore],
    [left?.dimensionCells?.incumbentPressure?.convertedScore, right?.dimensionCells?.incumbentPressure?.convertedScore],
  ];
  for (const [leftValue, rightValue] of fields) {
    const difference = Number(rightValue ?? 0) - Number(leftValue ?? 0);
    if (difference !== 0) return difference;
  }
  return String(left?.strategyId ?? "").localeCompare(String(right?.strategyId ?? ""));
};

const isTerminalReceipt = (receipt) =>
  TERMINAL_CLOSURES.has(receipt?.closure) && typeof receipt?.searchedAt === "string";

const isBuyerProcurementObservation = (observationId, observationById, sourceById) => {
  const observation = observationById.get(observationId);
  const source = sourceById.get(observation?.sourceId);
  return source?.sourceType === "procurement_record"
    || asArray(source?.publisherAffiliations).some((affiliation) => affiliation?.relationship === "buyer");
};

export const evaluateVerticalCandidates = ({ strategies, observations, sources, receipts }) => {
  const candidates = asArray(strategies).filter((strategy) => strategy?.strategyType === "vertical_candidate");
  const observationById = new Map(asArray(observations).map((observation) => [observation?.observationId, observation]));
  const sourceById = new Map(asArray(sources).map((source) => [source?.sourceId, source]));
  const receiptById = new Map(asArray(receipts).map((receipt) => [receipt?.id, receipt]));
  const results = new Map();

  for (const strategy of candidates) {
    const score = computeVerticalScore(strategy);
    const cells = DIMENSIONS.map((dimensionId) => strategy?.dimensionCells?.[dimensionId]);
    const buyerProcurementObservationIds = [...new Set(cells.flatMap((cell) => asArray(cell?.observationIds)))]
      .filter((observationId) => isBuyerProcurementObservation(observationId, observationById, sourceById));
    const allDimensionsPass = cells.every((cell) => Number(cell?.convertedScore) >= 3);
    const auditableReceiptClosureGate = cells.every((cell) =>
      isTerminalReceipt(receiptById.get(cell?.positiveSearchReceiptId))
      && isTerminalReceipt(receiptById.get(cell?.negativeSearchReceiptId)));
    const scoreCellEvidenceGate = cells.every((cell) => cell?.measuredLevel === null
      ? cell?.imputation === "conservative_missing"
        && cell?.convertedScore === 0
        && asArray(cell?.claimIds).length === 0
        && asArray(cell?.observationIds).length === 0
        && typeof cell?.missingReason === "string"
        && cell.missingReason.trim() !== ""
      : asArray(cell?.claimIds).length > 0
        && asArray(cell?.observationIds).length > 0
        && cell?.imputation === null
        && cell?.missingReason === null);
    const qualificationFailures = [];
    if (score < 70) qualificationFailures.push("full_precision_score_below_70");
    if (!allDimensionsPass) qualificationFailures.push("one_or_more_dimensions_below_3");
    if (buyerProcurementObservationIds.length < 2) qualificationFailures.push("fewer_than_two_separate_buyer_or_procurement_observations");
    if (strategy?.rightsBlocker !== false) qualificationFailures.push("rights_blocker");
    if (!scoreCellEvidenceGate) qualificationFailures.push("score_cell_evidence_gate");
    if (!auditableReceiptClosureGate) qualificationFailures.push("auditable_receipt_closure_gate");
    results.set(strategy.strategyId, {
      strategy,
      score,
      buyerProcurementObservationIds,
      allDimensionsPass,
      scoreCellEvidenceGate,
      auditableReceiptClosureGate,
      qualificationFailures,
      baseQualified: qualificationFailures.length === 0,
      decisionStatus: "no_go",
      lead: null,
    });
  }

  const ranked = [...candidates].sort(compareVerticalCandidates);
  const highestQualified = ranked.find((strategy) => results.get(strategy.strategyId)?.baseQualified);
  if (highestQualified) {
    const result = results.get(highestQualified.strategyId);
    const secondHighest = ranked.find((strategy) => strategy.strategyId !== highestQualified.strategyId);
    const lead = secondHighest ? result.score - results.get(secondHighest.strategyId).score : Number.POSITIVE_INFINITY;
    result.lead = lead;
    if (lead >= 10) {
      result.decisionStatus = "winner";
      if (secondHighest) results.get(secondHighest.strategyId).decisionStatus = "runner_up";
    } else {
      result.qualificationFailures.push("winner_lead_below_10");
    }
  }

  return { ranked, results };
};
