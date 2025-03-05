'use client';

import { useState, useRef, useEffect } from 'react';
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
import { auth } from '@/lib/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { apiRequest } from '@/app/apiconnector/api';

// Define interfaces
interface Reaction {
  id: string;
  user?: {
    name: string;
    username: string;
    avatar: string;
  };
  emoji: string;
  timestamp: string;
}

interface ReactionCounts {
  '👍': number;
  '❤️': number;
  '😆': number;
  '😢': number;
  '😡': number;
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

interface Post {
  id: string | number;
  content: string;
  time: string;
  reactions: number;
  reactionsList: Reaction[];
  reactionCounts: ReactionCounts;
  comments: number;
  commentsList: Comment[];
  shares: number;
}
  
const emojiMap: { [key: string]: keyof ReactionCounts } = {
  'ƒÄë': '👍',
  'ƒöÑ': '❤️',
  'ƒÆ»': '😆',
  'ƒüõ': '😢',
  'ƒÉ£': '😡'
};

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState({
    name: 'Fetching Name..',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    bio: '',
    userId: '',
    stats: {
      posts: 0,
      followers: 0,
      following: 0,
      reports: 0
    }
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeReactionsPost, setActiveReactionsPost] = useState<number | null>(null);
  const [activeCommentsPost, setActiveCommentsPost] = useState<number | null>(null);
  
  const [editForm, setEditForm] = useState({
    name: userProfile.name,
    bio: userProfile.bio || ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update the fetchPosts function where we process the reactions data:
const fetchPosts = async (userId: string) => {
  try {
    const postsResponse = await apiRequest(`posts/user/${userId}`, 'GET');
    
    if (!postsResponse || !Array.isArray(postsResponse)) {
      setPosts([]);
      return;
    }

    const postsWithData = await Promise.all(
      postsResponse.map(async (post) => {
        try {
          const [reactionsResponse, reactionsCount] = await Promise.all([
            apiRequest(`reactions/posts/${post.id}`, 'GET'),
            apiRequest(`reactions/posts/${post.id}/count`, 'GET')
          ]);

          // Initialize reaction counts
          const reactionCounts: ReactionCounts = {
            '👍': 0,
            '❤️': 0,
            '😆': 0,
            '😢': 0,
            '😡': 0
          };

          // Process reactions and count them with emoji mapping
          if (Array.isArray(reactionsResponse)) {
            reactionsResponse.forEach(reaction => {
              const mappedEmoji = emojiMap[reaction.emoji] || '👍';
              reactionCounts[mappedEmoji]++;
            });
          }

          // Format reactions with user data and mapped emojis
          const formattedReactions = Array.isArray(reactionsResponse) 
            ? reactionsResponse.map(reaction => ({
                id: reaction.id,
                user: reaction.user || {
                  name: 'Anonymous',
                  username: 'anonymous',
                  avatar: '/default-avatar.png'
                },
                emoji: emojiMap[reaction.emoji] || '👍', // Map the emoji here
                timestamp: reaction.timestamp
              }))
            : [];

            console.log('Processed reactions:', {
              reactionCounts,
              formattedReactions,
              totalReactions: reactionsCount
            });
          // ... rest of the fetch logic ...

          const [commentsResponse, commentsCount] = await Promise.all([
            apiRequest(`comments/${post.id}`, 'GET'),
            apiRequest(`comments/${post.id}/count`, 'GET')
          ]);

          return {
            ...post,
            reactions: Number(reactionsCount) || 0,
            reactionsList: formattedReactions,
            reactionCounts, // Make sure this is included
            comments: Number(commentsCount) || 0,
            commentsList: Array.isArray(commentsResponse) ? commentsResponse : [],
            shares: post.shares || 0
          };
        } catch (error) {
          console.error(`Error fetching data for post ${post.id}:`, error);
          return {
            ...post,
            reactions: 0,
            reactionsList: [],
            reactionCounts: {
              '👍': 0,
              '❤️': 0,
              '😆': 0,
              '😢': 0,
              '😡': 0
            },
            comments: 0,
            commentsList: [],
            shares: 0
          };
        }
      })
    );

    setPosts(postsWithData);
  } catch (error) {
    console.error('Error fetching posts:', error);
    toast.error('Failed to fetch posts');
    setPosts([]);
  }
};

  // Keep existing fetchReportCounts, fetchPostCounts, fetchFollowerCounts functions
  const fetchReportCounts = async (userId: string) => {
    try {
      const reportCountResponse = await apiRequest(`users/${userId}`, 'GET');
      const reportCount = reportCountResponse.reports || 0;
      const userName = reportCountResponse.username || "Not FOUND";

      setUserProfile(prev => ({
        ...prev,
        name: String(userName),
        stats: {
          ...prev.stats,
          reports: Number(reportCount)
        }
      }));
    } catch (error) {
      console.error('Error fetching report counts:', error);
      toast.error('Failed to fetch report counts');
    }
  };

  const fetchPostCounts = async (userId: string) => {
    try {
      const postCountResponse = await apiRequest(`posts/user/${userId}/count`, 'GET');
      const postCount = postCountResponse || 0;

      setUserProfile(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          posts: Number(postCount)
        }
      }));
    } catch (error) {
      console.error('Error fetching post counts:', error);
      toast.error('Failed to fetch post counts');
    }
  };

