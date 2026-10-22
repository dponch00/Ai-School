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
        encoding="utf-8",
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
        self.assertIn("En revisión (OPP-1036)", result.stderr)

    def _run_with(self, **changes: object) -> subprocess.CompletedProcess[str]:
        assumptions = json.loads(ASSUMPTIONS.read_text(encoding="utf-8"))
        for key, value in changes.items():
            if value is None:
                assumptions.pop(key, None)
            else:
                assumptions[key] = value
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "assumptions.json"
            path.write_text(json.dumps(assumptions), encoding="utf-8")
            return run_check("kpis_correct.json", path)

    def test_missing_duplicate_policy_stops_and_names_the_duplicate(self) -> None:
        result = self._run_with(duplicate_policy=None)
        self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
        self.assertIn("duplicate_policy_required", result.stderr)
        self.assertIn("OPP-1012", result.stderr)

    def test_duplicate_policy_changes_visible_figures(self) -> None:
        # Con highest_amount se conserva la fila de 125000: el pipeline del Norte sube y el check
        # contra los KPI calculados con latest_last_activity debe fallar justo ahí.
        result = self._run_with(duplicate_policy="highest_amount")
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("FAIL open_pipeline Norte", result.stdout)
        self.assertIn("PASS open_pipeline Centro", result.stdout)

    def test_dashboard_must_report_every_quality_issue(self) -> None:
        result = run_check("kpis_error_missing_issue.json")
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("FAIL calidad unknown_stage OPP-1036", result.stdout)
        self.assertIn("PASS open_pipeline Norte", result.stdout)

    def test_contract_from_lesson_3_is_required(self) -> None:
        data = json.loads((EXPECTED / "kpis_correct.json").read_text(encoding="utf-8"))
        data.pop("data_quality_issues")
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "kpis.json"
            path.write_text(json.dumps(data), encoding="utf-8")
            result = subprocess.run(
                [sys.executable, str(SCRIPT), "--data-dir", str(ROOT), "--kpis", str(path), "--assumptions", str(ASSUMPTIONS)],
                text=True, encoding="utf-8", capture_output=True, check=False,
            )
        self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
        self.assertIn("falta el campo data_quality_issues", result.stderr)

    def test_monday_snapshot_stops_or_reports_the_new_stage(self) -> None:
        monday = ["--snapshot", "opportunities_snapshot_2026-10-26.csv"]
        base = [sys.executable, str(SCRIPT), "--data-dir", str(ROOT), "--kpis", str(EXPECTED / "kpis_correct.json")]
        assumptions = json.loads(ASSUMPTIONS.read_text(encoding="utf-8"))
        with tempfile.TemporaryDirectory() as temporary:
            strict = Path(temporary) / "strict.json"
            strict.write_text(json.dumps({k: v for k, v in assumptions.items() if k != "unknown_stage_policy"}), encoding="utf-8")
            stopped = subprocess.run(base + ["--assumptions", str(strict)] + monday, text=True, encoding="utf-8", capture_output=True, check=False)
            reported = subprocess.run(base + ["--assumptions", str(ASSUMPTIONS)] + monday, text=True, encoding="utf-8", capture_output=True, check=False)
        self.assertEqual(stopped.returncode, 2, stopped.stdout + stopped.stderr)
        self.assertIn("En pausa (OPP-1040)", stopped.stderr)
        self.assertIn("En revisión (OPP-1036)", stopped.stderr)
        self.assertIn("AVISO etapa sin probabilidad OPP-1040 (En pausa)", reported.stdout)
        self.assertIn("FAIL as_of_date", reported.stdout)  # los KPI del 19 no sirven para el 26

    def test_exclusions_are_reported_not_silent(self) -> None:
        result = run_check("kpis_correct.json")
        self.assertIn("AVISO etapa sin probabilidad OPP-1036", result.stdout)
        self.assertIn("AVISO sin fecha de cierre OPP-1021", result.stdout)
        self.assertIn("AVISO duplicado OPP-1012", result.stdout)


if __name__ == "__main__":
    unittest.main(verbosity=2)
