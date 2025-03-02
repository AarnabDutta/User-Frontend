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
      following: 567,
      reports: 2
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
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Profile Header */}
      <div className="px-4 pt-8 pb-4 bg-gradient-to-b from-primary/5 to-background rounded-b-3xl">
        <div className="flex flex-col items-center md:flex-row md:items-start md:gap-8">
          {/* Profile Photo */}
          <div className="relative mb-6 md:mb-0">
            <Avatar className="w-40 h-40 border-4 border-background shadow-xl hover:scale-105 transition-transform duration-200">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name}
                className="object-cover"
              />
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-2 right-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-3xl font-bold mb-4 md:mb-0">{userProfile.name}</h1>
              <div className="flex gap-2 justify-center md:justify-start">
                <Button className="shadow-lg hover:shadow-xl transition-all duration-200">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 justify-center md:justify-start">
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold">{userProfile.stats.posts}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold">{userProfile.stats.followers}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold">{userProfile.stats.following}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-destructive">{userProfile.stats.reports}</div>
                <div className="text-sm text-muted-foreground">Reports</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="px-4 mt-6">
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="w-full justify-start h-12 p-1 bg-primary/5 rounded-xl">
            <TabsTrigger value="posts" className="flex-1 rounded-lg">Posts</TabsTrigger>
            <TabsTrigger value="media" className="flex-1 rounded-lg">Media</TabsTrigger>
            <TabsTrigger value="likes" className="flex-1 rounded-lg">Likes</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-6 hover:shadow-lg transition-all duration-200">
                <p className="mb-4 text-lg">{post.content}</p>
                <div className="text-sm text-muted-foreground">{post.time}</div>
                <Separator className="my-4" />
                <div className="flex justify-between">
                  <Button variant="ghost" size="sm" className="hover:text-primary">
                    👍 {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:text-primary">
                    💬 {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:text-primary">
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