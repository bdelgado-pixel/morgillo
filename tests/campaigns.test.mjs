import test from 'node:test';
import assert from 'node:assert/strict';
import { isCampaignActive, campaignKey } from '../lib/campaigns.ts';
const campaign = { id: 'test', active: true, start: '2026-10-01T09:00:00-05:00', end: '2026-10-01T18:00:00-05:00' };
test('campaign visibility respects inclusive boundaries and Peru offset', () => {
 assert.equal(isCampaignActive(campaign, Date.parse('2026-10-01T13:59:59Z')), false);
 assert.equal(isCampaignActive(campaign, Date.parse('2026-10-01T14:00:00Z')), true);
 assert.equal(isCampaignActive(campaign, Date.parse('2026-10-01T23:00:00Z')), true);
 assert.equal(isCampaignActive(campaign, Date.parse('2026-10-01T23:00:01Z')), false);
});
test('inactive, invalid, and reversed dates never publish', () => {
 const now = Date.parse('2026-10-01T15:00:00Z');
 assert.equal(isCampaignActive({...campaign, active:false}, now), false);
 assert.equal(isCampaignActive({...campaign, start:'invalid'}, now), false);
 assert.equal(isCampaignActive({...campaign, start:campaign.end, end:campaign.start}, now), false);
});
test('rescheduling has independent session visibility', () => {
 assert.notEqual(campaignKey(campaign), campaignKey({...campaign,start:'2026-10-02T09:00:00-05:00'}));
});
