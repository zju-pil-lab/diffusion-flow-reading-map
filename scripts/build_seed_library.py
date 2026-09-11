#!/usr/bin/env python3
"""Build the curated seed library from arXiv's public Atom API.

The taxonomy, reading tier, and Chinese reading notes are editorial data.
Titles, authors, and first-posted dates are read from arXiv metadata.
"""

from __future__ import annotations

import argparse
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "papers.json"
VERIFIED = "2026-09-12"
ATOM = {"a": "http://www.w3.org/2005/Atom"}


CATEGORIES = {
    "foundations": [
        "1503.03585", "1806.07366", "1810.01367", "1907.05600",
        "2006.11239", "2011.13456", "2101.03288",
    ],
    "objectives": [
        "2102.09672", "2107.00630", "2206.00364", "2303.09556",
        "2305.08891", "2310.08337", "2310.17467", "2309.07867",
    ],
    "sampling": [
        "2010.02502", "2202.09778", "2206.00927", "2211.01095",
        "2302.04867", "2308.02157", "2308.07896", "2310.07894",
        "2310.13268", "2305.16317",
    ],
    "guidance": [
        "2105.05233", "2207.12598", "2208.01626", "2208.01618",
        "2208.12242", "2211.09800", "2302.05543", "2302.08453",
        "2308.06721", "2310.13102", "2308.16534",
    ],
    "latent": [
        "2112.10752", "2307.01952", "2306.00637", "2307.08698",
        "2310.19789",
    ],
    "architectures": [
        "2212.09748", "2301.11093", "2310.00426", "2306.09305",
        "2310.04750", "2310.13545", "2403.04692", "2401.08740",
    ],
    "distillation": [
        "2202.00512", "2303.01469", "2310.14189", "2310.04378",
        "2310.02279", "2309.06380", "2311.18828", "2403.12015",
        "2505.13447",
    ],
    "flow": [
        "2210.02747", "2209.03003", "2209.14577", "2303.08797",
        "2302.00482", "2307.03672", "2310.03695", "2310.03725",
        "2403.03206", "2405.20320", "2410.07303", "2412.07517",
        "2507.22270", "2506.05350",
    ],
    "geometry": [
        "2302.03660", "2407.15595", "2312.07168", "2507.15897",
    ],
    "applications": [
        "2009.09761", "2105.06337", "2309.03199", "2111.05826",
        "2201.09865", "2205.11487", "2209.14988", "2203.02923",
        "2210.01776", "2303.04137", "2101.12072", "2107.03502",
        "2411.17196", "2508.18949", "2507.05503", "2512.23278",
        "2601.12950", "2606.11243",
    ],
    "evaluation": [
        "2305.19693", "2305.19947", "2305.14712", "2310.02664",
        "2309.16750",
    ],
    "surveys": [
        "2208.11970", "2308.13142", "2209.00796", "2310.07204",
        "2310.10647", "2412.06264",
    ],
}


ESSENTIAL = {
    "1503.03585": (1, "扩散生成模型的原始起点：从非平衡热力学理解前向加噪与反向生成。"),
    "1907.05600": (2, "建立基于分数估计的生成建模路线，为后续 score-based diffusion 奠定目标函数。"),
    "2006.11239": (3, "现代扩散模型的核心基线；理解噪声预测、变分界与逐步反向采样。"),
    "2010.02502": (4, "把 DDPM 推广为非马尔可夫过程，并引出确定性采样和速度—质量权衡。"),
    "2011.13456": (5, "用 SDE 统一多类扩散过程，并给出反向 SDE 与 probability-flow ODE 两种视角。"),
    "2102.09672": (6, "系统改进噪声日程、方差学习与似然，为可扩展训练提供关键经验。"),
    "2105.05233": (7, "展示 classifier guidance 与强 U-Net 设计怎样把扩散模型推向高质量图像生成。"),
    "2207.12598": (8, "无需外部分类器的条件引导方法，至今仍是条件生成最重要的控制旋钮之一。"),
    "2112.10752": (9, "把扩散过程搬到压缩潜空间，奠定大规模文本到图像系统的基本架构。"),
    "2206.00364": (10, "把网络预条件、噪声分布与采样器拆开分析，建立清晰且实用的设计空间。"),
    "2210.02747": (11, "以回归条件速度场训练连续归一化流，给出 diffusion paths 与 OT paths 的统一入口。"),
    "2209.03003": (12, "通过 rectification 与 reflow 学习更直的传输轨迹，连接 flow matching 与少步生成。"),
}


VENUES = {
    "1503.03585": "ICML 2015",
    "1806.07366": "NeurIPS 2018",
    "1810.01367": "ICLR 2019",
    "1907.05600": "NeurIPS 2019",
    "2006.11239": "NeurIPS 2020",
    "2010.02502": "ICLR 2021",
    "2011.13456": "ICLR 2021",
    "2102.09672": "ICML 2021",
    "2105.05233": "NeurIPS 2021",
    "2107.00630": "NeurIPS 2021",
    "2112.10752": "CVPR 2022",
    "2202.00512": "ICLR 2022",
    "2202.09778": "ICLR 2022",
    "2203.02923": "ICLR 2022",
    "2206.00364": "NeurIPS 2022",
    "2206.00927": "NeurIPS 2022",
    "2210.02747": "ICLR 2023",
    "2209.03003": "ICLR 2023",
    "2211.01095": "NeurIPS 2022",
    "2211.09800": "CVPR 2023",
    "2212.09748": "ICCV 2023",
    "2302.00482": "TMLR 2023",
    "2303.01469": "ICML 2023",
    "2303.04137": "RSS 2023",
    "2307.01952": "ICLR 2024",
    "2309.06380": "ICLR 2024",
    "2310.00426": "ICLR 2024",
    "2310.14189": "ICLR 2024",
    "2405.20320": "NeurIPS 2024",
    "2410.07303": "ICLR 2025",
    "2506.05350": "ICCV 2025",
}


