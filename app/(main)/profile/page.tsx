'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Camera, Edit } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState({
    name: 'Aarnab Dutta',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    bio: 'Team Lead | Frontend Developer',
    stats: {
      posts: 142,
      followers: 1234,
      following: 567,
      reports: 2
    }
  });

  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userProfile.name,
    bio: userProfile.bio || ''
  });

  interface Like {
    id: string;
    name: string;
    username: string;
    avatar: string;
  }

  interface Comment {
    id: string;
    user: {
      name: string;
      username: string;
      avatar: string;
    };
    content: string;
    timestamp: string;
  }

  const [posts, setPosts] = useState([
    {
      id: 1,
      content: 'Excited to announce that our team has just completed a major milestone in our blockchain project! 🚀 #blockchain #innovation',
      time: '2h ago',
      likes: 24,
      likedBy: [
        {
          id: '1',
          name: 'John Doe',
          username: '@johndoe',
          avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop'
        },
        {
          id: '2',
          name: 'Jane Smith',
          username: '@janesmith',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop'
        },
        // ... more users
      ],
      comments: 5,
      commentsList: [
        {
          id: '1',
          user: {
            name: 'John Doe',
            username: '@johndoe',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop'
          },
          content: 'This is amazing! Congratulations on the milestone! 🎉',
          timestamp: '2h ago'
        },
        // Add more comments as needed
      ],
      shares: 2
    },
    {
      id: 2,
      content: 'Just published my latest article on Web3 development. Check it out and let me know your thoughts! 📝 #web3 #development',
      time: '4h ago',
      likes: 42,
      likedBy: [
        {
          id: '3',
          name: 'Alice Johnson',
          username: '@alicejohnson',
          avatar: 'https://images.unsplash.com/photo-1502767089025-6572583495b9?q=80&w=100&auto=format&fit=crop'
        },
        {
          id: '4',
          name: 'Bob Brown',
          username: '@bobbrown',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100&auto=format&fit=crop'
        },
        // ... more users
      ],
      comments: 8,
      commentsList: [
        {
          id: '1',
          user: {
            name: 'John Doe',
            username: '@johndoe',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop'
          },
          content: 'Great article! Very informative.',
          timestamp: '3h ago'
        },
        // Add more comments as needed
      ],
      shares: 6
    }
  ]);

  const [activeLikesPost, setActiveLikesPost] = useState<number | null>(null);
  const [activeCommentsPost, setActiveCommentsPost] = useState<number | null>(null);
  const [isFriend, setIsFriend] = useState(true); // Add this state

  const handleProfilePhotoUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    // File validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }
  
    try {
      setIsUpdatingPhoto(true);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Here you would typically:
      // 1. Upload the file to your storage
      // 2. Get the uploaded file URL
      // 3. Update the user profile with new photo URL
      // For now, we'll just update the local state
      
      userProfile.avatar = previewUrl;
      toast.success('Profile photo updated successfully');
    } catch (error) {
      toast.error('Failed to update profile photo');
      console.error(error);
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const handleProfileUpdate = () => {
    try {
      // Here you would typically make an API call to update the profile
      setUserProfile(prev => ({
        ...prev,
        name: editForm.name,
        bio: editForm.bio
      }));
      setIsEditDialogOpen(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  const handleLikeClick = (postId: number) => {
    if (!isFriend) {
      toast.error("Only friends can like posts");
      return;
    }
    // Rest of your like handling logic
  };

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
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleProfilePhotoUpdate}
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-2 right-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUpdatingPhoto}
            >
              {isUpdatingPhoto ? (
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold mb-2">{userProfile.name}</h1>
                <p className="text-muted-foreground">{userProfile.bio}</p>
              </div>
              <div className="flex gap-2 justify-center md:justify-start mt-4 md:mt-0">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="shadow-lg hover:shadow-xl transition-all duration-200">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="Enter your name"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="bio" className="text-sm font-medium">
                          Bio
                        </label>
                        <Textarea
                          id="bio"
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          placeholder="Tell us about yourself"
                          className="col-span-3 resize-none"
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleProfileUpdate}
                        disabled={!editForm.name.trim()}
                      >
                        Save changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                {/* Commented out Settings button
                <Button 
                  variant="outline" 
                  size="icon"
                  className="shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                */}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 justify-center md:justify-start mt-6">
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

      {/* Posts Section */}
      <div className="px-4 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Posts</h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <Card 
              key={post.id} 
              className="p-6 hover:shadow-lg transition-all duration-200 bg-background/60 backdrop-blur-sm rounded-xl"
            >
              <p className="mb-4 text-lg text-center">{post.content}</p>
              <div className="text-sm text-muted-foreground text-center">{post.time}</div>
              <Separator className="my-4" />
              <div className="flex justify-between">
                <Dialog open={activeLikesPost === post.id} onOpenChange={(open) => setActiveLikesPost(open ? post.id : null)}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:text-primary rounded-lg"
                      onClick={() => handleLikeClick(post.id)}
                    >
                      👍 {post.likes}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        Liked by {post.likes} people
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] pr-4">
                      <div className="space-y-4 mt-4">
                        {post.likedBy?.map((user) => (
                          <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors">
                            <Avatar className="h-10 w-10">
                              <img src={user.avatar} alt={user.name} className="object-cover" />
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{user.name}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {user.username}
                              </p>
                            </div>
                            {/* <Button
                              variant="outline"
                              size="sm"
                              className="ml-auto"
                            >
                              Follow
                            </Button> */}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
                <Dialog 
                  open={activeCommentsPost === post.id} 
                  onOpenChange={(open) => setActiveCommentsPost(open ? post.id : null)}
                >
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:text-primary rounded-lg">
                      💬 {post.comments}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        Comments ({post.comments})
                      </DialogTitle>
                    </DialogHeader>
                    
                    <ScrollArea className="flex-1 pr-4 -mr-4">
                      <div className="space-y-4">
                        {post.commentsList?.map((comment) => (
                          <div 
                            key={comment.id} 
                            className="flex gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <img src={comment.user.avatar} alt={comment.user.name} className="object-cover" />
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium">{comment.user.name}</span>
                                  <span className="text-sm text-muted-foreground ml-2">
                                    {comment.user.username}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {comment.timestamp}
                                </span>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                      <Input
                        placeholder="Add a comment..."
                        className="flex-1"
                      />
                      <Button size="sm">
                        Post
                      </Button>
                    </div> */}
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="sm" className="hover:text-primary rounded-lg">
                  ↗️ {post.shares}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}