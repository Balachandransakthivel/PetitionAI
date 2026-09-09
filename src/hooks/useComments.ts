import { useState, useCallback } from "react";
import { Comment } from "@/types/comment";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "petitionai_comments";

function loadComments(): Comment[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveComments(comments: Comment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

export function useComments(petitionId?: string) {
  const [comments, setComments] = useState<Comment[]>(() => {
    const all = loadComments();
    return petitionId ? all.filter(c => c.petitionId === petitionId) : all;
  });

  const addComment = useCallback(
    (content: string, userId: string, userName: string, userRole: Comment["userRole"], isInternal = false) => {
      if (!petitionId || !content.trim()) return;
      const newComment: Comment = {
        id: uuidv4(),
        petitionId,
        userId,
        userName,
        userRole,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        isInternal,
      };
      const all = loadComments();
      all.push(newComment);
      saveComments(all);
      setComments(prev => [...prev, newComment]);
      return newComment;
    },
    [petitionId]
  );

  const deleteComment = useCallback((commentId: string) => {
    const all = loadComments();
    const updated = all.filter(c => c.id !== commentId);
    saveComments(updated);
    setComments(prev => prev.filter(c => c.id !== commentId));
  }, []);

  return { comments, addComment, deleteComment };
}
