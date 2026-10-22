"""Pruebas reproducibles del reconciliador del laboratorio M02."""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SCRIPT = ROOT / "reconcile.py"
EXPECTED = ROOT / "expected"
ASSUMPTIONS = EXPECTED / "assumptions_reference.json"


def run_check(kpis: str, assumptions: Path = ASSUMPTIONS) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [
            sys.executable,
            str(SCRIPT),
            "--data-dir",
            str(ROOT),
            "--kpis",
            str(EXPECTED / kpis),
            "--assumptions",
            str(assumptions),
        ],
        text=True,
        capture_output=True,
        check=False,
    )


class ReconcileTest(unittest.TestCase):
    def test_correct_fixture_passes(self) -> None:
        result = run_check("kpis_correct.json")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("PASS coverage_ratio TOTAL", result.stdout)
        self.assertNotIn("FAIL ", result.stdout)

    def test_duplicate_counted_twice_fails_with_metric_name(self) -> None:
        result = run_check("kpis_error_duplicate.json")
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("FAIL open_pipeline Norte", result.stdout)
        self.assertIn("FAIL weighted_pipeline TOTAL", result.stdout)

    def test_eur_not_converted_fails_with_metric_name(self) -> None:
        result = run_check("kpis_error_eur.json")
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("FAIL open_pipeline Norte", result.stdout)
        self.assertIn("FAIL coverage_ratio TOTAL", result.stdout)

    def test_unknown_stage_without_policy_stops_calculation(self) -> None:
        assumptions = json.loads(ASSUMPTIONS.read_text(encoding="utf-8"))
        assumptions.pop("unknown_stage_policy")
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "assumptions.json"
            path.write_text(json.dumps(assumptions), encoding="utf-8")
            result = run_check("kpis_correct.json", path)
        self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
        self.assertIn("ERROR unknown_stage: En revisión", result.stderr)


if __name__ == "__main__":
    unittest.main(verbosity=2)
