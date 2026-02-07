import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { PostDetail } from "./pages/PostDetail";
import { PostNew } from "./pages/PostNew";
import { CategoryPage } from "./pages/CategoryPage";
import { AuthorPage } from "./pages/AuthorPage";
import { Categories } from "./pages/Categories";
import { DataPage } from "./pages/DataPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/new" element={<PostNew />} />
        <Route path="/post/:slug" element={<PostDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/author/:id" element={<AuthorPage />} />
        <Route path="/data" element={<DataPage />} />
      </Routes>
    </Layout>
  );
}
