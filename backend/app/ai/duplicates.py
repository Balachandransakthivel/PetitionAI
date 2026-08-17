from app.ai.ml_pipeline import classifier


def detect_duplicates(new_text: str, existing_complaints: list[dict], threshold: float = 0.45) -> dict:
    """Return duplicate info comparing new text against existing complaints."""
    similar: list[dict] = []
    for c in existing_complaints:
        comp_text = f"{c.get('title', '')} {c.get('description', '')}"
        sim = classifier.similarity(new_text, comp_text)
        if sim >= threshold:
            similar.append({
                "id": c.get("petitionId") or c.get("id"),
                "title": c.get("title", ""),
                "similarity": round(sim, 2),
                "status": c.get("status", "submitted"),
            })

    similar.sort(key=lambda s: s["similarity"], reverse=True)
    return {
        "isDuplicate": len(similar) > 0,
        "duplicateCount": len(similar),
        "similarComplaints": similar[:3],
    }