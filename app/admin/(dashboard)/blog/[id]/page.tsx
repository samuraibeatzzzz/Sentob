import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { getBlogPostByIdAdmin } from "@/lib/admin/queries";
import { updateBlogPostAction } from "@/lib/admin/actions/blog";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPostByIdAdmin(id);

  if (!post) notFound();

  const boundAction = updateBlogPostAction.bind(null, id);

  return (
    <div>
      <Link href="/admin/blog" className="flex items-center gap-1.5 text-sm text-ink-600 hover:text-forest-800">
        <ArrowLeft size={15} /> Blog
      </Link>
      <h1 className="mt-3 font-display text-2xl font-medium text-forest-950">{post.title}</h1>
      <BlogPostForm action={boundAction} defaultValues={post} />
    </div>
  );
}
