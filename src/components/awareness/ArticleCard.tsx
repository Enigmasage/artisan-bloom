import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { AwarenessArticle } from "@/data/awareness";
import { useAuth } from "@/context/AuthContext";

interface ArticleCardProps {
  article: AwarenessArticle;
  onDelete: (articleId: string) => void;
}

const ArticleCard = ({ article, onDelete }: ArticleCardProps) => {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isOwner = user?.id === article.authorId;
  const canEditDelete = isAdmin || isOwner;

  return (
    <Card className="heritage-card overflow-hidden">
      <div className="aspect-video relative">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <Badge className="absolute top-3 left-3">{article.category}</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-display font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{article.publishedAt}</span>
          <span>{article.readTime} min read</span>
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Link to={`/awareness/${article.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1">
              <Eye className="h-3 w-3" />
              View
            </Button>
          </Link>
          {canEditDelete && (
            <>
              <Button variant="outline" size="sm" className="flex-1 gap-1">
                <Edit className="h-3 w-3" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete(article.id)}>
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
