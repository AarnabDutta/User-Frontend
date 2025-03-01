'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Share2, Image, Video, Smile, Send, MoreHorizontal, Flag, MessageCircle, Heart, Repeat } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function HomePage() {
  const [newPost, setNewPost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
      content: 'Excited to announce that our team has just completed a major milestone in our blockchain project! 🚀 #blockchain #innovation',
      image: null,
      time: '2h ago',
      likes: 24,
      liked: false,
      comments: 5,
      shares: 2
    },
    {
      id: 2,
      author: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
      content: 'Just published my latest article on Web3 development. Check it out and let me know your thoughts! 📝 #web3 #development',
      image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop',
      time: '4h ago',
      likes: 42,
      liked: false,
      comments: 8,
      shares: 6
    },
    {
      id: 3,
      author: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
      content: 'Attended an amazing conference on AI and blockchain integration today. The future is here! #AI #blockchain #technology',
      image: 'https://images.unsplash.com/photo-1591994843349-f415893b3a6b?q=80&w=2070&auto=format&fit=crop',
      time: '6h ago',
      likes: 67,
      liked: true,
      comments: 12,
      shares: 9
    }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [commentText, setCommentText] = useState('');
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const emojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '💯', '🚀'];

  const handlePostSubmit = () => {
    if (!newPost.trim() && !selectedImage) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPostObj = {
        id: Date.now(),
        author: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
        content: newPost,
        image: selectedImage,
        time: 'Just now',
        likes: 0,
        liked: false,
        comments: 0,
        shares: 0
      };
      
      setPosts([newPostObj, ...posts]);
      setNewPost('');
      setSelectedImage(null);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For demo purposes, we'll use a placeholder image
      setSelectedImage('https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=2070&auto=format&fit=crop');
    }
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: number) => {
    setActiveCommentId(activeCommentId === postId ? null : postId);
    setCommentText('');
  };

  const submitComment = (postId: number) => {
    if (!commentText.trim()) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments + 1
        };
      }
      return post;
    }));
    
    setCommentText('');
    setActiveCommentId(null);
  };

  const addEmoji = (emoji: string) => {
    setNewPost(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Animation for new posts
  useEffect(() => {
    const postElements = document.querySelectorAll('.post-card');
    postElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-slide-up');
      }, index * 100);
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-fade-in">
      <Card className="p-4 mb-6 shadow-md hover-scale transition-all">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="User" />
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="mb-4 resize-none hover-scale focus:border-primary"
              rows={2}
            />
            
            {selectedImage && (
              <div className="relative mb-4">
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={() => setSelectedImage(null)}
                >
                  Remove
                </Button>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleImageClick} className="hover-scale">
                  <Image className="w-4 h-4 mr-2 text-primary" />
                  Photo
                </Button>
                <Button variant="ghost" size="sm" className="hover-scale">
                  <Video className="w-4 h-4 mr-2 text-primary" />
                  Video
                </Button>
                <div className="relative inline-block">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="hover-scale"
                  >
                    <Smile className="w-4 h-4 mr-2 text-primary" />
                    Feeling
                  </Button>
                  
                  {showEmojiPicker && (
                    <div className="absolute top-full left-0 mt-1 bg-card shadow-lg rounded-lg p-2 z-10 grid grid-cols-4 gap-2">
                      {emojis.map(emoji => (
                        <button 
                          key={emoji} 
                          className="text-lg p-2 hover:bg-muted rounded-md transition-colors"
                          onClick={() => addEmoji(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={handlePostSubmit} 
                disabled={isSubmitting || (!newPost.trim() && !selectedImage)}
                className="hover-scale"
              >
                {isSubmitting ? (
                  <span className="animate-spin mr-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                        fill="none"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </span>
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Post
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {posts.map((post) => (
        <Card key={post.id} className="p-4 mb-4 shadow-md post-card hover-scale transition-all">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-10 h-10">
              <img src={post.avatar} alt={post.author} />
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{post.author}</h3>
              <p className="text-sm text-muted-foreground">{post.time}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className="mb-4">{post.content}</p>
          
          {post.image && (
            <div className="mb-4">
              <img 
                src={post.image} 
                alt="Post" 
                className="w-full rounded-lg object-cover max-h-96"
              />
            </div>
          )}
          
          <div className="flex gap-2 mb-4">
            {post.content.split(' ').filter(word => word.startsWith('#')).map((tag, index) => (
              <Badge key={index} variant="secondary" className="hover-scale">
                {tag}
              </Badge>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleLike(post.id)}
              className={post.liked ? "text-red-500" : ""}
            >
              <Heart className={`h-4 w-4 mr-2 ${post.liked ? "fill-current text-red-500" : ""}`} />
              {post.likes}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleComment(post.id)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {post.comments}
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Repeat className="h-4 w-4 mr-2" />
                  {post.shares}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share this post</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <p>Share this post with your followers or on other platforms.</p>
                  <div className="flex gap-2">
                    <Button className="flex-1">Share now</Button>
                    <Button variant="outline" className="flex-1">Copy link</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {activeCommentId === post.id && (
            <div className="mt-4 flex gap-2">
              <Avatar className="w-8 h-8">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="User" />
              </Avatar>
              <div className="flex-1">
                <Input 
                  placeholder="Write a comment..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="mb-2"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveCommentId(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => submitComment(post.id)}
                    disabled={!commentText.trim()}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}