import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArticleFormDialog from "@/components/awareness/ArticleFormDialog";
import ArticleCard from "@/components/awareness/ArticleCard";
import { awarenessArticles, AwarenessArticle } from "@/data/awareness";
import { useToast } from "@/hooks/use-toast";

const SellerAwareness = () => {
  const [articles, setArticles] = useState<AwarenessArticle[]>(awarenessArticles);
  const { toast } = useToast();

  const handleArticleCreated = (article: AwarenessArticle) => {
    setArticles([article, ...articles]);
  };

  const deleteArticle = (articleId: string) => {
    setArticles(articles.filter((a) => a.id !== articleId));
    toast({
      title: "Article Deleted",
      description: "The article has been removed.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Awareness Articles</h1>
            <p className="text-muted-foreground mt-1">Create and manage your educational articles</p>
          </div>
          <ArticleFormDialog onArticleCreated={handleArticleCreated} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} onDelete={deleteArticle} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerAwareness;
