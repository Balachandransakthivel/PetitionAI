from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class StatusUpdateModel(BaseModel):
    status: str
    timestamp: str
    note: str
    updatedBy: str


class SimilarComplaintModel(BaseModel):
    id: str
    title: str
    similarity: float
    status: str


class AIAnalysisModel(BaseModel):
    category: str
    categoryConfidence: float
    department: str
    departmentConfidence: float
    priority: str
    priorityScore: float
    sentiment: str
    sentimentScore: float
    isDuplicate: bool
    duplicateCount: int
    similarComplaints: list[SimilarComplaintModel]
    urgencyLevel: str
    keywords: list[str]
    summaryNote: str


class FeedbackModel(BaseModel):
    rating: int
    comment: str
    submittedAt: str


class ComplaintModel(BaseModel):
    id: str = Field(default_factory=lambda: f"c_{int(datetime.now().timestamp() * 1000)}")
    petitionId: str
    title: str
    description: str
    category: str
    location: str
    district: str
    submittedBy: str
    submittedByName: str
    submittedAt: str = Field(default_factory=lambda: datetime.now().isoformat())
    status: str = "submitted"
    priority: str = "medium"
    assignedDepartment: str
    assignedOfficer: Optional[str] = None
    assignedOfficerName: Optional[str] = None
    officerRemarks: Optional[str] = None
    resolutionDetails: Optional[str] = None
    resolutionProof: Optional[str] = None
    aiAnalysis: Optional[AIAnalysisModel] = None
    statusHistory: list[StatusUpdateModel] = []
    feedback: Optional[FeedbackModel] = None
    images: list[str] = []
    isEscalated: bool = False
    reopenCount: int = 0

    def dict(self, *args, **kwargs):  # type: ignore[override]
        d = super().dict(*args, **kwargs)
        d["_id"] = d.get("id")
        return d


class UserModel(BaseModel):
    id: str
    name: str
    email: str
    role: str
    phone: str
    address: str
    department: Optional[str] = None
    joinedAt: str
    password_hash: str = ""


class NotificationModel(BaseModel):
    id: str
    userId: str
    title: str
    message: str
    type: str
    isRead: bool
    timestamp: str
    petitionId: Optional[str] = None