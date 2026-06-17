export type User = {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  created_at: string;
  total_videos?: number;
  total_views?: number;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type Video = {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  owner: User;
  category: Category;
  tags: string[];
};

export type VideoList = {
  items: Video[];
  total: number;
  page: number;
  page_size: number;
};

export type WatchResponse = {
  video: Video;
  related: Video[];
};
