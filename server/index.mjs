import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.API_PORT || 3001);
const users = {
  'user-admin-1': { id: 'user-admin-1', name: 'Sarah Connor', email: 'sarah.connor@enterprise.io', role: 'ADMIN', company: 'Enterprise' },
  'user-client-1': { id: 'user-client-1', name: 'Alex Morgan', email: 'alex.morgan@fintechcorp.com', role: 'CLIENT', company: 'FinTech Global Systems' },
  'user-agent-1': { id: 'user-agent-1', name: 'David Kim', email: 'david.kim@enterprise.io', role: 'AGENT', company: 'Enterprise' },
};

const requests = [
  {
    id: 'req-101', ticketNumber: 'SLA-8941', title: 'Critical: Production database connection pool exhaustion',
    description: 'Backend services are experiencing timeouts connecting to the primary database cluster.',
    category: 'Database Outage', department: 'IT Infrastructure', priority: 'P1_CRITICAL', status: 'IN_PROGRESS',
    requesterId: 'user-client-1', requesterName: 'Alex Morgan', requesterEmail: users['user-client-1'].email, requesterCompany: users['user-client-1'].company,
    assigneeId: 'user-agent-1', assigneeName: 'David Kim', assigneeEmail: users['user-agent-1'].email,
    createdAt: new Date(Date.now() - 90 * 60_000).toISOString(), updatedAt: new Date().toISOString(),
    responseDueAt: new Date(Date.now() - 60 * 60_000).toISOString(), resolutionDueAt: new Date(Date.now() + 25 * 60_000).toISOString(),
    slaTier: 'PLATINUM', riskScore: 82, riskLevel: 'CRITICAL', riskTrend: 'increasing',
    riskExplanation: 'Imminent breach: the incident is close to its resolution deadline and needs immediate attention.',
    riskFactors: [], recommendedActions: [], complexityScore: 9, sentimentUrgency: 'critical',
    tags: ['Database', 'P1', 'Outage'], timeline: [],
  },
  {
    id: 'req-102', ticketNumber: 'SLA-8942', title: 'Kubernetes ingress 502 errors during canary rollout',
    description: 'Ingress traffic to auth-service intermittently returns 502 during deployment.',
    category: 'Cloud Deployment', department: 'DevOps & Cloud', priority: 'P2_HIGH', status: 'TRIAGED',
    requesterId: 'user-client-1', requesterName: 'Alex Morgan', requesterEmail: users['user-client-1'].email, requesterCompany: users['user-client-1'].company,
    assigneeId: 'user-agent-1', assigneeName: 'David Kim', assigneeEmail: users['user-agent-1'].email,
    createdAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString(), updatedAt: new Date().toISOString(),
    responseDueAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString(), resolutionDueAt: new Date(Date.now() + 3 * 60 * 60_000).toISOString(),
    slaTier: 'GOLD', riskScore: 64, riskLevel: 'HIGH', riskTrend: 'stable',
    riskExplanation: 'High risk: canary rollback verification is still pending.', riskFactors: [], recommendedActions: [],
    complexityScore: 7, sentimentUrgency: 'high', tags: ['Kubernetes', 'DevOps'], timeline: [],
  },
];

const policies = [
  { id: 'sla-plat-01', name: 'Platinum Tier', tier: 'PLATINUM', description: 'Mission critical coverage', businessHours: '24x7', breachPenaltyEnabled: true, breachPenaltyPerMinuteUsd: 150, isDefault: true, targets: [] },
  { id: 'sla-gold-02', name: 'Gold Tier', tier: 'GOLD', description: 'Standard enterprise coverage', businessHours: '24x7', breachPenaltyEnabled: true, breachPenaltyPerMinuteUsd: 50, isDefault: false, targets: [] },
  { id: 'sla-silver-03', name: 'Silver Tier', tier: 'SILVER', description: 'Growth coverage', businessHours: '9-to-5', breachPenaltyEnabled: false, breachPenaltyPerMinuteUsd: 0, isDefault: false, targets: [] },
];

function body(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error('Invalid JSON')); } });
  });
}

function actor(req) {
  const id = req.headers['x-user-id'];
  return users[id] || users['user-admin-1'];
}

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

const api = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-User-Id' }); return res.end(); }
  if (!req.url?.startsWith('/api/')) return send(res, 404, { error: 'Not found' });
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const user = actor(req);
    if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, { ok: true, service: 'sla-ai-api', storage: 'in-memory' });
    if (req.method === 'GET' && url.pathname === '/api/requests') {
      const visible = user.role === 'ADMIN' || user.role === 'AGENT'
        ? requests
        : requests.filter(item => item.requesterId === user.id || item.requesterCompany === user.company);
      return send(res, 200, visible);
    }
    if (req.method === 'POST' && url.pathname === '/api/requests') {
      const input = await body(req);
      const now = new Date().toISOString();
      const created = { ...input, id: `req-${randomUUID().slice(0, 8)}`, ticketNumber: `SLA-${Math.floor(1000 + Math.random() * 9000)}`, requesterId: user.id, requesterName: user.name, requesterEmail: user.email, requesterCompany: user.company, status: 'SUBMITTED', createdAt: now, updatedAt: now, responseDueAt: new Date(Date.now() + 60 * 60_000).toISOString(), resolutionDueAt: new Date(Date.now() + 24 * 60 * 60_000).toISOString(), riskScore: input.riskScore || 20, riskLevel: 'LOW', riskTrend: 'stable', riskFactors: [], recommendedActions: [], timeline: [] };
      requests.unshift(created);
      return send(res, 201, created);
    }
    const requestMatch = url.pathname.match(/^\/api\/requests\/([^/]+)$/);
    if (req.method === 'GET' && requestMatch) {
      const found = requests.find(item => item.id === requestMatch[1]);
      if (!found) return send(res, 404, { error: 'Request not found' });
      if (user.role === 'CLIENT' && found.requesterId !== user.id && found.requesterCompany !== user.company) return send(res, 403, { error: 'Forbidden' });
      return send(res, 200, found);
    }
    if (req.method === 'PATCH' && requestMatch) {
      if (!['ADMIN', 'AGENT'].includes(user.role)) return send(res, 403, { error: 'Operator role required' });
      const found = requests.find(item => item.id === requestMatch[1]);
      if (!found) return send(res, 404, { error: 'Request not found' });
      Object.assign(found, await body(req), { updatedAt: new Date().toISOString() });
      return send(res, 200, found);
    }
    if (req.method === 'GET' && url.pathname === '/api/policies') return send(res, 200, policies);
    if (req.method === 'PUT' && url.pathname.startsWith('/api/policies/')) {
      if (user.role !== 'ADMIN') return send(res, 403, { error: 'Admin role required' });
      const found = policies.find(item => item.id === url.pathname.split('/').pop());
      if (!found) return send(res, 404, { error: 'Policy not found' });
      Object.assign(found, await body(req));
      return send(res, 200, found);
    }
    return send(res, 404, { error: 'Endpoint not found' });
  } catch (error) { return send(res, 400, { error: error.message }); }
});

api.listen(PORT, '0.0.0.0', () => console.log(`SLA AI API listening on ${PORT} (in-memory storage)`));