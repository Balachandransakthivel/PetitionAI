import { useState } from "react";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { useComments } from "@/hooks/useComments";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface CommentSectionProps {
  petitionId: string;
}

const ROLE_COLORS = {
  citizen: "bg-blue-100 text-blue-700 border-blue-200",
  officer: "bg-purple-100 text-purple-700 border-purple-200",
  admin: "bg-amber-100 text-amber-700 border-amber-200",
};

export default function CommentSection({ petitionId }: CommentSectionProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { comments, addComment, deleteComment } = useComments(petitionId);
  const [newComment, setNewComment] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    addComment(newComment, user.id, user.name, user.role);
    setNewComment("");
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-navy-600" />
        <h3 className="font-semibold text-foreground">{t("common.comments")} ({comments.length})</h3>
      </div>

      {/* Comment List */}
      <div className="space-y-3 mb-4">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">{t("common.noResults")}</p>
        )}
        {comments.map(comment => (
          <div
            key={comment.id}
            className={cn(
              "border rounded-lg p-3 transition-all",
              comment.isInternal ? "bg-amber-50 border-amber-200" : "bg-white border-border"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 text-[10px] font-bold">
                  {comment.userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground">{comment.userName}</span>
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-semibold border", ROLE_COLORS[comment.userRole])}>
                  {comment.userRole}
                </span>
                {comment.isInternal && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                    Internal
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {user?.id === comment.userId && (
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
          </div>
        ))}
      </div>

      {/* Add Comment Form */}
      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder={t("common.addComment")}
            className="flex-1 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 transition-all"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="bg-navy-700 hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2.5 transition-all hover:shadow-md active:scale-[0.98] flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}
