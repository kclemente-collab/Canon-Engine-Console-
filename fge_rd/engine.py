"""FGE recursive development: read-only, fail-closed local proof engine."""
import hashlib
import json
from typing import Any

STAGES = ('DEFINE','DECOMPOSE','ATTRACT','SEARCH','RELATE','SELECT','BUILD','VERIFY','LEARN','CHECKPOINT')
REQUIRED = ('SOURCE_ID','SOURCE_VERSION','PROVENANCE','CONNECTION_ID','VALIDATION_RECEIPT','AUTHORITY_STATE')

def digest(value: Any) -> str:
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':')).encode()).hexdigest()

def gate(record: dict) -> dict:
    missing = [key for key in REQUIRED if not record.get(key)]
    conflicts = record.get('CONFLICTS', [])
    validated = record.get('VALIDATION_STATE') == 'VALIDATED'
    authorized = record.get('AUTHORITY_STATE') == 'AUTHORIZED_FOR_SCOPE'
    receipt = record.get('VALIDATION_RECEIPT')
    receipt_matches = isinstance(receipt, dict) and receipt.get('SOURCE_ID') == record.get('SOURCE_ID') and receipt.get('SOURCE_VERSION') == record.get('SOURCE_VERSION') and receipt.get('RESULT') == 'PASS' and receipt.get('EVIDENCE_HASH') == digest(record.get('EVIDENCE', {}))
    reasons = (['MISSING:'+k for k in missing] + (['CONFLICT'] if conflicts else []) + ([] if validated else ['NOT_VALIDATED']) + ([] if authorized else ['NOT_AUTHORIZED']) + ([] if receipt_matches else ['RECEIPT_UNVERIFIED']))
    return {'status': 'INHERIT_CANDIDATE' if not reasons else 'HOLD', 'reasons': reasons, 'rcpt': bool(not reasons), 'nrcpt': bool(reasons)}

def run_fixture(record: dict, generations: int = 3) -> dict:
    if not 1 <= generations <= 3:
        raise ValueError('generations must be 1..3')
    evaluation = gate(record)
    traces = []
    for number in range(1, generations + 1):
        gen = f'G{number:02}'
        if evaluation['status'] != 'INHERIT_CANDIDATE':
            traces.append({'generation': gen, 'state': 'HOLD', 'stages_executed': [], 'checkpoint': 'PENDING_CHECKPOINT'})
            break
        # Local simulation only. No source writes, canon changes or external dispatch.
        traces.append({'generation': gen, 'state': 'LOCAL_VALIDATED', 'stages_executed': list(STAGES), 'checkpoint': {'GENERATION_ID': gen, 'INPUT_HASH': digest(record), 'OUTPUT_HASH': digest({'generation': gen, 'source': record['SOURCE_ID']}), 'VALIDATION_STATE': 'LOCAL_VALIDATED', 'NEXT_PROOF': 'DIRECTOR_REVIEW'}})
    return {'object_id': 'FGE-RECURSIVE-DEVELOP-001', 'version': '0.1.0', 'authority': 'PROPOSE_ONLY', 'runtime': 'LOCAL_FIXTURE_ONLY', 'gate': evaluation, 'trace': traces, 'canon_effect': 'NONE', 'external_dispatches': 0}

if __name__ == '__main__':
    print(json.dumps(run_fixture({'SOURCE_ID': 'fixture', 'SOURCE_VERSION': '0.1.0'}), indent=2))
