"""Notifications router."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.database import db
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("")
def list_notifications(user: dict = Depends(get_current_user)) -> list[dict]:
    notifs = db.find("notifications", {"userId": user["id"]}, sort=[("timestamp", -1)])
    for n in notifs:
        n.pop("_id", None)
    return notifs


@router.patch("/{notification_id}/read")
def mark_read(notification_id: str, user: dict = Depends(get_current_user)) -> dict:
    notif = db.find_one("notifications", {"id": notification_id, "userId": user["id"]})
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.update("notifications", {"id": notification_id}, {"isRead": True})
    return {"success": True}


class MarkAllRequest(BaseModel):
    pass


@router.patch("/read-all")
def mark_all_read(user: dict = Depends(get_current_user)) -> dict:
    for n in db.find("notifications", {"userId": user["id"]}):
        db.update("notifications", {"id": n["id"]}, {"isRead": True})
    return {"success": True}