import { useState, useEffect } from 'react';
import api from '../../utils/api';
export default function BlogsManagement() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    api.get('/admin/blogs').then(res => setBlogs(res.data)).catch(console.error);
  }, []);
  return <div><h1 className="text-2xl font-bold mb-4">Blogs</h1><div>{blogs.length} blogs loaded</div></div>;
}
