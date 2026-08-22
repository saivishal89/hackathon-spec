import { Priority, RiskFactor, RiskLevel, RecommendedAction, Department } from '../types/request';
import { User } from '../types/user';

export interface PreTriageEstimate {
  suggestedPriority: Priority;
  estimatedResolutionHours: number;
  complexityScore: number;
  sentimentUrgency: 'low' | 'moderate' | 'high' | 'critical';
  predictedBreachRisk: number;
  detectedKeywords: string[];
  suggestedDepartment: Department;
}

/**
 * Analyzes request text to provide real-time AI pre-triage predictions
 */
export function analyzeRequestText(
  title: string,
  description: string,
  category: string
): PreTriageEstimate {
  const combined = `${title} ${description} ${category}`.toLowerCase();

  // High urgency keywords
  const criticalKeywords = ['outage', 'down', 'production', 'data loss', 'security breach', 'vulnerability', 'p0', 'blocked all users', 'crash'];
  const highKeywords = ['urgent', 'error', 'failed', 'timeout', 'database', 'slow', 'cannot deploy', 'billing error', 'payment', 'revenue'];
  const mediumKeywords = ['bug', 'issue', 'glitch', 'feature', 'configuration', 'upgrade', 'access', 'permission', 'sync'];

  const foundCritical = criticalKeywords.filter(k => combined.includes(k));
  const foundHigh = highKeywords.filter(k => combined.includes(k));
  const foundMedium = mediumKeywords.filter(k => combined.includes(k));

  let suggestedPriority: Priority = 'P3_MEDIUM';
  let sentimentUrgency: 'low' | 'moderate' | 'high' | 'critical' = 'moderate';
  let complexityScore = 5;
  let estimatedResolutionHours = 8;
  let predictedBreachRisk = 22;

  if (foundCritical.length > 0) {
    suggestedPriority = 'P1_CRITICAL';
    sentimentUrgency = 'critical';
    complexityScore = Math.min(10, 7 + foundCritical.length);
    estimatedResolutionHours = 2;
    predictedBreachRisk = 68;
  } else if (foundHigh.length > 0 || combined.length > 400) {
    suggestedPriority = 'P2_HIGH';
    sentimentUrgency = 'high';
    complexityScore = Math.min(8, 5 + foundHigh.length);
    estimatedResolutionHours = 5;
    predictedBreachRisk = 44;
  } else if (foundMedium.length > 0) {
    suggestedPriority = 'P3_MEDIUM';
    sentimentUrgency = 'moderate';
    complexityScore = 4;
    estimatedResolutionHours = 12;
    predictedBreachRisk = 18;
  } else {
    suggestedPriority = 'P4_LOW';
    sentimentUrgency = 'low';
    complexityScore = 2;
    estimatedResolutionHours = 24;
    predictedBreachRisk = 8;
  }

  // Department heuristic
  let suggestedDepartment: Department = 'IT Infrastructure';
  if (combined.includes('deploy') || combined.includes('k8s') || combined.includes('cloud') || combined.includes('aws') || combined.includes('pipeline')) {
    suggestedDepartment = 'DevOps & Cloud';
  } else if (combined.includes('security') || combined.includes('vulnerability') || combined.includes('auth') || combined.includes('cert') || combined.includes('compliance')) {
    suggestedDepartment = 'Cybersecurity';
  } else if (combined.includes('invoice') || combined.includes('refund') || combined.includes('credit card') || combined.includes('billing') || combined.includes('subscription')) {
    suggestedDepartment = 'Billing & Finance';
  } else if (combined.includes('api') || combined.includes('backend') || combined.includes('frontend') || combined.includes('database') || combined.includes('code')) {
    suggestedDepartment = 'Core Engineering';
  } else if (combined.includes('account') || combined.includes('onboarding') || combined.includes('client') || combined.includes('user')) {
    suggestedDepartment = 'Customer Operations';
  }

  const detectedKeywords = Array.from(new Set([...foundCritical, ...foundHigh, ...foundMedium])).slice(0, 6);

  return {
    suggestedPriority,
    estimatedResolutionHours,
    complexityScore,
    sentimentUrgency,
    predictedBreachRisk,
    detectedKeywords,
    suggestedDepartment,
  };
}

/**
 * Calculates dynamic multi-factor risk score and explanations
 */
