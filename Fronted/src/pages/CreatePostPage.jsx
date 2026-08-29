import { useNavigate } from "react-router-dom";
import { usePostStore } from "../store/usePostStore.js";
import PostForm from "../components/PostForm.jsx";

function CreatePostPage() {
  const navigate = useNavigate();
  const { createPost, isSavingPost } = usePostStore();

  const handleSubmit = async (payload) => {
    const created = await createPost(payload);
    if (created) navigate(`/posts/${created._id}`);
    return created;
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16">
      <div className="animate-fade-in-up pt-8">
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Create a Post</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Share a university admission, academy course, business, or general post.
        </p>
      </div>

      <div className="card-elevated animate-fade-in-up mt-6 rounded-2xl border border-line bg-panel p-6" style={{ animationDelay: "0.05s" }}>
        <PostForm onSubmit={handleSubmit} isSaving={isSavingPost} submitLabel="Publish Post" />
      </div>
    </div>
  );
}

export default CreatePostPage;