  const fetchFollowerCounts = async (userId: string) => {
    try {
      const [followersResponse, followingResponse] = await Promise.all([
        apiRequest(`followers/${userId}/followers/count`, 'GET'),
        apiRequest(`followers/${userId}/following/count`, 'GET')
      ]);

      setUserProfile(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          followers: Number(followersResponse) || 0,
          following: Number(followingResponse) || 0
        }
      }));
    } catch (error) {
      console.error('Error fetching follower counts:', error);
      toast.error('Failed to fetch follower counts');
    }
  };

  // Update handleReaction function
const handleReaction = async (postId: string | number, emoji: string) => {
  const userId = userProfile.userId;
  if (!userId) {
    toast.error('Please log in to react to posts');
    return;
  }

  // Reverse emoji mapping for sending to server
  const reverseEmojiMap: { [key: string]: string } = {
    '👍': 'ƒÄë',
    '❤️': 'ƒöÑ',
    '😆': 'ƒÆ»',
    '😢': 'ƒüõ',
    '😡': 'ƒÉ£'
  };

  try {
    await apiRequest(`reactions/posts/${postId}`, 'POST', {
      userId,
      emoji: reverseEmojiMap[emoji] || 'ƒÄë' // Convert emoji before sending
    });
    
    await fetchPosts(userId);
    toast.success('Reaction added successfully');
  } catch (error) {
    console.error('Error adding reaction:', error);
    toast.error('Failed to add reaction');
  }
};

  // Event Handlers

  const handleProfilePhotoUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUpdatingPhoto(true);
      const previewUrl = URL.createObjectURL(file);
      
      // TODO: Implement actual file upload logic
      setUserProfile(prev => ({
        ...prev,
        avatar: previewUrl
      }));
      
      toast.success('Profile photo updated successfully');
    } catch (error) {
      console.error('Error updating profile photo:', error);
      toast.error('Failed to update profile photo');
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setUserProfile(prev => ({
        ...prev,
        name: editForm.name,
        bio: editForm.bio
      }));
      
      await apiRequest("users/31300000-0000-0000-0000-000000000000", 'PUT', {
        username: editForm.name,
        bio: editForm.bio
      });
      setIsEditDialogOpen(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  // Effects
  useEffect(() => {
    const userId = "31300000-0000-0000-0000-000000000000";
    
    const fetchInitialData = async () => {
      await Promise.all([
        fetchFollowerCounts(userId),
        fetchPostCounts(userId),
        fetchReportCounts(userId),
        fetchPosts(userId)
      ]);
    };

    fetchInitialData();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserProfile(prev => ({
          ...prev,
          name: user.displayName || "User",
          avatar: user.photoURL || prev.avatar,
          userId: user.uid
        }));

        setEditForm(prev => ({
          ...prev,
          name: user.displayName || "User"
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeReactionsPost) {
      fetchPosts(userProfile.userId);
    }
  }, [activeReactionsPost]);

  useEffect(() => {
    if (activeCommentsPost) {
      fetchPosts(userProfile.userId);
    }
  }, [activeCommentsPost]);

  // JSX
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
                <div className="text-2xl font-bold">{userProfile.stats.reports}</div>
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
                <Dialog 
                  open={activeReactionsPost === post.id} 
                  onOpenChange={(open) => setActiveReactionsPost(open ? post.id : null)}
                >
                  <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:text-primary rounded-lg space-x-1"
                  >
                    <div className="flex -space-x-1">
                      {Object.entries(post.reactionCounts)
                        .filter(([_, count]) => count > 0)
                        .map(([emoji]) => (
                          <span key={emoji}>{emoji}</span>
                        ))}
                    </div>
                    <span>{post.reactions}</span>
                  </Button>
                </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        Reactions
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-5 gap-2 p-4 border-b">
                      {[
                        { emoji: '👍', label: 'Like' },
                        { emoji: '❤️', label: 'Love' },
                        { emoji: '😆', label: 'Haha' },
                        { emoji: '😢', label: 'Sad' },
                        { emoji: '😡', label: 'Angry' }
                      ].map(({ emoji, label }) => (
                        <Button
                          key={emoji}
                          variant={post.reactionsList.some(r => r.emoji === emoji) ? "default" : "ghost"}
                          size="sm"
                          className="flex flex-col gap-1 h-auto py-2"
                          onClick={() => handleReaction(post.id, emoji)}
                        >
                          <span className="text-2xl">{emoji}</span>
                          <span className="text-xs">{post.reactionCounts[emoji as keyof ReactionCounts]}</span>
                        </Button>
                      ))}
                    </div>
                    <ScrollArea className="max-h-[60vh] pr-4">
                    <div className="space-y-4 mt-4">
                      {Array.isArray(post.reactionsList) && post.reactionsList.map((reaction) => (
                        <div key={reaction.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors">
                          <Avatar className="h-10 w-10">
                            <img 
                              src={reaction.user?.avatar || '/default-avatar.png'} 
                              alt={reaction.user?.name || 'Anonymous'} 
                              className="object-cover" 
                            />
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {reaction.user?.name || 'Anonymous'}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {reaction.user?.username || 'anonymous'}
                            </p>
                          </div>
                          <span className="text-2xl">{reaction.emoji}</span>
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
                  ↗️
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}