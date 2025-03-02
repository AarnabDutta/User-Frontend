'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Camera, Edit, Settings } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');

  const userProfile = {
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1470&auto=format&fit=crop',
    stats: {
      posts: 142,
      followers: 1234,
      following: 567
    }
  };

  const posts = [
    {
      id: 1,
      content: 'Excited to announce that our team has just completed a major milestone in our blockchain project! 🚀 #blockchain #innovation',
      time: '2h ago',
      likes: 24,
      comments: 5,
      shares: 2
    },
    {
      id: 2,
      content: 'Just published my latest article on Web3 development. Check it out and let me know your thoughts! 📝 #web3 #development',
      time: '4h ago',
      likes: 42,
      comments: 8,
      shares: 6
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover Photo */}
      <div className="relative h-48 md:h-64 rounded-b-xl overflow-hidden">
        <img
          src={userProfile.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      {/* Profile Info */}
      <div className="px-4">
        <div className="relative -mt-20 mb-4">
          <Avatar className="w-32 h-32 border-4 border-background">
            <img src={userProfile.avatar} alt={userProfile.name} />
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{userProfile.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-6 mb-6">
          <div className="text-center">
            <div className="font-bold">{userProfile.stats.posts}</div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{userProfile.stats.followers}</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{userProfile.stats.following}</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </div>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="w-full justify-start h-12 p-1">
            <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
            <TabsTrigger value="media" className="flex-1">Media</TabsTrigger>
            <TabsTrigger value="likes" className="flex-1">Likes</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-4">
                <p className="mb-4">{post.content}</p>
                <div className="text-sm text-muted-foreground mb-4">{post.time}</div>
                <Separator className="my-4" />
                <div className="flex justify-between">
                  <Button variant="ghost" size="sm">
                    👍 {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    💬 {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    ↗️ {post.shares}
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="media">
            <div className="grid grid-cols-3 gap-4">
              <div className="aspect-square rounded-lg bg-muted" />
              <div className="aspect-square rounded-lg bg-muted" />
              <div className="aspect-square rounded-lg bg-muted" />
            </div>
          </TabsContent>

          <TabsContent value="likes">
            <div className="text-center py-12 text-muted-foreground">
              No liked posts yet
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}