export function calculateDynamicRisk(
  elapsedPercentage: number,
  complexityScore: number,
  assignee?: User,
  coAssigneeCount: number = 0
): {
  riskScore: number;
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  riskExplanation: string;
} {
  // Factor 1: Time Elapsed vs Target SLA (Weight: 40%)
  let timeFactorScore = 0;
  if (elapsedPercentage >= 100) timeFactorScore = 100;
  else if (elapsedPercentage >= 80) timeFactorScore = 90;
  else if (elapsedPercentage >= 60) timeFactorScore = 65;
  else if (elapsedPercentage >= 40) timeFactorScore = 35;
  else timeFactorScore = 15;

  // Factor 2: Assignee Load & Bandwidth (Weight: 25%)
  let workloadScore = 30;
  let workloadDesc = 'Assignee workload is within normal operating capacity.';
  if (!assignee) {
    workloadScore = 80;
    workloadDesc = 'Unassigned ticket: Queue idle time increases breach probability.';
  } else {
    const active = assignee.activeTicketsCount || 0;
    const max = assignee.maxCapacity || 5;
    const ratio = active / max;
    if (ratio > 1.2) {
      workloadScore = 95;
      workloadDesc = `${assignee.name} is currently overloaded (${active}/${max} active tickets, ${Math.round(ratio * 100)}% capacity).`;
    } else if (ratio >= 0.8) {
      workloadScore = 65;
      workloadDesc = `${assignee.name} is near peak capacity (${active}/${max} tickets).`;
    } else {
      workloadScore = 20;
      workloadDesc = `${assignee.name} has healthy bandwidth (${active}/${max} tickets).`;
    }
  }

  // Factor 3: Complexity & Dependencies (Weight: 20%)
  const complexityWeight = (complexityScore / 10) * 100;

  // Factor 4: Collaboration Relief (Weight: 15%)
  const collaborationScore = coAssigneeCount > 0 ? 20 : 60;

  // Composite Risk Score (0 - 100)
  const compositeScore = Math.min(
    99,
    Math.max(
      5,
      Math.round(
        timeFactorScore * 0.40 +
        workloadScore * 0.25 +
        complexityWeight * 0.20 +
        collaborationScore * 0.15
      )
    )
  );

  let riskLevel: RiskLevel = 'LOW';
  if (compositeScore >= 80) riskLevel = 'CRITICAL';
  else if (compositeScore >= 60) riskLevel = 'HIGH';
  else if (compositeScore >= 35) riskLevel = 'MEDIUM';
  else riskLevel = 'LOW';

  const riskFactors: RiskFactor[] = [
    {
      id: 'rf-time',
      label: 'SLA Elapsed Window',
      weight: 0.40,
      impact: timeFactorScore > 75 ? 'critical' : timeFactorScore > 50 ? 'high' : 'medium',
      description: `${elapsedPercentage}% of total resolution SLA has elapsed.`,
      mitigationTip: 'Accelerate testing and deployment phase.'
    },
    {
      id: 'rf-workload',
      label: 'Agent Workload & Capacity',
      weight: 0.25,
      impact: workloadScore > 75 ? 'critical' : workloadScore > 50 ? 'high' : 'low',
      description: workloadDesc,
      mitigationTip: 'Reassign or add a secondary co-assignee to redistribute load.'
    },
    {
      id: 'rf-complexity',
      label: 'Technical Complexity',
      weight: 0.20,
      impact: complexityWeight > 70 ? 'high' : 'medium',
      description: `Complexity assessed at Level ${complexityScore}/10 based on system architecture touchpoints.`,
      mitigationTip: 'Engage domain subject matter expert.'
    },
    {
      id: 'rf-collab',
      label: 'Resource Allocation',
      weight: 0.15,
      impact: coAssigneeCount === 0 && compositeScore > 60 ? 'high' : 'low',
      description: coAssigneeCount > 0 
        ? `${coAssigneeCount} co-assignee(s) actively assisting.` 
        : 'Single engineer assigned with no active backup.',
      mitigationTip: 'Attach an additional engineer from available queue.'
    }
  ];

  let riskExplanation = '';
  if (riskLevel === 'CRITICAL') {
    riskExplanation = `Imminent SLA Breach Warning: ${elapsedPercentage}% of SLA elapsed while ${workloadDesc.toLowerCase()} Immediate escalation is recommended.`;
  } else if (riskLevel === 'HIGH') {
    riskExplanation = `Elevated Breach Probability: Ticket is outpacing standard resolution benchmarks due to high complexity and engineer queue density.`;
  } else if (riskLevel === 'MEDIUM') {
    riskExplanation = `Moderate Risk: SLA progress is currently viable but requires active monitoring as it approaches the warning threshold.`;
  } else {
    riskExplanation = `Healthy Progression: Resolution pace is ahead of schedule with low probability of SLA breach.`;
  }

  return {
    riskScore: compositeScore,
    riskLevel,
    riskFactors,
    riskExplanation,
  };
}