RECOMMENDED = {
    "1806.07366", "1810.01367", "2101.03288", "2107.00630",
    "2202.00512", "2202.09778", "2206.00927", "2211.01095",
    "2212.09748", "2302.00482", "2302.03660", "2302.04867",
    "2302.05543", "2303.01469", "2303.08797", "2307.01952",
    "2307.03672", "2309.03199", "2309.06380", "2310.00426",
    "2310.04378", "2310.14189", "2401.08740", "2403.03206",
    "2407.15595", "2412.06264",
}


FLOW_IDS = set(CATEGORIES["flow"] + CATEGORIES["geometry"]) | {
    "2307.08698", "2309.03199", "2505.13447", "2411.17196",
    "2508.18949", "2507.05503", "2512.23278", "2601.12950",
    "2606.11243", "2401.08740",
}


def all_ids() -> list[str]:
    ids = [paper_id for group in CATEGORIES.values() for paper_id in group]
    if len(ids) != len(set(ids)):
        raise ValueError("A paper appears in more than one primary category")
    return ids


def fetch_xml(ids: list[str]) -> bytes:
    query = urllib.parse.urlencode({"max_results": len(ids), "id_list": ",".join(ids)})
    request = urllib.request.Request(
        f"https://export.arxiv.org/api/query?{query}",
        headers={"User-Agent": "zju-pil-lab-reading-map/1.0"},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def clean(value: str | None) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def parse_documents(documents: list[bytes]) -> dict[str, dict]:
    records: dict[str, dict] = {}
    for document in documents:
        root = ET.fromstring(document)
        for entry in root.findall("a:entry", ATOM):
            versioned_id = clean(entry.findtext("a:id", namespaces=ATOM)).rsplit("/", 1)[-1]
            paper_id = re.sub(r"v\d+$", "", versioned_id)
            records[paper_id] = {
                "title": clean(entry.findtext("a:title", namespaces=ATOM)),
                "authors": [clean(author.findtext("a:name", namespaces=ATOM)) for author in entry.findall("a:author", ATOM)],
                "published": clean(entry.findtext("a:published", namespaces=ATOM))[:10],
            }
    return records


def infer_tags(title: str, category: str) -> list[str]:
    normalized = title.lower()
    tags = [category.replace("architectures", "architecture")]
    rules = [
        ("score", "score matching"), ("stochastic differential", "SDE"),
        ("ordinary differential", "ODE"), ("solver", "solver"),
        ("guidance", "guidance"), ("conditional", "conditional generation"),
        ("latent", "latent space"), ("transformer", "transformer"),
        ("consistency", "consistency"), ("rectified", "rectified flow"),
        ("flow matching", "flow matching"), ("optimal transport", "optimal transport"),
        ("discrete", "discrete data"), ("image", "image generation"),
        ("video", "video"), ("audio", "audio"), ("speech", "speech"),
        ("molecular", "molecules"), ("protein", "protein"),
        ("time series", "time series"), ("policy", "robotics"),
    ]
    for needle, tag in rules:
        if needle in normalized and tag not in tags:
            tags.append(tag)
    return tags[:5]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--xml", action="append", type=Path, default=[])
    args = parser.parse_args()

    ids = all_ids()
    documents = [path.read_bytes() for path in args.xml] or [fetch_xml(ids)]
    metadata = parse_documents(documents)
    missing = [paper_id for paper_id in ids if paper_id not in metadata]
    if missing:
        raise RuntimeError(f"Missing arXiv records: {', '.join(missing)}")

    category_by_id = {
        paper_id: category for category, paper_ids in CATEGORIES.items() for paper_id in paper_ids
    }
    papers = []
    for paper_id in ids:
        record = metadata[paper_id]
        category = category_by_id[paper_id]
        essential = ESSENTIAL.get(paper_id)
        year = int(record["published"][:4])
        if essential:
            tier = "essential"
        elif year >= 2025:
            tier = "frontier"
        elif paper_id in RECOMMENDED:
            tier = "recommended"
        elif category == "surveys" or paper_id in {"2101.03288", "1806.07366", "1810.01367"}:
            tier = "context"
        else:
            tier = "recommended"

        sources = ["arxiv-primary"]
        sources.append("awesome-flow-matching" if paper_id in FLOW_IDS else "awesome-diffusion-models")
        if paper_id in ESSENTIAL:
            sources.append("essential-path")

        papers.append({
            "id": f"arxiv-{paper_id.replace('.', '-')}",
            "arxivId": paper_id,
            "title": record["title"],
            "authors": record["authors"],
            "year": year,
            "published": record["published"],
            "venue": VENUES.get(paper_id, "arXiv"),
            "url": f"https://arxiv.org/abs/{paper_id}",
            "category": category,
            "tags": infer_tags(record["title"], category),
            "tier": tier,
            "essentialOrder": essential[0] if essential else None,
            "whyReadZh": essential[1] if essential else None,
            "sourceCollections": sources,
            "lastVerified": VERIFIED,
        })

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(papers, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(papers)} papers to {OUTPUT}")


if __name__ == "__main__":
    main()
