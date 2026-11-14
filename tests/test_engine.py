import unittest
from fge_rd.engine import digest, gate, run_fixture

def valid():
    evidence = {'field': 'source-bound'}
    return {'SOURCE_ID': 'fixture-001', 'SOURCE_VERSION': '0.1.0', 'PROVENANCE': 'test fixture', 'CONNECTION_ID': 'LB-fixture-001', 'EVIDENCE': evidence, 'VALIDATION_STATE': 'VALIDATED', 'AUTHORITY_STATE': 'AUTHORIZED_FOR_SCOPE', 'CONFLICTS': [], 'VALIDATION_RECEIPT': {'SOURCE_ID': 'fixture-001', 'SOURCE_VERSION': '0.1.0', 'RESULT': 'PASS', 'EVIDENCE_HASH': digest(evidence)}}

class GateTests(unittest.TestCase):
    def test_missing_source_holds(self):
        r=valid(); del r['SOURCE_ID']; self.assertEqual(gate(r)['status'],'HOLD')
    def test_conflict_holds(self):
        r=valid(); r['CONFLICTS']=['identity']; self.assertEqual(gate(r)['status'],'HOLD')
    def test_unapproved_holds(self):
        r=valid(); r['AUTHORITY_STATE']='PROPOSE_ONLY'; self.assertEqual(gate(r)['status'],'HOLD')
    def test_receipt_tamper_holds(self):
        r=valid(); r['EVIDENCE']['field']='tampered'; self.assertEqual(gate(r)['status'],'HOLD')
    def test_valid_fixture_only_candidate(self):
        self.assertEqual(gate(valid())['status'],'INHERIT_CANDIDATE')
    def test_three_generations_and_no_dispatch(self):
        result=run_fixture(valid()); self.assertEqual(len(result['trace']),3); self.assertEqual(result['external_dispatches'],0); self.assertEqual(result['canon_effect'],'NONE'); self.assertEqual(len(result['trace'][0]['stages_executed']),10)
    def test_invalid_generations_rejected(self):
        with self.assertRaises(ValueError): run_fixture(valid(),4)
    def test_hold_does_not_checkpoint(self):
        r=run_fixture({'SOURCE_ID':'x'}); self.assertEqual(r['trace'][0]['checkpoint'],'PENDING_CHECKPOINT')

if __name__=='__main__': unittest.main()
