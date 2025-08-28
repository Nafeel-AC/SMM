import React, { createContext, useState, useContext, useEffect } from 'react';

// Sample blog data (replace with actual data or API call)
const sampleBlogs = [
  {
    id: 1,
    title: "10 Tips for Growing Your Instagram Following",
    excerpt: "Learn the top strategies for organic Instagram growth that will help you connect with your target audience. This guide covers everything from content planning to engagement tactics.",
    category: "Instagram",
    author: "Sarah Johnson",
    date: "2023-08-15",
    image: "blog-1.jpg",
    views: 2456
  },
  {
    id: 2,
    title: "How to Create Viral TikTok Content",
    excerpt: "Discover the secrets behind viral TikTok videos and how you can apply these principles to your own content strategy. We analyze successful case studies and provide actionable tips.",
    category: "TikTok",
    author: "Michael Brown",
    date: "2023-08-10",
    image: "blog-2.jpg",
    views: 1823
  },
  {
    id: 3,
    title: "Facebook Ads in 2023: What's Changed",
    excerpt: "Facebook's advertising platform has evolved significantly. Learn about the latest features, targeting options, and best practices to maximize your ROI on Facebook ads.",
    category: "Facebook",
    author: "Jessica Lee",
    date: "2023-07-28",
    image: "blog-3.jpg",
    views: 3210
  },
  {
    id: 4,
    title: "Building Your Brand on LinkedIn",
    excerpt: "LinkedIn is no longer just for job hunting. Learn how to leverage this professional network to build your personal brand and establish industry authority.",
    category: "LinkedIn",
    author: "David Wilson",
    date: "2023-07-22",
    image: "blog-4.jpg",
    views: 1547
  },
  {
    id: 5,
    title: "Twitter Marketing Strategies That Actually Work",
    excerpt: "Cut through the noise on Twitter with these proven marketing strategies. From crafting the perfect tweet to leveraging Twitter Analytics for better results.",
    category: "Twitter",
    author: "Emma Davis",
    date: "2023-07-15",
    image: "blog-5.jpg",
    views: 1982
  },
  {
    id: 6,
    title: "YouTube SEO: Rank Higher in Search Results",
    excerpt: "Improve your YouTube videos' visibility with these SEO tips and tricks. Learn how to optimize titles, descriptions, tags, and more to increase your reach.",
    category: "YouTube",
    author: "Ryan Miller",
    date: "2023-07-05",
    image: "blog-6.jpg",
    views: 2742
  }
];

const BlogContext = createContext();

export const useBlog = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, this would be an API call
    try {
      setBlogs(sampleBlogs);
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(sampleBlogs.map(blog => blog.category))];
      setCategories(uniqueCategories);
      setLoading(false);
    } catch (err) {
      setError('Failed to load blog data');
      setLoading(false);
    }
  }, []);

  return (
    <BlogContext.Provider value={{ 
      blogs, 
      categories, 
      loading, 
      error 
    }}>
      {children}
    </BlogContext.Provider>
  );
};
