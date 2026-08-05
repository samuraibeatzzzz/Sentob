import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { createBlogPostAction } from "@/lib/admin/actions/blog";

export default function NewBlogPostPage() {
  return (
    <div>
      <Link href="/admin/blog" className="flex items-center gap-1.5 text-sm text-ink-600 hover:text-forest-800">
        <ArrowLeft size={15} /> Blog
      </Link>
      <h1 className="mt-3 font-display text-2xl font-medium text-forest-950">Yangi maqola</h1>
      <BlogPostForm action={createBlogPostAction} />
    </div>
  );
}
