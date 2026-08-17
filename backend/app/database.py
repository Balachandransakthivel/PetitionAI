"""MongoDB database layer with graceful in-memory fallback.

Uses MongoDB when available (USE_MONGODB=true and server reachable),
otherwise falls back to an in-process store so the app always runs.
"""
import threading
from typing import Any

from app.config import settings


class InMemoryDB:
    """Minimal in-memory store mirroring MongoDB collection semantics."""

    def __init__(self) -> None:
        self._data: dict[str, dict[str, Any]] = {}
        self._lock = threading.Lock()

    def insert_one(self, collection: str, doc: dict) -> str:
        with self._lock:
            self._data.setdefault(collection, {})
            doc_id = doc.get("_id") or doc.get("id")
            if not doc_id:
                raise ValueError("Document requires id or _id")
            self._data[collection][doc_id] = doc
            return str(doc_id)

    def find_one(self, collection: str, query: dict) -> dict | None:
        coll = self._data.get(collection, {})
        for doc in coll.values():
            if all(doc.get(k) == v for k, v in query.items()):
                return dict(doc)
        return None

    def find(self, collection: str, query: dict | None = None) -> list[dict]:
        coll = self._data.get(collection, {})
        query = query or {}
        return [dict(d) for d in coll.values() if all(d.get(k) == v for k, v in query.items())]

    def update_one(self, collection: str, query: dict, updates: dict) -> int:
        coll = self._data.get(collection, {})
        matched = 0
        for doc in coll.values():
            if all(doc.get(k) == v for k, v in query.items()):
                doc.update(updates)
                matched += 1
        return matched

    def delete_one(self, collection: str, query: dict) -> int:
        coll = self._data.get(collection, {})
        ids = [d_id for d_id, doc in coll.items() if all(doc.get(k) == v for k, v in query.items())]
        for d_id in ids:
            del coll[d_id]
        return len(ids)


def _connect_mongo() -> Any | None:
    try:
        if not settings.USE_MONGODB:
            return None
        from pymongo import MongoClient
        client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
        client.admin.command("ping")
        return client[settings.MONGODB_URI.rsplit("/", 1)[-1]]
    except Exception as exc:  # pragma: no cover - depends on environment
        print(f"[PetitionAI] MongoDB unavailable, using in-memory store: {exc}")
        return None


class Database:
    def __init__(self) -> None:
        self.mongo = _connect_mongo()
        self.memory = InMemoryDB()

    @property
    def using_mongodb(self) -> bool:
        return self.mongo is not None

    def _coll(self, name: str) -> Any:
        if self.mongo is not None:
            return self.mongo[name]
        return None

    # -- generic helpers -------------------------------------------------------
    def insert(self, collection: str, doc: dict) -> str:
        if self.mongo is not None:
            return str(self._coll(collection).insert_one(doc).inserted_id)
        return self.memory.insert_one(collection, doc)

    def find_one(self, collection: str, query: dict) -> dict | None:
        if self.mongo is not None:
            doc = self._coll(collection).find_one(query)
            return dict(doc) if doc else None
        return self.memory.find_one(collection, query)

    def find(self, collection: str, query: dict | None = None, sort: list | None = None) -> list[dict]:
        if self.mongo is not None:
            cursor = self._coll(collection).find(query or {})
            if sort:
                cursor = cursor.sort(sort)
            return [dict(d) for d in cursor]
        docs = self.memory.find(collection, query)
        if sort:
            key, direction = sort[0]
            reverse = direction == -1
            docs.sort(key=lambda d: d.get(key, ""), reverse=reverse)
        return docs

    def update(self, collection: str, query: dict, updates: dict) -> bool:
        if self.mongo is not None:
            result = self._coll(collection).update_one(query, {"$set": updates})
            return result.modified_count > 0
        return self.memory.update_one(collection, query, updates) > 0

    def delete(self, collection: str, query: dict) -> bool:
        if self.mongo is not None:
            result = self._coll(collection).delete_one(query)
            return result.deleted_count > 0
        return self.memory.delete_one(collection, query) > 0

    def count(self, collection: str, query: dict | None = None) -> int:
        if self.mongo is not None:
            return self._coll(collection).count_documents(query or {})
        return len(self.memory.find(collection, query or {}))


db = Database()