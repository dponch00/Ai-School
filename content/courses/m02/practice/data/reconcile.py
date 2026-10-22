"""Reconciliación determinista del laboratorio M02.

No consulta red ni requiere paquetes externos. Los supuestos que cambian una
cifra se declaran en JSON para que el resultado sea reproducible.
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
from datetime import date
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any


REGIONS = ("Norte", "Centro", "Sur")
CLOSED_STAGES = {"Ganada", "Perdida"}
MONEY_TOLERANCE = Decimal("0.01")
RATIO_TOLERANCE = Decimal("0.0001")


DUPLICATE_POLICIES = ("latest_last_activity", "highest_amount")
SNAPSHOT_DATE = "2026-10-19"
ISSUE_TYPES = ("duplicate_id", "missing_close_date", "unknown_stage")


class ReconciliationError(ValueError):
    """Error de datos o de supuestos que hace insegura la reconciliación."""


def decimal(value: Any, label: str) -> Decimal:
    try:
        return Decimal(str(value))
    except (InvalidOperation, TypeError) as error:
        raise ReconciliationError(f"invalid_number: {label} no es un número válido") from error


def read_csv(path: Path) -> list[dict[str, str]]:
    try:
        with path.open(encoding="utf-8-sig", newline="") as handle:
            return list(csv.DictReader(handle))
    except FileNotFoundError as error:
        raise ReconciliationError(f"missing_file: no existe {path.name}") from error


def read_json(path: Path) -> dict[str, Any]:
    try:
        with path.open(encoding="utf-8") as handle:
            value = json.load(handle)
    except FileNotFoundError as error:
        raise ReconciliationError(f"missing_file: no existe {path.name}") from error
    except json.JSONDecodeError as error:
        raise ReconciliationError(f"invalid_json: {path.name} no es JSON válido ({error.msg})") from error
    if not isinstance(value, dict):
        raise ReconciliationError(f"invalid_json_object: {path.name} debe contener un objeto JSON")
    return value


def q4_2026(value: str) -> bool:
    return "2026-10-01" <= value <= "2026-12-31"


def dedupe_rows(
    rows: list[dict[str, str]], policy: str | None, notices: list[str]
) -> list[dict[str, str]]:
    """Resuelve oportunidades repetidas según la política declarada.

    La política no se supone: si hay duplicados y no se declaró, el cálculo se detiene.
    """
    groups: dict[str, list[dict[str, str]]] = {}
    for row in rows:
        opp_id = row["opp_id"]
        if not opp_id:
            raise ReconciliationError("invalid_opportunity: hay una fila sin opp_id")
        groups.setdefault(opp_id, []).append(row)
    duplicated = sorted(opp_id for opp_id, group in groups.items() if len(group) > 1)
    if duplicated and policy is None:
        raise ReconciliationError(
            "duplicate_policy_required: hay oportunidades repetidas ("
            + ", ".join(duplicated)
            + "). Declara duplicate_policy: "
            + " o ".join(DUPLICATE_POLICIES)
        )
    if policy is not None and policy not in DUPLICATE_POLICIES:
        raise ReconciliationError(
            f"unsupported_duplicate_policy: {policy}. Opciones: " + ", ".join(DUPLICATE_POLICIES)
        )
    kept: list[dict[str, str]] = []
    for opp_id, group in groups.items():
        if len(group) == 1:
            kept.append(group[0])
            continue
        if policy == "latest_last_activity":
            choice = max(group, key=lambda r: r["last_activity_date"])
        else:
            choice = max(group, key=lambda r: decimal(r["amount"], f"amount {opp_id}"))
        notices.append(
            f"AVISO duplicado {opp_id}: {len(group)} filas; se conserva la de "
            f"amount={choice['amount']} y last_activity_date={choice['last_activity_date']} ({policy})"
        )
        kept.append(choice)
    return kept


def duplicated_ids(rows: list[dict[str, str]]) -> set[str]:
    seen: set[str] = set()
    repeated: set[str] = set()
    for row in rows:
        (repeated if row["opp_id"] in seen else seen).add(row["opp_id"])
    return repeated


def load_probabilities(data_dir: Path) -> dict[str, Decimal]:
    return {
        row["stage"]: decimal(row["probability"], f"probability {row['stage']}")
        for row in read_csv(data_dir / "stage_probability.csv")
    }


def load_fx_rates(data_dir: Path) -> dict[str, Decimal]:
    return {
        row["currency"]: decimal(row["usd_per_unit"], f"fx {row['currency']}")
        for row in read_csv(data_dir / "fx_rates.csv")
    }


def load_quota(data_dir: Path) -> dict[str, Decimal]:
    return {
        row["region"]: decimal(row["quota_q4_usd"], f"quota {row['region']}")
        for row in read_csv(data_dir / "quota.csv")
    }


def load_won(data_dir: Path) -> dict[str, Decimal]:
    return {
        row["region"]: decimal(row["won_q4_usd"], f"won {row['region']}")
        for row in read_csv(data_dir / "won_q4.csv")
    }


def calculate(
    data_dir: Path,
    assumptions: dict[str, Any],
    notices: list[str] | None = None,
    issues: set[tuple[str, str]] | None = None,
) -> list[dict[str, str]]:
    notices = [] if notices is None else notices
    issues = set() if issues is None else issues
    currency = assumptions.get("reporting_currency")
    if currency != "USD":
        raise ReconciliationError("unsupported_reporting_currency: la moneda de reporte debe ser USD")

    aliases = assumptions.get("stage_aliases", {})
    if not isinstance(aliases, dict):
        raise ReconciliationError("invalid_stage_aliases: stage_aliases debe ser un objeto")
    unknown_stage_policy = assumptions.get("unknown_stage_policy")
    if unknown_stage_policy not in (None, "exclude_and_report"):
        raise ReconciliationError(
            "unsupported_unknown_stage_policy: la única opción es exclude_and_report"
        )
    if assumptions.get("period") != "2026-Q4":
        raise ReconciliationError("unsupported_period: el periodo debe ser 2026-Q4")

    probabilities = load_probabilities(data_dir)
    fx_rates = load_fx_rates(data_dir)
    quota = load_quota(data_dir)
    won = load_won(data_dir)
    metrics = {
        region: {
            "open_pipeline": Decimal("0"),
            "weighted_pipeline": Decimal("0"),
            "overdue_count": Decimal("0"),
        }
        for region in REGIONS
    }
    raw_rows = read_csv(data_dir / "opportunities_snapshot_2026-10-19.csv")
    issues.update(("duplicate_id", opp_id) for opp_id in duplicated_ids(raw_rows))
    rows = dedupe_rows(raw_rows, assumptions.get("duplicate_policy"), notices)

    for row in rows:
        region = row["region"]
        if region not in metrics:
            raise ReconciliationError(f"unknown_region: región desconocida {region}")
        stage = aliases.get(row["stage"], row["stage"])
        if stage not in probabilities:
            issues.add(("unknown_stage", row["opp_id"]))
            if unknown_stage_policy == "exclude_and_report":
                notices.append(
                    f"AVISO etapa sin probabilidad {row['opp_id']} ({row['stage']}): "
                    "excluida del pipeline por la política declarada"
                )
                continue
            raise ReconciliationError(
                f"unknown_stage: {row['stage']} ({row['opp_id']}) no tiene probabilidad aprobada. "
                "Pide la probabilidad a FP&A o declara unknown_stage_policy: exclude_and_report"
            )
        if row["currency"] not in fx_rates:
            raise ReconciliationError(f"missing_fx_rate: no hay tipo de cambio para {row['currency']}")
        amount_usd = decimal(row["amount"], f"amount {row['opp_id']}") * fx_rates[
            row["currency"]
        ]
        is_open = stage not in CLOSED_STAGES
        close_date = row["expected_close_date"]
        if is_open and not close_date:
            issues.add(("missing_close_date", row["opp_id"]))
            notices.append(
                f"AVISO sin fecha de cierre {row['opp_id']}: no cuenta en el pipeline del T4 ni como vencida"
            )

        if is_open and close_date and close_date < row["snapshot_date"]:
            metrics[region]["overdue_count"] += Decimal("1")
        if is_open and close_date and q4_2026(close_date):
            metrics[region]["open_pipeline"] += amount_usd
            metrics[region]["weighted_pipeline"] += amount_usd * probabilities[stage]

    output: list[dict[str, str]] = []
    for region in REGIONS:
        open_pipeline = metrics[region]["open_pipeline"]
        weighted_pipeline = metrics[region]["weighted_pipeline"]
        remaining_quota = quota[region] - won[region]
        if remaining_quota <= 0:
            raise ReconciliationError(f"invalid_remaining_quota: la cuota restante de {region} no es positiva")
        output.extend(
            (
                kpi("open_pipeline", region, open_pipeline, "USD"),
                kpi("weighted_pipeline", region, weighted_pipeline, "USD"),
                kpi(
                    "coverage_ratio",
                    region,
                    open_pipeline / remaining_quota,
                    "x",
                ),
                kpi("overdue_count", region, metrics[region]["overdue_count"], "count"),
            )
        )

    totals = {
        name: sum((metrics[region][name] for region in REGIONS), Decimal("0"))
        for name in ("open_pipeline", "weighted_pipeline", "overdue_count")
    }
    total_remaining = sum((quota[region] - won[region] for region in REGIONS), Decimal("0"))
    output.extend(
        (
            kpi("open_pipeline", "TOTAL", totals["open_pipeline"], "USD"),
            kpi("weighted_pipeline", "TOTAL", totals["weighted_pipeline"], "USD"),
            kpi("coverage_ratio", "TOTAL", totals["open_pipeline"] / total_remaining, "x"),
            kpi("overdue_count", "TOTAL", totals["overdue_count"], "count"),
        )
    )
    return output


def kpi(kpi_id: str, region: str, value: Decimal, unit: str) -> dict[str, str]:
    return {"kpi_id": kpi_id, "region": region, "value": str(value), "unit": unit}


def tolerance_for(metric: str, requested: Decimal) -> Decimal:
    if requested < 0:
        raise ReconciliationError("invalid_tolerance: la tolerancia no puede ser negativa")
    if metric == "coverage_ratio":
        return min(requested, RATIO_TOLERANCE)
    if metric == "overdue_count":
        return Decimal("0")
    return requested


def compare(
    calculated: list[dict[str, str]], dashboard: dict[str, Any], requested_tolerance: Decimal
) -> tuple[list[str], int]:
    if dashboard.get("schema_version") != "1.0":
        raise ReconciliationError("invalid_kpis_schema_version: se esperaba schema_version 1.0")
    for field in ("as_of_date", "reporting_currency", "kpis", "data_quality_issues", "assumption_ids"):
        if field not in dashboard:
            raise ReconciliationError(f"invalid_kpis: falta el campo {field} del contrato pipeline_kpis v1")
    entries = dashboard.get("kpis")
    if not isinstance(entries, list):
        raise ReconciliationError("invalid_kpis: kpis debe ser una lista")
    lines: list[str] = []
    failed = 0
    if dashboard.get("as_of_date") != SNAPSHOT_DATE:
        lines.append(f"FAIL as_of_date: dashboard={dashboard.get('as_of_date')} esperado={SNAPSHOT_DATE}")
        failed += 1
    if dashboard.get("reporting_currency") != "USD":
        lines.append(f"FAIL reporting_currency: dashboard={dashboard.get('reporting_currency')} esperado=USD")
        failed += 1
    if not isinstance(dashboard.get("assumption_ids"), list) or not dashboard["assumption_ids"]:
        lines.append("FAIL assumption_ids: el dashboard no cita los supuestos que usó")
        failed += 1
    reported = {
        (entry.get("kpi_id"), entry.get("region")): entry
        for entry in entries
        if isinstance(entry, dict)
    }
    for actual in calculated:
        key = (actual["kpi_id"], actual["region"])
        entry = reported.get(key)
        label = f"{actual['kpi_id']} {actual['region']}"
        if entry is None:
            lines.append(f"FAIL {label}: el dashboard no reporta este KPI")
            failed += 1
            continue
        if entry.get("unit") != actual["unit"]:
            lines.append(
                f"FAIL {label}: unidad dashboard={entry.get('unit')} esperada={actual['unit']}"
            )
            failed += 1
            continue
        dashboard_value = decimal(entry.get("value"), f"dashboard {label}")
        actual_value = decimal(actual["value"], f"reconcile {label}")
        difference = dashboard_value - actual_value
        tolerance = tolerance_for(actual["kpi_id"], requested_tolerance)
        if abs(difference) <= tolerance:
            lines.append(
                f"PASS {label}: dashboard={dashboard_value} esperado={actual_value}"
            )
        else:
            lines.append(
                f"FAIL {label}: dashboard={dashboard_value} esperado={actual_value} "
                f"diferencia={difference} tolerancia={tolerance}"
            )
            failed += 1
    return lines, failed


def compare_issues(dashboard: dict[str, Any], expected: set[tuple[str, str]]) -> tuple[list[str], int]:
    """El dashboard debe reportar cada problema de calidad de datos, no ocultarlo."""
    entries = dashboard.get("data_quality_issues")
    if not isinstance(entries, list):
        raise ReconciliationError("invalid_kpis: data_quality_issues debe ser una lista")
    reported = {(e.get("issue"), e.get("opp_id")) for e in entries if isinstance(e, dict)}
    lines: list[str] = []
    failed = 0
    for issue, opp_id in sorted(expected):
        if (issue, opp_id) in reported:
            lines.append(f"PASS calidad {issue} {opp_id}: reportado")
        else:
            lines.append(f"FAIL calidad {issue} {opp_id}: el dashboard no lo reporta")
            failed += 1
    for issue, opp_id in sorted(reported - expected):
        if issue not in ISSUE_TYPES:
            lines.append(f"FAIL calidad {issue} {opp_id}: tipo de problema desconocido")
            failed += 1
    return lines, failed


def run(args: argparse.Namespace) -> int:
    data_dir = Path(args.data_dir)
    assumptions = read_json(Path(args.assumptions))
    dashboard = read_json(Path(args.kpis))
    notices: list[str] = []
    issues: set[tuple[str, str]] = set()
    calculated = calculate(data_dir, assumptions, notices, issues)
    lines, failed = compare(calculated, dashboard, decimal(args.tolerance, "tolerance"))
    issue_lines, issue_failed = compare_issues(dashboard, issues)
    failed += issue_failed
    print("\n".join(notices + lines + issue_lines))
    return 1 if failed else 0


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Reconciliación de KPI sintéticos M02")
    parser.add_argument("--data-dir", required=True, help="Carpeta con los CSV")
    parser.add_argument("--kpis", required=True, help="JSON que produjo el dashboard")
    parser.add_argument("--assumptions", required=True, help="JSON de supuestos aprobados")
    parser.add_argument("--tolerance", default="0.01", help="Tolerancia monetaria en USD")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    # Las tildes se ven bien también en la consola de Windows.
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    try:
        return run(parse_args(sys.argv[1:] if argv is None else argv))
    except ReconciliationError as error:
        print(f"ERROR {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
